import 'package:dio/dio.dart';
import 'package:dio_cache_interceptor/dio_cache_interceptor.dart';
import 'package:dio_cache_interceptor_hive_store/dio_cache_interceptor_hive_store.dart';
import 'package:path_provider/path_provider.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:logger/logger.dart';
import '../core/app_config.dart';
import '../core/exceptions.dart';

class NetworkService {
  static NetworkService? _instance;
  static NetworkService get instance => _instance ??= NetworkService._();
  
  late final Dio _dio;
  late final CacheOptions _cacheOptions;
  late final Logger _logger;
  late final Connectivity _connectivity;
  
  NetworkService._() {
    _logger = Logger();
    _connectivity = Connectivity();
    _initializeDio();
  }
  
  Future<void> _initializeDio() async {
    _dio = Dio();
    
    // Configure base options
    _dio.options = BaseOptions(
      baseUrl: AppConfig.icNetwork,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      sendTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    );
    
    // Add cache interceptor
    await _setupCacheInterceptor();
    
    // Add logging interceptor (only in debug mode)
    if (AppConfig.isDebug) {
      _dio.interceptors.add(LogInterceptor(
        requestBody: true,
        responseBody: true,
        logPrint: (object) => _logger.d(object),
      ));
    }
    
    // Add error interceptor
    _dio.interceptors.add(InterceptorsWrapper(
      onError: (error, handler) {
        _handleDioError(error);
        handler.next(error);
      },
    ));
    
    // Add connectivity interceptor
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        if (await _isConnected()) {
          handler.next(options);
        } else {
          handler.reject(
            DioException(
              requestOptions: options,
              error: const NetworkException('No internet connection'),
              type: DioExceptionType.connectionError,
            ),
          );
        }
      },
    ));
  }
  
  Future<void> _setupCacheInterceptor() async {
    final appDir = await getApplicationDocumentsDirectory();
    final cacheDir = '${appDir.path}/cache';
    
    _cacheOptions = CacheOptions(
      store: HiveCacheStore(cacheDir),
      policy: CachePolicy.request,
      hitCacheOnErrorExcept: [401, 403, 500],
      maxStale: AppConfig.cacheExpiration,
      priority: CachePriority.normal,
      cipher: null,
      keyBuilder: CacheOptions.defaultCacheKeyBuilder,
      allowPostMethod: false,
    );
    
    _dio.interceptors.add(DioCacheInterceptor(options: _cacheOptions));
  }
  
  Future<bool> _isConnected() async {
    final result = await _connectivity.checkConnectivity();
    return result != ConnectivityResult.none;
  }
  
  void _handleDioError(DioException error) {
    _logger.e('Network error: ${error.message}', error);
    
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        throw const NetworkException('Connection timeout');
      case DioExceptionType.badResponse:
        final statusCode = error.response?.statusCode;
        final message = error.response?.data?['message'] ?? 'Request failed';
        throw BackendException(message, statusCode: statusCode);
      case DioExceptionType.cancel:
        throw const NetworkException('Request cancelled');
      case DioExceptionType.connectionError:
        throw const NetworkException('Connection error');
      default:
        throw NetworkException('Network error: ${error.message}');
    }
  }
  
  // GET request with caching
  Future<Response<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
    bool useCache = true,
  }) async {
    try {
      final response = await _dio.get<T>(
        path,
        queryParameters: queryParameters,
        options: options?.copyWith(
          extra: useCache ? _cacheOptions.toExtra() : null,
        ) ?? Options(extra: useCache ? _cacheOptions.toExtra() : null),
        cancelToken: cancelToken,
      );
      return response;
    } catch (e) {
      if (e is DioException) {
        _handleDioError(e);
      }
      rethrow;
    }
  }
  
  // POST request
  Future<Response<T>> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      final response = await _dio.post<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
      return response;
    } catch (e) {
      if (e is DioException) {
        _handleDioError(e);
      }
      rethrow;
    }
  }
  
  // PUT request
  Future<Response<T>> put<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      final response = await _dio.put<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
      return response;
    } catch (e) {
      if (e is DioException) {
        _handleDioError(e);
      }
      rethrow;
    }
  }
  
  // DELETE request
  Future<Response<T>> delete<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      final response = await _dio.delete<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
      return response;
    } catch (e) {
      if (e is DioException) {
        _handleDioError(e);
      }
      rethrow;
    }
  }
  
  // Clear cache
  Future<void> clearCache() async {
    try {
      await _cacheOptions.store?.clean();
    } catch (e) {
      _logger.w('Failed to clear cache: $e');
    }
  }
  
  // Update base URL (for switching networks)
  void updateBaseUrl(String baseUrl) {
    _dio.options.baseUrl = baseUrl;
  }
  
  // Add authorization header
  void setAuthToken(String token) {
    _dio.options.headers['Authorization'] = 'Bearer $token';
  }
  
  // Remove authorization header
  void clearAuthToken() {
    _dio.options.headers.remove('Authorization');
  }
  
  // Get connectivity status
  Future<bool> isConnected() => _isConnected();
  
  // Get cache statistics
  Future<Map<String, dynamic>> getCacheStats() async {
    try {
      // This would require implementing cache statistics in the store
      return {
        'size': 0,
        'entries': 0,
        'hits': 0,
        'misses': 0,
      };
    } catch (e) {
      return {};
    }
  }
}