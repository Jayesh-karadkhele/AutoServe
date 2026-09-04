package com.car_backend.dto.invoice;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.car_backend.entities.PaymentStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InvoiceResponseDto {
	private Long id;
	private String invoiceNumber;

	private Long jobCardId;
	private String jobCardStatus;

	private Long customerId;
	private String customerName;
	private String customerEmail;
	private String customerPhone;

	private String vehicleRegistration;
	private String vehicleBrand;
	private String vehicleModel;

	private BigDecimal baseAmount;
	private BigDecimal laborCost;
	private BigDecimal taxPercentage;
	private BigDecimal taxAmount;
	private BigDecimal totalAmount;

	private PaymentStatus paymentStatus;
	private String razorpayOrderId;
	private String razorpayPaymentId;
	private String paymentMethod;
	private LocalDateTime paidAt;

	private List<InvoiceItemDto> items;

	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

}
