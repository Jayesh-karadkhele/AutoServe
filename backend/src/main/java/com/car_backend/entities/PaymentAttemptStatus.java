package com.car_backend.entities;

public enum PaymentAttemptStatus {
    CREATED,
    CHECKOUT_OPENED,
    SIGNATURE_VERIFIED,
    CAPTURE_PENDING,
    PAID,
    FAILED,
    EXPIRED
}
