import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'dart:math';

class DrawingGameScreen extends StatefulWidget {
  const DrawingGameScreen({Key? key}) : super(key: key);

  @override
  State<DrawingGameScreen> createState() => _DrawingGameScreenState();
}

class _DrawingGameScreenState extends State<DrawingGameScreen> {
  String? _roomShortCode;
  String? _roomId;
  bool _waitingForPlayers = false;
  bool _gameStarted = false;
  List<Map<String, dynamic>> _players = [];
  String? _drawerId;
  String? _wordToDraw;
  String? _currentUserId;
  List<Map<String, dynamic>> _chatMessages = [];
  Map<String, int> _scores = {};
  int _round = 1;
  int _maxRounds = 3;
  int _roundTime = 60; // seconds
  List<List<Offset>> _lines = [];
  bool _roundActive = false;
  List<String> _wordList = [
    'apple', 'car', 'dog', 'house', 'tree', 'cat', 'book', 'phone', 'star', 'fish',
    'chair', 'cup', 'shoe', 'ball', 'bottle', 'cloud', 'cake', 'clock', 'key', 'moon',
  ];
  Stopwatch? _roundTimer;
  int _timeLeft = 60;


  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  @override
  void initState() {
    super.initState();
    _currentUserId = _auth.currentUser?.uid;
  }

  @override
  void dispose() {
    if (_roomId != null && !_gameStarted) {
      _firestore.collection('drawing_rooms').doc(_roomId).delete();
    }
    super.dispose();
  }

  Future<String> _generateShortCode(int length) async {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  final rand = Random();
  String code;
  bool exists = true;
  do {
    code = List.generate(length, (_) => chars[rand.nextInt(chars.length)]).join();
    final snap = await _firestore.collection('drawing_rooms').where('shortCode', isEqualTo: code).get();
    exists = snap.docs.isNotEmpty;
  } while (exists);
  return code;
}



  Future<void> _createRoom() async {
    final user = _auth.currentUser;
    if (user == null) return;
    final shortCode = await _generateShortCode(5);
    final roomRef = await _firestore.collection('drawing_rooms').add({
      'players': [
        {
          'uid': user.uid,
          'displayName': user.displayName ?? 'Player',
        }
      ],
      'createdAt': FieldValue.serverTimestamp(),
      'status': 'waiting',
      'drawer': null,
      'word': null,
      'scores': {user.uid: 0},
      'chat': [],
      'shortCode': shortCode,
    });
    setState(() {
      _roomId = roomRef.id;
      _waitingForPlayers = true;
    });
    _listenToRoom();
  }

  Future<void> _joinRoomByCode(String code) async {
    final user = _auth.currentUser;
    if (user == null) return;
    // Try to find by shortCode
    final query = await _firestore.collection('drawing_rooms').where('shortCode', isEqualTo: code.toUpperCase()).get();
    if (query.docs.isEmpty) {
      _showDialog('Room not found');
      return;
    }
    final roomDoc = query.docs.first;
    final roomRef = roomDoc.reference;
    final data = roomDoc.data();
    List<Map<String, dynamic>> players = List<Map<String, dynamic>>.from(data['players'] ?? []);
    if (players.length >= 6) {
      _showDialog('Room is full');
      return;
    }
    bool isNewPlayer = !players.any((p) => p['uid'] == user.uid);
    if (isNewPlayer) {
      players.add({'uid': user.uid, 'displayName': user.displayName ?? 'Player'});
      Map<String, int> scores = Map<String, int>.from(data['scores'] ?? {});
      scores[user.uid] = 0;
      await roomRef.update({'players': players, 'scores': scores});
      // Refresh players list after update
      final updatedSnap = await roomRef.get();
      final updatedData = updatedSnap.data() as Map<String, dynamic>;
      players = List<Map<String, dynamic>>.from(updatedData['players'] ?? []);
    }
    // Start the game if there are at least 2 players and the room is waiting
    if (players.length >= 2 && data['status'] == 'waiting') {
      String drawerId = players[0]['uid'];
      String word = (_wordList..shuffle()).first;
      await roomRef.update({
        'status': 'playing',
        'drawer': drawerId,
        'word': word,
        'drawing': [],
        'round': 1,
        'maxRounds': _maxRounds,
        'timeLeft': _roundTime,
        'roundActive': true,
        'chat': [],
      });
    }
    setState(() {
      _roomId = roomRef.id;
      _waitingForPlayers = true;
    });
    _listenToRoom();
  }

