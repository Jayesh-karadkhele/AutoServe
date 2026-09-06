package com.car_backend.dto.admin;

import java.time.LocalDateTime;

import com.car_backend.entities.StockMovementType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StockMovementDto {
    private Long id;
    private Long inventoryId;
    private String partName;
    private String partNumber;
    private StockMovementType movementType;
    private int quantityBefore;
    private int quantityDelta;
    private int quantityAfter;
    private Long jobCardId;
    private String jobCardRef;
    private Long actorId;
    private String actorName;
    private String reason;
    private LocalDateTime createdAt;
}
