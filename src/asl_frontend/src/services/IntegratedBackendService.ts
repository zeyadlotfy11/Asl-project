import { Principal } from "@dfinity/principal";
import { HttpAgent, Actor } from "@dfinity/agent";
import {
  idlFactory,
  canisterId,
  asl_backend as originalBackend,
} from "../../../declarations/asl_backend";
import type {
  User as BackendUser,
  Artifact as BackendArtifact,
  Proposal as BackendProposal,
  ProofOfHeritageNFT,
  UserRole as BackendUserRole,
  CreateArtifactRequest,
  CreateProposalRequest,
  ProposalType,
  VoteType,
  ArtifactStatus,
  ProposalStatus,
  AccessRights,
  HistoryEntry,
  Vote,
  AIAnalysisResult,
  CollaborationRoom,
  Message,
  VirtualEvent,
  AnalyticsReport,
  PatternAnalysis,
  EnhancedNFT,
  Quest,
  UserProgress,
  SystemStats,
  HealthStatus,
  AuditEntry,
  ProposalResponse,
} from "../../../declarations/asl_backend/asl_backend.did";

// Create a custom agent with proper ingress expiry configuration
const createCustomAgent = () => {
  // Check if we have a local development canister ID
  const hasLocalCanisterId =
    canisterId &&
    (canisterId.includes("77774") ||
      canisterId.includes("qaaaq") ||
      canisterId.includes("q7777"));

  // Determine the appropriate host for development
  const isDevelopment =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.port === "3000" ||
    window.location.port === "4943" ||
    window.location.hostname.includes("localhost") ||
    hasLocalCanisterId; // Force local if using local canister ID

  const host = isDevelopment ? "http://127.0.0.1:4943" : "https://icp0.io";

  console.log("createCustomAgent:", {
    isDevelopment,
    hostname: window.location.hostname,
    port: window.location.port,
    canisterId,
    hasLocalCanisterId,
    host,
    location: window.location.href,
  });

  const agent = new HttpAgent({
    host,
  });

  console.log("HttpAgent created with host:", host);

  // Fetch root key for certificate validation during development
  if (isDevelopment) {
    console.log("Fetching root key for development...");
    try {
      agent.fetchRootKey().catch((err) => {
        console.warn(
          "Unable to fetch root key. Check to ensure that your local replica is running"
        );
        console.error(err);
      });
    } catch (err) {
      console.warn("Error during root key fetch:", err);
    }
  }

  return agent;
};

// Create actor with custom agent and fresh timestamp for each call
const createAslBackendActor = () => {
  if (!canisterId) {
    console.error("No canister ID found for asl_backend");
    return null;
  }

  const agent = createCustomAgent();
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  }) as any; // Type assertion to match the expected backend interface
};

// Get the backend actor, creating a fresh one each time to avoid stale timestamps
const getAslBackend = () => {
  return createAslBackendActor();
};

// Re-export types from backend for frontend use
export type User = BackendUser;
export type Artifact = BackendArtifact;
export type Proposal = BackendProposal;
export type HeritageNFT = ProofOfHeritageNFT;
export type UserRole = BackendUserRole;

// Export additional types
export type {
  CreateArtifactRequest,
  CreateProposalRequest,
  ProposalType,
  VoteType,
  ArtifactStatus,
  ProposalStatus,
  AccessRights,
  HistoryEntry,
  Vote,
  AIAnalysisResult,
  CollaborationRoom,
  Message,
  VirtualEvent,
  AnalyticsReport,
  PatternAnalysis,
  EnhancedNFT,
  Quest,
  UserProgress,
  SystemStats,
  HealthStatus,
  AuditEntry,
  ProposalResponse,
};

// Helper function to handle Result types from backend
function handleResult<T>(result: any): T | null {
  if (result && typeof result === "object") {
    if ("Ok" in result) {
      return result.Ok;
    }
    if ("Err" in result) {
      console.error("Backend error:", result.Err);
      throw new Error(result.Err);
    }
  }
  return (result as T) || null;
}

