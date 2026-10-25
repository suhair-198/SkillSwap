package com.skillswap.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
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

    @JsonProperty("isKnown")
    @JsonAlias({"known", "isKnown"})
    private boolean isKnown; // true = known (teach), false = wanted (learn)

    public void setKnown(boolean known) {
        this.isKnown = known;
    }

    public void setIsKnown(boolean isKnown) {
        this.isKnown = isKnown;
    }
}
