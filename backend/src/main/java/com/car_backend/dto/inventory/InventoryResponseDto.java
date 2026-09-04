package com.car_backend.dto.inventory;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InventoryResponseDto {
	private Long id;
	private String itemName;
	private String skuCode;
	private BigDecimal currentPrice;
	private Integer stockQuantity;
	private boolean deleted;
	private Integer version;
	
	private Boolean lowStock;
	private Boolean outOfStock;
	
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}
