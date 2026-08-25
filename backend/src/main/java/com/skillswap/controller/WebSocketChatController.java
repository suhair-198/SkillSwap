package com.skillswap.controller;

import com.skillswap.dto.MessageDTO;
import com.skillswap.dto.MessageRequest;
import com.skillswap.dto.TypingRequest;
import com.skillswap.dto.UserStatusRequest;
import com.skillswap.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    @Autowired
    public WebSocketChatController(SimpMessagingTemplate messagingTemplate, ChatService chatService) {
        this.messagingTemplate = messagingTemplate;
        this.chatService = chatService;
    }

    @MessageMapping("/chat.sendPrivate")
    public void sendPrivateMessage(MessageRequest request) {
        MessageDTO savedMessage = chatService.savePrivateMessage(
                request.getSenderId(),
                request.getRecipientId(),
                request.getContent(),
                request.getMediaUrl()
        );

        // Send to recipient's queue: /user/{recipientId}/queue/messages
        messagingTemplate.convertAndSendToUser(
                request.getRecipientId().toString(),
                "/queue/messages",
                savedMessage
        );

        // Send confirmation back to sender's queue: /user/{senderId}/queue/messages
        messagingTemplate.convertAndSendToUser(
                request.getSenderId().toString(),
                "/queue/messages",
                savedMessage
        );
    }

    @MessageMapping("/chat.sendGroup")
    public void sendGroupMessage(MessageRequest request) {
        MessageDTO savedMessage = chatService.saveGroupMessage(
                request.getSenderId(),
                request.getGroupId(),
                request.getContent(),
                request.getMediaUrl()
        );

        // Broadcast to group topic: /topic/group.{groupId}
        messagingTemplate.convertAndSend(
                "/topic/group." + request.getGroupId(),
                savedMessage
        );
    }

    @MessageMapping("/chat.typing")
    public void handleTyping(TypingRequest request) {
        if (request.getRecipientId() != null) {
            // Route private typing indicator to the recipient: /user/{recipientId}/queue/typing
            messagingTemplate.convertAndSendToUser(
                    request.getRecipientId().toString(),
                    "/queue/typing",
                    request
            );
        } else if (request.getGroupId() != null) {
            // Broadcast group typing indicator to group topic: /topic/group.{groupId}.typing
            messagingTemplate.convertAndSend(
                    "/topic/group." + request.getGroupId() + ".typing",
                    request
            );
        }
    }

    @MessageMapping("/chat.status")
    public void handleStatusUpdate(UserStatusRequest request) {
        // Broadcast user online status to all subscribers: /topic/status
        messagingTemplate.convertAndSend("/topic/status", request);
    }
}
