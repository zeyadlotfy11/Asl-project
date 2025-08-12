use candid::Principal;
use ic_cdk::update;

use crate::modules::types::*;
use crate::modules::storage::*;
use crate::modules::auth::*;
use crate::modules::utils::*;
use crate::modules::audit::log_audit_event;

// ============================================================================
// ENHANCED VOTING SYSTEM
// ============================================================================

#[update]
pub fn vote_on_proposal(request: VoteRequest) -> Result<String, String> {
    let caller = get_caller();
    
    // Validate caller permissions
    // if !can_vote(caller) {
    //     return Err("You don't have voting rights. Please verify your account first.".to_string());
    // }

    // Validate vote request
    if let Some(rationale) = &request.rationale {
        if rationale.len() < 10 {
            return Err("Vote rationale must be at least 10 characters if provided".to_string());
        }
        if rationale.len() > 1000 {
            return Err("Vote rationale too long (max 1000 characters)".to_string());
        }
    }

    let now = get_time();
    let vote_id = get_next_id(4); // Vote ID counter
    let voting_weight = get_voting_weight(caller);

    PROPOSALS.with(|proposals| {
        let mut proposals = proposals.borrow_mut();
        if let Some(mut proposal) = proposals.get(&request.proposal_id) {
            
            // Enhanced deadline check with grace period for high urgency
            let effective_deadline = match proposal.urgency_level {
                UrgencyLevel::Emergency => proposal.voting_deadline + (2 * 3600 * 1_000_000_000), // 2 hour grace
                _ => proposal.voting_deadline,
            };
            
            if now > effective_deadline {
                return Err("Voting period has ended".to_string());
            }

            // Check if already voted
            if proposal.voting_results.voter_principals.contains(&caller) {
                return Err("You have already voted on this proposal".to_string());
            }

            // Enhanced expertise check
            if !has_required_expertise(caller, &proposal.required_expertise) {
                return Err("You don't have the required expertise to vote on this proposal".to_string());
            }

            // Validate expertise relevance score
            let expertise_relevance = request.expertise_relevance.unwrap_or(50);
            if expertise_relevance > 100 {
                return Err("Expertise relevance cannot exceed 100%".to_string());
            }

            // Create enhanced vote record
            let vote = Vote {
                id: vote_id,
                proposal_id: request.proposal_id,
                voter: caller,
                vote_type: request.vote_type.clone(),
                weight: voting_weight,
                timestamp: now,
                rationale: request.rationale.clone(),
                expertise_relevance,
            };

            // Store the vote
            VOTES.with(|votes| {
                votes.borrow_mut().insert(vote_id, vote);
            });

            // Update proposal voting results with enhanced calculations
            proposal.voting_results.voter_principals.insert(caller);
            proposal.voting_results.total_votes += 1;

            match request.vote_type {
                VoteType::For => proposal.voting_results.votes_for += voting_weight,
                VoteType::Against => proposal.voting_results.votes_against += voting_weight,
                VoteType::Abstain => proposal.voting_results.abstentions += voting_weight,
                VoteType::RequiresMoreEvidence => {
                    proposal.voting_results.abstentions += voting_weight;
                    // Auto-extend deadline if many users require more evidence
                    if proposal.voting_results.abstentions > proposal.voting_results.votes_for + proposal.voting_results.votes_against {
                        proposal.voting_deadline += 24 * 3600 * 1_000_000_000; // Extend by 24 hours
                    }
                }
            }

            // Enhanced weighted score calculation including expertise relevance
            let total_weighted_votes = proposal.voting_results.votes_for + 
                                     proposal.voting_results.votes_against + 
                                     proposal.voting_results.abstentions;
            
            if total_weighted_votes > 0 {
                proposal.voting_results.weighted_score = 
                    proposal.voting_results.votes_for as f64 / total_weighted_votes as f64;
            }

            // Update expert consensus with enhanced metrics
            if is_expert_or_institution(caller) {
                update_expert_consensus(&mut proposal, &request.vote_type, voting_weight, expertise_relevance);
            }

            // Auto-execute if unanimous consensus reached for urgent proposals
            if proposal.urgency_level == UrgencyLevel::Emergency && 
               proposal.voting_results.total_votes >= 3 &&
               (proposal.voting_results.votes_against == 0 || proposal.voting_results.votes_for == 0) {
                proposal.status = if proposal.voting_results.votes_for > 0 {
                    ProposalStatus::Passed
                } else {
                    ProposalStatus::Rejected
                };
            }

            // Check if quorum is reached and voting should conclude
            check_and_finalize_proposal(&mut proposal, now);

            // Capture voting results before moving proposal
            let votes_for = proposal.voting_results.votes_for;
            let votes_against = proposal.voting_results.votes_against;
            let total_votes = proposal.voting_results.total_votes;

            proposals.insert(request.proposal_id, proposal);

            // Update user stats with enhanced tracking
            update_user_voting_stats(caller, expertise_relevance, now);

            log_audit_event(
                AuditEventType::VoteCast,
                Some(request.proposal_id),
                format!("Vote cast on proposal {} with {}% expertise relevance", 
                    request.proposal_id, expertise_relevance),
                AuditSeverity::Info
            );

            Ok(format!(
                "Vote recorded successfully! Current status: {} votes total ({} for, {} against)", 
                total_votes, votes_for, votes_against
            ))
        } else {
            Err("Proposal not found".to_string())
        }
    })
}