// Helper function to handle optional Result types
function handleOptionalResult<T>(result: any): T | null {
  try {
    return handleResult<T>(result);
  } catch (error) {
    console.warn("Optional operation failed:", error);
    return null;
  }
}

// Comprehensive Backend Service for Egyptian Heritage Platform
export class BackendService {
  // ========== USER MANAGEMENT ==========

  static async registerUser(
    role: UserRole,
    institution?: string,
    specialization: string[] = []
  ): Promise<string> {
    try {
      const backend = getAslBackend();
      if (!backend) throw new Error("Backend not available");

      const result = await backend.register_user(
        role,
        institution ? [institution] : [],
        specialization
      );
      return handleResult<string>(result) || "success";
    } catch (error) {
      console.error("Failed to register user:", error);
      throw error;
    }
  }

  static async verifyUser(principal: Principal): Promise<string> {
    try {
      const backend = getAslBackend();
      if (!backend) throw new Error("Backend not available");

      const result = await backend.verify_user(principal);
      return handleResult<string>(result) || "success";
    } catch (error) {
      console.error("Failed to verify user:", error);
      throw error;
    }
  }

  static async getUserProfile(principal: Principal): Promise<User | null> {
    try {
      const backend = getAslBackend();
      if (!backend) throw new Error("Backend not available");

      const result = await backend.get_user_profile(principal);
      return handleResult<User>(result);
    } catch (error) {
      console.error("Failed to get user profile:", error);
      return null;
    }
  }

  static async getCurrentUserProfile(): Promise<User | null> {
    try {
      const backend = getAslBackend();
      if (!backend) throw new Error("Backend not available");

      const result = await backend.get_current_user_profile();
      return handleResult<User>(result);
    } catch (error) {
      console.error("Failed to get current user profile:", error);
      return null;
    }
  }

  // ========== ARTIFACT MANAGEMENT ==========

  static async createArtifact(request: CreateArtifactRequest): Promise<bigint> {
    try {
      console.log("BackendService.createArtifact called with:", request);
      console.log("Environment check:", {
        hostname: window.location.hostname,
        isDevelopment:
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1",
      });

      const backend = getAslBackend();
      console.log("Backend actor created:", !!backend);

      if (!backend) throw new Error("Backend not available");

      console.log("Calling backend.create_artifact...");
      const result = await backend.create_artifact(request);
      console.log("Backend result:", result);

      const finalResult = handleResult<bigint>(result) || BigInt(0);
      console.log("Final result:", finalResult);

      return finalResult;
    } catch (error) {
      console.error("Failed to create artifact:", error);
      console.error("Error type:", typeof error);
      console.error("Error name:", (error as any)?.name);
      console.error("Error message:", (error as any)?.message);
      console.error("Error stack:", (error as any)?.stack);
      throw error;
    }
  }

  static async submitArtifactPublic(
    name: string,
    description: string,
    heritage_proof: string
  ): Promise<bigint> {
    try {
      const backend = getAslBackend();
      if (!backend) throw new Error("Backend not available");

      const result = await backend.submit_artifact_public(
        name,
        description,
        heritage_proof
      );
      return handleResult<bigint>(result) || BigInt(0);
    } catch (error) {
      console.error("Failed to submit artifact:", error);
      throw error;
    }
  }

  static async getArtifact(id: bigint): Promise<Artifact | null> {
    try {
      const backend = getAslBackend();
      if (!backend) throw new Error("Backend not available");

      const result = await backend.get_artifact_public(id);
      return handleResult<Artifact>(result);
    } catch (error) {
      console.error("Failed to get artifact:", error);
      return null;
    }
  }

  static async getAllArtifacts(): Promise<Artifact[]> {
    try {
      const backend = getAslBackend();
      if (!backend) throw new Error("Backend not available");

      return await backend.get_all_artifacts_public();
    } catch (error) {
      console.error("Failed to get all artifacts:", error);
      return [];
    }
  }

  static async searchArtifacts(query: string): Promise<Artifact[]> {
    try {
      const backend = getAslBackend();
      if (!backend) throw new Error("Backend not available");

      return await backend.search_artifacts_public(query);
    } catch (error) {
      console.error("Failed to search artifacts:", error);
      return [];
    }
  }

