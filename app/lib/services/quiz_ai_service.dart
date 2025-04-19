import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/quiz.dart';
import '../screens/quizzes/quiz_taking_screen.dart';
import '../Secrets.dart';

class QuizAIService {
  static const String geminiApiKey = Secrets.apiKey;
  static const String geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=';

  static Future<List<QuizQuestion>> generateQuestions({required String topic, required int count, required int totalPoints}) async {
    final prompt = "Generate $count multiple-choice questions about $topic. For each question, provide 4 options and indicate which one is correct. Distribute a total of $totalPoints points equally among the questions (each question should have a 'points' field). Respond in strict JSON array format: [{\"question\":..., \"options\":[...], \"correctIndex\":int, \"points\":int}, ...].";
    final body = jsonEncode({
      'contents': [
        {
          'role': 'user',
          'parts': [
            {'text': prompt}
          ]
        }
      ]
    });
    final response = await http.post(
      Uri.parse('$geminiApiUrl$geminiApiKey'),
      headers: {'Content-Type': 'application/json'},
      body: body,
    );
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final text = data['candidates']?[0]?['content']?['parts']?[0]?['text'] ?? '';
      print('Gemini model output:');
      print(text);
      final cleaned = text.trim().replaceAll(RegExp(r'^```json|```'), '');
      final List<dynamic> jsonList = jsonDecode(cleaned);
      return jsonList.map((e) => QuizQuestion.fromJson(e)).toList();
    } else {
      print('Gemini API error: ${response.statusCode} ${response.body}');
      throw Exception('Failed to generate questions: ${response.statusCode}');
    }
  }
}
