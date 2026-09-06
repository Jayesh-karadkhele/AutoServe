package com.car_backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.car_backend.dto.auth.ChangePasswordDto;
import com.car_backend.dto.auth.ForgotPasswordRequestDto;
import com.car_backend.dto.auth.ResetPasswordRequestDto;
import com.car_backend.entities.User;
import com.car_backend.exceptions.ResourceNotFoundException;
import com.car_backend.repository.UserRepository;
import com.car_backend.service.AccountSecurityService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AccountSecurityController {

    private final AccountSecurityService accountSecurityService;
    private final UserRepository userRepository;

    @PostMapping("/api/users/me/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> changePassword(@Valid @RequestBody ChangePasswordDto dto) {
        User currentUser = getCurrentUser();
        accountSecurityService.changePassword(currentUser, dto);
        return ResponseEntity.ok(Map.of(
                "message", "Password changed successfully. Please log in again with your new password."
        ));
    }

    @PostMapping("/api/auth/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequestDto dto) {
        accountSecurityService.requestForgotPassword(dto);
        return ResponseEntity.accepted().body(Map.of(
                "message", "If an eligible account exists, password-reset instructions will be sent."
        ));
    }

    @PostMapping("/api/auth/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequestDto dto) {
        accountSecurityService.resetPassword(dto);
        return ResponseEntity.ok(Map.of(
                "message", "Password has been reset successfully. Please log in with your new password."
        ));
    }

    private User getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new ResourceNotFoundException("Authenticated user context not found");
        }
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + auth.getName()));
    }
}
