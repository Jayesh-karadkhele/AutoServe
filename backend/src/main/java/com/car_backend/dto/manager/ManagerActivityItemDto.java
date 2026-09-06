package com.car_backend.dto.manager;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ManagerActivityItemDto {
    private String id;
    private String title;
    private String description;
    private String category; // APPOINTMENT, JOB_CARD, INVOICE, MECHANIC, INVENTORY
    private LocalDateTime timestamp;
    private String referenceId;
    private String status;
}
