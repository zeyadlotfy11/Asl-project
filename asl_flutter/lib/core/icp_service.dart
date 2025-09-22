import 'package:agent_dart/agent_dart.dart';
import 'package:logger/logger.dart';
import '../core/app_config.dart';
import '../core/exceptions.dart';
import '../shared/models/artifact.dart';
import '../shared/models/proposal.dart';
import '../shared/models/user.dart';
import '../shared/models/nft.dart';
import '../shared/models/enums.dart';

class ICPService {
  static ICPService? _instance;
  static ICPService get instance => _instance ??= ICPService._();
  
  late final HttpAgent _agent;
  late final ActorCreator _actor;
  late final Logger _logger;
  String? _identity;
  
  ICPService._() {
    _logger = Logger();
    _initializeAgent();
  }
  
  Future<void> _initializeAgent() async {
    try {
      final identity = AnonymousIdentity();
      
      _agent = HttpAgent(
        defaultHost: AppConfig.icNetwork,
        identity: identity,
      );
      
      if (AppConfig.isDebug && !AppConfig.isProduction) {
        await _agent.fetchRootKey();
      }
      
      _actor = ActorCreator(
        agent: _agent,
        canisterId: Principal.fromText(AppConfig.canisterId),
        interfaceFactory: _createInterface,
      );
      
      _logger.i('ICP Service initialized successfully');
    } catch (e) {
      _logger.e('Failed to initialize ICP Service: $e');
      throw BackendException('Failed to initialize ICP connection: $e');
    }
  }
  
