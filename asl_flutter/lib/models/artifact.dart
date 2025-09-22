import 'enums.dart';

class HistoryEntry {
  final int timestamp;
  final String action;
  final String actor;
  final String details;

  HistoryEntry({
    required this.timestamp,
    required this.action,
    required this.actor,
    required this.details,
  });

  factory HistoryEntry.fromJson(Map<String, dynamic> json) {
    return HistoryEntry(
      timestamp: json['timestamp'] as int,
      action: json['action'] as String,
      actor: json['actor'] as String,
      details: json['details'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'timestamp': timestamp,
      'action': action,
      'actor': actor,
      'details': details,
    };
  }

  DateTime get dateTime => DateTime.fromMillisecondsSinceEpoch(timestamp ~/ 1000000);
}

class Artifact {
  final int id;
  final String name;
  final String description;
  final Map<String, String> metadata;
  final List<String> images;
  final String creator;
  final int createdAt;
  final int updatedAt;
  final ArtifactStatus status;
  final String? heritageProof;
  final int authenticityScore;
  final List<HistoryEntry> history;

  Artifact({
    required this.id,
    required this.name,
    required this.description,
    required this.metadata,
    required this.images,
    required this.creator,
    required this.createdAt,
    required this.updatedAt,
    required this.status,
    this.heritageProof,
    required this.authenticityScore,
    required this.history,
  });

  factory Artifact.fromJson(Map<String, dynamic> json) {
    return Artifact(
      id: json['id'] as int,
      name: json['name'] as String,
      description: json['description'] as String,
      metadata: Map<String, String>.from(json['metadata'] as Map),
      images: List<String>.from(json['images'] as List),
      creator: json['creator'] as String,
      createdAt: json['created_at'] as int,
      updatedAt: json['updated_at'] as int,
      status: ArtifactStatusExtension.fromString(json['status'] as String),
      heritageProof: json['heritage_proof'] as String?,
      authenticityScore: json['authenticity_score'] as int,
      history: (json['history'] as List)
          .map((h) => HistoryEntry.fromJson(h as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'metadata': metadata,
      'images': images,
      'creator': creator,
      'created_at': createdAt,
      'updated_at': updatedAt,
      'status': status.value,
      'heritage_proof': heritageProof,
      'authenticity_score': authenticityScore,
      'history': history.map((h) => h.toJson()).toList(),
    };
  }

  DateTime get createdAtDateTime => DateTime.fromMillisecondsSinceEpoch(createdAt ~/ 1000000);
  DateTime get updatedAtDateTime => DateTime.fromMillisecondsSinceEpoch(updatedAt ~/ 1000000);
}

class User {
  final UserRole role;
  final int reputation;
  final int? verifiedAt;
  final String? institution;
  final List<String> specialization;

  User({
    required this.role,
    required this.reputation,
    this.verifiedAt,
    this.institution,
    required this.specialization,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      role: UserRoleExtension.fromString(json['role'] as String),
      reputation: json['reputation'] as int,
      verifiedAt: json['verified_at'] as int?,
      institution: json['institution'] as String?,
      specialization: List<String>.from(json['specialization'] as List),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'role': role.value,
      'reputation': reputation,
      'verified_at': verifiedAt,
      'institution': institution,
      'specialization': specialization,
    };
  }

  DateTime? get verifiedAtDateTime =>
      verifiedAt != null ? DateTime.fromMillisecondsSinceEpoch(verifiedAt! ~/ 1000000) : null;
  
  bool get isVerified => verifiedAt != null;
}

class CreateArtifactRequest {
  final String name;
  final String description;
  final Map<String, String> metadata;
  final List<String> images;
  final String? heritageProof;

  CreateArtifactRequest({
    required this.name,
    required this.description,
    required this.metadata,
    required this.images,
    this.heritageProof,
  });

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'description': description,
      'metadata': metadata,
      'images': images,
      'heritage_proof': heritageProof,
    };
  }
}