package com.skillswap.service;

import com.skillswap.dto.MatchResponse;

import java.util.List;
import java.util.UUID;

public interface MatchingService {
    List<MatchResponse> findMatches(UUID userId);
}
