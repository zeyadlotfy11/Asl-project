use ic_cdk::{query, update};

use crate::modules::types::*;
use crate::modules::storage::*;
use crate::modules::auth::*;
use crate::modules::utils::*;
use crate::modules::audit::log_audit_event;

// ============================================================================
// ARTIFACT MANAGEMENT SYSTEM
// ============================================================================

#[update]
pub fn create_artifact(request: CreateArtifactRequest) -> Result<u64, String> {
    let caller = get_caller();
    
    // Check permissions
    if !can_submit_artifacts(caller) {
        return Err("You don't have permission to submit artifacts. Please verify your institution or expert status.".to_string());
    }

    // // Validate input
    // if request.name.trim().is_empty() {
    //     return Err("Artifact name cannot be empty".to_string());
    // }
    
    // if request.description.len() < 50 {
    //     return Err("Artifact description must be at least 50 characters".to_string());
    // }

    // if request.images.is_empty() {
    //     return Err("At least one image is required".to_string());
    // }

    let artifact_id = get_next_id(1); // Artifact ID counter
    let now = get_time();
    
    // Create initial history entry
    let history_entry = HistoryEntry {
        id: get_next_id(8), // History entry ID counter
        timestamp: now,
        action: "Created".to_string(),
        actor: caller,
        details: "Initial artifact submission".to_string(),
        evidence: None,
        immutable_hash: create_hash(&format!("{}:{}:{}", artifact_id, caller, now)),
    };

    let artifact = Artifact {
        id: artifact_id,
        name: request.name.clone(),
        description: request.description.clone(),
        metadata: request.metadata,
        images: request.images,
        creator: caller,
        created_at: now,
        updated_at: now,
        status: ArtifactStatus::PendingVerification,
        heritage_proof: request.heritage_proof,
        authenticity_score: 0,
        history: vec![history_entry],
        verification_level: VerificationLevel::Unverified,
        cultural_significance: CulturalSignificance {
            historical_period: None,
            cultural_group: None,
            significance_level: SignificanceLevel::Local,
            unesco_status: None,
            cultural_tags: Vec::new(),
        },
        geographic_origin: None,
        dating_information: None,
        physical_properties: None,
        conservation_status: ConservationStatus::Good,
        digital_fingerprint: Some(create_hash(&format!("{}:{}", artifact_id, now))),
    };

    ARTIFACTS.with(|artifacts| {
        artifacts.borrow_mut().insert(artifact_id, artifact);
    });

    // Update user stats
    USERS.with(|users| {
        let mut users = users.borrow_mut();
        if let Some(mut user) = users.get(&caller) {
            user.activity_stats.artifacts_submitted += 1;
            user.activity_stats.last_activity = now;
            users.insert(caller, user);
        }
    });

    log_audit_event(
        AuditEventType::ArtifactSubmission,
        Some(artifact_id),
        format!("Created artifact: {}", request.name),
        AuditSeverity::Info
    );

    Ok(artifact_id)
}

#[update]
pub fn update_artifact_metadata(artifact_id: u64, new_metadata: Vec<(String, String)>) -> Result<String, String> {
    let caller = get_caller();
    
    ARTIFACTS.with(|artifacts| {
        let mut artifacts = artifacts.borrow_mut();
        if let Some(mut artifact) = artifacts.get(&artifact_id) {
            
            // Check permissions - only creator or verified institutions can update
            if artifact.creator != caller && !is_verified_institution(caller) {
                return Err("You don't have permission to update this artifact".to_string());
            }

            let now = get_time();
            
            // Add history entry
            let history_entry = HistoryEntry {
                id: get_next_id(8),
                timestamp: now,
                action: "MetadataUpdated".to_string(),
                actor: caller,
                details: "Artifact metadata updated".to_string(),
                evidence: None,
                immutable_hash: create_hash(&format!("{}:{}:{}", artifact_id, caller, now)),
            };

            artifact.metadata = new_metadata;
            artifact.updated_at = now;
            artifact.history.push(history_entry);
            
            artifacts.insert(artifact_id, artifact);

            log_audit_event(
                AuditEventType::DataModification,
                Some(artifact_id),
                "Artifact metadata updated".to_string(),
                AuditSeverity::Info
            );

            Ok("Artifact metadata updated successfully".to_string())
        } else {
            Err("Artifact not found".to_string())
        }
    })
}

