package com.skillswap.service;

import com.skillswap.dto.CreatePactRequest;
import com.skillswap.dto.SkillPactDTO;
import com.skillswap.exception.BadRequestException;
import com.skillswap.model.Skill;
import com.skillswap.model.SkillPact;
import com.skillswap.model.SkillPactStatus;
import com.skillswap.model.User;
import com.skillswap.repository.SkillPactRepository;
import com.skillswap.repository.SkillRepository;
import com.skillswap.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SkillPactServiceTest {

    @Mock
    private SkillPactRepository skillPactRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SkillRepository skillRepository;

    @InjectMocks
    private SkillPactServiceImpl skillPactService;

    private User userA;
    private User userB;
    private Skill skillA;
    private Skill skillB;

    @BeforeEach
    void setUp() {
        userA = User.builder().fullName("Alice").xp(50).reputation(10).level(1).build();
        userA.setId(UUID.randomUUID());

        userB = User.builder().fullName("Bob").xp(30).reputation(5).level(1).build();
        userB.setId(UUID.randomUUID());

        skillA = Skill.builder().name("Java").build();
        skillA.setId(UUID.randomUUID());

        skillB = Skill.builder().name("Python").build();
        skillB.setId(UUID.randomUUID());
    }

    @Test
    void testRequestPact_Success() {
        CreatePactRequest request = new CreatePactRequest();
        request.setUserBId(userB.getId());
        request.setSkillAId(skillA.getId());
        request.setSkillBId(skillB.getId());
        request.setGoals("Learn fundamentals");

        when(userRepository.findById(userA.getId())).thenReturn(Optional.of(userA));
        when(userRepository.findById(userB.getId())).thenReturn(Optional.of(userB));
        when(skillRepository.findById(skillA.getId())).thenReturn(Optional.of(skillA));
        when(skillRepository.findById(skillB.getId())).thenReturn(Optional.of(skillB));
        when(skillPactRepository.save(any(SkillPact.class))).thenAnswer(invocation -> invocation.getArgument(0));

        SkillPactDTO result = skillPactService.requestPact(userA.getId(), request);

        assertNotNull(result);
        assertEquals(SkillPactStatus.REQUESTED.name(), result.getStatus());
        assertEquals("Learn fundamentals", result.getGoals());
    }

    @Test
    void testAcceptPact_TransitionsToActive() {
        UUID pactId = UUID.randomUUID();
        SkillPact pact = SkillPact.builder()
                .userA(userA)
                .userB(userB)
                .skillA(skillA)
                .skillB(skillB)
                .status(SkillPactStatus.REQUESTED)
                .build();
        pact.setId(pactId);

        when(skillPactRepository.findById(pactId)).thenReturn(Optional.of(pact));
        when(skillPactRepository.save(any(SkillPact.class))).thenAnswer(invocation -> invocation.getArgument(0));

        SkillPactDTO accepted = skillPactService.acceptPact(userB.getId(), pactId);

        assertNotNull(accepted);
        assertEquals(SkillPactStatus.ACTIVE.name(), accepted.getStatus());
        assertEquals(60, userA.getXp()); // +10 XP
        assertEquals(40, userB.getXp()); // +10 XP
        verify(userRepository, times(1)).save(userA);
        verify(userRepository, times(1)).save(userB);
    }

    @Test
    void testAcceptPact_UnauthorizedUser_ThrowsBadRequest() {
        UUID pactId = UUID.randomUUID();
        SkillPact pact = SkillPact.builder()
                .userA(userA)
                .userB(userB)
                .status(SkillPactStatus.REQUESTED)
                .build();
        pact.setId(pactId);

        when(skillPactRepository.findById(pactId)).thenReturn(Optional.of(pact));

        UUID intruderId = UUID.randomUUID();
        assertThrows(BadRequestException.class, () -> skillPactService.acceptPact(intruderId, pactId));
    }

    @Test
    void testCompletePact_Success() {
        UUID pactId = UUID.randomUUID();
        SkillPact pact = SkillPact.builder()
                .userA(userA)
                .userB(userB)
                .skillA(skillA)
                .skillB(skillB)
                .status(SkillPactStatus.ACTIVE)
                .build();
        pact.setId(pactId);

        when(skillPactRepository.findById(pactId)).thenReturn(Optional.of(pact));
        when(skillPactRepository.save(any(SkillPact.class))).thenAnswer(invocation -> invocation.getArgument(0));

        SkillPactDTO completed = skillPactService.completePact(userA.getId(), pactId);

        assertEquals(SkillPactStatus.COMPLETED.name(), completed.getStatus());
        assertEquals(100, userA.getXp()); // +50 XP
        assertEquals(80, userB.getXp());  // +50 XP
    }
}
