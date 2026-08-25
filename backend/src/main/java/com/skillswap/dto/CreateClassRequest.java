package com.skillswap.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class CreateClassRequest {
    @NotBlank
    private String title;

    private String description;

    private UUID groupId; // Optional group ownership

    @NotNull
    @Future(message = "Start time must be in the future")
    private LocalDateTime startTime;

    @Min(value = 15, message = "Duration must be at least 15 minutes")
    private int durationMinutes;

    @NotBlank
    private String meetingPlatform; // GOOGLE_MEET, ZOOM, TEAMS, JITSI

    @NotBlank
    private String meetingUrl;
}
