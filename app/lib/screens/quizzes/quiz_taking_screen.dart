import 'dart:async';
import 'package:flutter/material.dart';
import '../../models/quiz.dart';

class QuizTakingScreen extends StatefulWidget {
  final Quiz quiz;
  final List<QuizQuestion> questions;
  final int timeLimitSeconds;

  const QuizTakingScreen({
    super.key,
    required this.quiz,
    required this.questions,
    required this.timeLimitSeconds,
  });

  @override
  State<QuizTakingScreen> createState() => _QuizTakingScreenState();
}

class _QuizTakingScreenState extends State<QuizTakingScreen> {
  late int _remainingSeconds;
  Timer? _timer;
  int _currentQuestion = 0;
  List<int?> _selectedAnswers = [];
  bool _quizEnded = false;

  @override
  void initState() {
    super.initState();
    _remainingSeconds = widget.timeLimitSeconds;
    _selectedAnswers = List.filled(widget.questions.length, null);
    _startTimer();
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        if (_remainingSeconds > 0) {
          _remainingSeconds--;
        } else {
          _endQuiz();
        }
      });
    });
  }

  void _endQuiz() {
    _timer?.cancel();
    setState(() {
      _quizEnded = true;
    });
  }

  int _calculateCorrect() {
    int correct = 0;
    for (int i = 0; i < widget.questions.length; i++) {
      if (_selectedAnswers[i] != null && widget.questions[i].correctIndex == _selectedAnswers[i]) {
        correct += widget.questions[i].points;
      }
    }
    return correct;
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_quizEnded) {
      int correct = _calculateCorrect();
      int totalPoints = widget.questions.fold(0, (total, question) => total + question.points);
      return Scaffold(
        appBar: AppBar(title: Text(widget.quiz.title)),
        body: SafeArea(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(child: Text('Quiz Completed!', style: Theme.of(context).textTheme.headlineSmall)),
                  const SizedBox(height: 16),
                  Center(child: Text('Points Scored: $correct / $totalPoints', style: Theme.of(context).textTheme.titleLarge)),
                  const SizedBox(height: 24),
                  Text('Review Answers:', style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 12),
                  ...List.generate(widget.questions.length, (i) {
                    final q = widget.questions[i];
                    final userAns = _selectedAnswers[i];
                    final theme = Theme.of(context);
                    final colorScheme = theme.colorScheme;
                    final isCorrect = userAns == q.correctIndex;
                    final cardColor = isCorrect
                      ? colorScheme.secondaryContainer
                      : colorScheme.errorContainer;
                    final textColor = isCorrect
                      ? colorScheme.onSecondaryContainer
                      : colorScheme.onErrorContainer;
                    return Card(
                      color: cardColor,
                      margin: const EdgeInsets.symmetric(vertical: 6),
                      child: Padding(
                        padding: const EdgeInsets.all(12.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Q${i + 1}: ${q.question}', style: theme.textTheme.bodyLarge?.copyWith(color: textColor)),
                            const SizedBox(height: 8),
                            ...List.generate(q.options.length, (j) {
                              final isOptionCorrect = j == q.correctIndex;
                              final isOptionSelected = userAns == j;
                              Color? optionTextColor;
                              FontWeight? optionWeight;
                              if (isOptionCorrect) {
                                optionTextColor = colorScheme.onSecondaryContainer;
                                optionWeight = FontWeight.bold;
                              } else if (isOptionSelected && !isOptionCorrect) {
                                optionTextColor = colorScheme.onErrorContainer;
                                optionWeight = FontWeight.bold;
                              } else {
                                optionTextColor = textColor.withOpacity(0.85);
                              }
                              return Row(
                                children: [
                                  Icon(
                                    isOptionCorrect
                                      ? Icons.check_circle
                                      : isOptionSelected
                                        ? Icons.cancel
                                        : Icons.radio_button_unchecked,
                                    color: isOptionCorrect
                                      ? colorScheme.secondary
                                      : isOptionSelected
                                        ? colorScheme.error
                                        : colorScheme.outline,
                                    size: 18,
                                  ),
                                  const SizedBox(width: 6),
                                  Flexible(
                                    child: Text(
                                      q.options[j],
                                      style: TextStyle(
                                        color: optionTextColor,
                                        fontWeight: optionWeight,
                                      ),
                                    ),
                                  ),
                                  if (isOptionSelected && !isOptionCorrect)
                                    Padding(
                                      padding: const EdgeInsets.only(left: 4.0),
                                      child: Text(
                                        '(Your answer)',
                                        style: TextStyle(color: colorScheme.onErrorContainer, fontSize: 12),
                                      ),
                                    ),
                                  if (isOptionCorrect)
                                    Padding(
                                      padding: const EdgeInsets.only(left: 4.0),
                                      child: Text(
                                        '(Correct)',
                                        style: TextStyle(color: colorScheme.onSecondaryContainer, fontSize: 12),
                                      ),
                                    ),
                                ],
                              );
                            }),
                          ],
                        ),
                      ),
                    );
                  }),
                  const SizedBox(height: 24),
                  Center(
                    child: ElevatedButton(
                      onPressed: () => Navigator.of(context).pop(),
                      child: const Text('Back to Quizzes'),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    }

    final q = widget.questions[_currentQuestion];
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.quiz.title),
        actions: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Center(child: Text('$_remainingSeconds s')),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Question ${_currentQuestion + 1} of ${widget.questions.length}', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 12),
            Text(q.question, style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 24),
            ...List.generate(q.options.length, (i) => RadioListTile<int>(
              value: i,
              groupValue: _selectedAnswers[_currentQuestion],
              title: Text(q.options[i]),
              onChanged: (val) {
                setState(() {
                  _selectedAnswers[_currentQuestion] = val;
                });
              },
            )),
            const Spacer(),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                if (_currentQuestion > 0)
                  ElevatedButton(
                    onPressed: () {
                      setState(() {
                        _currentQuestion--;
                      });
                    },
                    child: const Text('Previous'),
                  ),
                if (_currentQuestion < widget.questions.length - 1)
                  ElevatedButton(
                    onPressed: _selectedAnswers[_currentQuestion] != null
                        ? () {
                            setState(() {
                              _currentQuestion++;
                            });
                          }
                        : null,
                    child: const Text('Next'),
                  ),
                if (_currentQuestion == widget.questions.length - 1)
                  ElevatedButton(
                    onPressed: _selectedAnswers[_currentQuestion] != null ? _endQuiz : null,
                    child: const Text('Submit'),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// Model for a quiz question (can be moved to models/quiz.dart)
class QuizQuestion {
  final String question;
  final List<String> options;
  final int correctIndex;
  final int points;

  QuizQuestion({required this.question, required this.options, required this.correctIndex, required this.points});

  factory QuizQuestion.fromJson(Map<String, dynamic> json) {
    return QuizQuestion(
      question: json['question'],
      options: List<String>.from(json['options']),
      correctIndex: json['correctIndex'],
      points: json['points'] ?? 1,
    );
  }
}
