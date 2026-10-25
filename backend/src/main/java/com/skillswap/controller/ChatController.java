package com.skillswap.controller;

import com.skillswap.dto.MessageDTO;
import com.skillswap.dto.MessageRequest;
import com.skillswap.exception.BadRequestException;
import com.skillswap.security.UserPrincipal;
import com.skillswap.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public ChatController(ChatService chatService, SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    @PostMapping("/send")
    public ResponseEntity<MessageDTO> sendMessage(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestBody MessageRequest request) {
        MessageDTO savedMessage;
        if (request.getRecipientId() != null) {
            savedMessage = chatService.savePrivateMessage(
                    principal.getId(),
                    request.getRecipientId(),
                    request.getContent(),
                    request.getMediaUrl()
            );
            
            // Broadcast in real-time over topic for instant reliable client delivery
            messagingTemplate.convertAndSend("/topic/user." + request.getRecipientId(), savedMessage);
            messagingTemplate.convertAndSend("/topic/user." + principal.getId(), savedMessage);
            try {
                messagingTemplate.convertAndSendToUser(request.getRecipientId().toString(), "/queue/messages", savedMessage);
                messagingTemplate.convertAndSendToUser(principal.getId().toString(), "/queue/messages", savedMessage);
            } catch (Exception ignored) {}
        } else if (request.getGroupId() != null) {
            savedMessage = chatService.saveGroupMessage(
                    principal.getId(),
                    request.getGroupId(),
                    request.getContent(),
                    request.getMediaUrl()
            );
            messagingTemplate.convertAndSend("/topic/group." + request.getGroupId(), savedMessage);
        } else {
            throw new BadRequestException("Either recipientId or groupId must be provided");
        }
        return ResponseEntity.ok(savedMessage);
    }

    @GetMapping("/direct/{userId}")
    public ResponseEntity<List<MessageDTO>> getDirectHistory(@AuthenticationPrincipal UserPrincipal principal,
                                                             @PathVariable UUID userId) {
        List<MessageDTO> messages = chatService.getPrivateChatHistory(principal.getId(), userId);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<MessageDTO>> getGroupHistory(@AuthenticationPrincipal UserPrincipal principal,
                                                            @PathVariable UUID groupId) {
        List<MessageDTO> messages = chatService.getGroupChatHistory(groupId);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/unread/{senderId}")
    public ResponseEntity<Long> getUnreadCount(@AuthenticationPrincipal UserPrincipal principal,
                                               @PathVariable UUID senderId) {
        long count = chatService.getUnreadCount(principal.getId(), senderId);
        return ResponseEntity.ok(count);
    }

    @PostMapping("/read/{senderId}")
    public ResponseEntity<Void> markAsRead(@AuthenticationPrincipal UserPrincipal principal,
                                           @PathVariable UUID senderId) {
        chatService.markMessagesAsRead(principal.getId(), senderId);
        return ResponseEntity.ok().build();
    }
}
