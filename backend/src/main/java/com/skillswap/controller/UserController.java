package com.skillswap.controller;

import com.skillswap.dto.UserDTO;
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

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
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

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getUserAnalytics(@AuthenticationPrincipal UserPrincipal principal) {
        Map<String, Object> analytics = userService.getUserAnalytics(principal.getId());
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/analytics/{userId}")
    public ResponseEntity<Map<String, Object>> getPeerAnalytics(@PathVariable UUID userId) {
        Map<String, Object> analytics = userService.getUserAnalytics(userId);
        return ResponseEntity.ok(analytics);
    }
}
