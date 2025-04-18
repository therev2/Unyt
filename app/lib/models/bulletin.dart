class Bulletin {
  final int id;
  final String title;
  final String content;
  final BulletinAuthor author;
  final String date;

  Bulletin({
    required this.id,
    required this.title,
    required this.content,
    required this.author,
    required this.date,
  });
}

class BulletinAuthor {
  final String name;
  final String avatar;

  BulletinAuthor({
    required this.name,
    required this.avatar,
  });
}
