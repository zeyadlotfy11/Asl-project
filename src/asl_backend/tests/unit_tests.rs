use asl_backend::*;
use proptest::prelude::*;
use candid::Principal;

#[cfg(test)]
mod unit_tests {
    use super::*;

    #[test]
    fn test_artifact_id_generation() {
        let id1 = generate_artifact_id();
        let id2 = generate_artifact_id();
        
        // IDs should be unique
        assert_ne!(id1, id2);
        
        // IDs should be non-empty
        assert!(!id1.is_empty());
        assert!(!id2.is_empty());
    }

    #[test]
    fn test_user_id_from_principal() {
        let principal = Principal::from_text("rdmx6-jaaaa-aaaaa-aaadq-cai").unwrap();
        let user_id = principal_to_user_id(principal);
        
        assert!(!user_id.is_empty());
        assert!(user_id.len() > 10); // Should be a reasonable length
    }

    #[test]
    fn test_validate_artifact_data() {
        let valid_data = ArtifactData {
            name: "Valid Artifact".to_string(),
            description: "A valid artifact with proper description".to_string(),
            category: "Pottery".to_string(),
            period: "New Kingdom".to_string(),
            location: "Valley of the Kings".to_string(),
            images: vec!["image1.jpg".to_string()],
            metadata: std::collections::HashMap::new(),
        };
        
        assert!(validate_artifact_data(&valid_data));
        
        let invalid_data = ArtifactData {
            name: "".to_string(), // Empty name should be invalid
            description: "Valid description".to_string(),
            category: "Pottery".to_string(),
            period: "New Kingdom".to_string(),
            location: "Valley of the Kings".to_string(),
            images: vec![],
            metadata: std::collections::HashMap::new(),
        };
        
        assert!(!validate_artifact_data(&invalid_data));
    }

    #[test]
    fn test_validate_community_data() {
        let valid_data = CommunityData {
            name: "Valid Community".to_string(),
            description: "A valid community with proper description".to_string(),
            category: "Research".to_string(),
            is_public: true,
        };
        
        assert!(validate_community_data(&valid_data));
        
        let invalid_data = CommunityData {
            name: "".to_string(), // Empty name should be invalid
            description: "Valid description".to_string(),
            category: "Research".to_string(),
            is_public: true,
        };
        
        assert!(!validate_community_data(&invalid_data));
    }

    #[test]
    fn test_calculate_reputation_score() {
        let score1 = calculate_reputation_score(5, 2, 10); // 5 artifacts, 2 contributions, 10 votes
        let score2 = calculate_reputation_score(10, 5, 20); // Higher values
        
        assert!(score2 > score1); // Higher activity should yield higher score
        assert!(score1 > 0); // Score should be positive
    }

    #[test]
    fn test_format_timestamp() {
        let timestamp = 1693440000000000000u64; // Example timestamp in nanoseconds
        let formatted = format_timestamp(timestamp);
        
        assert!(!formatted.is_empty());
        assert!(formatted.contains("2023")); // Should be a reasonable date
    }

    #[test]
    fn test_sanitize_input() {
        let input = "<script>alert('xss')</script>Hello World";
        let sanitized = sanitize_input(input);
        
        assert!(!sanitized.contains("<script>"));
        assert!(sanitized.contains("Hello World"));
    }

    #[test]
    fn test_validate_image_url() {
        assert!(validate_image_url("https://example.com/image.jpg"));
        assert!(validate_image_url("https://example.com/image.png"));
        assert!(validate_image_url("https://example.com/image.gif"));
        
        assert!(!validate_image_url("not_a_url"));
        assert!(!validate_image_url("https://example.com/file.txt"));
        assert!(!validate_image_url(""));
    }

    #[test]
    fn test_calculate_vote_percentage() {
        let percentage = calculate_vote_percentage(7, 3); // 7 yes, 3 no
        assert_eq!(percentage, 70.0);
        
        let percentage_zero = calculate_vote_percentage(0, 0);
        assert_eq!(percentage_zero, 0.0);
        
        let percentage_all_yes = calculate_vote_percentage(10, 0);
        assert_eq!(percentage_all_yes, 100.0);
    }
}

#[cfg(test)]
mod property_tests {
    use super::*;

    proptest! {
        #[test]
        fn test_artifact_id_uniqueness(iterations in 0..100u32) {
            let mut ids = std::collections::HashSet::new();
            for _ in 0..iterations {
                let id = generate_artifact_id();
                assert!(!ids.contains(&id), "Generated duplicate ID: {}", id);
                ids.insert(id);
            }
        }

        #[test]
        fn test_reputation_calculation_properties(
            artifacts in 0..1000u32,
            contributions in 0..1000u32,
            votes in 0..1000u32
        ) {
            let score = calculate_reputation_score(artifacts, contributions, votes);
            
            // Score should always be non-negative
            assert!(score >= 0);
            
            // More activity should generally lead to higher scores
            if artifacts > 0 || contributions > 0 || votes > 0 {
                assert!(score > 0);
            }
        }

        #[test]
        fn test_input_sanitization(input in ".*") {
            let sanitized = sanitize_input(&input);
            
            // Sanitized input should not contain dangerous HTML tags
            assert!(!sanitized.contains("<script"));
            assert!(!sanitized.contains("<iframe"));
            assert!(!sanitized.contains("javascript:"));
        }
    }
}
