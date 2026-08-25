package com.skillswap.controller;

import com.skillswap.dto.CreatePactRequest;
import com.skillswap.dto.SkillPactDTO;
import com.skillswap.security.UserPrincipal;
import com.skillswap.service.SkillPactService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pacts")
public class SkillPactController {

    private final SkillPactService skillPactService;

    @Autowired
    public SkillPactController(SkillPactService skillPactService) {
        this.skillPactService = skillPactService;
    }

    @PostMapping
    public ResponseEntity<SkillPactDTO> requestPact(@AuthenticationPrincipal UserPrincipal principal,
                                                    @Valid @RequestBody CreatePactRequest request) {
        SkillPactDTO response = skillPactService.requestPact(principal.getId(), request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/accept/{id}")
    public ResponseEntity<SkillPactDTO> acceptPact(@AuthenticationPrincipal UserPrincipal principal,
                                                   @PathVariable UUID id) {
        SkillPactDTO response = skillPactService.acceptPact(principal.getId(), id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/decline/{id}")
    public ResponseEntity<SkillPactDTO> declinePact(@AuthenticationPrincipal UserPrincipal principal,
                                                    @PathVariable UUID id) {
        SkillPactDTO response = skillPactService.declinePact(principal.getId(), id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/complete/{id}")
    public ResponseEntity<SkillPactDTO> completePact(@AuthenticationPrincipal UserPrincipal principal,
                                                     @PathVariable UUID id) {
        SkillPactDTO response = skillPactService.completePact(principal.getId(), id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/sessions/{id}")
    public ResponseEntity<SkillPactDTO> logSession(@AuthenticationPrincipal UserPrincipal principal,
                                                   @PathVariable UUID id) {
        SkillPactDTO response = skillPactService.incrementSessions(principal.getId(), id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<SkillPactDTO>> getMyPacts(@AuthenticationPrincipal UserPrincipal principal) {
        List<SkillPactDTO> pacts = skillPactService.getPactsForUser(principal.getId());
        return ResponseEntity.ok(pacts);
    }
}
