package com.skillswap.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "skill_pacts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillPact extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "user_a_id", nullable = false)
    private User userA; // Pact initiator

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "user_b_id", nullable = false)
    private User userB; // Pact receiver

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "skill_a_id", nullable = false)
    private Skill skillA; // Skill taught by User A to User B

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "skill_b_id", nullable = false)
    private Skill skillB; // Skill taught by User B to User A

    @Column(nullable = false)
    private String status; // REQUESTED, ACCEPTED, ACTIVE, COMPLETED, CANCELLED

    @Column(columnDefinition = "TEXT")
    private String goals;

    @Builder.Default
    @Column(name = "sessions_count")
    private int sessionsCount = 0;
}
