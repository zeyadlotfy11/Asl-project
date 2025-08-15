// core setup
use candid::{CandidType, Principal};
use ic_cdk::{query, update, init, pre_upgrade, post_upgrade};
use serde::{Deserialize, Serialize};

// Modular Architecture - Simplified for size optimization
mod modules;
use modules::types::*;
use modules::storage::*;
use modules::auth::*;
use modules::utils::*;
use modules::audit::log_audit_event;

use modules::ai_analysis::{
    AIAnalysisResult, add_provenance_entry, get_provenance_chain, verify_provenance_integrity,
    analyze_artifact_with_ai, get_ai_analysis, get_similar_artifacts
};
// Commented out complex modules to reduce size
// use modules::collaboration::{CollaborationRoom, Message, VirtualEvent};
// use modules::analytics::{AnalyticsReport, PatternAnalysis};
// use modules::gamification::{EnhancedNFT, UserProgress, Quest};

use modules::artifacts::{
    create_artifact, update_artifact_status,
    get_artifact, get_all_artifacts, get_artifacts_by_status, get_artifacts_by_creator, search_artifacts
};
use modules::dao::{
    create_proposal, execute_proposal,
    get_proposal, get_all_proposals, get_active_proposals, get_proposals_by_status,
    add_comment_to_proposal
};
use modules::voting::{vote_on_proposal, get_vote_details, change_vote};
use modules::nft::{
    issue_heritage_nft, add_expert_endorsement, update_nft_access_rights,
    get_nft, get_nft_by_artifact, get_nfts_by_owner, get_all_nfts
};

// Additional AI analysis functions already imported above

// Commented out complex functionality to reduce size
// use modules::collaboration::{
//     create_collaboration_room, send_message, add_reaction, get_collaboration_rooms,
//     get_room_messages, create_virtual_event, join_event, get_upcoming_events
// };
// use modules::analytics::{
//     generate_analytics_report, get_analytics_report, get_pattern_analysis
// };
// use modules::gamification::{
//     award_achievement, create_quest, join_quest, get_user_progress,
//     get_leaderboard, get_active_quests, get_enhanced_nft, get_user_nfts
// };

// ============================================================================
// USER MANAGEMENT SYSTEM
// ============================================================================

#[update]
fn register_user(role: UserRole, institution: Option<String>, specialization: Vec<String>) -> Result<String, String> {
    let caller = get_caller();
    
    // Check if user already exists
    let existing_user = USERS.with(|users| {
        users.borrow().get(&caller)
    });

    if existing_user.is_some() {
        return Err("User already registered".to_string());
    }

    // Validate profiles based on role
    match &role {
        UserRole::Institution => {
            if institution.is_none() {
                return Err("Institution name is required for institution role".to_string());
            }
        },
        UserRole::Expert => {
            if specialization.is_empty() {
                return Err("Specialization is required for expert role".to_string());
            }
        },
        _ => {}
    }

    let now = get_time();
    
    // Determine initial permissions based on role
    let permissions = match role {
        UserRole::Institution => UserPermissions {
            can_submit_artifacts: true,
            can_create_proposals: true,
            can_vote: true, // Requires verification first
            can_verify_institutions: true,
            can_moderate: true,
            voting_weight: 3,
        },
        UserRole::Expert => UserPermissions {
            can_submit_artifacts: true,
            can_create_proposals: true,
            can_vote: false, // Requires verification first
            can_verify_institutions: false,
            can_moderate: false,
            voting_weight: 2,
        },
        UserRole::Community => UserPermissions {
            can_submit_artifacts: false,
            can_create_proposals: false,
            can_vote: true,
            can_verify_institutions: false,
            can_moderate: false,
            voting_weight: 1,
        },
        _ => UserPermissions {
            can_submit_artifacts: false,
            can_create_proposals: false,
            can_vote: false,
            can_verify_institutions: false,
            can_moderate: false,
            voting_weight: 1,
        },
    };

    let user = User {
        role: role.clone(),
        reputation: 0,
        verified_at: None,
        institution,
        specialization,
        activity_stats: UserStats {
            artifacts_submitted: 0,
            proposals_created: 0,
            votes_cast: 0,
            successful_verifications: 0,
            peer_ratings: Vec::new(),
            last_activity: now,
        },
        verification_level: UserVerificationLevel::Unverified,
        permissions,
    };

    USERS.with(|users| {
        users.borrow_mut().insert(caller, user);
    });

    log_audit_event(
        AuditEventType::UserRegistration,
        None,
        format!("User registered with role: {:?}", role),
        AuditSeverity::Info
    );

    Ok(format!("User registered successfully with role: {:?}", role))
}

