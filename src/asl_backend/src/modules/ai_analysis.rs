use ic_cdk::{query, update};
use candid::CandidType;
use serde::{Deserialize, Serialize};
use crate::modules::types::*;
use crate::modules::storage::{AI_ANALYSES, get_next_id};
use crate::modules::auth::*;
use crate::modules::utils::*;
use crate::modules::audit::log_audit_event;
use crate::{ARTIFACTS, get_all_artifacts};

// ============================================================================
// AI-POWERED ARTIFACT ANALYSIS SYSTEM
// ============================================================================

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AIAnalysisResult {
    pub artifact_id: u64,
    pub confidence_score: f64, // 0.0 to 1.0
    pub predicted_period: Option<String>,
    pub predicted_culture: Option<String>,
    pub material_analysis: Vec<MaterialPrediction>,
    pub authenticity_indicators: Vec<AuthenticityMarker>,
    pub similar_artifacts: Vec<u64>, // IDs of similar artifacts
    pub risk_assessment: RiskLevel,
    pub analysis_timestamp: u64,
    pub ai_model_version: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct MaterialPrediction {
    pub material: String,
    pub confidence: f64,
    pub evidence_points: Vec<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AuthenticityMarker {
    pub marker_type: String,
    pub description: String,
    pub significance: f64, // 0.0 to 1.0
    pub location: Option<String>, // Where on the artifact
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum RiskLevel {
    VeryLow,
    Low,
    Medium,
    High,
    Critical,
}

#[update]
pub fn analyze_artifact_with_ai(artifact_id: u64) -> Result<AIAnalysisResult, String> {
    let caller = get_caller();
    
    // Only experts and institutions can request AI analysis
    if !is_expert_or_institution(caller) && !can_moderate(caller) {
        return Err("Only experts, institutions, or moderators can request AI analysis".to_string());
    }

    let artifact = ARTIFACTS.with(|artifacts| {
        artifacts.borrow().get(&artifact_id)
    });

    let artifact = match artifact {
        Some(artifact) => artifact,
        None => return Err("Artifact not found".to_string()),
    };

    // Simulate AI analysis (in real implementation, this would call external AI service)
    let analysis_result = perform_ai_analysis(&artifact);
    
    // Store analysis result
    AI_ANALYSES.with(|analyses| {
        analyses.borrow_mut().insert(artifact_id, analysis_result.clone());
    });

    log_audit_event(
        AuditEventType::ArtifactVerification,
        Some(artifact_id),
        format!("AI analysis completed with {}% confidence", (analysis_result.confidence_score * 100.0) as u32),
        AuditSeverity::Info
    );

    Ok(analysis_result)
}

fn perform_ai_analysis(artifact: &Artifact) -> AIAnalysisResult {
    // Simulated AI analysis based on artifact properties
    let confidence_score = calculate_confidence_score(artifact);
    
    AIAnalysisResult {
        artifact_id: artifact.id,
        confidence_score,
        predicted_period: Some("Late Bronze Age (1200-800 BCE)".to_string()),
        predicted_culture: Some("Egyptian".to_string()),
        material_analysis: vec![
            MaterialPrediction {
                material: "Limestone".to_string(),
                confidence: 0.85,
                evidence_points: vec![
                    "Crystalline structure matches limestone samples".to_string(),
                    "Weathering patterns consistent with limestone".to_string(),
                ],
            },
            MaterialPrediction {
                material: "Traces of ochre pigment".to_string(),
                confidence: 0.72,
                evidence_points: vec![
                    "Spectral analysis indicates iron oxide presence".to_string(),
                ],
            },
        ],
        authenticity_indicators: vec![
            AuthenticityMarker {
                marker_type: "Tool marks".to_string(),
                description: "Period-appropriate chisel marks detected".to_string(),
                significance: 0.78,
                location: Some("Base and side surfaces".to_string()),
            },
            AuthenticityMarker {
                marker_type: "Patina".to_string(),
                description: "Natural aging patina consistent with age".to_string(),
                significance: 0.82,
                location: Some("Entire surface".to_string()),
            },
        ],
        similar_artifacts: vec![], // Would be populated by similarity search
        risk_assessment: if confidence_score > 0.8 { RiskLevel::VeryLow } else { RiskLevel::Medium },
        analysis_timestamp: get_time(),
        ai_model_version: "Heritage-AI v2.1".to_string(),
    }
}

fn calculate_confidence_score(artifact: &Artifact) -> f64 {
    let mut score: f64 = 0.5; // Base score
    
    // Boost score based on available data
    if artifact.heritage_proof.is_some() { score += 0.1; }
    if artifact.dating_information.is_some() { score += 0.1; }
    if artifact.physical_properties.is_some() { score += 0.1; }
    if artifact.geographic_origin.is_some() { score += 0.1; }
    if !artifact.images.is_empty() { score += 0.1; }
    
    // Cap at 0.95 to maintain realistic confidence
    score.min(0.95)
}

#[query]
pub fn get_ai_analysis(artifact_id: u64) -> Result<AIAnalysisResult, String> {
    AI_ANALYSES.with(|analyses| {
        analyses.borrow().get(&artifact_id)
            .ok_or_else(|| "No AI analysis found for this artifact".to_string())
    })
}

#[query]
pub fn get_similar_artifacts(artifact_id: u64, limit: Option<usize>) -> Vec<Artifact> {
    let limit = limit.unwrap_or(10);
    
    // Simplified similarity search (in real implementation, use ML embeddings)
    let artifacts = get_all_artifacts();
    artifacts.into_iter()
        .filter(|a| a.id != artifact_id)
        .take(limit)
        .collect()
}

// ============================================================================
// BLOCKCHAIN VERIFICATION & PROVENANCE TRACKING
// ============================================================================

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ProvenanceChain {
    pub artifact_id: u64,
    pub chain_entries: Vec<ProvenanceEntry>,
    pub verification_hash: String,
    pub chain_integrity_score: f64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ProvenanceEntry {
    pub entry_id: u64,
    pub timestamp: u64,
    pub event_type: ProvenanceEventType,
    pub location: Option<String>,
    pub custodian: Option<String>,
    pub documentation: Vec<String>,
    pub digital_signature: String,
    pub previous_hash: Option<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum ProvenanceEventType {
    Discovery,
    Excavation,
    Acquisition,
    Transfer,
    Exhibition,
    Research,
    Conservation,
    DigitalRegistration,
}

#[update]
pub fn add_provenance_entry(
    artifact_id: u64,
    event_type: ProvenanceEventType,
    location: Option<String>,
    custodian: Option<String>,
    documentation: Vec<String>,
) -> Result<u64, String> {
    let caller = get_caller();
    
    if !can_submit_artifacts(caller) && !can_moderate(caller) {
        return Err("Insufficient permissions to add provenance entry".to_string());
    }

    let entry_id = get_next_id(10); // Provenance entry counter
    let timestamp = get_time();
    
    // Get artifact to add to its history
    let artifact_exists = ARTIFACTS.with(|artifacts| {
        artifacts.borrow().contains_key(&artifact_id)
    });

    if !artifact_exists {
        return Err("Artifact not found".to_string());
    }

    // Add to artifact history instead of separate provenance chain
    ARTIFACTS.with(|artifacts| {
        let mut artifacts = artifacts.borrow_mut();
        if let Some(mut artifact) = artifacts.get(&artifact_id) {
            let history_entry = HistoryEntry {
                id: entry_id,
                timestamp,
                action: format!("Provenance: {:?}", event_type),
                actor: caller,
                details: format!("Location: {:?}, Custodian: {:?}", location, custodian),
                evidence: if documentation.is_empty() { None } else { Some(documentation.join(", ")) },
                immutable_hash: create_hash(&format!("{:?}:{}:{}", event_type, timestamp, caller)),
            };
            artifact.history.push(history_entry);
            artifacts.insert(artifact_id, artifact);
        }
    });

    log_audit_event(
        AuditEventType::DataModification,
        Some(artifact_id),
        format!("Provenance entry added: {:?}", event_type),
        AuditSeverity::Info
    );

    Ok(entry_id)
}

#[query]
pub fn get_provenance_chain(artifact_id: u64) -> Result<Vec<HistoryEntry>, String> {
    ARTIFACTS.with(|artifacts| {
        artifacts.borrow().get(&artifact_id)
            .map(|artifact| artifact.history.clone())
            .ok_or_else(|| "Artifact not found".to_string())
    })
}

#[query]
pub fn verify_provenance_integrity(artifact_id: u64) -> Result<bool, String> {
    let history = get_provenance_chain(artifact_id)?;
    
    // Verify history integrity by checking if all entries are valid
    for entry in &history {
        let expected_hash = create_hash(&format!("{}:{}:{}", entry.action, entry.timestamp, entry.actor));
        if entry.immutable_hash != expected_hash {
            return Ok(false);
        }
    }
    
    Ok(true)
}
