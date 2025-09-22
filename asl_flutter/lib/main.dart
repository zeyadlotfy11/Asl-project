import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:path_provider/path_provider.dart';
import 'package:connectivity_plus/connectivity_plus.dart';

import 'core/config/app_config.dart';
import 'core/theme/theme.dart';
import 'core/routing/app_router.dart';
import 'core/services/network_service.dart';
import 'core/services/icp_service.dart';
import 'shared/providers/auth_provider.dart';
import 'features/auth/presentation/pages/splash_page.dart';
import 'features/auth/presentation/pages/onboarding_page.dart';
import 'features/auth/presentation/pages/login_page.dart';
import 'features/home/presentation/pages/home_page.dart';
import 'features/artifacts/presentation/pages/artifact_list_page.dart';
import 'features/artifacts/presentation/pages/artifact_detail_page.dart';
import 'features/proposals/presentation/pages/proposal_list_page.dart';
import 'features/proposals/presentation/pages/proposal_detail_page.dart';
import 'features/nfts/presentation/pages/nft_list_page.dart';
import 'features/profile/presentation/pages/profile_page.dart';
import 'features/settings/presentation/pages/settings_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Hive for local storage
  await Hive.initFlutter();
  
  // Initialize app services
  await _initializeServices();
  
  // Set preferred device orientation
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  
  // Set status bar style
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
    ),
  );
  
  runApp(
    ProviderScope(
      child: ASLApp(),
    ),
  );
}

Future<void> _initializeServices() async {
  try {
    // Initialize network connectivity monitoring
    final connectivity = Connectivity();
    await connectivity.checkConnectivity();
    
    // Initialize ICP service
    final icpService = ICPService();
    await icpService.initialize();
    
    // Initialize network service
    final networkService = NetworkService();
    await networkService.initialize();
    
  } catch (e) {
    debugPrint('Error initializing services: $e');
  }
}

