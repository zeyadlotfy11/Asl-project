import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../core/icp_service.dart';
import '../shared/models/artifact.dart';
import '../shared/models/enums.dart';

part 'artifact_provider.g.dart';

// Artifact List Provider
@riverpod
class ArtifactList extends _$ArtifactList {
  @override
  Future<List<Artifact>> build() async {
    return await ICPService.instance.getAllArtifacts();
  }
  
  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => ICPService.instance.getAllArtifacts());
  }
  
  Future<void> submitArtifact({
    required String name,
    required String description,
    required String image,
  }) async {
    try {
      await ICPService.instance.submitArtifact(name, description, image);
      // Refresh the list after successful submission
      await refresh();
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
    }
  }
}

// Individual Artifact Provider
@riverpod
class ArtifactDetail extends _$ArtifactDetail {
  @override
  Future<Artifact?> build(int artifactId) async {
    try {
      return await ICPService.instance.getArtifact(artifactId);
    } catch (e) {
      return null;
    }
  }
  
  Future<void> refresh() async {
    final id = artifactId;
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => ICPService.instance.getArtifact(id));
  }
}

// Artifact Search Provider
@riverpod
class ArtifactSearch extends _$ArtifactSearch {
  @override
  Future<List<Artifact>> build(String query) async {
    if (query.isEmpty) return [];
    return await ICPService.instance.searchArtifacts(query);
  }
  
  Future<void> search(String newQuery) async {
    if (newQuery.isEmpty) {
      state = const AsyncValue.data([]);
      return;
    }
    
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => ICPService.instance.searchArtifacts(newQuery));
  }
}

// Filtered Artifacts Provider
@riverpod
class FilteredArtifacts extends _$FilteredArtifacts {
  @override
  Future<List<Artifact>> build({
    ArtifactStatus? status,
    String? creator,
    String? searchQuery,
  }) async {
    final allArtifacts = await ref.watch(artifactListProvider.future);
    
    return allArtifacts.where((artifact) {
      // Filter by status
      if (status != null && artifact.status != status) {
        return false;
      }
      
      // Filter by creator
      if (creator != null && artifact.creator != creator) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery != null && searchQuery.isNotEmpty) {
        final query = searchQuery.toLowerCase();
        return artifact.name.toLowerCase().contains(query) ||
               artifact.description.toLowerCase().contains(query) ||
               artifact.metadata.values.any((value) => 
                   value.toLowerCase().contains(query));
      }
      
      return true;
    }).toList();
  }
}

// Artifact Statistics Provider
@riverpod
class ArtifactStatistics extends _$ArtifactStatistics {
  @override
  Future<Map<String, dynamic>> build() async {
    final artifacts = await ref.watch(artifactListProvider.future);
    
    final stats = <String, dynamic>{};
    
    // Count by status
    final statusCounts = <ArtifactStatus, int>{};
    for (final status in ArtifactStatus.values) {
      statusCounts[status] = artifacts.where((a) => a.status == status).length;
    }
    stats['statusCounts'] = statusCounts;
    
    // Average authenticity score
    final totalScore = artifacts.fold<int>(0, (sum, a) => sum + a.authenticityScore);
    stats['averageAuthenticityScore'] = artifacts.isNotEmpty 
        ? totalScore / artifacts.length 
        : 0.0;
    
    // Total artifacts
    stats['totalArtifacts'] = artifacts.length;
    
    // Recent artifacts (last 30 days)
    final thirtyDaysAgo = DateTime.now().subtract(const Duration(days: 30));
    stats['recentArtifacts'] = artifacts
        .where((a) => a.createdDate.isAfter(thirtyDaysAgo))
        .length;
    
    // Top creators
    final creatorCounts = <String, int>{};
    for (final artifact in artifacts) {
      creatorCounts[artifact.creator] = (creatorCounts[artifact.creator] ?? 0) + 1;
    }
    final topCreators = creatorCounts.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));
    stats['topCreators'] = topCreators.take(5).toList();
    
    return stats;
  }
}

// Artifact History Provider
@riverpod
class ArtifactHistory extends _$ArtifactHistory {
  @override
  Future<List<HistoryEntry>> build(int artifactId) async {
    final artifact = await ref.watch(artifactDetailProvider(artifactId).future);
    return artifact?.history ?? [];
  }
}

// Recent Artifacts Provider
@riverpod
class RecentArtifacts extends _$RecentArtifacts {
  @override
  Future<List<Artifact>> build({int limit = 10}) async {
    final allArtifacts = await ref.watch(artifactListProvider.future);
    
    // Sort by creation date (newest first)
    final sortedArtifacts = [...allArtifacts];
    sortedArtifacts.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    
    return sortedArtifacts.take(limit).toList();
  }
}

// User's Artifacts Provider
@riverpod
class UserArtifacts extends _$UserArtifacts {
  @override
  Future<List<Artifact>> build(String userPrincipal) async {
    final allArtifacts = await ref.watch(artifactListProvider.future);
    return allArtifacts.where((artifact) => artifact.creator == userPrincipal).toList();
  }
}

// Artifact Voting State
@riverpod
class ArtifactVoting extends _$ArtifactVoting {
  @override
  Future<Map<int, bool>> build() async {
    // This would track user's voting state for artifacts
    // For now, return empty map
    return {};
  }
  
  Future<void> voteOnArtifact(int artifactId, bool vote) async {
    // Update local state
    final currentState = state.value ?? {};
    currentState[artifactId] = vote;
    state = AsyncValue.data(currentState);
    
    // Make backend call (assuming there's a voting method)
    // await ICPService.instance.voteOnArtifact(artifactId, vote);
  }
}