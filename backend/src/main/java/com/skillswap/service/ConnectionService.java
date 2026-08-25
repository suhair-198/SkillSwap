package com.skillswap.service;

import com.skillswap.dto.ConnectionDTO;
import com.skillswap.dto.UserDTO;

import java.util.List;
import java.util.UUID;

public interface ConnectionService {
    ConnectionDTO sendConnectionRequest(UUID senderId, UUID receiverId);
    ConnectionDTO acceptConnectionRequest(UUID userId, UUID connectionId);
    ConnectionDTO declineConnectionRequest(UUID userId, UUID connectionId);
    List<UserDTO> getAcceptedConnections(UUID userId);
    List<ConnectionDTO> getPendingRequestsReceived(UUID userId);
    List<ConnectionDTO> getPendingRequestsSent(UUID userId);
}
