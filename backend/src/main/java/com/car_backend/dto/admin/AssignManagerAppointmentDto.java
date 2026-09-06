package com.car_backend.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssignManagerAppointmentDto {

    @NotNull(message = "Appointment ID is required")
    private Long appointmentId;

    @NotNull(message = "Manager ID is required")
    private Long managerId;

    @NotBlank(message = "Reason for assignment is required")
    private String reason;
}
