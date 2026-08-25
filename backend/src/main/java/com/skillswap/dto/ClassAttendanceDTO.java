package com.skillswap.dto;

import com.skillswap.model.ClassAttendance;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassAttendanceDTO {
    private UUID id;
    private UserDTO user;
    private boolean attended;

    public static ClassAttendanceDTO fromAttendance(ClassAttendance attendance) {
        if (attendance == null) return null;
        return ClassAttendanceDTO.builder()
                .id(attendance.getId())
                .user(UserDTO.fromUser(attendance.getUser()))
                .attended(attendance.isAttended())
                .build();
    }
}
