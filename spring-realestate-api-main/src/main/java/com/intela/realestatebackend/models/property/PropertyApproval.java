package com.intela.realestatebackend.models.property;

import com.intela.realestatebackend.models.User;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "property_approvals")
public class PropertyApproval {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false, unique = true)
    private Property property;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ListingApprovalStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "action_by")
    private User actionBy;

    @Column(length = 500)
    private String remarks;

    @Column(nullable = false)
    private Timestamp updatedAt;

    @PrePersist
    @PreUpdate
    public void onUpsert() {
        this.updatedAt = new Timestamp(System.currentTimeMillis());
    }
}
