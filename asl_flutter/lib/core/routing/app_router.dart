import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/presentation/pages/splash_page.dart';
import '../../features/auth/presentation/pages/onboarding_page.dart';
import '../../features/auth/presentation/pages/login_page.dart';
import '../../features/home/presentation/pages/home_page.dart';
import '../../features/artifacts/presentation/pages/artifact_list_page.dart';
import '../../features/artifacts/presentation/pages/artifact_detail_page.dart';
import '../../features/proposals/presentation/pages/proposal_list_page.dart';
import '../../features/proposals/presentation/pages/proposal_detail_page.dart';
import '../../features/nfts/presentation/pages/nft_list_page.dart';
import '../../features/profile/presentation/pages/profile_page.dart';
import '../../features/settings/presentation/pages/settings_page.dart';

class AppRouter {
  static const String splash = '/splash';
  static const String onboarding = '/onboarding';
  static const String login = '/login';
  static const String home = '/home';
  static const String artifacts = '/artifacts';
  static const String artifactDetail = '/artifacts/:id';
  static const String proposals = '/proposals';
  static const String proposalDetail = '/proposals/:id';
  static const String nfts = '/nfts';
  static const String profile = '/profile';
  static const String settings = '/settings';

  static String artifactDetailPath(String id) => '/artifacts/$id';
  static String proposalDetailPath(String id) => '/proposals/$id';

  static final GoRouter router = GoRouter(
    initialLocation: splash,
    debugLogDiagnostics: true,
    routes: [
      // Splash and onboarding
      GoRoute(
        path: splash,
        name: 'splash',
        builder: (context, state) => const SplashPage(),
      ),
      GoRoute(
        path: onboarding,
        name: 'onboarding',
        builder: (context, state) => const OnboardingPage(),
      ),
      
      // Authentication routes
      GoRoute(
        path: login,
        name: 'login',
        builder: (context, state) => const LoginPage(),
      ),
      
      // Main app routes
      GoRoute(
        path: home,
        name: 'home',
        builder: (context, state) => const HomePage(),
      ),
      
      // Artifacts
      GoRoute(
        path: artifacts,
        name: 'artifacts',
        builder: (context, state) => const ArtifactListPage(),
      ),
      GoRoute(
        path: artifactDetail,
        name: 'artifact-detail',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          return ArtifactDetailPage(artifactId: id);
        },
      ),
      
      // Proposals
      GoRoute(
        path: proposals,
        name: 'proposals',
        builder: (context, state) => const ProposalListPage(),
      ),
      GoRoute(
        path: proposalDetail,
        name: 'proposal-detail',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          return ProposalDetailPage(proposalId: id);
        },
      ),
      
      // NFTs
      GoRoute(
        path: nfts,
        name: 'nfts',
        builder: (context, state) => const NFTListPage(),
      ),
      
      // Profile
      GoRoute(
        path: profile,
        name: 'profile',
        builder: (context, state) => const ProfilePage(),
      ),
      
      // Settings
      GoRoute(
        path: settings,
        name: 'settings',
        builder: (context, state) => const SettingsPage(),
      ),
    ],
  );
}