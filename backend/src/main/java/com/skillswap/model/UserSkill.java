package com.skillswap.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "user_skills",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "skill_id", "is_known"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSkill extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(name = "proficiency_level", nullable = false)
    private String proficiencyLevel; // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT

    @Column(name = "is_known", nullable = false)
    private boolean isKnown; // true = known (teaches), false = wanted (learns)
}
