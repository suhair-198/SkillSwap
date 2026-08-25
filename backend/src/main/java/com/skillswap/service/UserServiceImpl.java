package com.skillswap.service;

import com.skillswap.dto.UserDTO;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.model.ClassAttendance;
import com.skillswap.model.LiveClass;
import com.skillswap.model.SkillPact;
import com.skillswap.model.User;
import com.skillswap.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final LiveClassRepository liveClassRepository;
    private final ClassAttendanceRepository classAttendanceRepository;
    private final SkillPactRepository skillPactRepository;
    private final UserSkillRepository userSkillRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository,
                           LiveClassRepository liveClassRepository,
                           ClassAttendanceRepository classAttendanceRepository,
                           SkillPactRepository skillPactRepository,
                           UserSkillRepository userSkillRepository) {
        this.userRepository = userRepository;
        this.liveClassRepository = liveClassRepository;
        this.classAttendanceRepository = classAttendanceRepository;
        this.skillPactRepository = skillPactRepository;
        this.userSkillRepository = userSkillRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getUserProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserDTO.fromUser(user);
    }

    @Override
    @Transactional
    public UserDTO updateUserProfile(UUID userId, UserDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getProfilePictureUrl() != null) user.setProfilePictureUrl(request.getProfilePictureUrl());
        if (request.getCollege() != null) user.setCollege(request.getCollege());
        if (request.getDepartment() != null) user.setDepartment(request.getDepartment());

        User saved = userRepository.save(user);
        return UserDTO.fromUser(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> getLeaderboard() {
        // Return top 15 users sorted by XP descending
        return userRepository.findAll(Sort.by(Sort.Direction.DESC, "xp")).stream()
                .limit(15)
                .map(UserDTO::fromUser)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getUserAnalytics(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Fetch attended classes
        List<ClassAttendance> attendedRecords = classAttendanceRepository.findByUserId(userId).stream()
                .filter(ClassAttendance::isAttended)
                .collect(Collectors.toList());

        // Fetch conducted classes
        List<LiveClass> conductedClasses = liveClassRepository.findByInstructorId(userId);

        // Fetch pacts
        List<SkillPact> userPacts = skillPactRepository.findPactsForUser(userId);
        long completedPacts = userPacts.stream().filter(p -> "COMPLETED".equals(p.getStatus())).count();
        long activePacts = userPacts.stream().filter(p -> "ACTIVE".equals(p.getStatus())).count();

        // Calculate hours
        double learningHours = attendedRecords.stream()
                .mapToDouble(a -> a.getLiveClass().getDurationMinutes() / 60.0)
                .sum();

        double teachingHours = conductedClasses.stream()
                .mapToDouble(c -> c.getDurationMinutes() / 60.0)
                .sum();

        long skillsKnown = userSkillRepository.findByUserIdAndIsKnown(userId, true).size();
        long skillsWanted = userSkillRepository.findByUserIdAndIsKnown(userId, false).size();

        Map<String, Object> stats = new HashMap<>();
        stats.put("xp", user.getXp());
        stats.put("level", user.getLevel());
        stats.put("reputation", user.getReputation());
        stats.put("streak", user.getCurrentStreak());
        stats.put("classesAttendedCount", attendedRecords.size());
        stats.put("classesConductedCount", conductedClasses.size());
        stats.put("learningHours", Math.round(learningHours * 10.0) / 10.0);
        stats.put("teachingHours", Math.round(teachingHours * 10.0) / 10.0);
        stats.put("pactsCompleted", completedPacts);
        stats.put("pactsActive", activePacts);
        stats.put("skillsKnown", skillsKnown);
        stats.put("skillsWanted", skillsWanted);

        return stats;
    }
}
