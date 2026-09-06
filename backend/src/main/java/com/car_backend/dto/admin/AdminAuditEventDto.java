package com.car_backend.dto.admin;

import java.time.LocalDateTime;

import com.car_backend.entities.AuditEventAction;
import com.car_backend.entities.AuditEventResource;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminAuditEventDto {
    private Long id;
    private Long actorId;
    private String actorName;
    private String actorEmail;
    private AuditEventAction actionType;
    private AuditEventResource resourceType;
    private String resourceId;
    private String outcome;
    private String details;
    private LocalDateTime createdAt;
}
