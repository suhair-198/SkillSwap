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

        // 1. Broadcast to recipient & sender topic endpoints for instant reliable delivery
        messagingTemplate.convertAndSend(
                "/topic/user." + request.getRecipientId(),
                savedMessage
        );
        messagingTemplate.convertAndSend(
                "/topic/user." + request.getSenderId(),
                savedMessage
        );

        // 2. Also send to standard queue mappings
        try {
            messagingTemplate.convertAndSendToUser(
                    request.getRecipientId().toString(),
                    "/queue/messages",
                    savedMessage
            );
            messagingTemplate.convertAndSendToUser(
                    request.getSenderId().toString(),
                    "/queue/messages",
                    savedMessage
            );
        } catch (Exception ignored) {}
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
            messagingTemplate.convertAndSend(
                    "/topic/user." + request.getRecipientId() + ".typing",
                    request
            );
            try {
                messagingTemplate.convertAndSendToUser(
                        request.getRecipientId().toString(),
                        "/queue/typing",
                        request
                );
            } catch (Exception ignored) {}
        } else if (request.getGroupId() != null) {
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
