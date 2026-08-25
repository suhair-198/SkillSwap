package com.skillswap.controller;

import com.skillswap.dto.MessageDTO;
import com.skillswap.security.UserPrincipal;
import com.skillswap.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    @Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
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
