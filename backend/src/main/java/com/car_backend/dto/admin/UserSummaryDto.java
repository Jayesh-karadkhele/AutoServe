package com.car_backend.dto.admin;

import java.time.LocalDateTime;

import com.car_backend.entities.Role;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSummaryDto {
    private Long id;
    private String fullName;
    private String email;
    private String mobile;
    private Role role;
    private boolean active;
    private Long managerId;
    private String managerName;
    private LocalDateTime createdAt;
    private int assignedJobCount;
    private int completedJobCount;
}
