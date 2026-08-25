package com.skillswap.service;

import com.skillswap.dto.MatchResponse;
import com.skillswap.dto.SkillDTO;
import com.skillswap.dto.UserDTO;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.model.Skill;
import com.skillswap.model.User;
import com.skillswap.model.UserSkill;
import com.skillswap.repository.UserRepository;
import com.skillswap.repository.UserSkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MatchingServiceImpl implements MatchingService {

    private final UserRepository userRepository;
    private final UserSkillRepository userSkillRepository;

    @Autowired
    public MatchingServiceImpl(UserRepository userRepository, UserSkillRepository userSkillRepository) {
        this.userRepository = userRepository;
        this.userSkillRepository = userSkillRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MatchResponse> findMatches(UUID userId) {
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Fetch current user's skills
        List<UserSkill> currentUserSkills = userSkillRepository.findByUserId(userId);
        
        List<Skill> myKnownSkills = currentUserSkills.stream()
                .filter(UserSkill::isKnown)
                .map(UserSkill::getSkill)
                .collect(Collectors.toList());

        List<Skill> myWantedSkills = currentUserSkills.stream()
                .filter(us -> !us.isKnown())
                .map(UserSkill::getSkill)
                .collect(Collectors.toList());

        if (myKnownSkills.isEmpty() && myWantedSkills.isEmpty()) {
            return Collections.emptyList();
        }

        // Fetch all other users and their skills
        List<User> allUsers = userRepository.findAll().stream()
                .filter(u -> !u.getId().equals(userId))
                .collect(Collectors.toList());

        List<MatchResponse> matches = new ArrayList<>();

        for (User peer : allUsers) {
            List<UserSkill> peerSkills = userSkillRepository.findByUserId(peer.getId());
            if (peerSkills.isEmpty()) {
                continue;
            }

            List<Skill> peerKnownSkills = peerSkills.stream()
                    .filter(UserSkill::isKnown)
                    .map(UserSkill::getSkill)
                    .collect(Collectors.toList());

            List<Skill> peerWantedSkills = peerSkills.stream()
                    .filter(us -> !us.isKnown())
                    .map(UserSkill::getSkill)
                    .collect(Collectors.toList());

            // 1. Peer teaches what I want
            List<Skill> teachToMe = new ArrayList<>(myWantedSkills);
            teachToMe.retainAll(peerKnownSkills);

            // 2. I teach what peer wants
            List<Skill> wantFromMe = new ArrayList<>(myKnownSkills);
            wantFromMe.retainAll(peerWantedSkills);

            // 3. Shared interests (both want to learn this)
            List<Skill> sharedWants = new ArrayList<>(myWantedSkills);
            sharedWants.retainAll(peerWantedSkills);

            double score = 0.0;

            if (!myWantedSkills.isEmpty()) {
                // If peer knows everything I want, get 50 points
                score += 50.0 * ((double) teachToMe.size() / myWantedSkills.size());
            }
            if (!peerWantedSkills.isEmpty()) {
                // If I know everything peer wants, get 30 points
                score += 30.0 * ((double) wantFromMe.size() / peerWantedSkills.size());
            }
            if (!myWantedSkills.isEmpty() || !peerWantedSkills.isEmpty()) {
                int totalUniqueWants = new HashSet<>(myWantedSkills).size();
                if (totalUniqueWants > 0) {
                    score += 20.0 * ((double) sharedWants.size() / totalUniqueWants);
                }
            }

            // Reputation adjustment (reputation / 100 up to max 5 bonus points)
            score += Math.min(5.0, peer.getReputation() / 20.0);

            // Cap the matching score at 100
            score = Math.min(100.0, score);

            if (score > 0) {
                matches.add(MatchResponse.builder()
                        .peer(UserDTO.fromUser(peer))
                        .matchingScore(Math.round(score * 10.0) / 10.0)
                        .skillsTeachedByPeer(teachToMe.stream().map(SkillDTO::fromSkill).collect(Collectors.toList()))
                        .skillsWantedByPeer(wantFromMe.stream().map(SkillDTO::fromSkill).collect(Collectors.toList()))
                        .sharedSkills(sharedWants.stream().map(SkillDTO::fromSkill).collect(Collectors.toList()))
                        .build());
            }
        }

        // Sort descending by matching score
        matches.sort((m1, m2) -> Double.compare(m2.getMatchingScore(), m1.getMatchingScore()));

        return matches;
    }
}
