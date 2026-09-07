package com.car_backend.entities;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "roadside_assistance")
@AttributeOverride(name = "id", column = @Column(name = "id"))
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoadsideAssistance extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_handler_id")
    private User assignedHandler;

    @Column(name = "assistance_type", nullable = false)
    private String assistanceType;

    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "location_text", length = 500)
    private String locationText;

    @Column(name = "coordinates")
    private String coordinates;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private RsaStatus status = RsaStatus.REQUESTED;

    @Column(name = "resolution_notes", length = 2000)
    private String resolutionNotes;
}