  static async getArtifactsByStatus(
    status: ArtifactStatus
  ): Promise<Artifact[]> {
    try {
      const backend = getAslBackend();
      if (!backend) throw new Error("Backend not available");

      return await backend.get_artifacts_by_status_public(status);
    } catch (error) {
      console.error("Failed to get artifacts by status:", error);
      return [];
    }
  }

  static async getArtifactsByCreator(creator: Principal): Promise<Artifact[]> {
    try {
      const backend = getAslBackend();
      if (!backend) throw new Error("Backend not available");

      return await backend.get_artifacts_by_creator_public(creator);
    } catch (error) {
      console.error("Failed to get artifacts by creator:", error);
      return [];
    }
  }

  static async voteOnArtifact(
    artifactId: bigint,
    support: boolean
  ): Promise<string> {
    try {
      const backend = getAslBackend();
      if (!backend) throw new Error("Backend not available");

      const result = await backend.vote_on_artifact_public(artifactId, support);
      return handleResult<string>(result) || "success";
    } catch (error) {
      console.error("Failed to vote on artifact:", error);
      throw error;
    }
  }

  static async updateArtifactStatus(
    artifactId: bigint,
    status: ArtifactStatus
  ): Promise<string> {
    try {
      const backend = getAslBackend();
      if (!backend) throw new Error("Backend not available");

      const result = await backend.update_artifact_status_public(
        artifactId,
        status
      );
      return handleResult<string>(result) || "success";
    } catch (error) {
      console.error("Failed to update artifact status:", error);
      throw error;
    }
  }

  static async getArtifactHistory(artifactId: bigint): Promise<HistoryEntry[]> {
    try {
      const backend = getAslBackend();
      if (!backend) throw new Error("Backend not available");

      const result = await backend.get_artifact_history(artifactId);
      return handleResult<HistoryEntry[]>(result) || [];
    } catch (error) {
      console.error("Failed to get artifact history:", error);
      return [];
    }
  }

  // ========== PROPOSAL MANAGEMENT ==========

  static async createProposal(request: CreateProposalRequest) {
    try {
      const result = await originalBackend.create_proposal_public(request);
      return handleResult<bigint>(result) || BigInt(0);
    } catch (error) {
      console.error("Failed to create proposal:", error);
      throw error;
    }
  }

  static async getProposal(id: bigint): Promise<Proposal | null> {
    try {
      const result = await originalBackend.get_proposal_public(id);
      return handleResult<Proposal>(result);
    } catch (error) {
      console.error("Failed to get proposal:", error);
      return null;
    }
  }

  static async getAllProposals(): Promise<ProposalResponse[]> {
    try {
      return await originalBackend.get_all_proposals_public();
    } catch (error) {
      console.error("Failed to get all proposals:", error);
      return [];
    }
  }

  static async getActiveProposals(): Promise<ProposalResponse[]> {
    try {
      return await originalBackend.get_active_proposals_public();
    } catch (error) {
      console.error("Failed to get active proposals:", error);
      return [];
    }
  }

  static async getProposalsByStatus(
    status: ProposalStatus
  ): Promise<ProposalResponse[]> {
    try {
      return await originalBackend.get_proposals_by_status_public(status);
    } catch (error) {
      console.error("Failed to get proposals by status:", error);
      return [];
    }
  }

  static async voteOnProposal(
    proposalId: bigint,
    voteType: VoteType,
    rationale?: string
  ): Promise<string> {
    try {
      const result = await originalBackend.vote_on_proposal_public(
        proposalId,
        voteType,
        rationale ? [rationale] : []
      );
      return handleResult<string>(result) || "success";
    } catch (error) {
      console.error("Failed to vote on proposal:", error);
      throw error;
    }
  }

  static async changeVote(
    proposalId: bigint,
    voteType: VoteType,
    rationale?: string
  ): Promise<string> {
    try {
      const result = await originalBackend.change_vote_public(
        proposalId,
        voteType,
        rationale ? [rationale] : []
      );
      return handleResult<string>(result) || "success";
    } catch (error) {
      console.error("Failed to change vote:", error);
      throw error;
    }
  }

