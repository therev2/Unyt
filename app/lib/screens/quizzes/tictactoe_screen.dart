import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'dart:math';

class TicTacToeScreen extends StatefulWidget {
  const TicTacToeScreen({Key? key}) : super(key: key);

  @override
  State<TicTacToeScreen> createState() => _TicTacToeScreenState();
}

class _TicTacToeScreenState extends State<TicTacToeScreen> {
  String? _roomId;
  String? _playerSymbol; // 'X' or 'O'
  String? _opponentSymbol;
  bool _waitingForOpponent = false;
  bool _gameStarted = false;
  List<String> _board = List.filled(9, '');
  String? _currentTurn;
  String? _winner;
  bool _draw = false;

  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  @override
  void dispose() {
    if (_roomId != null && !_gameStarted) {
      // Clean up empty room if player leaves before game starts
      _firestore.collection('tictactoe_rooms').doc(_roomId).delete();
    }
    super.dispose();
  }

  Future<void> _createRoom() async {
    final user = _auth.currentUser;
    if (user == null) return;
    final roomRef = await _firestore.collection('tictactoe_rooms').add({
      'players': [user.uid],
      'createdAt': FieldValue.serverTimestamp(),
      'board': List.filled(9, ''),
      'turn': 'X',
      'status': 'waiting',
    });
    setState(() {
      _roomId = roomRef.id;
      _playerSymbol = 'X';
      _opponentSymbol = 'O';
      _waitingForOpponent = true;
    });
    _listenToRoom();
  }

  Future<void> _joinRoomByCode(String code) async {
    final user = _auth.currentUser;
    if (user == null) return;
    final roomRef = _firestore.collection('tictactoe_rooms').doc(code);
    final roomSnap = await roomRef.get();
    if (!roomSnap.exists) {
      _showDialog('Room not found');
      return;
    }
    final data = roomSnap.data() as Map<String, dynamic>;
    List players = data['players'] ?? [];
    if (players.length >= 2) {
      _showDialog('Room is full');
      return;
    }
    if (!players.contains(user.uid)) {
      players.add(user.uid);
      await roomRef.update({'players': players, 'status': 'playing'});
    }
    setState(() {
      _roomId = code;
      _playerSymbol = 'O';
      _opponentSymbol = 'X';
      _waitingForOpponent = false;
    });
    _listenToRoom();
  }

  Future<void> _joinRandomRoom() async {
    final user = _auth.currentUser;
    if (user == null) return;
    final rooms = await _firestore.collection('tictactoe_rooms')
      .where('status', isEqualTo: 'waiting')
      .limit(10)
      .get();
    if (rooms.docs.isEmpty) {
      await _createRoom();
      return;
    }
    final randomRoom = rooms.docs[Random().nextInt(rooms.docs.length)];
    final roomRef = randomRoom.reference;
    List players = randomRoom['players'] ?? [];
    if (players.length >= 2) {
      await _createRoom();
      return;
    }
    if (!players.contains(user.uid)) {
      players.add(user.uid);
      await roomRef.update({'players': players, 'status': 'playing'});
    }
    setState(() {
      _roomId = roomRef.id;
      _playerSymbol = 'O';
      _opponentSymbol = 'X';
      _waitingForOpponent = false;
    });
    _listenToRoom();
  }

  void _listenToRoom() {
    if (_roomId == null) return;
    _firestore.collection('tictactoe_rooms').doc(_roomId).snapshots().listen((snapshot) {
      if (!snapshot.exists) {
        setState(() {
          _roomId = null;
          _gameStarted = false;
          _waitingForOpponent = false;
        });
        return;
      }
      final data = snapshot.data() as Map<String, dynamic>;
      List players = data['players'] ?? [];
      setState(() {
        _board = List<String>.from(data['board'] ?? List.filled(9, ''));
        _currentTurn = data['turn'];
        _gameStarted = players.length == 2 && data['status'] == 'playing';
        _waitingForOpponent = players.length < 2;
        _winner = data['winner'];
        _draw = data['draw'] == true;
      });
    });
  }

  Future<void> _makeMove(int index) async {
    if (!_gameStarted || _winner != null || _draw) return;
    if (_board[index] != '' || _currentTurn != _playerSymbol) return;
    final newBoard = List<String>.from(_board);
    newBoard[index] = _playerSymbol!;
    final winner = _calculateWinner(newBoard);
    final draw = !newBoard.contains('') && winner == null;
    await _firestore.collection('tictactoe_rooms').doc(_roomId).update({
      'board': newBoard,
      'turn': _playerSymbol == 'X' ? 'O' : 'X',
      'winner': winner,
      'draw': draw,
    });
  }

  String? _calculateWinner(List<String> b) {
    const wins = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (var line in wins) {
      if (b[line[0]] != '' && b[line[0]] == b[line[1]] && b[line[1]] == b[line[2]]) {
        return b[line[0]];
      }
    }
    return null;
  }

  Future<void> _resetGame() async {
    await _firestore.collection('tictactoe_rooms').doc(_roomId).update({
      'board': List.filled(9, ''),
      'turn': 'X',
      'winner': null,
      'draw': false,
      'status': 'playing',
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
          label: const Text('Random Opponent'),
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
        Text('Waiting for opponent...\nRoom Code: $_roomId', textAlign: TextAlign.center),
        const SizedBox(height: 8),
        Text('Share this code with a friend to join!'),
        const SizedBox(height: 16),
        ElevatedButton(
          onPressed: () {
            setState(() {
              _roomId = null;
              _waitingForOpponent = false;
            });
          },
          child: const Text('Cancel'),
        ),
      ],
    );
  }

  Widget _buildGameBoard() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text('Room: $_roomId'),
        const SizedBox(height: 8),
        Text('You are: $_playerSymbol'),
        const SizedBox(height: 8),
        Text(_winner != null
            ? (_winner == _playerSymbol ? 'You win!' : 'You lose!')
            : _draw
              ? 'Draw!'
              : _currentTurn == _playerSymbol
                ? 'Your turn'
                : 'Opponent\'s turn'),
        const SizedBox(height: 16),
        SizedBox(
          width: 300,
          height: 300,
          child: GridView.builder(
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              mainAxisSpacing: 4,
              crossAxisSpacing: 4,
            ),
            itemCount: 9,
            itemBuilder: (context, i) {
              return GestureDetector(
                onTap: () => _makeMove(i),
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.grey[200],
                    border: Border.all(color: Colors.black),
                  ),
                  child: Center(
                    child: Text(
                      _board[i],
                      style: TextStyle(
                        fontSize: 48,
                        color: _board[i] == 'X' ? Colors.blue : Colors.red,
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 16),
        if (_winner != null || _draw)
          ElevatedButton(
            onPressed: _resetGame,
            child: const Text('Play Again'),
          ),
        const SizedBox(height: 12),
        ElevatedButton(
          onPressed: () {
            setState(() {
              _roomId = null;
              _gameStarted = false;
              _waitingForOpponent = false;
              _board = List.filled(9, '');
              _winner = null;
              _draw = false;
            });
          },
          child: const Text('Exit Room'),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_roomId == null) {
      return Center(child: _buildLobby());
    }
    if (_waitingForOpponent) {
      return Center(child: _buildWaiting());
    }
    return Center(child: _buildGameBoard());
  }
}

