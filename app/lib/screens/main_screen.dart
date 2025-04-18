import 'package:flutter/material.dart';
import 'package:unyt/screens/home/home_screen.dart';
import 'package:unyt/screens/feed/global_feed_screen.dart';
import 'package:unyt/screens/events/events_screen.dart';
import 'package:unyt/screens/quizzes/quizzes_screen.dart';
import 'package:unyt/screens/forums/forums_screen.dart';
import 'package:unyt/screens/leaderboards/leaderboards_screen.dart';
import 'package:unyt/screens/profile/profile_screen.dart';
import 'package:unyt/screens/settings/settings_screen.dart';
import 'package:unyt/widgets/navigation/campus_drawer.dart';
import 'package:provider/provider.dart';
import 'package:unyt/providers/auth_provider.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;
  final PageController _pageController = PageController();

  final List<Widget> _screens = [
    const HomeScreen(),
    const GlobalFeedScreen(),
    const EventsScreen(),
    const QuizzesScreen(),
  ];

  final List<String> _titles = [
    'College Home',
    'Global Feed',
    'Events',
    'Quizzes & Battles',
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _onMainNavItemTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
    _pageController.jumpToPage(index);
    Navigator.pop(context); // Close drawer
  }

  void _navigateToScreen(Widget screen, String title) {
    Navigator.pop(context); // Close drawer
    Navigator.push(
      context,
      MaterialPageRoute(
        builder:
            (context) =>
                Scaffold(appBar: AppBar(title: Text(title)), body: screen),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(_titles[_currentIndex]),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {
              // Show notifications
            },
          ),
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              // Show search
            },
          ),
        ],
      ),
      drawer: CampusDrawer(
        onForumsPressed:
            () => _navigateToScreen(const ForumsScreen(), 'Discussion Forums'),
        onLeaderboardsPressed:
            () => _navigateToScreen(const LeaderboardsScreen(), 'Leaderboards'),
        onProfilePressed:
            () => _navigateToScreen(const ProfileScreen(), 'My Profile'),
        onSettingsPressed:
            () => _navigateToScreen(const SettingsScreen(), 'Settings'),
        userName: authProvider.username ?? 'User',
        userEmail: authProvider.email ?? 'user@example.com',
        userCollege: 'College',
        userAvatar: null,
        onCollegeHomePressed: () => _onMainNavItemTapped(0),
        onGlobalFeedPressed: () => _onMainNavItemTapped(1),
        onEventsPressed: () => _onMainNavItemTapped(2),
        onQuizzesPressed: () => _onMainNavItemTapped(3),
      ),
      body: PageView(
        controller: _pageController,
        physics: const NeverScrollableScrollPhysics(),
        children: _screens,
      ),
    );
  }
}
