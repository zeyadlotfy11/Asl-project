import 'package:freezed_annotation/freezed_annotation.dart';

part 'gamification.freezed.dart';
part 'gamification.g.dart';

// Quest Model
@freezed
class Quest with _$Quest {
  const factory Quest({
    required int id,
    required String title,
    required String description,
    required List<String> objectives,
    required List<String> rewards,
    required int durationDays,
    required List<String> participants,
    required String status,
  }) = _Quest;
  
  factory Quest.fromJson(Map<String, dynamic> json) =>
      _$QuestFromJson(json);
}

// User Progress Model (Extended from user.dart)
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

// Achievement Model
@freezed
class Achievement with _$Achievement {
  const factory Achievement({
    required String id,
    required String title,
    required String description,
    required String category,
    required int points,
    required String icon,
    required List<String> requirements,
    required bool isUnlocked,
    DateTime? unlockedAt,
    String? rarity,
  }) = _Achievement;
  
  factory Achievement.fromJson(Map<String, dynamic> json) =>
      _$AchievementFromJson(json);
}

// Badge Model
@freezed
class Badge with _$Badge {
  const factory Badge({
    required String id,
    required String name,
    required String description,
    required String icon,
    required String color,
    required String category,
    required DateTime earnedAt,
    String? earnedFor,
  }) = _Badge;
  
  factory Badge.fromJson(Map<String, dynamic> json) =>
      _$BadgeFromJson(json);
}

// Leaderboard Entry Model
@freezed
class LeaderboardEntry with _$LeaderboardEntry {
  const factory LeaderboardEntry({
    required String userId,
    required int rank,
    required int points,
    required int level,
    String? displayName,
    String? avatar,
    Map<String, dynamic>? stats,
  }) = _LeaderboardEntry;
  
  factory LeaderboardEntry.fromJson(Map<String, dynamic> json) =>
      _$LeaderboardEntryFromJson(json);
}

// Quest Objective Model
@freezed
class QuestObjective with _$QuestObjective {
  const factory QuestObjective({
    required String id,
    required String description,
    required String type,
    required int targetValue,
    required int currentValue,
    required bool isCompleted,
    String? reward,
  }) = _QuestObjective;
  
  factory QuestObjective.fromJson(Map<String, dynamic> json) =>
      _$QuestObjectiveFromJson(json);
}

// Challenge Model
@freezed
class Challenge with _$Challenge {
  const factory Challenge({
    required String id,
    required String title,
    required String description,
    required DateTime startDate,
    required DateTime endDate,
    required List<String> participants,
    required Map<String, int> leaderboard,
    required List<String> rewards,
    required String status,
  }) = _Challenge;
  
  factory Challenge.fromJson(Map<String, dynamic> json) =>
      _$ChallengeFromJson(json);
}

// Extensions for better usability
extension QuestExtension on Quest {
  bool get isActive => status.toLowerCase() == 'active';
  bool get isCompleted => status.toLowerCase() == 'completed';
  bool get isExpired => status.toLowerCase() == 'expired';
  
  int get participantCount => participants.length;
  
  String get participantCountDisplay => participantCount == 1 
      ? '1 participant' 
      : '$participantCount participants';
  
  String get statusDisplay => status
      .replaceAll('_', ' ')
      .split(' ')
      .map((word) => word.isEmpty ? '' : word[0].toUpperCase() + word.substring(1))
      .join(' ');
  
  String get statusColor {
    switch (status.toLowerCase()) {
      case 'active':
        return '#4CAF50';
      case 'completed':
        return '#2196F3';
      case 'expired':
        return '#9E9E9E';
      default:
        return '#FF9800';
    }
  }
  
  String get durationDisplay {
    if (durationDays == 1) return '1 day';
    if (durationDays < 7) return '$durationDays days';
    if (durationDays == 7) return '1 week';
    if (durationDays < 30) return '${(durationDays / 7).ceil()} weeks';
    return '${(durationDays / 30).ceil()} months';
  }
  
  List<String> get keyObjectives => objectives.take(3).toList();
  List<String> get primaryRewards => rewards.take(2).toList();
  
  bool isParticipant(String userId) => participants.contains(userId);
  
  String get difficultyLevel {
    if (objectives.length >= 5) return 'Hard';
    if (objectives.length >= 3) return 'Medium';
    return 'Easy';
  }
  
  String get questTypeIcon {
    if (title.toLowerCase().contains('artifact')) return '🏺';
    if (title.toLowerCase().contains('vote')) return '🗳️';
    if (title.toLowerCase().contains('community')) return '👥';
    if (title.toLowerCase().contains('expert')) return '🎓';
    return '🎯';
  }
}

extension AchievementExtension on Achievement {
  String get categoryDisplay => category
      .replaceAll('_', ' ')
      .split(' ')
      .map((word) => word.isEmpty ? '' : word[0].toUpperCase() + word.substring(1))
      .join(' ');
  
  String get rarityDisplay => rarity?.toUpperCase() ?? 'COMMON';
  
