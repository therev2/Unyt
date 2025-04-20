import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../secrets.dart';

class FlashcardsScreen extends StatefulWidget {
  const FlashcardsScreen({super.key});

  @override
  State<FlashcardsScreen> createState() => _FlashcardsScreenState();
}

class _FlashcardsScreenState extends State<FlashcardsScreen> {
  final TextEditingController _topicController = TextEditingController();
  bool _loading = false;
  String? _error;
  List<dynamic> _flashcards = [];
  int _current = 0;
  bool _flipped = false;

  String stripMarkdownCodeBlock(String text) {
    // Remove all occurrences of ```json, ``` (start or end), and trim
    return text
        .replaceAll(RegExp(r'```json', caseSensitive: false), '')
        .replaceAll('```', '')
        .trim();
  }

  Future<void> _generateFlashcards() async {
    setState(() {
      _loading = true;
      _error = null;
      _flashcards = [];
      _current = 0;
      _flipped = false;
    });
    try {
      final response = await http.post(
        Uri.parse('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${Secrets.apiKey}'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'contents': [
            {
              'parts': [
                {
                  'text': 'Generate a set of flashcards for the topic: "${_topicController.text.trim()}". Respond with a JSON array of objects, each with a "question" and an "answer".'
                }
              ]
            }
          ]
        }),
      );
      final data = jsonDecode(response.body);
      print('Gemini raw response: ' + response.body);
      if (data['error'] != null) {
        _error = 'Gemini API error: ' + data['error']['message'];
      } else if (data['candidates'] != null && data['candidates'].isNotEmpty) {
        final content = data['candidates'][0]['content']['parts'][0]['text'];
        final cleaned = stripMarkdownCodeBlock(content);
        print('Cleaned Gemini flashcards string: ' + cleaned);
        _flashcards = jsonDecode(cleaned);
      } else {
        _error = 'No response from Gemini API.';
      }
    } catch (e, stack) {
      print('Flashcard generation error: $e');
      print('Stacktrace: $stack');
      _error = 'Failed to generate flashcards: $e';
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  void _goNext() {
    setState(() {
      _current = (_current + 1).clamp(0, _flashcards.length - 1);
      _flipped = false;
    });
  }

  void _goPrev() {
    setState(() {
      _current = (_current - 1).clamp(0, _flashcards.length - 1);
      _flipped = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Flashcards')),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            TextField(
              controller: _topicController,
              decoration: const InputDecoration(
                labelText: 'Enter a topic',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: _loading ? null : _generateFlashcards,
              child: _loading ? const CircularProgressIndicator() : const Text('Generate Flashcards'),
            ),
            if (_error != null)
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Text(_error!, style: const TextStyle(color: Colors.red)),
              ),
            const SizedBox(height: 16),
            if (_flashcards.isNotEmpty)
              Expanded(
                child: Column(
                  children: [
                    Card(
                      margin: const EdgeInsets.symmetric(vertical: 8),
                      child: InkWell(
                        onTap: () => setState(() => _flipped = !_flipped),
                        child: Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(24),
                          alignment: Alignment.center,
                          child: Text(
                            _flipped ? _flashcards[_current]['answer'].toString() : _flashcards[_current]['question'].toString(),
                            style: const TextStyle(fontSize: 20),
                          ),
                        ),
                      ),
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.arrow_back),
                          onPressed: _current > 0 ? _goPrev : null,
                        ),
                        Text('${_current + 1} / ${_flashcards.length}'),
                        IconButton(
                          icon: const Icon(Icons.arrow_forward),
                          onPressed: _current < _flashcards.length - 1 ? _goNext : null,
                        ),
                      ],
                    )
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}
