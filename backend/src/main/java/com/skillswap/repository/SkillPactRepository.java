package com.skillswap.repository;

import com.skillswap.model.SkillPact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SkillPactRepository extends JpaRepository<SkillPact, UUID> {
    
    @Query("SELECT p FROM SkillPact p WHERE p.userA.id = :userId OR p.userB.id = :userId")
    List<SkillPact> findPactsForUser(@Param("userId") UUID userId);
    
    List<SkillPact> findByUserAIdAndStatus(UUID userAId, String status);
    List<SkillPact> findByUserBIdAndStatus(UUID userBId, String status);
}
