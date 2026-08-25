package com.skillswap.dto;

import com.skillswap.model.Group;
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
public class GroupDTO {
    private UUID id;
    private String name;
    private String description;
    private UUID creatorId;
    private boolean isPrivate;
    private LocalDateTime createdAt;
    private long memberCount;

    public static GroupDTO fromGroup(Group group, long memberCount) {
        if (group == null) return null;
        return GroupDTO.builder()
                .id(group.getId())
                .name(group.getName())
                .description(group.getDescription())
                .creatorId(group.getCreator().getId())
                .isPrivate(group.isPrivate())
                .createdAt(group.getCreatedAt())
                .memberCount(memberCount)
                .build();
    }
}
