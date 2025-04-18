import 'package:flutter/material.dart';
import 'package:unyt/widgets/settings/settings_tile.dart';
import 'package:provider/provider.dart';
import 'package:unyt/providers/theme_provider.dart';
import 'package:unyt/providers/auth_provider.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _notificationsEnabled = true;
  bool _emailNotificationsEnabled = true;
  bool _locationEnabled = true;
  String _language = 'English';

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final authProvider = Provider.of<AuthProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Account Settings
          _buildSectionHeader(context, 'Account Settings'),
          SettingsTile(
            icon: Icons.person,
            title: 'Edit Profile',
            subtitle: 'Update your personal information',
            onTap: () {
              // Navigate to edit profile
            },
          ),
          SettingsTile(
            icon: Icons.lock,
            title: 'Change Password',
            subtitle: 'Update your password',
            onTap: () {
              // Navigate to change password
            },
          ),
          SettingsTile(
            icon: Icons.school,
            title: 'College Information',
            subtitle: 'Update your college details',
            onTap: () {
              // Navigate to college information
            },
          ),

          const Divider(height: 32),

          // Appearance
          _buildSectionHeader(context, 'Appearance'),
          SettingsTile(
            icon: Icons.brightness_6,
            title: 'Dark Mode',
            subtitle: 'Toggle between light and dark theme',
            trailing: Switch(
              value: themeProvider.isDarkMode,
              onChanged: (value) {
                themeProvider.toggleTheme();
              },
            ),
          ),
          SettingsTile(
            icon: Icons.language,
            title: 'Language',
            subtitle: _language,
            onTap: () {
              _showLanguageDialog();
            },
          ),

          const Divider(height: 32),

          // Notifications
          _buildSectionHeader(context, 'Notifications'),
          SettingsTile(
            icon: Icons.notifications,
            title: 'Push Notifications',
            subtitle: 'Receive notifications on your device',
            trailing: Switch(
              value: _notificationsEnabled,
              onChanged: (value) {
                setState(() {
                  _notificationsEnabled = value;
                });
              },
            ),
          ),
          SettingsTile(
            icon: Icons.email,
            title: 'Email Notifications',
            subtitle: 'Receive notifications via email',
            trailing: Switch(
              value: _emailNotificationsEnabled,
              onChanged: (value) {
                setState(() {
                  _emailNotificationsEnabled = value;
                });
              },
            ),
          ),

          const Divider(height: 32),

          // Privacy
          _buildSectionHeader(context, 'Privacy'),
          SettingsTile(
            icon: Icons.location_on,
            title: 'Location Services',
            subtitle: 'Allow app to access your location',
            trailing: Switch(
              value: _locationEnabled,
              onChanged: (value) {
                setState(() {
                  _locationEnabled = value;
                });
              },
            ),
          ),
          SettingsTile(
            icon: Icons.visibility,
            title: 'Profile Visibility',
            subtitle: 'Manage who can see your profile',
            onTap: () {
              // Navigate to profile visibility settings
            },
          ),
          SettingsTile(
            icon: Icons.delete,
            title: 'Delete Account',
            subtitle: 'Permanently delete your account',
            onTap: () {
              _showDeleteAccountDialog();
            },
            textColor: Theme.of(context).colorScheme.error,
          ),

          const Divider(height: 32),

          // About
          _buildSectionHeader(context, 'About'),
          SettingsTile(
            icon: Icons.info,
            title: 'About CampusConnext',
            subtitle: 'Learn more about the app',
            onTap: () {
              // Navigate to about page
            },
          ),
          SettingsTile(
            icon: Icons.help,
            title: 'Help & Support',
            subtitle: 'Get help with using the app',
            onTap: () {
              // Navigate to help page
            },
          ),
          SettingsTile(
            icon: Icons.description,
            title: 'Terms of Service',
            subtitle: 'Read our terms of service',
            onTap: () {
              // Navigate to terms page
            },
          ),
          SettingsTile(
            icon: Icons.privacy_tip,
            title: 'Privacy Policy',
            subtitle: 'Read our privacy policy',
            onTap: () {
              // Navigate to privacy policy page
            },
          ),

          const Divider(height: 32),

          // Logout
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 16),
            child: ElevatedButton.icon(
              onPressed: () {
                authProvider.logout();
              },
              icon: const Icon(Icons.logout),
              label: const Text('Logout'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).colorScheme.error,
                foregroundColor: Theme.of(context).colorScheme.onError,
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
            ),
          ),

          // App Version
          Center(
            child: Padding(
              padding: const EdgeInsets.only(top: 16, bottom: 32),
              child: Text(
                'CampusConnext v1.0.0',
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(BuildContext context, String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8, top: 8),
      child: Text(
        title,
        style: Theme.of(context).textTheme.titleMedium?.copyWith(
          fontWeight: FontWeight.bold,
          color: Theme.of(context).colorScheme.primary,
        ),
      ),
    );
  }

  void _showLanguageDialog() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Select Language'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildLanguageOption('English'),
              _buildLanguageOption('Hindi'),
              _buildLanguageOption('Spanish'),
              _buildLanguageOption('French'),
              _buildLanguageOption('German'),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: const Text('Cancel'),
            ),
          ],
        );
      },
    );
  }

  Widget _buildLanguageOption(String language) {
    return ListTile(
      title: Text(language),
      trailing: _language == language ? const Icon(Icons.check) : null,
      onTap: () {
        setState(() {
          _language = language;
        });
        Navigator.pop(context);
      },
    );
  }

  void _showDeleteAccountDialog() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Delete Account'),
          content: const Text(
            'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.',
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                // Delete account
                Navigator.pop(context);
              },
              style: TextButton.styleFrom(
                foregroundColor: Theme.of(context).colorScheme.error,
              ),
              child: const Text('Delete'),
            ),
          ],
        );
      },
    );
  }
}
