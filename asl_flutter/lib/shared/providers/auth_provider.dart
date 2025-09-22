import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/icp_service.dart';
import '../shared/models/user.dart';
import '../shared/models/enums.dart';

part 'auth_provider.g.dart';

// Authentication State
enum AuthState {
  loading,
  authenticated,
  unauthenticated,
  error,
}

// Authentication Provider
@riverpod
class Auth extends _$Auth {
  @override
  Future<AuthState> build() async {
    return await _checkAuthStatus();
  }
  
  Future<AuthState> _checkAuthStatus() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final identity = prefs.getString('user_identity');
      
      if (identity != null) {
        ICPService.instance.setIdentity(identity);
        
        // Try to get user profile to verify authentication
        try {
          await ICPService.instance.getCurrentUserProfile();
          return AuthState.authenticated;
        } catch (e) {
          // If we can't get profile, clear stored identity
          await prefs.remove('user_identity');
          return AuthState.unauthenticated;
        }
      }
      
      return AuthState.unauthenticated;
    } catch (e) {
      return AuthState.error;
    }
  }
  
  Future<void> login(String identity) async {
    state = const AsyncValue.loading();
    
    try {
      ICPService.instance.setIdentity(identity);
      
      // Store identity for persistence
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('user_identity', identity);
      
      // Verify by getting user profile
      await ICPService.instance.getCurrentUserProfile();
      
      state = const AsyncValue.data(AuthState.authenticated);
      
      // Invalidate user profile to refresh
      ref.invalidate(currentUserProfileProvider);
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
    }
  }
  
  Future<void> logout() async {
    try {
      // Clear stored identity
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('user_identity');
      
      // Clear service identity
      ICPService.instance.setIdentity('');
      
      state = const AsyncValue.data(AuthState.unauthenticated);
      
      // Invalidate all user-related providers
      ref.invalidate(currentUserProfileProvider);
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
    }
  }
  
  Future<void> register({
    required UserRole role,
    String? institution,
    required List<String> specialization,
  }) async {
    try {
      await ICPService.instance.registerUser(role, institution, specialization);
      
      // Refresh user profile after registration
      ref.invalidate(currentUserProfileProvider);
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
    }
  }
  
  bool get isAuthenticated => state.value == AuthState.authenticated;
  bool get isLoading => state.isLoading;
  bool get hasError => state.hasError;
  
  String? get currentIdentity => ICPService.instance.currentIdentity;
}

// Current User Profile Provider
@riverpod
class CurrentUserProfile extends _$CurrentUserProfile {
  @override
  Future<User?> build() async {
    final authState = await ref.watch(authProvider.future);
    
    if (authState != AuthState.authenticated) {
      return null;
    }
    
    try {
      return await ICPService.instance.getCurrentUserProfile();
    } catch (e) {
      return null;
    }
  }
  
  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final authState = await ref.read(authProvider.future);
      if (authState != AuthState.authenticated) {
        return null;
      }
      return await ICPService.instance.getCurrentUserProfile();
    });
  }
}

// User Profile Provider (for any user)
@riverpod
class UserProfile extends _$UserProfile {
  @override
  Future<User?> build(String userPrincipal) async {
    // This would call a backend method to get any user's profile
    // For now, return null as this method might not be exposed
    return null;
  }
}

// User Permissions Provider
@riverpod
class UserPermissions extends _$UserPermissions {
  @override
  Future<List<String>> build() async {
    final user = await ref.watch(currentUserProfileProvider.future);
    return user?.permissions ?? [];
  }
  
  bool hasPermission(String permission) {
    final permissions = state.value ?? [];
    return permissions.contains(permission);
  }
  
  bool get canSubmitArtifacts => hasPermission('submit_artifacts');
  bool get canVerifyArtifacts => hasPermission('verify_artifacts');
  bool get canCreateProposals => hasPermission('create_proposals');
  bool get canManageUsers => hasPermission('manage_users');
  bool get canExecuteProposals => hasPermission('execute_proposals');
}

