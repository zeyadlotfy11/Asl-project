use candid::{Encode, Decode, Principal};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap, Storable};
use std::borrow::Cow;
use std::cell::RefCell;

use crate::modules::types::*;
use crate::modules::ai_analysis::{AIAnalysisResult};
// Commented out disabled modules
// use crate::modules::collaboration::{CollaborationRoom, Message, VirtualEvent};
// use crate::modules::analytics::{AnalyticsReport, PatternAnalysis};
// use crate::modules::gamification::{EnhancedNFT, UserProgress, Quest};

// ============================================================================
// STORAGE TYPE DEFINITIONS
// ============================================================================

pub type Memory = VirtualMemory<DefaultMemoryImpl>;
pub type IdStore = StableBTreeMap<u64, u64, Memory>;
pub type ArtifactStore = StableBTreeMap<u64, Artifact, Memory>;
pub type NFTStore = StableBTreeMap<u64, ProofOfHeritageNFT, Memory>;
pub type ProposalStore = StableBTreeMap<u64, Proposal, Memory>;
pub type UserStore = StableBTreeMap<Principal, User, Memory>;
pub type VoteStore = StableBTreeMap<u64, Vote, Memory>;
pub type AuditLogStore = StableBTreeMap<u64, AuditEntry, Memory>;

// New amazing features storage
pub type AIAnalysisStore = StableBTreeMap<u64, AIAnalysisResult, Memory>;
// Commented out disabled module storage types
// pub type CollaborationRoomStore = StableBTreeMap<u64, CollaborationRoom, Memory>;
// pub type MessageStore = StableBTreeMap<u64, Message, Memory>;
// pub type VirtualEventStore = StableBTreeMap<u64, VirtualEvent, Memory>;
// pub type AnalyticsReportStore = StableBTreeMap<u64, AnalyticsReport, Memory>;
// pub type PatternAnalysisStore = StableBTreeMap<u64, PatternAnalysis, Memory>;
// pub type EnhancedNFTStore = StableBTreeMap<u64, EnhancedNFT, Memory>;
// pub type UserProgressStore = StableBTreeMap<Principal, UserProgress, Memory>;
// pub type QuestStore = StableBTreeMap<u64, Quest, Memory>;

// ============================================================================
// STORABLE IMPLEMENTATIONS
// ============================================================================

impl Storable for Artifact {
    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;

    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        match Decode!(bytes.as_ref(), Self) {
            Ok(artifact) => artifact,
            Err(_) => {
                // Default artifact for legacy compatibility
                Self {
                    id: 0,
                    name: "Legacy Artifact".to_string(),
                    description: "This artifact was created with an older format".to_string(),
                    metadata: vec![],
                    images: vec![],
                    creator: Principal::anonymous(),
                    created_at: 0,
                    updated_at: 0,
                    status: ArtifactStatus::PendingVerification,
                    heritage_proof: None,
                    authenticity_score: 0,
                    history: vec![],
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
                    digital_fingerprint: None,
                }
            }
        }
    }
}

impl Storable for ProofOfHeritageNFT {
    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;

    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

impl Storable for Proposal {
    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;

    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

impl Storable for User {
    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;

    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

impl Storable for Vote {
    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;

    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

impl Storable for AuditEntry {
    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;

    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

// ============================================================================
// GLOBAL STATE MANAGEMENT
// ============================================================================

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );

    static ID_COUNTER: RefCell<IdStore> = RefCell::new(
        IdStore::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
        )
    );

    pub static ARTIFACTS: RefCell<ArtifactStore> = RefCell::new(
        ArtifactStore::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1))),
        )
    );

    pub static NFTS: RefCell<NFTStore> = RefCell::new(
        NFTStore::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(2))),
        )
    );

    pub static PROPOSALS: RefCell<ProposalStore> = RefCell::new(
        ProposalStore::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(3))),
        )
    );

    pub static USERS: RefCell<UserStore> = RefCell::new(
        UserStore::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(4))),
        )
    );

    pub static VOTES: RefCell<VoteStore> = RefCell::new(
        VoteStore::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(5))),
        )
    );

    pub static AUDIT_LOG: RefCell<AuditLogStore> = RefCell::new(
        AuditLogStore::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(6))),
        )
    );

    // ============================================================================
    // NEW AMAZING FEATURES STORAGE
    // ============================================================================

    pub static AI_ANALYSES: RefCell<AIAnalysisStore> = RefCell::new(
        AIAnalysisStore::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(7))),
        )
    );

    // Commented out disabled module storage initialization
    // pub static COLLABORATION_ROOMS: RefCell<CollaborationRoomStore> = RefCell::new(
    //     CollaborationRoomStore::init(
    //         MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(8))),
    //     )
    // );

    // pub static MESSAGES: RefCell<MessageStore> = RefCell::new(
    //     MessageStore::init(
    //         MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(9))),
    //     )
    // );

    // pub static VIRTUAL_EVENTS: RefCell<VirtualEventStore> = RefCell::new(
    //     VirtualEventStore::init(
    //         MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(10))),
    //     )
    // );

    // pub static ANALYTICS_REPORTS: RefCell<AnalyticsReportStore> = RefCell::new(
    //     AnalyticsReportStore::init(
    //         MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(11))),
    //     )
    // );

    // pub static PATTERN_ANALYSES: RefCell<PatternAnalysisStore> = RefCell::new(
    //     PatternAnalysisStore::init(
    //         MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(12))),
    //     )
    // );

    // pub static ENHANCED_NFTS: RefCell<EnhancedNFTStore> = RefCell::new(
    //     EnhancedNFTStore::init(
    //         MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(13))),
    //     )
    // );

    // pub static USER_PROGRESS: RefCell<UserProgressStore> = RefCell::new(
    //     UserProgressStore::init(
    //         MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(14))),
    //     )
    // );

    // pub static QUESTS: RefCell<QuestStore> = RefCell::new(
    //     QuestStore::init(
    //         MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(15))),
    //     )
    // );
}

