import 'package:flutter/material.dart';
import 'package:unyt/widgets/home/notice_card.dart';
import 'package:unyt/widgets/home/event_card.dart';
import 'package:unyt/widgets/home/poll_card.dart';
import 'package:unyt/widgets/home/bulletin_card.dart';
import 'package:unyt/models/notice.dart';
import 'package:unyt/models/event.dart';
import 'package:unyt/models/poll.dart';
import 'package:unyt/services/poll_admin_service.dart';
import 'package:unyt/models/bulletin.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String? _collegeId;
  bool _isCollegeIdLoading = true;
  int _selectedIndex = 0;
  final PageController _pageController = PageController();
  List<Notice> notices = [];
  bool _isLoading = true;
  List<Event> events = [];
  bool _isEventsLoading = true;
  List<Bulletin> bulletins = [];
  bool _isBulletinsLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchCollegeId();
    fetchNotices();
    fetchEvents();
    fetchBulletins();
  }

  Future<void> _fetchCollegeId() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) return;
    final studentDoc = await FirebaseFirestore.instance
        .collection('Students')
        .doc(user.uid)
        .get();
    setState(() {
      _collegeId = studentDoc.data()?['collegeId'];
      _isCollegeIdLoading = false;
    });
  }

  Future<void> fetchNotices() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final user = FirebaseAuth.instance.currentUser;
      if (user == null) throw Exception('No user signed in');
      print('Current user: ${user.uid}');

      final studentDoc = await FirebaseFirestore.instance
          .collection('Students')
          .doc(user.uid)
          .get();
      print('Student doc data: ${studentDoc.data()}');
      final collegeId = studentDoc.data()?['collegeId'];
      if (collegeId == null) throw Exception('No collegeId found for student');
      print('College ID: ${collegeId}');

      final noticesSnapshot = await FirebaseFirestore.instance
          .collection('Colleges')
          .doc(collegeId)
          .collection('Notices')
          .get();
      print('Number of notices fetched: ${noticesSnapshot.docs.length}');

      final fetchedNotices = noticesSnapshot.docs.map((doc) {
        final data = doc.data();
        print('Notice data: ${data}');
        return Notice(
          id: data['id'] ?? 0,
          title: data['title'] ?? '',
          content: data['content'] ?? '',
          date: data['date'] ?? '',
          author: data['author'] ?? '',
          important: data['important'] ?? false,
        );
      }).toList();

      setState(() {
        notices = fetchedNotices;
        _isLoading = false;
      });
    } catch (e) {
      print('Error fetching notices: ${e}');
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> fetchEvents() async {
    setState(() {
      _isEventsLoading = true;
    });

    try {
      final user = FirebaseAuth.instance.currentUser;
      if (user == null) throw Exception('No user signed in');
      print('Current user: ${user.uid}');

      final studentDoc = await FirebaseFirestore.instance
          .collection('Students')
          .doc(user.uid)
          .get();
      print('Student doc data: ${studentDoc.data()}');
      final collegeId = studentDoc.data()?['collegeId'];
      if (collegeId == null) throw Exception('No collegeId found for student');
      print('College ID: ${collegeId}');

      final eventsSnapshot = await FirebaseFirestore.instance
          .collection('Colleges')
          .doc(collegeId)
          .collection('Events')
          .get();
      print('Number of events fetched: ${eventsSnapshot.docs.length}');

      final fetchedEvents = eventsSnapshot.docs.map((doc) {
        final data = doc.data();
        print('Event data: ${data}');
        return Event(
          id: data['id'] ?? 0,
          title: data['title'] ?? '',
          description: data['description'] ?? '',
          date: data['date'] ?? '',
          location: data['location'] ?? '',
          image: data['image'] ?? '',
          organizer: data['organizer'] ?? '',
        );
      }).toList();

      setState(() {
        events = fetchedEvents;
        _isEventsLoading = false;
      });
    } catch (e) {
      print('Error fetching events: ${e}');
      setState(() {
        _isEventsLoading = false;
      });
    }
  }

  Future<void> fetchBulletins() async {
    setState(() {
      _isBulletinsLoading = true;
    });

    try {
      final user = FirebaseAuth.instance.currentUser;
      if (user == null) throw Exception('No user signed in');
      print('Current user: ${user.uid}');

      final studentDoc = await FirebaseFirestore.instance
          .collection('Students')
          .doc(user.uid)
          .get();
      print('Student doc data: ${studentDoc.data()}');
      final collegeId = studentDoc.data()?['collegeId'];
      if (collegeId == null) throw Exception('No collegeId found for student');
      print('College ID: ${collegeId}');

      final bulletinsSnapshot = await FirebaseFirestore.instance
          .collection('Colleges')
          .doc(collegeId)
          .collection('Bulletin')
          .get();
      print('Number of bulletins fetched: ${bulletinsSnapshot.docs.length}');

      final fetchedBulletins = bulletinsSnapshot.docs.map((doc) {
        final data = doc.data();
        print('Bulletin data: ${data}');
        return Bulletin(
          id: data['id'] ?? 0,
          title: data['title'] ?? '',
          content: data['content'] ?? '',
          author: BulletinAuthor(
            name: data['author_name'] ?? '',
            avatar: data['author_avatar'] ?? '',
          ),
          date: data['date'] ?? '',
        );
      }).toList();

      setState(() {
        bulletins = fetchedBulletins;
        _isBulletinsLoading = false;
      });
    } catch (e) {
      print('Error fetching bulletins: ${e}');
      setState(() {
        _isBulletinsLoading = false;
      });
    }
  }

  final List<Poll> polls = [
    Poll(
      id: 1,
      question: 'When should we schedule the department picnic?',
      options: [
        PollOption(id: 1, text: 'Next Saturday', votes: 45),
        PollOption(id: 2, text: 'Next Sunday', votes: 32),
        PollOption(id: 3, text: 'The following weekend', votes: 18),
      ],
      totalVotes: 95,
      endDate: 'Apr 25, 2023',
    ),
    Poll(
      id: 2,
      question:
          'Which guest speaker would you prefer for the technical symposium?',
      options: [
        PollOption(id: 1, text: 'Dr. Jane Smith (AI Researcher)', votes: 78),
        PollOption(id: 2, text: 'Mr. John Doe (Industry Expert)', votes: 64),
        PollOption(id: 3, text: 'Prof. Alice Johnson (Academic)', votes: 42),
      ],
      totalVotes: 184,
      endDate: 'Apr 30, 2023',
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
      body: PageView(
        controller: _pageController,
        onPageChanged: (index) {
          setState(() {
            _selectedIndex = index;
          });
        },
        children: [
          // Notices Tab
          _buildNoticesTab(),

          // Events Tab
          _buildEventsTab(),

          // Polls Tab
          _buildPollsTab(),

          // Chatroom Tab
          _buildChatroomTab(),

          // Bulletin Tab
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
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'College Notices',
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
    if (_isEventsLoading) {
      return const Center(child: CircularProgressIndicator());
    }
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Wrap(
            runSpacing: 8,
            spacing: 8.0,
            alignment: WrapAlignment.spaceBetween,
            children: [
              Text(
                'Upcoming Events',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              ElevatedButton.icon(
                onPressed: () {
                  // Add to calendar
                },
                icon: const Icon(Icons.calendar_today),
                label: const Text('Add to Calendar'),
                style: const ButtonStyle(
                  padding: WidgetStatePropertyAll(
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
                'Active Polls',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              ElevatedButton.icon(
                onPressed: _collegeId == null ? null : () async {
                  await PollAdminService.createSamplePolls(_collegeId!);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Sample polls created!')),
                  );
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
          if (_isCollegeIdLoading)
            const Center(child: CircularProgressIndicator())
          else if (_collegeId == null)
            const Center(child: Text('No college ID found.'))
          else
            Expanded(
              child: StreamBuilder(
                stream: FirebaseFirestore.instance
                    .collection('Colleges')
                    .doc(_collegeId)
                    .collection('Polls')
                    .snapshots(),
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator());
                  }
                  if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
                    return const Center(child: Text('No polls found.'));
                  }
                  final pollDocs = snapshot.data!.docs;
                  return ListView.builder(
                    itemCount: pollDocs.length,
                    itemBuilder: (context, index) {
                      final pollData = pollDocs[index].data();
                      final pollId = pollDocs[index].id;
                      final poll = Poll(
                        id: index, // or use pollId if your model supports it
                        question: pollData['question'] ?? '',
                        options: (pollData['options'] as List<dynamic>).map((o) => PollOption(
                          id: o['id'],
                          text: o['text'],
                          votes: o['votes'],
                        )).toList(),
                        totalVotes: pollData['totalVotes'] ?? 0,
                        endDate: pollData['endDate'] ?? '',
                      );
                      return PollCard(
                        poll: poll,
                        collegeId: _collegeId!,
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
    if (_isCollegeIdLoading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_collegeId == null) {
      return const Center(child: Text('No college ID found.'));
    }
    final user = FirebaseAuth.instance.currentUser;
    print('[_buildChatroomTab] _collegeId: \x1B[32m'+_collegeId.toString()+'\x1B[0m, user: \x1B[32m');
    final TextEditingController _messageController = TextEditingController();
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'College Chatroom',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: 8),
          Text(
            'Chat with your college mates',
            style: Theme.of(context).textTheme.bodyMedium,
          ),
          const SizedBox(height: 16),
          Expanded(
            child: StreamBuilder<QuerySnapshot>(
              stream: FirebaseFirestore.instance
                  .collection('Colleges')
                  .doc(_collegeId)
                  .collection('ChatroomMessages')
                  .orderBy('timestamp', descending: true)
                  .snapshots(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (!snapshot.hasData) {
                  print('[Chatroom StreamBuilder] No snapshot data');
                  return const Center(child: Text('No messages yet.'));
                }
                // Filter out messages with null timestamp
                final messages = snapshot.data!.docs.where((doc) => doc['timestamp'] != null).toList();
                print('[Chatroom StreamBuilder] Messages count: \x1B[33m${messages.length}\x1B[0m');
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
                onPressed: user == null || _collegeId == null
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
                        print('[SendMessage] Sending message to collegeId: \x1B[36m$_collegeId\x1B[0m, sender: $senderName');
                        await FirebaseFirestore.instance
                            .collection('Colleges')
                            .doc(_collegeId)
                            .collection('ChatroomMessages')
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
    if (_isBulletinsLoading) {
      return const Center(child: CircularProgressIndicator());
    }
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
                'Student Bulletin Board',
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