// Authentication Session Provider
@riverpod
class AuthSession extends _$AuthSession {
  @override
  Future<Map<String, dynamic>> build() async {
    final prefs = await SharedPreferences.getInstance();
    
    return {
      'lastLogin': prefs.getInt('last_login'),
      'loginCount': prefs.getInt('login_count') ?? 0,
      'sessionStartTime': DateTime.now().millisecondsSinceEpoch,
    };
  }
  
  Future<void> updateLastLogin() async {
    final prefs = await SharedPreferences.getInstance();
    final now = DateTime.now().millisecondsSinceEpoch;
    final loginCount = (prefs.getInt('login_count') ?? 0) + 1;
    
    await prefs.setInt('last_login', now);
    await prefs.setInt('login_count', loginCount);
    
    // Refresh session data
    ref.invalidate(authSessionProvider);
  }
  
  Duration get sessionDuration {
    final sessionStart = state.value?['sessionStartTime'] as int?;
    if (sessionStart == null) return Duration.zero;
    
    return Duration(
      milliseconds: DateTime.now().millisecondsSinceEpoch - sessionStart,
    );
  }
  
  DateTime? get lastLoginDate {
    final lastLogin = state.value?['lastLogin'] as int?;
    return lastLogin != null 
        ? DateTime.fromMillisecondsSinceEpoch(lastLogin)
        : null;
  }
  
  int get loginCount => state.value?['loginCount'] as int? ?? 0;
}

// Biometric Authentication Provider
@riverpod
class BiometricAuth extends _$BiometricAuth {
  @override
  Future<bool> build() async {
    // Check if biometric authentication is available and enabled
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool('biometric_enabled') ?? false;
  }
  
  Future<void> enableBiometric() async {
    try {
      // This would integrate with local_auth package
      // For now, just store the preference
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool('biometric_enabled', true);
      
      state = const AsyncValue.data(true);
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
    }
  }
  
  Future<void> disableBiometric() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool('biometric_enabled', false);
      
      state = const AsyncValue.data(false);
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
    }
  }
  
  Future<bool> authenticateWithBiometric() async {
    // This would use local_auth to authenticate
    // For now, return false
    return false;
  }
}

// User Preferences Provider
@riverpod
class UserPreferences extends _$UserPreferences {
  @override
  Future<Map<String, dynamic>> build() async {
    final prefs = await SharedPreferences.getInstance();
    
    return {
      'theme_mode': prefs.getString('theme_mode') ?? 'system',
      'language': prefs.getString('language') ?? 'en',
      'notifications_enabled': prefs.getBool('notifications_enabled') ?? true,
      'push_notifications': prefs.getBool('push_notifications') ?? true,
      'email_notifications': prefs.getBool('email_notifications') ?? true,
      'auto_refresh': prefs.getBool('auto_refresh') ?? true,
      'cache_enabled': prefs.getBool('cache_enabled') ?? true,
    };
  }
  
  Future<void> updatePreference(String key, dynamic value) async {
    final prefs = await SharedPreferences.getInstance();
    
    if (value is String) {
      await prefs.setString(key, value);
    } else if (value is bool) {
      await prefs.setBool(key, value);
    } else if (value is int) {
      await prefs.setInt(key, value);
    } else if (value is double) {
      await prefs.setDouble(key, value);
    }
    
    // Refresh preferences
    ref.invalidate(userPreferencesProvider);
  }
  
  T? getPreference<T>(String key) {
    return state.value?[key] as T?;
  }
  
  String get themeMode => getPreference<String>('theme_mode') ?? 'system';
  String get language => getPreference<String>('language') ?? 'en';
  bool get notificationsEnabled => getPreference<bool>('notifications_enabled') ?? true;
  bool get pushNotifications => getPreference<bool>('push_notifications') ?? true;
  bool get emailNotifications => getPreference<bool>('email_notifications') ?? true;
  bool get autoRefresh => getPreference<bool>('auto_refresh') ?? true;
  bool get cacheEnabled => getPreference<bool>('cache_enabled') ?? true;
}