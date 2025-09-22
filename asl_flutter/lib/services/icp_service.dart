import 'package:agent_dart/agent_dart.dart';
import '../models/models.dart';
import 'ic_config.dart';

class ICPService {
  late HttpAgent _agent;
  late ActorConfig _actorConfig;
  late CanisterActor _actor;
  
  ICPService._();
  
  static final ICPService _instance = ICPService._();
  factory ICPService() => _instance;
  
  bool _isInitialized = false;
  
  Future<void> initialize() async {
    if (_isInitialized) return;
    
    try {
      // Create HTTP agent
      _agent = HttpAgent(
        defaultHost: ICConfig.networkHost,
        options: HttpAgentOptions(
          host: ICConfig.networkHost,
        ),
      );
      
      // For local development, disable certificate verification
      if (ICConfig.isLocal) {
        await _agent.fetchRootKey();
      }
      
      // Create actor config
      _actorConfig = ActorConfig(
        canisterId: Principal.fromText(ICConfig.canisterId),
        agent: _agent,
      );
      
      // Create actor (this would normally require the IDL interface)
      _actor = CanisterActor(_actorConfig);
      
      _isInitialized = true;
    } catch (e) {
      throw Exception('Failed to initialize ICP service: $e');
    }
  }
  
  Future<T> _callMethod<T>(String methodName, List<dynamic> args) async {
    if (!_isInitialized) {
      await initialize();
    }
    
    try {
      final result = await _actor.getFunc(methodName)!(args);
      return result;
    } catch (e) {
      throw Exception('Failed to call $methodName: $e');
    }
  }
  
  // Helper method to handle Result<T, String> responses
  T _handleResult<T>(dynamic result, T Function(dynamic) parser) {
    if (result is Map<String, dynamic>) {
      if (result.containsKey('Ok')) {
        return parser(result['Ok']);
      } else if (result.containsKey('Err')) {
        throw Exception(result['Err']);
      }
    }
    throw Exception('Invalid result format');
  }
  
  // ========== USER MANAGEMENT ==========
  
  Future<String> registerUser(UserRole role, String? institution, List<String> specialization) async {
    final result = await _callMethod('register_user', [
      role.value,
      institution,
      specialization,
    ]);
    return _handleResult(result, (data) => data as String);
  }
  
  Future<String> verifyUser(String principal) async {
    final result = await _callMethod('verify_user', [principal]);
    return _handleResult(result, (data) => data as String);
  }
  
  Future<User> getUserProfile(String principal) async {
    final result = await _callMethod('get_user_profile', [principal]);
    return _handleResult(result, (data) => User.fromJson(data));
  }
  
  Future<User> getCurrentUserProfile() async {
    final result = await _callMethod('get_current_user_profile', []);
    return _handleResult(result, (data) => User.fromJson(data));
  }
  
  // ========== ARTIFACTS MODULE ==========
  
  Future<int> submitArtifact(String name, String description, String heritageProof) async {
    final result = await _callMethod('submit_artifact_public', [name, description, heritageProof]);
    return _handleResult(result, (data) => data as int);
  }
  
  Future<String> voteOnArtifact(int artifactId, bool vote) async {
    final result = await _callMethod('vote_on_artifact_public', [artifactId, vote]);
    return _handleResult(result, (data) => data as String);
  }
  
  Future<String> updateArtifactStatus(int artifactId, ArtifactStatus status) async {
    final result = await _callMethod('update_artifact_status_public', [artifactId, status.value]);
    return _handleResult(result, (data) => data as String);
  }
  
  Future<Artifact> getArtifact(int artifactId) async {
    final result = await _callMethod('get_artifact_public', [artifactId]);
    return _handleResult(result, (data) => Artifact.fromJson(data));
  }
  
  Future<List<Artifact>> getAllArtifacts() async {
    final result = await _callMethod('get_all_artifacts_public', []);
    return (result as List).map((item) => Artifact.fromJson(item)).toList();
  }
  
  Future<List<Artifact>> searchArtifacts(String query) async {
    final result = await _callMethod('search_artifacts_public', [query]);
    return (result as List).map((item) => Artifact.fromJson(item)).toList();
  }
  
  Future<List<Artifact>> getArtifactsByStatus(ArtifactStatus status) async {
    final result = await _callMethod('get_artifacts_by_status_public', [status.value]);
    return (result as List).map((item) => Artifact.fromJson(item)).toList();
  }
  
