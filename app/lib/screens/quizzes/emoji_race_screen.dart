import 'package:flutter/material.dart';
import 'dart:async';
import 'dart:math';

class EmojiRaceScreen extends StatefulWidget {
  const EmojiRaceScreen({Key? key}) : super(key: key);

  @override
  State<EmojiRaceScreen> createState() => _EmojiRaceScreenState();
}

class _EmojiRaceScreenState extends State<EmojiRaceScreen> {
  static const List<String> emojis = ['🚗', '🏎️', '🚕', '🚓', '🚙', '🛵'];
  static const int trackLength = 20;
  late List<int> positions;
  late List<String> racers;
  bool raceStarted = false;
  bool raceFinished = false;
  int? winnerIndex;
  Timer? timer;

  @override
  void initState() {
    super.initState();
    _resetRace();
  }

  void _resetRace() {
    racers = List.from(emojis)..shuffle();
    positions = List.filled(racers.length, 0);
    raceStarted = false;
    raceFinished = false;
    winnerIndex = null;
    timer?.cancel();
    setState(() {});
  }

  void _startRace() {
    raceStarted = true;
    raceFinished = false;
    winnerIndex = null;
    timer = Timer.periodic(const Duration(milliseconds: 300), (t) {
      setState(() {
        for (int i = 0; i < positions.length; i++) {
          if (!raceFinished) {
            positions[i] += Random().nextInt(2); // move 0 or 1 step
            if (positions[i] >= trackLength) {
              positions[i] = trackLength;
              raceFinished = true;
              winnerIndex = i;
              timer?.cancel();
            }
          }
        }
      });
    });
  }

  @override
  void dispose() {
    timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Emoji Race')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              raceFinished
                  ? 'Winner: ${racers[winnerIndex ?? 0]}'
                  : raceStarted
                      ? 'Go!'
                      : 'Press Start to Race!',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 24),
            ...List.generate(racers.length, (i) {
              return Row(
                children: [
                  Text(racers[i], style: const TextStyle(fontSize: 32)),
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
                          left: positions[i] * 12.0,
                          top: 0,
                          child: Text(racers[i], style: const TextStyle(fontSize: 24)),
                        ),
                      ],
                    ),
                  ),
                  if (raceFinished && winnerIndex == i)
                    const Padding(
                      padding: EdgeInsets.only(left: 8.0),
                      child: Icon(Icons.emoji_events, color: Colors.amber),
                    ),
                ],
              );
            }),
            const SizedBox(height: 32),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ElevatedButton(
                  onPressed: raceStarted && !raceFinished ? null : _startRace,
                  child: const Text('Start Race'),
                ),
                const SizedBox(width: 16),
                OutlinedButton(
                  onPressed: _resetRace,
                  child: const Text('Reset'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
