package com.car_backend.exceptions;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.car_backend.dto.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceAlreadyExists.class)
    public ResponseEntity<ApiResponse> handleResourceAlreadyExists(ResourceAlreadyExists e) {
        ApiResponse response = new ApiResponse(e.getMessage(), "Registration failed due to duplicate entry.");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse> handleResourceNotFound(ResourceNotFoundException e) {
        ApiResponse response = new ApiResponse(e.getMessage(), "Resource not found.");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationException(MethodArgumentNotValidException e) {
        Map<String, String> errors = new HashMap<>();
        e.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleHttpMessageNotReadable(HttpMessageNotReadableException e) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", java.time.Instant.now().toString());
        body.put("status", 400);
        body.put("error", "Bad Request");
        body.put("message", "Invalid request body or unrecognized properties");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(InvalidDateException.class)
    public ResponseEntity<?> handleInvalidDateException(InvalidDateException e) {
        ApiResponse response = new ApiResponse(e.getMessage(), "Invalid date");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(DuplicateJobCreationException.class)
    public ResponseEntity<?> duplicateJobCreationException(DuplicateJobCreationException e) {
        ApiResponse response = new ApiResponse(e.getMessage(), "Duplicate job");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<?> unauthorizedException(UnauthorizedException e) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", java.time.Instant.now().toString());
        body.put("status", 401);
        body.put("error", "Unauthorized");
        body.put("message", e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<?> userNotFoundException(UserNotFoundException e) {
        ApiResponse response = new ApiResponse(e.getMessage(), "User does not exist");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(InvalidRoleException.class)
    public ResponseEntity<?> invalidRoleException(InvalidRoleException e) {
        ApiResponse response = new ApiResponse(e.getMessage(), "User role is invalid");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(PaymentException.class)
    public ResponseEntity<?> handlePaymentException(PaymentException ex) {
        ApiResponse response = new ApiResponse(ex.getMessage(), "Payment processing failed");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<?> handleInvalidCredentials(InvalidCredentialsException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", java.time.Instant.now().toString());
        body.put("status", 401);
        body.put("error", "Unauthorized");
        body.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    @ExceptionHandler(InvalidOperationException.class)
    public ResponseEntity<ApiResponse> handleInvalidOperationException(InvalidOperationException ex) {
        ApiResponse response = new ApiResponse(ex.getMessage(), "Invalid operation");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(InsufficientStockException.class)
    public ResponseEntity<ApiResponse> handleInsufficientStockException(InsufficientStockException ex) {
        ApiResponse response = new ApiResponse(ex.getMessage(), "Insufficient stock");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(StockConflictException.class)
    public ResponseEntity<ApiResponse> handleStockConflictException(StockConflictException ex) {
        ApiResponse response = new ApiResponse(ex.getMessage(), "Stock conflict");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(MechanicTransferConflictException.class)
    public ResponseEntity<ApiResponse> handleMechanicTransferConflictException(MechanicTransferConflictException ex) {
        ApiResponse response = new ApiResponse(ex.getMessage(), "MECHANIC_TRANSFER_CONFLICT");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDeniedException(AccessDeniedException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", java.time.Instant.now().toString());
        body.put("status", 403);
        body.put("error", "Forbidden");
        body.put("message", "Access is denied");
        return new ResponseEntity<>(body, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleGlobalException(Exception ex) {
        ApiResponse response = new ApiResponse(ex.getMessage(), "INTERNAL_SERVER_ERROR");
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}