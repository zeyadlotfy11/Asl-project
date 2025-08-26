import { describe, it, expect, vi, beforeEach } from "vitest";
import { BackendService } from "../IntegratedBackendService";

// Mock @dfinity/agent
vi.mock("@dfinity/agent", () => ({
  HttpAgent: vi.fn().mockImplementation(() => ({
    fetchRootKey: vi.fn().mockResolvedValue(undefined),
  })),
  Actor: {
    createActor: vi.fn().mockReturnValue({
      get_platform_stats: vi.fn(),
      get_user_profile: vi.fn(),
      create_user_profile: vi.fn(),
      get_artifacts: vi.fn(),
      get_artifact: vi.fn(),
      create_artifact: vi.fn(),
      get_communities: vi.fn(),
      get_community: vi.fn(),
      create_community: vi.fn(),
      join_community: vi.fn(),
      leave_community: vi.fn(),
      get_proposals: vi.fn(),
      create_proposal: vi.fn(),
      vote_on_proposal: vi.fn(),
      analyze_artifact: vi.fn(),
    }),
  },
}));

describe("IntegratedBackendService", () => {
  let service: typeof BackendService;
  let mockActor: any;

  beforeEach(() => {
    vi.clearAllMocks();
    service = BackendService;
    mockActor = vi.mocked(require("@dfinity/agent").Actor.createActor());
  });

  describe("Platform Statistics", () => {
    it("fetches platform stats successfully", async () => {
      const mockStats = {
        total_artifacts: 150,
        total_users: 500,
        total_communities: 25,
        total_proposals: 10,
      };

      mockActor.get_platform_stats.mockResolvedValue(mockStats);

      const stats = await service.getPlatformStats();

      expect(mockActor.get_platform_stats).toHaveBeenCalled();
      expect(stats).toEqual(mockStats);
    });

    it("handles platform stats fetch error", async () => {
      mockActor.get_platform_stats.mockRejectedValue(
        new Error("Network error")
      );

      await expect(service.getPlatformStats()).rejects.toThrow("Network error");
    });
  });

  describe("User Management", () => {
    it("creates user profile successfully", async () => {
      const userData = {
        username: "testuser",
        bio: "Test bio",
        location: "Cairo, Egypt",
      };

      mockActor.create_user_profile.mockResolvedValue("user_123");

      const result = await service.createUserProfile(
        userData.username,
        userData.bio,
        userData.location
      );

      expect(mockActor.create_user_profile).toHaveBeenCalledWith(
        userData.username,
        userData.bio,
        userData.location
      );
      expect(result).toBe("user_123");
    });

    it("fetches user profile successfully", async () => {
      const mockProfile = {
        id: "user_123",
        username: "testuser",
        bio: "Test bio",
        location: "Cairo, Egypt",
        reputation_score: 750,
      };

      mockActor.get_user_profile.mockResolvedValue(mockProfile);

      const profile = await service.getUserProfile("user_123");

      expect(mockActor.get_user_profile).toHaveBeenCalledWith("user_123");
      expect(profile).toEqual(mockProfile);
    });

    it("returns null for non-existent user", async () => {
      mockActor.get_user_profile.mockResolvedValue(null);

      const profile = await service.getUserProfile("non_existent");

      expect(profile).toBeNull();
    });
  });

  describe("Artifact Management", () => {
    const mockArtifact = {
      id: "artifact_1",
      name: "Test Artifact",
      description: "Test description",
      category: "Pottery",
      period: "New Kingdom",
      location: "Valley of the Kings",
      images: ["image1.jpg"],
      creator: "user_123",
    };

    it("creates artifact successfully", async () => {
      const artifactData = {
        name: mockArtifact.name,
        description: mockArtifact.description,
        category: mockArtifact.category,
        period: mockArtifact.period,
        location: mockArtifact.location,
        images: mockArtifact.images,
        metadata: {},
      };

      mockActor.create_artifact.mockResolvedValue("artifact_1");

      const result = await service.createArtifact(artifactData);

      expect(mockActor.create_artifact).toHaveBeenCalledWith(artifactData);
      expect(result).toBe("artifact_1");
    });

    it("fetches artifacts list successfully", async () => {
      const mockArtifacts = [mockArtifact];

      mockActor.get_artifacts.mockResolvedValue(mockArtifacts);

      const artifacts = await service.getArtifacts();

      expect(mockActor.get_artifacts).toHaveBeenCalled();
      expect(artifacts).toEqual(mockArtifacts);
    });

    it("fetches single artifact successfully", async () => {
      mockActor.get_artifact.mockResolvedValue(mockArtifact);

      const artifact = await service.getArtifact("artifact_1");

      expect(mockActor.get_artifact).toHaveBeenCalledWith("artifact_1");
      expect(artifact).toEqual(mockArtifact);
    });

    it("handles artifact creation with invalid data", async () => {
      const invalidData = {
        name: "", // Invalid: empty name
        description: "Test",
        category: "Pottery",
        period: "New Kingdom",
        location: "Valley",
        images: [],
        metadata: {},
      };

      mockActor.create_artifact.mockRejectedValue(
        new Error("Invalid artifact data")
      );

      await expect(service.createArtifact(invalidData)).rejects.toThrow(
        "Invalid artifact data"
      );
    });
  });

  describe("Community Management", () => {
    const mockCommunity = {
      id: "community_1",
      name: "Test Community",
      description: "Test description",
      category: "Research",
      is_public: true,
      creator: "user_123",
      members: ["user_123"],
      member_count: 1,
    };

    it("creates community successfully", async () => {
      const communityData = {
        name: mockCommunity.name,
        description: mockCommunity.description,
        category: mockCommunity.category,
        is_public: mockCommunity.is_public,
      };

      mockActor.create_community.mockResolvedValue("community_1");

      const result = await service.createCommunity(communityData);

      expect(mockActor.create_community).toHaveBeenCalledWith(communityData);
      expect(result).toBe("community_1");
    });

    it("joins community successfully", async () => {
      mockActor.join_community.mockResolvedValue(true);

      const result = await service.joinCommunity("community_1");

      expect(mockActor.join_community).toHaveBeenCalledWith("community_1");
      expect(result).toBe(true);
    });

    it("leaves community successfully", async () => {
      mockActor.leave_community.mockResolvedValue(true);

      const result = await service.leaveCommunity("community_1");

      expect(mockActor.leave_community).toHaveBeenCalledWith("community_1");
      expect(result).toBe(true);
    });

    it("fetches communities list successfully", async () => {
      const mockCommunities = [mockCommunity];

      mockActor.get_communities.mockResolvedValue(mockCommunities);

      const communities = await service.getCommunities();

      expect(mockActor.get_communities).toHaveBeenCalled();
      expect(communities).toEqual(mockCommunities);
    });
  });

  describe("DAO Governance", () => {
    const mockProposal = {
      id: "proposal_1",
      title: "Test Proposal",
      description: "Test description",
      proposal_type: "FeatureRequest",
      yes_votes: 10,
      no_votes: 5,
      status: "Active",
    };

    it("creates proposal successfully", async () => {
      const proposalData = {
        title: mockProposal.title,
        description: mockProposal.description,
        proposal_type: mockProposal.proposal_type,
        voting_period_days: 7,
      };

      mockActor.create_proposal.mockResolvedValue("proposal_1");

      const result = await service.createProposal(proposalData);

      expect(mockActor.create_proposal).toHaveBeenCalledWith(proposalData);
      expect(result).toBe("proposal_1");
    });

    it("votes on proposal successfully", async () => {
      mockActor.vote_on_proposal.mockResolvedValue(true);

      const result = await service.voteOnProposal("proposal_1", "Yes");

      expect(mockActor.vote_on_proposal).toHaveBeenCalledWith(
        "proposal_1",
        "Yes"
      );
      expect(result).toBe(true);
    });

    it("fetches proposals list successfully", async () => {
      const mockProposals = [mockProposal];

      mockActor.get_proposals.mockResolvedValue(mockProposals);

      const proposals = await service.getProposals();

      expect(mockActor.get_proposals).toHaveBeenCalled();
      expect(proposals).toEqual(mockProposals);
    });

    it("prevents duplicate voting", async () => {
      mockActor.vote_on_proposal.mockRejectedValue(new Error("Already voted"));

      await expect(service.voteOnProposal("proposal_1", "Yes")).rejects.toThrow(
        "Already voted"
      );
    });
  });

  describe("AI Analysis", () => {
    it("analyzes artifact successfully", async () => {
      const mockAnalysis = {
        period: "New Kingdom",
        style: "Classic Egyptian",
        material: "Ceramic",
        authenticity_score: 0.92,
        cultural_significance: "Royal ceremonial vessel",
        similar_artifacts: ["artifact_2", "artifact_3"],
        conservation_notes: "Well preserved",
      };

      mockActor.analyze_artifact.mockResolvedValue(mockAnalysis);

      const result = await service.analyzeArtifact("artifact_1");

      expect(mockActor.analyze_artifact).toHaveBeenCalledWith("artifact_1");
      expect(result).toEqual(mockAnalysis);
    });

    it("handles analysis failure", async () => {
      mockActor.analyze_artifact.mockRejectedValue(
        new Error("Analysis service unavailable")
      );

      await expect(service.analyzeArtifact("artifact_1")).rejects.toThrow(
        "Analysis service unavailable"
      );
    });
  });

  describe("Error Handling", () => {
    it("handles network connectivity issues", async () => {
      mockActor.get_platform_stats.mockRejectedValue(new Error("NetworkError"));

      await expect(service.getPlatformStats()).rejects.toThrow("NetworkError");
    });

    it("handles canister unavailable errors", async () => {
      mockActor.get_artifacts.mockRejectedValue(
        new Error("Canister not available")
      );

      await expect(service.getArtifacts()).rejects.toThrow(
        "Canister not available"
      );
    });

    it("handles timeout errors gracefully", async () => {
      mockActor.create_artifact.mockImplementation(
        () =>
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 100)
          )
      );

      await expect(
        service.createArtifact({
          name: "Test",
          description: "Test",
          category: "Test",
          period: "Test",
          location: "Test",
          images: [],
          metadata: {},
        })
      ).rejects.toThrow("Timeout");
    });
  });
});
