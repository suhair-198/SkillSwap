package com.skillswap.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "connections",
    uniqueConstraints = @UniqueConstraint(columnNames = {"requester_id", "receiver_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Connection extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Column(nullable = false)
    private String status; // PENDING, ACCEPTED, DECLINED
}
