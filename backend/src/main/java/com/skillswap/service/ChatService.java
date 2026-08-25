package com.skillswap.service;

import com.skillswap.dto.MessageDTO;

import java.util.List;
import java.util.UUID;

public interface ChatService {
    MessageDTO savePrivateMessage(UUID senderId, UUID recipientId, String content, String mediaUrl);
    MessageDTO saveGroupMessage(UUID senderId, UUID groupId, String content, String mediaUrl);
    List<MessageDTO> getPrivateChatHistory(UUID userA, UUID userB);
    List<MessageDTO> getGroupChatHistory(UUID groupId);
    void markMessagesAsRead(UUID recipientId, UUID senderId);
    long getUnreadCount(UUID recipientId, UUID senderId);
}
