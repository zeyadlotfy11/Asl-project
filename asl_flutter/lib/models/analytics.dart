class AIAnalysisResult {
  final int artifactId;
  final String analysisType;
  final double confidenceScore;
  final List<String> findings;
  final List<String> recommendations;
  final int timestamp;

  AIAnalysisResult({
    required this.artifactId,
    required this.analysisType,
    required this.confidenceScore,
    required this.findings,
    required this.recommendations,
    required this.timestamp,
  });

  factory AIAnalysisResult.fromJson(Map<String, dynamic> json) {
    return AIAnalysisResult(
      artifactId: json['artifact_id'] as int,
      analysisType: json['analysis_type'] as String,
      confidenceScore: (json['confidence_score'] as num).toDouble(),
      findings: List<String>.from(json['findings'] as List),
      recommendations: List<String>.from(json['recommendations'] as List),
      timestamp: json['timestamp'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'artifact_id': artifactId,
      'analysis_type': analysisType,
      'confidence_score': confidenceScore,
      'findings': findings,
      'recommendations': recommendations,
      'timestamp': timestamp,
    };
  }

  DateTime get timestampDateTime => DateTime.fromMillisecondsSinceEpoch(timestamp ~/ 1000000);
  
  String get confidenceLevel {
    if (confidenceScore >= 0.9) return 'Very High';
    if (confidenceScore >= 0.75) return 'High';
    if (confidenceScore >= 0.5) return 'Medium';
    if (confidenceScore >= 0.25) return 'Low';
    return 'Very Low';
  }
}

class AnalyticsReport {
  final int id;
  final String reportType;
  final int generatedAt;
  final Map<String, String> data;
  final List<String> insights;
  final ReportTimeRange timeRange;

  AnalyticsReport({
    required this.id,
    required this.reportType,
    required this.generatedAt,
    required this.data,
    required this.insights,
    required this.timeRange,
  });

  factory AnalyticsReport.fromJson(Map<String, dynamic> json) {
    return AnalyticsReport(
      id: json['id'] as int,
      reportType: json['report_type'] as String,
      generatedAt: json['generated_at'] as int,
      data: Map<String, String>.from(json['data'] as Map),
      insights: List<String>.from(json['insights'] as List),
      timeRange: ReportTimeRange.fromJson(json['time_range'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'report_type': reportType,
      'generated_at': generatedAt,
      'data': data,
      'insights': insights,
      'time_range': timeRange.toJson(),
    };
  }

  DateTime get generatedAtDateTime => DateTime.fromMillisecondsSinceEpoch(generatedAt ~/ 1000000);
}

class ReportTimeRange {
  final int startTime;
  final int endTime;

  ReportTimeRange({
    required this.startTime,
    required this.endTime,
  });

  factory ReportTimeRange.fromJson(Map<String, dynamic> json) {
    return ReportTimeRange(
      startTime: json['start_time'] as int,
      endTime: json['end_time'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'start_time': startTime,
      'end_time': endTime,
    };
  }

  DateTime get startDateTime => DateTime.fromMillisecondsSinceEpoch(startTime ~/ 1000000);
  DateTime get endDateTime => DateTime.fromMillisecondsSinceEpoch(endTime ~/ 1000000);
}

class PatternAnalysis {
  final String patternType;
  final int frequency;
  final double confidence;
  final String description;
  final List<String> recommendations;

  PatternAnalysis({
    required this.patternType,
    required this.frequency,
    required this.confidence,
    required this.description,
    required this.recommendations,
  });

  factory PatternAnalysis.fromJson(Map<String, dynamic> json) {
    return PatternAnalysis(
      patternType: json['pattern_type'] as String,
      frequency: json['frequency'] as int,
      confidence: (json['confidence'] as num).toDouble(),
      description: json['description'] as String,
      recommendations: List<String>.from(json['recommendations'] as List),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'pattern_type': patternType,
      'frequency': frequency,
      'confidence': confidence,
      'description': description,
      'recommendations': recommendations,
    };
  }

  String get confidenceLevel {
    if (confidence >= 0.9) return 'Very High';
    if (confidence >= 0.75) return 'High';
    if (confidence >= 0.5) return 'Medium';
    if (confidence >= 0.25) return 'Low';
    return 'Very Low';
  }
}