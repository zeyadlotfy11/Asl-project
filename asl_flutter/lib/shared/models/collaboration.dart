import 'package:freezed_annotation/freezed_annotation.dart';

part 'collaboration.freezed.dart';
part 'collaboration.g.dart';

// Collaboration Room Model
@freezed
class CollaborationRoom with _$CollaborationRoom {
  const factory CollaborationRoom({
    required int id,
    required String name,
    required String description,
    int? artifactId,
    required String creator,
    required List<String> members,
    required int createdAt,
    required bool isPublic,
  }) = _CollaborationRoom;
  
  factory CollaborationRoom.fromJson(Map<String, dynamic> json) =>
      _$CollaborationRoomFromJson(json);
}

// Message Model
@freezed
class Message with _$Message {
  const factory Message({
    required int id,
    required int roomId,
    required String sender,
    required String content,
    required int timestamp,
    required String messageType,
    required List<String> attachments,
  }) = _Message;
  
  factory Message.fromJson(Map<String, dynamic> json) =>
      _$MessageFromJson(json);
}

// Virtual Event Model
@freezed
class VirtualEvent with _$VirtualEvent {
  const factory VirtualEvent({
    required int id,
    required String title,
    required String description,
    required String host,
    required int startTime,
    required int durationMinutes,
    int? maxParticipants,
    required List<String> participants,
    required String eventType,
    String? meetingLink,
  }) = _VirtualEvent;
  
  factory VirtualEvent.fromJson(Map<String, dynamic> json) =>
      _$VirtualEventFromJson(json);
}

// Message Reaction Model
@freezed
class MessageReaction with _$MessageReaction {
  const factory MessageReaction({
    required int messageId,
    required String userId,
    required String emoji,
    required DateTime timestamp,
  }) = _MessageReaction;
  
  factory MessageReaction.fromJson(Map<String, dynamic> json) =>
      _$MessageReactionFromJson(json);
}

// File Attachment Model
@freezed
class FileAttachment with _$FileAttachment {
  const factory FileAttachment({
    required String id,
    required String fileName,
    required String fileType,
    required int fileSize,
    required String url,
    required DateTime uploadedAt,
    required String uploadedBy,
    String? description,
  }) = _FileAttachment;
  
  factory FileAttachment.fromJson(Map<String, dynamic> json) =>
      _$FileAttachmentFromJson(json);
}

// Extensions for better usability
extension CollaborationRoomExtension on CollaborationRoom {
  DateTime get createdDate => DateTime.fromMillisecondsSinceEpoch(createdAt);
  
  String get shortCreator => creator.length > 12 
      ? '${creator.substring(0, 6)}...${creator.substring(creator.length - 6)}'
      : creator;
  
  int get memberCount => members.length;
  
  String get memberCountDisplay => memberCount == 1 
      ? '1 member' 
      : '$memberCount members';
  
  String get privacyDisplay => isPublic ? 'Public' : 'Private';
  
  String get roomTypeDisplay {
    if (artifactId != null) {
      return 'Artifact Discussion';
    } else {
      return 'General Discussion';
    }
  }
  
  bool get hasArtifact => artifactId != null;
  
  String get formattedCreatedDate {
    final now = DateTime.now();
    final difference = now.difference(createdDate);
    
    if (difference.inDays > 30) {
      return 'Created ${(difference.inDays / 30).floor()} month(s) ago';
    } else if (difference.inDays > 0) {
      return 'Created ${difference.inDays} day(s) ago';
    } else if (difference.inHours > 0) {
      return 'Created ${difference.inHours} hour(s) ago';
    } else {
      return 'Recently created';
    }
  }
  
  List<String> get recentMembers => members.take(5).toList();
  
  bool isMember(String userId) => members.contains(userId);
  
  bool isCreator(String userId) => creator == userId;
}

extension MessageExtension on Message {
  DateTime get sentDate => DateTime.fromMillisecondsSinceEpoch(timestamp);
  
  String get shortSender => sender.length > 12 
      ? '${sender.substring(0, 6)}...${sender.substring(sender.length - 6)}'
      : sender;
  
  String get formattedTimestamp {
    final now = DateTime.now();
    final difference = now.difference(sentDate);
    
    if (difference.inDays > 0) {
      return '${difference.inDays}d ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m ago';
    } else {
      return 'Just now';
    }
  }
  
  bool get hasAttachments => attachments.isNotEmpty;
  
  int get attachmentCount => attachments.length;
  
  String get attachmentCountDisplay => attachmentCount == 1 
      ? '1 attachment' 
      : '$attachmentCount attachments';
  
  String get messageTypeDisplay => messageType
      .replaceAll('_', ' ')
      .split(' ')
      .map((word) => word.isEmpty ? '' : word[0].toUpperCase() + word.substring(1))
      .join(' ');
  
  bool get isTextMessage => messageType == 'text';
  bool get isImageMessage => messageType == 'image';
  bool get isFileMessage => messageType == 'file';
  bool get isSystemMessage => messageType == 'system';
  
