use asl_backend::*;
use candid::{Decode, Encode, Principal};
use ic_cdk::api::time;

#[cfg(test)]
mod integration_tests {
    use super::*;

    #[tokio::test]
    async fn test_canister_initialization() {
        // Test that the canister initializes correctly
        init();
        
        // Verify initial state
        let stats = get_platform_stats().await;
        assert_eq!(stats.total_artifacts, 0);
        assert_eq!(stats.total_users, 0);
        assert_eq!(stats.total_communities, 0);
    }

    #[tokio::test]
    async fn test_user_registration() {
        init();
        
        let user_principal = Principal::from_text("rdmx6-jaaaa-aaaaa-aaadq-cai").unwrap();
        let username = "test_user".to_string();
        let bio = "Test user bio".to_string();
        let location = "Cairo, Egypt".to_string();
        
        let result = create_user_profile(username.clone(), bio.clone(), location.clone()).await;
        assert!(result.is_ok());
        
        let profile = get_user_profile(user_principal).await;
        assert!(profile.is_some());
        
        let user_profile = profile.unwrap();
        assert_eq!(user_profile.username, username);
        assert_eq!(user_profile.bio, bio);
        assert_eq!(user_profile.location, location);
    }

    #[tokio::test]
    async fn test_artifact_creation() {
        init();
        
        // First create a user
        let _user_result = create_user_profile(
            "artifact_creator".to_string(),
            "Artifact creator".to_string(),
            "Alexandria, Egypt".to_string()
        ).await;
        
        let artifact_data = ArtifactData {
            name: "Ancient Egyptian Vase".to_string(),
            description: "A beautiful ceramic vase from the New Kingdom period".to_string(),
            category: "Pottery".to_string(),
            period: "New Kingdom (1550-1077 BCE)".to_string(),
            location: "Valley of the Kings".to_string(),
            images: vec!["image1.jpg".to_string(), "image2.jpg".to_string()],
            metadata: std::collections::HashMap::new(),
        };
        
        let result = create_artifact(artifact_data.clone()).await;
        assert!(result.is_ok());
        
        let artifact_id = result.unwrap();
        let artifact = get_artifact(artifact_id).await;
        assert!(artifact.is_some());
        
        let retrieved_artifact = artifact.unwrap();
        assert_eq!(retrieved_artifact.name, artifact_data.name);
        assert_eq!(retrieved_artifact.description, artifact_data.description);
        assert_eq!(retrieved_artifact.category, artifact_data.category);
    }

    #[tokio::test]
    async fn test_community_operations() {
        init();
        
        // Create a user first
        let _user_result = create_user_profile(
            "community_admin".to_string(),
            "Community administrator".to_string(),
            "Cairo, Egypt".to_string()
        ).await;
        
        let community_data = CommunityData {
            name: "Ancient Egypt Enthusiasts".to_string(),
            description: "A community for people passionate about ancient Egyptian culture".to_string(),
            category: "Historical Research".to_string(),
            is_public: true,
        };
        
        let result = create_community(community_data.clone()).await;
        assert!(result.is_ok());
        
        let community_id = result.unwrap();
        let community = get_community(community_id).await;
        assert!(community.is_some());
        
        let retrieved_community = community.unwrap();
        assert_eq!(retrieved_community.name, community_data.name);
        assert_eq!(retrieved_community.description, community_data.description);
        assert_eq!(retrieved_community.is_public, community_data.is_public);
    }

    #[tokio::test]
    async fn test_voting_system() {
        init();
        
        // Create user and proposal
        let _user_result = create_user_profile(
            "voter".to_string(),
            "Test voter".to_string(),
            "Giza, Egypt".to_string()
        ).await;
        
        let proposal_data = ProposalData {
            title: "Upgrade Platform Features".to_string(),
            description: "Proposal to add new artifact analysis features".to_string(),
            proposal_type: ProposalType::FeatureRequest,
            voting_period_days: 7,
        };
        
        let result = create_proposal(proposal_data.clone()).await;
        assert!(result.is_ok());
        
        let proposal_id = result.unwrap();
        let vote_result = vote_on_proposal(proposal_id, VoteOption::Yes).await;
        assert!(vote_result.is_ok());
        
        let proposal = get_proposal(proposal_id).await;
        assert!(proposal.is_some());
        
        let retrieved_proposal = proposal.unwrap();
        assert_eq!(retrieved_proposal.yes_votes, 1);
        assert_eq!(retrieved_proposal.no_votes, 0);
    }

    #[tokio::test]
    async fn test_platform_stats() {
        init();
        
        // Create some test data
        let _user_result = create_user_profile(
            "stats_user".to_string(),
            "Statistics test user".to_string(),
            "Luxor, Egypt".to_string()
        ).await;
        
        let artifact_data = ArtifactData {
            name: "Test Artifact".to_string(),
            description: "Test artifact for statistics".to_string(),
            category: "Test".to_string(),
            period: "Test Period".to_string(),
            location: "Test Location".to_string(),
            images: vec![],
            metadata: std::collections::HashMap::new(),
        };
        
        let _artifact_result = create_artifact(artifact_data).await;
        
        let stats = get_platform_stats().await;
        assert!(stats.total_users >= 1);
        assert!(stats.total_artifacts >= 1);
    }
}
