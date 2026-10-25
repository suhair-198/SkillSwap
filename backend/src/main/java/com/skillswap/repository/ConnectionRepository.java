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
    
    @Query("SELECT c FROM Connection c JOIN FETCH c.requester r JOIN FETCH c.receiver rec WHERE (r.id = :user1 AND rec.id = :user2) OR (r.id = :user2 AND rec.id = :user1)")
    Optional<Connection> findConnectionBetween(@Param("user1") UUID user1, @Param("user2") UUID user2);
    
    @Query("SELECT c FROM Connection c JOIN FETCH c.requester r JOIN FETCH c.receiver rec WHERE c.status = 'ACCEPTED' AND (r.id = :userId OR rec.id = :userId)")
    List<Connection> findAcceptedConnections(@Param("userId") UUID userId);
    
    @Query("SELECT c FROM Connection c JOIN FETCH c.requester r JOIN FETCH c.receiver rec WHERE rec.id = :receiverId AND c.status = :status")
    List<Connection> findByReceiverIdAndStatus(@Param("receiverId") UUID receiverId, @Param("status") String status);

    @Query("SELECT c FROM Connection c JOIN FETCH c.requester r JOIN FETCH c.receiver rec WHERE r.id = :requesterId AND c.status = :status")
    List<Connection> findByRequesterIdAndStatus(@Param("requesterId") UUID requesterId, @Param("status") String status);
}
