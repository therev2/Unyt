import 'package:flutter/material.dart';
import 'package:unyt/widgets/home/notice_card.dart';
import 'package:unyt/widgets/home/event_card.dart';
import 'package:unyt/widgets/home/poll_card.dart';
import 'package:unyt/widgets/home/bulletin_card.dart';
import 'package:unyt/models/notice.dart';
import 'package:unyt/models/event.dart';
import 'package:unyt/models/poll.dart';
import 'package:unyt/services/global_poll_admin_service.dart';
import 'package:unyt/models/bulletin.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:unyt/screens/chatbot/chatbot_screen.dart';

class GlobalFeedScreen extends StatefulWidget {
  const GlobalFeedScreen({super.key});

  @override
  State<GlobalFeedScreen> createState() => _GlobalFeedScreenState();
}

class _GlobalFeedScreenState extends State<GlobalFeedScreen> {
  int _selectedIndex = 0;
  final PageController _pageController = PageController();

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
    _pageController.animateToPage(
      index,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            DrawerHeader(
              decoration: BoxDecoration(
                color: Theme.of(context).primaryColor,
              ),
              child: Text('Main Navigation', style: TextStyle(color: Colors.white, fontSize: 20)),
            ),
            ListTile(
              leading: Icon(Icons.notifications_none),
              title: Text('Notices'),
              onTap: () {
                Navigator.pop(context);
                _onItemTapped(0);
              },
            ),
            ListTile(
              leading: Icon(Icons.event_outlined),
              title: Text('Events'),
              onTap: () {
                Navigator.pop(context);
                _onItemTapped(1);
              },
            ),
            ListTile(
              leading: Icon(Icons.poll_outlined),
              title: Text('Polls'),
              onTap: () {
                Navigator.pop(context);
                _onItemTapped(2);
              },
            ),
            ListTile(
              leading: Icon(Icons.chat_bubble_outline),
              title: Text('Chat'),
              onTap: () {
                Navigator.pop(context);
                _onItemTapped(3);
              },
            ),
            ListTile(
              leading: Icon(Icons.dashboard_outlined),
              title: Text('Bulletin'),
              onTap: () {
                Navigator.pop(context);
                _onItemTapped(4);
              },
            ),
            const Divider(),
            ListTile(
              leading: Icon(Icons.smart_toy_outlined),
              title: Text('Gemini Chatbot'),
              onTap: () {
                Navigator.pop(context);
                Navigator.of(context).push(
                  MaterialPageRoute(builder: (context) => const ChatbotScreen()),
                );
              },
            ),
          ],
        ),
      ),
      body: PageView(
        controller: _pageController,
        onPageChanged: (index) {
          setState(() {
            _selectedIndex = index;
          });
        },
        children: [
          // Global Notices Tab
          _buildNoticesTab(),

          // Global Events Tab
          _buildEventsTab(),

          // Global Polls Tab
          _buildPollsTab(),

          // Global Chatroom Tab
          _buildChatroomTab(),

          // Global Bulletin Tab
          _buildBulletinTab(),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.notifications_none),
            activeIcon: Icon(Icons.notifications),
            label: 'Notices',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.event_outlined),
            activeIcon: Icon(Icons.event),
            label: 'Events',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.poll_outlined),
            activeIcon: Icon(Icons.poll),
            label: 'Polls',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.chat_bubble_outline),
            activeIcon: Icon(Icons.chat_bubble),
            label: 'Chat',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard_outlined),
            activeIcon: Icon(Icons.dashboard),
            label: 'Bulletin',
          ),
        ],
      ),
    );
  }

  Widget _buildNoticesTab() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Global Notices',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              ElevatedButton.icon(
                onPressed: () {
                  // Subscribe to notifications
                },
                icon: const Icon(Icons.notifications),
                label: const Text('Subscribe'),
                style: const ButtonStyle(
                  padding: MaterialStatePropertyAll(
                    EdgeInsets.symmetric(horizontal: 16.0),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Expanded(
            child: StreamBuilder<QuerySnapshot>(
              stream: FirebaseFirestore.instance
                  .collection('GlobalNotices')
                  .orderBy('datetime', descending: true)
                  .snapshots(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (snapshot.hasError) {
                  return Center(child: Text('Error: [${snapshot.error}'));
                }
                final docs = snapshot.data?.docs ?? [];
                if (docs.isEmpty) {
                  return const Center(child: Text('No notices yet.'));
                }
                return ListView.builder(
                  itemCount: docs.length,
                  itemBuilder: (context, index) {
                    final data = docs[index].data() as Map<String, dynamic>;
                    return NoticeCard(
                      notice: Notice(
                        id: docs[index].id.hashCode, // Use hashCode of string id for int
                        title: data['title'] ?? '',
                        content: data['content'] ?? '',
                        date: (data['datetime'] is Timestamp)
                            ? (data['datetime'] as Timestamp).toDate().toString()
                            : (data['datetime']?.toString() ?? ''),
                        author: data['author'] ?? 'Unknown',
                        important: data['important'] ?? false,
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEventsTab() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Wrap(
            alignment: WrapAlignment.spaceBetween,
            crossAxisAlignment: WrapCrossAlignment.center,
            runSpacing: 10.0, // Space between rows when wrapped
            children: [
              Text(
                'National & Global Events',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              ElevatedButton.icon(
                onPressed: () {
                  // Implement calendar integration
                },
                icon: const Icon(Icons.calendar_today),
                label: const Text('Add to Calendar'),
                style: const ButtonStyle(
                  padding: MaterialStatePropertyAll(
                    EdgeInsets.symmetric(horizontal: 16.0),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Expanded(
            child: StreamBuilder<QuerySnapshot>(
              stream: FirebaseFirestore.instance
                  .collection('GlobalEvents')
                  .orderBy('datetime', descending: true)
                  .snapshots(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (snapshot.hasError) {
                  return Center(child: Text('Error: [${snapshot.error}'));
                }
                final docs = snapshot.data?.docs ?? [];
                if (docs.isEmpty) {
                  return const Center(child: Text('No events yet.'));
                }
                return ListView.builder(
                  itemCount: docs.length,
                  itemBuilder: (context, index) {
                    final data = docs[index].data() as Map<String, dynamic>;
                    return EventCard(
                      event: Event(
                        id: docs[index].id.hashCode, // Use hashCode of string id for int
                        title: data['title'] ?? '',
                        description: data['description'] ?? '',
                        date: (data['datetime'] is Timestamp)
                            ? (data['datetime'] as Timestamp).toDate().toString()
                            : (data['datetime']?.toString() ?? ''),
                        location: data['location'] ?? '',
                        image: data['image'] ?? '',
                        organizer: data['organizer'] ?? '',
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPollsTab() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'National Polls',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              ElevatedButton.icon(
                onPressed: () async {
                  await GlobalPollAdminService.createSampleGlobalPolls();
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Sample polls created!')),
                  );
                },
                icon: const Icon(Icons.add),
                label: const Text('Sample Polls'),
                style: const ButtonStyle(
                  padding: MaterialStatePropertyAll(
                    EdgeInsets.symmetric(horizontal: 16.0),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Expanded(
            child: StreamBuilder<QuerySnapshot>(
              stream: FirebaseFirestore.instance
                  .collection('GlobalPolls')
                  .orderBy('endDate', descending: true)
                  .snapshots(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (snapshot.hasError) {
                  return Center(child: Text('Error: [${snapshot.error}'));
                }
                final pollDocs = snapshot.data!.docs;
                return ListView.builder(
                  itemCount: pollDocs.length,
                  itemBuilder: (context, index) {
                    final pollData = pollDocs[index].data() as Map<String, dynamic>;
                    final pollId = pollDocs[index].id;
                    final poll = Poll(
                      id: pollId.hashCode, // Use hashCode of string id for int
                      question: pollData['question'] ?? '',
                      options: (pollData['options'] as List<dynamic>? ?? []).map((o) {
                        final option = o as Map<String, dynamic>;
                        return PollOption(
                          id: option['id'] ?? 0,
                          text: option['text'] ?? '',
                          votes: option['votes'] ?? 0,
                        );
                      }).toList(),
                      totalVotes: pollData['totalVotes'] ?? 0,
                      endDate: pollData['endDate'] ?? '',
                    );
                    return PollCard(
                      poll: poll,
                      collegeId: 'global',
                      pollId: pollId,
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChatroomTab() {
    final user = FirebaseAuth.instance.currentUser;
    final TextEditingController _messageController = TextEditingController();
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'National Student Network',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: 8),
          Text(
            'Chat with students from all across the country',
            style: Theme.of(context).textTheme.bodyMedium,
          ),
          const SizedBox(height: 16),
          Expanded(
            child: StreamBuilder<QuerySnapshot>(
              stream: FirebaseFirestore.instance
                  .collection('GlobalChatroom')
                  .doc('Messages')
                  .collection('Messages')
                  .orderBy('timestamp', descending: true)
                  .snapshots(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (!snapshot.hasData) {
                  return const Center(child: Text('No messages yet.'));
                }
                // Filter out messages with null timestamp
                final messages = snapshot.data!.docs.where((doc) => doc['timestamp'] != null).toList();
                if (messages.isEmpty) {
                  return const Center(child: Text('No messages yet.'));
                }
                return ListView.builder(
                  reverse: true,
                  itemCount: messages.length,
                  itemBuilder: (context, index) {
                    final msg = messages[index].data() as Map<String, dynamic>;
                    final isMe = msg['senderId'] == user?.uid;
                    return ListTile(
                      leading: isMe ? null : CircleAvatar(
                        backgroundImage: msg['senderAvatar'] != null && msg['senderAvatar'] != ''
                          ? NetworkImage(msg['senderAvatar'])
                          : null,
                        child: (msg['senderAvatar'] == null || msg['senderAvatar'] == '') ? const Icon(Icons.person) : null,
                      ),
                      trailing: isMe ? CircleAvatar(
                        backgroundImage: msg['senderAvatar'] != null && msg['senderAvatar'] != ''
                          ? NetworkImage(msg['senderAvatar'])
                          : null,
                        child: (msg['senderAvatar'] == null || msg['senderAvatar'] == '') ? const Icon(Icons.person) : null,
                      ) : null,
                      title: Text(msg['senderName'] ?? 'Unknown'),
                      subtitle: Text(msg['text'] ?? ''),
                      dense: true,
                    );
                  },
                );
              },
            ),
          ),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _messageController,
                  decoration: const InputDecoration(
                    hintText: 'Type your message...',
                  ),
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                icon: const Icon(Icons.send),
                onPressed: user == null
                    ? null
                    : () async {
                        final text = _messageController.text.trim();
                        if (text.isEmpty) return;
                        // Fetch sender info (name, avatar)
                        final studentDoc = await FirebaseFirestore.instance
                            .collection('Students')
                            .doc(user.uid)
                            .get();
                        final senderName = studentDoc.data()?['name'] ?? 'Unknown';
                        final senderAvatar = studentDoc.data()?['avatar'] ?? '';
                        await FirebaseFirestore.instance
                            .collection('GlobalChatroom')
                            .doc('Messages')
                            .collection('Messages')
                            .add({
                          'senderId': user.uid,
                          'senderName': senderName,
                          'senderAvatar': senderAvatar,
                          'text': text,
                          'timestamp': FieldValue.serverTimestamp(),
                        });
                        _messageController.clear();
                      },
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBulletinTab() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Wrap(
            runSpacing: 8,
            direction: Axis.horizontal,
            children: [
              Text(
                'National Bulletin Board',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              ElevatedButton.icon(
                onPressed: () {
                  // TODO: Implement post to bulletin
                },
                icon: const Icon(Icons.add),
                label: const Text('Post to Bulletin'),
                style: const ButtonStyle(
                  padding: MaterialStatePropertyAll(
                    EdgeInsets.symmetric(horizontal: 16.0),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Expanded(
            child: StreamBuilder<QuerySnapshot>(
              stream: FirebaseFirestore.instance
                  .collection('GlobalBulletin')
                  .orderBy('datetime', descending: true)
                  .snapshots(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (snapshot.hasError) {
                  return Center(child: Text('Error: [${snapshot.error}'));
                }
                final docs = snapshot.data?.docs ?? [];
                if (docs.isEmpty) {
                  return const Center(child: Text('No bulletin posts yet.'));
                }
                return ListView.builder(
                  itemCount: docs.length,
                  itemBuilder: (context, index) {
                    final data = docs[index].data() as Map<String, dynamic>;
                    return BulletinCard(
                      bulletin: Bulletin(
                        id: docs[index].id.hashCode, // Use hashCode of string id for int
                        title: data['title'] ?? '',
                        content: data['content'] ?? '',
                        author: BulletinAuthor(
                          name: data['author_name'] ?? 'Anonymous',
                          avatar: data['author_avatar'] ?? '',
                        ),
                        date: (data['datetime'] is Timestamp)
                            ? (data['datetime'] as Timestamp).toDate().toString()
                            : (data['datetime']?.toString() ?? ''),
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