class ASLApp extends ConsumerWidget {
  const ASLApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    
    return MaterialApp.router(
      title: AppConfig.appName,
      debugShowCheckedModeBanner: false,
      
      // Theme configuration
      theme: ASLTheme.lightTheme,
      darkTheme: ASLTheme.darkTheme,
      themeMode: ThemeMode.system,
      
      // Localization
      supportedLocales: const [
        Locale('en', 'US'),
        Locale('ar', 'EG'),
      ],
      
      // Router configuration
      routerConfig: _createRouter(authState),
      
      // App-wide configurations
      builder: (context, child) {
        return MediaQuery(
          data: MediaQuery.of(context).copyWith(
            textScaler: TextScaler.linear(
              MediaQuery.of(context).textScaleFactor.clamp(0.8, 1.2),
            ),
          ),
          child: child ?? const SizedBox.shrink(),
        );
      },
    );
  }

  GoRouter _createRouter(AsyncValue<AuthState> authState) {
    return GoRouter(
      initialLocation: '/splash',
      debugLogDiagnostics: AppConfig.isDevelopment,
      
      routes: [
        // Splash and onboarding
        GoRoute(
          path: '/splash',
          name: 'splash',
          builder: (context, state) => const SplashPage(),
        ),
        GoRoute(
          path: '/onboarding',
          name: 'onboarding',
          builder: (context, state) => const OnboardingPage(),
        ),
        
        // Authentication routes
        GoRoute(
          path: '/login',
          name: 'login',
          builder: (context, state) => const LoginPage(),
        ),
        
        // Main app shell with bottom navigation
        ShellRoute(
          builder: (context, state, child) => AppShell(child: child),
          routes: [
            // Home
            GoRoute(
              path: '/home',
              name: 'home',
              builder: (context, state) => const HomePage(),
            ),
            
            // Artifacts
            GoRoute(
              path: '/artifacts',
              name: 'artifacts',
              builder: (context, state) => const ArtifactListPage(),
              routes: [
                GoRoute(
                  path: '/:id',
                  name: 'artifact-detail',
                  builder: (context, state) {
                    final id = state.pathParameters['id']!;
                    return ArtifactDetailPage(artifactId: id);
                  },
                ),
              ],
            ),
            
            // Proposals
            GoRoute(
              path: '/proposals',
              name: 'proposals',
              builder: (context, state) => const ProposalListPage(),
              routes: [
                GoRoute(
                  path: '/:id',
                  name: 'proposal-detail',
                  builder: (context, state) {
                    final id = state.pathParameters['id']!;
                    return ProposalDetailPage(proposalId: id);
                  },
                ),
              ],
            ),
            
            // NFTs
            GoRoute(
              path: '/nfts',
              name: 'nfts',
              builder: (context, state) => const NFTListPage(),
            ),
            
            // Profile
            GoRoute(
              path: '/profile',
              name: 'profile',
              builder: (context, state) => const ProfilePage(),
            ),
          ],
        ),
        
        // Settings (full screen)
        GoRoute(
          path: '/settings',
          name: 'settings',
          builder: (context, state) => const SettingsPage(),
        ),
      ],
      
      // Authentication and navigation guards
      redirect: (context, state) {
        final location = state.location;
        
        return authState.when(
          data: (auth) {
            // Skip auth check for splash and onboarding
            if (location == '/splash' || location == '/onboarding') {
              return null;
            }
            
            // Redirect to login if not authenticated
            if (!auth.isAuthenticated && location != '/login') {
              return '/login';
            }
            
            // Redirect to home if authenticated and on login page
            if (auth.isAuthenticated && location == '/login') {
              return '/home';
            }
            
            return null;
          },
          loading: () => '/splash',
          error: (_, __) => '/login',
        );
      },
      
      // Error handling
      errorBuilder: (context, state) => Scaffold(
        appBar: AppBar(
          title: const Text('Error'),
          backgroundColor: ASLTheme.errorColor,
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.error_outline,
                size: 64,
                color: ASLTheme.errorColor,
              ),
              const SizedBox(height: 16),
              Text(
                'Page not found',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const SizedBox(height: 8),
              Text(
                'The page you requested could not be found.',
                style: Theme.of(context).textTheme.bodyMedium,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () => context.go('/home'),
                child: const Text('Go Home'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// App Shell with bottom navigation
class AppShell extends StatelessWidget {
  final Widget child;
  
  const AppShell({
    super.key,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: child,
      bottomNavigationBar: const AppBottomNavigation(),
    );
  }
}

class AppBottomNavigation extends ConsumerWidget {
  const AppBottomNavigation({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final location = GoRouterState.of(context).location;
    
    int currentIndex = 0;
    if (location.startsWith('/artifacts')) currentIndex = 1;
    if (location.startsWith('/proposals')) currentIndex = 2;
    if (location.startsWith('/nfts')) currentIndex = 3;
    if (location.startsWith('/profile')) currentIndex = 4;
    
    return NavigationBar(
      selectedIndex: currentIndex,
      onDestinationSelected: (index) {
        switch (index) {
          case 0:
            context.go('/home');
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
          case 4:
            context.go('/profile');
            break;
        }
      },
      destinations: const [
        NavigationDestination(
          icon: Icon(Icons.home_outlined),
          selectedIcon: Icon(Icons.home),
          label: 'Home',
        ),
        NavigationDestination(
          icon: Icon(Icons.museum_outlined),
          selectedIcon: Icon(Icons.museum),
          label: 'Artifacts',
        ),
        NavigationDestination(
          icon: Icon(Icons.how_to_vote_outlined),
          selectedIcon: Icon(Icons.how_to_vote),
          label: 'Proposals',
        ),
        NavigationDestination(
          icon: Icon(Icons.token_outlined),
          selectedIcon: Icon(Icons.token),
          label: 'NFTs',
        ),
        NavigationDestination(
          icon: Icon(Icons.person_outline),
          selectedIcon: Icon(Icons.person),
          label: 'Profile',
        ),
      ],
    );
  }
}