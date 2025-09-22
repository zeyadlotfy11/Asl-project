class CollaborationRoom {
  final int id;
  final String name;
  final String description;
  final int? artifactId;
  final String creator;
  final List<String> members;
  final int createdAt;
  final bool isPublic;

  CollaborationRoom({
    required this.id,
    required this.name,
    required this.description,
    this.artifactId,
    required this.creator,
    required this.members,
    required this.createdAt,
    required this.isPublic,
  });

  factory CollaborationRoom.fromJson(Map<String, dynamic> json) {
    return CollaborationRoom(
      id: json['id'] as int,
      name: json['name'] as String,
      description: json['description'] as String,
      artifactId: json['artifact_id'] as int?,
      creator: json['creator'] as String,
      members: List<String>.from(json['members'] as List),
      createdAt: json['created_at'] as int,
      isPublic: json['is_public'] as bool,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'artifact_id': artifactId,
      'creator': creator,
      'members': members,
      'created_at': createdAt,
      'is_public': isPublic,
    };
  }

  DateTime get createdAtDateTime => DateTime.fromMillisecondsSinceEpoch(createdAt ~/ 1000000);
}

class Message {
  final int id;
  final int roomId;
  final String sender;
  final String content;
  final int timestamp;
  final String messageType;
  final List<String> attachments;

  Message({
    required this.id,
    required this.roomId,
    required this.sender,
    required this.content,
    required this.timestamp,
    required this.messageType,
    required this.attachments,
  });

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      id: json['id'] as int,
      roomId: json['room_id'] as int,
      sender: json['sender'] as String,
      content: json['content'] as String,
      timestamp: json['timestamp'] as int,
      messageType: json['message_type'] as String,
      attachments: List<String>.from(json['attachments'] as List),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'room_id': roomId,
      'sender': sender,
      'content': content,
      'timestamp': timestamp,
      'message_type': messageType,
      'attachments': attachments,
    };
  }

  DateTime get timestampDateTime => DateTime.fromMillisecondsSinceEpoch(timestamp ~/ 1000000);
}

class VirtualEvent {
  final int id;
  final String title;
  final String description;
  final String host;
  final int startTime;
  final int durationMinutes;
  final int? maxParticipants;
  final List<String> participants;
  final String eventType;
  final String? meetingLink;

  VirtualEvent({
    required this.id,
    required this.title,
    required this.description,
    required this.host,
    required this.startTime,
    required this.durationMinutes,
    this.maxParticipants,
    required this.participants,
    required this.eventType,
    this.meetingLink,
  });

  factory VirtualEvent.fromJson(Map<String, dynamic> json) {
    return VirtualEvent(
      id: json['id'] as int,
      title: json['title'] as String,
      description: json['description'] as String,
      host: json['host'] as String,
      startTime: json['start_time'] as int,
      durationMinutes: json['duration_minutes'] as int,
      maxParticipants: json['max_participants'] as int?,
      participants: List<String>.from(json['participants'] as List),
      eventType: json['event_type'] as String,
      meetingLink: json['meeting_link'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'host': host,
      'start_time': startTime,
      'duration_minutes': durationMinutes,
      'max_participants': maxParticipants,
      'participants': participants,
      'event_type': eventType,
      'meeting_link': meetingLink,
    };
  }

  DateTime get startTimeDateTime => DateTime.fromMillisecondsSinceEpoch(startTime ~/ 1000000);
  DateTime get endTimeDateTime => startTimeDateTime.add(Duration(minutes: durationMinutes));
  
  bool get isUpcoming => DateTime.now().isBefore(startTimeDateTime);
  bool get isOngoing => DateTime.now().isAfter(startTimeDateTime) && DateTime.now().isBefore(endTimeDateTime);
  bool get isCompleted => DateTime.now().isAfter(endTimeDateTime);
  bool get isFull => maxParticipants != null && participants.length >= maxParticipants!;
}