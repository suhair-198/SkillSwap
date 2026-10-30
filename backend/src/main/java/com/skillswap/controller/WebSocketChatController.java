package com.skillswap.controller;

import com.skillswap.dto.MessageDTO;
import com.skillswap.dto.MessageRequest;
import com.skillswap.dto.TypingRequest;
import com.skillswap.dto.UserStatusRequest;
import com.skillswap.security.UserPrincipal;
import com.skillswap.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.UUID;

@Controller
public class WebSocketChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    @Autowired
    public WebSocketChatController(SimpMessagingTemplate messagingTemplate, ChatService chatService) {
        this.messagingTemplate = messagingTemplate;
        this.chatService = chatService;
    }

    private UUID getAuthenticatedUserId(Principal principal) {
        if (principal instanceof UsernamePasswordAuthenticationToken) {
            Object p = ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
            if (p instanceof UserPrincipal) {
                return ((UserPrincipal) p).getId();
            }
        }
        throw new AccessDeniedException("Unauthenticated WebSocket client");
    }

    @MessageMapping("/chat.sendPrivate")
    public void sendPrivateMessage(MessageRequest request, Principal principal) {
        UUID authenticatedSenderId = getAuthenticatedUserId(principal);

        MessageDTO savedMessage = chatService.savePrivateMessage(
                authenticatedSenderId,
                request.getRecipientId(),
                request.getContent(),
                request.getMediaUrl()
        );

        // 1. Broadcast to recipient & sender topic endpoints for instant delivery
        messagingTemplate.convertAndSend(
                "/topic/user." + request.getRecipientId(),
                savedMessage
        );
        messagingTemplate.convertAndSend(
                "/topic/user." + authenticatedSenderId,
                savedMessage
        );

        // 2. Also send to standard user queue mappings
        try {
            messagingTemplate.convertAndSendToUser(
                    request.getRecipientId().toString(),
                    "/queue/messages",
                    savedMessage
            );
            messagingTemplate.convertAndSendToUser(
                    authenticatedSenderId.toString(),
                    "/queue/messages",
                    savedMessage
            );
        } catch (Exception ignored) {}
    }

    @MessageMapping("/chat.sendGroup")
    public void sendGroupMessage(MessageRequest request, Principal principal) {
        UUID authenticatedSenderId = getAuthenticatedUserId(principal);

        MessageDTO savedMessage = chatService.saveGroupMessage(
                authenticatedSenderId,
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
    public void handleTyping(TypingRequest request, Principal principal) {
        UUID authenticatedSenderId = getAuthenticatedUserId(principal);
        request.setSenderId(authenticatedSenderId);

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
    public void handleStatusUpdate(UserStatusRequest request, Principal principal) {
        UUID authenticatedSenderId = getAuthenticatedUserId(principal);
        request.setUserId(authenticatedSenderId);
        messagingTemplate.convertAndSend("/topic/status", request);
    }
}
