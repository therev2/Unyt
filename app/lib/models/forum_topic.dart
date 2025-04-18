class ForumTopic {
  final int id;
  final String title;
  final String description;
  final String category;
  final ForumAuthor author;
  final String createdAt;
  final String lastActivity;
  final int views;
  final int replies;
  final bool isSticky;

  ForumTopic({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.author,
    required this.createdAt,
    required this.lastActivity,
    required this.views,
    required this.replies,
    required this.isSticky,
  });
}

class ForumAuthor {
  final String name;
  final String college;
  final String avatar;

  ForumAuthor({
    required this.name,
    required this.college,
    required this.avatar,
  });
}
