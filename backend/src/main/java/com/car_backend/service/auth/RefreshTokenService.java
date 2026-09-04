package com.car_backend.service.auth;

import com.car_backend.entities.AuthSession;
import com.car_backend.entities.RefreshToken;

public interface RefreshTokenService {
    String generateAndSaveRefreshToken(AuthSession session);
    String hashToken(String rawToken);
    RefreshTokenResult rotateRefreshToken(String rawRefreshToken);
    void revokeTokensForSession(String sessionId);

    public record RefreshTokenResult(String newRawToken, RefreshToken tokenEntity) {}
}
