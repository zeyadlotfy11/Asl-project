use asl_backend::*;
use candid::Principal;

#[cfg(test)]
mod module_tests {
    use super::*;

    mod artifacts_tests {
        use super::*;

        #[test]
        fn test_artifact_creation_validation() {
            let valid_artifact = ArtifactData {
                name: "Tutankhamun's Mask".to_string(),
                description: "The famous golden burial mask of Tutankhamun".to_string(),
                category: "Royal Artifacts".to_string(),
                period: "New Kingdom, 18th Dynasty".to_string(),
                location: "Valley of the Kings, Tomb KV62".to_string(),
                images: vec!["mask_front.jpg".to_string(), "mask_side.jpg".to_string()],
                metadata: {
                    let mut meta = std::collections::HashMap::new();
                    meta.insert("material".to_string(), "Gold, lapis lazuli, carnelian".to_string());
                    meta.insert("weight".to_string(), "10.23 kg".to_string());
                    meta
                },
            };

            assert!(validate_artifact_data(&valid_artifact));
        }

        #[test]
        fn test_artifact_search_keywords() {
            let artifact = ArtifactData {
                name: "Rosetta Stone".to_string(),
                description: "Ancient Egyptian granodiorite stele with decree in three scripts".to_string(),
                category: "Inscriptions".to_string(),
                period: "Ptolemaic Period".to_string(),
                location: "Rosetta (Rashid)".to_string(),
                images: vec!["rosetta_stone.jpg".to_string()],
                metadata: std::collections::HashMap::new(),
            };

            let keywords = extract_search_keywords(&artifact);
            assert!(keywords.contains(&"rosetta".to_string()));
            assert!(keywords.contains(&"stone".to_string()));
            assert!(keywords.contains(&"egyptian".to_string()));
            assert!(keywords.contains(&"ptolemaic".to_string()));
        }
    }

    mod community_tests {
        use super::*;

        #[test]
        fn test_community_member_management() {
            let mut community = Community {
                id: "community_1".to_string(),
                name: "Egyptology Researchers".to_string(),
                description: "Community for professional Egyptologists".to_string(),
                creator: Principal::from_text("rdmx6-jaaaa-aaaaa-aaadq-cai").unwrap(),
                members: vec![],
                moderators: vec![],
                created_at: 0,
                category: "Research".to_string(),
                is_public: true,
                member_count: 0,
                post_count: 0,
            };

            let member_principal = Principal::from_text("rrkah-fqaaa-aaaaa-aaaaq-cai").unwrap();
            
            // Test adding member
            add_community_member(&mut community, member_principal);
            assert_eq!(community.members.len(), 1);
            assert_eq!(community.member_count, 1);
            assert!(community.members.contains(&member_principal));

            // Test removing member
            remove_community_member(&mut community, member_principal);
            assert_eq!(community.members.len(), 0);
            assert_eq!(community.member_count, 0);
            assert!(!community.members.contains(&member_principal));
        }

        #[test]
        fn test_community_post_validation() {
            let valid_post = CommunityPostData {
                title: "New Discovery in Saqqara".to_string(),
                content: "Archaeologists have discovered a new tomb in the Saqqara necropolis...".to_string(),
                tags: vec!["archaeology".to_string(), "saqqara".to_string(), "discovery".to_string()],
                images: vec!["discovery_1.jpg".to_string()],
            };

            assert!(validate_community_post(&valid_post));

            let invalid_post = CommunityPostData {
                title: "".to_string(), // Empty title
                content: "Valid content".to_string(),
                tags: vec![],
                images: vec![],
            };

            assert!(!validate_community_post(&invalid_post));
        }
    }

    mod dao_tests {
        use super::*;

