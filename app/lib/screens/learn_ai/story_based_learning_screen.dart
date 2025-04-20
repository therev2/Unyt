import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../secrets.dart';

class StoryBasedLearningScreen extends StatefulWidget {
  const StoryBasedLearningScreen({super.key});

  @override
  State<StoryBasedLearningScreen> createState() => _StoryBasedLearningScreenState();
}

class _StoryBasedLearningScreenState extends State<StoryBasedLearningScreen> {
  final TextEditingController _topicController = TextEditingController();
  bool _loading = false;
  String? _error;
  String? _story;

  String stripMarkdownCodeBlock(String text) {
    // Remove all occurrences of ```json, ``` (start or end), and trim
    return text
        .replaceAll(RegExp(r'```json', caseSensitive: false), '')
        .replaceAll('```', '')
        .trim();
  }

  Future<void> _generateStory() async {
    setState(() {
      _loading = true;
      _error = null;
      _story = null;
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
                  'text': 'Generate a story-based explanation for the topic: "${_topicController.text.trim()}". Respond with a JSON object with a "story" field (string).'
                }
              ]
            }
          ]
        }),
      );
      final data = jsonDecode(response.body);
      if (data['error'] != null) {
        _error = 'Gemini API error: ' + data['error']['message'];
      } else if (data['candidates'] != null && data['candidates'].isNotEmpty) {
        final content = data['candidates'][0]['content']['parts'][0]['text'];
        final cleaned = stripMarkdownCodeBlock(content);
        final parsed = jsonDecode(cleaned);
        _story = parsed['story'];
      } else {
        _error = 'No response from Gemini API.';
      }
    } catch (e) {
      _error = 'Failed to generate story.';
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Story-Based Learning')),
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
              onPressed: _loading ? null : _generateStory,
              child: _loading ? const CircularProgressIndicator() : const Text('Generate Story'),
            ),
            if (_error != null)
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Text(_error!, style: const TextStyle(color: Colors.red)),
              ),
            const SizedBox(height: 16),
            if (_story != null)
              Expanded(
                child: SingleChildScrollView(
                  child: Card(
                    margin: const EdgeInsets.symmetric(vertical: 8),
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Text(_story!),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
