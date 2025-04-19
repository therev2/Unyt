import 'package:flutter/material.dart';
import 'package:unyt/models/forum_topic.dart';
import 'package:unyt/widgets/forums/topic_card.dart';

class ForumsScreen extends StatefulWidget {
  const ForumsScreen({super.key});

  @override
  State<ForumsScreen> createState() => _ForumsScreenState();
}

class _ForumsScreenState extends State<ForumsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final TextEditingController _searchController = TextEditingController();

  // Sample data - in a real app, this would come from your API
  final List<ForumTopic> topics = [
    ForumTopic(
      id: 1,
      title: 'Tips for Semester Exams',
      description:
          'Share your study tips and strategies for the upcoming semester exams.',
      category: 'Academics',
      author: ForumAuthor(
        name: 'Rahul Sharma',
        college: 'NIT Trichy',
        avatar: 'https://via.placeholder.com/40x40',
      ),
      createdAt: '2 days ago',
      lastActivity: '3 hours ago',
      views: 342,
      replies: 28,
      isSticky: true,
    ),
    ForumTopic(
      id: 2,
      title: 'Campus Placement Preparation',
      description:
          'Discussion on how to prepare for campus placements and interviews.',
      category: 'Career',
      author: ForumAuthor(
        name: 'Priya Patel',
        college: 'IIT Bombay',
        avatar: 'https://via.placeholder.com/40x40',
      ),
      createdAt: '1 week ago',
      lastActivity: '1 day ago',
      views: 520,
      replies: 45,
      isSticky: false,
    ),
    ForumTopic(
      id: 3,
      title: 'Best Coding Bootcamps',
      description:
          'Recommendations for coding bootcamps and online courses for skill development.',
      category: 'Technology',
      author: ForumAuthor(
        name: 'Amit Kumar',
        college: 'BITS Pilani',
        avatar: 'https://via.placeholder.com/40x40',
      ),
      createdAt: '3 days ago',
      lastActivity: '12 hours ago',
      views: 210,
      replies: 15,
      isSticky: false,
    ),
    ForumTopic(
      id: 4,
      title: 'Hostel Life Hacks',
      description:
          'Share your tips and tricks for making hostel life more comfortable and enjoyable.',
      category: 'Campus Life',
      author: ForumAuthor(
        name: 'Sneha Gupta',
        college: 'Delhi University',
        avatar: 'https://via.placeholder.com/40x40',
      ),
      createdAt: '5 days ago',
      lastActivity: '2 days ago',
      views: 430,
      replies: 32,
      isSticky: false,
    ),
    ForumTopic(
      id: 5,
      title: 'Internship Opportunities Summer 2023',
      description:
          'Discussion on internship opportunities for the summer of 2023.',
      category: 'Career',
      author: ForumAuthor(
        name: 'Rajesh Singh',
        college: 'IIM Ahmedabad',
        avatar: 'https://via.placeholder.com/40x40',
      ),
      createdAt: '1 week ago',
      lastActivity: '3 days ago',
      views: 650,
      replies: 48,
      isSticky: true,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 5, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // TabBar
        TabBar(
          controller: _tabController,
          isScrollable: true,
          tabs: const [
            Tab(text: 'All Topics'),
            Tab(text: 'Academics'),
            Tab(text: 'Career'),
            Tab(text: 'Technology'),
            Tab(text: 'Campus Life'),
          ],
        ),
        // Search Bar
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: TextField(
            controller: _searchController,
            decoration: InputDecoration(
              hintText: 'Search topics...',
              prefixIcon: const Icon(Icons.search),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              contentPadding: const EdgeInsets.symmetric(vertical: 0),
              filled: true,
              fillColor: Theme.of(
                context,
              ).colorScheme.surfaceVariant.withOpacity(0.3),
            ),
          ),
        ),

        // Forum Stats
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildStatItem(context, '120', 'Topics'),
                  _buildStatItem(context, '3.5K', 'Posts'),
                  _buildStatItem(context, '12.8K', 'Members'),
                  _buildStatItem(context, '450', 'Online'),
                ],
              ),
            ),
          ),
        ),

        // Topics List
        Expanded(
          child: TabBarView(
            controller: _tabController,
            children: [
              // All Topics Tab
              _buildTopicsList(topics),

              // Academics Tab
              _buildTopicsList(
                topics.where((topic) => topic.category == 'Academics').toList(),
              ),

              // Career Tab
              _buildTopicsList(
                topics.where((topic) => topic.category == 'Career').toList(),
              ),

              // Technology Tab
              _buildTopicsList(
                topics
                    .where((topic) => topic.category == 'Technology')
                    .toList(),
              ),

              // Campus Life Tab
              _buildTopicsList(
                topics
                    .where((topic) => topic.category == 'Campus Life')
                    .toList(),
              ),
            ],
          ),
        ),
      ],
      // FloatingActionButton will be handled by the parent Scaffold if needed
    );
  }

  Widget _buildStatItem(BuildContext context, String value, String label) {
    return Column(
      children: [
        Text(
          value,
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.bold,
            color: Theme.of(context).colorScheme.primary,
          ),
        ),
        Text(label, style: Theme.of(context).textTheme.bodySmall),
      ],
    );
  }

  Widget _buildTopicsList(List<ForumTopic> topicsList) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: topicsList.length,
      itemBuilder: (context, index) {
        return TopicCard(topic: topicsList[index]);
      },
    );
  }
}