  static async getVoteDetails(proposalId: bigint): Promise<Vote[]> {
    try {
      const result = await originalBackend.get_vote_details_public(proposalId);
      return handleResult<Vote[]>(result) || [];
    } catch (error) {
      console.error("Failed to get vote details:", error);
      return [];
    }
  }

  static async addCommentToProposal(
    proposalId: bigint,
    comment: string
  ): Promise<bigint> {
    try {
      const result = await originalBackend.add_comment_to_proposal_public(
        proposalId,
        comment
      );
      return handleResult<bigint>(result) || BigInt(0);
    } catch (error) {
      console.error("Failed to add comment to proposal:", error);
      throw error;
    }
  }

  static async executeProposal(proposalId: bigint): Promise<string> {
    try {
      const result = await originalBackend.execute_proposal_public(proposalId);
      return handleResult<string>(result) || "success";
    } catch (error) {
      console.error("Failed to execute proposal:", error);
      throw error;
    }
  }

  // ========== NFT MANAGEMENT ==========

  static async issueHeritageNFT(artifactId: bigint): Promise<bigint> {
    try {
      const result = await originalBackend.issue_heritage_nft_public(
        artifactId
      );
      return handleResult<bigint>(result) || BigInt(0);
    } catch (error) {
      console.error("Failed to issue heritage NFT:", error);
      throw error;
    }
  }

  static async getNFT(nftId: bigint): Promise<HeritageNFT | null> {
    try {
      const result = await originalBackend.get_nft_public(nftId);
      return handleResult<HeritageNFT>(result);
    } catch (error) {
      console.error("Failed to get NFT:", error);
      return null;
    }
  }

  static async getNFTByArtifact(
    artifactId: bigint
  ): Promise<HeritageNFT | null> {
    try {
      const result = await originalBackend.get_nft_by_artifact_public(
        artifactId
      );
      return handleResult<HeritageNFT>(result);
    } catch (error) {
      console.error("Failed to get NFT by artifact:", error);
      return null;
    }
  }

  static async getNFTsByOwner(owner: Principal): Promise<HeritageNFT[]> {
    try {
      return await originalBackend.get_nfts_by_owner_public(owner);
    } catch (error) {
      console.error("Failed to get NFTs by owner:", error);
      return [];
    }
  }

  static async getAllNFTs(): Promise<HeritageNFT[]> {
    try {
      return await originalBackend.get_all_nfts_public();
    } catch (error) {
      console.error("Failed to get all NFTs:", error);
      return [];
    }
  }

  static async addExpertEndorsement(
    nftId: bigint,
    endorsement: string
  ): Promise<string> {
    try {
      const result = await originalBackend.add_expert_endorsement_public(
        nftId,
        endorsement
      );
      return handleResult<string>(result) || "success";
    } catch (error) {
      console.error("Failed to add expert endorsement:", error);
      throw error;
    }
  }

  static async updateNFTAccessRights(
    nftId: bigint,
    rights: AccessRights
  ): Promise<string> {
    try {
      const result = await originalBackend.update_nft_access_rights_public(
        nftId,
        rights
      );
      return handleResult<string>(result) || "success";
    } catch (error) {
      console.error("Failed to update NFT access rights:", error);
      throw error;
    }
  }

  // ========== AI ANALYSIS ==========

  static async analyzeArtifactWithAI(
    artifactId: bigint
  ): Promise<AIAnalysisResult | null> {
    try {
      const result = await originalBackend.analyze_artifact_with_ai_public(
        artifactId
      );
      return handleResult<AIAnalysisResult>(result);
    } catch (error) {
      console.error("Failed to analyze artifact with AI:", error);
      return null;
    }
  }

  static async getAIAnalysis(
    artifactId: bigint
  ): Promise<AIAnalysisResult | null> {
    try {
      const result = await originalBackend.get_ai_analysis_public(artifactId);
      return handleResult<AIAnalysisResult>(result);
    } catch (error) {
      console.error("Failed to get AI analysis:", error);
      return null;
    }
  }

