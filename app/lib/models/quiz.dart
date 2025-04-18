class Quiz {
  final int id;
  final String title;
  final String description;
  final String category;
  final String difficulty;
  final int questions;
  final int timeLimit;
  final int points;
  final String image;
  final QuizCreator creator;
  final int attempts;

  Quiz({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.difficulty,
    required this.questions,
    required this.timeLimit,
    required this.points,
    required this.image,
    required this.creator,
    required this.attempts,
  });
}

class QuizCreator {
  final String name;
  final String college;
  final String avatar;

  QuizCreator({
    required this.name,
    required this.college,
    required this.avatar,
  });
}