// ============================================================================
// AI ANALYSIS AMAZING FEATURES
// ============================================================================

#[update]
fn analyze_artifact_with_ai_public(artifact_id: u64) -> Result<AIAnalysisResult, String> {
    analyze_artifact_with_ai(artifact_id)
}

#[update]
fn add_provenance_entry_public(
    artifact_id: u64,
    location: Option<String>,
    custodian: Option<String>,
    documentation: Vec<String>,
) -> Result<u64, String> {
    // Convert string to enum - simplified version
    let provenance_type = modules::ai_analysis::ProvenanceEventType::Transfer; // Default
    add_provenance_entry(artifact_id, provenance_type, location, custodian, documentation)
}

#[query]
fn get_ai_analysis_public(artifact_id: u64) -> Result<AIAnalysisResult, String> {
    get_ai_analysis(artifact_id)
}

#[query]
fn get_similar_artifacts_public(artifact_id: u64, limit: Option<usize>) -> Vec<Artifact> {
    get_similar_artifacts(artifact_id, limit)
}

#[query]
fn get_provenance_chain_public(artifact_id: u64) -> Result<Vec<HistoryEntry>, String> {
    get_provenance_chain(artifact_id)
}

#[query]
fn verify_provenance_integrity_public(artifact_id: u64) -> Result<bool, String> {
    verify_provenance_integrity(artifact_id)
}

// ============================================================================
// COLLABORATION FEATURES - COMMENTED OUT TO REDUCE CANISTER SIZE
// ============================================================================

// #[update]
// fn create_collaboration_room_public(
//     title: String,
//     description: String,
//     artifact_id: Option<u64>,
//     is_private: bool,
// ) -> Result<u64, String> {
//     // Use available enum variants
//     create_collaboration_room(
//         modules::collaboration::RoomType::ArtifactDiscussion,
//         title,
//         description,
//         artifact_id,
//         None, // proposal_id
//         is_private,
//         modules::collaboration::AccessLevel::Public
//     )
// }

// #[update]
// fn send_message_public(
//     room_id: u64,
//     content: String,
//     reply_to: Option<u64>,
// ) -> Result<u64, String> {
//     send_message(
//         room_id,
//         content,
//         modules::collaboration::MessageType::Text,
//         reply_to,
//         Vec::new() // empty attachments
//     )
// }

// #[update]
// fn add_reaction_public(message_id: u64, emoji: String) -> Result<String, String> {
//     add_reaction(message_id, emoji)
// }

// #[update]
// fn create_virtual_event_public(
//     title: String,
//     description: String,
//     start_time: u64,
//     duration_minutes: u32,
// ) -> Result<u64, String> {
//     create_virtual_event(
//         title,
//         description,
//         modules::collaboration::EventType::PanelDiscussion,
//         start_time,
//         start_time + (duration_minutes as u64 * 60), // convert duration to end_time
//         None // artifact_focus
//     )
// }

// #[update]
// fn join_event_public(event_id: u64) -> Result<String, String> {
//     join_event(event_id)
// }

// #[query]
// fn get_collaboration_rooms_public() -> Vec<CollaborationRoom> {
//     get_collaboration_rooms()
// }

// #[query]
// fn get_room_messages_public(room_id: u64, limit: Option<usize>) -> Vec<Message> {
//     get_room_messages(room_id, limit)
// }

// #[query]
// fn get_upcoming_events_public() -> Vec<VirtualEvent> {
//     get_upcoming_events()
// }

// ============================================================================
// ANALYTICS FEATURES - COMMENTED OUT TO REDUCE CANISTER SIZE
// ============================================================================

// #[update]
// fn generate_analytics_report_public(
//     report_type: String,
//     start_time: Option<u64>,
//     end_time: Option<u64>,
// ) -> Result<u64, String> {
//     // Use available enum variants
//     let r_type = modules::analytics::ReportType::UserEngagement;
//     generate_analytics_report(r_type, start_time, end_time)
// }

// #[query]
// fn get_analytics_report_public(report_id: u64) -> Result<AnalyticsReport, String> {
//     get_analytics_report(report_id)
// }

// #[query]
// fn get_pattern_analysis_public() -> Vec<PatternAnalysis> {
//     get_pattern_analysis()
// }

// ============================================================================
// GAMIFICATION FEATURES - COMMENTED OUT TO REDUCE CANISTER SIZE
// ============================================================================

