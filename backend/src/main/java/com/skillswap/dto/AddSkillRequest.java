package com.skillswap.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddSkillRequest {
    @NotBlank
    private String skillName;

    @NotBlank
    private String category;

    @NotBlank
    private String proficiencyLevel; // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT

    private boolean isKnown; // true = known (teach), false = wanted (learn)
}
