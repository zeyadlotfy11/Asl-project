import 'package:freezed_annotation/freezed_annotation.dart';

part 'enums.freezed.dart';
part 'enums.g.dart';

// Artifact Status Enum
@freezed
class ArtifactStatus with _$ArtifactStatus {
  const factory ArtifactStatus.pendingVerification() = _PendingVerification;
  const factory ArtifactStatus.verified() = _Verified;
  const factory ArtifactStatus.disputed() = _Disputed;
  const factory ArtifactStatus.rejected() = _Rejected;
  
  factory ArtifactStatus.fromJson(Map<String, dynamic> json) =>
      _$ArtifactStatusFromJson(json);
}

// User Role Enum
@freezed
class UserRole with _$UserRole {
  const factory UserRole.institution() = _Institution;
  const factory UserRole.expert() = _Expert;
  const factory UserRole.moderator() = _Moderator;
  const factory UserRole.community() = _Community;
  
  factory UserRole.fromJson(Map<String, dynamic> json) =>
      _$UserRoleFromJson(json);
}

// Proposal Type Enum
@freezed
class ProposalType with _$ProposalType {
  const factory ProposalType.verifyArtifact() = _VerifyArtifact;
  const factory ProposalType.disputeArtifact() = _DisputeArtifact;
  const factory ProposalType.updateArtifactStatus() = _UpdateArtifactStatus;
  const factory ProposalType.grantUserRole() = _GrantUserRole;
  
  factory ProposalType.fromJson(Map<String, dynamic> json) =>
      _$ProposalTypeFromJson(json);
}

// Proposal Status Enum
@freezed
class ProposalStatus with _$ProposalStatus {
  const factory ProposalStatus.active() = _Active;
  const factory ProposalStatus.passed() = _Passed;
  const factory ProposalStatus.rejected() = _RejectedStatus;
  const factory ProposalStatus.executed() = _Executed;
  
  factory ProposalStatus.fromJson(Map<String, dynamic> json) =>
      _$ProposalStatusFromJson(json);
}

// Vote Type Enum
@freezed
class VoteType with _$VoteType {
  const factory VoteType.for_() = _For;
  const factory VoteType.against() = _Against;
  const factory VoteType.abstain() = _Abstain;
  
  factory VoteType.fromJson(Map<String, dynamic> json) =>
      _$VoteTypeFromJson(json);
}

// Access Rights Enum
@freezed
class AccessRights with _$AccessRights {
  const factory AccessRights.public() = _Public;
  const factory AccessRights.restricted() = _Restricted;
  const factory AccessRights.private() = _Private;
  
  factory AccessRights.fromJson(Map<String, dynamic> json) =>
      _$AccessRightsFromJson(json);
}

// Extensions for better integration with backend
extension ArtifactStatusExtension on ArtifactStatus {
  String get backendValue {
    return when(
      pendingVerification: () => 'PendingVerification',
      verified: () => 'Verified',
      disputed: () => 'Disputed',
      rejected: () => 'Rejected',
    );
  }
  
  String get displayName {
    return when(
      pendingVerification: () => 'Pending Verification',
      verified: () => 'Verified',
      disputed: () => 'Disputed',
      rejected: () => 'Rejected',
    );
  }
  
  bool get isVerified => this == const ArtifactStatus.verified();
  bool get isPending => this == const ArtifactStatus.pendingVerification();
  bool get isDisputed => this == const ArtifactStatus.disputed();
  bool get isRejected => this == const ArtifactStatus.rejected();
}

extension UserRoleExtension on UserRole {
  String get backendValue {
    return when(
      institution: () => 'Institution',
      expert: () => 'Expert',
      moderator: () => 'Moderator',
      community: () => 'Community',
    );
  }
  
  String get displayName {
    return when(
      institution: () => 'Institution',
      expert: () => 'Expert',
      moderator: () => 'Moderator',
      community: () => 'Community Member',
    );
  }
  
  List<String> get permissions {
    return when(
      institution: () => [
        'submit_artifacts',
        'view_artifacts',
        'vote_on_proposals',
        'create_proposals',
        'manage_institution_data',
      ],
      expert: () => [
        'verify_artifacts',
        'view_artifacts',
        'vote_on_proposals',
        'create_proposals',
        'ai_analysis',
        'expert_endorsement',
      ],
      moderator: () => [
        'verify_artifacts',
        'view_artifacts',
        'vote_on_proposals',
        'create_proposals',
        'manage_users',
        'system_administration',
        'audit_logs',
        'execute_proposals',
      ],
      community: () => [
        'view_artifacts',
        'vote_on_proposals',
        'basic_participation',
      ],
    );
  }
  
  int get hierarchyLevel {
    return when(
      moderator: () => 4,
      expert: () => 3,
      institution: () => 2,
      community: () => 1,
    );
  }
}

extension ProposalTypeExtension on ProposalType {
  String get backendValue {
    return when(
      verifyArtifact: () => 'VerifyArtifact',
      disputeArtifact: () => 'DisputeArtifact',
      updateArtifactStatus: () => 'UpdateArtifactStatus',
      grantUserRole: () => 'GrantUserRole',
    );
  }
  
  String get displayName {
    return when(
      verifyArtifact: () => 'Verify Artifact',
      disputeArtifact: () => 'Dispute Artifact',
      updateArtifactStatus: () => 'Update Artifact Status',
      grantUserRole: () => 'Grant User Role',
    );
  }
  
  String get description {
    return when(
      verifyArtifact: () => 'Propose to verify the authenticity of an artifact',
      disputeArtifact: () => 'Raise concerns about an artifact\'s authenticity',
      updateArtifactStatus: () => 'Change the status of an existing artifact',
      grantUserRole: () => 'Grant special privileges to a user',
    );
  }
}

extension ProposalStatusExtension on ProposalStatus {
  String get backendValue {
    return when(
      active: () => 'Active',
      passed: () => 'Passed',
      rejected: () => 'Rejected',
      executed: () => 'Executed',
    );
  }
  
  String get displayName {
    return when(
      active: () => 'Active',
      passed: () => 'Passed',
      rejected: () => 'Rejected',
      executed: () => 'Executed',
    );
  }
  
  bool get canVote => this == const ProposalStatus.active();
  bool get isCompleted => 
      this == const ProposalStatus.passed() ||
      this == const ProposalStatus.rejected() ||
      this == const ProposalStatus.executed();
}

extension VoteTypeExtension on VoteType {
  String get backendValue {
    return when(
      for_: () => 'For',
      against: () => 'Against',
      abstain: () => 'Abstain',
    );
  }
  
  String get displayName {
    return when(
      for_: () => 'For',
      against: () => 'Against',
      abstain: () => 'Abstain',
    );
  }
  
  String get emoji {
    return when(
      for_: () => '👍',
      against: () => '👎',
      abstain: () => '🤷',
    );
  }
}

extension AccessRightsExtension on AccessRights {
  String get backendValue {
    return when(
      public: () => 'Public',
      restricted: () => 'Restricted',
      private: () => 'Private',
    );
  }
  
  String get displayName {
    return when(
      public: () => 'Public',
      restricted: () => 'Restricted',
      private: () => 'Private',
    );
  }
  
  String get description {
    return when(
      public: () => 'Accessible to everyone',
      restricted: () => 'Limited access to verified users',
      private: () => 'Private access only',
    );
  }
}