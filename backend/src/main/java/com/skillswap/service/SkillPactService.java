package com.skillswap.service;

import com.skillswap.dto.CreatePactRequest;
import com.skillswap.dto.SkillPactDTO;

import java.util.List;
import java.util.UUID;

public interface SkillPactService {
    SkillPactDTO requestPact(UUID userAId, CreatePactRequest request);
    SkillPactDTO acceptPact(UUID userBId, UUID pactId);
    SkillPactDTO declinePact(UUID userBId, UUID pactId);
    SkillPactDTO completePact(UUID userId, UUID pactId);
    SkillPactDTO incrementSessions(UUID userId, UUID pactId);
    List<SkillPactDTO> getPactsForUser(UUID userId);
}
