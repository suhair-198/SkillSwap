package com.skillswap.repository;

import com.skillswap.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {
    
    @Query("SELECT m FROM Message m WHERE (m.sender.id = :user1 AND m.recipient.id = :user2) AND m.group IS NULL ORDER BY m.createdAt ASC")
    List<Message> findDirectMessages(@Param("user1") UUID user1, @Param("user2") UUID user2);
    
    List<Message> findByGroupIdOrderByCreatedAtAsc(UUID groupId);
    
    @Query("SELECT m FROM Message m WHERE m.recipient.id = :recipientId AND m.read = false")
    List<Message> findUnreadMessagesForRecipient(@Param("recipientId") UUID recipientId);
    
    @Query("SELECT count(m) FROM Message m WHERE m.recipient.id = :recipientId AND m.sender.id = :senderId AND m.read = false")
    long countUnreadMessagesFromSender(@Param("recipientId") UUID recipientId, @Param("senderId") UUID senderId);
}
