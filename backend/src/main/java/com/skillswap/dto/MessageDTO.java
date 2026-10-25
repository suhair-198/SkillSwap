package com.skillswap.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.skillswap.model.Message;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageDTO {
    private UUID id;
    private UUID senderId;
    private String senderName;
    private String senderProfilePicture;
    private UserDTO sender;
    private UUID recipientId; // Null for group chats
    private UserDTO recipient;
    private UUID groupId; // Null for private chats
    private String content;
    private String mediaUrl;
    
    @JsonProperty("read")
    private boolean read;

    @JsonProperty("isRead")
    public boolean isRead() {
        return read;
    }

    public void setIsRead(boolean isRead) {
        this.read = isRead;
    }

    private LocalDateTime createdAt;

    public static MessageDTO fromMessage(Message message) {
        if (message == null) return null;
        return MessageDTO.builder()
                .id(message.getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getFullName())
                .senderProfilePicture(message.getSender().getProfilePictureUrl())
                .sender(UserDTO.fromUser(message.getSender()))
                .recipientId(message.getRecipient() != null ? message.getRecipient().getId() : null)
                .recipient(message.getRecipient() != null ? UserDTO.fromUser(message.getRecipient()) : null)
                .groupId(message.getGroup() != null ? message.getGroup().getId() : null)
                .content(message.getContent())
                .mediaUrl(message.getMediaUrl())
                .read(message.isRead())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
