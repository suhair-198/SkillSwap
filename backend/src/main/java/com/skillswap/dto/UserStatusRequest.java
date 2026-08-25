package com.skillswap.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class UserStatusRequest {
    private UUID userId;
    private String userName;
    private String status; // ONLINE, OFFLINE
}
