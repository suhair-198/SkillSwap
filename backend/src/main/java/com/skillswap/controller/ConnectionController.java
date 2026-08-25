package com.skillswap.controller;

import com.skillswap.dto.ConnectionDTO;
import com.skillswap.dto.UserDTO;
import com.skillswap.security.UserPrincipal;
import com.skillswap.service.ConnectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/connections")
public class ConnectionController {

    private final ConnectionService connectionService;

    @Autowired
    public ConnectionController(ConnectionService connectionService) {
        this.connectionService = connectionService;
    }

    @PostMapping("/request/{receiverId}")
    public ResponseEntity<ConnectionDTO> sendRequest(@AuthenticationPrincipal UserPrincipal principal,
                                                     @PathVariable UUID receiverId) {
        ConnectionDTO response = connectionService.sendConnectionRequest(principal.getId(), receiverId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/accept/{connectionId}")
    public ResponseEntity<ConnectionDTO> acceptRequest(@AuthenticationPrincipal UserPrincipal principal,
                                                       @PathVariable UUID connectionId) {
        ConnectionDTO response = connectionService.acceptConnectionRequest(principal.getId(), connectionId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/decline/{connectionId}")
    public ResponseEntity<ConnectionDTO> declineRequest(@AuthenticationPrincipal UserPrincipal principal,
                                                        @PathVariable UUID connectionId) {
        ConnectionDTO response = connectionService.declineConnectionRequest(principal.getId(), connectionId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getMyConnections(@AuthenticationPrincipal UserPrincipal principal) {
        List<UserDTO> connections = connectionService.getAcceptedConnections(principal.getId());
        return ResponseEntity.ok(connections);
    }

    @GetMapping("/pending/received")
    public ResponseEntity<List<ConnectionDTO>> getPendingReceived(@AuthenticationPrincipal UserPrincipal principal) {
        List<ConnectionDTO> requests = connectionService.getPendingRequestsReceived(principal.getId());
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/pending/sent")
    public ResponseEntity<List<ConnectionDTO>> getPendingSent(@AuthenticationPrincipal UserPrincipal principal) {
        List<ConnectionDTO> requests = connectionService.getPendingRequestsSent(principal.getId());
        return ResponseEntity.ok(requests);
    }
}
