import 'package:freezed_annotation/freezed_annotation.dart';
import 'enums.dart';

part 'user.freezed.dart';
part 'user.g.dart';

// User Model
@freezed
class User with _$User {
  const factory User({
    required UserRole role,
    required int reputation,
    int? verifiedAt,
    String? institution,
    required List<String> specialization,
  }) = _User;
  
  factory User.fromJson(Map<String, dynamic> json) =>
      _$UserFromJson(json);
}

// User Progress Model
@freezed
class UserProgress with _$UserProgress {
  const factory UserProgress({
    required String user,
    required int level,
    required int experiencePoints,
    required List<String> achievements,
    required List<int> completedQuests,
    required List<String> badges,
  }) = _UserProgress;
  
  factory UserProgress.fromJson(Map<String, dynamic> json) =>
      _$UserProgressFromJson(json);
}

// User Statistics Model
@freezed
class UserStatistics with _$UserStatistics {
  const factory UserStatistics({
    required int totalArtifactsSubmitted,
    required int totalVotes,
    required int totalProposalsCreated,
    required int totalNFTsOwned,
    required int totalCollaborationsJoined,
    required double averageReputationGain,
    required DateTime lastActivity,
    required Map<String, int> monthlyActivity,
  }) = _UserStatistics;
  
  factory UserStatistics.fromJson(Map<String, dynamic> json) =>
      _$UserStatisticsFromJson(json);
}

// User Profile (Extended User Info)
@freezed
class UserProfile with _$UserProfile {
  const factory UserProfile({
    required String principal,
    required User user,
    UserProgress? progress,
    UserStatistics? statistics,
    String? profileImageUrl,
    String? bio,
    String? website,
    String? location,
    List<String>? languages,
    DateTime? joinedAt,
    DateTime? lastSeen,
    bool? isOnline,
  }) = _UserProfile;
  
  factory UserProfile.fromJson(Map<String, dynamic> json) =>
      _$UserProfileFromJson(json);
}

// User Activity Model
@freezed
class UserActivity with _$UserActivity {
  const factory UserActivity({
    required String id,
    required String userId,
    required String activityType,
    required String description,
    required DateTime timestamp,
    Map<String, dynamic>? metadata,
    int? points,
  }) = _UserActivity;
  
  factory UserActivity.fromJson(Map<String, dynamic> json) =>
      _$UserActivityFromJson(json);
}

// Extensions for better usability
extension UserExtension on User {
  bool get isVerified => verifiedAt != null;
  
  DateTime? get verificationDate => verifiedAt != null 
      ? DateTime.fromMillisecondsSinceEpoch(verifiedAt!)
      : null;
  
  String get displayRole => role.displayName;
  
  List<String> get permissions => role.permissions;
  
  bool hasPermission(String permission) => permissions.contains(permission);
  
  bool get canSubmitArtifacts => hasPermission('submit_artifacts');
  bool get canVerifyArtifacts => hasPermission('verify_artifacts');
  bool get canCreateProposals => hasPermission('create_proposals');
  bool get canManageUsers => hasPermission('manage_users');
  bool get canExecuteProposals => hasPermission('execute_proposals');
  
  String get reputationLevel {
    if (reputation >= 10000) return 'Master';
    if (reputation >= 5000) return 'Expert';
    if (reputation >= 2000) return 'Advanced';
    if (reputation >= 500) return 'Intermediate';
    if (reputation >= 100) return 'Beginner';
    return 'Newcomer';
  }
  
  String get institutionDisplay => institution ?? 'Independent';
  
  String get specializationDisplay => specialization.isEmpty 
      ? 'General' 
      : specialization.join(', ');
}

