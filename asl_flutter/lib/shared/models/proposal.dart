import 'package:freezed_annotation/freezed_annotation.dart';
import 'enums.dart';

part 'proposal.freezed.dart';
part 'proposal.g.dart';

// Vote Model
@freezed
class Vote with _$Vote {
  const factory Vote({
    required String voter,
    required VoteType voteType,
    required int timestamp,
    String? rationale,
  }) = _Vote;
  
  factory Vote.fromJson(Map<String, dynamic> json) =>
      _$VoteFromJson(json);
}

// Proposal Model
@freezed
class Proposal with _$Proposal {
  const factory Proposal({
    required int id,
    required ProposalType proposalType,
    int? artifactId,
    required String proposer,
    required String title,
    required String description,
    required int createdAt,
    required int votingDeadline,
    required int votesFor,
    required int votesAgainst,
    required List<String> voters,
    required ProposalStatus status,
    String? executionPayload,
  }) = _Proposal;
  
  factory Proposal.fromJson(Map<String, dynamic> json) =>
      _$ProposalFromJson(json);
}

// Create Proposal Request Model
@freezed
class CreateProposalRequest with _$CreateProposalRequest {
  const factory CreateProposalRequest({
    required ProposalType proposalType,
    int? artifactId,
    required String title,
    required String description,
    required int votingDurationHours,
    String? executionPayload,
  }) = _CreateProposalRequest;
  
  factory CreateProposalRequest.fromJson(Map<String, dynamic> json) =>
      _$CreateProposalRequestFromJson(json);
}

// Proposal Response Model (Simplified)
@freezed
class ProposalResponse with _$ProposalResponse {
  const factory ProposalResponse({
    required int id,
    required ProposalType proposalType,
    required String title,
    required String description,
    required ProposalStatus status,
    required int createdAt,
    required int votingDeadline,
    required int votesFor,
    required int votesAgainst,
  }) = _ProposalResponse;
  
  factory ProposalResponse.fromJson(Map<String, dynamic> json) =>
      _$ProposalResponseFromJson(json);
}

// Proposal Comment Model
@freezed
class ProposalComment with _$ProposalComment {
  const factory ProposalComment({
    required int id,
    required int proposalId,
    required String author,
    required String content,
    required DateTime timestamp,
    int? parentId,
    required List<int> replies,
    required int likes,
    required List<String> likedBy,
  }) = _ProposalComment;
  
  factory ProposalComment.fromJson(Map<String, dynamic> json) =>
      _$ProposalCommentFromJson(json);
}

// Proposal Analytics Model
@freezed
class ProposalAnalytics with _$ProposalAnalytics {
  const factory ProposalAnalytics({
    required int proposalId,
    required int totalVotes,
    required int totalComments,
    required int totalViews,
    required double participationRate,
    required Map<String, int> votesByRole,
    required Map<String, int> votesByDay,
    required List<String> topSupporters,
    required List<String> topOpponents,
  }) = _ProposalAnalytics;
  
  factory ProposalAnalytics.fromJson(Map<String, dynamic> json) =>
      _$ProposalAnalyticsFromJson(json);
}

// Extensions for better usability
extension ProposalExtension on Proposal {
  DateTime get createdDate => DateTime.fromMillisecondsSinceEpoch(createdAt);
  DateTime get deadlineDate => DateTime.fromMillisecondsSinceEpoch(votingDeadline);
  
  Duration get timeRemaining => deadlineDate.difference(DateTime.now());
  
  bool get isActive => status == const ProposalStatus.active() && 
                      DateTime.now().isBefore(deadlineDate);
  
  bool get hasEnded => DateTime.now().isAfter(deadlineDate);
  
  int get totalVotes => votesFor + votesAgainst;
  
  double get supportPercentage => totalVotes == 0 
      ? 0.0 
      : (votesFor / totalVotes * 100);
  
