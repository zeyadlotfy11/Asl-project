import 'package:agent_dart/agent_dart.dart';

class ICConfig {
  // Replace with your canister ID
  static const String canisterId = 'your-canister-id-here';
  
  // IC network configurations
  static const String host = 'https://ic0.app';
  static const String localHost = 'http://localhost:4943';
  
  static bool get isLocal => false; // Set to true for local development
  
  static String get networkHost => isLocal ? localHost : host;
  
  // DFX local identity
  static const String identityName = 'default';
}

class ICPrincipal {
  static String fromString(String principalString) {
    return principalString;
  }
  
  static bool isValid(String principalString) {
    try {
      Principal.fromText(principalString);
      return true;
    } catch (e) {
      return false;
    }
  }
}