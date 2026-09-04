package com.car_backend.dto.invoice;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Data;

@Data
@Builder

public class InvoiceItemDto {
	private String itemName;
	private BigDecimal itemPrice;
	private Integer quantity;
	private BigDecimal totalPrice;
}
