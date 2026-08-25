package com.skillswap.service;

import com.skillswap.dto.ConnectionDTO;
import com.skillswap.dto.UserDTO;
import com.skillswap.exception.BadRequestException;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.model.Connection;
import com.skillswap.model.User;
import com.skillswap.repository.ConnectionRepository;
import com.skillswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ConnectionServiceImpl implements ConnectionService {

    private final ConnectionRepository connectionRepository;
    private final UserRepository userRepository;

    @Autowired
    public ConnectionServiceImpl(ConnectionRepository connectionRepository, UserRepository userRepository) {
        this.connectionRepository = connectionRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public ConnectionDTO sendConnectionRequest(UUID senderId, UUID receiverId) {
        if (senderId.equals(receiverId)) {
            throw new BadRequestException("You cannot connect with yourself!");
        }

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender user not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new ResourceNotFoundException("Receiver user not found"));

        Optional<Connection> existingOpt = connectionRepository.findConnectionBetween(senderId, receiverId);

        Connection connection;
        if (existingOpt.isPresent()) {
            connection = existingOpt.get();
            if ("ACCEPTED".equals(connection.getStatus())) {
                throw new BadRequestException("You are already connected with this user!");
            }
            if ("PENDING".equals(connection.getStatus())) {
                throw new BadRequestException("Connection request is already pending!");
            }
            // If declined, allow a re-request
            connection.setRequester(sender);
            connection.setReceiver(receiver);
            connection.setStatus("PENDING");
        } else {
            connection = Connection.builder()
                    .requester(sender)
                    .receiver(receiver)
                    .status("PENDING")
                    .build();
        }

        Connection saved = connectionRepository.save(connection);
        return ConnectionDTO.fromConnection(saved);
    }

    @Override
    @Transactional
    public ConnectionDTO acceptConnectionRequest(UUID userId, UUID connectionId) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Connection request not found"));

        if (!connection.getReceiver().getId().equals(userId)) {
            throw new BadRequestException("You are not authorized to accept this connection request!");
        }

        if (!"PENDING".equals(connection.getStatus())) {
            throw new BadRequestException("Connection request is not pending!");
        }

        connection.setStatus("ACCEPTED");
        Connection saved = connectionRepository.save(connection);

        // Gamification: Reward XP to both users for connecting!
        User requester = connection.getRequester();
        User receiver = connection.getReceiver();
        
        addXp(requester, 15);
        addXp(receiver, 15);

        userRepository.save(requester);
        userRepository.save(receiver);

        return ConnectionDTO.fromConnection(saved);
    }

    @Override
    @Transactional
    public ConnectionDTO declineConnectionRequest(UUID userId, UUID connectionId) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Connection request not found"));

        if (!connection.getReceiver().getId().equals(userId)) {
            throw new BadRequestException("You are not authorized to decline this connection request!");
        }

        if (!"PENDING".equals(connection.getStatus())) {
            throw new BadRequestException("Connection request is not pending!");
        }

        connection.setStatus("DECLINED");
        Connection saved = connectionRepository.save(connection);
        return ConnectionDTO.fromConnection(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> getAcceptedConnections(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }
        
        List<Connection> connections = connectionRepository.findAcceptedConnections(userId);
        return connections.stream()
                .map(c -> {
                    if (c.getRequester().getId().equals(userId)) {
                        return UserDTO.fromUser(c.getReceiver());
                    } else {
                        return UserDTO.fromUser(c.getRequester());
                    }
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConnectionDTO> getPendingRequestsReceived(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }
        return connectionRepository.findByReceiverIdAndStatus(userId, "PENDING").stream()
                .map(ConnectionDTO::fromConnection)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConnectionDTO> getPendingRequestsSent(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }
        return connectionRepository.findByRequesterIdAndStatus(userId, "PENDING").stream()
                .map(ConnectionDTO::fromConnection)
                .collect(Collectors.toList());
    }

    private void addXp(User user, int amount) {
        user.setXp(user.getXp() + amount);
        // Level up formula: level = (xp / 100) + 1
        int newLevel = (user.getXp() / 100) + 1;
        if (newLevel > user.getLevel()) {
            user.setLevel(newLevel);
            // Boost reputation for levelling up
            user.setReputation(user.getReputation() + 5);
        }
    }
}
