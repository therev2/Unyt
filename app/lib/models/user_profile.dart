class UserProfile {
  final int id;
  final String name;
  final String email;
  final String avatar;
  final String college;
  final String department;
  final String year;
  final String bio;
  final List<String> skills;
  final Map<String, String> socialLinks;
  final Map<String, dynamic> stats;

  UserProfile({
    required this.id,
    required this.name,
    required this.email,
    required this.avatar,
    required this.college,
    required this.department,
    required this.year,
    required this.bio,
    required this.skills,
    required this.socialLinks,
    required this.stats,
  });
}
