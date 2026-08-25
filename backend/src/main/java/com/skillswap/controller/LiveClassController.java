package com.skillswap.controller;

import com.skillswap.dto.*;
import com.skillswap.security.UserPrincipal;
import com.skillswap.service.LiveClassService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/classes")
public class LiveClassController {

    private final LiveClassService liveClassService;

    @Autowired
    public LiveClassController(LiveClassService liveClassService) {
        this.liveClassService = liveClassService;
    }

    @PostMapping
    public ResponseEntity<LiveClassDTO> scheduleClass(@AuthenticationPrincipal UserPrincipal principal,
                                                      @Valid @RequestBody CreateClassRequest request) {
        LiveClassDTO response = liveClassService.scheduleClass(principal.getId(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<LiveClassDTO>> getUpcomingClasses() {
        return ResponseEntity.ok(liveClassService.getUpcomingClasses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LiveClassDTO> getClassDetails(@PathVariable UUID id) {
        return ResponseEntity.ok(liveClassService.getClassDetails(id));
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<Void> registerForClass(@AuthenticationPrincipal UserPrincipal principal,
                                                 @PathVariable UUID id) {
        liveClassService.registerForClass(principal.getId(), id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/attendance")
    public ResponseEntity<Void> markAttendance(@AuthenticationPrincipal UserPrincipal principal,
                                               @PathVariable UUID id,
                                               @RequestParam UUID userId,
                                               @RequestParam boolean attended) {
        // Instructor should be verified here (only instructor can mark attendance for a class)
        LiveClassDTO classDTO = liveClassService.getClassDetails(id);
        if (!classDTO.getInstructor().getId().equals(principal.getId())) {
            return ResponseEntity.status(403).build(); // Forbidden if not instructor
        }
        
        liveClassService.markAttendance(id, userId, attended);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/feedback")
    public ResponseEntity<ClassFeedbackDTO> submitFeedback(@AuthenticationPrincipal UserPrincipal principal,
                                                           @PathVariable UUID id,
                                                           @Valid @RequestBody ClassFeedbackRequest request) {
        ClassFeedbackDTO response = liveClassService.submitFeedback(principal.getId(), id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/feedback")
    public ResponseEntity<List<ClassFeedbackDTO>> getClassFeedback(@PathVariable UUID id) {
        return ResponseEntity.ok(liveClassService.getClassFeedback(id));
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<LiveClassDTO>> getGroupClasses(@PathVariable UUID groupId) {
        return ResponseEntity.ok(liveClassService.getGroupClasses(groupId));
    }
}
