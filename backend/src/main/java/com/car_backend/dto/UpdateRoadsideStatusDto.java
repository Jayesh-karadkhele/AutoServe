package com.car_backend.dto;

import com.car_backend.entities.RsaStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateRoadsideStatusDto {
    @NotNull(message = "Status is required")
    private RsaStatus status;

    private Long assignedHandlerId;
    private String resolutionNotes;
}
