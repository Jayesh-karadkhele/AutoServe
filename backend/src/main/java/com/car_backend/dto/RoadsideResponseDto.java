package com.car_backend.dto;

import java.time.LocalDateTime;

import com.car_backend.entities.RsaStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoadsideResponseDto {
    private Long id;
    private Long customerId;
    private String customerName;
    private String customerMobile;
    private Long vehicleId;
    private String vehiclePlate;
    private String vehicleModel;
    private Long assignedHandlerId;
    private String assignedHandlerName;
    private String assistanceType;
    private String description;
    private String locationText;
    private String coordinates;
    private RsaStatus status;
    private String resolutionNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
