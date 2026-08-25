package com.skillswap.repository;

import com.skillswap.model.ClassAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClassAttendanceRepository extends JpaRepository<ClassAttendance, UUID> {
    List<ClassAttendance> findByLiveClassId(UUID classId);
    List<ClassAttendance> findByUserId(UUID userId);
    Optional<ClassAttendance> findByLiveClassIdAndUserId(UUID classId, UUID userId);
    boolean existsByLiveClassIdAndUserId(UUID classId, UUID userId);
}
