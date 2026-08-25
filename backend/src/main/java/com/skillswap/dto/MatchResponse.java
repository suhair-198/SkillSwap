package com.skillswap.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchResponse {
    private UserDTO peer;
    private double matchingScore; // 0 to 100
    private List<SkillDTO> sharedSkills; // Skills both are interested in
    private List<SkillDTO> skillsTeachedByPeer; // Skills they teach that you want
    private List<SkillDTO> skillsWantedByPeer; // Skills they want that you teach
}
