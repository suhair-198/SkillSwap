package com.skillswap.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "learning_groups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Group extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @Column(name = "is_private", nullable = false)
    private boolean isPrivate;
}
