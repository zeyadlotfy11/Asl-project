import 'package:freezed_annotation/freezed_annotation.dart';

part 'analytics.freezed.dart';
part 'analytics.g.dart';

// AI Analysis Result Model
@freezed
class AIAnalysisResult with _$AIAnalysisResult {
  const factory AIAnalysisResult({
    required int artifactId,
    required String analysisType,
    required double confidenceScore,
    required List<String> findings,
    required List<String> recommendations,
    required int timestamp,
  }) = _AIAnalysisResult;
  
  factory AIAnalysisResult.fromJson(Map<String, dynamic> json) =>
      _$AIAnalysisResultFromJson(json);
}

// Analytics Report Model
@freezed
class AnalyticsReport with _$AnalyticsReport {
  const factory AnalyticsReport({
    required int id,
    required String reportType,
    required int generatedAt,
    required Map<String, String> data,
    required List<String> insights,
    required TimeRange timeRange,
  }) = _AnalyticsReport;
  
  factory AnalyticsReport.fromJson(Map<String, dynamic> json) =>
      _$AnalyticsReportFromJson(json);
}

// Time Range Model
@freezed
class TimeRange with _$TimeRange {
  const factory TimeRange({
    required int start,
    required int end,
  }) = _TimeRange;
  
  factory TimeRange.fromJson(Map<String, dynamic> json) =>
      _$TimeRangeFromJson(json);
}

// Pattern Analysis Model
@freezed
class PatternAnalysis with _$PatternAnalysis {
  const factory PatternAnalysis({
    required String patternType,
    required int frequency,
    required double confidence,
    required String description,
    required List<String> recommendations,
  }) = _PatternAnalysis;
  
  factory PatternAnalysis.fromJson(Map<String, dynamic> json) =>
      _$PatternAnalysisFromJson(json);
}

// System Statistics Model
@freezed
class SystemStats with _$SystemStats {
  const factory SystemStats({
    required int totalArtifacts,
    required int totalProposals,
    required int totalUsers,
    required int totalNfts,
    required int verifiedArtifacts,
    required int activeProposals,
    required int lastUpdated,
  }) = _SystemStats;
  
  factory SystemStats.fromJson(Map<String, dynamic> json) =>
      _$SystemStatsFromJson(json);
}

// Health Status Model
@freezed
class HealthStatus with _$HealthStatus {
  const factory HealthStatus({
    required String status,
    required int timestamp,
    required String version,
    required int uptime,
  }) = _HealthStatus;
  
  factory HealthStatus.fromJson(Map<String, dynamic> json) =>
      _$HealthStatusFromJson(json);
}

// Audit Entry Model
@freezed
class AuditEntry with _$AuditEntry {
  const factory AuditEntry({
    required int id,
    required String eventType,
    required String actor,
    int? artifactId,
    required String description,
    required int timestamp,
    required String severity,
  }) = _AuditEntry;
  
  factory AuditEntry.fromJson(Map<String, dynamic> json) =>
      _$AuditEntryFromJson(json);
}

// Dashboard Analytics Model
@freezed
class DashboardAnalytics with _$DashboardAnalytics {
  const factory DashboardAnalytics({
    required SystemStats systemStats,
    required List<PatternAnalysis> recentPatterns,
    required List<AuditEntry> recentActivity,
    required Map<String, int> userActivityByRole,
    required Map<String, int> artifactsByStatus,
    required Map<String, int> proposalsByType,
    required List<TrendData> weeklyTrends,
  }) = _DashboardAnalytics;
  
  factory DashboardAnalytics.fromJson(Map<String, dynamic> json) =>
      _$DashboardAnalyticsFromJson(json);
}

// Trend Data Model
@freezed
class TrendData with _$TrendData {
  const factory TrendData({
    required String label,
    required double value,
    required DateTime date,
    String? category,
  }) = _TrendData;
  
  factory TrendData.fromJson(Map<String, dynamic> json) =>
      _$TrendDataFromJson(json);
}

// Extensions for better usability
extension AIAnalysisResultExtension on AIAnalysisResult {
  DateTime get analysisDate => DateTime.fromMillisecondsSinceEpoch(timestamp);
  
  String get confidenceLevel {
    if (confidenceScore >= 0.9) return 'Very High';
    if (confidenceScore >= 0.7) return 'High';
    if (confidenceScore >= 0.5) return 'Medium';
    if (confidenceScore >= 0.3) return 'Low';
    return 'Very Low';
  }
  
  String get confidencePercentage => '${(confidenceScore * 100).toStringAsFixed(1)}%';
  
