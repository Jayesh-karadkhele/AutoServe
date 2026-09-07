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
public class RatingResponseDto {
    private Long id;
    private Long jobCardId;
    private Long customerId;
    private String customerName;
    private Long mechanicId;
    private String mechanicName;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
}
