import 'package:freezed_annotation/freezed_annotation.dart';
import 'enums.dart';

part 'artifact.freezed.dart';
part 'artifact.g.dart';

// History Entry Model
@freezed
class HistoryEntry with _$HistoryEntry {
  const factory HistoryEntry({
    required int timestamp,
    required String action,
    required String actor,
    required String details,
  }) = _HistoryEntry;
  
  factory HistoryEntry.fromJson(Map<String, dynamic> json) =>
      _$HistoryEntryFromJson(json);
}

// Artifact Model
@freezed
class Artifact with _$Artifact {
  const factory Artifact({
    required int id,
    required String name,
    required String description,
    required Map<String, String> metadata,
    required List<String> images,
    required String creator,
    required int createdAt,
    required int updatedAt,
    required ArtifactStatus status,
    String? heritageProof,
    required int authenticityScore,
    required List<HistoryEntry> history,
  }) = _Artifact;
  
  factory Artifact.fromJson(Map<String, dynamic> json) =>
      _$ArtifactFromJson(json);
}

// Create Artifact Request Model
@freezed
class CreateArtifactRequest with _$CreateArtifactRequest {
  const factory CreateArtifactRequest({
    required String name,
    required String description,
    required Map<String, String> metadata,
    required List<String> images,
    String? heritageProof,
  }) = _CreateArtifactRequest;
  
  factory CreateArtifactRequest.fromJson(Map<String, dynamic> json) =>
      _$CreateArtifactRequestFromJson(json);
}

// Extensions for better usability
extension ArtifactExtension on Artifact {
  DateTime get createdDate => DateTime.fromMillisecondsSinceEpoch(createdAt);
  DateTime get updatedDate => DateTime.fromMillisecondsSinceEpoch(updatedAt);
  
  String get primaryImage => images.isNotEmpty ? images.first : '';
  
  bool get hasHeritageProof => heritageProof != null && heritageProof!.isNotEmpty;
  
  double get authenticityPercentage => (authenticityScore / 100.0).clamp(0.0, 1.0);
  
  String get formattedAuthenticityScore => '${authenticityScore}%';
  
  Map<String, String> get formattedMetadata {
    return metadata.map((key, value) => MapEntry(
      key.replaceAll('_', ' ').split(' ').map((word) => 
        word.isEmpty ? '' : word[0].toUpperCase() + word.substring(1)
      ).join(' '),
      value,
    ));
  }
  
  List<HistoryEntry> get recentHistory {
    final sortedHistory = [...history];
    sortedHistory.sort((a, b) => b.timestamp.compareTo(a.timestamp));
    return sortedHistory.take(5).toList();
  }
  
  String get statusColor {
    return status.when(
      verified: () => '#4CAF50',
      pendingVerification: () => '#FF9800',
      disputed: () => '#F44336',
      rejected: () => '#9E9E9E',
    );
  }
  
  String? get culturalSignificance => metadata['cultural_significance'];
  String? get period => metadata['period'];
  String? get origin => metadata['origin'];
  String? get material => metadata['material'];
  String? get technique => metadata['technique'];
  String? get dimensions => metadata['dimensions'];
  String? get condition => metadata['condition'];
  String? get provenance => metadata['provenance'];
}

extension HistoryEntryExtension on HistoryEntry {
  DateTime get actionDate => DateTime.fromMillisecondsSinceEpoch(timestamp);
  
  String get formattedTimestamp {
    final date = actionDate;
    final now = DateTime.now();
    final difference = now.difference(date);
    
    if (difference.inDays > 365) {
      return '${(difference.inDays / 365).floor()} year(s) ago';
    } else if (difference.inDays > 30) {
      return '${(difference.inDays / 30).floor()} month(s) ago';
    } else if (difference.inDays > 0) {
      return '${difference.inDays} day(s) ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} hour(s) ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes} minute(s) ago';
    } else {
      return 'Just now';
    }
  }
  
  String get shortActor {
    if (actor.length <= 12) return actor;
    return '${actor.substring(0, 6)}...${actor.substring(actor.length - 6)}';
  }
}