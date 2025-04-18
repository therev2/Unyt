class QuizHistory {
  final int id;
  final String quizTitle;
  final String category;
  final int score;
  final int totalQuestions;
  final int correctAnswers;
  final String timeTaken;
  final String date;
  final int points;

  QuizHistory({
    required this.id,
    required this.quizTitle,
    required this.category,
    required this.score,
    required this.totalQuestions,
    required this.correctAnswers,
    required this.timeTaken,
    required this.date,
    required this.points,
  });
}
