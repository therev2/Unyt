import 'package:flutter/material.dart';
import 'package:unyt/widgets/home/notice_card.dart';
import 'package:unyt/widgets/home/event_card.dart';
import 'package:unyt/widgets/home/poll_card.dart';
import 'package:unyt/widgets/home/bulletin_card.dart';
import 'package:unyt/models/notice.dart';
import 'package:unyt/models/event.dart';
import 'package:unyt/models/poll.dart';
import 'package:unyt/models/bulletin.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
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
    fetchNotices();
    fetchEvents();
    fetchBulletins();
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
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
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
                onPressed: () {
                  // Create poll
                },
                icon: const Icon(Icons.add),
                label: const Text('Create Poll'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Expanded(
            child: ListView.builder(
              itemCount: polls.length,
              itemBuilder: (context, index) {
                return PollCard(poll: polls[index]);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChatroomTab() {
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
            child: Container(
              decoration: BoxDecoration(
                border: Border.all(color: Theme.of(context).dividerColor),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                children: [
                  Expanded(
                    child: ListView(
                      padding: const EdgeInsets.all(16),
                      children: [
                        _buildChatMessage(
                          'Rahul Sharma',
                          'Has anyone started working on the OS assignment?',
                          '10:30 AM',
                          'https://via.placeholder.com/40x40',
                          false,
                        ),
                        _buildChatMessage(
                          'Priya Patel',
                          'Yes, I\'ve started. It\'s quite challenging!',
                          '10:32 AM',
                          'https://via.placeholder.com/40x40',
                          false,
                        ),
                        _buildChatMessage(
                          'Me',
                          'I can help you both. Let\'s meet in the library at 4 PM?',
                          '10:35 AM',
                          'https://via.placeholder.com/40x40',
                          true,
                        ),
                      ],
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Row(
                      children: [
                        Expanded(
                          child: TextField(
                            decoration: InputDecoration(
                              hintText: 'Type your message...',
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(24),
                              ),
                              contentPadding: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 8,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        FloatingActionButton(
                          onPressed: () {
                            // Send message
                          },
                          mini: true,
                          child: const Icon(Icons.send),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChatMessage(
    String name,
    String message,
    String time,
    String avatar,
    bool isMe,
  ) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        mainAxisAlignment:
            isMe ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (!isMe) ...[
            CircleAvatar(backgroundImage: NetworkImage(avatar), radius: 16),
            const SizedBox(width: 8),
          ],
          Container(
            constraints: BoxConstraints(
              maxWidth: MediaQuery.of(context).size.width * 0.6,
            ),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color:
                  isMe
                      ? Theme.of(context).colorScheme.primary
                      : Theme.of(context).colorScheme.surfaceVariant,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (!isMe)
                  Text(
                    name,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color:
                          isMe
                              ? Theme.of(context).colorScheme.onPrimary
                              : Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
                  ),
                Text(
                  message,
                  style: TextStyle(
                    color:
                        isMe
                            ? Theme.of(context).colorScheme.onPrimary
                            : Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  time,
                  style: TextStyle(
                    fontSize: 10,
                    color:
                        isMe
                            ? Theme.of(
                              context,
                            ).colorScheme.onPrimary.withOpacity(0.7)
                            : Theme.of(
                              context,
                            ).colorScheme.onSurfaceVariant.withOpacity(0.7),
                  ),
                  textAlign: TextAlign.right,
                ),
              ],
            ),
          ),
          if (isMe) ...[
            const SizedBox(width: 8),
            CircleAvatar(backgroundImage: NetworkImage(avatar), radius: 16),
          ],
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
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
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
