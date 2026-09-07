package com.car_backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponseDto {
    private Long id;
    private Long userId;
    private String title;
    private String message;
    private String resourceType;
    private Long resourceId;
    private String navigationLink;
    private boolean isRead;
    private LocalDateTime createdAt;
}
