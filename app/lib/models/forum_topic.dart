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
  final int upvotes;
  final List<String> upvotedBy;

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
    required this.upvotes,
    required this.upvotedBy,
  });

  factory ForumTopic.fromMap(Map<String, dynamic> map, int id) {
    return ForumTopic(
      id: id,
      title: map['title'] ?? '',
      description: map['description'] ?? '',
      category: map['category'] ?? '',
      author: ForumAuthor(
        name: map['author']['name'] ?? '',
        college: map['author']['college'] ?? '',
        avatar: map['author']['avatar'] ?? '',
      ),
      createdAt: map['createdAt'] ?? '',
      lastActivity: map['lastActivity'] ?? '',
      views: map['views'] ?? 0,
      replies: map['replies'] ?? 0,
      isSticky: map['isSticky'] ?? false,
      upvotes: map['upvotes'] ?? 0,
      upvotedBy: List<String>.from(map['upvotedBy'] ?? []),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'title': title,
      'description': description,
      'category': category,
      'author': {
        'name': author.name,
        'college': author.college,
        'avatar': author.avatar,
      },
      'createdAt': createdAt,
      'lastActivity': lastActivity,
      'views': views,
      'replies': replies,
      'isSticky': isSticky,
      'upvotes': upvotes,
      'upvotedBy': upvotedBy,
    };
  }
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
