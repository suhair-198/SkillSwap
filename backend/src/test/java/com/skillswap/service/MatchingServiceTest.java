package com.skillswap.service;

import com.skillswap.dto.MatchResponse;
import com.skillswap.model.Skill;
import com.skillswap.model.User;
import com.skillswap.model.UserSkill;
import com.skillswap.repository.UserRepository;
import com.skillswap.repository.UserSkillRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MatchingServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserSkillRepository userSkillRepository;

    @InjectMocks
    private MatchingServiceImpl matchingService;

    private User currentUser;
    private User peerUser;
    private Skill javaSkill;
    private Skill pythonSkill;

    @BeforeEach
    void setUp() {
        currentUser = User.builder()
                .fullName("Alice")
                .email("alice@test.com")
                .reputation(10)
                .build();
        currentUser.setId(UUID.randomUUID());

        peerUser = User.builder()
                .fullName("Bob")
                .email("bob@test.com")
                .reputation(20)
                .build();
        peerUser.setId(UUID.randomUUID());

        javaSkill = Skill.builder().name("Java").build();
        javaSkill.setId(UUID.randomUUID());

        pythonSkill = Skill.builder().name("Python").build();
        pythonSkill.setId(UUID.randomUUID());
    }

    @Test
    void testFindMatches_MutualBarter_ReturnsHighScore() {
        // Alice knows Java, wants Python
        UserSkill aliceKnown = UserSkill.builder().user(currentUser).skill(javaSkill).isKnown(true).build();
        UserSkill aliceWanted = UserSkill.builder().user(currentUser).skill(pythonSkill).isKnown(false).build();
        when(userRepository.findById(currentUser.getId())).thenReturn(Optional.of(currentUser));
        when(userSkillRepository.findByUserId(currentUser.getId())).thenReturn(List.of(aliceKnown, aliceWanted));

        // Bob knows Python, wants Java
        UserSkill bobKnown = UserSkill.builder().user(peerUser).skill(pythonSkill).isKnown(true).build();
        UserSkill bobWanted = UserSkill.builder().user(peerUser).skill(javaSkill).isKnown(false).build();
        when(userSkillRepository.findAllSkillsForPeers(currentUser.getId())).thenReturn(List.of(bobKnown, bobWanted));

        List<MatchResponse> matches = matchingService.findMatches(currentUser.getId());

        assertNotNull(matches);
        assertEquals(1, matches.size());
        MatchResponse match = matches.get(0);
        assertEquals("Bob", match.getPeer().getFullName());
        assertTrue(match.getMatchingScore() >= 80.0, "Score should reflect strong reciprocal barter");
        assertEquals(1, match.getSkillsTeachedByPeer().size());
        assertEquals("Python", match.getSkillsTeachedByPeer().get(0).getName());
    }

    @Test
    void testFindMatches_NoSkillsRegistered_ReturnsEmpty() {
        when(userRepository.findById(currentUser.getId())).thenReturn(Optional.of(currentUser));
        when(userSkillRepository.findByUserId(currentUser.getId())).thenReturn(Collections.emptyList());

        List<MatchResponse> matches = matchingService.findMatches(currentUser.getId());
        assertTrue(matches.isEmpty());
    }
}
