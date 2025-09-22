import 'package:agent_dart/agent_dart.dart';
import '../models/models.dart';
import 'ic_config.dart';

// Extended ICP Service for additional features
extension ICPServiceExtended on ICPService {
  
  // ========== AI ANALYSIS FEATURES ==========
  
  Future<AIAnalysisResult> analyzeArtifactWithAI(int artifactId) async {
    final result = await _callMethod('analyze_artifact_with_ai_public', [artifactId]);
    return _handleResult(result, (data) => AIAnalysisResult.fromJson(data));
  }
  
  Future<int> addProvenanceEntry(int artifactId, String? description, String? source, List<String> evidence) async {
    final result = await _callMethod('add_provenance_entry_public', [artifactId, description, source, evidence]);
    return _handleResult(result, (data) => data as int);
  }
  
  Future<AIAnalysisResult> getAIAnalysis(int artifactId) async {
    final result = await _callMethod('get_ai_analysis_public', [artifactId]);
    return _handleResult(result, (data) => AIAnalysisResult.fromJson(data));
  }
  
  Future<List<Artifact>> getSimilarArtifacts(int artifactId, int? limit) async {
    final result = await _callMethod('get_similar_artifacts_public', [artifactId, limit]);
    return (result as List).map((item) => Artifact.fromJson(item)).toList();
  }
  
  Future<List<HistoryEntry>> getProvenanceChain(int artifactId) async {
    final result = await _callMethod('get_provenance_chain_public', [artifactId]);
    return _handleResult(result, (data) => (data as List).map((item) => HistoryEntry.fromJson(item)).toList());
  }
  
  Future<bool> verifyProvenanceIntegrity(int artifactId) async {
    final result = await _callMethod('verify_provenance_integrity_public', [artifactId]);
    return _handleResult(result, (data) => data as bool);
  }
  
  // ========== COLLABORATION FEATURES ==========
  
  Future<int> createCollaborationRoom(String name, String description, int? artifactId, bool isPublic) async {
    final result = await _callMethod('create_collaboration_room_public', [name, description, artifactId, isPublic]);
    return _handleResult(result, (data) => data as int);
  }
  
  Future<int> sendMessage(int roomId, String content, String messageType, List<String> attachments) async {
    final result = await _callMethod('send_message_public', [roomId, content, messageType, attachments]);
    return _handleResult(result, (data) => data as int);
  }
  
  Future<String> addReaction(int messageId, String reaction) async {
    final result = await _callMethod('add_reaction_public', [messageId, reaction]);
    return _handleResult(result, (data) => data as String);
  }
  
  Future<int> createVirtualEvent(String title, String description, int startTime, int durationMinutes, int? maxParticipants, String eventType) async {
    final result = await _callMethod('create_virtual_event_public', [title, description, startTime, durationMinutes, maxParticipants, eventType]);
    return _handleResult(result, (data) => data as int);
  }
  
  Future<String> joinEvent(int eventId) async {
    final result = await _callMethod('join_event_public', [eventId]);
    return _handleResult(result, (data) => data as String);
  }
  
  Future<List<CollaborationRoom>> getCollaborationRooms() async {
    final result = await _callMethod('get_collaboration_rooms_public', []);
    return (result as List).map((item) => CollaborationRoom.fromJson(item)).toList();
  }
  
  Future<List<Message>> getRoomMessages(int roomId, int? limit) async {
    final result = await _callMethod('get_room_messages_public', [roomId, limit]);
    return (result as List).map((item) => Message.fromJson(item)).toList();
  }
  
  Future<List<VirtualEvent>> getUpcomingEvents() async {
    final result = await _callMethod('get_upcoming_events_public', []);
    return (result as List).map((item) => VirtualEvent.fromJson(item)).toList();
  }
  
  // ========== ANALYTICS FEATURES ==========
  
  Future<int> generateAnalyticsReport(String reportType, int? startTime, int? endTime) async {
    final result = await _callMethod('generate_analytics_report_public', [reportType, startTime, endTime]);
    return _handleResult(result, (data) => data as int);
  }
  
