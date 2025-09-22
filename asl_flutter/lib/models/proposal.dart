import 'enums.dart';

class Proposal {
  final int id;
  final ProposalType proposalType;
  final int? artifactId;
  final String proposer;
  final String title;
  final String description;
  final int createdAt;
  final int votingDeadline;
  final int votesFor;
  final int votesAgainst;
  final List<String> voters;
  final ProposalStatus status;
  final String? executionPayload;

  Proposal({
    required this.id,
    required this.proposalType,
    this.artifactId,
    required this.proposer,
    required this.title,
    required this.description,
    required this.createdAt,
    required this.votingDeadline,
    required this.votesFor,
    required this.votesAgainst,
    required this.voters,
    required this.status,
    this.executionPayload,
  });

  factory Proposal.fromJson(Map<String, dynamic> json) {
    return Proposal(
      id: json['id'] as int,
      proposalType: ProposalTypeExtension.fromString(json['proposal_type'] as String),
      artifactId: json['artifact_id'] as int?,
      proposer: json['proposer'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      createdAt: json['created_at'] as int,
      votingDeadline: json['voting_deadline'] as int,
      votesFor: json['votes_for'] as int,
      votesAgainst: json['votes_against'] as int,
      voters: List<String>.from(json['voters'] as List),
      status: ProposalStatusExtension.fromString(json['status'] as String),
      executionPayload: json['execution_payload'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'proposal_type': proposalType.value,
      'artifact_id': artifactId,
      'proposer': proposer,
      'title': title,
      'description': description,
      'created_at': createdAt,
      'voting_deadline': votingDeadline,
      'votes_for': votesFor,
      'votes_against': votesAgainst,
      'voters': voters,
      'status': status.value,
      'execution_payload': executionPayload,
    };
  }

  DateTime get createdAtDateTime => DateTime.fromMillisecondsSinceEpoch(createdAt ~/ 1000000);
  DateTime get votingDeadlineDateTime => DateTime.fromMillisecondsSinceEpoch(votingDeadline ~/ 1000000);
  
  bool get isActive => status == ProposalStatus.active && DateTime.now().isBefore(votingDeadlineDateTime);
  int get totalVotes => votesFor + votesAgainst;
  double get supportPercentage => totalVotes > 0 ? (votesFor / totalVotes) * 100 : 0;
}

class ProposalResponse {
  final int id;
  final ProposalType proposalType;
  final String title;
  final String description;
  final ProposalStatus status;
  final int createdAt;
  final int votingDeadline;
  final int votesFor;
  final int votesAgainst;

  ProposalResponse({
    required this.id,
    required this.proposalType,
    required this.title,
    required this.description,
    required this.status,
    required this.createdAt,
    required this.votingDeadline,
    required this.votesFor,
    required this.votesAgainst,
  });

  factory ProposalResponse.fromJson(Map<String, dynamic> json) {
    return ProposalResponse(
      id: json['id'] as int,
      proposalType: ProposalTypeExtension.fromString(json['proposal_type'] as String),
      title: json['title'] as String,
      description: json['description'] as String,
      status: ProposalStatusExtension.fromString(json['status'] as String),
      createdAt: json['created_at'] as int,
      votingDeadline: json['voting_deadline'] as int,
      votesFor: json['votes_for'] as int,
      votesAgainst: json['votes_against'] as int,
    );
  }

  DateTime get createdAtDateTime => DateTime.fromMillisecondsSinceEpoch(createdAt ~/ 1000000);
  DateTime get votingDeadlineDateTime => DateTime.fromMillisecondsSinceEpoch(votingDeadline ~/ 1000000);
  
  bool get isActive => status == ProposalStatus.active && DateTime.now().isBefore(votingDeadlineDateTime);
  int get totalVotes => votesFor + votesAgainst;
  double get supportPercentage => totalVotes > 0 ? (votesFor / totalVotes) * 100 : 0;
}

class CreateProposalRequest {
  final ProposalType proposalType;
  final int? artifactId;
  final String title;
  final String description;
  final int votingDurationHours;
  final String? executionPayload;

  CreateProposalRequest({
    required this.proposalType,
    this.artifactId,
    required this.title,
    required this.description,
    required this.votingDurationHours,
    this.executionPayload,
  });

  Map<String, dynamic> toJson() {
    return {
      'proposal_type': proposalType.value,
      'artifact_id': artifactId,
      'title': title,
      'description': description,
      'voting_duration_hours': votingDurationHours,
      'execution_payload': executionPayload,
    };
  }
}

class Vote {
  final String voter;
  final VoteType voteType;
  final int timestamp;
  final String? rationale;

  Vote({
    required this.voter,
    required this.voteType,
    required this.timestamp,
    this.rationale,
  });

  factory Vote.fromJson(Map<String, dynamic> json) {
    return Vote(
      voter: json['voter'] as String,
      voteType: VoteTypeExtension.fromString(json['vote_type'] as String),
      timestamp: json['timestamp'] as int,
      rationale: json['rationale'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'voter': voter,
      'vote_type': voteType.value,
      'timestamp': timestamp,
      'rationale': rationale,
    };
  }

  DateTime get timestampDateTime => DateTime.fromMillisecondsSinceEpoch(timestamp ~/ 1000000);
}