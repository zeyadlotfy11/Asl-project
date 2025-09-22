// Enum types based on the backend Candid interface

enum ArtifactStatus {
  pendingVerification,
  verified,
  disputed,
  rejected,
}

enum UserRole {
  institution,
  expert,
  moderator,
  community,
}

enum ProposalType {
  verifyArtifact,
  disputeArtifact,
  updateArtifactStatus,
  grantUserRole,
}

enum ProposalStatus {
  active,
  passed,
  rejected,
  executed,
}

enum VoteType {
  forVote,
  against,
  abstain,
}

enum AccessRights {
  public,
  restricted,
  private,
}

// Extension methods for enum serialization
extension ArtifactStatusExtension on ArtifactStatus {
  String get value {
    switch (this) {
      case ArtifactStatus.pendingVerification:
        return 'PendingVerification';
      case ArtifactStatus.verified:
        return 'Verified';
      case ArtifactStatus.disputed:
        return 'Disputed';
      case ArtifactStatus.rejected:
        return 'Rejected';
    }
  }

  static ArtifactStatus fromString(String value) {
    switch (value) {
      case 'PendingVerification':
        return ArtifactStatus.pendingVerification;
      case 'Verified':
        return ArtifactStatus.verified;
      case 'Disputed':
        return ArtifactStatus.disputed;
      case 'Rejected':
        return ArtifactStatus.rejected;
      default:
        throw ArgumentError('Invalid ArtifactStatus: $value');
    }
  }
}

extension UserRoleExtension on UserRole {
  String get value {
    switch (this) {
      case UserRole.institution:
        return 'Institution';
      case UserRole.expert:
        return 'Expert';
      case UserRole.moderator:
        return 'Moderator';
      case UserRole.community:
        return 'Community';
    }
  }

  static UserRole fromString(String value) {
    switch (value) {
      case 'Institution':
        return UserRole.institution;
      case 'Expert':
        return UserRole.expert;
      case 'Moderator':
        return UserRole.moderator;
      case 'Community':
        return UserRole.community;
      default:
        throw ArgumentError('Invalid UserRole: $value');
    }
  }
}

extension ProposalTypeExtension on ProposalType {
  String get value {
    switch (this) {
      case ProposalType.verifyArtifact:
        return 'VerifyArtifact';
      case ProposalType.disputeArtifact:
        return 'DisputeArtifact';
      case ProposalType.updateArtifactStatus:
        return 'UpdateArtifactStatus';
      case ProposalType.grantUserRole:
        return 'GrantUserRole';
    }
  }

  static ProposalType fromString(String value) {
    switch (value) {
      case 'VerifyArtifact':
        return ProposalType.verifyArtifact;
      case 'DisputeArtifact':
        return ProposalType.disputeArtifact;
      case 'UpdateArtifactStatus':
        return ProposalType.updateArtifactStatus;
      case 'GrantUserRole':
        return ProposalType.grantUserRole;
      default:
        throw ArgumentError('Invalid ProposalType: $value');
    }
  }
}

extension ProposalStatusExtension on ProposalStatus {
  String get value {
    switch (this) {
      case ProposalStatus.active:
        return 'Active';
      case ProposalStatus.passed:
        return 'Passed';
      case ProposalStatus.rejected:
        return 'Rejected';
      case ProposalStatus.executed:
        return 'Executed';
    }
  }

  static ProposalStatus fromString(String value) {
    switch (value) {
      case 'Active':
        return ProposalStatus.active;
      case 'Passed':
        return ProposalStatus.passed;
      case 'Rejected':
        return ProposalStatus.rejected;
      case 'Executed':
        return ProposalStatus.executed;
      default:
        throw ArgumentError('Invalid ProposalStatus: $value');
    }
  }
}

extension VoteTypeExtension on VoteType {
  String get value {
    switch (this) {
      case VoteType.forVote:
        return 'For';
      case VoteType.against:
        return 'Against';
      case VoteType.abstain:
        return 'Abstain';
    }
  }

  static VoteType fromString(String value) {
    switch (value) {
      case 'For':
        return VoteType.forVote;
      case 'Against':
        return VoteType.against;
      case 'Abstain':
        return VoteType.abstain;
      default:
        throw ArgumentError('Invalid VoteType: $value');
    }
  }
}

extension AccessRightsExtension on AccessRights {
  String get value {
    switch (this) {
      case AccessRights.public:
        return 'Public';
      case AccessRights.restricted:
        return 'Restricted';
      case AccessRights.private:
        return 'Private';
    }
  }

  static AccessRights fromString(String value) {
    switch (value) {
      case 'Public':
        return AccessRights.public;
      case 'Restricted':
        return AccessRights.restricted;
      case 'Private':
        return AccessRights.private;
      default:
        throw ArgumentError('Invalid AccessRights: $value');
    }
  }
}