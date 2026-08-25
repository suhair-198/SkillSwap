package com.skillswap.service;

import com.skillswap.dto.*;

import java.util.List;
import java.util.UUID;

public interface LiveClassService {
    LiveClassDTO scheduleClass(UUID instructorId, CreateClassRequest request);
    void registerForClass(UUID userId, UUID classId);
    void markAttendance(UUID classId, UUID userId, boolean attended);
    ClassFeedbackDTO submitFeedback(UUID userId, UUID classId, ClassFeedbackRequest request);
    LiveClassDTO getClassDetails(UUID classId);
    List<LiveClassDTO> getUpcomingClasses();
    List<LiveClassDTO> getGroupClasses(UUID groupId);
    List<ClassFeedbackDTO> getClassFeedback(UUID classId);
}