  Future<void> _joinRandomRoom() async {
    final user = _auth.currentUser;
    if (user == null) return;
    final rooms = await _firestore.collection('drawing_rooms')
      .where('status', isEqualTo: 'waiting')
      .limit(10)
      .get();
    if (rooms.docs.isEmpty) {
      await _createRoom();
      return;
    }
    final randomRoom = rooms.docs[Random().nextInt(rooms.docs.length)];
    final roomRef = randomRoom.reference;
    List<Map<String, dynamic>> players = List<Map<String, dynamic>>.from(randomRoom['players'] ?? []);
    if (players.length >= 6) {
      await _createRoom();
      return;
    }
    bool isNewPlayer = !players.any((p) => p['uid'] == user.uid);
    if (isNewPlayer) {
      players.add({'uid': user.uid, 'displayName': user.displayName ?? 'Player'});
      Map<String, int> scores = Map<String, int>.from(randomRoom['scores'] ?? {});
      scores[user.uid] = 0;
      await roomRef.update({'players': players, 'scores': scores});
      // Refresh players list after update
      final updatedSnap = await roomRef.get();
      players = List<Map<String, dynamic>>.from(updatedSnap['players'] ?? []);
    }
    // Start the game if there are at least 2 players and the room is waiting
    if (players.length >= 2 && randomRoom['status'] == 'waiting') {
      String drawerId = players[0]['uid'];
      String word = (_wordList..shuffle()).first;
      await roomRef.update({
        'status': 'playing',
        'drawer': drawerId,
        'word': word,
        'drawing': [],
        'round': 1,
        'maxRounds': _maxRounds,
        'timeLeft': _roundTime,
        'roundActive': true,
        'chat': [],
      });
    }
    setState(() {
      _roomId = roomRef.id;
      _waitingForPlayers = true;
    });
    _listenToRoom();
  }

  void _listenToRoom() {
    if (_roomId == null) return;
    _firestore.collection('drawing_rooms').doc(_roomId).snapshots().listen((snapshot) {
      if (!snapshot.exists) {
        setState(() {
          _roomId = null;
          _waitingForPlayers = false;
          _gameStarted = false;
        });
        return;
      }
      final data = snapshot.data() as Map<String, dynamic>;
      setState(() {
        _players = List<Map<String, dynamic>>.from(data['players'] ?? []);
        _drawerId = data['drawer'];
        _wordToDraw = data['word'];
        _scores = Map<String, int>.from(data['scores'] ?? {});
        _chatMessages = List<Map<String, dynamic>>.from(data['chat'] ?? []);
        _gameStarted = data['status'] == 'playing';
        _waitingForPlayers = data['status'] == 'waiting';
        _lines = (data['drawing'] as List?)?.map<List<Offset>>((line) => (line as List).map<Offset>((pt) => Offset((pt[0] as num).toDouble(), (pt[1] as num).toDouble())).toList()).toList() ?? [];
        _round = data['round'] ?? 1;
        _maxRounds = data['maxRounds'] ?? 3;
        _timeLeft = data['timeLeft'] ?? _roundTime;
        _roundActive = data['roundActive'] ?? false;
        _roomShortCode = data['shortCode'] ?? _roomShortCode;
      });
    });
  }