  ServiceInterface _createInterface() {
    return ServiceInterface.fromIDL(
      idlFactory: () => IDL.Service({
        // User Management
        'register_user': IDL.Func(
          [IDL.Variant({'Institution': IDL.Null, 'Expert': IDL.Null, 'Moderator': IDL.Null, 'Community': IDL.Null}), IDL.Opt(IDL.Text), IDL.Vec(IDL.Text)],
          [IDL.Variant({'Ok': IDL.Text, 'Err': IDL.Text})],
          [],
        ),
        'get_current_user_profile': IDL.Func(
          [],
          [IDL.Variant({'Ok': IDL.Record({
            'role': IDL.Variant({'Institution': IDL.Null, 'Expert': IDL.Null, 'Moderator': IDL.Null, 'Community': IDL.Null}),
            'reputation': IDL.Nat32,
            'verified_at': IDL.Opt(IDL.Nat64),
            'institution': IDL.Opt(IDL.Text),
            'specialization': IDL.Vec(IDL.Text),
          }), 'Err': IDL.Text})],
          ['query'],
        ),
        
        // Artifact Management
        'get_all_artifacts_public': IDL.Func(
          [],
          [IDL.Vec(IDL.Record({
            'id': IDL.Nat64,
            'name': IDL.Text,
            'description': IDL.Text,
            'metadata': IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
            'images': IDL.Vec(IDL.Text),
            'creator': IDL.Principal,
            'created_at': IDL.Nat64,
            'updated_at': IDL.Nat64,
            'status': IDL.Variant({'PendingVerification': IDL.Null, 'Verified': IDL.Null, 'Disputed': IDL.Null, 'Rejected': IDL.Null}),
            'heritage_proof': IDL.Opt(IDL.Text),
            'authenticity_score': IDL.Nat32,
            'history': IDL.Vec(IDL.Record({
              'timestamp': IDL.Nat64,
              'action': IDL.Text,
              'actor': IDL.Principal,
              'details': IDL.Text,
            })),
          }))],
          ['query'],
        ),
        'get_artifact_public': IDL.Func(
          [IDL.Nat64],
          [IDL.Variant({'Ok': IDL.Record({
            'id': IDL.Nat64,
            'name': IDL.Text,
            'description': IDL.Text,
            'metadata': IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
            'images': IDL.Vec(IDL.Text),
            'creator': IDL.Principal,
            'created_at': IDL.Nat64,
            'updated_at': IDL.Nat64,
            'status': IDL.Variant({'PendingVerification': IDL.Null, 'Verified': IDL.Null, 'Disputed': IDL.Null, 'Rejected': IDL.Null}),
            'heritage_proof': IDL.Opt(IDL.Text),
            'authenticity_score': IDL.Nat32,
            'history': IDL.Vec(IDL.Record({
              'timestamp': IDL.Nat64,
              'action': IDL.Text,
              'actor': IDL.Principal,
              'details': IDL.Text,
            })),
          }), 'Err': IDL.Text})],
          ['query'],
        ),
        'search_artifacts_public': IDL.Func(
          [IDL.Text],
          [IDL.Vec(IDL.Record({
            'id': IDL.Nat64,
            'name': IDL.Text,
            'description': IDL.Text,
            'metadata': IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
            'images': IDL.Vec(IDL.Text),
            'creator': IDL.Principal,
            'created_at': IDL.Nat64,
            'updated_at': IDL.Nat64,
            'status': IDL.Variant({'PendingVerification': IDL.Null, 'Verified': IDL.Null, 'Disputed': IDL.Null, 'Rejected': IDL.Null}),
            'heritage_proof': IDL.Opt(IDL.Text),
            'authenticity_score': IDL.Nat32,
            'history': IDL.Vec(IDL.Record({
              'timestamp': IDL.Nat64,
              'action': IDL.Text,
              'actor': IDL.Principal,
              'details': IDL.Text,
            })),
          }))],
          ['query'],
        ),
        'submit_artifact_public': IDL.Func(
          [IDL.Text, IDL.Text, IDL.Text],
          [IDL.Variant({'Ok': IDL.Nat64, 'Err': IDL.Text})],
          [],
        ),
        
        // Proposal Management
        'get_all_proposals_public': IDL.Func(
          [],
          [IDL.Vec(IDL.Record({
            'id': IDL.Nat64,
            'proposal_type': IDL.Variant({'VerifyArtifact': IDL.Null, 'DisputeArtifact': IDL.Null, 'UpdateArtifactStatus': IDL.Null, 'GrantUserRole': IDL.Null}),
            'title': IDL.Text,
            'description': IDL.Text,
            'status': IDL.Variant({'Active': IDL.Null, 'Passed': IDL.Null, 'Rejected': IDL.Null, 'Executed': IDL.Null}),
            'created_at': IDL.Nat64,
            'voting_deadline': IDL.Nat64,
            'votes_for': IDL.Nat32,
            'votes_against': IDL.Nat32,
          }))],
          ['query'],
        ),
        'get_proposal_public': IDL.Func(
          [IDL.Nat64],
          [IDL.Variant({'Ok': IDL.Record({
            'id': IDL.Nat64,
            'proposal_type': IDL.Variant({'VerifyArtifact': IDL.Null, 'DisputeArtifact': IDL.Null, 'UpdateArtifactStatus': IDL.Null, 'GrantUserRole': IDL.Null}),
            'artifact_id': IDL.Opt(IDL.Nat64),
            'proposer': IDL.Principal,
            'title': IDL.Text,
            'description': IDL.Text,
            'created_at': IDL.Nat64,
            'voting_deadline': IDL.Nat64,
            'votes_for': IDL.Nat32,
            'votes_against': IDL.Nat32,
            'voters': IDL.Vec(IDL.Principal),
            'status': IDL.Variant({'Active': IDL.Null, 'Passed': IDL.Null, 'Rejected': IDL.Null, 'Executed': IDL.Null}),
            'execution_payload': IDL.Opt(IDL.Text),
          }), 'Err': IDL.Text})],
          ['query'],
        ),
        'vote_on_proposal_public': IDL.Func(
          [IDL.Nat64, IDL.Variant({'For': IDL.Null, 'Against': IDL.Null, 'Abstain': IDL.Null}), IDL.Opt(IDL.Text)],
          [IDL.Variant({'Ok': IDL.Text, 'Err': IDL.Text})],
          [],
        ),
        
        // NFT Management
        'get_all_nfts_public': IDL.Func(
          [],
          [IDL.Vec(IDL.Record({
            'id': IDL.Nat64,
            'artifact_id': IDL.Nat64,
            'owner': IDL.Principal,
            'created_at': IDL.Nat64,
            'metadata': IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
            'is_transferable': IDL.Bool,
          }))],
          ['query'],
        ),
        'get_nfts_by_owner_public': IDL.Func(
          [IDL.Principal],
          [IDL.Vec(IDL.Record({
            'id': IDL.Nat64,
            'artifact_id': IDL.Nat64,
            'owner': IDL.Principal,
            'created_at': IDL.Nat64,
            'metadata': IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
            'is_transferable': IDL.Bool,
          }))],
          ['query'],
        ),
        
        // System
        'greet': IDL.Func([IDL.Text], [IDL.Text], ['query']),
        'health_check': IDL.Func(
          [],
          [IDL.Record({
            'status': IDL.Text,
            'timestamp': IDL.Nat64,
            'version': IDL.Text,
            'uptime': IDL.Nat64,
          })],
          ['query'],
        ),
      }),
    );
  }
  
  // Helper method to call actor methods safely
  Future<T> _callActor<T>(
    String methodName,
    List<dynamic> args, {
    bool isQuery = false,
  }) async {
    try {
      _logger.d('Calling $methodName with args: $args');
      
      final result = await _actor.call(
        methodName,
        args,
        debug: AppConfig.isDebug,
      );
      
      _logger.d('Result from $methodName: $result');
      return result as T;
    } catch (e) {
      _logger.e('Error calling $methodName: $e');
      throw BackendException('Backend call failed: $e');
    }
  }
  
