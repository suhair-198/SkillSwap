package com.skillswap.controller;

import com.skillswap.dto.MatchResponse;
import com.skillswap.security.UserPrincipal;
import com.skillswap.service.MatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class MatchingController {

    private final MatchingService matchingService;

    @Autowired
    public MatchingController(MatchingService matchingService) {
        this.matchingService = matchingService;
    }

    @GetMapping
    public ResponseEntity<List<MatchResponse>> getMatchesForCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        List<MatchResponse> matches = matchingService.findMatches(principal.getId());
        return ResponseEntity.ok(matches);
    }
}
