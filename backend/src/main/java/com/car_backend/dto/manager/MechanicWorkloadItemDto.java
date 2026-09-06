package com.car_backend.dto.manager;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class MechanicWorkloadItemDto {
    private Long mechanicId;
    private String mechanicName;
    private String email;
    private String mobile;
    private boolean isActive;
    private long activeJobCount;
    private long completedJobCount;
    private String availabilityStatus; // "No active conflict detected", "Currently assigned", "Schedule conflict", "Inactive"
}
