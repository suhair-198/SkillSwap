package com.skillswap.repository;

import com.skillswap.model.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, UUID> {
    List<GroupMember> findByGroupId(UUID groupId);
    List<GroupMember> findByUserId(UUID userId);
    Optional<GroupMember> findByGroupIdAndUserId(UUID groupId, UUID userId);
    boolean existsByGroupIdAndUserId(UUID groupId, UUID userId);
    void deleteByGroupIdAndUserId(UUID groupId, UUID userId);
    
    long countByGroupId(UUID groupId);

    @Query("SELECT gm FROM GroupMember gm JOIN FETCH gm.group g JOIN FETCH g.creator WHERE gm.user.id = :userId")
    List<GroupMember> findByUserIdWithGroupAndCreator(@Param("userId") UUID userId);
}