  // User Management Methods
  Future<String> registerUser(
    UserRole role,
    String? institution,
    List<String> specialization,
  ) async {
    final roleVariant = {role.backendValue: null};
    final result = await _callActor<Map<String, dynamic>>(
      'register_user',
      [roleVariant, institution, specialization],
    );
    
    if (result.containsKey('Ok')) {
      return result['Ok'] as String;
    } else {
      throw BackendException(result['Err'] as String);
    }
  }
  
  Future<User> getCurrentUserProfile() async {
    final result = await _callActor<Map<String, dynamic>>(
      'get_current_user_profile',
      [],
      isQuery: true,
    );
    
    if (result.containsKey('Ok')) {
      return User.fromJson(result['Ok'] as Map<String, dynamic>);
    } else {
      throw BackendException(result['Err'] as String);
    }
  }
  
  // Artifact Methods
  Future<List<Artifact>> getAllArtifacts() async {
    final result = await _callActor<List<dynamic>>(
      'get_all_artifacts_public',
      [],
      isQuery: true,
    );
    
    return result.map((json) => Artifact.fromJson(json as Map<String, dynamic>)).toList();
  }
  
  Future<Artifact> getArtifact(int id) async {
    final result = await _callActor<Map<String, dynamic>>(
      'get_artifact_public',
      [id],
      isQuery: true,
    );
    
    if (result.containsKey('Ok')) {
      return Artifact.fromJson(result['Ok'] as Map<String, dynamic>);
    } else {
      throw BackendException(result['Err'] as String);
    }
  }
  
  Future<List<Artifact>> searchArtifacts(String query) async {
    final result = await _callActor<List<dynamic>>(
      'search_artifacts_public',
      [query],
      isQuery: true,
    );
    
    return result.map((json) => Artifact.fromJson(json as Map<String, dynamic>)).toList();
  }
  
  Future<int> submitArtifact(String name, String description, String image) async {
    final result = await _callActor<Map<String, dynamic>>(
      'submit_artifact_public',
      [name, description, image],
    );
    
    if (result.containsKey('Ok')) {
      return result['Ok'] as int;
    } else {
      throw BackendException(result['Err'] as String);
    }
  }
  
  // Proposal Methods
  Future<List<ProposalResponse>> getAllProposals() async {
    final result = await _callActor<List<dynamic>>(
      'get_all_proposals_public',
      [],
      isQuery: true,
    );
    
    return result.map((json) => ProposalResponse.fromJson(json as Map<String, dynamic>)).toList();
  }
  
  Future<Proposal> getProposal(int id) async {
    final result = await _callActor<Map<String, dynamic>>(
      'get_proposal_public',
      [id],
      isQuery: true,
    );
    
    if (result.containsKey('Ok')) {
      return Proposal.fromJson(result['Ok'] as Map<String, dynamic>);
    } else {
      throw BackendException(result['Err'] as String);
    }
  }
  
  Future<String> voteOnProposal(int proposalId, VoteType voteType, String? rationale) async {
    final voteVariant = {voteType.backendValue: null};
    final result = await _callActor<Map<String, dynamic>>(
      'vote_on_proposal_public',
      [proposalId, voteVariant, rationale],
    );
    
    if (result.containsKey('Ok')) {
      return result['Ok'] as String;
    } else {
      throw BackendException(result['Err'] as String);
    }
  }
  
  // NFT Methods
  Future<List<ProofOfHeritageNFT>> getAllNFTs() async {
    final result = await _callActor<List<dynamic>>(
      'get_all_nfts_public',
      [],
      isQuery: true,
    );
    
    return result.map((json) => ProofOfHeritageNFT.fromJson(json as Map<String, dynamic>)).toList();
  }
  
  Future<List<ProofOfHeritageNFT>> getNFTsByOwner(String owner) async {
    final result = await _callActor<List<dynamic>>(
      'get_nfts_by_owner_public',
      [Principal.fromText(owner)],
      isQuery: true,
    );
    
    return result.map((json) => ProofOfHeritageNFT.fromJson(json as Map<String, dynamic>)).toList();
  }
  
  // System Methods
  Future<String> greet(String name) async {
    return await _callActor<String>('greet', [name], isQuery: true);
  }
  
  Future<Map<String, dynamic>> healthCheck() async {
    return await _callActor<Map<String, dynamic>>('health_check', [], isQuery: true);
  }
  
  // Identity Management
  void setIdentity(String identity) {
    _identity = identity;
    // In a real implementation, you would update the agent's identity
  }
  
  String? get currentIdentity => _identity;
  
  // Network Management
  Future<void> switchNetwork(String network) async {
    // Update the agent's host
    await _initializeAgent();
  }
}