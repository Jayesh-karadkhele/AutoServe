package com.car_backend.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReassignMechanicDto {

    @NotNull(message = "Mechanic ID is required")
    private Long mechanicId;

    @NotNull(message = "Target Manager ID is required")
    private Long targetManagerId;

    @NotBlank(message = "Reason for transfer is required")
    private String reason;
}