// #[update]
// fn mint_enhanced_nft_public(
//     artifact_id: u64,
// ) -> Result<u64, String> {
//     // Simplified enhanced NFT minting - use existing NFT system
//     issue_heritage_nft(artifact_id)
// }

// #[update]
// fn award_achievement_public(user: Principal, achievement_title: String, progress: f64) -> Result<String, String> {
//     award_achievement(user, achievement_title, progress)
// }

// #[update]
// fn create_quest_public(
//     title: String,
//     description: String,
//     duration_days: u32,
// ) -> Result<u64, String> {
//     // Simplified quest creation using available enum variants
//     create_quest(
//         title,
//         description,
//         Vec::new(), // objectives
//         Vec::new(), // rewards  
//         duration_days as u64,
//         modules::gamification::QuestType::Educational,
//     )
// }

// #[update]
// fn join_quest_public(quest_id: u64) -> Result<String, String> {
//     join_quest(quest_id)
// }

// #[query]
// fn get_user_progress_public(user: Principal) -> Option<UserProgress> {
//     get_user_progress(user)
// }

// #[query]
// fn get_leaderboard_public(limit: usize) -> Vec<(Principal, u64)> {
//     get_leaderboard(limit)
// }

// #[query]
// fn get_active_quests_public() -> Vec<Quest> {
//     get_active_quests()
// }

// #[query]
// fn get_enhanced_nft_public(token_id: u64) -> Option<EnhancedNFT> {
//     get_enhanced_nft(token_id)
// }

// #[query]
// fn get_user_nfts_public(user: Principal) -> Vec<EnhancedNFT> {
//     get_user_nfts(user)
// }

// ============================================================================
// VOTING SYSTEM FEATURES
// ============================================================================

#[update]
fn vote_on_proposal_public(
    proposal_id: u64,
    vote_type: VoteType,
    rationale: Option<String>,
) -> Result<String, String> {
    let request = VoteRequest {
        proposal_id,
        vote_type,
        rationale,
        expertise_relevance: Some(1), // Use available enum
    };
    vote_on_proposal(request)
}

#[update]
fn change_vote_public(
    proposal_id: u64,
    new_vote_type: VoteType,
    rationale: Option<String>,
) -> Result<String, String> {
    change_vote(proposal_id, new_vote_type, rationale)
}

#[query]
fn get_vote_details_public(proposal_id: u64) -> Result<Vec<Vote>, String> {
    get_vote_details(proposal_id)
}

// ============================================================================
// DAO PROPOSAL FEATURES
// ============================================================================

#[update]
fn add_comment_to_proposal_public(
    proposal_id: u64,
    content: String,
) -> Result<u64, String> {
    // Use available enum variant
    add_comment_to_proposal(proposal_id, content, None)
}

#[update]
fn create_proposal_public(request: CreateProposalRequest) -> Result<u64, String> {
    create_proposal(request)
}

#[update]
fn execute_proposal_public(proposal_id: u64) -> Result<String, String> {
    execute_proposal(proposal_id)
}

#[query]
fn get_proposal_public(proposal_id: u64) -> Result<Proposal, String> {
    get_proposal(proposal_id)
}

#[query]
fn get_all_proposals_public() -> Vec<ProposalResponse> {
    get_all_proposals()
}

#[query]
fn get_active_proposals_public() -> Vec<ProposalResponse> {
    get_active_proposals()
}

#[query]
fn get_proposals_by_status_public(status: ProposalStatus) -> Vec<ProposalResponse> {
    get_proposals_by_status(status)
}

// ============================================================================
// ARTIFACTS MODULE FEATURES
// ============================================================================

#[update]
fn submit_artifact_public(
    name: String,
    description: String,
    image_url: String,
) -> Result<u64, String> {
    // Create basic artifact request
    let request = CreateArtifactRequest {
        name,
        description,
        images: vec![image_url],
        metadata: Vec::new(),
        heritage_proof: Some("user_submission".to_string()),
    };
    
    create_artifact(request)
}

#[update]
fn vote_on_artifact_public(artifact_id: u64, vote: bool) -> Result<String, String> {
    // Convert boolean to VoteType using available variants
    let vote_type = if vote { VoteType::For } else { VoteType::Against };
    let request = VoteRequest {
        proposal_id: artifact_id, // Use artifact_id as proposal_id for voting
        vote_type,
        rationale: None,
        expertise_relevance: Some(1),
    };
    vote_on_proposal(request)
}

#[update]
fn update_artifact_status_public(
    artifact_id: u64,
    new_status: ArtifactStatus,
) -> Result<String, String> {
    update_artifact_status(artifact_id, new_status, "Status updated via public API".to_string())
}

