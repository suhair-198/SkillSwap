package com.skillswap.repository;

import com.skillswap.model.LiveClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LiveClassRepository extends JpaRepository<LiveClass, UUID> {
    List<LiveClass> findByGroupId(UUID groupId);
    List<LiveClass> findByInstructorId(UUID instructorId);
    
    @Query("SELECT c FROM LiveClass c ORDER BY c.startTime DESC")
    List<LiveClass> findAllOrderByStartTimeDesc();
}
