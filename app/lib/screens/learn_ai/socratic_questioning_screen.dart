import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../secrets.dart';

class SocraticQuestioningScreen extends StatefulWidget {
  const SocraticQuestioningScreen({super.key});

  @override
  State<SocraticQuestioningScreen> createState() => _SocraticQuestioningScreenState();
}

class _SocraticQuestioningScreenState extends State<SocraticQuestioningScreen> {
  final TextEditingController _topicController = TextEditingController();
  bool _loading = false;
  String? _error;
  List<dynamic> _qa = [];

  String stripMarkdownCodeBlock(String text) {
    // Remove all occurrences of ```json, ``` (start or end), and trim
    return text
        .replaceAll(RegExp(r'```json', caseSensitive: false), '')
        .replaceAll('```', '')
        .trim();
  }

  Future<void> _generateQA() async {
    setState(() {
      _loading = true;
      _error = null;
      _qa = [];
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
                  'text': 'Generate a Socratic-style guided Q&A for the topic: "${_topicController.text.trim()}". Respond with a JSON array of objects, each with a "question" and an "answer".'
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
        _qa = jsonDecode(cleaned);
      } else {
        _error = 'No response from Gemini API.';
      }
    } catch (e) {
      _error = 'Failed to generate Q&A.';
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Socratic Questioning')),
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
              onPressed: _loading ? null : _generateQA,
              child: _loading ? const CircularProgressIndicator() : const Text('Start Q&A'),
            ),
            if (_error != null)
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Text(_error!, style: const TextStyle(color: Colors.red)),
              ),
            const SizedBox(height: 16),
            Expanded(
              child: ListView.builder(
                itemCount: _qa.length,
                itemBuilder: (context, idx) {
                  final qa = _qa[idx];
                  return Card(
                    margin: const EdgeInsets.symmetric(vertical: 8),
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Text(qa.toString()),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