  double get oppositionPercentage => totalVotes == 0 
      ? 0.0 
      : (votesAgainst / totalVotes * 100);
  
  String get formattedTimeRemaining {
    if (!isActive) return 'Voting ended';
    
    final remaining = timeRemaining;
    if (remaining.isNegative) return 'Voting ended';
    
    if (remaining.inDays > 0) {
      return '${remaining.inDays}d ${remaining.inHours % 24}h remaining';
    } else if (remaining.inHours > 0) {
      return '${remaining.inHours}h ${remaining.inMinutes % 60}m remaining';
    } else {
      return '${remaining.inMinutes}m remaining';
    }
  }
  
  String get shortProposer => proposer.length > 12 
      ? '${proposer.substring(0, 6)}...${proposer.substring(proposer.length - 6)}'
      : proposer;
  
  String get statusColor {
    return status.when(
      active: () => '#2196F3',
      passed: () => '#4CAF50',
      rejected: () => '#F44336',
      executed: () => '#9C27B0',
    );
  }
  
  String get typeIcon {
    return proposalType.when(
      verifyArtifact: () => '✅',
      disputeArtifact: () => '⚠️',
      updateArtifactStatus: () => '🔄',
      grantUserRole: () => '👤',
    );
  }
  
  bool get requiresExecution => status == const ProposalStatus.passed() &&
                               proposalType != const ProposalType.verifyArtifact();
  
  double get quorumPercentage {
    // Simplified quorum calculation (would be based on total eligible voters)
    const minimumVotes = 10;
    return (totalVotes / minimumVotes * 100).clamp(0.0, 100.0);
  }
  
  bool get hasQuorum => totalVotes >= 10; // Simplified quorum check
}

extension VoteExtension on Vote {
  DateTime get voteDate => DateTime.fromMillisecondsSinceEpoch(timestamp);
  
  String get formattedTimestamp {
    final date = voteDate;
    final now = DateTime.now();
    final difference = now.difference(date);
    
    if (difference.inDays > 0) {
      return '${difference.inDays} day(s) ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} hour(s) ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes} minute(s) ago';
    } else {
      return 'Just now';
    }
  }
  
  String get shortVoter => voter.length > 12 
      ? '${voter.substring(0, 6)}...${voter.substring(voter.length - 6)}'
      : voter;
  
  String get voteEmoji => voteType.emoji;
  
  bool get hasRationale => rationale != null && rationale!.isNotEmpty;
}

extension ProposalResponseExtension on ProposalResponse {
  DateTime get createdDate => DateTime.fromMillisecondsSinceEpoch(createdAt);
  DateTime get deadlineDate => DateTime.fromMillisecondsSinceEpoch(votingDeadline);
  
  bool get isActive => status == const ProposalStatus.active() && 
                      DateTime.now().isBefore(deadlineDate);
  
  int get totalVotes => votesFor + votesAgainst;
  
  double get supportPercentage => totalVotes == 0 
      ? 0.0 
      : (votesFor / totalVotes * 100);
  
  String get typeIcon {
    return proposalType.when(
      verifyArtifact: () => '✅',
      disputeArtifact: () => '⚠️',
      updateArtifactStatus: () => '🔄',
      grantUserRole: () => '👤',
    );
  }
}

extension ProposalCommentExtension on ProposalComment {
  String get shortAuthor => author.length > 12 
      ? '${author.substring(0, 6)}...${author.substring(author.length - 6)}'
      : author;
  
  String get formattedTimestamp {
    final now = DateTime.now();
    final difference = now.difference(timestamp);
    
    if (difference.inDays > 0) {
      return '${difference.inDays}d ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m ago';
    } else {
      return 'now';
    }
  }
  
  bool get hasReplies => replies.isNotEmpty;
  bool get isReply => parentId != null;
  bool get hasLikes => likes > 0;
  
  String get likesText => likes == 1 ? '1 like' : '$likes likes';
}