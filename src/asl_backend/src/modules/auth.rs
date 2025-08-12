use candid::Principal;
use ic_cdk::caller;

use crate::modules::types::*;
use crate::modules::storage::USERS;

// ============================================================================
// AUTHENTICATION & AUTHORIZATION
// ============================================================================

pub fn get_caller() -> Principal {
    caller()
}

pub fn is_verified_institution(caller: Principal) -> bool {
    USERS.with(|users| {
        users.borrow().get(&caller)
            .map(|user| {
                matches!(user.role, UserRole::Institution) && 
                user.verified_at.is_some() &&
                matches!(user.verification_level, 
                    UserVerificationLevel::FullyVerified | 
                    UserVerificationLevel::InstitutionVerified
                )
            })
            .unwrap_or(false)
    })
}

pub fn can_vote(caller: Principal) -> bool {
    USERS.with(|users| {
        users.borrow().get(&caller)
            .map(|user| {
                user.permissions.can_vote && 
                matches!(user.verification_level, 
                    UserVerificationLevel::PeerVerified | 
                    UserVerificationLevel::FullyVerified |
                    UserVerificationLevel::InstitutionVerified
                )
            })
            .unwrap_or(false)
    })
}

pub fn can_create_proposals(caller: Principal) -> bool {
    USERS.with(|users| {
        users.borrow().get(&caller)
            .map(|user| {
                user.permissions.can_create_proposals &&
                matches!(user.role, 
                    UserRole::Expert | 
                    UserRole::Moderator | 
                    UserRole::Institution |
                    UserRole::Curator
                )
            })
            .unwrap_or(false)
    })
}

pub fn can_submit_artifacts(caller: Principal) -> bool {
    USERS.with(|users| {
        users.borrow().get(&caller)
            .map(|user| {
                user.permissions.can_submit_artifacts &&
                (is_verified_institution(caller) || 
                 matches!(user.role, UserRole::Expert) || // Allow experts to submit artifacts without full verification
                 matches!(user.role, UserRole::Institution)) // Allow institutions to submit artifacts
            })
            .unwrap_or(false)
    })
}

pub fn get_voting_weight(caller: Principal) -> u32 {
    USERS.with(|users| {
        users.borrow().get(&caller)
            .map(|user| user.permissions.voting_weight)
            .unwrap_or(1)
    })
}

pub fn is_expert_or_institution(caller: Principal) -> bool {
    USERS.with(|users| {
        users.borrow().get(&caller)
            .map(|user| matches!(user.role, UserRole::Expert | UserRole::Institution))
            .unwrap_or(false)
    })
}

pub fn has_required_expertise(caller: Principal, required_expertise: &[String]) -> bool {
    if required_expertise.is_empty() {
        return true; // No specific expertise required
    }

    USERS.with(|users| {
        users.borrow().get(&caller)
            .map(|user| {
                required_expertise.iter().any(|req| {
                    user.specialization.iter().any(|spec| 
                        spec.to_lowercase().contains(&req.to_lowercase()) ||
                        req.to_lowercase().contains(&spec.to_lowercase())
                    )
                })
            })
            .unwrap_or(false)
    })
}

pub fn can_moderate(caller: Principal) -> bool {
    USERS.with(|users| {
        users.borrow().get(&caller)
            .map(|user| {
                user.permissions.can_moderate &&
                matches!(user.role, UserRole::Moderator)
            })
            .unwrap_or(false)
    })
}
