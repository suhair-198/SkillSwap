package com.skillswap.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "messages",
    indexes = {
        @Index(name = "idx_msg_sender", columnList = "sender_id"),
        @Index(name = "idx_msg_recipient", columnList = "recipient_id"),
        @Index(name = "idx_msg_group", columnList = "group_id"),
        @Index(name = "idx_msg_created_at", columnList = "created_at"),
        @Index(name = "idx_msg_read", columnList = "is_read"),
        @Index(name = "idx_msg_rec_read", columnList = "recipient_id, is_read")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "recipient_id")
    private User recipient; // Null for group chats

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private Group group; // Null for private 1-1 chats

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "media_url")
    private String mediaUrl;

    @Builder.Default
    @Column(name = "is_read", nullable = false)
    private boolean read = false;
}
