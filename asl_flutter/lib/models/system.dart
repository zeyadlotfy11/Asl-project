class SystemStats {
  final int totalArtifacts;
  final int totalProposals;
  final int totalUsers;
  final int totalNfts;
  final int verifiedArtifacts;
  final int activeProposals;
  final int lastUpdated;

  SystemStats({
    required this.totalArtifacts,
    required this.totalProposals,
    required this.totalUsers,
    required this.totalNfts,
    required this.verifiedArtifacts,
    required this.activeProposals,
    required this.lastUpdated,
  });

  factory SystemStats.fromJson(Map<String, dynamic> json) {
    return SystemStats(
      totalArtifacts: json['total_artifacts'] as int,
      totalProposals: json['total_proposals'] as int,
      totalUsers: json['total_users'] as int,
      totalNfts: json['total_nfts'] as int,
      verifiedArtifacts: json['verified_artifacts'] as int,
      activeProposals: json['active_proposals'] as int,
      lastUpdated: json['last_updated'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'total_artifacts': totalArtifacts,
      'total_proposals': totalProposals,
      'total_users': totalUsers,
      'total_nfts': totalNfts,
      'verified_artifacts': verifiedArtifacts,
      'active_proposals': activeProposals,
      'last_updated': lastUpdated,
    };
  }

  DateTime get lastUpdatedDateTime => DateTime.fromMillisecondsSinceEpoch(lastUpdated ~/ 1000000);
  
  double get verificationRate => totalArtifacts > 0 ? verifiedArtifacts / totalArtifacts : 0;
  double get proposalActivityRate => totalProposals > 0 ? activeProposals / totalProposals : 0;
}

class HealthStatus {
  final String status;
  final int timestamp;
  final String version;
  final int uptime;

  HealthStatus({
    required this.status,
    required this.timestamp,
    required this.version,
    required this.uptime,
  });

  factory HealthStatus.fromJson(Map<String, dynamic> json) {
    return HealthStatus(
      status: json['status'] as String,
      timestamp: json['timestamp'] as int,
      version: json['version'] as String,
      uptime: json['uptime'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'status': status,
      'timestamp': timestamp,
      'version': version,
      'uptime': uptime,
    };
  }

  DateTime get timestampDateTime => DateTime.fromMillisecondsSinceEpoch(timestamp ~/ 1000000);
  
  bool get isHealthy => status.toLowerCase() == 'healthy';
  
  String get uptimeFormatted {
    final duration = Duration(milliseconds: uptime ~/ 1000000);
    final days = duration.inDays;
    final hours = duration.inHours % 24;
    final minutes = duration.inMinutes % 60;
    
    if (days > 0) {
      return '${days}d ${hours}h ${minutes}m';
    } else if (hours > 0) {
      return '${hours}h ${minutes}m';
    } else {
      return '${minutes}m';
    }
  }
}

class AuditEntry {
  final int id;
  final String eventType;
  final String actor;
  final int? artifactId;
  final String description;
  final int timestamp;
  final String severity;

  AuditEntry({
    required this.id,
    required this.eventType,
    required this.actor,
    this.artifactId,
    required this.description,
    required this.timestamp,
    required this.severity,
  });

  factory AuditEntry.fromJson(Map<String, dynamic> json) {
    return AuditEntry(
      id: json['id'] as int,
      eventType: json['event_type'] as String,
      actor: json['actor'] as String,
      artifactId: json['artifact_id'] as int?,
      description: json['description'] as String,
      timestamp: json['timestamp'] as int,
      severity: json['severity'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'event_type': eventType,
      'actor': actor,
      'artifact_id': artifactId,
      'description': description,
      'timestamp': timestamp,
      'severity': severity,
    };
  }

  DateTime get timestampDateTime => DateTime.fromMillisecondsSinceEpoch(timestamp ~/ 1000000);
  
  bool get isHighSeverity => severity.toLowerCase() == 'high';
  bool get isMediumSeverity => severity.toLowerCase() == 'medium';
  bool get isLowSeverity => severity.toLowerCase() == 'low';
}