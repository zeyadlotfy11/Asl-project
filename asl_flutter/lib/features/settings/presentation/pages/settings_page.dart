import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../shared/widgets/custom_app_bar.dart';

class SettingsPage extends ConsumerWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: CustomAppBar(
        title: 'Settings',
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Account Section
          _buildSectionHeader(theme, 'Account'),
          _buildSettingTile(
            context,
            theme,
            icon: Icons.person,
            title: 'Profile Settings',
            subtitle: 'Update your profile information',
            onTap: () {},
          ),
          _buildSettingTile(
            context,
            theme,
            icon: Icons.security,
            title: 'Privacy & Security',
            subtitle: 'Manage your privacy settings',
            onTap: () {},
          ),
          
          const SizedBox(height: 20),
          
          // App Settings
          _buildSectionHeader(theme, 'App Settings'),
          _buildSettingTile(
            context,
            theme,
            icon: Icons.palette,
            title: 'Theme',
            subtitle: 'Light, Dark, or System',
            onTap: () {},
          ),
          _buildSettingTile(
            context,
            theme,
            icon: Icons.language,
            title: 'Language',
            subtitle: 'English',
            onTap: () {},
          ),
          _buildSettingTile(
            context,
            theme,
            icon: Icons.notifications,
            title: 'Notifications',
            subtitle: 'Manage notification preferences',
            onTap: () {},
          ),
          
          const SizedBox(height: 20),
          
          // About Section
          _buildSectionHeader(theme, 'About'),
          _buildSettingTile(
            context,
            theme,
            icon: Icons.info,
            title: 'About ASL',
            subtitle: 'Version 1.0.0',
            onTap: () {},
          ),
          _buildSettingTile(
            context,
            theme,
            icon: Icons.privacy_tip,
            title: 'Privacy Policy',
            subtitle: 'Read our privacy policy',
            onTap: () {},
          ),
          _buildSettingTile(
            context,
            theme,
            icon: Icons.article,
            title: 'Terms of Service',
            subtitle: 'Read our terms of service',
            onTap: () {},
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(ThemeData theme, String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(
        title,
        style: theme.textTheme.titleMedium?.copyWith(
          fontWeight: FontWeight.bold,
          color: theme.colorScheme.primary,
        ),
      ),
    );
  }

  Widget _buildSettingTile(
    BuildContext context,
    ThemeData theme, {
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Icon(icon),
        title: Text(title),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }
}