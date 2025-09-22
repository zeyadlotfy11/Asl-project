import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../shared/providers/auth_provider.dart';
import '../../../../shared/providers/artifact_provider.dart';
import '../../../../shared/providers/proposal_provider.dart';
import '../../../../shared/widgets/custom_app_bar.dart';
import '../../../../shared/widgets/dashboard_card.dart';
import '../../../../shared/widgets/quick_actions.dart';

class HomePage extends ConsumerWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final authState = ref.watch(authProvider);
    final artifactStats = ref.watch(artifactStatsProvider);
    final proposalStats = ref.watch(proposalStatsProvider);

    return Scaffold(
      appBar: CustomAppBar(
        title: 'ASL Dashboard',
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              // Implement global search
            },
          ),
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {
              // Navigate to notifications
            },
          ),
          IconButton(
            icon: const Icon(Icons.settings_outlined),
            onPressed: () => context.push('/settings'),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          // Refresh all data
          ref.invalidate(artifactStatsProvider);
          ref.invalidate(proposalStatsProvider);
        },
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome Section
              _buildWelcomeSection(context, theme, authState),
              
              const SizedBox(height: 24),
              
              // Quick Actions
              const QuickActions(),
              
              const SizedBox(height: 24),
              
              // Statistics Dashboard
              _buildStatisticsDashboard(
                context,
                theme,
                artifactStats,
                proposalStats,
              ),
              
              const SizedBox(height: 24),
              
              // Recent Activity
              _buildRecentActivity(context, theme),
              
              const SizedBox(height: 24),
              
              // Featured Content
              _buildFeaturedContent(context, theme),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildWelcomeSection(
    BuildContext context,
    ThemeData theme,
    AsyncValue<AuthState> authState,
  ) {
    return authState.when(
      data: (auth) => Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              theme.colorScheme.primary,
              theme.colorScheme.primary.withOpacity(0.8),
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              auth.isAuthenticated
                  ? 'Welcome back, ${auth.user?.name ?? "Explorer"}!'
                  : 'Welcome to ASL!',
              style: theme.textTheme.headlineSmall?.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Discover and verify archaeological artifacts with our community-driven platform.',
              style: theme.textTheme.bodyMedium?.copyWith(
                color: Colors.white.withOpacity(0.9),
              ),
            ),
            if (!auth.isAuthenticated) ...[
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => context.go('/login'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: theme.colorScheme.primary,
                ),
                child: const Text('Get Started'),
              ),
            ],
          ],
        ),
      ),
      loading: () => const SizedBox(height: 100),
      error: (_, __) => const SizedBox(height: 100),
    );
  }

  Widget _buildStatisticsDashboard(
    BuildContext context,
    ThemeData theme,
    AsyncValue<ArtifactStats> artifactStats,
    AsyncValue<ProposalStats> proposalStats,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Platform Statistics',
          style: theme.textTheme.headlineSmall?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 16),
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
          childAspectRatio: 1.5,
          children: [
            DashboardCard(
              title: 'Artifacts',
              value: artifactStats.when(
                data: (stats) => stats.totalCount.toString(),
                loading: () => '...',
                error: (_, __) => 'Error',
              ),
              subtitle: 'Total verified',
              icon: Icons.museum,
              color: theme.colorScheme.primary,
              onTap: () => context.go('/artifacts'),
            ),
            DashboardCard(
              title: 'Proposals',
              value: proposalStats.when(
                data: (stats) => stats.totalCount.toString(),
                loading: () => '...',
                error: (_, __) => 'Error',
              ),
              subtitle: 'Active voting',
              icon: Icons.how_to_vote,
              color: theme.colorScheme.secondary,
              onTap: () => context.go('/proposals'),
            ),
            DashboardCard(
              title: 'Verified',
              value: artifactStats.when(
                data: (stats) => stats.verifiedCount.toString(),
                loading: () => '...',
                error: (_, __) => 'Error',
              ),
              subtitle: 'Authenticity confirmed',
              icon: Icons.verified,
              color: Colors.green,
              onTap: () => context.go('/artifacts?filter=verified'),
            ),
            DashboardCard(
              title: 'NFTs',
              value: '156',
              subtitle: 'Marketplace items',
              icon: Icons.token,
              color: Colors.orange,
              onTap: () => context.go('/nfts'),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildRecentActivity(BuildContext context, ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Recent Activity',
              style: theme.textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            TextButton(
              onPressed: () {
                // Navigate to full activity feed
              },
              child: const Text('View All'),
            ),
          ],
        ),
        const SizedBox(height: 16),
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: 3,
          separatorBuilder: (context, index) => const SizedBox(height: 12),
          itemBuilder: (context, index) {
            return Card(
              child: ListTile(
                leading: CircleAvatar(
                  backgroundColor: theme.colorScheme.primaryContainer,
                  child: Icon(
                    Icons.museum,
                    color: theme.colorScheme.primary,
                  ),
                ),
                title: Text('New artifact verified'),
                subtitle: Text('Ancient Egyptian vase authenticated'),
                trailing: Text(
                  '2h ago',
                  style: theme.textTheme.bodySmall,
                ),
                onTap: () {
                  // Navigate to activity detail
                },
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildFeaturedContent(BuildContext context, ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Featured Artifacts',
          style: theme.textTheme.headlineSmall?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 16),
        SizedBox(
          height: 200,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: 5,
            itemBuilder: (context, index) {
              return Container(
                width: 160,
                margin: const EdgeInsets.only(right: 16),
                child: Card(
                  clipBehavior: Clip.antiAlias,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Container(
                          color: theme.colorScheme.surfaceVariant,
                          child: const Center(
                            child: Icon(Icons.image, size: 48),
                          ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(12),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Ancient Vase ${index + 1}',
                              style: theme.textTheme.titleSmall,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Egypt, 2000 BCE',
                              style: theme.textTheme.bodySmall,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}