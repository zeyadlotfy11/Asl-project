import 'package:freezed_annotation/freezed_annotation.dart';
import 'enums.dart';

part 'nft.freezed.dart';
part 'nft.g.dart';

// Proof of Heritage NFT Model
@freezed
class ProofOfHeritageNFT with _$ProofOfHeritageNFT {
  const factory ProofOfHeritageNFT({
    required int id,
    required int artifactId,
    required String owner,
    required int createdAt,
    required Map<String, String> metadata,
    required bool isTransferable,
  }) = _ProofOfHeritageNFT;
  
  factory ProofOfHeritageNFT.fromJson(Map<String, dynamic> json) =>
      _$ProofOfHeritageNFTFromJson(json);
}

// Enhanced NFT Model
@freezed
class EnhancedNFT with _$EnhancedNFT {
  const factory EnhancedNFT({
    required int id,
    required int tokenId,
    required Map<String, String> metadata,
    required int rarityScore,
    required List<String> utilityFeatures,
    required int createdAt,
  }) = _EnhancedNFT;
  
  factory EnhancedNFT.fromJson(Map<String, dynamic> json) =>
      _$EnhancedNFTFromJson(json);
}

// NFT Collection Model
@freezed
class NFTCollection with _$NFTCollection {
  const factory NFTCollection({
    required String id,
    required String name,
    required String description,
    required String creator,
    required List<int> nftIds,
    required Map<String, String> metadata,
    required DateTime createdAt,
    String? coverImageUrl,
    int? totalSupply,
    int? floorPrice,
    double? volume,
  }) = _NFTCollection;
  
  factory NFTCollection.fromJson(Map<String, dynamic> json) =>
      _$NFTCollectionFromJson(json);
}

// NFT Transfer Model
@freezed
class NFTTransfer with _$NFTTransfer {
  const factory NFTTransfer({
    required String id,
    required int nftId,
    required String from,
    required String to,
    required DateTime timestamp,
    String? transactionHash,
    int? price,
    String? currency,
  }) = _NFTTransfer;
  
  factory NFTTransfer.fromJson(Map<String, dynamic> json) =>
      _$NFTTransferFromJson(json);
}

// NFT Metadata Model
@freezed
class NFTMetadata with _$NFTMetadata {
  const factory NFTMetadata({
    required String name,
    required String description,
    required String image,
    String? animationUrl,
    String? externalUrl,
    List<NFTAttribute>? attributes,
    Map<String, dynamic>? properties,
  }) = _NFTMetadata;
  
  factory NFTMetadata.fromJson(Map<String, dynamic> json) =>
      _$NFTMetadataFromJson(json);
}

// NFT Attribute Model
@freezed
class NFTAttribute with _$NFTAttribute {
  const factory NFTAttribute({
    required String traitType,
    required String value,
    String? displayType,
    double? maxValue,
    double? traitCount,
  }) = _NFTAttribute;
  
  factory NFTAttribute.fromJson(Map<String, dynamic> json) =>
      _$NFTAttributeFromJson(json);
}

// Extensions for better usability
extension ProofOfHeritageNFTExtension on ProofOfHeritageNFT {
  DateTime get mintDate => DateTime.fromMillisecondsSinceEpoch(createdAt);
  
  String get shortOwner => owner.length > 12 
      ? '${owner.substring(0, 6)}...${owner.substring(owner.length - 6)}'
      : owner;
  
  String get tokenDisplay => 'NFT #$id';
  
  String? get name => metadata['name'];
  String? get description => metadata['description'];
  String? get imageUrl => metadata['image'];
  String? get culturalSignificance => metadata['cultural_significance'];
  String? get historicalPeriod => metadata['historical_period'];
  String? get authenticity => metadata['authenticity'];
  String? get provenance => metadata['provenance'];
  
  Map<String, String> get displayMetadata {
    final display = <String, String>{};
    metadata.forEach((key, value) {
      final displayKey = key
          .replaceAll('_', ' ')
          .split(' ')
          .map((word) => word.isEmpty ? '' : word[0].toUpperCase() + word.substring(1))
          .join(' ');
      display[displayKey] = value;
    });
    return display;
  }
  
  String get transferabilityStatus => isTransferable 
      ? 'Transferable' 
      : 'Soul-bound (Non-transferable)';
  
  String get formattedMintDate {
    final date = mintDate;
    final now = DateTime.now();
    final difference = now.difference(date);
    
    if (difference.inDays > 365) {
      return 'Minted ${(difference.inDays / 365).floor()} year(s) ago';
    } else if (difference.inDays > 30) {
      return 'Minted ${(difference.inDays / 30).floor()} month(s) ago';
    } else if (difference.inDays > 0) {
      return 'Minted ${difference.inDays} day(s) ago';
    } else {
      return 'Recently minted';
    }
  }
}

