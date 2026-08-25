package com.skillswap.repository;

import com.skillswap.model.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, UUID> {
    List<UserSkill> findByUserId(UUID userId);
    List<UserSkill> findByUserIdAndIsKnown(UUID userId, boolean isKnown);
    List<UserSkill> findBySkillIdAndIsKnown(UUID skillId, boolean isKnown);
    Optional<UserSkill> findByUserIdAndSkillIdAndIsKnown(UUID userId, UUID skillId, boolean isKnown);
    void deleteByUserIdAndSkillIdAndIsKnown(UUID userId, UUID skillId, boolean isKnown);
    
    // Find who teaches skills that a specific user wants
    List<UserSkill> findBySkillIdInAndIsKnown(List<UUID> skillIds, boolean isKnown);
}
