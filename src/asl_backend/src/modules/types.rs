use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use std::collections::BTreeSet;

// ============================================================================
// CORE DATA STRUCTURES - Immutable Artifact Registry
// ============================================================================

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Artifact {
    pub id: u64,
    pub name: String,
    pub description: String,
    pub metadata: Vec<(String, String)>,
    pub images: Vec<String>,
    pub creator: Principal,
    pub created_at: u64,
    pub updated_at: u64,
    pub status: ArtifactStatus,
    pub heritage_proof: Option<String>,
    pub authenticity_score: u32,
    pub history: Vec<HistoryEntry>,
    pub verification_level: VerificationLevel,
    pub cultural_significance: CulturalSignificance,
    pub geographic_origin: Option<GeographicOrigin>,
    pub dating_information: Option<DatingInformation>,
    pub physical_properties: Option<PhysicalProperties>,
    pub conservation_status: ConservationStatus,
    pub digital_fingerprint: Option<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct HistoryEntry {
    pub id: u64,
    pub timestamp: u64,
    pub action: String,
    pub actor: Principal,
    pub details: String,
    pub evidence: Option<String>,
    pub immutable_hash: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum ArtifactStatus {
    PendingVerification,
    UnderReview,
    Verified,
    Disputed,
    Rejected,
    RequiresAdditionalEvidence,
    Archived,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum VerificationLevel {
    Unverified,
    BasicVerification,
    PeerReviewed,
    DaoVerified,
    ScientificallyValidated,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CulturalSignificance {
    pub historical_period: Option<String>,
    pub cultural_group: Option<String>,
    pub significance_level: SignificanceLevel,
    pub unesco_status: Option<String>,
    pub cultural_tags: Vec<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum SignificanceLevel {
    Local,
    Regional,
    National,
    International,
    WorldHeritage,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct GeographicOrigin {
    pub country: String,
    pub region: Option<String>,
    pub city: Option<String>,
    pub site_name: Option<String>,
    pub coordinates: Option<(f64, f64)>,
    pub discovery_context: Option<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct DatingInformation {
    pub estimated_age: Option<u64>,
    pub dating_method: Vec<String>,
    pub confidence_level: u32,
    pub date_range_start: Option<i64>,
    pub date_range_end: Option<i64>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PhysicalProperties {
    pub material: Vec<String>,
    pub dimensions: Option<(f64, f64, f64)>,
    pub weight: Option<f64>,
    pub color_description: Option<String>,
    pub condition: String,
    pub conservation_notes: Vec<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum ConservationStatus {
    Excellent,
    Good,
    Fair,
    Poor,
    Fragmented,
    Restored,
    RequiresImmediateConservation,
}

// ============================================================================
// USER SYSTEM
// ============================================================================

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct User {
    pub role: UserRole,
    pub reputation: u32,
    pub verified_at: Option<u64>,
    pub institution: Option<String>,
    pub specialization: Vec<String>,
    pub activity_stats: UserStats,
    pub verification_level: UserVerificationLevel,
    pub permissions: UserPermissions,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct InstitutionProfile {
    pub name: String,
    pub institution_type: InstitutionType,
    pub country: String,
    pub accreditation: Vec<String>,
    pub contact_information: ContactInfo,
    pub specializations: Vec<String>,
    pub unesco_affiliation: bool,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum InstitutionType {
    Museum,
    University,
    ResearchInstitute,
    CulturalHeritageOrganization,
    GovernmentAgency,
    ArchaeologicalSociety,
    PrivateCollection,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ExpertProfile {
    pub name: String,
    pub credentials: Vec<String>,
    pub specialization: Vec<String>,
    pub years_experience: u32,
    pub publications: Vec<String>,
    pub peer_endorsements: Vec<Principal>,
    pub research_areas: Vec<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ContactInfo {
    pub website: Option<String>,
    pub email_domain: Option<String>,
    pub address: Option<String>,
    pub phone: Option<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct UserStats {
    pub artifacts_submitted: u32,
    pub proposals_created: u32,
    pub votes_cast: u32,
    pub successful_verifications: u32,
    pub peer_ratings: Vec<u32>,
    pub last_activity: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum UserRole {
    Institution,
    Expert,
    Moderator,
    Community,
    Validator,
    Curator,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum UserVerificationLevel {
    Unverified,
    EmailVerified,
    InstitutionVerified,
    PeerVerified,
    FullyVerified,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct UserPermissions {
    pub can_submit_artifacts: bool,
    pub can_create_proposals: bool,
    pub can_vote: bool,
    pub can_verify_institutions: bool,
    pub can_moderate: bool,
    pub voting_weight: u32,
}

// ============================================================================
// DAO GOVERNANCE SYSTEM
// ============================================================================

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Proposal {
    pub id: u64,
    pub proposal_type: ProposalType,
    pub artifact_id: Option<u64>,
    pub proposer: Principal,
    pub title: String,
    pub description: String,
    pub evidence: Vec<String>,
    pub created_at: u64,
    pub voting_deadline: u64,
    pub execution_deadline: Option<u64>,
    pub quorum_required: u32,
    pub status: ProposalStatus,
    pub voting_results: VotingResults,
    pub execution_payload: Option<String>,
    pub discussion_thread: Vec<Comment>,
    pub required_expertise: Vec<String>,
    pub urgency_level: UrgencyLevel,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct VotingResults {
    pub total_votes: u32,
    pub votes_for: u32,
    pub votes_against: u32,
    pub abstentions: u32,
    pub weighted_score: f64,
    pub voter_principals: BTreeSet<Principal>,
    pub expert_consensus: Option<ExpertConsensus>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ExpertConsensus {
    pub expert_votes_for: u32,
    pub expert_votes_against: u32,
    pub expert_confidence: f64,
    pub peer_review_score: f64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Vote {
    pub id: u64,
    pub proposal_id: u64,
    pub voter: Principal,
    pub vote_type: VoteType,
    pub weight: u32,
    pub timestamp: u64,
    pub rationale: Option<String>,
    pub expertise_relevance: u32,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum VoteType {
    For,
    Against,
    Abstain,
    RequiresMoreEvidence,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Comment {
    pub id: u64,
    pub author: Principal,
    pub content: String,
    pub timestamp: u64,
    pub reply_to: Option<u64>,
    pub endorsements: u32,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum ProposalType {
    VerifyArtifact,
    DisputeArtifact,
    UpdateArtifactStatus,
    GrantUserRole,
    RevokeUserRole,
    UpdateArtifactMetadata,
    RequestAdditionalEvidence,
    ProposeConservationAction,
    RequestExpertReview,
    UpdateVerificationCriteria,
    EmergencyIntervention,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum ProposalStatus {
    Draft,
    Active,
    UnderReview,
    Passed,
    Rejected,
    Executed,
    FailedExecution,
    Expired,
    Withdrawn,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum UrgencyLevel {
    Low,
    Normal,
    High,
    Emergency,
}

// ============================================================================
// NFT SYSTEM
// ============================================================================

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ProofOfHeritageNFT {
    pub id: u64,
    pub artifact_id: u64,
    pub owner: Principal,
    pub created_at: u64,
    pub metadata: Vec<(String, String)>,
    pub is_transferable: bool,
    pub verification_hash: String,
    pub issuing_authority: Principal,
    pub heritage_certificate: HeritageCertificate,
    pub access_rights: AccessRights,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct HeritageCertificate {
    pub certificate_number: String,
    pub issuer_name: String,
    pub verification_date: u64,
    pub authenticity_guarantees: Vec<String>,
    pub scientific_analysis: Vec<String>,
    pub expert_endorsements: Vec<ExpertEndorsement>,
    pub digital_signature: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ExpertEndorsement {
    pub expert_principal: Principal,
    pub expert_name: String,
    pub institution: String,
    pub expertise_areas: Vec<String>,
    pub endorsement_date: u64,
    pub confidence_level: u32,
    pub notes: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AccessRights {
    pub can_view_detailed_metadata: bool,
    pub can_request_high_res_images: bool,
    pub can_access_research_data: bool,
    pub can_propose_studies: bool,
    pub special_permissions: Vec<String>,
}

// ============================================================================
// AUDIT SYSTEM
// ============================================================================

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AuditEntry {
    pub id: u64,
    pub timestamp: u64,
    pub event_type: AuditEventType,
    pub actor: Principal,
    pub target_id: Option<u64>,
    pub details: String,
    pub data_hash: String,
    pub severity: AuditSeverity,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum AuditEventType {
    UserRegistration,
    UserVerification,
    ArtifactSubmission,
    ArtifactVerification,
    ProposalCreation,
    VoteCast,
    NftIssued,
    DataModification,
    AccessGranted,
    SecurityEvent,
    SystemMaintenance,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum AuditSeverity {
    Info,
    Warning,
    Critical,
    SecurityAlert,
}

// ============================================================================
// REQUEST/RESPONSE STRUCTURES
// ============================================================================

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CreateArtifactRequest {
    pub name: String,
    pub description: String,
    pub metadata: Vec<(String, String)>,
    pub images: Vec<String>,
    pub heritage_proof: Option<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CreateProposalRequest {
    pub proposal_type: ProposalType,
    pub artifact_id: Option<u64>,
    pub title: String,
    pub description: String,
    pub evidence: Option<Vec<String>>,
    pub voting_duration_hours: u64,
    pub execution_payload: Option<String>,
    pub required_expertise: Option<Vec<String>>,
    pub urgency_level: Option<UrgencyLevel>,
    pub quorum_required: Option<u32>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct RegisterUserRequest {
    pub role: UserRole,
    pub institution_profile: Option<InstitutionProfile>,
    pub expert_profile: Option<ExpertProfile>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct VoteRequest {
    pub proposal_id: u64,
    pub vote_type: VoteType,
    pub rationale: Option<String>,
    pub expertise_relevance: Option<u32>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ProposalResponse {
    pub id: u64,
    pub status: ProposalStatus,
    pub title: String,
    pub voting_deadline: u64,
    pub artifact_id: Option<u64>,
    pub description: String,
    pub voters: Vec<Principal>,
    pub created_at: u64,
    pub proposer: Principal,
    pub votes_for: u32,
    pub execution_payload: Option<String>,
    pub proposal_type: ProposalType,
    pub votes_against: u32,
}