extension EnhancedNFTExtension on EnhancedNFT {
  DateTime get mintDate => DateTime.fromMillisecondsSinceEpoch(createdAt);
  
  String get tokenDisplay => 'Token #$tokenId';
  
  String get rarityLevel {
    if (rarityScore >= 90) return 'Legendary';
    if (rarityScore >= 75) return 'Epic';
    if (rarityScore >= 50) return 'Rare';
    if (rarityScore >= 25) return 'Uncommon';
    return 'Common';
  }
  
  String get rarityColor {
    if (rarityScore >= 90) return '#FFD700'; // Gold
    if (rarityScore >= 75) return '#8B00FF'; // Purple
    if (rarityScore >= 50) return '#0080FF'; // Blue
    if (rarityScore >= 25) return '#00FF00'; // Green
    return '#808080'; // Gray
  }
  
  String? get name => metadata['name'];
  String? get description => metadata['description'];
  String? get imageUrl => metadata['image'];
  
  bool get hasUtilityFeatures => utilityFeatures.isNotEmpty;
  
  String get utilityDisplay => utilityFeatures.isEmpty 
      ? 'No special utilities' 
      : utilityFeatures.join(', ');
  
  List<String> get specialFeatures {
    final features = <String>[];
    
    if (rarityScore >= 90) features.add('🏆 Legendary');
    if (utilityFeatures.contains('staking')) features.add('💰 Stakeable');
    if (utilityFeatures.contains('governance')) features.add('🗳️ Governance');
    if (utilityFeatures.contains('exclusive_access')) features.add('🔑 Exclusive Access');
    
    return features;
  }
}

extension NFTCollectionExtension on NFTCollection {
  String get shortCreator => creator.length > 12 
      ? '${creator.substring(0, 6)}...${creator.substring(creator.length - 6)}'
      : creator;
  
  int get itemCount => nftIds.length;
  
  String get itemCountDisplay => itemCount == 1 
      ? '1 item' 
      : '$itemCount items';
  
  String get volumeDisplay => volume != null 
      ? '${volume!.toStringAsFixed(2)} ICP' 
      : 'No volume data';
  
  String get floorPriceDisplay => floorPrice != null 
      ? '${floorPrice! / 100000000} ICP' 
      : 'No floor price';
  
  bool get hasItems => nftIds.isNotEmpty;
  
  String get formattedCreatedDate {
    final now = DateTime.now();
    final difference = now.difference(createdAt);
    
    if (difference.inDays > 365) {
      return 'Created ${(difference.inDays / 365).floor()} year(s) ago';
    } else if (difference.inDays > 30) {
      return 'Created ${(difference.inDays / 30).floor()} month(s) ago';
    } else if (difference.inDays > 0) {
      return 'Created ${difference.inDays} day(s) ago';
    } else {
      return 'Recently created';
    }
  }
}

extension NFTTransferExtension on NFTTransfer {
  String get shortFrom => from.length > 12 
      ? '${from.substring(0, 6)}...${from.substring(from.length - 6)}'
      : from;
  
  String get shortTo => to.length > 12 
      ? '${to.substring(0, 6)}...${to.substring(to.length - 6)}'
      : to;
  
  String get priceDisplay => price != null && currency != null
      ? '${price! / 100000000} $currency'
      : 'No price data';
  
  bool get isSale => price != null && price! > 0;
  
  String get transferType => isSale ? 'Sale' : 'Transfer';
  
  String get formattedTimestamp {
    final now = DateTime.now();
    final difference = now.difference(timestamp);
    
    if (difference.inDays > 0) {
      return '${difference.inDays} day(s) ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} hour(s) ago';
    } else {
      return 'Recently';
    }
  }
}

extension NFTAttributeExtension on NFTAttribute {
  String get displayValue {
    if (displayType == 'percentage') {
      return '$value%';
    } else if (displayType == 'number') {
      return value;
    } else if (displayType == 'date') {
      try {
        final timestamp = int.parse(value);
        final date = DateTime.fromMillisecondsSinceEpoch(timestamp);
        return '${date.day}/${date.month}/${date.year}';
      } catch (e) {
        return value;
      }
    }
    return value;
  }
  
  String get rarity {
    if (traitCount != null && traitCount! < 5) {
      return 'Very Rare';
    } else if (traitCount != null && traitCount! < 20) {
      return 'Rare';
    } else if (traitCount != null && traitCount! < 50) {
      return 'Uncommon';
    }
    return 'Common';
  }
}