use ic_cdk::{query, update};
use std::collections::BTreeSet;

use crate::modules::types::*;
use crate::modules::storage::*;
use crate::modules::auth::*;
use crate::modules::utils::*;
use crate::modules::audit::log_audit_event;

// ============================================================================
// DAO GOVERNANCE SYSTEM
// ============================================================================

#[update]
pub fn create_proposal(request: CreateProposalRequest) -> Result<u64, String> {
    let caller = get_caller();
    
    // Enhanced permission check
    // if !can_create_proposals(caller) {
    //     return Err("You don't have permission to create proposals. Please verify your expert or institution status.".to_string());
    // }

    // Comprehensive validation
    validate_proposal_title(&request.title)?;
    validate_proposal_description(&request.description)?;

    // Validate artifact reference if provided
    if let Some(artifact_id) = request.artifact_id {
        ARTIFACTS.with(|artifacts| {
            if !artifacts.borrow().contains_key(&artifact_id) {
                return Err("Referenced artifact does not exist".to_string());
            }
            Ok(())
        })?;
    }

    let proposal_id = get_next_id(2); // Proposal ID counter
    let now = get_time();
    let voting_deadline = calculate_voting_deadline(request.voting_duration_hours);
    
    // Calculate appropriate quorum based on proposal type
    let total_eligible_voters = count_eligible_voters();
    let quorum_required = request.quorum_required
        .unwrap_or_else(|| calculate_quorum(total_eligible_voters, &request.proposal_type));

    let proposal = Proposal {
        id: proposal_id,
        proposal_type: request.proposal_type.clone(),
        artifact_id: request.artifact_id,
        proposer: caller,
        title: request.title.clone(),
        description: request.description.clone(),
        evidence: request.evidence.unwrap_or_default(),
        created_at: now,
        voting_deadline,
        execution_deadline: Some(voting_deadline + (24 * 3600 * 1_000_000_000)), // 24 hours after voting
        quorum_required,
        status: ProposalStatus::Active,
        voting_results: VotingResults {
            total_votes: 0,
            votes_for: 0,
            votes_against: 0,
            abstentions: 0,
            weighted_score: 0.0,
            voter_principals: BTreeSet::new(),
            expert_consensus: None,
        },
        execution_payload: request.execution_payload,
        discussion_thread: Vec::new(),
        required_expertise: request.required_expertise.unwrap_or_default(),
        urgency_level: request.urgency_level.unwrap_or(UrgencyLevel::Normal),
    };

    PROPOSALS.with(|proposals| {
        proposals.borrow_mut().insert(proposal_id, proposal);
    });

    // Update user stats
    USERS.with(|users| {
        let mut users = users.borrow_mut();
        if let Some(mut user) = users.get(&caller) {
            user.activity_stats.proposals_created += 1;
            user.activity_stats.last_activity = now;
            users.insert(caller, user);
        }
    });

    log_audit_event(
        AuditEventType::ProposalCreation,
        Some(proposal_id),
        format!("Created proposal: {} (Type: {:?})", request.title, request.proposal_type),
        AuditSeverity::Info
    );

    Ok(proposal_id)
}

#[update]
pub fn execute_proposal(proposal_id: u64) -> Result<String, String> {
    let caller = get_caller();
    
    PROPOSALS.with(|proposals| {
        let mut proposals = proposals.borrow_mut();
        if let Some(mut proposal) = proposals.get(&proposal_id) {
            let now = get_time();
            
            // Enhanced execution checks
            if proposal.status != ProposalStatus::Passed {
                return Err("Proposal must be passed before execution".to_string());
            }

            // Check execution deadline
            if let Some(deadline) = proposal.execution_deadline {
                if now > deadline {
                    proposal.status = ProposalStatus::Expired;
                    proposals.insert(proposal_id, proposal);
                    return Err("Proposal execution deadline has passed".to_string());
                }
            }

            // Permission check for execution
            if !can_moderate(caller) && proposal.proposer != caller {
                return Err("Only the proposer or a moderator can execute this proposal".to_string());
            }

            // Execute based on proposal type
            let execution_result = match proposal.proposal_type {
                ProposalType::VerifyArtifact => {
                    execute_verify_artifact(&proposal)
                },
                ProposalType::DisputeArtifact => {
                    execute_dispute_artifact(&proposal)
                },
                ProposalType::UpdateArtifactStatus => {
                    execute_update_artifact_status(&proposal)
                },
                ProposalType::GrantUserRole => {
                    execute_grant_user_role(&proposal)
                },
                ProposalType::RevokeUserRole => {
                    execute_revoke_user_role(&proposal)
                },
                ProposalType::UpdateArtifactMetadata => {
                    execute_update_artifact_metadata(&proposal)
                },
                _ => {
                    Ok("Proposal type requires manual execution".to_string())
                }
            };

            match execution_result {
                Ok(result) => {
                    proposal.status = ProposalStatus::Executed;
                    proposals.insert(proposal_id, proposal);
                    
                    log_audit_event(
                        AuditEventType::SystemMaintenance,
                        Some(proposal_id),
                        format!("Executed proposal {}: {}", proposal_id, result),
                        AuditSeverity::Info
                    );
                    
                    Ok(format!("Proposal executed successfully: {}", result))
                },
                Err(error) => {
                    proposal.status = ProposalStatus::FailedExecution;
                    proposals.insert(proposal_id, proposal);
                    
                    log_audit_event(
                        AuditEventType::SystemMaintenance,
                        Some(proposal_id),
                        format!("Failed to execute proposal {}: {}", proposal_id, error),
                        AuditSeverity::Warning
                    );
                    
                    Err(format!("Proposal execution failed: {}", error))
                }
            }
        } else {
            Err("Proposal not found".to_string())
        }
    })
}