fn update_expert_consensus(proposal: &mut Proposal, vote_type: &VoteType, weight: u32, expertise_relevance: u32) {
    if proposal.voting_results.expert_consensus.is_none() {
        proposal.voting_results.expert_consensus = Some(ExpertConsensus {
            expert_votes_for: 0,
            expert_votes_against: 0,
            expert_confidence: 0.0,
            peer_review_score: 0.0,
        });
    }

    if let Some(ref mut consensus) = proposal.voting_results.expert_consensus {
        match vote_type {
            VoteType::For => consensus.expert_votes_for += weight,
            VoteType::Against => consensus.expert_votes_against += weight,
            _ => {} // Abstentions don't count in expert consensus
        }

        // Recalculate expert confidence with expertise relevance weighting
        let total_expert_votes = consensus.expert_votes_for + consensus.expert_votes_against;
        if total_expert_votes > 0 {
            consensus.expert_confidence = consensus.expert_votes_for as f64 / total_expert_votes as f64;
        }
        
        // Update peer review score based on expertise relevance
        consensus.peer_review_score = (consensus.peer_review_score + expertise_relevance as f64) / 2.0;
    }
}

fn check_and_finalize_proposal(proposal: &mut Proposal, current_time: u64) {
    // Check if voting deadline has passed
    if current_time > proposal.voting_deadline {
        finalize_proposal_voting(proposal);
    }
    
    // Check if quorum is reached early
    if proposal.voting_results.total_votes >= proposal.quorum_required {
        // For high-confidence expert consensus, allow early conclusion
        if let Some(ref consensus) = proposal.voting_results.expert_consensus {
            if consensus.expert_confidence > 0.8 && consensus.peer_review_score > 80.0 {
                finalize_proposal_voting(proposal);
            }
        }
    }
}

fn finalize_proposal_voting(proposal: &mut Proposal) {
    let total_votes = proposal.voting_results.votes_for + proposal.voting_results.votes_against;
    
    if total_votes == 0 {
        proposal.status = ProposalStatus::Expired;
    } else if proposal.voting_results.votes_for > proposal.voting_results.votes_against {
        proposal.status = ProposalStatus::Passed;
    } else {
        proposal.status = ProposalStatus::Rejected;
    }
}

fn update_user_voting_stats(caller: Principal, expertise_relevance: u32, timestamp: u64) {
    USERS.with(|users| {
        let mut users = users.borrow_mut();
        if let Some(mut user) = users.get(&caller) {
            user.activity_stats.votes_cast += 1;
            user.activity_stats.last_activity = timestamp;
            
            // Track vote quality based on expertise relevance
            if expertise_relevance >= 80 {
                user.reputation += 2; // High quality vote
            } else if expertise_relevance >= 50 {
                user.reputation += 1; // Standard vote
            }
            
            users.insert(caller, user);
        }
    });
}