extension UserProgressExtension on UserProgress {
  double get levelProgress {
    const levelThresholds = [
      0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500
    ];
    
    if (level >= levelThresholds.length) return 1.0;
    
    final currentLevelXP = levelThresholds[level];
    final nextLevelXP = level + 1 < levelThresholds.length 
        ? levelThresholds[level + 1] 
        : levelThresholds.last;
    
    final progressXP = experiencePoints - currentLevelXP;
    final requiredXP = nextLevelXP - currentLevelXP;
    
    return (progressXP / requiredXP).clamp(0.0, 1.0);
  }
  
  int get experienceToNextLevel {
    const levelThresholds = [
      0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500
    ];
    
    if (level + 1 >= levelThresholds.length) return 0;
    
    return levelThresholds[level + 1] - experiencePoints;
  }
  
  String get levelTitle {
    if (level >= 10) return 'Master Archaeologist';
    if (level >= 8) return 'Senior Expert';
    if (level >= 6) return 'Expert Verifier';
    if (level >= 4) return 'Advanced Contributor';
    if (level >= 2) return 'Active Member';
    return 'Newcomer';
  }
  
  List<String> get recentAchievements => achievements.take(5).toList();
  
  int get totalQuestsCompleted => completedQuests.length;
  
  String get badgeDisplay => badges.isEmpty ? 'No badges yet' : badges.join(', ');
}

extension UserProfileExtension on UserProfile {
  String get displayName {
    if (user.institution != null && user.institution!.isNotEmpty) {
      return user.institution!;
    }
    return principal.length > 12 
        ? '${principal.substring(0, 6)}...${principal.substring(principal.length - 6)}'
        : principal;
  }
  
  String get shortPrincipal => principal.length > 12 
      ? '${principal.substring(0, 6)}...${principal.substring(principal.length - 6)}'
      : principal;
  
  bool get hasProgress => progress != null;
  bool get hasStatistics => statistics != null;
  
  String get memberSince => joinedAt != null 
      ? 'Member since ${joinedAt!.year}'
      : 'New member';
  
  String get lastSeenText {
    if (isOnline == true) return 'Online now';
    if (lastSeen == null) return 'Last seen: Unknown';
    
    final difference = DateTime.now().difference(lastSeen!);
    if (difference.inDays > 30) {
      return 'Last seen: ${difference.inDays ~/ 30} month(s) ago';
    } else if (difference.inDays > 0) {
      return 'Last seen: ${difference.inDays} day(s) ago';
    } else if (difference.inHours > 0) {
      return 'Last seen: ${difference.inHours} hour(s) ago';
    } else {
      return 'Last seen: Recently';
    }
  }
  
  List<String> get allSpecializations {
    final specializations = <String>[...user.specialization];
    if (languages != null) {
      specializations.addAll(languages!.map((lang) => 'Language: $lang'));
    }
    return specializations;
  }
}

extension UserStatisticsExtension on UserStatistics {
  double get activityScore {
    final weights = {
      'artifacts': 5.0,
      'votes': 1.0,
      'proposals': 3.0,
      'nfts': 2.0,
      'collaborations': 2.0,
    };
    
    final score = (totalArtifactsSubmitted * weights['artifacts']!) +
                  (totalVotes * weights['votes']!) +
                  (totalProposalsCreated * weights['proposals']!) +
                  (totalNFTsOwned * weights['nfts']!) +
                  (totalCollaborationsJoined * weights['collaborations']!);
    
    return score;
  }
  
  String get activityLevel {
    final score = activityScore;
    if (score >= 500) return 'Very High';
    if (score >= 200) return 'High';
    if (score >= 50) return 'Moderate';
    if (score >= 10) return 'Low';
    return 'Minimal';
  }
  
  List<MapEntry<String, int>> get sortedMonthlyActivity {
    final entries = monthlyActivity.entries.toList();
    entries.sort((a, b) => a.key.compareTo(b.key));
    return entries;
  }
  
  int get totalContributions => 
      totalArtifactsSubmitted + 
      totalVotes + 
      totalProposalsCreated + 
      totalCollaborationsJoined;
}