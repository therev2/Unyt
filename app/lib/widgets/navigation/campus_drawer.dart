import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:unyt/providers/auth_provider.dart';
import 'package:unyt/providers/theme_provider.dart';
import 'package:unyt/screens/chatbot/chatbot_screen.dart';

class CampusDrawer extends StatelessWidget {
  final VoidCallback onForumsPressed;
  final VoidCallback onLeaderboardsPressed;
  final VoidCallback onProfilePressed;
  final VoidCallback onSettingsPressed;
  final VoidCallback onCollegeHomePressed;
  final VoidCallback onGlobalFeedPressed;
  final VoidCallback onEventsPressed;
  final VoidCallback onQuizzesPressed;
  final String userName;
  final String userEmail;
  final String userCollege;
  final String? userAvatar;

  const CampusDrawer({
    super.key,
    required this.onForumsPressed,
    required this.onLeaderboardsPressed,
    required this.onProfilePressed,
    required this.onSettingsPressed,
    required this.onCollegeHomePressed,
    required this.onGlobalFeedPressed,
    required this.onEventsPressed,
    required this.onQuizzesPressed,
    required this.userName,
    required this.userEmail,
    required this.userCollege,
    this.userAvatar,
  });

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final authProvider = Provider.of<AuthProvider>(context);

    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          UserAccountsDrawerHeader(
            accountName: Text(userName),
            accountEmail: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(userEmail),
                const SizedBox(height: 4),
                Text(userCollege, style: const TextStyle(fontSize: 12)),
              ],
            ),
            currentAccountPicture: CircleAvatar(
              backgroundImage:
                  userAvatar != null ? NetworkImage(userAvatar!) : null,
              child:
                  userAvatar == null
                      ? Text(
                        userName.isNotEmpty ? userName[0] : 'U',
                        style: const TextStyle(fontSize: 24),
                      )
                      : null,
            ),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.primary,
            ),
          ),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Text(
              'MAIN NAVIGATION',
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.school),
            title: const Text('College Home'),
            onTap: onCollegeHomePressed,
          ),
          ListTile(
            leading: const Icon(Icons.public),
            title: const Text('Global Feed'),
            onTap: onGlobalFeedPressed,
          ),
          ListTile(
            leading: const Icon(Icons.event),
            title: const Text('Events'),
            onTap: onEventsPressed,
          ),
          const Divider(),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Text(
              'FEATURES',
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.quiz),
            title: const Text('Quizzes & Battles'),
            onTap: onQuizzesPressed,
          ),
          ListTile(
            leading: const Icon(Icons.forum),
            title: const Text('Discussion Forums'),
            onTap: onForumsPressed,
          ),
          ListTile(
            leading: const Icon(Icons.leaderboard),
            title: const Text('Leaderboards'),
            onTap: onLeaderboardsPressed,
          ),
          ListTile(
            leading: const Icon(Icons.smart_toy_outlined),
            title: const Text('Ask Your Buddy'),
            onTap: () {
              Navigator.pop(context);
              Navigator.of(context).push(
                MaterialPageRoute(builder: (context) => const ChatbotScreen()),
              );
            },
          ),
          const Divider(),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Text(
              'PROFILE',
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.person),
            title: const Text('My Profile'),
            onTap: onProfilePressed,
          ),
          ListTile(
            leading: const Icon(Icons.settings),
            title: const Text('Settings'),
            onTap: onSettingsPressed,
          ),
          ListTile(
            leading: const Icon(Icons.brightness_6),
            title: const Text('Toggle Theme'),
            onTap: () {
              themeProvider.toggleTheme();
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: const Icon(Icons.logout),
            title: const Text('Logout'),
            onTap: () {
              authProvider.logout();
            },
          ),
        ],
      ),
    );
  }
}
