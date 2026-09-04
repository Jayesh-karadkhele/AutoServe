package com.car_backend.dto.jobCard;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JobCardItemDto {
	private Long id;
	private String itemName;
	private BigDecimal itemPrice;
	private Integer quantity;
	private BigDecimal totalPrice;
	
}
