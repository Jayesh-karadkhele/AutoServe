package com.car_backend.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentOrderResponseDto {
    private String attemptRef;
    private String providerOrderId;
    private String razorpayKeyId;
    private Long amountPaise;
    private String currency;
    private Long invoiceId;
    private String invoiceNumber;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String status;
}
