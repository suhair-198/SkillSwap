package com.skillswap.dto;

import com.fasterxml.jackson.annotation.JsonSetter;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.UUID;

@Data
public class CreateClassRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private UUID groupId; // Optional group ownership

    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;

    @Min(value = 15, message = "Duration must be at least 15 minutes")
    private int durationMinutes = 60;

    @NotBlank(message = "Meeting platform is required")
    private String meetingPlatform; // GOOGLE_MEET, ZOOM, TEAMS, JITSI

    @NotBlank(message = "Meeting URL is required")
    private String meetingUrl;

    @JsonSetter("startTime")
    public void setStartTime(Object raw) {
        if (raw == null) {
            this.startTime = null;
            return;
        }
        String str = raw.toString().trim();
        if (str.isEmpty()) {
            this.startTime = null;
            return;
        }
        try {
            // Handles 2026-10-25T14:41:35.000Z or with offset +05:30
            Instant instant = Instant.parse(str);
            this.startTime = LocalDateTime.ofInstant(instant, ZoneId.systemDefault());
        } catch (Exception e1) {
            try {
                // Handles 2026-10-25T14:41:35 or 2026-10-25T14:41
                this.startTime = LocalDateTime.parse(str);
            } catch (Exception e2) {
                try {
                    this.startTime = OffsetDateTime.parse(str).toLocalDateTime();
                } catch (Exception e3) {
                    throw new IllegalArgumentException("Invalid date-time format for startTime: " + str);
                }
            }
        }
    }

    @JsonSetter("groupId")
    public void setGroupId(Object raw) {
        if (raw == null) {
            this.groupId = null;
            return;
        }
        String str = raw.toString().trim();
        if (str.isEmpty() || "null".equalsIgnoreCase(str) || "undefined".equalsIgnoreCase(str)) {
            this.groupId = null;
            return;
        }
        this.groupId = UUID.fromString(str);
    }
}
