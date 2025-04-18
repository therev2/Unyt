class FeedPost {
  final int id;
  final String title;
  final String description;
  final String date;
  final String location;
  final String category;
  final String image;
  final College hostCollege;
  final int attendees;
  final List<Comment> comments;

  FeedPost({
    required this.id,
    required this.title,
    required this.description,
    required this.date,
    required this.location,
    required this.category,
    required this.image,
    required this.hostCollege,
    required this.attendees,
    required this.comments,
  });
}

class College {
  final String name;
  final String logo;

  College({
    required this.name,
    required this.logo,
  });
}

class Comment {
  final int id;
  final CommentAuthor author;
  final String content;
  final String timestamp;
  final int likes;
  final List<Reply> replies;

  Comment({
    required this.id,
    required this.author,
    required this.content,
    required this.timestamp,
    required this.likes,
    required this.replies,
  });
}

class CommentAuthor {
  final String name;
  final String college;
  final String avatar;

  CommentAuthor({
    required this.name,
    required this.college,
    required this.avatar,
  });
}

class Reply {
  final int id;
  final CommentAuthor author;
  final String content;
  final String timestamp;
  final int likes;

  Reply({
    required this.id,
    required this.author,
    required this.content,
    required this.timestamp,
    required this.likes,
  });
}