  bool get isHighConfidence => confidenceScore >= 0.7;
  bool get isLowConfidence => confidenceScore < 0.5;
  
  String get analysisTypeDisplay => analysisType
      .replaceAll('_', ' ')
      .split(' ')
      .map((word) => word.isEmpty ? '' : word[0].toUpperCase() + word.substring(1))
      .join(' ');
  
  List<String> get keyFindings => findings.take(3).toList();
  List<String> get priorityRecommendations => recommendations.take(2).toList();
}

extension AnalyticsReportExtension on AnalyticsReport {
  DateTime get generatedDate => DateTime.fromMillisecondsSinceEpoch(generatedAt);
  DateTime get startDate => DateTime.fromMillisecondsSinceEpoch(timeRange.start);
  DateTime get endDate => DateTime.fromMillisecondsSinceEpoch(timeRange.end);
  
  Duration get timeSpan => endDate.difference(startDate);
  
  String get reportTypeDisplay => reportType
      .replaceAll('_', ' ')
      .split(' ')
      .map((word) => word.isEmpty ? '' : word[0].toUpperCase() + word.substring(1))
      .join(' ');
  
  String get formattedTimeRange {
    final start = startDate;
    final end = endDate;
    
    if (timeSpan.inDays <= 1) {
      return 'Daily Report';
    } else if (timeSpan.inDays <= 7) {
      return 'Weekly Report';
    } else if (timeSpan.inDays <= 31) {
      return 'Monthly Report';
    } else {
      return 'Custom Range Report';
    }
  }
  
  Map<String, String> get keyMetrics {
    final metrics = <String, String>{};
    data.forEach((key, value) {
      final displayKey = key
          .replaceAll('_', ' ')
          .split(' ')
          .map((word) => word.isEmpty ? '' : word[0].toUpperCase() + word.substring(1))
          .join(' ');
      metrics[displayKey] = value;
    });
    return metrics;
  }
  
  List<String> get topInsights => insights.take(5).toList();
}

extension SystemStatsExtension on SystemStats {
  DateTime get lastUpdatedDate => DateTime.fromMillisecondsSinceEpoch(lastUpdated);
  
  double get verificationRate => totalArtifacts == 0 
      ? 0.0 
      : (verifiedArtifacts / totalArtifacts);
  
  String get verificationPercentage => '${(verificationRate * 100).toStringAsFixed(1)}%';
  
  double get proposalActivityRate => totalProposals == 0 
      ? 0.0 
      : (activeProposals / totalProposals);
  
  String get activityLevel {
    final rate = proposalActivityRate;
    if (rate >= 0.3) return 'Very Active';
    if (rate >= 0.2) return 'Active';
    if (rate >= 0.1) return 'Moderate';
    return 'Low';
  }
  
  Map<String, int> get summaryStats => {
    'Artifacts': totalArtifacts,
    'Proposals': totalProposals,
    'Users': totalUsers,
    'NFTs': totalNfts,
  };
  
  List<MapEntry<String, String>> get quickStats => [
    MapEntry('Verification Rate', verificationPercentage),
    MapEntry('Active Proposals', '$activeProposals'),
    MapEntry('Total Users', '$totalUsers'),
    MapEntry('Activity Level', activityLevel),
  ];
}

extension AuditEntryExtension on AuditEntry {
  DateTime get eventDate => DateTime.fromMillisecondsSinceEpoch(timestamp);
  
  String get formattedTimestamp {
    final now = DateTime.now();
    final difference = now.difference(eventDate);
    
    if (difference.inDays > 0) {
      return '${difference.inDays}d ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m ago';
    } else {
      return 'Just now';
    }
  }
  
  String get shortActor => actor.length > 12 
      ? '${actor.substring(0, 6)}...${actor.substring(actor.length - 6)}'
      : actor;
  
  String get severityColor {
    switch (severity.toLowerCase()) {
      case 'critical':
        return '#F44336';
      case 'high':
        return '#FF9800';
      case 'medium':
        return '#2196F3';
      case 'low':
        return '#4CAF50';
      default:
        return '#9E9E9E';
    }
  }
  
  String get severityIcon {
    switch (severity.toLowerCase()) {
      case 'critical':
        return '🚨';
      case 'high':
        return '⚠️';
      case 'medium':
        return 'ℹ️';
      case 'low':
        return '✅';
      default:
        return '📝';
    }
  }
  
  String get eventTypeDisplay => eventType
      .replaceAll('_', ' ')
      .split(' ')
      .map((word) => word.isEmpty ? '' : word[0].toUpperCase() + word.substring(1))
      .join(' ');
}