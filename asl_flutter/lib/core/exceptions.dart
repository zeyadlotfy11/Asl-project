// Base exception class for ASL application
class ASLException implements Exception {
  final String message;
  final String? code;
  final dynamic details;
  final StackTrace? stackTrace;
  
  const ASLException(
    this.message, {
    this.code,
    this.details,
    this.stackTrace,
  });
  
  @override
  String toString() => 'ASLException($code): $message';
}

// Network related exceptions
class NetworkException extends ASLException {
  const NetworkException(
    super.message, {
    super.code,
    super.details,
    super.stackTrace,
  });
}

// Authentication related exceptions
class AuthException extends ASLException {
  const AuthException(
    super.message, {
    super.code,
    super.details,
    super.stackTrace,
  });
}

// Validation related exceptions
class ValidationException extends ASLException {
  const ValidationException(
    super.message, {
    super.code,
    super.details,
    super.stackTrace,
  });
}

// Backend related exceptions
class BackendException extends ASLException {
  final int? statusCode;
  
  const BackendException(
    super.message, {
    this.statusCode,
    super.code,
    super.details,
    super.stackTrace,
  });
}

// Cache related exceptions
class CacheException extends ASLException {
  const CacheException(
    super.message, {
    super.code,
    super.details,
    super.stackTrace,
  });
}

// Permission related exceptions
class PermissionException extends ASLException {
  const PermissionException(
    super.message, {
    super.code,
    super.details,
    super.stackTrace,
  });
}