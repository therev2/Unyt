class LeaderboardEntry {
  final int id;
  final int rank;
  final String name;
  final String avatar;
  final int score;
  final int change;
  final String? college;

  LeaderboardEntry({
    required this.id,
    required this.rank,
    required this.name,
    required this.avatar,
    required this.score,
    required this.change,
    this.college,
  });
}