  String get rarityColor {
    switch (rarity?.toLowerCase()) {
      case 'legendary':
        return '#FFD700';
      case 'epic':
        return '#8B00FF';
      case 'rare':
        return '#0080FF';
      case 'uncommon':
        return '#00FF00';
      default:
        return '#808080';
    }
  }
  
  String get pointsDisplay => '$points XP';
  
  String get statusDisplay => isUnlocked ? 'Unlocked' : 'Locked';
  
  String get formattedUnlockedDate {
    if (unlockedAt == null) return 'Not unlocked';
    
    final now = DateTime.now();
    final difference = now.difference(unlockedAt!);
    
    if (difference.inDays > 30) {
      return 'Unlocked ${(difference.inDays / 30).floor()} month(s) ago';
    } else if (difference.inDays > 0) {
      return 'Unlocked ${difference.inDays} day(s) ago';
    } else if (difference.inHours > 0) {
      return 'Unlocked ${difference.inHours} hour(s) ago';
    } else {
      return 'Recently unlocked';
    }
  }
  
  double get completionProgress {
    // This would need to be calculated based on current user progress
    // For now, return 1.0 if unlocked, 0.0 if not
    return isUnlocked ? 1.0 : 0.0;
  }
  
  List<String> get keyRequirements => requirements.take(3).toList();
}

extension BadgeExtension on Badge {
  String get categoryDisplay => category
      .replaceAll('_', ' ')
      .split(' ')
      .map((word) => word.isEmpty ? '' : word[0].toUpperCase() + word.substring(1))
      .join(' ');
  
  String get formattedEarnedDate {
    final now = DateTime.now();
    final difference = now.difference(earnedAt);
    
    if (difference.inDays > 30) {
      return 'Earned ${(difference.inDays / 30).floor()} month(s) ago';
    } else if (difference.inDays > 0) {
      return 'Earned ${difference.inDays} day(s) ago';
    } else if (difference.inHours > 0) {
      return 'Earned ${difference.inHours} hour(s) ago';
    } else {
      return 'Recently earned';
    }
  }
  
  String get earnedForDisplay => earnedFor ?? 'General achievement';
}

extension LeaderboardEntryExtension on LeaderboardEntry {
  String get displayUserName => displayName ?? 
      (userId.length > 12 
          ? '${userId.substring(0, 6)}...${userId.substring(userId.length - 6)}'
          : userId);
  
  String get rankDisplay {
    switch (rank) {
      case 1:
        return '🥇 #1';
      case 2:
        return '🥈 #2';
      case 3:
        return '🥉 #3';
      default:
        return '#$rank';
    }
  }
  
  String get pointsDisplay => '$points XP';
  
  String get levelDisplay => 'Level $level';
  
  bool get isTopThree => rank <= 3;
  
  String get rankColor {
    switch (rank) {
      case 1:
        return '#FFD700';
      case 2:
        return '#C0C0C0';
      case 3:
        return '#CD7F32';
      default:
        return '#666666';
    }
  }
  
  Map<String, dynamic> get safeStats => stats ?? {};
}

extension ChallengeExtension on Challenge {
  bool get isActive => status.toLowerCase() == 'active';
  bool get isCompleted => status.toLowerCase() == 'completed';
  bool get isUpcoming => status.toLowerCase() == 'upcoming';
  
  DateTime get now => DateTime.now();
  bool get hasStarted => now.isAfter(startDate);
  bool get hasEnded => now.isAfter(endDate);
  
  Duration get timeRemaining => hasEnded ? Duration.zero : endDate.difference(now);
  Duration get timeUntilStart => hasStarted ? Duration.zero : startDate.difference(now);
  
  String get formattedTimeRemaining {
    if (hasEnded) return 'Ended';
    
    final remaining = timeRemaining;
    if (remaining.inDays > 0) {
      return '${remaining.inDays}d ${remaining.inHours % 24}h remaining';
    } else if (remaining.inHours > 0) {
      return '${remaining.inHours}h ${remaining.inMinutes % 60}m remaining';
    } else {
      return '${remaining.inMinutes}m remaining';
    }
  }
  
  int get participantCount => participants.length;
  
  String get participantCountDisplay => participantCount == 1 
      ? '1 participant' 
      : '$participantCount participants';
  
  List<MapEntry<String, int>> get sortedLeaderboard {
    final entries = leaderboard.entries.toList();
    entries.sort((a, b) => b.value.compareTo(a.value));
    return entries;
  }
  
  List<MapEntry<String, int>> get topParticipants => sortedLeaderboard.take(5).toList();
  
  bool isParticipant(String userId) => participants.contains(userId);
  
  String get statusColor {
    switch (status.toLowerCase()) {
      case 'active':
        return '#4CAF50';
      case 'completed':
        return '#2196F3';
      case 'upcoming':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  }
  
  String get durationDisplay {
    final duration = endDate.difference(startDate);
    if (duration.inDays > 0) {
      return '${duration.inDays} day(s)';
    } else if (duration.inHours > 0) {
      return '${duration.inHours} hour(s)';
    } else {
      return '${duration.inMinutes} minute(s)';
    }
  }
}