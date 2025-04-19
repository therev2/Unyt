import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'dart:async';
import 'dart:math';

class EmojiRaceMultiplayerScreen extends StatefulWidget {
  const EmojiRaceMultiplayerScreen({Key? key}) : super(key: key);

  @override
  State<EmojiRaceMultiplayerScreen> createState() => _EmojiRaceMultiplayerScreenState();
}

class _EmojiRaceMultiplayerScreenState extends State<EmojiRaceMultiplayerScreen> {
  static const List<String> emojis = ['🚗', '🏎️', '🚕', '🚓', '🚙', '🛵', '🚜', '🚑'];
  static const int trackLength = 20;
  static const int minPlayers = 2;
  static const int maxPlayers = 6;

  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  String? roomId;
  String? myUid;
  String? myEmoji;
  bool waitingForPlayers = true;
  bool raceStarted = false;
  bool raceFinished = false;
  String? winnerUid;
  List<Map<String, dynamic>> players = [];
  StreamSubscription? roomSub;

  @override
  void initState() {
    super.initState();
    myUid = _auth.currentUser?.uid;
    _joinOrCreateRoom();
  }

  @override
  void dispose() {
    roomSub?.cancel();
    super.dispose();
  }

  Future<void> _joinOrCreateRoom() async {
    // Try to join a waiting room
    final waitingRooms = await _firestore.collection('emoji_race_rooms')
      .where('status', isEqualTo: 'waiting')
      .get();
    DocumentReference? roomRef;
    Map<String, dynamic>? roomData;
    if (waitingRooms.docs.isNotEmpty) {
      // Try to join a room with space
      for (var doc in waitingRooms.docs) {
        final data = doc.data();
        List players = data['players'] ?? [];
        if (players.length < maxPlayers) {
          roomRef = doc.reference;
          roomData = data;
          break;
        }
      }
    }
    if (roomRef == null) {
      // Create a new room
      final emoji = (List<String>.from(emojis)..shuffle()).first;
      final user = _auth.currentUser;
      final newRoom = await _firestore.collection('emoji_race_rooms').add({
        'players': [
          {
            'uid': user?.uid,
            'displayName': user?.displayName ?? 'Player',
            'emoji': emoji,
            'position': 0,
          }
        ],
        'status': 'waiting',
        'winnerUid': null,
      });
      setState(() {
        roomId = newRoom.id;
        myEmoji = emoji;
        waitingForPlayers = true;
      });
      _listenToRoom(newRoom.id);
      return;
    }
    // Join the found room
    final user = _auth.currentUser;
    List playersList = List<Map<String, dynamic>>.from(roomData!['players'] ?? []);
    // Ensure no duplicate join
    if (!playersList.any((p) => p['uid'] == user?.uid)) {
      // Pick random unused emoji
      final usedEmojis = playersList.map((p) => p['emoji']).toSet();
      final available = emojis.where((e) => !usedEmojis.contains(e)).toList();
      final emoji = (List<String>.from(available)..shuffle()).isNotEmpty ? available.first : emojis[Random().nextInt(emojis.length)];
      playersList.add({
        'uid': user?.uid,
        'displayName': user?.displayName ?? 'Player',
        'emoji': emoji,
        'position': 0,
      });
      await roomRef.update({'players': playersList});
      setState(() {
        myEmoji = emoji;
      });
    } else {
      final me = playersList.firstWhere((p) => p['uid'] == user?.uid);
      setState(() {
        myEmoji = me['emoji'];
      });
    }
    setState(() {
      roomId = roomRef!.id;
      waitingForPlayers = true;
    });
    _listenToRoom(roomRef.id);
  }

