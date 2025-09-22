import 'enums.dart';

class ProofOfHeritageNFT {
  final int id;
  final int artifactId;
  final String owner;
  final int createdAt;
  final Map<String, String> metadata;
  final bool isTransferable;

  ProofOfHeritageNFT({
    required this.id,
    required this.artifactId,
    required this.owner,
    required this.createdAt,
    required this.metadata,
    required this.isTransferable,
  });

  factory ProofOfHeritageNFT.fromJson(Map<String, dynamic> json) {
    return ProofOfHeritageNFT(
      id: json['id'] as int,
      artifactId: json['artifact_id'] as int,
      owner: json['owner'] as String,
      createdAt: json['created_at'] as int,
      metadata: Map<String, String>.from(json['metadata'] as Map),
      isTransferable: json['is_transferable'] as bool,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'artifact_id': artifactId,
      'owner': owner,
      'created_at': createdAt,
      'metadata': metadata,
      'is_transferable': isTransferable,
    };
  }

  DateTime get createdAtDateTime => DateTime.fromMillisecondsSinceEpoch(createdAt ~/ 1000000);
}

class EnhancedNFT {
  final int id;
  final int tokenId;
  final Map<String, String> metadata;
  final int rarityScore;
  final List<String> utilityFeatures;
  final int createdAt;

  EnhancedNFT({
    required this.id,
    required this.tokenId,
    required this.metadata,
    required this.rarityScore,
    required this.utilityFeatures,
    required this.createdAt,
  });

  factory EnhancedNFT.fromJson(Map<String, dynamic> json) {
    return EnhancedNFT(
      id: json['id'] as int,
      tokenId: json['token_id'] as int,
      metadata: Map<String, String>.from(json['metadata'] as Map),
      rarityScore: json['rarity_score'] as int,
      utilityFeatures: List<String>.from(json['utility_features'] as List),
      createdAt: json['created_at'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'token_id': tokenId,
      'metadata': metadata,
      'rarity_score': rarityScore,
      'utility_features': utilityFeatures,
      'created_at': createdAt,
    };
  }

  DateTime get createdAtDateTime => DateTime.fromMillisecondsSinceEpoch(createdAt ~/ 1000000);
  
  String get rarityLevel {
    if (rarityScore >= 90) return 'Legendary';
    if (rarityScore >= 75) return 'Epic';
    if (rarityScore >= 50) return 'Rare';
    if (rarityScore >= 25) return 'Uncommon';
    return 'Common';
  }
}