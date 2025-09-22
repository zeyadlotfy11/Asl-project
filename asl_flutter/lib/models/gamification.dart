class Quest {
  final int id;
  final String title;
  final String description;
  final List<String> objectives;
  final List<String> rewards;
  final int durationDays;
  final List<String> participants;
  final String status;

  Quest({
    required this.id,
    required this.title,
    required this.description,
    required this.objectives,
    required this.rewards,
    required this.durationDays,
    required this.participants,
    required this.status,
  });

  factory Quest.fromJson(Map<String, dynamic> json) {
    return Quest(
      id: json['id'] as int,
      title: json['title'] as String,
      description: json['description'] as String,
      objectives: List<String>.from(json['objectives'] as List),
      rewards: List<String>.from(json['rewards'] as List),
      durationDays: json['duration_days'] as int,
      participants: List<String>.from(json['participants'] as List),
      status: json['status'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'objectives': objectives,
      'rewards': rewards,
      'duration_days': durationDays,
      'participants': participants,
      'status': status,
    };
  }

  bool get isActive => status.toLowerCase() == 'active';
  bool get isCompleted => status.toLowerCase() == 'completed';
}

class UserProgress {
  final String user;
  final int level;
  final int experiencePoints;
  final List<String> achievements;
  final List<int> completedQuests;
  final List<String> badges;

  UserProgress({
    required this.user,
    required this.level,
    required this.experiencePoints,
    required this.achievements,
    required this.completedQuests,
    required this.badges,
  });

  factory UserProgress.fromJson(Map<String, dynamic> json) {
    return UserProgress(
      user: json['user'] as String,
      level: json['level'] as int,
      experiencePoints: json['experience_points'] as int,
      achievements: List<String>.from(json['achievements'] as List),
      completedQuests: List<int>.from(json['completed_quests'] as List),
      badges: List<String>.from(json['badges'] as List),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'user': user,
      'level': level,
      'experience_points': experiencePoints,
      'achievements': achievements,
      'completed_quests': completedQuests,
      'badges': badges,
    };
  }

  int get nextLevelXP => (level + 1) * 1000; // Simple formula
  double get progressToNextLevel => experiencePoints % 1000 / 1000;
  
  String get levelTitle {
    if (level >= 50) return 'Master Archaeologist';
    if (level >= 30) return 'Expert Researcher';
    if (level >= 20) return 'Senior Investigator';
    if (level >= 10) return 'Archaeological Specialist';
    if (level >= 5) return 'Heritage Enthusiast';
    return 'Novice Explorer';
  }
}