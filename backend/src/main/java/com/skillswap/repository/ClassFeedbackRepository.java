package com.skillswap.repository;

import com.skillswap.model.ClassFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClassFeedbackRepository extends JpaRepository<ClassFeedback, UUID> {
    List<ClassFeedback> findByLiveClassId(UUID classId);
    Optional<ClassFeedback> findByLiveClassIdAndUserId(UUID classId, UUID userId);
}