#[update]
pub fn add_comment_to_proposal(proposal_id: u64, content: String, reply_to: Option<u64>) -> Result<u64, String> {
    let caller = get_caller();
    
    if content.trim().is_empty() {
        return Err("Comment content cannot be empty".to_string());
    }
    
    if content.len() > 2000 {
        return Err("Comment too long (max 2000 characters)".to_string());
    }

    PROPOSALS.with(|proposals| {
        let mut proposals = proposals.borrow_mut();
        if let Some(mut proposal) = proposals.get(&proposal_id) {
            let comment_id = get_next_id(7); // Comment ID counter
            
            let comment = Comment {
                id: comment_id,
                author: caller,
                content,
                timestamp: get_time(),
                reply_to,
                endorsements: 0,
            };
            
            proposal.discussion_thread.push(comment);
            proposals.insert(proposal_id, proposal);
            
            Ok(comment_id)
        } else {
            Err("Proposal not found".to_string())
        }
    })
}

// Helper functions for proposal execution
fn execute_verify_artifact(proposal: &Proposal) -> Result<String, String> {
    if let Some(artifact_id) = proposal.artifact_id {
        ARTIFACTS.with(|artifacts| {
            let mut artifacts = artifacts.borrow_mut();
            if let Some(mut artifact) = artifacts.get(&artifact_id) {
                artifact.status = ArtifactStatus::Verified;
                artifact.verification_level = VerificationLevel::DaoVerified;
                artifact.updated_at = get_time();
                artifacts.insert(artifact_id, artifact);
                Ok(format!("Artifact {} verified successfully", artifact_id))
            } else {
                Err("Artifact not found".to_string())
            }
        })
    } else {
        Err("No artifact ID specified in proposal".to_string())
    }
}

fn execute_dispute_artifact(proposal: &Proposal) -> Result<String, String> {
    if let Some(artifact_id) = proposal.artifact_id {
        ARTIFACTS.with(|artifacts| {
            let mut artifacts = artifacts.borrow_mut();
            if let Some(mut artifact) = artifacts.get(&artifact_id) {
                artifact.status = ArtifactStatus::Disputed;
                artifact.updated_at = get_time();
                artifacts.insert(artifact_id, artifact);
                Ok(format!("Artifact {} marked as disputed", artifact_id))
            } else {
                Err("Artifact not found".to_string())
            }
        })
    } else {
        Err("No artifact ID specified in proposal".to_string())
    }
}

fn execute_update_artifact_status(_proposal: &Proposal) -> Result<String, String> {
    // This would parse the execution payload to determine the new status
    // For now, just return success
    Ok("Artifact status updated".to_string())
}

fn execute_grant_user_role(_proposal: &Proposal) -> Result<String, String> {
    // This would parse the execution payload to determine user and role
    // For now, just return success
    Ok("User role granted".to_string())
}

fn execute_revoke_user_role(_proposal: &Proposal) -> Result<String, String> {
    // This would parse the execution payload to determine user and role
    // For now, just return success
    Ok("User role revoked".to_string())
}

fn execute_update_artifact_metadata(_proposal: &Proposal) -> Result<String, String> {
    // This would parse the execution payload to update metadata
    // For now, just return success
    Ok("Artifact metadata updated".to_string())
}

fn count_eligible_voters() -> u32 {
    USERS.with(|users| {
        users.borrow().iter()
            .filter(|(_, user)| user.permissions.can_vote)
            .count() as u32
    })
}

#[query]
pub fn get_proposal(proposal_id: u64) -> Result<Proposal, String> {
    PROPOSALS.with(|proposals| {
        proposals.borrow().get(&proposal_id)
            .ok_or_else(|| "Proposal not found".to_string())
    })
}

#[query]
pub fn get_all_proposals() -> Vec<ProposalResponse> {
    let mut proposals = Vec::new();
    PROPOSALS.with(|proposal_store| {
        for (_, proposal) in proposal_store.borrow().iter() {
            let response = ProposalResponse {
                id: proposal.id,
                status: proposal.status.clone(),
                title: proposal.title.clone(),
                voting_deadline: proposal.voting_deadline,
                artifact_id: proposal.artifact_id,
                description: proposal.description.clone(),
                voters: proposal.voting_results.voter_principals.iter().cloned().collect(),
                created_at: proposal.created_at,
                proposer: proposal.proposer,
                votes_for: proposal.voting_results.votes_for,
                execution_payload: proposal.execution_payload.clone(),
                proposal_type: proposal.proposal_type.clone(),
                votes_against: proposal.voting_results.votes_against,
            };
            proposals.push(response);
        }
    });
    
    // Sort by creation date (newest first)
    proposals.sort_by(|a, b| b.created_at.cmp(&a.created_at));
    proposals
}

#[query]
pub fn get_active_proposals() -> Vec<ProposalResponse> {
    get_all_proposals()
        .into_iter()
        .filter(|p| matches!(p.status, ProposalStatus::Active))
        .collect()
}

#[query]
pub fn get_proposals_by_status(status: ProposalStatus) -> Vec<ProposalResponse> {
    get_all_proposals()
        .into_iter()
        .filter(|p| p.status == status)
        .collect()
}
