package com.car_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateRoadsideRequestDto {
    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;

    @NotBlank(message = "Assistance type is required")
    private String assistanceType;

    private String description;
    private String locationText;
    private String coordinates;
}
