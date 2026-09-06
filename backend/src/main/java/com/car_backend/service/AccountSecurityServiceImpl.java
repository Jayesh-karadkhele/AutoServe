package com.car_backend.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.car_backend.dto.auth.ChangePasswordDto;
import com.car_backend.dto.auth.ForgotPasswordRequestDto;
import com.car_backend.dto.auth.ResetPasswordRequestDto;
import com.car_backend.entities.AuditEventAction;
import com.car_backend.entities.AuditEventResource;
import com.car_backend.entities.PasswordResetToken;
import com.car_backend.entities.User;
import com.car_backend.exceptions.ResourceNotFoundException;
import com.car_backend.repository.PasswordResetTokenRepository;
import com.car_backend.repository.UserRepository;

import com.car_backend.service.smtp.EmailService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AccountSecurityServiceImpl implements AccountSecurityService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final AdminService adminService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Override
    public void changePassword(User currentUser, ChangePasswordDto dto) {
        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            throw new IllegalArgumentException("New password and confirmation password do not match");
        }

        if (!passwordEncoder.matches(dto.getCurrentPassword(), currentUser.getPassword())) {
            throw new IllegalArgumentException("Current password provided is incorrect");
        }

        if (passwordEncoder.matches(dto.getNewPassword(), currentUser.getPassword())) {
            throw new IllegalArgumentException("New password must be different from current password");
        }

        currentUser.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(currentUser);

        passwordResetTokenRepository.invalidateActiveTokensForUser(currentUser.getId());

        adminService.recordAuditEvent(AuditEventAction.USER_ACTIVATED, AuditEventResource.USER,
                String.valueOf(currentUser.getId()), "SUCCESS",
                "Authenticated user " + currentUser.getEmail() + " changed password successfully.");
    }

    @Override
    public void requestForgotPassword(ForgotPasswordRequestDto dto) {
        String email = dto.getEmail().trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty() || !userOpt.get().isActive()) {
            log.info("Forgot password request for email {} handled generically (no active user)", email);
            return;
        }

        User user = userOpt.get();
        passwordResetTokenRepository.invalidateActiveTokensForUser(user.getId());

        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);
        String rawToken = HexFormat.of().formatHex(randomBytes);
        String tokenHash = hashToken(rawToken);

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUser(user);
        resetToken.setTokenHash(tokenHash);
        resetToken.setExpiresAt(LocalDateTime.now().plusMinutes(30));

        passwordResetTokenRepository.save(resetToken);

        try {
            emailService.sendPasswordResetEmail(user.getEmail(), rawToken);
        } catch (Exception e) {
            log.warn("Failed to dispatch password reset email to {}: {}", email, e.getMessage());
        }

        adminService.recordAuditEvent(AuditEventAction.USER_ACTIVATED, AuditEventResource.USER,
                String.valueOf(user.getId()), "SUCCESS",
                "Generated password reset token for account: " + user.getEmail());
    }

    @Override
    public void resetPassword(ResetPasswordRequestDto dto) {
        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            throw new IllegalArgumentException("New password and confirmation password do not match");
        }

        String tokenHash = hashToken(dto.getToken().trim());
        PasswordResetToken resetToken = passwordResetTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid or expired password reset token"));

        if (resetToken.getConsumedAt() != null || resetToken.getInvalidatedAt() != null) {
            throw new IllegalArgumentException("This password reset token has already been consumed or invalidated");
        }

        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("This password reset token has expired");
        }

        User user = resetToken.getUser();
        if (!user.isActive()) {
            throw new IllegalStateException("Account is inactive");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);

        resetToken.setConsumedAt(LocalDateTime.now());
        passwordResetTokenRepository.save(resetToken);

        passwordResetTokenRepository.invalidateActiveTokensForUser(user.getId());

        adminService.recordAuditEvent(AuditEventAction.USER_ACTIVATED, AuditEventResource.USER,
                String.valueOf(user.getId()), "SUCCESS",
                "Password successfully reset via token for user: " + user.getEmail());
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = md.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashBytes);
        } catch (Exception e) {
            throw new RuntimeException("Error hashing reset token", e);
        }
    }
}
