use ic_cdk::{query, update};
use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use crate::modules::storage::{COMMUNITY_POSTS, COMMUNITY_STATS, get_next_id, USERS};
use crate::modules::auth::*;
use crate::modules::utils::*;
use crate::modules::audit::{log_audit_event};
use crate::modules::types::{AuditEventType, AuditSeverity};

// ============================================================================
// COMMUNITY MANAGEMENT SYSTEM
// ============================================================================

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CommunityPost {
    pub post_id: u64,
    pub author: Principal,
    pub author_name: String,
    pub title: String,
    pub content: String,
    pub category: CommunityCategory,
    pub tags: Vec<String>,
    pub created_at: u64,
    pub updated_at: u64,
    pub likes: u64,
    pub replies: Vec<CommunityReply>,
    pub is_featured: bool,
    pub is_pinned: bool,
    pub status: PostStatus,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum CommunityCategory {
    General,
    Artifacts,
    Research,
    Events,
    Announcements,
    TechnicalSupport,
    Governance,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum PostStatus {
    Active,
    Hidden,
    Archived,
    Flagged,
    UnderReview,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CommunityReply {
    pub reply_id: u64,
    pub author: Principal,
    pub author_name: String,
    pub content: String,
    pub created_at: u64,
    pub likes: u64,
    pub parent_reply: Option<u64>, // For nested replies
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CommunityStats {
    pub total_members: u64,
    pub active_today: u64,
    pub active_this_week: u64,
    pub total_posts: u64,
    pub total_replies: u64,
    pub posts_today: u64,
    pub featured_posts: u64,
    pub last_updated: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CreatePostRequest {
    pub title: String,
    pub content: String,
    pub category: CommunityCategory,
    pub tags: Vec<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CreateReplyRequest {
    pub post_id: u64,
    pub content: String,
    pub parent_reply: Option<u64>,
}

// ============================================================================
// COMMUNITY FUNCTIONS
// ============================================================================

#[update]
pub fn create_community_post(request: CreatePostRequest) -> Result<u64, String> {
    let caller = get_caller();
    
    // Verify user is registered
    let user = USERS.with(|users| {
        users.borrow().get(&caller)
    }).ok_or("User not registered")?;

    // Validate request
    if request.title.trim().is_empty() || request.title.len() > 200 {
        return Err("Title must be between 1 and 200 characters".to_string());
    }
    
    if request.content.trim().is_empty() || request.content.len() > 5000 {
        return Err("Content must be between 1 and 5000 characters".to_string());
    }
    
    if request.tags.len() > 10 {
        return Err("Maximum 10 tags allowed".to_string());
    }

    let now = get_time();
    let post_id = get_next_id(8); // Community posts counter

    // Generate author name from principal or institution
    let author_name = if let Some(institution) = &user.institution {
        institution.clone()
    } else {
        format!("User_{}", caller.to_text().chars().take(8).collect::<String>())
    };

    let post = CommunityPost {
        post_id,
        author: caller,
        author_name,
        title: request.title,
        content: request.content,
        category: request.category.clone(),
        tags: request.tags,
        created_at: now,
        updated_at: now,
        likes: 0,
        replies: Vec::new(),
        is_featured: false,
        is_pinned: false,
        status: PostStatus::Active,
    };

    // Store the post
    COMMUNITY_POSTS.with(|posts| {
        posts.borrow_mut().insert(post_id, post);
    });

    // Update community stats
    update_community_stats();

    // Log audit event
    log_audit_event(
        AuditEventType::CommunityActivity,
        Some(post_id),
        format!("Community post created: {}", post_id),
        AuditSeverity::Info
    );

    Ok(post_id)
}

#[update]
pub fn create_community_reply(request: CreateReplyRequest) -> Result<u64, String> {
    let caller = get_caller();
    
    // Verify user is registered
    let user = USERS.with(|users| {
        users.borrow().get(&caller)
    }).ok_or("User not registered")?;

    // Validate content
    if request.content.trim().is_empty() || request.content.len() > 2000 {
        return Err("Reply content must be between 1 and 2000 characters".to_string());
    }

    let now = get_time();
    let reply_id = get_next_id(9); // Community replies counter

    // Generate author name from principal or institution
    let author_name = if let Some(institution) = &user.institution {
        institution.clone()
    } else {
        format!("User_{}", caller.to_text().chars().take(8).collect::<String>())
    };

    let reply = CommunityReply {
        reply_id,
        author: caller,
        author_name,
        content: request.content,
        created_at: now,
        likes: 0,
        parent_reply: request.parent_reply,
    };

    // Add reply to post
    COMMUNITY_POSTS.with(|posts| {
        let mut posts_map = posts.borrow_mut();
        if let Some(mut post) = posts_map.get(&request.post_id) {
            post.replies.push(reply);
            post.updated_at = now;
            posts_map.insert(request.post_id, post);
            Ok(())
        } else {
            Err("Post not found".to_string())
        }
    })?;

    // Update community stats
    update_community_stats();

    // Log audit event
    log_audit_event(
        AuditEventType::CommunityActivity,
        Some(request.post_id),
        format!("Community reply created: {} on post {}", reply_id, request.post_id),
        AuditSeverity::Info
    );

    Ok(reply_id)
}

#[update]
pub fn like_community_post(post_id: u64) -> Result<String, String> {
    let caller = get_caller();
    
    // Verify user is registered
    USERS.with(|users| {
        users.borrow().get(&caller)
    }).ok_or("User not registered")?;

    COMMUNITY_POSTS.with(|posts| {
        let mut posts_map = posts.borrow_mut();
        if let Some(mut post) = posts_map.get(&post_id) {
            post.likes += 1;
            posts_map.insert(post_id, post);
            Ok("Post liked successfully".to_string())
        } else {
            Err("Post not found".to_string())
        }
    })
}

#[update]
pub fn like_community_reply(post_id: u64, reply_id: u64) -> Result<String, String> {
    let caller = get_caller();
    
    // Verify user is registered
    USERS.with(|users| {
        users.borrow().get(&caller)
    }).ok_or("User not registered")?;

    COMMUNITY_POSTS.with(|posts| {
        let mut posts_map = posts.borrow_mut();
        if let Some(mut post) = posts_map.get(&post_id) {
            for reply in &mut post.replies {
                if reply.reply_id == reply_id {
                    reply.likes += 1;
                    posts_map.insert(post_id, post);
                    return Ok("Reply liked successfully".to_string());
                }
            }
            Err("Reply not found".to_string())
        } else {
            Err("Post not found".to_string())
        }
    })
}

#[query]
pub fn get_community_post(post_id: u64) -> Result<CommunityPost, String> {
    COMMUNITY_POSTS.with(|posts| {
        posts.borrow().get(&post_id)
            .ok_or("Post not found".to_string())
    })
}

#[query]
pub fn get_all_community_posts() -> Vec<CommunityPost> {
    COMMUNITY_POSTS.with(|posts| {
        posts.borrow()
            .iter()
            .filter(|(_, post)| matches!(post.status, PostStatus::Active))
            .map(|(_, post)| post.clone())
            .collect()
    })
}

#[query]
pub fn get_community_posts_by_category(category: CommunityCategory) -> Vec<CommunityPost> {
    COMMUNITY_POSTS.with(|posts| {
        posts.borrow()
            .iter()
            .filter(|(_, post)| {
                matches!(post.status, PostStatus::Active) && 
                std::mem::discriminant(&post.category) == std::mem::discriminant(&category)
            })
            .map(|(_, post)| post.clone())
            .collect()
    })
}

#[query]
pub fn get_community_posts_by_author(author: Principal) -> Vec<CommunityPost> {
    COMMUNITY_POSTS.with(|posts| {
        posts.borrow()
            .iter()
            .filter(|(_, post)| {
                post.author == author && matches!(post.status, PostStatus::Active)
            })
            .map(|(_, post)| post.clone())
            .collect()
    })
}

#[query]
pub fn search_community_posts(query: String) -> Vec<CommunityPost> {
    let query_lower = query.to_lowercase();
    
    COMMUNITY_POSTS.with(|posts| {
        posts.borrow()
            .iter()
            .filter(|(_, post)| {
                matches!(post.status, PostStatus::Active) && (
                    post.title.to_lowercase().contains(&query_lower) ||
                    post.content.to_lowercase().contains(&query_lower) ||
                    post.tags.iter().any(|tag| tag.to_lowercase().contains(&query_lower))
                )
            })
            .map(|(_, post)| post.clone())
            .collect()
    })
}

#[query]
pub fn get_community_stats() -> CommunityStats {
    COMMUNITY_STATS.with(|stats| {
        stats.borrow().clone()
    })
}

#[query]
pub fn get_featured_posts() -> Vec<CommunityPost> {
    COMMUNITY_POSTS.with(|posts| {
        posts.borrow()
            .iter()
            .filter(|(_, post)| {
                matches!(post.status, PostStatus::Active) && post.is_featured
            })
            .map(|(_, post)| post.clone())
            .collect()
    })
}

#[query]
pub fn get_pinned_posts() -> Vec<CommunityPost> {
    COMMUNITY_POSTS.with(|posts| {
        posts.borrow()
            .iter()
            .filter(|(_, post)| {
                matches!(post.status, PostStatus::Active) && post.is_pinned
            })
            .map(|(_, post)| post.clone())
            .collect()
    })
}

// ============================================================================
// MODERATOR FUNCTIONS
// ============================================================================

#[update]
pub fn moderate_post(post_id: u64, action: ModerationAction) -> Result<String, String> {
    let caller = get_caller();
    
    // Check if user has moderation permissions
    let user = USERS.with(|users| {
        users.borrow().get(&caller)
    }).ok_or("User not registered")?;

    if !user.permissions.can_moderate {
        return Err("Insufficient permissions".to_string());
    }

    COMMUNITY_POSTS.with(|posts| {
        let mut posts_map = posts.borrow_mut();
        if let Some(mut post) = posts_map.get(&post_id) {
            match action {
                ModerationAction::Pin => {
                    post.is_pinned = true;
                    posts_map.insert(post_id, post);
                    Ok("Post pinned successfully".to_string())
                },
                ModerationAction::Unpin => {
                    post.is_pinned = false;
                    posts_map.insert(post_id, post);
                    Ok("Post unpinned successfully".to_string())
                },
                ModerationAction::Feature => {
                    post.is_featured = true;
                    posts_map.insert(post_id, post);
                    Ok("Post featured successfully".to_string())
                },
                ModerationAction::Unfeature => {
                    post.is_featured = false;
                    posts_map.insert(post_id, post);
                    Ok("Post unfeatured successfully".to_string())
                },
                ModerationAction::Hide => {
                    post.status = PostStatus::Hidden;
                    posts_map.insert(post_id, post);
                    Ok("Post hidden successfully".to_string())
                },
                ModerationAction::Archive => {
                    post.status = PostStatus::Archived;
                    posts_map.insert(post_id, post);
                    Ok("Post archived successfully".to_string())
                },
                ModerationAction::Flag => {
                    post.status = PostStatus::Flagged;
                    posts_map.insert(post_id, post);
                    Ok("Post flagged successfully".to_string())
                },
            }
        } else {
            Err("Post not found".to_string())
        }
    })
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum ModerationAction {
    Pin,
    Unpin,
    Feature,
    Unfeature,
    Hide,
    Archive,
    Flag,
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

fn update_community_stats() {
    let now = get_time();
    let day_in_ms = 24 * 60 * 60 * 1000;
    let _week_in_ms = 7 * day_in_ms; // Prefix with underscore to suppress warning

    COMMUNITY_STATS.with(|stats_ref| {
        let mut stats = stats_ref.borrow_mut();
        
        // Count total members
        let total_members = USERS.with(|users| {
            users.borrow().len() as u64
        });

        // Count posts
        let (total_posts, posts_today, featured_posts, total_replies) = COMMUNITY_POSTS.with(|posts| {
            let posts_map = posts.borrow();
            let total = posts_map.len() as u64;
            let today = posts_map.iter()
                .filter(|(_, post)| now - post.created_at < day_in_ms)
                .count() as u64;
            let featured = posts_map.iter()
                .filter(|(_, post)| post.is_featured)
                .count() as u64;
            let replies = posts_map.iter()
                .map(|(_, post)| post.replies.len() as u64)
                .sum::<u64>();
            
            (total, today, featured, replies)
        });

        // Update stats
        stats.total_members = total_members;
        stats.total_posts = total_posts;
        stats.posts_today = posts_today;
        stats.featured_posts = featured_posts;
        stats.total_replies = total_replies;
        stats.last_updated = now;
        
        // Mock active users (in a real implementation, this would track actual activity)
        stats.active_today = (total_members as f64 * 0.1) as u64; // 10% of members active today
        stats.active_this_week = (total_members as f64 * 0.3) as u64; // 30% of members active this week
    });
}
