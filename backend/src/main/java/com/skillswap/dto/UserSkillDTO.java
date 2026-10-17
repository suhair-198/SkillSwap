package com.skillswap.dto;

import com.skillswap.model.UserSkill;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSkillDTO {
    private UUID id;
    private UUID userId;
    private SkillDTO skill;
    private String proficiencyLevel;
    private boolean isKnown;

    public static UserSkillDTO fromUserSkill(UserSkill userSkill) {
        if (userSkill == null) return null;
        return UserSkillDTO.builder()
                .id(userSkill.getId())
                .userId(userSkill.getUser().getId())
                .skill(SkillDTO.fromSkill(userSkill.getSkill()))
                .proficiencyLevel(userSkill.getProficiencyLevel())
                .isKnown(userSkill.isKnown())
                .build();
    }
}
