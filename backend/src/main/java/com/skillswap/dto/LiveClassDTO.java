package com.skillswap.dto;

import com.skillswap.model.LiveClass;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LiveClassDTO {
    private UUID id;
    private String title;
    private String description;
    private UserDTO instructor;
    private UUID groupId;
    private LocalDateTime startTime;
    private int durationMinutes;
    private String meetingPlatform;
    private String meetingUrl;
    private long attendeeCount;

    public static LiveClassDTO fromLiveClass(LiveClass liveClass, long attendeeCount) {
        if (liveClass == null) return null;
        return LiveClassDTO.builder()
                .id(liveClass.getId())
                .title(liveClass.getTitle())
                .description(liveClass.getDescription())
                .instructor(UserDTO.fromUser(liveClass.getInstructor()))
                .groupId(liveClass.getGroup() != null ? liveClass.getGroup().getId() : null)
                .startTime(liveClass.getStartTime())
                .durationMinutes(liveClass.getDurationMinutes())
                .meetingPlatform(liveClass.getMeetingPlatform())
                .meetingUrl(liveClass.getMeetingUrl())
                .attendeeCount(attendeeCount)
                .build();
    }
}
