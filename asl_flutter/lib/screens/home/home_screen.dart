import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../models/models.dart';
import '../../services/icp_service.dart';
import '../../services/auth_service.dart';
import '../../widgets/dashboard_card.dart';
import '../../widgets/recent_artifacts_widget.dart';
import '../../widgets/active_proposals_widget.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  SystemStats? _stats;
  User? _currentUser;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      final statsResult = await ICPService().getSystemStats();
      final userResult = await ICPService().getCurrentUserProfile();
      
      setState(() {
        _stats = statsResult;
        _currentUser = userResult;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      _showErrorSnackBar('Failed to load dashboard data');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ASL Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () => context.go('/profile'),
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: _handleLogout,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadData,
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Welcome Section
                    _buildWelcomeSection(),
                    const SizedBox(height: 24),
                    
                    // Stats Overview
                    _buildStatsOverview(),
                    const SizedBox(height: 24),
                    
                    // Quick Actions
                    _buildQuickActions(),
                    const SizedBox(height: 24),
                    
                    // Recent Activities
                    _buildRecentActivities(),
                  ],
                ),
              ),
            ),
      bottomNavigationBar: _buildBottomNavigationBar(),
    );
  }

  Widget _buildWelcomeSection() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            CircleAvatar(
              radius: 30,
              backgroundColor: Theme.of(context).primaryColor,
              child: Text(
                _currentUser?.role.value.substring(0, 1).toUpperCase() ?? 'U',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Welcome back!',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  Text(
                    _currentUser != null 
                        ? 'Role: ${_getRoleDisplayName(_currentUser!.role)}'
                        : 'Loading profile...',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Colors.grey[600],
                    ),
                  ),
                  if (_currentUser?.institution != null)
                    Text(
                      'Institution: ${_currentUser!.institution}',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Colors.grey[600],
                      ),
                    ),
                ],
              ),
            ),
            if (_currentUser?.isVerified == true)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.green,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Text(
                  'Verified',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatsOverview() {
    if (_stats == null) {
      return const SizedBox.shrink();
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Platform Statistics',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 16),
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          childAspectRatio: 1.5,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
          children: [
            DashboardCard(
              title: 'Total Artifacts',
              value: _stats!.totalArtifacts.toString(),
              icon: Icons.inventory,
              color: Colors.blue,
              onTap: () => context.go('/artifacts'),
            ),
            DashboardCard(
              title: 'Verified Artifacts',
              value: _stats!.verifiedArtifacts.toString(),
              icon: Icons.verified,
              color: Colors.green,
              onTap: () => context.go('/artifacts'),
            ),
            DashboardCard(
              title: 'Active Proposals',
              value: _stats!.activeProposals.toString(),
              icon: Icons.how_to_vote,
              color: Colors.orange,
              onTap: () => context.go('/proposals'),
            ),
            DashboardCard(
              title: 'Total NFTs',
              value: _stats!.totalNfts.toString(),
              icon: Icons.token,
              color: Colors.purple,
              onTap: () => context.go('/nfts'),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildQuickActions() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Quick Actions',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 16),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: [
              _QuickActionButton(
                icon: Icons.add_photo_alternate,
                label: 'Submit Artifact',
                onTap: () {
                  // Navigate to submit artifact screen
                  _showFeatureComingSoon('Submit Artifact');
                },
              ),
              const SizedBox(width: 12),
              _QuickActionButton(
                icon: Icons.gavel,
                label: 'Create Proposal',
                onTap: () {
                  _showFeatureComingSoon('Create Proposal');
                },
              ),
              const SizedBox(width: 12),
              _QuickActionButton(
                icon: Icons.search,
                label: 'Search Artifacts',
                onTap: () => context.go('/artifacts'),
              ),
              const SizedBox(width: 12),
              _QuickActionButton(
                icon: Icons.analytics,
                label: 'Analytics',
                onTap: () {
                  _showFeatureComingSoon('Analytics Dashboard');
                },
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildRecentActivities() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Recent Activities',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 16),
        const RecentArtifactsWidget(),
        const SizedBox(height: 16),
        const ActiveProposalsWidget(),
      ],
    );
  }

  Widget _buildBottomNavigationBar() {
    return BottomNavigationBar(
      type: BottomNavigationBarType.fixed,
      selectedItemColor: Theme.of(context).primaryColor,
      unselectedItemColor: Colors.grey,
      items: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.home),
          label: 'Home',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.inventory),
          label: 'Artifacts',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.how_to_vote),
          label: 'Proposals',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.token),
          label: 'NFTs',
        ),
      ],
      onTap: (index) {
        switch (index) {
          case 0:
            // Already on home
            break;
          case 1:
            context.go('/artifacts');
            break;
          case 2:
            context.go('/proposals');
            break;
          case 3:
            context.go('/nfts');
            break;
        }
      },
    );
  }

  String _getRoleDisplayName(UserRole role) {
    switch (role) {
      case UserRole.institution:
        return 'Institution';
      case UserRole.expert:
        return 'Expert';
      case UserRole.moderator:
        return 'Moderator';
      case UserRole.community:
        return 'Community Member';
    }
  }

  void _showFeatureComingSoon(String feature) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$feature feature coming soon!'),
        backgroundColor: Colors.blue,
      ),
    );
  }

  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
      ),
    );
  }

  Future<void> _handleLogout() async {
    await AuthService().logout();
    if (mounted) {
      context.go('/login');
    }
  }
}

class _QuickActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _QuickActionButton({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        width: 120,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.grey.shade300),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 32,
              color: Theme.of(context).primaryColor,
            ),
            const SizedBox(height: 8),
            Text(
              label,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}