#[query]
fn get_artifact_public(artifact_id: u64) -> Result<Artifact, String> {
    get_artifact(artifact_id)
}

#[query]
fn get_all_artifacts_public() -> Vec<Artifact> {
    get_all_artifacts()
}

#[query]
fn search_artifacts_public(query: String) -> Vec<Artifact> {
    search_artifacts(query)
}

#[query]
fn get_artifacts_by_status_public(status: ArtifactStatus) -> Vec<Artifact> {
    get_artifacts_by_status(status)
}

#[query]
fn get_artifacts_by_creator_public(creator: Principal) -> Vec<Artifact> {
    get_artifacts_by_creator(creator)
}

// ============================================================================
// NFT MODULE FEATURES
// ============================================================================

#[update]
fn issue_heritage_nft_public(artifact_id: u64) -> Result<u64, String> {
    issue_heritage_nft(artifact_id)
}

#[update]
fn add_expert_endorsement_public(nft_id: u64, notes: String) -> Result<String, String> {
    add_expert_endorsement(nft_id, notes)
}

#[update]
fn update_nft_access_rights_public(nft_id: u64, new_rights: AccessRights) -> Result<String, String> {
    update_nft_access_rights(nft_id, new_rights)
}

#[query]
fn get_nft_public(nft_id: u64) -> Result<ProofOfHeritageNFT, String> {
    get_nft(nft_id)
}

#[query]
fn get_nft_by_artifact_public(artifact_id: u64) -> Result<ProofOfHeritageNFT, String> {
    get_nft_by_artifact(artifact_id)
}

#[query]
fn get_nfts_by_owner_public(owner: Principal) -> Vec<ProofOfHeritageNFT> {
    get_nfts_by_owner(owner)
}

#[query]
fn get_all_nfts_public() -> Vec<ProofOfHeritageNFT> {
    get_all_nfts()
}

// ============================================================================
// USER MANAGEMENT & VERIFICATION
// ============================================================================

#[update]
fn verify_user(user_principal: Principal) -> Result<String, String> {
    let caller = get_caller();
    
    // Only verified institutions or moderators can verify users
    if !is_verified_institution(caller) {
        return Err("Only verified institutions or moderators can verify users".to_string());
    }

    USERS.with(|users| {
        let mut users = users.borrow_mut();
        if let Some(mut user) = users.get(&user_principal) {
            user.verified_at = Some(get_time());
            user.verification_level = UserVerificationLevel::InstitutionVerified;
            user.permissions.can_vote = true; // Enable voting after verification
            
            users.insert(user_principal, user);

            log_audit_event(
                AuditEventType::UserVerification,
                None,
                format!("User {:?} verified", user_principal),
                AuditSeverity::Info
            );

            Ok("User verified successfully".to_string())
        } else {
            Err("User not found".to_string())
        }
    })
}

#[update]
fn verify_institution(institution_principal: Principal) -> Result<String, String> {
    let caller = get_caller();
    
    // Only existing verified institutions or moderators can verify new institutions
    if !is_verified_institution(caller) && !can_moderate(caller) {
        return Err("Only verified institutions or moderators can verify institutions".to_string());
    }

    USERS.with(|users| {
        let mut users = users.borrow_mut();
        if let Some(mut user) = users.get(&institution_principal) {
            // Ensure the user is actually an institution
            if !matches!(user.role, UserRole::Institution) {
                return Err("User is not an institution".to_string());
            }

            user.verified_at = Some(get_time());
            user.verification_level = UserVerificationLevel::FullyVerified;
            user.permissions.can_verify_institutions = true;
            user.permissions.can_moderate = true;
            
            users.insert(institution_principal, user);

            log_audit_event(
                AuditEventType::UserVerification,
                None,
                format!("Institution {:?} verified", institution_principal),
                AuditSeverity::Info
            );

            Ok("Institution verified successfully".to_string())
        } else {
            Err("Institution not found".to_string())
        }
    })
}

