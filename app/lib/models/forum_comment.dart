class ForumComment {
  final String id;
  final String authorName;
  final String authorCollege;
  final String authorAvatar;
  final String content;
  final String createdAt;
  final int upvotes;
  final String? parentId; // For threads (null if top-level)

  ForumComment({
    required this.id,
    required this.authorName,
    required this.authorCollege,
    required this.authorAvatar,
    required this.content,
    required this.createdAt,
    required this.upvotes,
    this.parentId,
  });

  factory ForumComment.fromMap(Map<String, dynamic> map, String id) {
    return ForumComment(
      id: id,
      authorName: map['authorName'] ?? '',
      authorCollege: map['authorCollege'] ?? '',
      authorAvatar: map['authorAvatar'] ?? '',
      content: map['content'] ?? '',
      createdAt: map['createdAt'] ?? '',
      upvotes: map['upvotes'] ?? 0,
      parentId: map['parentId'],
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'authorName': authorName,
      'authorCollege': authorCollege,
      'authorAvatar': authorAvatar,
      'content': content,
      'createdAt': createdAt,
      'upvotes': upvotes,
      'parentId': parentId,
    };
  }
}