  void _listenToRoom(String id) {
    roomSub?.cancel();
    roomSub = _firestore.collection('emoji_race_rooms').doc(id).snapshots().listen((snap) async {
      if (!snap.exists) return;
      final data = snap.data()!;
      final plist = List<Map<String, dynamic>>.from(data['players'] ?? []);
      final status = data['status'];
      // Auto-start race if enough players and not already started
      if (status == 'waiting' && plist.length >= minPlayers) {
        await _firestore.collection('emoji_race_rooms').doc(id).update({'status': 'playing'});
      }
      setState(() {
        players = plist;
        raceStarted = data['status'] == 'playing';
        raceFinished = data['status'] == 'finished';
        winnerUid = data['winnerUid'];
        waitingForPlayers = data['status'] == 'waiting';
      });
    });
  }

  Future<void> _startRace() async {
    if (roomId == null) return;
    await _firestore.collection('emoji_race_rooms').doc(roomId).update({'status': 'playing'});
  }

  Future<void> _move() async {
    if (roomId == null || !raceStarted || raceFinished) return;
    final idx = players.indexWhere((p) => p['uid'] == myUid);
    if (idx == -1) return;
    final myPlayer = players[idx];
    int newPos = (myPlayer['position'] ?? 0) + 1;
    if (newPos >= trackLength) {
      newPos = trackLength;
      // Finish race
      await _firestore.collection('emoji_race_rooms').doc(roomId).update({
        'players': players.map((p) => p['uid'] == myUid ? {...p, 'position': newPos} : p).toList(),
        'status': 'finished',
        'winnerUid': myUid,
      });
    } else {
      await _firestore.collection('emoji_race_rooms').doc(roomId).update({
        'players': players.map((p) => p['uid'] == myUid ? {...p, 'position': newPos} : p).toList(),
      });
    }
  }

  Widget _buildWaiting() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const CircularProgressIndicator(),
          const SizedBox(height: 16),
          Text('Waiting for players... (${players.length}/$minPlayers)'),
          const SizedBox(height: 8),
          Text('Share this room and wait for at least $minPlayers players.'),
        ],
      ),
    );
  }

  Widget _buildRace() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (raceFinished)
          Text(
            winnerUid == myUid
                ? '🎉 You win!'
                : 'Winner: ${players.firstWhere((p) => p['uid'] == winnerUid, orElse: () => {'emoji': '❓'})['emoji']}',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
        if (!raceStarted && !raceFinished)
          Text('Get ready!'),
        const SizedBox(height: 16),
        ...players.map((p) {
          return Row(
            children: [
              Text(p['emoji'], style: const TextStyle(fontSize: 32)),
              const SizedBox(width: 8),
              Expanded(
                child: Stack(
                  children: [
                    Container(
                      height: 20,
                      decoration: BoxDecoration(
                        color: Colors.grey[300],
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    AnimatedPositioned(
                      duration: const Duration(milliseconds: 250),
                      left: (p['position'] ?? 0) * 12.0,
                      top: 0,
                      child: Text(p['emoji'], style: const TextStyle(fontSize: 24)),
                    ),
                  ],
                ),
              ),
              if (raceFinished && winnerUid == p['uid'])
                const Padding(
                  padding: EdgeInsets.only(left: 8.0),
                  child: Icon(Icons.emoji_events, color: Colors.amber),
                ),
              if (p['uid'] == myUid)
                const Padding(
                  padding: EdgeInsets.only(left: 8.0),
                  child: Text('(You)', style: TextStyle(fontSize: 12)),
                ),
            ],
          );
        }),
        const SizedBox(height: 32),
        if (!raceStarted && !raceFinished && players.length >= minPlayers)
          ElevatedButton(
            onPressed: _startRace,
            child: const Text('Start Race'),
          ),
        if (raceStarted && !raceFinished)
          ElevatedButton(
            onPressed: _move,
            child: const Text('Move!'),
          ),
        if (raceFinished)
          OutlinedButton(
            onPressed: () {
              // Leave room and join another
              _joinOrCreateRoom();
            },
            child: const Text('Play Again'),
          ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Emoji Race (Multiplayer)')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: roomId == null
            ? const Center(child: CircularProgressIndicator())
            : waitingForPlayers || players.length < minPlayers
                ? _buildWaiting()
                : _buildRace(),
      ),
    );
  }
}
