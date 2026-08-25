package com.skillswap.service;

import com.skillswap.dto.AddSkillRequest;
import com.skillswap.dto.SkillDTO;
import com.skillswap.dto.UserSkillDTO;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.model.Skill;
import com.skillswap.model.User;
import com.skillswap.model.UserSkill;
import com.skillswap.repository.SkillRepository;
import com.skillswap.repository.UserRepository;
import com.skillswap.repository.UserSkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;
    private final UserRepository userRepository;

    @Autowired
    public SkillServiceImpl(SkillRepository skillRepository,
                            UserSkillRepository userSkillRepository,
                            UserRepository userRepository) {
        this.skillRepository = skillRepository;
        this.userSkillRepository = userSkillRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillDTO> getAllSkills() {
        return skillRepository.findAll().stream()
                .map(SkillDTO::fromSkill)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillDTO> searchSkills(String query) {
        return skillRepository.findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(query, query)
                .stream()
                .map(SkillDTO::fromSkill)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserSkillDTO addSkillToUser(UUID userId, AddSkillRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Skill skill = getOrCreateSkill(request.getSkillName(), request.getCategory());

        Optional<UserSkill> existingUserSkill = userSkillRepository.findByUserIdAndSkillIdAndIsKnown(
                userId, skill.getId(), request.isKnown());

        UserSkill userSkill;
        if (existingUserSkill.isPresent()) {
            userSkill = existingUserSkill.get();
            userSkill.setProficiencyLevel(request.getProficiencyLevel());
        } else {
            userSkill = UserSkill.builder()
                    .user(user)
                    .skill(skill)
                    .proficiencyLevel(request.getProficiencyLevel())
                    .isKnown(request.isKnown())
                    .build();
        }

        UserSkill saved = userSkillRepository.save(userSkill);
        return UserSkillDTO.fromUserSkill(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserSkillDTO> getUserSkills(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }
        return userSkillRepository.findByUserId(userId).stream()
                .map(UserSkillDTO::fromUserSkill)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void removeSkillFromUser(UUID userId, UUID skillId, boolean isKnown) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }
        userSkillRepository.deleteByUserIdAndSkillIdAndIsKnown(userId, skillId, isKnown);
    }

    @Override
    @Transactional
    public Skill getOrCreateSkill(String name, String category) {
        return skillRepository.findByNameIgnoreCase(name.trim())
                .orElseGet(() -> skillRepository.save(
                        Skill.builder()
                                .name(name.trim())
                                .category(category != null ? category.trim() : "Other")
                                .build()
                ));
    }
}
