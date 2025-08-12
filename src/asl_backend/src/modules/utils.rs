use ic_cdk::api::time;
use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

pub fn get_time() -> u64 {
    time()
}

pub fn create_hash(data: &str) -> String {
    let mut hasher = DefaultHasher::new();
    data.hash(&mut hasher);
    format!("{:x}", hasher.finish())
}

pub fn calculate_voting_deadline(duration_hours: u64) -> u64 {
    let current_time = get_time();
    current_time + (duration_hours * 3600 * 1_000_000_000) // Convert hours to nanoseconds
}

pub fn is_voting_deadline_passed(deadline: u64) -> bool {
    get_time() > deadline
}

pub fn calculate_quorum(total_eligible_voters: u32, proposal_type: &crate::modules::types::ProposalType) -> u32 {
    match proposal_type {
        crate::modules::types::ProposalType::EmergencyIntervention => (total_eligible_voters * 75) / 100, // 75%
        crate::modules::types::ProposalType::VerifyArtifact | 
        crate::modules::types::ProposalType::DisputeArtifact => (total_eligible_voters * 60) / 100, // 60%
        crate::modules::types::ProposalType::GrantUserRole | 
        crate::modules::types::ProposalType::RevokeUserRole => (total_eligible_voters * 70) / 100, // 70%
        _ => (total_eligible_voters * 50) / 100, // 50% for general proposals
    }
}

pub fn format_duration_string(hours: u64) -> String {
    if hours < 24 {
        format!("{} hours", hours)
    } else {
        let days = hours / 24;
        let remaining_hours = hours % 24;
        if remaining_hours == 0 {
            format!("{} days", days)
        } else {
            format!("{} days, {} hours", days, remaining_hours)
        }
    }
}

pub fn validate_proposal_title(title: &str) -> Result<(), String> {
    if title.trim().is_empty() {
        return Err("Proposal title cannot be empty".to_string());
    }
    if title.len() > 200 {
        return Err("Proposal title too long (max 200 characters)".to_string());
    }
    Ok(())
}

pub fn validate_proposal_description(description: &str) -> Result<(), String> {
    if description.trim().is_empty() {
        return Err("Proposal description cannot be empty".to_string());
    }
    if description.len() < 50 {
        return Err("Proposal description too short (min 50 characters)".to_string());
    }
    if description.len() > 10000 {
        return Err("Proposal description too long (max 10000 characters)".to_string());
    }
    Ok(())
}

pub fn validate_voting_duration(duration_hours: u64) -> Result<(), String> {
    if duration_hours < 1 || duration_hours > 168 { // 1 hour to 7 days
        return Err("Voting duration must be between 1 hour and 7 days".to_string());
    }
    Ok(())
}