// ============================================================================
// ID MANAGEMENT
// ============================================================================

pub fn get_next_id(counter_key: u64) -> u64 {
    ID_COUNTER.with(|counter| {
        let mut counter = counter.borrow_mut();
        let current_id = counter.get(&counter_key).unwrap_or(0);
        let next_id = current_id + 1;
        counter.insert(counter_key, next_id);
        next_id
    })
}

// ============================================================================
// STORABLE IMPLEMENTATIONS FOR NEW FEATURES
// ============================================================================

impl Storable for AIAnalysisResult {
    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;

    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

// Commented out Storable implementations for disabled modules
// impl Storable for CollaborationRoom {
//     const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;
// 
//     fn to_bytes(&self) -> Cow<[u8]> {
//         Cow::Owned(Encode!(self).unwrap())
//     }
// 
//     fn from_bytes(bytes: Cow<[u8]>) -> Self {
//         Decode!(bytes.as_ref(), Self).unwrap()
//     }
// }

// impl Storable for Message {
//     const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;
// 
//     fn to_bytes(&self) -> Cow<[u8]> {
//         Cow::Owned(Encode!(self).unwrap())
//     }
// 
//     fn from_bytes(bytes: Cow<[u8]>) -> Self {
//         Decode!(bytes.as_ref(), Self).unwrap()
//     }
// }

// impl Storable for VirtualEvent {
//     const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;
// 
//     fn to_bytes(&self) -> Cow<[u8]> {
//         Cow::Owned(Encode!(self).unwrap())
//     }
// 
//     fn from_bytes(bytes: Cow<[u8]>) -> Self {
//         Decode!(bytes.as_ref(), Self).unwrap()
//     }
// }

// impl Storable for AnalyticsReport {
//     const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;
// 
//     fn to_bytes(&self) -> Cow<[u8]> {
//         Cow::Owned(Encode!(self).unwrap())
//     }
// 
//     fn from_bytes(bytes: Cow<[u8]>) -> Self {
//         Decode!(bytes.as_ref(), Self).unwrap()
//     }
// }

// impl Storable for PatternAnalysis {
//     const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;
// 
//     fn to_bytes(&self) -> Cow<[u8]> {
//         Cow::Owned(Encode!(self).unwrap())
//     }
// 
//     fn from_bytes(bytes: Cow<[u8]>) -> Self {
//         Decode!(bytes.as_ref(), Self).unwrap()
//     }
// }

// impl Storable for EnhancedNFT {
//     const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;
// 
//     fn to_bytes(&self) -> Cow<[u8]> {
//         Cow::Owned(Encode!(self).unwrap())
//     }
// 
//     fn from_bytes(bytes: Cow<[u8]>) -> Self {
//         Decode!(bytes.as_ref(), Self).unwrap()
//     }
// }

// impl Storable for UserProgress {
//     const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;
// 
//     fn to_bytes(&self) -> Cow<[u8]> {
//         Cow::Owned(Encode!(self).unwrap())
//     }
// 
//     fn from_bytes(bytes: Cow<[u8]>) -> Self {
//         Decode!(bytes.as_ref(), Self).unwrap()
//     }
// }

// impl Storable for Quest {
//     const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;
// 
//     fn to_bytes(&self) -> Cow<[u8]> {
//         Cow::Owned(Encode!(self).unwrap())
//     }
// 
//     fn from_bytes(bytes: Cow<[u8]>) -> Self {
//         Decode!(bytes.as_ref(), Self).unwrap()
//     }
// }
