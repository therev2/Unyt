class ForumPost {
  final int id;
  final String content;
  final ForumPostAuthor author;
  final String timestamp;
  final int likes;
  final List<ForumReply> replies;

  ForumPost({
    required this.id,
    required this.content,
    required this.author,
    required this.timestamp,
    required this.likes,
    required this.replies,
  });
}

class ForumPostAuthor {
  final String name;
  final String college;
  final String avatar;
  final String role;
  final int posts;
  final String joinDate;

  ForumPostAuthor({
    required this.name,
    required this.college,
    required this.avatar,
    required this.role,
    required this.posts,
    required this.joinDate,
  });
}

class ForumReply {
  final int id;
  final String content;
  final ForumPostAuthor author;
  final String timestamp;
  final int likes;

  ForumReply({
    required this.id,
    required this.content,
    required this.author,
    required this.timestamp,
    required this.likes,
  });
}
