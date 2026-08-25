package com.skillswap.controller;

import com.skillswap.dto.AddSkillRequest;
import com.skillswap.dto.SkillDTO;
import com.skillswap.dto.UserSkillDTO;
import com.skillswap.security.UserPrincipal;
import com.skillswap.service.SkillService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillService skillService;

    @Autowired
    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping
    public ResponseEntity<List<SkillDTO>> getAllSkills() {
        return ResponseEntity.ok(skillService.getAllSkills());
    }

    @GetMapping("/search")
    public ResponseEntity<List<SkillDTO>> searchSkills(@RequestParam String query) {
        return ResponseEntity.ok(skillService.searchSkills(query));
    }

    @GetMapping("/my")
    public ResponseEntity<List<UserSkillDTO>> getMySkills(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(skillService.getUserSkills(principal.getId()));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserSkillDTO>> getUserSkills(@PathVariable UUID userId) {
        return ResponseEntity.ok(skillService.getUserSkills(userId));
    }

    @PostMapping("/my")
    public ResponseEntity<UserSkillDTO> addSkillToMyProfile(@AuthenticationPrincipal UserPrincipal principal,
                                                            @Valid @RequestBody AddSkillRequest request) {
        UserSkillDTO response = skillService.addSkillToUser(principal.getId(), request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/my/{skillId}")
    public ResponseEntity<Void> removeSkillFromMyProfile(@AuthenticationPrincipal UserPrincipal principal,
                                                         @PathVariable UUID skillId,
                                                         @RequestParam boolean isKnown) {
        skillService.removeSkillFromUser(principal.getId(), skillId, isKnown);
        return ResponseEntity.noContent().build();
    }
}
