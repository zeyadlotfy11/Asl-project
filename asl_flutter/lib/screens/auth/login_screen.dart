import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../models/models.dart';
import '../../services/auth_service.dart';
import '../../services/icp_service.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _institutionController = TextEditingController();
  final _specializationController = TextEditingController();
  UserRole _selectedRole = UserRole.community;
  bool _isLoading = false;
  bool _isRegistering = false;

  @override
  void initState() {
    super.initState();
    _initializeAuth();
  }

  Future<void> _initializeAuth() async {
    await AuthService().initializeAuth();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF8B4513), // Saddle brown
              Color(0xFFD2B48C), // Tan
            ],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24.0),
              child: Card(
                elevation: 8,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Logo and Title
                      Container(
                        width: 80,
                        height: 80,
                        decoration: BoxDecoration(
                          color: const Color(0xFF8B4513),
                          borderRadius: BorderRadius.circular(40),
                        ),
                        child: const Icon(
                          Icons.museum,
                          color: Colors.white,
                          size: 40,
                        ),
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'ASL Platform',
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF8B4513),
                        ),
                      ),
                      const Text(
                        'Archaeological Artifact Verification',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey,
                        ),
                      ),
                      const SizedBox(height: 32),
                      
                      if (!_isRegistering) ...[
                        // Login Section
                        const Text(
                          'Welcome Back',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          'Connect with Internet Identity to access your account',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.grey),
                        ),
                        const SizedBox(height: 24),
                        SizedBox(
                          width: double.infinity,
                          height: 48,
                          child: ElevatedButton.icon(
                            onPressed: _isLoading ? null : _handleLogin,
                            icon: _isLoading
                                ? const SizedBox(
                                    width: 20,
                                    height: 20,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                    ),
                                  )
                                : const Icon(Icons.account_circle),
                            label: Text(_isLoading ? 'Connecting...' : 'Login with Internet Identity'),
                          ),
                        ),
                        const SizedBox(height: 16),
                        TextButton(
                          onPressed: () => setState(() => _isRegistering = true),
                          child: const Text('New user? Register here'),
                        ),
                      ] else ...[
                        // Registration Section
                        Form(
                          key: _formKey,
                          child: Column(
                            children: [
                              const Text(
                                'Create Account',
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 24),
                              
                              // Role Selection
                              DropdownButtonFormField<UserRole>(
                                value: _selectedRole,
                                decoration: const InputDecoration(
                                  labelText: 'Role',
                                  border: OutlineInputBorder(),
                                ),
                                items: UserRole.values.map((role) {
                                  return DropdownMenuItem(
                                    value: role,
                                    child: Text(_getRoleDisplayName(role)),
                                  );
                                }).toList(),
                                onChanged: (value) {
                                  if (value != null) {
                                    setState(() => _selectedRole = value);
                                  }
                                },
                              ),
                              const SizedBox(height: 16),
                              
                              // Institution (for Institution and Expert roles)
                              if (_selectedRole == UserRole.institution || _selectedRole == UserRole.expert)
                                Column(
                                  children: [
                                    TextFormField(
                                      controller: _institutionController,
                                      decoration: const InputDecoration(
                                        labelText: 'Institution',
                                        border: OutlineInputBorder(),
                                      ),
                                      validator: (value) {
                                        if ((_selectedRole == UserRole.institution || _selectedRole == UserRole.expert) &&
                                            (value == null || value.isEmpty)) {
                                          return 'Institution is required for this role';
                                        }
                                        return null;
                                      },
                                    ),
                                    const SizedBox(height: 16),
                                  ],
                                ),
                              
                              // Specialization
                              TextFormField(
                                controller: _specializationController,
                                decoration: const InputDecoration(
                                  labelText: 'Specialization (comma-separated)',
                                  border: OutlineInputBorder(),
                                  hintText: 'e.g. Ancient Egypt, Ceramics, Medieval Art',
                                ),
                                maxLines: 2,
                              ),
                              const SizedBox(height: 24),
                              
                              SizedBox(
                                width: double.infinity,
                                height: 48,
                                child: ElevatedButton(
                                  onPressed: _isLoading ? null : _handleRegister,
                                  child: _isLoading
                                      ? const CircularProgressIndicator(
                                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                        )
                                      : const Text('Register'),
                                ),
                              ),
                              const SizedBox(height: 16),
                              TextButton(
                                onPressed: () => setState(() => _isRegistering = false),
                                child: const Text('Already have an account? Login'),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
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

  Future<void> _handleLogin() async {
    setState(() => _isLoading = true);
    
    try {
      final success = await AuthService().login();
      if (success && mounted) {
        context.go('/home');
      } else {
        _showErrorSnackBar('Login failed. Please try again.');
      }
    } catch (e) {
      _showErrorSnackBar('Login error: $e');
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;
    
    setState(() => _isLoading = true);
    
    try {
      // First, login to get identity
      final loginSuccess = await AuthService().login();
      if (!loginSuccess) {
        _showErrorSnackBar('Failed to authenticate. Please try again.');
        return;
      }

      // Parse specialization
      final specializations = _specializationController.text
          .split(',')
          .map((s) => s.trim())
          .where((s) => s.isNotEmpty)
          .toList();

      // Register user
      await ICPService().registerUser(
        _selectedRole,
        _institutionController.text.isEmpty ? null : _institutionController.text,
        specializations,
      );

      if (mounted) {
        context.go('/home');
      }
    } catch (e) {
      _showErrorSnackBar('Registration failed: $e');
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
      ),
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _institutionController.dispose();
    _specializationController.dispose();
    super.dispose();
  }
}