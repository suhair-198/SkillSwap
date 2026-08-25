package com.skillswap.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class TypingRequest {
    private UUID senderId;
    private String senderName;
    private UUID recipientId; // Null for group chats
    private UUID groupId;     // Null for private chats
    private boolean typing;
}
