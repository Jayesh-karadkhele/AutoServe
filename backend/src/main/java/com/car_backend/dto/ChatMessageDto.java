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
public class ChatMessageDto {
    private Long id;
    private Long jobCardId;
    private Long senderId;
    private String senderName;
    private String senderRole;
    private String message;
    private boolean isRead;
    private LocalDateTime createdAt;
}
