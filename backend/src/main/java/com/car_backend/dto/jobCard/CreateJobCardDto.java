package com.car_backend.dto.jobCard;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateJobCardDto {

	@NotNull(message = "appointment id cannot be null.")
	private Long appointmentId;

	@NotNull(message = "manager id cannot be null.")
	private Long managerId;

	private Long mechanicId;

	@NotNull(message = "labor cost cannot be null.")
	private BigDecimal laborCost;

	private List<PartItem> parts;

	private LocalDate estimatedCompletionDate;

	@Data
	public static class PartItem {
		private Long inventoryId;
		private Integer quantity;
	}
}
