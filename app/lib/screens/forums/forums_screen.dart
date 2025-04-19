import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
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
  int _selectedTabIndex = 0;

  // Fetch topics from Firestore
  Stream<List<ForumTopic>> getTopicsStream() {
    return FirebaseFirestore.instance
        .collection('Discussion')
        .snapshots()
        .map((snapshot) => snapshot.docs.map((doc) {
              final data = doc.data();
              return ForumTopic(
                id: int.tryParse(doc.id) ?? 0,
                title: data['title'] ?? '',
                description: data['description'] ?? '',
                category: data['category'] ?? '',
                author: ForumAuthor(
                  name: data['author']['name'] ?? '',
                  college: data['author']['college'] ?? '',
                  avatar: data['author']['avatar'] ?? '',
                ),
                createdAt: data['createdAt'] ?? '',
                lastActivity: data['lastActivity'] ?? '',
                views: data['views'] ?? 0,
                replies: data['replies'] ?? 0,
                isSticky: data['isSticky'] ?? false,
                upvotes: data['upvotes'] ?? 0,
                upvotedBy: List<String>.from(data['upvotedBy'] ?? []),
              );
            }).toList().cast<ForumTopic>());
  }

  // Helper to fetch the number of topics and posts (replies)
  Stream<Map<String, int>> getForumStatsStream() {
    return FirebaseFirestore.instance.collection('Discussion').snapshots().map((snapshot) {
      int topicCount = snapshot.docs.length;
      int postCount = 0;
      for (final doc in snapshot.docs) {
        final data = doc.data();
        final replies = data['replies'];
        postCount += (replies is int ? replies : (replies is num ? replies.toInt() : 0)) + 1;
      }
      return {
        'topics': topicCount,
        'posts': postCount,
      };
    });
  }

  // Helper to get the category for each tab
  String? _getCategoryForTab(int index) {
    switch (index) {
      case 1:
        return 'Academics';
      case 2:
        return 'Career';
      case 3:
        return 'Technology';
      case 4:
        return 'Campus Life';
      default:
        return null; // All
    }
  }

  // Filter topics by category
  List<ForumTopic> _filterTopicsByCategory(List<ForumTopic> topics, int tabIndex) {
    final category = _getCategoryForTab(tabIndex);
    if (category == null) return topics;
    return topics.where((topic) => topic.category == category).toList();
  }

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 5, vsync: this);
    _tabController.addListener(() {
      if (_tabController.indexIsChanging) {
        setState(() {
          _selectedTabIndex = _tabController.index;
        });
      }
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Discussion Forum'),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          tabs: const [
            Tab(text: 'All'),
            Tab(text: 'Academics'),
            Tab(text: 'Career'),
            Tab(text: 'Technology'),
            Tab(text: 'Campus Life'),
          ],
        ),
      ),
      body: Column(
        children: [
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
          StreamBuilder<Map<String, int>>(
            stream: getForumStatsStream(),
            builder: (context, snapshot) {
              final stats = snapshot.data ?? {'topics': 0, 'posts': 0};
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildStatItem(context, stats['topics'].toString(), 'Topics'),
                        _buildStatItem(context, stats['posts'].toString(), 'Posts'),
                        _buildStatItem(context, '12.8K', 'Members'),
                        _buildStatItem(context, '450', 'Online'),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),

          // Topics List
          Expanded(
            child: StreamBuilder<List<ForumTopic>>(
              stream: getTopicsStream(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return const Center(child: Text('No topics yet.'));
                }
                final topics = _filterTopicsByCategory(snapshot.data!, _selectedTabIndex);
                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: topics.length,
                  itemBuilder: (context, index) {
                    return TopicCard(topic: topics[index]);
                  },
                );
              },
            ),
          ),
        ],
      ),
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
}
