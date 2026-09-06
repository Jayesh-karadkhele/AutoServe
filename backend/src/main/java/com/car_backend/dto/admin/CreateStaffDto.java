package com.car_backend.dto.admin;

import com.car_backend.entities.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateStaffDto {

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Valid email address is required")
    private String email;

    @NotBlank(message = "Mobile number is required")
    private String mobile;

    @NotNull(message = "Role is required")
    private Role role; // MANAGER or MECHANIC

    @NotBlank(message = "Initial password is required")
    @Size(min = 8, max = 50, message = "Password must be at least 8 characters long")
    private String initialPassword;

    private Long managerId; // Mandatory when creating a Mechanic
    private Boolean activeState = true;
}
