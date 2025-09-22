import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../core/icp_service.dart';
import '../shared/models/proposal.dart';
import '../shared/models/enums.dart';

part 'proposal_provider.g.dart';

// Proposal List Provider
@riverpod
class ProposalList extends _$ProposalList {
  @override
  Future<List<ProposalResponse>> build() async {
    return await ICPService.instance.getAllProposals();
  }
  
  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => ICPService.instance.getAllProposals());
  }
}

// Individual Proposal Provider
@riverpod
class ProposalDetail extends _$ProposalDetail {
  @override
  Future<Proposal?> build(int proposalId) async {
    try {
      return await ICPService.instance.getProposal(proposalId);
    } catch (e) {
      return null;
    }
  }
  
  Future<void> refresh() async {
    final id = proposalId;
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => ICPService.instance.getProposal(id));
  }
}

// Active Proposals Provider
@riverpod
class ActiveProposals extends _$ActiveProposals {
  @override
  Future<List<ProposalResponse>> build() async {
    final allProposals = await ref.watch(proposalListProvider.future);
    return allProposals.where((proposal) => proposal.isActive).toList();
  }
}

// Filtered Proposals Provider
@riverpod
class FilteredProposals extends _$FilteredProposals {
  @override
  Future<List<ProposalResponse>> build({
    ProposalStatus? status,
    ProposalType? type,
    String? proposer,
  }) async {
    final allProposals = await ref.watch(proposalListProvider.future);
    
    return allProposals.where((proposal) {
      // Filter by status
      if (status != null && proposal.status != status) {
        return false;
      }
      
      // Filter by type
      if (type != null && proposal.proposalType != type) {
        return false;
      }
      
      // Filter by proposer
      if (proposer != null) {
        final detailProposal = ref.read(proposalDetailProvider(proposal.id).future);
        return detailProposal.then((p) => p?.proposer == proposer);
      }
      
      return true;
    }).toList();
  }
}

// Proposal Voting Provider
@riverpod
class ProposalVoting extends _$ProposalVoting {
  @override
  Future<Map<int, VoteType>> build() async {
    // This would track user's voting state for proposals
    // For now, return empty map
    return {};
  }
  
  Future<void> voteOnProposal(
    int proposalId, 
    VoteType voteType, 
    String? rationale,
  ) async {
    try {
      // Update local state optimistically
      final currentState = state.value ?? {};
      currentState[proposalId] = voteType;
      state = AsyncValue.data(currentState);
      
      // Make backend call
      await ICPService.instance.voteOnProposal(proposalId, voteType, rationale);
      
      // Refresh the proposal details to get updated vote counts
      ref.invalidate(proposalDetailProvider(proposalId));
      ref.invalidate(proposalListProvider);
    } catch (e) {
      // Revert optimistic update on error
      final currentState = state.value ?? {};
      currentState.remove(proposalId);
      state = AsyncValue.data(currentState);
      
      // Re-throw the error
      rethrow;
    }
  }
  
  Future<void> changeVote(
    int proposalId, 
    VoteType newVoteType, 
    String? rationale,
  ) async {
    // Similar to vote, but allows changing existing vote
    await voteOnProposal(proposalId, newVoteType, rationale);
  }
  
  VoteType? getUserVote(int proposalId) {
    return state.value?[proposalId];
  }
  
  bool hasUserVoted(int proposalId) {
    return state.value?.containsKey(proposalId) ?? false;
  }
}

// Proposal Statistics Provider
@riverpod
class ProposalStatistics extends _$ProposalStatistics {
  @override
  Future<Map<String, dynamic>> build() async {
    final proposals = await ref.watch(proposalListProvider.future);
    
    final stats = <String, dynamic>{};
    
    // Count by status
    final statusCounts = <ProposalStatus, int>{};
    for (final status in ProposalStatus.values) {
      statusCounts[status] = proposals.where((p) => p.status == status).length;
    }
    stats['statusCounts'] = statusCounts;
    
    // Count by type
    final typeCounts = <ProposalType, int>{};
    for (final type in ProposalType.values) {
      typeCounts[type] = proposals.where((p) => p.proposalType == type).length;
    }
    stats['typeCounts'] = typeCounts;
    
    // Total proposals
    stats['totalProposals'] = proposals.length;
    
    // Active proposals
    stats['activeProposals'] = proposals.where((p) => p.isActive).length;
    
    // Average voting participation
    final totalVotes = proposals.fold<int>(0, (sum, p) => sum + p.totalVotes);
    stats['averageVotes'] = proposals.isNotEmpty 
        ? totalVotes / proposals.length 
        : 0.0;
    
    // Recent proposals (last 30 days)
    final thirtyDaysAgo = DateTime.now().subtract(const Duration(days: 30));
    stats['recentProposals'] = proposals
        .where((p) => p.createdDate.isAfter(thirtyDaysAgo))
        .length;
    
    return stats;
  }
}

// Recent Proposals Provider
@riverpod
class RecentProposals extends _$RecentProposals {
  @override
  Future<List<ProposalResponse>> build({int limit = 10}) async {
    final allProposals = await ref.watch(proposalListProvider.future);
    
    // Sort by creation date (newest first)
    final sortedProposals = [...allProposals];
    sortedProposals.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    
    return sortedProposals.take(limit).toList();
  }
}

// Ending Soon Proposals Provider
@riverpod
class EndingSoonProposals extends _$EndingSoonProposals {
  @override
  Future<List<ProposalResponse>> build() async {
    final activeProposals = await ref.watch(activeProposalsProvider.future);
    
    // Sort by deadline (soonest first)
    final sortedProposals = [...activeProposals];
    sortedProposals.sort((a, b) => a.votingDeadline.compareTo(b.votingDeadline));
    
    // Return proposals ending within 24 hours
    final oneDayFromNow = DateTime.now().add(const Duration(days: 1));
    return sortedProposals
        .where((p) => p.deadlineDate.isBefore(oneDayFromNow))
        .toList();
  }
}

// User's Proposals Provider
@riverpod
class UserProposals extends _$UserProposals {
  @override
  Future<List<ProposalResponse>> build(String userPrincipal) async {
    final allProposals = await ref.watch(proposalListProvider.future);
    
    // We need to check the full proposal details to get the proposer
    final userProposals = <ProposalResponse>[];
    
    for (final proposal in allProposals) {
      final detail = await ref.read(proposalDetailProvider(proposal.id).future);
      if (detail?.proposer == userPrincipal) {
        userProposals.add(proposal);
      }
    }
    
    return userProposals;
  }
}

// Proposal Comments Provider (if implemented in backend)
@riverpod
class ProposalComments extends _$ProposalComments {
  @override
  Future<List<ProposalComment>> build(int proposalId) async {
    // This would be implemented when comment functionality is added to backend
    // For now, return empty list
    return [];
  }
  
  Future<void> addComment(int proposalId, String content) async {
    // This would call backend to add comment
    // For now, just invalidate to refresh
    ref.invalidate(proposalCommentsProvider(proposalId));
  }
}

// Proposal Vote Details Provider
@riverpod
class ProposalVoteDetails extends _$ProposalVoteDetails {
  @override
  Future<List<Vote>> build(int proposalId) async {
    // This would call backend to get vote details
    // For now, return empty list as the backend method might not be exposed
    return [];
  }
}