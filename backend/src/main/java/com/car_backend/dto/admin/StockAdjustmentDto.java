package com.car_backend.dto.admin;

import com.car_backend.entities.StockMovementType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StockAdjustmentDto {

    @NotNull(message = "Inventory ID is required")
    private Long inventoryId;

    @NotNull(message = "Quantity delta is required")
    private Integer quantityDelta;

    @NotNull(message = "Movement type is required")
    private StockMovementType movementType; // MANUAL_INCREASE, MANUAL_DECREASE, CORRECTION

    @NotBlank(message = "Mandatory reason for stock adjustment is required")
    private String reason;
}
