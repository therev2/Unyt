import 'package:flutter/material.dart';
import 'package:unyt/widgets/home/notice_card.dart';
import 'package:unyt/widgets/home/event_card.dart';
import 'package:unyt/widgets/home/poll_card.dart';
import 'package:unyt/widgets/home/bulletin_card.dart';
import 'package:unyt/models/notice.dart';
import 'package:unyt/models/event.dart';
import 'package:unyt/models/poll.dart';
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

  // Sample data - in a real app, this would come from your API
  final List<Notice> notices = [
    Notice(
      id: 1,
      title: 'National Education Policy Updates',
      content:
          'Important updates to the National Education Policy affecting all colleges across the country. New guidelines to be implemented by next semester.',
      date: 'Apr 25, 2023',
      author: 'Ministry of Education',
      important: true,
    ),
    Notice(
      id: 2,
      title: 'National Scholarship Applications Open',
      content:
          'Applications for national merit scholarships are now open. Eligible students can apply through the national scholarship portal by May 15th.',
      date: 'Apr 22, 2023',
      author: 'Scholarship Committee',
      important: false,
    ),
    Notice(
      id: 3,
      title: 'Inter-University Credit Transfer System',
      content:
          'A new credit transfer system has been implemented to allow students to transfer credits between universities more easily.',
      date: 'Apr 20, 2023',
      author: 'University Grants Commission',
      important: false,
    ),
  ];

  final List<Event> events = [
    Event(
      id: 1,
      title: 'National Innovation Summit',
      description:
          'Join students from across the country for the biggest innovation summit. Connect with industry leaders and showcase your projects.',
      date: 'May 25-27, 2023',
      location: 'Delhi Convention Center',
      image: 'https://via.placeholder.com/200x100',
      organizer: 'Ministry of Education',
    ),
    Event(
      id: 2,
      title: 'All India Hackathon 2023',
      description:
          'A 48-hour coding marathon with participants from universities across India. Form teams and solve real-world problems.',
      date: 'Jun 10-12, 2023',
      location: 'Virtual Event',
      image: 'https://via.placeholder.com/200x100',
      organizer: 'Tech Education Council',
    ),
    Event(
      id: 3,
      title: 'Global Student Conference',
      description:
          'An international conference for students to present research papers and network with global academic leaders.',
      date: 'July 5-8, 2023',
      location: 'Mumbai International Center',
      image: 'https://via.placeholder.com/200x100',
      organizer: 'Global Education Alliance',
    ),
  ];

  final List<Poll> polls = [
    Poll(
      id: 1,
      question: 'What skill should be included in all college curriculums?',
      options: [
        PollOption(id: 1, text: 'Financial Literacy', votes: 2345),
        PollOption(id: 2, text: 'Programming', votes: 1892),
        PollOption(id: 3, text: 'Public Speaking', votes: 1547),
        PollOption(id: 4, text: 'Entrepreneurship', votes: 1326),
      ],
      totalVotes: 7110,
      endDate: 'May 10, 2023',
    ),
    Poll(
      id: 2,
      question: 'Should online examinations become a permanent option?',
      options: [
        PollOption(id: 1, text: 'Yes, for all courses', votes: 3280),
        PollOption(id: 2, text: 'Only for theory courses', votes: 2145),
        PollOption(id: 3, text: 'No, in-person exams are better', votes: 1870),
      ],
      totalVotes: 7295,
      endDate: 'May 15, 2023',
    ),
  ];

  final List<Bulletin> bulletins = [
    Bulletin(
      id: 1,
      title: 'Virtual Study Group for GATE Exam',
      content:
          'Creating a nationwide virtual study group for GATE exam preparation. Join if you\'re appearing for any discipline. Contact: nationalgate@gmail.com',
      author: BulletinAuthor(
        name: 'Vikram Singh',
        avatar: 'https://via.placeholder.com/40x40',
      ),
      date: 'Apr 24, 2023',
    ),
    Bulletin(
      id: 2,
      title: 'Research Paper Collaboration',
      content:
          'Looking for collaborators on a machine learning research paper. Need students with good understanding of neural networks and NLP.',
      author: BulletinAuthor(
        name: 'Dr. Ramesh Kumar',
        avatar: 'https://via.placeholder.com/40x40',
      ),
      date: 'Apr 23, 2023',
    ),
    Bulletin(
      id: 3,
      title: 'Nationwide Quiz Competition Recruitment',
      content:
          'Forming a team for the upcoming National Quiz League. Need participants with knowledge in science, history, sports, and current affairs.',
      author: BulletinAuthor(
        name: 'Quiz Club Federation',
        avatar: 'https://via.placeholder.com/40x40',
      ),
      date: 'Apr 20, 2023',
    ),
  ];

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
            child: ListView.builder(
              itemCount: notices.length,
              itemBuilder: (context, index) {
                return NoticeCard(notice: notices[index]);
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
            child: ListView.builder(
              itemCount: events.length,
              itemBuilder: (context, index) {
                return EventCard(event: events[index]);
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
                onPressed: () {
                  // Create poll
                },
                icon: const Icon(Icons.add),
                label: const Text('Create Poll'),
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
            child: ListView.builder(
              itemCount: polls.length,
              itemBuilder: (context, index) {
                return PollCard(
                  poll: polls[index],
                  collegeId: 'global', // TODO: Replace with actual global context if needed
                  pollId: polls[index].id.toString(),
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
                  // Post to bulletin
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
            child: ListView.builder(
              itemCount: bulletins.length,
              itemBuilder: (context, index) {
                return BulletinCard(bulletin: bulletins[index]);
              },
            ),
          ),
        ],
      ),
    );
  }
}