  static async getSimilarArtifacts(
    artifactId: bigint,
    limit?: bigint
  ): Promise<Artifact[]> {
    try {
      return await originalBackend.get_similar_artifacts_public(
        artifactId,
        limit ? [limit] : []
      );
    } catch (error) {
      console.error("Failed to get similar artifacts:", error);
      return [];
    }
  }

  static async addProvenanceEntry(
    artifactId: bigint,
    location?: string,
    custodian?: string,
    documentation: string[] = []
  ): Promise<bigint> {
    try {
      const result = await originalBackend.add_provenance_entry_public(
        artifactId,
        location ? [location] : [],
        custodian ? [custodian] : [],
        documentation
      );
      return handleResult<bigint>(result) || BigInt(0);
    } catch (error) {
      console.error("Failed to add provenance entry:", error);
      throw error;
    }
  }

  static async getProvenanceChain(artifactId: bigint): Promise<HistoryEntry[]> {
    try {
      const result = await originalBackend.get_provenance_chain_public(
        artifactId
      );
      return handleResult<HistoryEntry[]>(result) || [];
    } catch (error) {
      console.error("Failed to get provenance chain:", error);
      return [];
    }
  }

  static async verifyProvenanceIntegrity(artifactId: bigint): Promise<boolean> {
    try {
      const result = await originalBackend.verify_provenance_integrity_public(
        artifactId
      );
      return handleResult<boolean>(result) || false;
    } catch (error) {
      console.error("Failed to verify provenance integrity:", error);
      return false;
    }
  }

  // ========== COLLABORATION ==========

  static async createCollaborationRoom(
    name: string,
    description: string,
    artifactId?: bigint,
    isPublic: boolean = true
  ): Promise<bigint> {
    try {
      const result = await originalBackend.create_collaboration_room_public(
        name,
        description,
        artifactId ? [artifactId] : [],
        isPublic
      );
      return handleResult<bigint>(result) || BigInt(0);
    } catch (error) {
      console.error("Failed to create collaboration room:", error);
      throw error;
    }
  }

