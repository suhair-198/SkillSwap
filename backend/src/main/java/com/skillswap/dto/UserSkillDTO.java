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
    private UUID skillId;
    private String skillName;
    private String category;
    private String proficiencyLevel;
    private boolean isKnown;

    public static UserSkillDTO fromUserSkill(UserSkill userSkill) {
        if (userSkill == null) return null;
        return UserSkillDTO.builder()
                .skillId(userSkill.getSkill().getId())
                .skillName(userSkill.getSkill().getName())
                .category(userSkill.getSkill().getCategory())
                .proficiencyLevel(userSkill.getProficiencyLevel())
                .isKnown(userSkill.isKnown())
                .build();
    }
}
