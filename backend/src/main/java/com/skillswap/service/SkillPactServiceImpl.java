package com.skillswap.service;

import com.skillswap.dto.CreatePactRequest;
import com.skillswap.dto.SkillPactDTO;
import com.skillswap.exception.BadRequestException;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.model.Skill;
import com.skillswap.model.SkillPact;
import com.skillswap.model.User;
import com.skillswap.repository.SkillPactRepository;
import com.skillswap.repository.SkillRepository;
import com.skillswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SkillPactServiceImpl implements SkillPactService {

    private final SkillPactRepository skillPactRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;

    @Autowired
    public SkillPactServiceImpl(SkillPactRepository skillPactRepository,
                                UserRepository userRepository,
                                SkillRepository skillRepository) {
        this.skillPactRepository = skillPactRepository;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
    }

    @Override
    @Transactional
    public SkillPactDTO requestPact(UUID userAId, CreatePactRequest request) {
        if (userAId.equals(request.getUserBId())) {
            throw new BadRequestException("You cannot create a Skill Pact with yourself!");
        }

        User userA = userRepository.findById(userAId)
                .orElseThrow(() -> new ResourceNotFoundException("Initiator user not found"));
        User userB = userRepository.findById(request.getUserBId())
                .orElseThrow(() -> new ResourceNotFoundException("Peer user not found"));

        Skill skillA = skillRepository.findById(request.getSkillAId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill A not found"));
        Skill skillB = skillRepository.findById(request.getSkillBId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill B not found"));

        SkillPact pact = SkillPact.builder()
                .userA(userA)
                .userB(userB)
                .skillA(skillA)
                .skillB(skillB)
                .status("REQUESTED")
                .goals(request.getGoals())
                .sessionsCount(0)
                .build();

        SkillPact saved = skillPactRepository.save(pact);
        return SkillPactDTO.fromSkillPact(saved);
    }

    @Override
    @Transactional
    public SkillPactDTO acceptPact(UUID userBId, UUID pactId) {
        SkillPact pact = skillPactRepository.findById(pactId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill Pact not found"));

        if (!pact.getUserB().getId().equals(userBId)) {
            throw new BadRequestException("You are not authorized to accept this Skill Pact!");
        }

        if (!"REQUESTED".equals(pact.getStatus())) {
            throw new BadRequestException("Pact request must be in REQUESTED status to be accepted!");
        }

        pact.setStatus("ACTIVE");
        SkillPact saved = skillPactRepository.save(pact);

        // Gamification: Reward both for starting a barter pact
        User userA = pact.getUserA();
        User userB = pact.getUserB();
        
        userA.setXp(userA.getXp() + 10);
        userB.setXp(userB.getXp() + 10);

        userRepository.save(userA);
        userRepository.save(userB);

        return SkillPactDTO.fromSkillPact(saved);
    }

    @Override
    @Transactional
    public SkillPactDTO declinePact(UUID userBId, UUID pactId) {
        SkillPact pact = skillPactRepository.findById(pactId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill Pact not found"));

        if (!pact.getUserB().getId().equals(userBId)) {
            throw new BadRequestException("You are not authorized to decline this Skill Pact!");
        }

        if (!"REQUESTED".equals(pact.getStatus())) {
            throw new BadRequestException("Pact request must be in REQUESTED status to be declined!");
        }

        pact.setStatus("CANCELLED");
        SkillPact saved = skillPactRepository.save(pact);
        return SkillPactDTO.fromSkillPact(saved);
    }

    @Override
    @Transactional
    public SkillPactDTO completePact(UUID userId, UUID pactId) {
        SkillPact pact = skillPactRepository.findById(pactId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill Pact not found"));

        if (!pact.getUserA().getId().equals(userId) && !pact.getUserB().getId().equals(userId)) {
            throw new BadRequestException("You are not part of this Skill Pact!");
        }

        if (!"ACTIVE".equals(pact.getStatus())) {
            throw new BadRequestException("Pact must be in ACTIVE status to be completed!");
        }

        pact.setStatus("COMPLETED");
        SkillPact saved = skillPactRepository.save(pact);

        // Gamification: Large rewards on complete pact!
        User userA = pact.getUserA();
        User userB = pact.getUserB();

        addXpAndReputation(userA, 50, 10);
        addXpAndReputation(userB, 50, 10);

        userRepository.save(userA);
        userRepository.save(userB);

        return SkillPactDTO.fromSkillPact(saved);
    }

    @Override
    @Transactional
    public SkillPactDTO incrementSessions(UUID userId, UUID pactId) {
        SkillPact pact = skillPactRepository.findById(pactId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill Pact not found"));

        if (!pact.getUserA().getId().equals(userId) && !pact.getUserB().getId().equals(userId)) {
            throw new BadRequestException("You are not part of this Skill Pact!");
        }

        if (!"ACTIVE".equals(pact.getStatus())) {
            throw new BadRequestException("Pact must be in ACTIVE status to log sessions!");
        }

        pact.setSessionsCount(pact.getSessionsCount() + 1);
        SkillPact saved = skillPactRepository.save(pact);

        // Award session logged XP
        User userA = pact.getUserA();
        User userB = pact.getUserB();

        userA.setXp(userA.getXp() + 15);
        userB.setXp(userB.getXp() + 15);
        
        // Streak updating
        updateStreak(userA);
        updateStreak(userB);

        userRepository.save(userA);
        userRepository.save(userB);

        return SkillPactDTO.fromSkillPact(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillPactDTO> getPactsForUser(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }
        return skillPactRepository.findPactsForUser(userId).stream()
                .map(SkillPactDTO::fromSkillPact)
                .collect(Collectors.toList());
    }

    private void addXpAndReputation(User user, int xpAmount, int repAmount) {
        user.setXp(user.getXp() + xpAmount);
        user.setReputation(user.getReputation() + repAmount);
        int newLevel = (user.getXp() / 100) + 1;
        if (newLevel > user.getLevel()) {
            user.setLevel(newLevel);
        }
    }

    private void updateStreak(User user) {
        // Increment streak count on activity
        user.setCurrentStreak(user.getCurrentStreak() + 1);
    }
}
