package com.skillswap.dto;

import com.skillswap.model.ClassFeedback;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassFeedbackDTO {
    private UUID id;
    private UUID classId;
    private UserDTO user;
    private int rating;
    private String comments;

    public static ClassFeedbackDTO fromFeedback(ClassFeedback feedback) {
        if (feedback == null) return null;
        return ClassFeedbackDTO.builder()
                .id(feedback.getId())
                .classId(feedback.getLiveClass().getId())
                .user(UserDTO.fromUser(feedback.getUser()))
                .rating(feedback.getRating())
                .comments(feedback.getComments())
                .build();
    }
}
