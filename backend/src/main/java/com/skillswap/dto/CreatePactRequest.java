package com.skillswap.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CreatePactRequest {
    @NotNull
    private UUID userBId; // Peer user

    @NotNull
    private UUID skillAId; // Skill taught by initiator (User A)

    @NotNull
    private UUID skillBId; // Skill taught by peer (User B)

    @NotBlank
    private String goals;
}