  void _showDialog(String message) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  Widget _buildLobby() {
    TextEditingController joinController = TextEditingController();
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        ElevatedButton.icon(
          icon: const Icon(Icons.add),
          label: const Text('Create Room'),
          onPressed: _createRoom,
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(
              width: 120,
              child: TextField(
                controller: joinController,
                decoration: const InputDecoration(hintText: 'Room Code'),
              ),
            ),
            const SizedBox(width: 8),
            ElevatedButton(
              onPressed: () => _joinRoomByCode(joinController.text.trim()),
              child: const Text('Join'),
            ),
          ],
        ),
        const SizedBox(height: 12),
        ElevatedButton.icon(
          icon: const Icon(Icons.casino),
          label: const Text('Random Room'),
          onPressed: _joinRandomRoom,
        ),
      ],
    );
  }

  Widget _buildWaiting() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const CircularProgressIndicator(),
        const SizedBox(height: 16),
        Text('Waiting for players...\nRoom Code: \n${_roomShortCode ?? ''}', textAlign: TextAlign.center),
        const SizedBox(height: 8),
        Text('Share this code with friends to join!'),
        const SizedBox(height: 16),
        ElevatedButton(
          onPressed: () {
            setState(() {
              _roomId = null;
              _waitingForPlayers = false;
            });
          },
          child: const Text('Cancel'),
        ),
      ],
    );
  }

  Widget _buildGameScreen() {
    final isDrawer = _drawerId == _currentUserId;
    TextEditingController _guessController = TextEditingController();
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text('Room Code: \n${_roomShortCode ?? ''}'),
        const SizedBox(height: 8),
        Text('Round: $_round / $_maxRounds'),
        const SizedBox(height: 8),
        Text('Players: ' + _players.map((p) => p['displayName']).join(', ')),
        const SizedBox(height: 8),
        Text('Scores: ' + _scores.entries.map((e) => '${_players.firstWhere((p) => p['uid'] == e.key, orElse: () => {'displayName': 'Player'})['displayName']}: ${e.value}').join(', ')),
        const SizedBox(height: 8),
        Text('Time left: $_timeLeft s'),
        const SizedBox(height: 12),
        GestureDetector(
          onPanStart: _drawerId == _currentUserId && _roundActive ? (details) {
            setState(() {
              _lines.add([details.localPosition]);
            });
          } : null,
          onPanUpdate: _drawerId == _currentUserId && _roundActive ? (details) {
            setState(() {
              _lines.last.add(details.localPosition);
            });
            _firestore.collection('drawing_rooms').doc(_roomId).update({
              'drawing': _lines.map((line) => line.map((pt) => [pt.dx, pt.dy]).toList()).toList(),
            });
          } : null,
          child: Container(
            width: 300,
            height: 300,
            color: Colors.grey[200],
            child: CustomPaint(
              painter: DrawingPainter(_lines),
            ),
          ),
        ),
        const SizedBox(height: 16),
        if (_drawerId != _currentUserId && _roundActive)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32.0),
            child: TextField(
              decoration: const InputDecoration(hintText: 'Type your guess...'),
              onSubmitted: (value) => _submitGuess(value),
            ),
          ),
        const SizedBox(height: 16),
        Text('Chat / Guesses:'),
        SizedBox(
          height: 80,
          child: ListView(
            children: _chatMessages.map((msg) => Text('${msg['name']}: ${msg['text']}', style: TextStyle(color: msg['isGuessCorrect'] == true ? Colors.green : null))).toList(),
          ),
        ),
        const SizedBox(height: 12),
        if (!_roundActive)
          ElevatedButton(
            onPressed: _nextRound,
            child: const Text('Next Round'),
          ),
        ElevatedButton(
          onPressed: () {
            setState(() {
              _roomId = null;
              _waitingForPlayers = false;
              _gameStarted = false;
            });
          },
          child: const Text('Exit Room'),
        ),
      ],
    );
  }

  void _submitGuess(String value) async {
    if (!_roundActive || value.trim().isEmpty) return;
    final user = _auth.currentUser;
    if (user == null) return;
    final isCorrect = value.trim().toLowerCase() == (_wordToDraw ?? '').toLowerCase();
    final msg = {
      'name': user.displayName ?? 'Player',
      'text': value.trim(),
      'isGuessCorrect': isCorrect,
      'uid': user.uid,
      'timestamp': FieldValue.serverTimestamp(),
    };
    await _firestore.collection('drawing_rooms').doc(_roomId).update({
      'chat': FieldValue.arrayUnion([msg]),
    });
    if (isCorrect) {
      // Scoring: Guesser gets 3, drawer gets 2 per correct guesser
      final data = (await _firestore.collection('drawing_rooms').doc(_roomId).get()).data() ?? {};
      Map<String, int> scores = Map<String, int>.from(data['scores'] ?? {});
      scores[user.uid] = (scores[user.uid] ?? 0) + 3;
      if (_drawerId != null) {
        scores[_drawerId!] = (scores[_drawerId!] ?? 0) + 2;
      }
      await _firestore.collection('drawing_rooms').doc(_roomId).update({
        'scores': scores,
        'roundActive': false,
      });
    }
  }

  void _nextRound() async {
    if (_round >= _maxRounds) {
      _showDialog('Game Over!\nScores:\n' + _scores.entries.map((e) => '${_players.firstWhere((p) => p['uid'] == e.key, orElse: () => {'displayName': 'Player'})['displayName']}: ${e.value}').join('\n'));
      setState(() {
        _roomId = null;
        _waitingForPlayers = false;
        _gameStarted = false;
      });
      return;
    }
    // Choose next drawer (round robin)
    int nextDrawerIdx = (_round - 1) % _players.length;
    String nextDrawer = _players[nextDrawerIdx]['uid'];
    String nextWord = (_wordList..shuffle()).first;
    await _firestore.collection('drawing_rooms').doc(_roomId).update({
      'drawer': nextDrawer,
      'word': nextWord,
      'drawing': [],
      'round': _round + 1,
      'timeLeft': _roundTime,
      'roundActive': true,
      'chat': [],
      'status': 'playing',
    });
    setState(() {
      _lines = [];
      _round = _round + 1;
      _drawerId = nextDrawer;
      _wordToDraw = nextWord;
      _roundActive = true;
      _chatMessages = [];
      _timeLeft = _roundTime;
    });
    _startTimer();
  }

  void _startTimer() {
  _roundTimer?.stop();
  _roundTimer = Stopwatch()..start();
  _timeLeft = _roundTime;
  Future.doWhile(() async {
    await Future.delayed(const Duration(seconds: 1));
    if (!_roundActive || _timeLeft <= 0) return false;
    setState(() {
      _timeLeft--;
    });
    // Update timeLeft in Firestore so all clients sync
    _firestore.collection('drawing_rooms').doc(_roomId).update({'timeLeft': _timeLeft});
    if (_timeLeft == 0) {
      _firestore.collection('drawing_rooms').doc(_roomId).update({'roundActive': false});
      return false;
    }
    return true;
  });
}




  @override
  Widget build(BuildContext context) {
    if (_roomId == null) {
      return Center(child: _buildLobby());
    }
    if (_waitingForPlayers) {
      return Center(child: _buildWaiting());
    }
    return Center(child: _buildGameScreen());
  }
}

// DrawingPainter must be at the top-level
class DrawingPainter extends CustomPainter {
  final List<List<Offset>> lines;
  DrawingPainter(this.lines);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.black
      ..strokeWidth = 4.0
      ..strokeCap = StrokeCap.round;
    for (final line in lines) {
      for (int i = 0; i < line.length - 1; i++) {
        canvas.drawLine(line[i], line[i + 1], paint);
      }
    }
  }

  @override
  bool shouldRepaint(DrawingPainter oldDelegate) => true;

  @override
  bool shouldRebuildSemantics(DrawingPainter oldDelegate) => false;
}

