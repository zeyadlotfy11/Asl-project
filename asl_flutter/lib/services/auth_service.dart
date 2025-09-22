import 'package:flutter/foundation.dart';
import 'package:agent_dart/agent_dart.dart';
import 'ic_config.dart';

class AuthService extends ChangeNotifier {
  static final AuthService _instance = AuthService._();
  factory AuthService() => _instance;
  AuthService._();

  Identity? _identity;
  String? _principal;
  bool _isAuthenticated = false;

  // Getters
  Identity? get identity => _identity;
  String? get principal => _principal;
  bool get isAuthenticated => _isAuthenticated;

  Future<void> initializeAuth() async {
    try {
      // For local development, you might want to use AnonymousIdentity or Ed25519KeyIdentity
      if (ICConfig.isLocal) {
        // Use anonymous identity for testing
        _identity = AnonymousIdentity();
        _principal = _identity!.getPrincipal().toText();
        _isAuthenticated = true;
      } else {
        // In production, implement Internet Identity integration
        // This would involve WebAuthN and Internet Identity canister
        await _initializeInternetIdentity();
      }
      
      notifyListeners();
    } catch (e) {
      debugPrint('Auth initialization failed: $e');
    }
  }

  Future<void> _initializeInternetIdentity() async {
    // TODO: Implement Internet Identity integration
    // This would involve:
    // 1. Creating WebAuthN credentials
    // 2. Delegating to Internet Identity canister
    // 3. Getting delegated identity
    
    // For now, we'll use anonymous identity
    _identity = AnonymousIdentity();
    _principal = _identity!.getPrincipal().toText();
    _isAuthenticated = true;
  }

  Future<bool> login() async {
    try {
      if (ICConfig.isLocal) {
        // For local development, simulate login
        _identity = AnonymousIdentity();
        _principal = _identity!.getPrincipal().toText();
        _isAuthenticated = true;
        notifyListeners();
        return true;
      } else {
        // Implement Internet Identity login flow
        return await _loginWithInternetIdentity();
      }
    } catch (e) {
      debugPrint('Login failed: $e');
      return false;
    }
  }

  Future<bool> _loginWithInternetIdentity() async {
    try {
      // TODO: Implement Internet Identity login
      // This would involve:
      // 1. Redirecting to Internet Identity
      // 2. Handling the authentication callback
      // 3. Creating delegated identity
      // 4. Storing the delegation for future use
      
      // Placeholder implementation
      _identity = AnonymousIdentity();
      _principal = _identity!.getPrincipal().toText();
      _isAuthenticated = true;
      notifyListeners();
      return true;
    } catch (e) {
      debugPrint('Internet Identity login failed: $e');
      return false;
    }
  }

  Future<void> logout() async {
    try {
      _identity = null;
      _principal = null;
      _isAuthenticated = false;
      notifyListeners();
    } catch (e) {
      debugPrint('Logout failed: $e');
    }
  }

  Future<void> refreshAuth() async {
    if (_identity != null) {
      try {
        // Check if current identity is still valid
        // For production, you might want to refresh the delegation
        _principal = _identity!.getPrincipal().toText();
        notifyListeners();
      } catch (e) {
        debugPrint('Auth refresh failed: $e');
        await logout();
      }
    }
  }

  // Helper method to get authenticated agent
  Future<HttpAgent> getAuthenticatedAgent() async {
    if (!_isAuthenticated || _identity == null) {
      throw Exception('User not authenticated');
    }

    final agent = HttpAgent(
      defaultHost: ICConfig.networkHost,
      options: HttpAgentOptions(
        host: ICConfig.networkHost,
        identity: _identity,
      ),
    );

    if (ICConfig.isLocal) {
      await agent.fetchRootKey();
    }

    return agent;
  }
}