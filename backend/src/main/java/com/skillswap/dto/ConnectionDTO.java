package com.skillswap.dto;

import com.skillswap.model.Connection;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConnectionDTO {
    private UUID id;
    private UserDTO requester;
    private UserDTO receiver;
    private String status;

    public static ConnectionDTO fromConnection(Connection connection) {
        if (connection == null) return null;
        return ConnectionDTO.builder()
                .id(connection.getId())
                .requester(UserDTO.fromUser(connection.getRequester()))
                .receiver(UserDTO.fromUser(connection.getReceiver()))
                .status(connection.getStatus())
                .build();
    }
}