  String get contentPreview {
    if (content.length <= 100) return content;
    return '${content.substring(0, 97)}...';
  }
  
  String get messageIcon {
    switch (messageType) {
      case 'text':
        return '💬';
      case 'image':
        return '🖼️';
      case 'file':
        return '📎';
      case 'system':
        return '🔔';
      default:
        return '📝';
    }
  }
}

extension VirtualEventExtension on VirtualEvent {
  DateTime get startDate => DateTime.fromMillisecondsSinceEpoch(startTime);
  DateTime get endDate => startDate.add(Duration(minutes: durationMinutes));
  
  String get shortHost => host.length > 12 
      ? '${host.substring(0, 6)}...${host.substring(host.length - 6)}'
      : host;
  
  bool get isOngoing {
    final now = DateTime.now();
    return now.isAfter(startDate) && now.isBefore(endDate);
  }
  
  bool get isUpcoming => DateTime.now().isBefore(startDate);
  bool get isCompleted => DateTime.now().isAfter(endDate);
  
  String get status {
    if (isOngoing) return 'Live';
    if (isUpcoming) return 'Upcoming';
    return 'Completed';
  }
  
  String get statusColor {
    if (isOngoing) return '#4CAF50';
    if (isUpcoming) return '#2196F3';
    return '#9E9E9E';
  }
  
  Duration get timeUntilStart => startDate.difference(DateTime.now());
  Duration get timeUntilEnd => endDate.difference(DateTime.now());
  
  String get formattedTimeUntil {
    if (isCompleted) return 'Ended';
    if (isOngoing) {
      final remaining = timeUntilEnd;
      if (remaining.inHours > 0) {
        return 'Ends in ${remaining.inHours}h ${remaining.inMinutes % 60}m';
      } else {
        return 'Ends in ${remaining.inMinutes}m';
      }
    }
    
    final until = timeUntilStart;
    if (until.inDays > 0) {
      return 'Starts in ${until.inDays}d ${until.inHours % 24}h';
    } else if (until.inHours > 0) {
      return 'Starts in ${until.inHours}h ${until.inMinutes % 60}m';
    } else {
      return 'Starts in ${until.inMinutes}m';
    }
  }
  
  int get participantCount => participants.length;
  
  String get participantCountDisplay => participantCount == 1 
      ? '1 participant' 
      : '$participantCount participants';
  
  bool get hasMaxParticipants => maxParticipants != null;
  
  bool get isFull => hasMaxParticipants && participantCount >= maxParticipants!;
  
  String get capacityDisplay {
    if (!hasMaxParticipants) return participantCountDisplay;
    return '$participantCount / $maxParticipants participants';
  }
  
  bool isParticipant(String userId) => participants.contains(userId);
  
  bool isHost(String userId) => host == userId;
  
  String get eventTypeDisplay => eventType
      .replaceAll('_', ' ')
      .split(' ')
      .map((word) => word.isEmpty ? '' : word[0].toUpperCase() + word.substring(1))
      .join(' ');
  
  String get durationDisplay {
    if (durationMinutes < 60) {
      return '${durationMinutes}m';
    } else {
      final hours = durationMinutes ~/ 60;
      final minutes = durationMinutes % 60;
      return minutes > 0 ? '${hours}h ${minutes}m' : '${hours}h';
    }
  }
  
  bool get hasMeetingLink => meetingLink != null && meetingLink!.isNotEmpty;
}

extension FileAttachmentExtension on FileAttachment {
  String get shortUploadedBy => uploadedBy.length > 12 
      ? '${uploadedBy.substring(0, 6)}...${uploadedBy.substring(uploadedBy.length - 6)}'
      : uploadedBy;
  
  String get formattedFileSize {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    double size = fileSize.toDouble();
    int index = 0;
    
    while (size >= 1024 && index < sizes.length - 1) {
      size /= 1024;
      index++;
    }
    
    return '${size.toStringAsFixed(size < 100 ? 1 : 0)} ${sizes[index]}';
  }
  
  String get fileExtension {
    final parts = fileName.split('.');
    return parts.length > 1 ? parts.last.toLowerCase() : '';
  }
  
  bool get isImage => ['jpg', 'jpeg', 'png', 'gif', 'webp'].contains(fileExtension);
  bool get isDocument => ['pdf', 'doc', 'docx', 'txt'].contains(fileExtension);
  bool get isVideo => ['mp4', 'avi', 'mov', 'wmv'].contains(fileExtension);
  bool get isAudio => ['mp3', 'wav', 'aac', 'flac'].contains(fileExtension);
  
  String get fileIcon {
    if (isImage) return '🖼️';
    if (isDocument) return '📄';
    if (isVideo) return '🎥';
    if (isAudio) return '🎵';
    return '📎';
  }
  
  String get formattedUploadDate {
    final now = DateTime.now();
    final difference = now.difference(uploadedAt);
    
    if (difference.inDays > 0) {
      return 'Uploaded ${difference.inDays}d ago';
    } else if (difference.inHours > 0) {
      return 'Uploaded ${difference.inHours}h ago';
    } else {
      return 'Recently uploaded';
    }
  }
}