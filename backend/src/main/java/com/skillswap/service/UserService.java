package com.skillswap.service;

import com.skillswap.dto.UserDTO;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface UserService {
    UserDTO getUserProfile(UUID userId);
    UserDTO updateUserProfile(UUID userId, UserDTO request);
    List<UserDTO> getLeaderboard();
    Map<String, Object> getUserAnalytics(UUID userId);
}
