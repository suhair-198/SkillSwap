package com.skillswap.dto;

import com.skillswap.model.Skill;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillDTO {
    private UUID id;
    private String name;
    private String category;

    public static SkillDTO fromSkill(Skill skill) {
        if (skill == null) return null;
        return SkillDTO.builder()
                .id(skill.getId())
                .name(skill.getName())
                .category(skill.getCategory())
                .build();
    }
}
