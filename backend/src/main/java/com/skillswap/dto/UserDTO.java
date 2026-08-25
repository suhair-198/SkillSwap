package com.skillswap.dto;

import com.skillswap.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private UUID id;
    private String email;
    private String fullName;
    private String bio;
    private String profilePictureUrl;
    private String college;
    private String department;
    private int xp;
    private int level;
    private int reputation;
    private int currentStreak;
    private Set<String> roles;

    public static UserDTO fromUser(User user) {
        if (user == null) return null;
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .bio(user.getBio())
                .profilePictureUrl(user.getProfilePictureUrl())
                .college(user.getCollege())
                .department(user.getDepartment())
                .xp(user.getXp())
                .level(user.getLevel())
                .reputation(user.getReputation())
                .currentStreak(user.getCurrentStreak())
                .roles(user.getRoles().stream().map(r -> r.getName()).collect(Collectors.toSet()))
                .build();
    }
}
