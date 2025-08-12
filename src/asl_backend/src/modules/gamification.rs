use ic_cdk::{query, update};
use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use crate::modules::types::*;
use crate::modules::storage::{ENHANCED_NFTS, USER_PROGRESS, QUESTS, ARTIFACTS, get_next_id};
use crate::modules::auth::*;
use crate::modules::utils::*;
use crate::modules::audit::log_audit_event;
use std::collections::HashMap;

// ============================================================================
// ENHANCED NFT SYSTEM
// ============================================================================

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EnhancedNFT {
    pub token_id: u64,
    pub artifact_id: u64,
    pub owner: Principal,
    pub creator: Principal,
    pub metadata: NFTMetadata,
    pub properties: NFTProperties,
    pub trading_history: Vec<TradingRecord>,
    pub royalties: RoyaltyInfo,
    pub licensing: LicensingInfo,
    pub created_at: u64,
    pub last_updated: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct NFTMetadata {
    pub name: String,
    pub description: String,
    pub image_url: String,
    pub animation_url: Option<String>,
    pub external_url: Option<String>,
    pub attributes: Vec<NFTAttribute>,
    pub collection_info: Option<CollectionInfo>,
    pub rarity_score: f64,
    pub edition_info: EditionInfo,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct NFTAttribute {
    pub trait_type: String,
    pub value: String,
    pub display_type: Option<String>,
    pub rarity_percentage: Option<f64>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CollectionInfo {
    pub collection_id: u64,
    pub collection_name: String,
    pub curator: Principal,
    pub theme: String,
    pub total_supply: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EditionInfo {
    pub edition_number: u64,
    pub total_editions: u64,
    pub edition_type: EditionType,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum EditionType {
    Original,
    LimitedEdition,
    SpecialEdition,
    Commemorative,
    Artist,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct NFTProperties {
    pub is_transferable: bool,
    pub is_burnable: bool,
    pub has_utility: bool,
    pub access_rights: Vec<AccessRight>,
    pub special_features: Vec<SpecialFeature>,
    pub interactive_elements: Vec<InteractiveElement>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum AccessRight {
    VirtualExhibition,
    HighResolutionImages,
    ExpertConsultation,
    ConservationReports,
    ProvenanceDocuments,
    EducationalContent,
    ExclusiveEvents,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum SpecialFeature {
    ARViewer,
    VRExperience,
    ThreeDModel,
    TimeLapse,
    XRayImages,
    UVLightImages,
    MicroscopicDetails,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct InteractiveElement {
    pub element_type: String,
    pub description: String,
    pub unlock_condition: String,
    pub reward: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct TradingRecord {
    pub from: Principal,
    pub to: Principal,
    pub price: Option<u64>,
    pub currency: String,
    pub timestamp: u64,
    pub transaction_hash: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct RoyaltyInfo {
    pub creator_percentage: f64,
    pub institution_percentage: f64,
    pub platform_percentage: f64,
    pub total_royalties_collected: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct LicensingInfo {
    pub license_type: LicenseType,
    pub commercial_use: bool,
    pub modification_allowed: bool,
    pub attribution_required: bool,
    pub redistribution_allowed: bool,
    pub expiry_date: Option<u64>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum LicenseType {
    CC0,
    CCBY,
    CCBYSA,
    CCBYNC,
    CCBYNCSA,
    AllRightsReserved,
    Custom(String),
}

// ============================================================================
// GAMIFICATION SYSTEM
// ============================================================================

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct UserProgress {
    pub user_id: Principal,
    pub level: u32,
    pub experience_points: u64,
    pub total_points_earned: u64,
    pub achievements: Vec<Achievement>,
    pub badges: Vec<Badge>,
    pub streaks: HashMap<String, StreakInfo>,
    pub leaderboard_rank: Option<u32>,
    pub seasonal_progress: SeasonalProgress,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Achievement {
    pub achievement_id: u64,
    pub title: String,
    pub description: String,
    pub category: AchievementCategory,
    pub difficulty: AchievementDifficulty,
    pub unlocked_at: u64,
    pub progress: f64,
    pub total_required: f64,
    pub rewards: Vec<Reward>,
    pub is_hidden: bool,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum AchievementCategory {
    Discovery,
    Contribution,
    Social,
    Learning,
    Collection,
    Trading,
    Conservation,
    Research,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum AchievementDifficulty {
    Bronze,
    Silver,
    Gold,
    Platinum,
    Diamond,
    Legendary,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Badge {
    pub badge_id: u64,
    pub name: String,
    pub description: String,
    pub icon_url: String,
    pub rarity: BadgeRarity,
    pub earned_at: u64,
    pub issuer: Principal,
    pub verification_proof: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum BadgeRarity {
    Common,
    Uncommon,
    Rare,
    Epic,
    Legendary,
    Mythic,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct StreakInfo {
    pub current_streak: u32,
    pub longest_streak: u32,
    pub last_activity: u64,
    pub streak_multiplier: f64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct SeasonalProgress {
    pub season_id: u64,
    pub season_points: u64,
    pub season_rank: Option<u32>,
    pub completed_challenges: Vec<u64>,
    pub seasonal_rewards: Vec<Reward>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Reward {
    pub reward_type: RewardType,
    pub amount: u64,
    pub description: String,
    pub claimed: bool,
    pub expires_at: Option<u64>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum RewardType {
    ExperiencePoints,
    PlatformTokens,
    NFTDrop,
    SpecialAccess,
    DiscountCode,
    PhysicalMerchandise,
    ExclusiveContent,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Quest {
    pub quest_id: u64,
    pub title: String,
    pub description: String,
    pub objectives: Vec<QuestObjective>,
    pub rewards: Vec<Reward>,
    pub start_date: u64,
    pub end_date: u64,
    pub participants: Vec<Principal>,
    pub completed_by: Vec<Principal>,
    pub quest_type: QuestType,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct QuestObjective {
    pub objective_id: u64,
    pub description: String,
    pub target_value: u64,
    pub current_progress: HashMap<Principal, u64>,
    pub completion_criteria: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum QuestType {
    Daily,
    Weekly,
    Monthly,
    Seasonal,
    Special,
    Community,
    Educational,
}

#[update]
pub fn mint_enhanced_nft(
    artifact_id: u64,
    metadata: NFTMetadata,
    properties: NFTProperties,
    royalties: RoyaltyInfo,
    licensing: LicensingInfo,
) -> Result<u64, String> {
    let caller = get_caller();
    
    // Verify artifact exists and caller has permission
    let artifact_exists = ARTIFACTS.with(|artifacts| {
        artifacts.borrow().get(&artifact_id).is_some()
    });

    if !artifact_exists {
        return Err("Artifact not found".to_string());
    }

    // Check if caller is authorized to mint NFT for this artifact
    if !is_expert_or_institution(caller) && !can_moderate(caller) {
        return Err("Only experts, institutions, or moderators can mint NFTs".to_string());
    }

    let token_id = get_next_id(15); // NFT counter
    let now = get_time();

    let nft = EnhancedNFT {
        token_id,
        artifact_id,
        owner: caller,
        creator: caller,
        metadata,
        properties,
        trading_history: Vec::new(),
        royalties,
        licensing,
        created_at: now,
        last_updated: now,
    };

    ENHANCED_NFTS.with(|nfts| {
        nfts.borrow_mut().insert(token_id, nft);
    });

    // Award achievement for NFT creation
    award_achievement(caller, "NFT Creator".to_string(), 1.0);

    log_audit_event(
        AuditEventType::NftIssued,
        Some(token_id),
        format!("Enhanced NFT minted for artifact {}", artifact_id),
        AuditSeverity::Info
    );

    Ok(token_id)
}

#[update]
pub fn award_achievement(user: Principal, achievement_title: String, progress: f64) -> Result<String, String> {
    let achievement_id = get_next_id(16); // Achievement counter
    let now = get_time();

    // Define achievement rewards based on title
    let rewards = match achievement_title.as_str() {
        "NFT Creator" => vec![
            Reward {
                reward_type: RewardType::ExperiencePoints,
                amount: 100,
                description: "XP for creating your first NFT".to_string(),
                claimed: false,
                expires_at: None,
            }
        ],
        "Expert Contributor" => vec![
            Reward {
                reward_type: RewardType::ExperiencePoints,
                amount: 250,
                description: "XP for expert contributions".to_string(),
                claimed: false,
                expires_at: None,
            }
        ],
        _ => vec![
            Reward {
                reward_type: RewardType::ExperiencePoints,
                amount: 50,
                description: "General achievement reward".to_string(),
                claimed: false,
                expires_at: None,
            }
        ],
    };

    let achievement = Achievement {
        achievement_id,
        title: achievement_title.clone(),
        description: format!("Achievement: {}", achievement_title),
        category: AchievementCategory::Contribution,
        difficulty: AchievementDifficulty::Bronze,
        unlocked_at: now,
        progress,
        total_required: 1.0,
        rewards,
        is_hidden: false,
    };

    // Update user progress
    USER_PROGRESS.with(|progress_store| {
        let mut progress_store = progress_store.borrow_mut();
        let mut user_progress = progress_store.get(&user).unwrap_or_else(|| UserProgress {
            user_id: user,
            level: 1,
            experience_points: 0,
            total_points_earned: 0,
            achievements: Vec::new(),
            badges: Vec::new(),
            streaks: HashMap::new(),
            leaderboard_rank: None,
            seasonal_progress: SeasonalProgress {
                season_id: 1,
                season_points: 0,
                season_rank: None,
                completed_challenges: Vec::new(),
                seasonal_rewards: Vec::new(),
            },
        });

        user_progress.achievements.push(achievement);
        user_progress.experience_points += 100; // Base XP for achievement
        user_progress.total_points_earned += 100;

        // Level up check
        let new_level = calculate_level(user_progress.experience_points);
        if new_level > user_progress.level {
            user_progress.level = new_level;
        }

        progress_store.insert(user, user_progress);
    });

    Ok(format!("Achievement '{}' awarded to user", achievement_title))
}

fn calculate_level(experience_points: u64) -> u32 {
    // Simple level calculation: every 1000 XP = 1 level
    ((experience_points / 1000) + 1) as u32
}

#[update]
pub fn create_quest(
    title: String,
    description: String,
    objectives: Vec<QuestObjective>,
    rewards: Vec<Reward>,
    duration_days: u64,
    quest_type: QuestType,
) -> Result<u64, String> {
    let caller = get_caller();
    
    if !can_moderate(caller) {
        return Err("Only moderators can create quests".to_string());
    }

    let quest_id = get_next_id(17); // Quest counter
    let now = get_time();
    let duration_ns = duration_days * 24 * 60 * 60 * 1000_000_000; // Convert days to nanoseconds

    let quest = Quest {
        quest_id,
        title: title.clone(),
        description,
        objectives,
        rewards,
        start_date: now,
        end_date: now + duration_ns,
        participants: Vec::new(),
        completed_by: Vec::new(),
        quest_type,
    };

    QUESTS.with(|quests| {
        quests.borrow_mut().insert(quest_id, quest);
    });

    log_audit_event(
        AuditEventType::SystemMaintenance,
        Some(quest_id),
        format!("Quest '{}' created", title),
        AuditSeverity::Info
    );

    Ok(quest_id)
}

#[update]
pub fn join_quest(quest_id: u64) -> Result<String, String> {
    let caller = get_caller();
    
    QUESTS.with(|quests| {
        let mut quests = quests.borrow_mut();
        if let Some(mut quest) = quests.get(&quest_id) {
            if !quest.participants.contains(&caller) {
                quest.participants.push(caller);
                quests.insert(quest_id, quest);
                Ok("Successfully joined quest".to_string())
            } else {
                Ok("Already participating in this quest".to_string())
            }
        } else {
            Err("Quest not found".to_string())
        }
    })
}

#[query]
pub fn get_user_progress(user: Principal) -> Option<UserProgress> {
    USER_PROGRESS.with(|progress| {
        progress.borrow().get(&user)
    })
}

#[query]
pub fn get_leaderboard(limit: usize) -> Vec<(Principal, u64)> {
    let mut user_scores = Vec::new();
    
    USER_PROGRESS.with(|progress| {
        for (user, progress) in progress.borrow().iter() {
            user_scores.push((user, progress.total_points_earned));
        }
    });
    
    // Sort by points (highest first)
    user_scores.sort_by(|a, b| b.1.cmp(&a.1));
    user_scores.truncate(limit);
    user_scores
}

#[query]
pub fn get_active_quests() -> Vec<Quest> {
    let current_time = get_time();
    let mut quests = Vec::new();
    
    QUESTS.with(|quest_store| {
        for (_, quest) in quest_store.borrow().iter() {
            if quest.start_date <= current_time && quest.end_date > current_time {
                quests.push(quest.clone());
            }
        }
    });
    
    quests
}

#[query]
pub fn get_enhanced_nft(token_id: u64) -> Option<EnhancedNFT> {
    ENHANCED_NFTS.with(|nfts| {
        nfts.borrow().get(&token_id)
    })
}

#[query]
pub fn get_user_nfts(user: Principal) -> Vec<EnhancedNFT> {
    let mut user_nfts = Vec::new();
    
    ENHANCED_NFTS.with(|nfts| {
        for (_, nft) in nfts.borrow().iter() {
            if nft.owner == user {
                user_nfts.push(nft.clone());
            }
        }
    });
    
    user_nfts
}