#[update]
fn bootstrap_first_moderator() -> Result<String, String> {
    let caller = get_caller();
    
    // Check if there are any verified institutions or moderators already
    let has_existing_verifiers = USERS.with(|users| {
        users.borrow().iter().any(|(_, user)| {
            user.permissions.can_verify_institutions || user.permissions.can_moderate
        })
    });

    if has_existing_verifiers {
        return Err("Bootstrap not needed - verified institutions or moderators already exist".to_string());
    }

    // Bootstrap the first moderator
    USERS.with(|users| {
        let mut users = users.borrow_mut();
        if let Some(mut user) = users.get(&caller) {
            user.verified_at = Some(get_time());
            user.verification_level = UserVerificationLevel::FullyVerified;
            user.permissions.can_verify_institutions = true;
            user.permissions.can_moderate = true;
            user.permissions.can_vote = true;
            user.permissions.can_create_proposals = true;
            
            users.insert(caller, user);

            log_audit_event(
                AuditEventType::UserVerification,
                None,
                format!("Bootstrap moderator created: {:?}", caller),
                AuditSeverity::Info
            );

            Ok("Bootstrap moderator created successfully. You can now verify other users and institutions.".to_string())
        } else {
            Err("User not found. Please register first.".to_string())
        }
    })
}

#[query]
fn get_user_profile(user_principal: Principal) -> Result<User, String> {
    USERS.with(|users| {
        users.borrow().get(&user_principal)
            .ok_or_else(|| "User not found".to_string())
    })
}

#[query]
fn get_current_user_profile() -> Result<User, String> {
    let caller = get_caller();
    get_user_profile(caller)
}

// ============================================================================
// SYSTEM MANAGEMENT
// ============================================================================

#[query]
fn get_system_stats() -> SystemStats {
    let total_artifacts = ARTIFACTS.with(|artifacts| artifacts.borrow().len() as u64);
    let total_proposals = PROPOSALS.with(|proposals| proposals.borrow().len() as u64);
    let total_users = USERS.with(|users| users.borrow().len() as u64);
    let total_nfts = NFTS.with(|nfts| nfts.borrow().len() as u64);
    
    let verified_artifacts = get_artifacts_by_status(ArtifactStatus::Verified).len() as u64;
    let active_proposals = get_active_proposals().len() as u64;

    SystemStats {
        total_artifacts,
        total_proposals,
        total_users,
        total_nfts,
        verified_artifacts,
        active_proposals,
        last_updated: get_time(),
    }
}

#[query]
fn get_audit_logs(limit: Option<u64>) -> Vec<AuditEntry> {
    let limit = limit.unwrap_or(50) as usize;
    modules::audit::get_recent_audit_logs(limit)
}

#[query]
fn get_security_alerts() -> Vec<AuditEntry> {
    modules::audit::get_security_alerts()
}

// ============================================================================
// CANISTER LIFECYCLE
// ============================================================================

#[init]
fn init() {
    // Initialize any required state
    log_audit_event(
        AuditEventType::SystemMaintenance,
        None,
        "Canister initialized".to_string(),
        AuditSeverity::Info
    );
}

#[pre_upgrade]
fn pre_upgrade() {
    // Any cleanup before upgrade
    log_audit_event(
        AuditEventType::SystemMaintenance,
        None,
        "Pre-upgrade cleanup initiated".to_string(),
        AuditSeverity::Info
    );
}

#[post_upgrade]
fn post_upgrade() {
    // Any setup after upgrade
    log_audit_event(
        AuditEventType::SystemMaintenance,
        None,
        "Post-upgrade setup completed".to_string(),
        AuditSeverity::Info
    );
}

// ============================================================================
// HEALTH CHECK AND DIAGNOSTICS
// ============================================================================

#[query]
fn health_check() -> HealthStatus {
    HealthStatus {
        status: "healthy".to_string(),
        timestamp: get_time(),
        version: "2.0.0".to_string(),
        uptime: get_time() / 1_000_000_000, // Convert to seconds
    }
}

// ============================================================================
// ADDITIONAL TYPES FOR SYSTEM MANAGEMENT
// ============================================================================

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct SystemStats {
    pub total_artifacts: u64,
    pub total_proposals: u64,
    pub total_users: u64,
    pub total_nfts: u64,
    pub verified_artifacts: u64,
    pub active_proposals: u64,
    pub last_updated: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct HealthStatus {
    pub status: String,
    pub timestamp: u64,
    pub version: String,
    pub uptime: u64,
}

// ============================================================================
// CANDID EXPORT (for automatic DID generation)
// ============================================================================
// dfx will call this special query (legacy name) if present to extract the
// complete interface instead of relying on a stale manually maintained DID file.
// After deploying or while the replica is running you can run:
//   dfx canister call asl-proj-backend __get_candid_interface_tmp_hack > src/asl-proj-backend/asl-proj-backend.did
// Or update dfx.json to omit the static "candid" path so dfx generates automatically.

// (Optional) Unit test helper to print candid when running `cargo test` locally.
#[cfg(test)]
mod candid_tests {
    use super::*;
    #[test]
    fn print_candid() {
        println!("{}", candid::export_service!());
    }
}