  static async sendMessage(
    roomId: bigint,
    content: string,
    messageType: string,
    attachments: string[] = []
  ): Promise<bigint> {
    try {
      const result = await originalBackend.send_message_public(
        roomId,
        content,
        messageType,
        attachments
      );
      return handleResult<bigint>(result) || BigInt(0);
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  }

  static async addReaction(
    messageId: bigint,
    reaction: string
  ): Promise<string> {
    try {
      const result = await originalBackend.add_reaction_public(
        messageId,
        reaction
      );
      return handleResult<string>(result) || "success";
    } catch (error) {
      console.error("Failed to add reaction:", error);
      throw error;
    }
  }

  static async getCollaborationRooms(): Promise<CollaborationRoom[]> {
    try {
      return await originalBackend.get_collaboration_rooms_public();
    } catch (error) {
      console.error("Failed to get collaboration rooms:", error);
      return [];
    }
  }

  static async getRoomMessages(
    roomId: bigint,
    limit?: bigint
  ): Promise<Message[]> {
    try {
      return await originalBackend.get_room_messages_public(
        roomId,
        limit ? [limit] : []
      );
    } catch (error) {
      console.error("Failed to get room messages:", error);
      return [];
    }
  }

  // ========== VIRTUAL EVENTS ==========

  static async createVirtualEvent(
    title: string,
    description: string,
    startTime: bigint,
    durationMinutes: number,
    eventType: string,
    maxParticipants?: number
  ): Promise<bigint> {
    try {
      const result = await originalBackend.create_virtual_event_public(
        title,
        description,
        startTime,
        durationMinutes,
        maxParticipants ? [maxParticipants] : [],
        eventType
      );
      return handleResult<bigint>(result) || BigInt(0);
    } catch (error) {
      console.error("Failed to create virtual event:", error);
      throw error;
    }
  }

  static async joinEvent(eventId: bigint): Promise<string> {
    try {
      const result = await originalBackend.join_event_public(eventId);
      return handleResult<string>(result) || "success";
    } catch (error) {
      console.error("Failed to join event:", error);
      throw error;
    }
  }

  static async getUpcomingEvents(): Promise<VirtualEvent[]> {
    try {
      return await originalBackend.get_upcoming_events_public();
    } catch (error) {
      console.error("Failed to get upcoming events:", error);
      return [];
    }
  }

  // ========== ANALYTICS ==========

  static async generateAnalyticsReport(
    reportType: string,
    startTime?: bigint,
    endTime?: bigint
  ): Promise<bigint> {
    try {
      const result = await originalBackend.generate_analytics_report_public(
        reportType,
        startTime ? [startTime] : [],
        endTime ? [endTime] : []
      );
      return handleResult<bigint>(result) || BigInt(0);
    } catch (error) {
      console.error("Failed to generate analytics report:", error);
      throw error;
    }
  }

  static async getAnalyticsReport(
    reportId: bigint
  ): Promise<AnalyticsReport | null> {
    try {
      const result = await originalBackend.get_analytics_report_public(
        reportId
      );
      return handleResult<AnalyticsReport>(result);
    } catch (error) {
      console.error("Failed to get analytics report:", error);
      return null;
    }
  }

  static async getPatternAnalysis(): Promise<PatternAnalysis[]> {
    try {
      return await originalBackend.get_pattern_analysis_public();
    } catch (error) {
      console.error("Failed to get pattern analysis:", error);
      return [];
    }
  }

  // ========== GAMIFICATION ==========

  static async mintEnhancedNFT(artifactId: bigint): Promise<bigint> {
    try {
      const result = await originalBackend.mint_enhanced_nft_public(artifactId);
      return handleResult<bigint>(result) || BigInt(0);
    } catch (error) {
      console.error("Failed to mint enhanced NFT:", error);
      throw error;
    }
  }

  static async awardAchievement(
    user: Principal,
    achievement: string,
    points: number
  ): Promise<string> {
    try {
      const result = await originalBackend.award_achievement_public(
        user,
        achievement,
        points
      );
      return handleResult<string>(result) || "success";
    } catch (error) {
      console.error("Failed to award achievement:", error);
      throw error;
    }
  }

  static async createQuest(
    title: string,
    description: string,
    durationDays: number
  ): Promise<bigint> {
    try {
      const result = await originalBackend.create_quest_public(
        title,
        description,
        durationDays
      );
      return handleResult<bigint>(result) || BigInt(0);
    } catch (error) {
      console.error("Failed to create quest:", error);
      throw error;
    }
  }

  static async joinQuest(questId: bigint): Promise<string> {
    try {
      const result = await originalBackend.join_quest_public(questId);
      return handleResult<string>(result) || "success";
    } catch (error) {
      console.error("Failed to join quest:", error);
      throw error;
    }
  }

  static async getUserProgress(user: Principal): Promise<UserProgress | null> {
    try {
      const result = await originalBackend.get_user_progress_public(user);
      // Handle optional result array
      if (Array.isArray(result)) {
        return result.length > 0 ? result[0] || null : null;
      }
      return result || null;
    } catch (error) {
      console.error("Failed to get user progress:", error);
      return null;
    }
  }

  static async getLeaderboard(
    limit: bigint
  ): Promise<Array<[Principal, bigint]>> {
    try {
      return await originalBackend.get_leaderboard_public(limit);
    } catch (error) {
      console.error("Failed to get leaderboard:", error);
      return [];
    }
  }

  static async getActiveQuests(): Promise<Quest[]> {
    try {
      return await originalBackend.get_active_quests_public();
    } catch (error) {
      console.error("Failed to get active quests:", error);
      return [];
    }
  }

  static async getEnhancedNFT(nftId: bigint): Promise<EnhancedNFT | null> {
    try {
      const result = await originalBackend.get_enhanced_nft_public(nftId);
      // Handle optional result array
      if (Array.isArray(result)) {
        return result.length > 0 ? result[0] || null : null;
      }
      return result || null;
    } catch (error) {
      console.error("Failed to get enhanced NFT:", error);
      return null;
    }
  }

  static async getUserNFTs(user: Principal): Promise<EnhancedNFT[]> {
    try {
      return await originalBackend.get_user_nfts_public(user);
    } catch (error) {
      console.error("Failed to get user NFTs:", error);
      return [];
    }
  }

  // ========== SYSTEM MANAGEMENT ==========

  static async getSystemStats(): Promise<SystemStats | null> {
    try {
      const backend = getAslBackend();
      if (!backend) throw new Error("Backend not available");

      return await backend.get_system_stats();
    } catch (error) {
      console.error("Failed to get system stats:", error);
      return null;
    }
  }

  static async getAuditLogs(limit?: bigint): Promise<AuditEntry[]> {
    try {
      const backend = getAslBackend();
      if (!backend) throw new Error("Backend not available");

      return await backend.get_audit_logs(limit ? [limit] : []);
    } catch (error) {
      console.error("Failed to get audit logs:", error);
      return [];
    }
  }

  static async getSecurityAlerts(): Promise<AuditEntry[]> {
    try {
      const backend = getAslBackend();
      if (!backend) throw new Error("Backend not available");

      return await backend.get_security_alerts();
    } catch (error) {
      console.error("Failed to get security alerts:", error);
      return [];
    }
  }

  static async healthCheck(): Promise<HealthStatus | null> {
    try {
      const backend = getAslBackend();
      if (!backend) throw new Error("Backend not available");

      return await backend.health_check();
    } catch (error) {
      console.error("Failed to perform health check:", error);
      return null;
    }
  }

  // ========== UTILITY METHODS ==========

  static async greet(name: string): Promise<string> {
    try {
      const backend = getAslBackend();
      if (!backend) throw new Error("Backend not available");

      return await backend.greet(name);
    } catch (error) {
      console.error("Failed to greet:", error);
      return `Hello, ${name}!`;
    }
  }

  static async verifyInstitution(principal: Principal): Promise<string> {
    try {
      const backend = getAslBackend();
      if (!backend) throw new Error("Backend not available");

      const result = await backend.verify_institution(principal);
      return handleResult<string>(result) || "success";
    } catch (error) {
      console.error("Failed to verify institution:", error);
      throw error;
    }
  }

  static async bootstrapFirstModerator(): Promise<string> {
    try {
      const backend = getAslBackend();
      if (!backend) throw new Error("Backend not available");

      const result = await backend.bootstrap_first_moderator();
      return handleResult<string>(result) || "success";
    } catch (error) {
      console.error("Failed to bootstrap first moderator:", error);
      throw error;
    }
  }

  // ========== CONVENIENCE METHODS ==========

  // Helper method to get platform statistics for dashboard
  static async getPlatformStats(): Promise<{
    totalArtifacts: number;
    totalProposals: number;
    totalUsers: number;
    totalNFTs: number;
    verifiedArtifacts: number;
    activeProposals: number;
  }> {
    try {
      const stats = await this.getSystemStats();
      if (stats) {
        return {
          totalArtifacts: Number(stats.total_artifacts),
          totalProposals: Number(stats.total_proposals),
          totalUsers: Number(stats.total_users),
          totalNFTs: Number(stats.total_nfts),
          verifiedArtifacts: Number(stats.verified_artifacts),
          activeProposals: Number(stats.active_proposals),
        };
      }
      return {
        totalArtifacts: 0,
        totalProposals: 0,
        totalUsers: 0,
        totalNFTs: 0,
        verifiedArtifacts: 0,
        activeProposals: 0,
      };
    } catch (error) {
      console.error("Failed to get platform stats:", error);
      return {
        totalArtifacts: 0,
        totalProposals: 0,
        totalUsers: 0,
        totalNFTs: 0,
        verifiedArtifacts: 0,
        activeProposals: 0,
      };
    }
  }

  // Helper method to check if user is authenticated
  static async isUserAuthenticated(): Promise<boolean> {
    try {
      const user = await this.getCurrentUserProfile();
      return user !== null;
    } catch (error) {
      return false;
    }
  }

  // Helper method to format status display
  static formatStatus(status: any): string {
    if (typeof status === "string") return status;
    if (typeof status === "object" && status !== null) {
      const keys = Object.keys(status);
      if (keys.length > 0) {
        return keys[0];
      }
    }
    return "Unknown";
  }

  // Helper method to format vote type display
  static formatVoteType(voteType: VoteType): string {
    return this.formatStatus(voteType);
  }

  // Helper method to format proposal type display
  static formatProposalType(proposalType: ProposalType): string {
    return this.formatStatus(proposalType);
  }

  // Helper method to format user role display
  static formatUserRole(role: UserRole): string {
    return this.formatStatus(role);
  }

  // Helper method to create enum variants for backend calls
  static createUserRole(
    role: "Institution" | "Expert" | "Moderator" | "Community"
  ): UserRole {
    return { [role]: null } as UserRole;
  }

  static createArtifactStatus(
    status: "PendingVerification" | "Verified" | "Disputed" | "Rejected"
  ): ArtifactStatus {
    return { [status]: null } as ArtifactStatus;
  }

  static createProposalType(
    type:
      | "VerifyArtifact"
      | "DisputeArtifact"
      | "UpdateArtifactStatus"
      | "GrantUserRole"
  ): ProposalType {
    return { [type]: null } as ProposalType;
  }

  static createVoteType(vote: "For" | "Against" | "Abstain"): VoteType {
    return { [vote]: null } as VoteType;
  }

  static createAccessRights(
    rights: "Public" | "Restricted" | "Private"
  ): AccessRights {
    return { [rights]: null } as AccessRights;
  }

  static createProposalStatus(
    status: "Active" | "Passed" | "Rejected" | "Executed"
  ): ProposalStatus {
    return { [status]: null } as ProposalStatus;
  }
}

// Export convenience functions for easier use
export const {
  // User Management
  registerUser,
  verifyUser,
  getUserProfile,
  getCurrentUserProfile,

  // Artifact Management
  createArtifact,
  submitArtifactPublic,
  getArtifact,
  getAllArtifacts,
  searchArtifacts,
  getArtifactsByStatus,
  getArtifactsByCreator,
  voteOnArtifact,
  updateArtifactStatus,
  getArtifactHistory,

  // Proposal Management
  createProposal,
  getProposal,
  getAllProposals,
  getActiveProposals,
  getProposalsByStatus,
  voteOnProposal,
  changeVote,
  getVoteDetails,
  addCommentToProposal,
  executeProposal,

  // NFT Management
  issueHeritageNFT,
  getNFT,
  getNFTByArtifact,
  getNFTsByOwner,
  getAllNFTs,
  addExpertEndorsement,
  updateNFTAccessRights,

  // AI Analysis
  analyzeArtifactWithAI,
  getAIAnalysis,
  getSimilarArtifacts,
  addProvenanceEntry,
  getProvenanceChain,
  verifyProvenanceIntegrity,

  // Collaboration
  createCollaborationRoom,
  sendMessage,
  addReaction,
  getCollaborationRooms,
  getRoomMessages,

  // Virtual Events
  createVirtualEvent,
  joinEvent,
  getUpcomingEvents,

  // Analytics
  generateAnalyticsReport,
  getAnalyticsReport,
  getPatternAnalysis,

  // Gamification
  mintEnhancedNFT,
  awardAchievement,
  createQuest,
  joinQuest,
  getUserProgress,
  getLeaderboard,
  getActiveQuests,
  getEnhancedNFT,
  getUserNFTs,

  // System Management
  getSystemStats,
  getAuditLogs,
  getSecurityAlerts,
  healthCheck,

  // Utility
  greet,
  verifyInstitution,
  bootstrapFirstModerator,

  // Convenience
  getPlatformStats,
  isUserAuthenticated,
  formatStatus,
  formatVoteType,
  formatProposalType,
  formatUserRole,
  createUserRole,
  createArtifactStatus,
  createProposalType,
  createVoteType,
  createAccessRights,
  createProposalStatus,
} = BackendService;
