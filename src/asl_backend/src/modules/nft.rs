use ic_cdk::{query, update};

use crate::modules::types::*;
use crate::modules::storage::*;
use crate::modules::auth::*;
use crate::modules::utils::*;
use crate::modules::audit::log_audit_event;

// ============================================================================
// NFT HERITAGE CERTIFICATE SYSTEM
// ============================================================================

#[update]
pub fn issue_heritage_nft(artifact_id: u64) -> Result<u64, String> {
    let caller = get_caller();
    
    // Only verified institutions or moderators can issue NFTs
    if !is_verified_institution(caller) && !can_moderate(caller) {
        return Err("Only verified institutions or moderators can issue Heritage NFTs".to_string());
    }

    // Check if artifact exists and is verified
    let artifact = ARTIFACTS.with(|artifacts| {
        artifacts.borrow().get(&artifact_id)
    });

    let artifact = match artifact {
        Some(artifact) => artifact,
        None => return Err("Artifact not found".to_string()),
    };

    if !matches!(artifact.status, ArtifactStatus::Verified) {
        return Err("Only verified artifacts can receive Heritage NFTs".to_string());
    }

    // Check if NFT already exists for this artifact
    let existing_nft = NFTS.with(|nfts| {
        for (_, nft) in nfts.borrow().iter() {
            if nft.artifact_id == artifact_id {
                return Some(nft.clone());
            }
        }
        None
    });

    if existing_nft.is_some() {
        return Err("Heritage NFT already exists for this artifact".to_string());
    }

    let nft_id = get_next_id(3); // NFT ID counter
    let now = get_time();
    
    // Get issuer information
    let issuer_info = USERS.with(|users| {
        users.borrow().get(&caller)
    });

    let certificate_number = format!("HER-{:06}-{}", nft_id, now / 1_000_000_000);
    let verification_hash = create_hash(&format!("{}:{}:{}", artifact_id, caller, now));

    let heritage_certificate = HeritageCertificate {
        certificate_number: certificate_number.clone(),
        issuer_name: match &issuer_info {
            Some(user) => match &user.institution {
                Some(inst) => inst.clone(),
                None => "Expert Validator".to_string(),
            },
            None => "Unknown Issuer".to_string(),
        },
        verification_date: now,
        authenticity_guarantees: vec![
            "Verified through DAO consensus".to_string(),
            "Expert peer review completed".to_string(),
            "Cultural heritage significance confirmed".to_string(),
        ],
        scientific_analysis: vec![
            "Digital forensics analysis".to_string(),
            "Provenance verification".to_string(),
        ],
        expert_endorsements: Vec::new(), // To be populated separately
        digital_signature: verification_hash.clone(),
    };

    let access_rights = AccessRights {
        can_view_detailed_metadata: true,
        can_request_high_res_images: true,
        can_access_research_data: true,
        can_propose_studies: false, // Default to false
        special_permissions: Vec::new(),
    };

    let nft = ProofOfHeritageNFT {
        id: nft_id,
        artifact_id,
        owner: artifact.creator, // Initial owner is the artifact creator
        created_at: now,
        metadata: vec![
            ("certificate_number".to_string(), certificate_number),
            ("artifact_name".to_string(), artifact.name.clone()),
            ("verification_level".to_string(), format!("{:?}", artifact.verification_level)),
            ("cultural_significance".to_string(), format!("{:?}", artifact.cultural_significance.significance_level)),
        ],
        is_transferable: false, // Heritage NFTs are non-transferable
        verification_hash,
        issuing_authority: caller,
        heritage_certificate,
        access_rights,
    };

    NFTS.with(|nfts| {
        nfts.borrow_mut().insert(nft_id, nft);
    });

    log_audit_event(
        AuditEventType::NftIssued,
        Some(artifact_id),
        format!("Heritage NFT {} issued for artifact {}", nft_id, artifact_id),
        AuditSeverity::Info
    );

    Ok(nft_id)
}

