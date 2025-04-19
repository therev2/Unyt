import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../../Secrets.dart';

class ChatbotScreen extends StatefulWidget {
  const ChatbotScreen({super.key});

  @override
  State<ChatbotScreen> createState() => _ChatbotScreenState();
}

class _ChatbotScreenState extends State<ChatbotScreen> {
  final TextEditingController _controller = TextEditingController();
  final List<_ChatMessage> _messages = [];
  bool _isLoading = false;

  // Use your Gemini 2.5 API key here
  static const String geminiApiKey = Secrets.apiKey;
  static const String geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=';

  // Persona/context message as 'user' (not 'system')
  final List<Map<String, dynamic>> _contextMessages = [
    {
      'role': 'user',
      'parts': [
        {
          'text': "You are Buddy, a mature, empathetic, and supportive friend who is also knowledgeable about mental health and therapy. Always respond as a caring college student peer and therapist, using a warm, non-judgmental, and encouraging tone. Your goal is to help students feel heard, supported, and empowered."
        }
      ]
    }
  ];

  @override
  void initState() {
    super.initState();
    // Add initial context for therapy chatbot
    _messages.add(
      _ChatMessage(
        "Hi, I'm your Buddy! I'm here to listen and support you. This is a safe space for college students to talk about anything on their mind—stress, relationships, studies, or just life in general. How can I help you today?",
        true,
      ),
    );
  }

  Future<void> _sendMessage(String message) async {
    setState(() {
      _messages.add(_ChatMessage(message, false));
      _isLoading = true;
    });
    try {
      final response = await http.post(
        Uri.parse('$geminiApiUrl$geminiApiKey'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'contents': [
            ..._contextMessages,
            {'role': 'user', 'parts': [{'text': message}]}
          ]
        }),
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        String botReply = data['candidates']?[0]?['content']?['parts']?[0]?['text'] ?? 'No response';
        setState(() {
          _messages.add(_ChatMessage(botReply, true));
        });
      } else {
        setState(() {
          _messages.add(_ChatMessage('Error: ${response.statusCode}', true));
        });
      }
    } catch (e) {
      setState(() {
        _messages.add(_ChatMessage('Error: $e', true));
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Ask Your Buddy')),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: ListView.builder(
                reverse: true,
                itemCount: _messages.length,
                itemBuilder: (context, index) {
                  final msg = _messages[_messages.length - 1 - index];
                  final isBot = msg.isBot;
                  final theme = Theme.of(context);
                  final colorScheme = theme.colorScheme;
                  final backgroundColor = isBot
                    ? colorScheme.surfaceVariant
                    : colorScheme.primaryContainer;
                  final textColor = isBot
                    ? colorScheme.onSurfaceVariant
                    : colorScheme.onPrimaryContainer;
                  return Align(
                    alignment: isBot ? Alignment.centerLeft : Alignment.centerRight,
                    child: Container(
                      margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: backgroundColor,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        msg.text,
                        style: TextStyle(color: textColor),
                      ),
                    ),
                  );
                },
              ),
            ),
            if (_isLoading) const Padding(
              padding: EdgeInsets.all(8.0),
              child: CircularProgressIndicator(),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      decoration: InputDecoration(
                        hintText: 'Ask your buddy...'
                      ),
                      onSubmitted: (value) {
                        if (value.trim().isNotEmpty && !_isLoading) {
                          _sendMessage(value.trim());
                          _controller.clear();
                        }
                      },
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.send),
                    onPressed: _isLoading ? null : () {
                      final value = _controller.text.trim();
                      if (value.isNotEmpty) {
                        _sendMessage(value);
                        _controller.clear();
                      }
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ChatMessage {
  final String text;
  final bool isBot;
  _ChatMessage(this.text, this.isBot);
}
