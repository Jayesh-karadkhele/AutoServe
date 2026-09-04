package com.car_backend.service.auth;

import org.springframework.http.ResponseCookie;

import com.car_backend.dto.UserResponseDto;
import com.car_backend.dto.auth.AuthResponseDto;
import com.car_backend.dto.auth.LoginRequestDto;
import com.car_backend.dto.auth.RegisterRequestDto;
import com.car_backend.exceptions.DuplicateEmailException;

public interface AuthService {
    UserResponseDto register(RegisterRequestDto request) throws DuplicateEmailException;
    AuthResult login(LoginRequestDto request);
    AuthResult refresh(String rawRefreshToken);
    ResponseCookie logout(String bearerToken, String rawRefreshToken);
    ResponseCookie logoutAll(Long userId);

    public record AuthResult(AuthResponseDto responseDto, ResponseCookie refreshCookie) {}
}