import 'package:flutter/material.dart';
import 'package:unyt/models/leaderboard_entry.dart';
import 'package:unyt/widgets/leaderboards/leaderboard_card.dart';

class LeaderboardsScreen extends StatefulWidget {
  const LeaderboardsScreen({super.key});

  @override
  State<LeaderboardsScreen> createState() => _LeaderboardsScreenState();
}

class _LeaderboardsScreenState extends State<LeaderboardsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Sample data - in a real app, this would come from your API
  final List<LeaderboardEntry> collegeLeaderboard = [
    LeaderboardEntry(
      id: 1,
      rank: 1,
      name: 'IIT Bombay',
      avatar: 'https://via.placeholder.com/40x40',
      score: 12500,
      change: 0,
    ),
    LeaderboardEntry(
      id: 2,
      rank: 2,
      name: 'IIT Delhi',
      avatar: 'https://via.placeholder.com/40x40',
      score: 11800,
      change: 1,
    ),
    LeaderboardEntry(
      id: 3,
      rank: 3,
      name: 'BITS Pilani',
      avatar: 'https://via.placeholder.com/40x40',
      score: 10950,
      change: -1,
    ),
    LeaderboardEntry(
      id: 4,
      rank: 4,
      name: 'IIT Madras',
      avatar: 'https://via.placeholder.com/40x40',
      score: 10200,
      change: 0,
    ),
    LeaderboardEntry(
      id: 5,
      rank: 5,
      name: 'IIM Ahmedabad',
      avatar: 'https://via.placeholder.com/40x40',
      score: 9800,
      change: 2,
    ),
    LeaderboardEntry(
      id: 6,
      rank: 6,
      name: 'NIT Trichy',
      avatar: 'https://via.placeholder.com/40x40',
      score: 9500,
      change: 0,
    ),
    LeaderboardEntry(
      id: 7,
      rank: 7,
      name: 'Delhi University',
      avatar: 'https://via.placeholder.com/40x40',
      score: 9200,
      change: -2,
    ),
    LeaderboardEntry(
      id: 8,
      rank: 8,
      name: 'IIT Kanpur',
      avatar: 'https://via.placeholder.com/40x40',
      score: 8900,
      change: 1,
    ),
    LeaderboardEntry(
      id: 9,
      rank: 9,
      name: 'VIT Vellore',
      avatar: 'https://via.placeholder.com/40x40',
      score: 8600,
      change: -1,
    ),
    LeaderboardEntry(
      id: 10,
      rank: 10,
      name: 'Jadavpur University',
      avatar: 'https://via.placeholder.com/40x40',
      score: 8300,
      change: 0,
    ),
  ];

  final List<LeaderboardEntry> studentLeaderboard = [
    LeaderboardEntry(
      id: 1,
      rank: 1,
      name: 'Rahul Sharma',
      avatar: 'https://via.placeholder.com/40x40',
      score: 2500,
      change: 0,
      college: 'IIT Bombay',
    ),
    LeaderboardEntry(
      id: 2,
      rank: 2,
      name: 'Priya Patel',
      avatar: 'https://via.placeholder.com/40x40',
      score: 2350,
      change: 1,
      college: 'BITS Pilani',
    ),
    LeaderboardEntry(
      id: 3,
      rank: 3,
      name: 'Amit Kumar',
      avatar: 'https://via.placeholder.com/40x40',
      score: 2200,
      change: -1,
      college: 'IIT Delhi',
    ),
    LeaderboardEntry(
      id: 4,
      rank: 4,
      name: 'Sneha Gupta',
      avatar: 'https://via.placeholder.com/40x40',
      score: 2100,
      change: 2,
      college: 'NIT Trichy',
    ),
    LeaderboardEntry(
      id: 5,
      rank: 5,
      name: 'Rajesh Singh',
      avatar: 'https://via.placeholder.com/40x40',
      score: 2050,
      change: -1,
      college: 'IIT Madras',
    ),
    LeaderboardEntry(
      id: 6,
      rank: 6,
      name: 'Neha Verma',
      avatar: 'https://via.placeholder.com/40x40',
      score: 1950,
      change: 1,
      college: 'Delhi University',
    ),
    LeaderboardEntry(
      id: 7,
      rank: 7,
      name: 'Sanjay Joshi',
      avatar: 'https://via.placeholder.com/40x40',
      score: 1900,
      change: -2,
      college: 'IIM Ahmedabad',
    ),
    LeaderboardEntry(
      id: 8,
      rank: 8,
      name: 'Ananya Reddy',
      avatar: 'https://via.placeholder.com/40x40',
      score: 1850,
      change: 0,
      college: 'VIT Vellore',
    ),
    LeaderboardEntry(
      id: 9,
      rank: 9,
      name: 'Vikram Malhotra',
      avatar: 'https://via.placeholder.com/40x40',
      score: 1800,
      change: 3,
      college: 'IIT Kanpur',
    ),
    LeaderboardEntry(
      id: 10,
      rank: 10,
      name: 'Pooja Sharma',
      avatar: 'https://via.placeholder.com/40x40',
      score: 1750,
      change: -1,
      college: 'Jadavpur University',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
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
        title: const Text('Leaderboards'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Colleges'),
            Tab(text: 'Students'),
            Tab(text: 'Quizzes'),
            Tab(text: 'Competitions'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // Colleges Tab
          _buildLeaderboardTab(
            'College Leaderboard',
            'Top performing colleges based on overall participation and achievements.',
            collegeLeaderboard,
            false,
          ),

          // Students Tab
          _buildLeaderboardTab(
            'Student Leaderboard',
            'Top performing students based on quiz scores, competition wins, and forum contributions.',
            studentLeaderboard,
            true,
          ),

          // Quizzes Tab
          _buildLeaderboardTab(
            'Quiz Champions',
            'Students with the highest scores in quizzes and battles.',
            studentLeaderboard,
            true,
          ),

          // Competitions Tab
          _buildLeaderboardTab(
            'Competition Winners',
            'Students and colleges with the most competition wins.',
            studentLeaderboard,
            true,
          ),
        ],
      ),
    );
  }

  Widget _buildLeaderboardTab(
    String title,
    String description,
    List<LeaderboardEntry> entries,
    bool showCollege,
  ) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 4),
          Text(
            description,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: Theme.of(context).colorScheme.onSurfaceVariant,
            ),
          ),
          const SizedBox(height: 16),

          // Filter Options
          Row(
            children: [
              Expanded(
                child: DropdownButtonFormField<String>(
                  value: 'All Time',
                  decoration: const InputDecoration(
                    labelText: 'Time Period',
                    border: OutlineInputBorder(),
                    contentPadding: EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 8,
                    ),
                  ),
                  items:
                      ['All Time', 'This Month', 'This Week', 'Today'].map((
                        period,
                      ) {
                        return DropdownMenuItem<String>(
                          value: period,
                          child: Text(period),
                        );
                      }).toList(),
                  onChanged: (value) {
                    // Filter by time period
                  },
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: DropdownButtonFormField<String>(
                  value: 'All Categories',
                  decoration: const InputDecoration(
                    labelText: 'Category',
                    border: OutlineInputBorder(),
                    contentPadding: EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 8,
                    ),
                  ),
                  items:
                      [
                        'All Categories',
                        'Tech',
                        'Cultural',
                        'Sports',
                        'Academic',
                      ].map((category) {
                        return DropdownMenuItem<String>(
                          value: category,
                          child: Text(category),
                        );
                      }).toList(),
                  onChanged: (value) {
                    // Filter by category
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Top 3 Podium
          if (entries.length >= 3)
            SizedBox(
              height: 180,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  // 2nd Place
                  _buildPodiumItem(context, entries[1], 2, 160, showCollege),

                  // 1st Place
                  _buildPodiumItem(context, entries[0], 1, 180, showCollege),

                  // 3rd Place
                  _buildPodiumItem(context, entries[2], 3, 140, showCollege),
                ],
              ),
            ),

          const SizedBox(height: 16),

          // Rest of the Leaderboard
          Expanded(
            child: ListView.builder(
              itemCount: entries.length - 3,
              itemBuilder: (context, index) {
                final entry = entries[index + 3];
                return LeaderboardCard(entry: entry, showCollege: showCollege);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPodiumItem(
    BuildContext context,
    LeaderboardEntry entry,
    int position,
    double height,
    bool showCollege,
  ) {
    final Color podiumColor =
        position == 1
            ? const Color(0xFFFFD700) // Gold
            : position == 2
            ? const Color(0xFFC0C0C0) // Silver
            : const Color(0xFFCD7F32); // Bronze

    return Expanded(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          CircleAvatar(
            radius: position == 1 ? 40 : 30,
            backgroundImage: NetworkImage(entry.avatar),
          ),
          const SizedBox(height: 8),
          Text(
            entry.name,
            style: Theme.of(
              context,
            ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          if (showCollege && entry.college != null)
            Text(
              entry.college!,
              style: Theme.of(context).textTheme.bodySmall,
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          const SizedBox(height: 4),
          Text(
            '${entry.score} pts',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: Theme.of(context).colorScheme.primary,
            ),
          ),
          const SizedBox(height: 8),
          Container(
            height: height / 3,
            width: double.infinity,
            margin: const EdgeInsets.symmetric(horizontal: 8),
            decoration: BoxDecoration(
              color: podiumColor,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(8),
                topRight: Radius.circular(8),
              ),
            ),
            child: Center(
              child: Text(
                '#${entry.rank}',
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