  Future<AnalyticsReport> getAnalyticsReport(int reportId) async {
    final result = await _callMethod('get_analytics_report_public', [reportId]);
    return _handleResult(result, (data) => AnalyticsReport.fromJson(data));
  }
  
  Future<List<PatternAnalysis>> getPatternAnalysis() async {
    final result = await _callMethod('get_pattern_analysis_public', []);
    return (result as List).map((item) => PatternAnalysis.fromJson(item)).toList();
  }
  
  // ========== GAMIFICATION FEATURES ==========
  
  Future<int> mintEnhancedNFT(int artifactId) async {
    final result = await _callMethod('mint_enhanced_nft_public', [artifactId]);
    return _handleResult(result, (data) => data as int);
  }
  
  Future<String> awardAchievement(String principal, String achievement, double score) async {
    final result = await _callMethod('award_achievement_public', [principal, achievement, score]);
    return _handleResult(result, (data) => data as String);
  }
  
  Future<int> createQuest(String title, String description, int durationDays) async {
    final result = await _callMethod('create_quest_public', [title, description, durationDays]);
    return _handleResult(result, (data) => data as int);
  }
  
  Future<String> joinQuest(int questId) async {
    final result = await _callMethod('join_quest_public', [questId]);
    return _handleResult(result, (data) => data as String);
  }
  
  Future<UserProgress?> getUserProgress(String principal) async {
    final result = await _callMethod('get_user_progress_public', [principal]);
    return result != null ? UserProgress.fromJson(result) : null;
  }
  
  Future<List<Map<String, dynamic>>> getLeaderboard(int limit) async {
    final result = await _callMethod('get_leaderboard_public', [limit]);
    return (result as List).map((item) => Map<String, dynamic>.from(item)).toList();
  }
  
  Future<List<Quest>> getActiveQuests() async {
    final result = await _callMethod('get_active_quests_public', []);
    return (result as List).map((item) => Quest.fromJson(item)).toList();
  }
  
  Future<EnhancedNFT?> getEnhancedNFT(int nftId) async {
    final result = await _callMethod('get_enhanced_nft_public', [nftId]);
    return result != null ? EnhancedNFT.fromJson(result) : null;
  }
  
  Future<List<EnhancedNFT>> getUserNFTs(String principal) async {
    final result = await _callMethod('get_user_nfts_public', [principal]);
    return (result as List).map((item) => EnhancedNFT.fromJson(item)).toList();
  }
  
  // ========== SYSTEM MANAGEMENT ==========
  
  Future<SystemStats> getSystemStats() async {
    final result = await _callMethod('get_system_stats', []);
    return SystemStats.fromJson(result);
  }
  
  Future<List<AuditEntry>> getAuditLogs(int? limit) async {
    final result = await _callMethod('get_audit_logs', [limit]);
    return (result as List).map((item) => AuditEntry.fromJson(item)).toList();
  }
  
  Future<List<AuditEntry>> getSecurityAlerts() async {
    final result = await _callMethod('get_security_alerts', []);
    return (result as List).map((item) => AuditEntry.fromJson(item)).toList();
  }
  
  Future<HealthStatus> healthCheck() async {
    final result = await _callMethod('health_check', []);
    return HealthStatus.fromJson(result);
  }
  
  // ========== LEGACY FUNCTIONS ==========
  
  Future<int> createArtifact(CreateArtifactRequest request) async {
    final result = await _callMethod('create_artifact', [request.toJson()]);
    return _handleResult(result, (data) => data as int);
  }
  
  Future<String> verifyInstitution(String principal) async {
    final result = await _callMethod('verify_institution', [principal]);
    return _handleResult(result, (data) => data as String);
  }
  
  Future<String> bootstrapFirstModerator() async {
    final result = await _callMethod('bootstrap_first_moderator', []);
    return _handleResult(result, (data) => data as String);
  }
  
  Future<String> greet(String name) async {
    final result = await _callMethod('greet', [name]);
    return result as String;
  }
}