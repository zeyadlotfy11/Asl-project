// Professional app configuration
class AppConfig {
  static const String appName = 'ASL Verification';
  static const String appVersion = '1.0.0';
  static const String appBuildNumber = '1';
  
  // Environment configurations
  static const bool isProduction = bool.fromEnvironment('dart.vm.product');
  static const bool isDebug = !isProduction;
  
  // Backend configurations
  static const String icNetwork = isProduction 
      ? 'https://ic0.app'
      : 'http://localhost:4943';
  
  // Replace with your actual canister ID
  static const String canisterId = String.fromEnvironment(
    'CANISTER_ID',
    defaultValue: 'rdmx6-jaaaa-aaaah-qdhya-cai', // Default for development
  );
  
  // Feature flags
  static const bool enableAnalytics = isProduction;
  static const bool enableCrashReporting = isProduction;
  static const bool enableLogging = true;
  static const bool enableOfflineMode = true;
  static const bool enableBiometricAuth = true;
  
  // Cache configurations
  static const Duration cacheExpiration = Duration(hours: 24);
  static const int maxCacheSize = 100 * 1024 * 1024; // 100MB
  
  // UI configurations
  static const Duration animationDuration = Duration(milliseconds: 300);
  static const Duration snackBarDuration = Duration(seconds: 4);
  static const int paginationLimit = 20;
  
  // Security configurations
  static const Duration sessionTimeout = Duration(hours: 8);
  static const int maxLoginAttempts = 5;
  static const Duration loginCooldown = Duration(minutes: 15);
  
  // File upload configurations
  static const int maxImageSize = 10 * 1024 * 1024; // 10MB
  static const int maxFileSize = 50 * 1024 * 1024; // 50MB
  static const List<String> allowedImageFormats = ['jpg', 'jpeg', 'png', 'webp'];
  static const List<String> allowedFileFormats = ['pdf', 'doc', 'docx'];
  
  // Gamification configurations
  static const int baseExperiencePerAction = 10;
  static const int experienceMultiplier = 100;
  static const List<int> levelThresholds = [
    0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500
  ];
}