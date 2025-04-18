import 'package:flutter/material.dart';
import 'package:unyt/models/user_profile.dart';
import 'package:unyt/models/achievement.dart';
import 'package:unyt/widgets/profile/profile_header.dart';
import 'package:unyt/widgets/profile/achievement_card.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Sample data - in a real app, this would come from your API
  final UserProfile userProfile = UserProfile(
    id: 1,
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatar: 'https://via.placeholder.com/150x150',
    college: 'NIT Trichy',
    department: 'Computer Science',
    year: '3rd Year',
    bio:
        'Passionate about coding and technology. Love to participate in hackathons and coding competitions.',
    skills: [
      'Python',
      'Flutter',
      'Machine Learning',
      'Web Development',
      'Problem Solving',
    ],
    socialLinks: {
      'github': 'github.com/alexj',
      'linkedin': 'linkedin.com/in/alexj',
      'twitter': 'twitter.com/alexj',
    },
    stats: {
      'events': 12,
      'competitions': 8,
      'quizzes': 15,
      'forums': 24,
      'points': 2350,
      'rank': 4,
    },
  );

  final List<Achievement> achievements = [
    Achievement(
      id: 1,
      title: 'Hackathon Winner',
      description: 'Won first place in the National Hackathon 2023',
      date: 'May 22, 2023',
      icon: Icons.emoji_events,
      points: 500,
    ),
    Achievement(
      id: 2,
      title: 'Quiz Master',
      description: 'Scored 100% in 5 consecutive quizzes',
      date: 'April 15, 2023',
      icon: Icons.quiz,
      points: 300,
    ),
    Achievement(
      id: 3,
      title: 'Forum Contributor',
      description: 'Posted 50+ helpful responses in the forums',
      date: 'March 10, 2023',
      icon: Icons.forum,
      points: 250,
    ),
    Achievement(
      id: 4,
      title: 'Event Organizer',
      description: 'Successfully organized the Tech Symposium 2023',
      date: 'February 28, 2023',
      icon: Icons.event,
      points: 400,
    ),
    Achievement(
      id: 5,
      title: 'Top Contributor',
      description: 'Ranked in the top 10 contributors for the month',
      date: 'January 31, 2023',
      icon: Icons.leaderboard,
      points: 350,
    ),
  ];

  final List<Map<String, dynamic>> activities = [
    {
      'type': 'event',
      'title': 'Registered for Annual Tech Fest',
      'date': '2 days ago',
      'icon': Icons.event,
    },
    {
      'type': 'quiz',
      'title': 'Completed Python Basics Quiz with 95% score',
      'date': '3 days ago',
      'icon': Icons.quiz,
    },
    {
      'type': 'forum',
      'title': 'Posted in "Tips for Semester Exams" discussion',
      'date': '5 days ago',
      'icon': Icons.forum,
    },
    {
      'type': 'competition',
      'title': 'Joined team "Code Ninjas" for CodeCraft 2023',
      'date': '1 week ago',
      'icon': Icons.emoji_events,
    },
    {
      'type': 'achievement',
      'title': 'Earned "Quiz Master" achievement',
      'date': '2 weeks ago',
      'icon': Icons.military_tech,
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () {
              // Edit profile
            },
          ),
          IconButton(
            icon: const Icon(Icons.share),
            onPressed: () {
              // Share profile
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Profile Header
          ProfileHeader(profile: userProfile),

          // Tabs
          TabBar(
            controller: _tabController,
            tabs: const [
              Tab(text: 'Achievements'),
              Tab(text: 'Activity'),
              Tab(text: 'Stats'),
            ],
          ),

          // Tab Content
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                // Achievements Tab
                _buildAchievementsTab(),

                // Activity Tab
                _buildActivityTab(),

                // Stats Tab
                _buildStatsTab(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAchievementsTab() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'My Achievements',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: 4),
          Text(
            'Badges and rewards earned through participation and excellence.',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: Theme.of(context).colorScheme.onSurfaceVariant,
            ),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: ListView.builder(
              itemCount: achievements.length,
              itemBuilder: (context, index) {
                return AchievementCard(achievement: achievements[index]);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActivityTab() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Recent Activity',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: 4),
          Text(
            'Your recent actions and participations on the platform.',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: Theme.of(context).colorScheme.onSurfaceVariant,
            ),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: ListView.builder(
              itemCount: activities.length,
              itemBuilder: (context, index) {
                final activity = activities[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: _getActivityColor(
                        activity['type'],
                      ).withOpacity(0.2),
                      child: Icon(
                        activity['icon'],
                        color: _getActivityColor(activity['type']),
                      ),
                    ),
                    title: Text(activity['title']),
                    subtitle: Text(activity['date']),
                    trailing: IconButton(
                      icon: const Icon(Icons.more_vert),
                      onPressed: () {
                        // Show activity details
                      },
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Color _getActivityColor(String type) {
    switch (type) {
      case 'event':
        return Colors.blue;
      case 'quiz':
        return Colors.purple;
      case 'forum':
        return Colors.orange;
      case 'competition':
        return Colors.green;
      case 'achievement':
        return Colors.amber;
      default:
        return Colors.grey;
    }
  }

  Widget _buildStatsTab() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'My Statistics',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: 4),
          Text(
            'Overview of your participation and performance.',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: Theme.of(context).colorScheme.onSurfaceVariant,
            ),
          ),
          const SizedBox(height: 24),

          // Stats Grid
          Expanded(
            child: GridView.count(
              crossAxisCount: 2,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              children: [
                _buildStatCard(
                  context,
                  'Events Attended',
                  userProfile.stats['events'].toString(),
                  Icons.event,
                  Colors.blue,
                ),
                _buildStatCard(
                  context,
                  'Competitions',
                  userProfile.stats['competitions'].toString(),
                  Icons.emoji_events,
                  Colors.green,
                ),
                _buildStatCard(
                  context,
                  'Quizzes Taken',
                  userProfile.stats['quizzes'].toString(),
                  Icons.quiz,
                  Colors.purple,
                ),
                _buildStatCard(
                  context,
                  'Forum Posts',
                  userProfile.stats['forums'].toString(),
                  Icons.forum,
                  Colors.orange,
                ),
                _buildStatCard(
                  context,
                  'Total Points',
                  userProfile.stats['points'].toString(),
                  Icons.star,
                  Colors.amber,
                ),
                _buildStatCard(
                  context,
                  'Current Rank',
                  '#${userProfile.stats['rank']}',
                  Icons.leaderboard,
                  Colors.red,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(
    BuildContext context,
    String title,
    String value,
    IconData icon,
    Color color,
  ) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 40, color: color),
            const SizedBox(height: 16),
            Text(
              value,
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              title,
              style: Theme.of(context).textTheme.bodyMedium,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
