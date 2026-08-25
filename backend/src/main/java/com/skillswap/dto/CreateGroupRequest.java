package com.skillswap.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateGroupRequest {
    @NotBlank
    private String name;

    private String description;

    private boolean isPrivate;
}
