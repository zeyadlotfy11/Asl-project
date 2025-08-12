use candid::Principal;

use crate::modules::types::*;
use crate::modules::storage::AUDIT_LOG;
use crate::modules::auth::get_caller;
use crate::modules::utils::{get_time, create_hash};
use crate::modules::storage::get_next_id;

// ============================================================================
// AUDIT AND COMPLIANCE SYSTEM
// ============================================================================

pub fn log_audit_event(event_type: AuditEventType, target_id: Option<u64>, details: String, severity: AuditSeverity) {
    let audit_id = get_next_id(6); // Audit log counter
    let caller = get_caller();
    let timestamp = get_time();
    
    let data_for_hash = format!("{:?}:{:?}:{}:{}", event_type, caller, timestamp, details);
    let data_hash = create_hash(&data_for_hash);
    
    let audit_entry = AuditEntry {
        id: audit_id,
        timestamp,
        event_type,
        actor: caller,
        target_id,
        details,
        data_hash,
        severity,
    };
    
    AUDIT_LOG.with(|log| {
        log.borrow_mut().insert(audit_id, audit_entry);
    });
}

pub fn get_audit_logs_for_artifact(artifact_id: u64) -> Vec<AuditEntry> {
    let mut logs = Vec::new();
    AUDIT_LOG.with(|audit_log| {
        for (_, entry) in audit_log.borrow().iter() {
            if entry.target_id == Some(artifact_id) {
                logs.push(entry.clone());
            }
        }
    });
    
    // Sort by timestamp (most recent first)
    logs.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
    logs
}

pub fn get_audit_logs_for_user(user_principal: Principal) -> Vec<AuditEntry> {
    let mut logs = Vec::new();
    AUDIT_LOG.with(|audit_log| {
        for (_, entry) in audit_log.borrow().iter() {
            if entry.actor == user_principal {
                logs.push(entry.clone());
            }
        }
    });
    
    // Sort by timestamp (most recent first)
    logs.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
    logs
}

pub fn get_recent_audit_logs(limit: usize) -> Vec<AuditEntry> {
    let mut logs = Vec::new();
    AUDIT_LOG.with(|audit_log| {
        for (_, entry) in audit_log.borrow().iter() {
            logs.push(entry.clone());
        }
    });
    
    // Sort by timestamp (most recent first)
    logs.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
    
    // Limit results
    logs.truncate(limit);
    logs
}

pub fn get_security_alerts() -> Vec<AuditEntry> {
    let mut alerts = Vec::new();
    AUDIT_LOG.with(|audit_log| {
        for (_, entry) in audit_log.borrow().iter() {
            if matches!(entry.severity, AuditSeverity::SecurityAlert | AuditSeverity::Critical) {
                alerts.push(entry.clone());
            }
        }
    });
    
    // Sort by timestamp (most recent first)
    alerts.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
    alerts
}