#[update]
pub fn add_expert_endorsement(nft_id: u64, notes: String) -> Result<String, String> {
    let caller = get_caller();
    
    // Only experts can add endorsements
    if !matches!(get_user_role(caller), Some(UserRole::Expert)) {
        return Err("Only verified experts can add endorsements".to_string());
    }

    if notes.len() < 20 {
        return Err("Endorsement notes must be at least 20 characters".to_string());
    }

    NFTS.with(|nfts| {
        let mut nfts = nfts.borrow_mut();
        if let Some(mut nft) = nfts.get(&nft_id) {
            
            // Check if expert already endorsed
            for endorsement in &nft.heritage_certificate.expert_endorsements {
                if endorsement.expert_principal == caller {
                    return Err("You have already endorsed this Heritage NFT".to_string());
                }
            }

            // Get expert information
            let expert_info = USERS.with(|users| {
                users.borrow().get(&caller)
            });

            let endorsement = match expert_info {
                Some(user) => {
                    if matches!(user.role, UserRole::Expert | UserRole::Institution) {
                        ExpertEndorsement {
                            expert_principal: caller,
                            expert_name: format!("{:?}", caller),
                            institution: user.institution
                                .clone()
                                .unwrap_or_else(|| "Independent Expert".to_string()),
                            expertise_areas: user.specialization.clone(),
                            endorsement_date: get_time(),
                            confidence_level: 85, // Default confidence
                            notes,
                        }
                    } else {
                        return Err("User is not an expert or institution".to_string());
                    }
                },
                None => return Err("User not found".to_string()),
            };

            nft.heritage_certificate.expert_endorsements.push(endorsement);
            nfts.insert(nft_id, nft);

            log_audit_event(
                AuditEventType::DataModification,
                Some(nft_id),
                "Expert endorsement added to Heritage NFT".to_string(),
                AuditSeverity::Info
            );

            Ok("Expert endorsement added successfully".to_string())
        } else {
            Err("Heritage NFT not found".to_string())
        }
    })
}

#[update]
pub fn update_nft_access_rights(nft_id: u64, new_rights: AccessRights) -> Result<String, String> {
    let caller = get_caller();
    
    // Only the NFT owner or moderators can update access rights
    let can_update = NFTS.with(|nfts| {
        nfts.borrow().get(&nft_id)
            .map(|nft| nft.owner == caller || can_moderate(caller))
            .unwrap_or(false)
    });

    if !can_update {
        return Err("Only the NFT owner or moderators can update access rights".to_string());
    }

    NFTS.with(|nfts| {
        let mut nfts = nfts.borrow_mut();
        if let Some(mut nft) = nfts.get(&nft_id) {
            nft.access_rights = new_rights;
            nfts.insert(nft_id, nft);

            log_audit_event(
                AuditEventType::AccessGranted,
                Some(nft_id),
                "NFT access rights updated".to_string(),
                AuditSeverity::Info
            );

            Ok("Access rights updated successfully".to_string())
        } else {
            Err("Heritage NFT not found".to_string())
        }
    })
}

#[query]
pub fn get_nft(nft_id: u64) -> Result<ProofOfHeritageNFT, String> {
    NFTS.with(|nfts| {
        nfts.borrow().get(&nft_id)
            .ok_or_else(|| "Heritage NFT not found".to_string())
    })
}

#[query]
pub fn get_nft_by_artifact(artifact_id: u64) -> Result<ProofOfHeritageNFT, String> {
    NFTS.with(|nfts| {
        for (_, nft) in nfts.borrow().iter() {
            if nft.artifact_id == artifact_id {
                return Ok(nft.clone());
            }
        }
        Err("No Heritage NFT found for this artifact".to_string())
    })
}

#[query]
pub fn get_nfts_by_owner(owner: candid::Principal) -> Vec<ProofOfHeritageNFT> {
    let mut nfts = Vec::new();
    NFTS.with(|nft_store| {
        for (_, nft) in nft_store.borrow().iter() {
            if nft.owner == owner {
                nfts.push(nft.clone());
            }
        }
    });
    
    // Sort by creation date (newest first)
    nfts.sort_by(|a, b| b.created_at.cmp(&a.created_at));
    nfts
}

#[query]
pub fn get_all_nfts() -> Vec<ProofOfHeritageNFT> {
    let mut nfts = Vec::new();
    NFTS.with(|nft_store| {
        for (_, nft) in nft_store.borrow().iter() {
            nfts.push(nft.clone());
        }
    });
    
    // Sort by creation date (newest first)
    nfts.sort_by(|a, b| b.created_at.cmp(&a.created_at));
    nfts
}

fn get_user_role(principal: candid::Principal) -> Option<UserRole> {
    USERS.with(|users| {
        users.borrow().get(&principal)
            .map(|user| user.role.clone())
    })
}
