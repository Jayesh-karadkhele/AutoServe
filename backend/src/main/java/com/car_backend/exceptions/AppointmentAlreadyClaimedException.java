package com.car_backend.exceptions;

public class AppointmentAlreadyClaimedException extends RuntimeException {
    public AppointmentAlreadyClaimedException(String message) {
        super(message);
    }
}