#[update]
pub fn get_vote_details(proposal_id: u64) -> Result<Vec<Vote>, String> {
    let caller = get_caller();
    
    // Check if user can view voting details
    if !can_vote(caller) && !can_moderate(caller) {
        return Err("You don't have permission to view vote details".to_string());
    }

    let mut votes = Vec::new();
    VOTES.with(|vote_store| {
        for (_, vote) in vote_store.borrow().iter() {
            if vote.proposal_id == proposal_id {
                votes.push(vote.clone());
            }
        }
    });

    if votes.is_empty() {
        Err("No votes found for this proposal".to_string())
    } else {
        Ok(votes)
    }
}

#[update]
pub fn change_vote(proposal_id: u64, new_vote_type: VoteType, new_rationale: Option<String>) -> Result<String, String> {
    let caller = get_caller();
    
    // if !can_vote(caller) {
    //     return Err("You don't have voting rights".to_string());
    // }

    // Check if voting is still active
    PROPOSALS.with(|proposals| {
        let proposals = proposals.borrow();
        if let Some(proposal) = proposals.get(&proposal_id) {
            if get_time() > proposal.voting_deadline {
                return Err("Cannot change vote after voting deadline".to_string());
            }
            
            if !proposal.voting_results.voter_principals.contains(&caller) {
                return Err("You haven't voted on this proposal yet".to_string());
            }
        } else {
            return Err("Proposal not found".to_string());
        }
        Ok(())
    })?;

    // Find and update the vote
    VOTES.with(|vote_store| {
        let mut votes = vote_store.borrow_mut();
        for (vote_id, mut vote) in votes.iter() {
            if vote.proposal_id == proposal_id && vote.voter == caller {
                let old_vote_type = vote.vote_type.clone();
                let vote_weight = vote.weight; // Store weight before moving vote
                vote.vote_type = new_vote_type.clone();
                vote.rationale = new_rationale.clone();
                vote.timestamp = get_time();
                
                votes.insert(vote_id, vote);
                
                // Update proposal voting results
                update_proposal_vote_counts(proposal_id, &old_vote_type, &new_vote_type, vote_weight);
                
                log_audit_event(
                    AuditEventType::VoteCast,
                    Some(proposal_id),
                    format!("Vote changed from {:?} to {:?} on proposal {}", old_vote_type, new_vote_type, proposal_id),
                    AuditSeverity::Info
                );
                
                return Ok("Vote updated successfully".to_string());
            }
        }
        Err("Vote not found".to_string())
    })
}

fn update_proposal_vote_counts(proposal_id: u64, old_vote: &VoteType, new_vote: &VoteType, weight: u32) {
    PROPOSALS.with(|proposals| {
        let mut proposals = proposals.borrow_mut();
        if let Some(mut proposal) = proposals.get(&proposal_id) {
            // Remove old vote count
            match old_vote {
                VoteType::For => proposal.voting_results.votes_for -= weight,
                VoteType::Against => proposal.voting_results.votes_against -= weight,
                VoteType::Abstain | VoteType::RequiresMoreEvidence => proposal.voting_results.abstentions -= weight,
            }
            
            // Add new vote count
            match new_vote {
                VoteType::For => proposal.voting_results.votes_for += weight,
                VoteType::Against => proposal.voting_results.votes_against += weight,
                VoteType::Abstain | VoteType::RequiresMoreEvidence => proposal.voting_results.abstentions += weight,
            }
            
            // Recalculate weighted score
            let total_weighted_votes = proposal.voting_results.votes_for + 
                                     proposal.voting_results.votes_against + 
                                     proposal.voting_results.abstentions;
            
            if total_weighted_votes > 0 {
                proposal.voting_results.weighted_score = 
                    proposal.voting_results.votes_for as f64 / total_weighted_votes as f64;
            }
            
            proposals.insert(proposal_id, proposal);
        }
    });
}
