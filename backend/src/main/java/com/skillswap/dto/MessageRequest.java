package com.skillswap.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class MessageRequest {
    private UUID senderId;
    private UUID recipientId; // Null for group chat
    private UUID groupId;     // Null for private chat
    private String content;
    private String mediaUrl;
}
