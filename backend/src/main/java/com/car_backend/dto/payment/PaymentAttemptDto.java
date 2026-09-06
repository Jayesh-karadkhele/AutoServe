package com.car_backend.dto.payment;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentAttemptDto {
    private Long id;
    private String attemptRef;
    private Long invoiceId;
    private String provider;
    private String providerOrderId;
    private String providerPaymentId;
    private Long amountPaise;
    private String currency;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime signatureVerifiedAt;
    private LocalDateTime capturedAt;
    private String failureCode;
    private String failureDescription;
}