#[update]
pub fn add_artifact_image(artifact_id: u64, image_data: String) -> Result<String, String> {
    let caller = get_caller();
    
    ARTIFACTS.with(|artifacts| {
        let mut artifacts = artifacts.borrow_mut();
        if let Some(mut artifact) = artifacts.get(&artifact_id) {
            
            // Check permissions
            if artifact.creator != caller && !can_moderate(caller) {
                return Err("You don't have permission to add images to this artifact".to_string());
            }

            let now = get_time();
            
            // Add history entry
            let history_entry = HistoryEntry {
                id: get_next_id(8),
                timestamp: now,
                action: "ImageAdded".to_string(),
                actor: caller,
                details: "New image added to artifact".to_string(),
                evidence: Some(image_data.clone()),
                immutable_hash: create_hash(&format!("{}:{}:{}", artifact_id, caller, now)),
            };

            artifact.images.push(image_data);
            artifact.updated_at = now;
            artifact.history.push(history_entry);
            
            artifacts.insert(artifact_id, artifact);

            log_audit_event(
                AuditEventType::DataModification,
                Some(artifact_id),
                "Image added to artifact".to_string(),
                AuditSeverity::Info
            );

            Ok("Image added successfully".to_string())
        } else {
            Err("Artifact not found".to_string())
        }
    })
}

#[update]
pub fn update_artifact_status(artifact_id: u64, new_status: ArtifactStatus, reason: String) -> Result<String, String> {
    let caller = get_caller();
    
    // // Only moderators can directly update artifact status
    // if !can_moderate(caller) {
    //     return Err("Only moderators can update artifact status directly".to_string());
    // }

    ARTIFACTS.with(|artifacts| {
        let mut artifacts = artifacts.borrow_mut();
        if let Some(mut artifact) = artifacts.get(&artifact_id) {
            let now = get_time();
            let old_status = artifact.status.clone();
            
            // Add history entry
            let history_entry = HistoryEntry {
                id: get_next_id(8),
                timestamp: now,
                action: "StatusChanged".to_string(),
                actor: caller,
                details: format!("Status changed from {:?} to {:?}: {}", old_status, new_status, reason),
                evidence: None,
                immutable_hash: create_hash(&format!("{}:{}:{}", artifact_id, caller, now)),
            };

            artifact.status = new_status.clone();
            artifact.updated_at = now;
            artifact.history.push(history_entry);
            
            artifacts.insert(artifact_id, artifact);

            log_audit_event(
                AuditEventType::ArtifactVerification,
                Some(artifact_id),
                format!("Artifact status changed to {:?}: {}", new_status, reason),
                AuditSeverity::Info
            );

            Ok("Artifact status updated successfully".to_string())
        } else {
            Err("Artifact not found".to_string())
        }
    })
}

#[query]
pub fn get_artifact(artifact_id: u64) -> Result<Artifact, String> {
    ARTIFACTS.with(|artifacts| {
        artifacts.borrow().get(&artifact_id)
            .ok_or_else(|| "Artifact not found".to_string())
    })
}

#[query]
pub fn get_all_artifacts() -> Vec<Artifact> {
    let mut artifacts = Vec::new();
    ARTIFACTS.with(|artifact_store| {
        for (_, artifact) in artifact_store.borrow().iter() {
            artifacts.push(artifact.clone());
        }
    });
    
    // Sort by creation date (newest first)
    artifacts.sort_by(|a, b| b.created_at.cmp(&a.created_at));
    artifacts
}

#[query]
pub fn get_artifacts_by_status(status: ArtifactStatus) -> Vec<Artifact> {
    get_all_artifacts()
        .into_iter()
        .filter(|a| std::mem::discriminant(&a.status) == std::mem::discriminant(&status))
        .collect()
}

#[query]
pub fn get_artifacts_by_creator(creator: candid::Principal) -> Vec<Artifact> {
    get_all_artifacts()
        .into_iter()
        .filter(|a| a.creator == creator)
        .collect()
}

#[query]
pub fn search_artifacts(query: String) -> Vec<Artifact> {
    let query_lower = query.to_lowercase();
    get_all_artifacts()
        .into_iter()
        .filter(|a| {
            a.name.to_lowercase().contains(&query_lower) ||
            a.description.to_lowercase().contains(&query_lower) ||
            a.metadata.iter().any(|(key, value)| 
                key.to_lowercase().contains(&query_lower) ||
                value.to_lowercase().contains(&query_lower)
            )
        })
        .collect()
}
