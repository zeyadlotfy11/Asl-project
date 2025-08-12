use ic_cdk::{query, update};
use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use crate::modules::types::*;
use crate::modules::storage::{COLLABORATION_ROOMS, MESSAGES, VIRTUAL_EVENTS, get_next_id};
use crate::modules::auth::*;
use crate::modules::utils::*;
use crate::modules::audit::log_audit_event;

// ============================================================================
// REAL-TIME COLLABORATION SYSTEM
// ============================================================================

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CollaborationRoom {
    pub room_id: u64,
    pub room_type: RoomType,
    pub title: String,
    pub description: String,
    pub artifact_id: Option<u64>,
    pub proposal_id: Option<u64>,
    pub participants: Vec<Principal>,
    pub moderators: Vec<Principal>,
    pub created_at: u64,
    pub last_activity: u64,
    pub is_private: bool,
    pub access_level: AccessLevel,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum RoomType {
    ArtifactDiscussion,
    ProposalDebate,
    ExpertConsultation,
    GeneralDiscussion,
    EducationalWorkshop,
    ResearchCollaboration,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum AccessLevel {
    Public,
    ExpertsOnly,
    InstitutionsOnly,
    InviteOnly,
    Moderated,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Message {
    pub message_id: u64,
    pub room_id: u64,
    pub sender: Principal,
    pub content: String,
    pub message_type: MessageType,
    pub timestamp: u64,
    pub reply_to: Option<u64>,
    pub reactions: Vec<Reaction>,
    pub attachments: Vec<Attachment>,
    pub is_pinned: bool,
    pub edit_history: Vec<EditEntry>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum MessageType {
    Text,
    Image,
    Document,
    Poll,
    Announcement,
    SystemNotification,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Reaction {
    pub emoji: String,
    pub users: Vec<Principal>,
    pub count: u32,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Attachment {
    pub attachment_id: u64,
    pub filename: String,
    pub content_type: String,
    pub size: u64,
    pub hash: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EditEntry {
    pub timestamp: u64,
    pub editor: Principal,
    pub old_content: String,
    pub reason: Option<String>,
}

#[update]
pub fn create_collaboration_room(
    room_type: RoomType,
    title: String,
    description: String,
    artifact_id: Option<u64>,
    proposal_id: Option<u64>,
    is_private: bool,
    access_level: AccessLevel,
) -> Result<u64, String> {
    let caller = get_caller();
    
    if title.trim().is_empty() {
        return Err("Room title cannot be empty".to_string());
    }

    let room_id = get_next_id(11); // Collaboration room counter
    let now = get_time();

    let room = CollaborationRoom {
        room_id,
        room_type: room_type.clone(),
        title: title.clone(),
        description,
        artifact_id,
        proposal_id,
        participants: vec![caller],
        moderators: vec![caller],
        created_at: now,
        last_activity: now,
        is_private,
        access_level,
    };

    COLLABORATION_ROOMS.with(|rooms| {
        rooms.borrow_mut().insert(room_id, room);
    });

    log_audit_event(
        AuditEventType::SystemMaintenance,
        Some(room_id),
        format!("Collaboration room '{}' created with type: {:?}", title, room_type),
        AuditSeverity::Info
    );

    Ok(room_id)
}

#[update]
pub fn send_message(
    room_id: u64,
    content: String,
    message_type: MessageType,
    reply_to: Option<u64>,
    attachments: Vec<Attachment>,
) -> Result<u64, String> {
    let caller = get_caller();
    
    if content.trim().is_empty() && attachments.is_empty() {
        return Err("Message cannot be empty".to_string());
    }

    // Check if user can access the room
    let can_access = COLLABORATION_ROOMS.with(|rooms| {
        rooms.borrow().get(&room_id)
            .map(|room| room.participants.contains(&caller) || can_moderate(caller))
            .unwrap_or(false)
    });

    if !can_access {
        return Err("You don't have access to this room".to_string());
    }

    let message_id = get_next_id(12); // Message counter
    let now = get_time();

    let message = Message {
        message_id,
        room_id,
        sender: caller,
        content,
        message_type,
        timestamp: now,
        reply_to,
        reactions: Vec::new(),
        attachments,
        is_pinned: false,
        edit_history: Vec::new(),
    };

    MESSAGES.with(|messages| {
        messages.borrow_mut().insert(message_id, message);
    });

    // Update room last activity
    COLLABORATION_ROOMS.with(|rooms| {
        let mut rooms = rooms.borrow_mut();
        if let Some(mut room) = rooms.get(&room_id) {
            room.last_activity = now;
            rooms.insert(room_id, room);
        }
    });

    Ok(message_id)
}

#[update]
pub fn add_reaction(message_id: u64, emoji: String) -> Result<String, String> {
    let caller = get_caller();
    
    MESSAGES.with(|messages| {
        let mut messages = messages.borrow_mut();
        if let Some(mut message) = messages.get(&message_id) {
            // Find existing reaction or create new one
            if let Some(reaction) = message.reactions.iter_mut().find(|r| r.emoji == emoji) {
                if !reaction.users.contains(&caller) {
                    reaction.users.push(caller);
                    reaction.count += 1;
                }
            } else {
                message.reactions.push(Reaction {
                    emoji: emoji.clone(),
                    users: vec![caller],
                    count: 1,
                });
            }
            
            messages.insert(message_id, message);
            Ok(format!("Reaction {} added", emoji))
        } else {
            Err("Message not found".to_string())
        }
    })
}

#[query]
pub fn get_collaboration_rooms() -> Vec<CollaborationRoom> {
    let mut rooms = Vec::new();
    COLLABORATION_ROOMS.with(|room_store| {
        for (_, room) in room_store.borrow().iter() {
            rooms.push(room.clone());
        }
    });
    
    // Sort by last activity (most recent first)
    rooms.sort_by(|a, b| b.last_activity.cmp(&a.last_activity));
    rooms
}

#[query]
pub fn get_room_messages(room_id: u64, limit: Option<usize>) -> Vec<Message> {
    let limit = limit.unwrap_or(50);
    let mut messages = Vec::new();
    
    MESSAGES.with(|message_store| {
        for (_, message) in message_store.borrow().iter() {
            if message.room_id == room_id {
                messages.push(message.clone());
            }
        }
    });
    
    // Sort by timestamp (most recent last)
    messages.sort_by(|a, b| a.timestamp.cmp(&b.timestamp));
    messages.truncate(limit);
    messages
}

// ============================================================================
// LIVE STREAMING & VIRTUAL EVENTS
// ============================================================================

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct VirtualEvent {
    pub event_id: u64,
    pub title: String,
    pub description: String,
    pub event_type: EventType,
    pub start_time: u64,
    pub end_time: u64,
    pub host: Principal,
    pub speakers: Vec<Principal>,
    pub attendees: Vec<Principal>,
    pub max_attendees: Option<u64>,
    pub is_live: bool,
    pub recording_url: Option<String>,
    pub presentation_materials: Vec<String>,
    pub q_and_a: Vec<QAItem>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum EventType {
    ExpertLecture,
    ArtifactPresentation,
    VirtualMuseumTour,
    EducationalWorkshop,
    ConservationDemo,
    LiveExcavation,
    PanelDiscussion,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct QAItem {
    pub question: String,
    pub questioner: Principal,
    pub answer: Option<String>,
    pub answerer: Option<Principal>,
    pub timestamp: u64,
    pub upvotes: u32,
}

#[update]
pub fn create_virtual_event(
    title: String,
    description: String,
    event_type: EventType,
    start_time: u64,
    end_time: u64,
    max_attendees: Option<u64>,
) -> Result<u64, String> {
    let caller = get_caller();
    
    if !is_expert_or_institution(caller) && !can_moderate(caller) {
        return Err("Only experts, institutions, or moderators can create events".to_string());
    }

    if start_time >= end_time {
        return Err("Event end time must be after start time".to_string());
    }

    let event_id = get_next_id(13); // Event counter

    let event = VirtualEvent {
        event_id,
        title: title.clone(),
        description,
        event_type: event_type.clone(),
        start_time,
        end_time,
        host: caller,
        speakers: vec![caller],
        attendees: Vec::new(),
        max_attendees,
        is_live: false,
        recording_url: None,
        presentation_materials: Vec::new(),
        q_and_a: Vec::new(),
    };

    VIRTUAL_EVENTS.with(|events| {
        events.borrow_mut().insert(event_id, event);
    });

    log_audit_event(
        AuditEventType::SystemMaintenance,
        Some(event_id),
        format!("Virtual event '{}' created with type: {:?}", title, event_type),
        AuditSeverity::Info
    );

    Ok(event_id)
}

#[update]
pub fn join_event(event_id: u64) -> Result<String, String> {
    let caller = get_caller();
    
    VIRTUAL_EVENTS.with(|events| {
        let mut events = events.borrow_mut();
        if let Some(mut event) = events.get(&event_id) {
            if let Some(max) = event.max_attendees {
                if event.attendees.len() as u64 >= max {
                    return Err("Event is at maximum capacity".to_string());
                }
            }
            
            if !event.attendees.contains(&caller) {
                event.attendees.push(caller);
                events.insert(event_id, event);
                Ok("Successfully joined event".to_string())
            } else {
                Ok("Already joined this event".to_string())
            }
        } else {
            Err("Event not found".to_string())
        }
    })
}

#[query]
pub fn get_upcoming_events() -> Vec<VirtualEvent> {
    let current_time = get_time();
    let mut events = Vec::new();
    
    VIRTUAL_EVENTS.with(|event_store| {
        for (_, event) in event_store.borrow().iter() {
            if event.start_time > current_time {
                events.push(event.clone());
            }
        }
    });
    
    // Sort by start time
    events.sort_by(|a, b| a.start_time.cmp(&b.start_time));
    events
}