        #[test]
        fn test_proposal_voting_logic() {
            let mut proposal = Proposal {
                id: "proposal_1".to_string(),
                title: "Implement AI Analysis".to_string(),
                description: "Add AI-powered artifact analysis features".to_string(),
                creator: Principal::from_text("rdmx6-jaaaa-aaaaa-aaadq-cai").unwrap(),
                proposal_type: ProposalType::FeatureRequest,
                yes_votes: 0,
                no_votes: 0,
                voters: vec![],
                created_at: 0,
                voting_ends_at: 604800000000000, // 1 week
                status: ProposalStatus::Active,
                execution_payload: None,
            };

            let voter = Principal::from_text("rrkah-fqaaa-aaaaa-aaaaq-cai").unwrap();

            // Test voting
            let vote_result = cast_vote(&mut proposal, voter, VoteOption::Yes);
            assert!(vote_result.is_ok());
            assert_eq!(proposal.yes_votes, 1);
            assert_eq!(proposal.no_votes, 0);
            assert!(proposal.voters.contains(&voter));

            // Test duplicate voting prevention
            let duplicate_vote_result = cast_vote(&mut proposal, voter, VoteOption::No);
            assert!(duplicate_vote_result.is_err());
            assert_eq!(proposal.yes_votes, 1); // Should remain unchanged
            assert_eq!(proposal.no_votes, 0);
        }

        #[test]
        fn test_proposal_execution_threshold() {
            let proposal = Proposal {
                id: "proposal_2".to_string(),
                title: "Platform Upgrade".to_string(),
                description: "Upgrade platform infrastructure".to_string(),
                creator: Principal::from_text("rdmx6-jaaaa-aaaaa-aaadq-cai").unwrap(),
                proposal_type: ProposalType::PlatformUpgrade,
                yes_votes: 75,
                no_votes: 25,
                voters: vec![],
                created_at: 0,
                voting_ends_at: 0, // Voting period ended
                status: ProposalStatus::Active,
                execution_payload: None,
            };

            assert!(should_execute_proposal(&proposal, 100)); // 75% yes votes, should execute
            
            let failing_proposal = Proposal {
                yes_votes: 40,
                no_votes: 60,
                ..proposal
            };

            assert!(!should_execute_proposal(&failing_proposal, 100)); // 40% yes votes, should not execute
        }
    }

    mod auth_tests {
        use super::*;

        #[test]
        fn test_user_permission_validation() {
            let admin_principal = Principal::from_text("rdmx6-jaaaa-aaaaa-aaadq-cai").unwrap();
            let user_principal = Principal::from_text("rrkah-fqaaa-aaaaa-aaaaq-cai").unwrap();

            // Test admin permissions
            assert!(has_admin_permission(admin_principal));
            assert!(can_moderate_community(admin_principal, "any_community"));
            assert!(can_create_proposal(admin_principal));

            // Test regular user permissions
            assert!(!has_admin_permission(user_principal));
            assert!(can_create_artifact(user_principal));
            assert!(can_vote_on_proposal(user_principal));
        }

        #[test]
        fn test_rate_limiting() {
            let user_principal = Principal::from_text("rrkah-fqaaa-aaaaa-aaaaq-cai").unwrap();
            
            // First action should be allowed
            assert!(check_rate_limit(user_principal, ActionType::CreateArtifact));
            
            // Simulate rapid consecutive actions
            for _ in 0..5 {
                update_rate_limit(user_principal, ActionType::CreateArtifact);
            }
            
            // Should be rate limited after multiple actions
            assert!(!check_rate_limit(user_principal, ActionType::CreateArtifact));
        }
    }

    mod analytics_tests {
        use super::*;

        #[test]
        fn test_platform_metrics_calculation() {
            let metrics = PlatformMetrics {
                total_artifacts: 150,
                total_users: 500,
                total_communities: 25,
                total_proposals: 30,
                active_users_monthly: 200,
                artifacts_created_monthly: 45,
                community_engagement_rate: 0.75,
            };

            let growth_rate = calculate_growth_rate(metrics.total_artifacts, 120); // Previous: 120, Current: 150
            assert_eq!(growth_rate, 25.0); // 25% growth

            let engagement_score = calculate_engagement_score(&metrics);
            assert!(engagement_score > 0.0);
            assert!(engagement_score <= 1.0);
        }

        #[test]
        fn test_user_analytics() {
            let user_stats = UserAnalytics {
                artifacts_contributed: 10,
                communities_joined: 5,
                votes_cast: 20,
                posts_created: 15,
                reputation_score: 750,
                join_date: 1609459200000000000, // Jan 1, 2021
            };

            let activity_score = calculate_user_activity_score(&user_stats);
            assert!(activity_score > 0.0);

            let contribution_level = determine_contribution_level(&user_stats);
            assert_ne!(contribution_level, ContributionLevel::Newcomer);
        }
    }
}
