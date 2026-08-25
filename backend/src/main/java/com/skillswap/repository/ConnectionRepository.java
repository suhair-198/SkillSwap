package com.skillswap.repository;

import com.skillswap.model.Connection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, UUID> {
    
    @Query("SELECT c FROM Connection c WHERE (c.requester.id = :user1 AND c.receiver.id = :user2) OR (c.requester.id = :user2 AND c.receiver.id = :user1)")
    Optional<Connection> findConnectionBetween(@Param("user1") UUID user1, @Param("user2") UUID user2);
    
    @Query("SELECT c FROM Connection c WHERE c.status = 'ACCEPTED' AND (c.requester.id = :userId OR c.receiver.id = :userId)")
    List<Connection> findAcceptedConnections(@Param("userId") UUID userId);
    
    List<Connection> findByReceiverIdAndStatus(UUID receiverId, String status);
    List<Connection> findByRequesterIdAndStatus(UUID requesterId, String status);
}
