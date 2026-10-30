package com.skillswap.repository;

import com.skillswap.model.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, UUID> {
    List<UserSkill> findByUserId(UUID userId);
    List<UserSkill> findByUserIdAndIsKnown(UUID userId, boolean isKnown);
    List<SkillIdOnly> findSkillIdsByUserId(UUID userId);
    List<UserSkill> findBySkillIdAndIsKnown(UUID skillId, boolean isKnown);
    Optional<UserSkill> findByUserIdAndSkillIdAndIsKnown(UUID userId, UUID skillId, boolean isKnown);
    void deleteByUserIdAndSkillIdAndIsKnown(UUID userId, UUID skillId, boolean isKnown);
    
    // Find who teaches skills that a specific user wants
    List<UserSkill> findBySkillIdInAndIsKnown(List<UUID> skillIds, boolean isKnown);

    @Query("SELECT us FROM UserSkill us JOIN FETCH us.skill JOIN FETCH us.user u WHERE u.id != :userId")
    List<UserSkill> findAllSkillsForPeers(@Param("userId") UUID userId);

    interface SkillIdOnly {
        UUID getSkillId();
    }
}
