package com.skillswap.controller;

import com.skillswap.dto.UserDTO;
import com.skillswap.exception.BadRequestException;
import com.skillswap.model.ConnectionStatus;
import com.skillswap.repository.ConnectionRepository;
import com.skillswap.security.UserPrincipal;
import com.skillswap.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final ConnectionRepository connectionRepository;

    @Autowired
    public UserController(UserService userService, ConnectionRepository connectionRepository) {
        this.userService = userService;
        this.connectionRepository = connectionRepository;
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<UserDTO> getUserProfile(@PathVariable UUID id) {
        UserDTO userDTO = userService.getUserProfile(id);
        return ResponseEntity.ok(userDTO);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDTO> updateUserProfile(@AuthenticationPrincipal UserPrincipal principal,
                                                     @RequestBody UserDTO userDTO) {
        UserDTO updated = userService.updateUserProfile(principal.getId(), userDTO);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<UserDTO>> getLeaderboard() {
        List<UserDTO> leaderboard = userService.getLeaderboard();
        return ResponseEntity.ok(leaderboard);
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserDTO>> searchUsers(@AuthenticationPrincipal UserPrincipal principal,
                                                     @RequestParam(required = false) String query) {
        List<UserDTO> users = userService.searchUsers(principal.getId(), query);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getUserAnalytics(@AuthenticationPrincipal UserPrincipal principal) {
        Map<String, Object> analytics = userService.getUserAnalytics(principal.getId());
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/analytics/{userId}")
    public ResponseEntity<Map<String, Object>> getPeerAnalytics(@AuthenticationPrincipal UserPrincipal principal,
                                                                @PathVariable UUID userId) {
        if (!principal.getId().equals(userId)) {
            boolean isConnected = connectionRepository.findConnectionBetween(principal.getId(), userId)
                    .map(c -> ConnectionStatus.ACCEPTED.equals(c.getStatus()))
                    .orElse(false);
            if (!isConnected) {
                throw new BadRequestException("You can only view detailed analytics for yourself or accepted connections.");
            }
        }
        Map<String, Object> analytics = userService.getUserAnalytics(userId);
        return ResponseEntity.ok(analytics);
    }
}