  Future<List<Artifact>> getArtifactsByCreator(String creator) async {
    final result = await _callMethod('get_artifacts_by_creator_public', [creator]);
    return (result as List).map((item) => Artifact.fromJson(item)).toList();
  }
  
  // ========== DAO PROPOSAL FEATURES ==========
  
  Future<int> createProposal(CreateProposalRequest request) async {
    final result = await _callMethod('create_proposal_public', [request.toJson()]);
    return _handleResult(result, (data) => data as int);
  }
  
  Future<String> voteOnProposal(int proposalId, VoteType voteType, String? rationale) async {
    final result = await _callMethod('vote_on_proposal_public', [proposalId, voteType.value, rationale]);
    return _handleResult(result, (data) => data as String);
  }
  
  Future<String> changeVote(int proposalId, VoteType voteType, String? rationale) async {
    final result = await _callMethod('change_vote_public', [proposalId, voteType.value, rationale]);
    return _handleResult(result, (data) => data as String);
  }
  
  Future<String> executeProposal(int proposalId) async {
    final result = await _callMethod('execute_proposal_public', [proposalId]);
    return _handleResult(result, (data) => data as String);
  }
  
  Future<Proposal> getProposal(int proposalId) async {
    final result = await _callMethod('get_proposal_public', [proposalId]);
    return _handleResult(result, (data) => Proposal.fromJson(data));
  }
  
  Future<List<ProposalResponse>> getAllProposals() async {
    final result = await _callMethod('get_all_proposals_public', []);
    return (result as List).map((item) => ProposalResponse.fromJson(item)).toList();
  }
  
  Future<List<ProposalResponse>> getActiveProposals() async {
    final result = await _callMethod('get_active_proposals_public', []);
    return (result as List).map((item) => ProposalResponse.fromJson(item)).toList();
  }
  
  Future<List<ProposalResponse>> getProposalsByStatus(ProposalStatus status) async {
    final result = await _callMethod('get_proposals_by_status_public', [status.value]);
    return (result as List).map((item) => ProposalResponse.fromJson(item)).toList();
  }
  
  Future<List<Vote>> getVoteDetails(int proposalId) async {
    final result = await _callMethod('get_vote_details_public', [proposalId]);
    return _handleResult(result, (data) => (data as List).map((item) => Vote.fromJson(item)).toList());
  }
  
  Future<int> addCommentToProposal(int proposalId, String comment) async {
    final result = await _callMethod('add_comment_to_proposal_public', [proposalId, comment]);
    return _handleResult(result, (data) => data as int);
  }
  
  // ========== NFT MODULE ==========
  
  Future<int> issueHeritageNFT(int artifactId) async {
    final result = await _callMethod('issue_heritage_nft_public', [artifactId]);
    return _handleResult(result, (data) => data as int);
  }
  
  Future<String> addExpertEndorsement(int nftId, String endorsement) async {
    final result = await _callMethod('add_expert_endorsement_public', [nftId, endorsement]);
    return _handleResult(result, (data) => data as String);
  }
  
  Future<String> updateNFTAccessRights(int nftId, AccessRights accessRights) async {
    final result = await _callMethod('update_nft_access_rights_public', [nftId, accessRights.value]);
    return _handleResult(result, (data) => data as String);
  }
  
  Future<ProofOfHeritageNFT> getNFT(int nftId) async {
    final result = await _callMethod('get_nft_public', [nftId]);
    return _handleResult(result, (data) => ProofOfHeritageNFT.fromJson(data));
  }
  
  Future<ProofOfHeritageNFT> getNFTByArtifact(int artifactId) async {
    final result = await _callMethod('get_nft_by_artifact_public', [artifactId]);
    return _handleResult(result, (data) => ProofOfHeritageNFT.fromJson(data));
  }
  
  Future<List<ProofOfHeritageNFT>> getNFTsByOwner(String owner) async {
    final result = await _callMethod('get_nfts_by_owner_public', [owner]);
    return (result as List).map((item) => ProofOfHeritageNFT.fromJson(item)).toList();
  }
  
  Future<List<ProofOfHeritageNFT>> getAllNFTs() async {
    final result = await _callMethod('get_all_nfts_public', []);
    return (result as List).map((item) => ProofOfHeritageNFT.fromJson(item)).toList();
  }
}