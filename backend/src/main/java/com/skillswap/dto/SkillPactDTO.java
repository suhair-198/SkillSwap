package com.skillswap.dto;

import com.skillswap.model.SkillPact;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillPactDTO {
    private UUID id;
    private UserDTO userA;
    private UserDTO userB;
    private SkillDTO skillA;
    private SkillDTO skillB;
    private String status;
    private String goals;
    private int sessionsCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static SkillPactDTO fromSkillPact(SkillPact pact) {
        if (pact == null) return null;
        return SkillPactDTO.builder()
                .id(pact.getId())
                .userA(UserDTO.fromUser(pact.getUserA()))
                .userB(UserDTO.fromUser(pact.getUserB()))
                .skillA(SkillDTO.fromSkill(pact.getSkillA()))
                .skillB(SkillDTO.fromSkill(pact.getSkillB()))
                .status(pact.getStatus())
                .goals(pact.getGoals())
                .sessionsCount(pact.getSessionsCount())
                .createdAt(pact.getCreatedAt())
                .updatedAt(pact.getUpdatedAt())
                .build();
    }
}
