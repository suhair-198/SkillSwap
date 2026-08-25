package com.skillswap.repository;

import com.skillswap.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GroupRepository extends JpaRepository<Group, UUID> {
    List<Group> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT g FROM Group g WHERE g.isPrivate = false")
    List<Group> findAllPublicGroups();
}
