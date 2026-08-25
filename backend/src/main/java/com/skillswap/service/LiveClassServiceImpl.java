package com.skillswap.service;

import com.skillswap.dto.*;
import com.skillswap.exception.BadRequestException;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.model.*;
import com.skillswap.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class LiveClassServiceImpl implements LiveClassService {

    private final LiveClassRepository liveClassRepository;
    private final ClassAttendanceRepository classAttendanceRepository;
    private final ClassFeedbackRepository classFeedbackRepository;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;

    @Autowired
    public LiveClassServiceImpl(LiveClassRepository liveClassRepository,
                                ClassAttendanceRepository classAttendanceRepository,
                                ClassFeedbackRepository classFeedbackRepository,
                                UserRepository userRepository,
                                GroupRepository groupRepository) {
        this.liveClassRepository = liveClassRepository;
        this.classAttendanceRepository = classAttendanceRepository;
        this.classFeedbackRepository = classFeedbackRepository;
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
    }

    @Override
    @Transactional
    public LiveClassDTO scheduleClass(UUID instructorId, CreateClassRequest request) {
        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found"));

        Group group = null;
        if (request.getGroupId() != null) {
            group = groupRepository.findById(request.getGroupId())
                    .orElseThrow(() -> new ResourceNotFoundException("Group not found"));
        }

        LiveClass liveClass = LiveClass.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .instructor(instructor)
                .group(group)
                .startTime(request.getStartTime())
                .durationMinutes(request.getDurationMinutes())
                .meetingPlatform(request.getMeetingPlatform())
                .meetingUrl(request.getMeetingUrl())
                .build();

        LiveClass savedClass = liveClassRepository.save(liveClass);

        // Gamification: Reward instructor for scheduling a class (sharing knowledge)
        instructor.setXp(instructor.getXp() + 30);
        userRepository.save(instructor);

        return LiveClassDTO.fromLiveClass(savedClass, 0);
    }

    @Override
    @Transactional
    public void registerForClass(UUID userId, UUID classId) {
        LiveClass liveClass = liveClassRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (liveClass.getInstructor().getId().equals(userId)) {
            throw new BadRequestException("Instructors do not need to register for their own class!");
        }

        if (classAttendanceRepository.existsByLiveClassIdAndUserId(classId, userId)) {
            throw new BadRequestException("You are already registered for this class!");
        }

        ClassAttendance attendance = ClassAttendance.builder()
                .liveClass(liveClass)
                .user(user)
                .attended(false)
                .build();

        classAttendanceRepository.save(attendance);

        // Gamification: Reward user with a small registration XP
        user.setXp(user.getXp() + 5);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void markAttendance(UUID classId, UUID userId, boolean attended) {
        ClassAttendance attendance = classAttendanceRepository.findByLiveClassIdAndUserId(classId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration record not found for user in this class"));

        boolean previouslyAttended = attendance.isAttended();
        attendance.setAttended(attended);
        classAttendanceRepository.save(attendance);

        // Gamification details: if attendance marked true and was false
        if (attended && !previouslyAttended) {
            User student = attendance.getUser();
            student.setXp(student.getXp() + 20); // +20 XP for attending class
            userRepository.save(student);

            // Reward Instructor +10 XP for teaching a student
            User instructor = attendance.getLiveClass().getInstructor();
            instructor.setXp(instructor.getXp() + 10);
            userRepository.save(instructor);
        }
    }

    @Override
    @Transactional
    public ClassFeedbackDTO submitFeedback(UUID userId, UUID classId, ClassFeedbackRequest request) {
        LiveClass liveClass = liveClassRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Verify user registered/attended
        if (!classAttendanceRepository.existsByLiveClassIdAndUserId(classId, userId)) {
            throw new BadRequestException("You must be registered for this class to leave feedback!");
        }

        ClassFeedback feedback = classFeedbackRepository.findByLiveClassIdAndUserId(classId, userId)
                .orElseGet(() -> ClassFeedback.builder()
                        .liveClass(liveClass)
                        .user(user)
                        .build());

        feedback.setRating(request.getRating());
        feedback.setComments(request.getComments());
        ClassFeedback saved = classFeedbackRepository.save(feedback);

        // Gamification: Update Instructor's Reputation based on rating
        User instructor = liveClass.getInstructor();
        int ratingImpact = request.getRating() - 3; // 5 -> +2, 4 -> +1, 3 -> 0, 2 -> -1, 1 -> -2
        instructor.setReputation(Math.max(0, instructor.getReputation() + ratingImpact));
        userRepository.save(instructor);

        // Reward student for submitting feedback (+5 XP)
        user.setXp(user.getXp() + 5);
        userRepository.save(user);

        return ClassFeedbackDTO.fromFeedback(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public LiveClassDTO getClassDetails(UUID classId) {
        LiveClass liveClass = liveClassRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));
        long count = classAttendanceRepository.findByLiveClassId(classId).size();
        return LiveClassDTO.fromLiveClass(liveClass, count);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LiveClassDTO> getUpcomingClasses() {
        return liveClassRepository.findAllOrderByStartTimeDesc().stream()
                .map(c -> {
                    long count = classAttendanceRepository.findByLiveClassId(c.getId()).size();
                    return LiveClassDTO.fromLiveClass(c, count);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<LiveClassDTO> getGroupClasses(UUID groupId) {
        if (!groupRepository.existsById(groupId)) {
            throw new ResourceNotFoundException("Group not found");
        }
        return liveClassRepository.findByGroupId(groupId).stream()
                .map(c -> {
                    long count = classAttendanceRepository.findByLiveClassId(c.getId()).size();
                    return LiveClassDTO.fromLiveClass(c, count);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassFeedbackDTO> getClassFeedback(UUID classId) {
        if (!liveClassRepository.existsById(classId)) {
            throw new ResourceNotFoundException("Class not found");
        }
        return classFeedbackRepository.findByLiveClassId(classId).stream()
                .map(ClassFeedbackDTO::fromFeedback)
                .collect(Collectors.toList());
    }
}
