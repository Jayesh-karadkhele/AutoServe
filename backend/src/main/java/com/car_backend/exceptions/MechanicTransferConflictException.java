package com.car_backend.exceptions;

public class MechanicTransferConflictException extends RuntimeException {
    public MechanicTransferConflictException(String message) {
        super(message);
    }
}
