package com.skillswap.service;

import com.skillswap.dto.AddSkillRequest;
import com.skillswap.dto.SkillDTO;
import com.skillswap.dto.UserSkillDTO;
import com.skillswap.model.Skill;

import java.util.List;
import java.util.UUID;

public interface SkillService {
    List<SkillDTO> getAllSkills();
    List<SkillDTO> searchSkills(String query);
    UserSkillDTO addSkillToUser(UUID userId, AddSkillRequest request);
    List<UserSkillDTO> getUserSkills(UUID userId);
    void removeSkillFromUser(UUID userId, UUID skillId, boolean isKnown);
    Skill getOrCreateSkill(String name, String category);
}
