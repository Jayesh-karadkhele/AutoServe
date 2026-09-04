package com.car_backend.controller.auth;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.car_backend.dto.UserResponseDto;
import com.car_backend.dto.auth.AuthResponseDto;
import com.car_backend.dto.auth.LoginRequestDto;
import com.car_backend.dto.auth.RegisterRequestDto;
import com.car_backend.exceptions.DuplicateEmailException;
import com.car_backend.exceptions.UnauthorizedException;
import com.car_backend.security.service.CurrentUserService;
import com.car_backend.service.auth.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final CurrentUserService currentUserService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> register(
            @Valid @RequestBody RegisterRequestDto request) throws DuplicateEmailException {
        log.info("Registration request received for email: {}", request.getEmail());
        UserResponseDto response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(
            @Valid @RequestBody LoginRequestDto request) {
        log.info("Login request received for email: {}", request.getEmail());
        AuthService.AuthResult result = authService.login(request);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, result.refreshCookie().toString())
                .body(result.responseDto());
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseDto> refresh(
            @CookieValue(name = "${app.auth.cookie-name:AUTOSERVE_REFRESH}", required = false) String rawRefreshToken) {
        log.info("Refresh token request received");
        if (rawRefreshToken == null || rawRefreshToken.trim().isEmpty()) {
            throw new UnauthorizedException("Missing refresh token cookie");
        }
        
        AuthService.AuthResult result = authService.refresh(rawRefreshToken);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, result.refreshCookie().toString())
                .body(result.responseDto());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String bearerToken,
            @CookieValue(name = "${app.auth.cookie-name:AUTOSERVE_REFRESH}", required = false) String rawRefreshToken) {
        log.info("Logout request received");
        ResponseCookie clearCookie = authService.logout(bearerToken, rawRefreshToken);
        
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, clearCookie.toString())
                .build();
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/logout-all")
    public ResponseEntity<Void> logoutAll() {
        Long currentUserId = currentUserService.getUserId();
        log.info("Logout-all request received for user ID: {}", currentUserId);
        
        ResponseCookie clearCookie = authService.logoutAll(currentUserId);
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, clearCookie.toString())
                .build();
    }
}
