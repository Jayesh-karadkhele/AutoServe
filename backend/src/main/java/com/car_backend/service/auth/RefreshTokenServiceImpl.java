package com.car_backend.service.auth;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.car_backend.config.AuthProperties;
import com.car_backend.entities.AuthSession;
import com.car_backend.entities.RefreshToken;
import com.car_backend.exceptions.UnauthorizedException;
import com.car_backend.repository.RefreshTokenRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final AuthSessionService authSessionService;
    private final AuthProperties authProperties;
    private final SecureRandom secureRandom = new SecureRandom();

    @Override
    @Transactional
    public String generateAndSaveRefreshToken(AuthSession session) {
        byte[] randomBytes = new byte[32]; // 256 bits entropy
        secureRandom.nextBytes(randomBytes);
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);

        String tokenHash = hashToken(rawToken);
        LocalDateTime now = LocalDateTime.now();
        
        // Refresh token lifetime capped by session expiration
        LocalDateTime maxRefreshExpiry = now.plus(Duration.ofMillis(authProperties.getRefreshTokenExpirationMs()));
        LocalDateTime actualExpiry = maxRefreshExpiry.isBefore(session.getExpiresAt()) ? maxRefreshExpiry : session.getExpiresAt();

        RefreshToken refreshToken = RefreshToken.builder()
                .session(session)
                .tokenHash(tokenHash)
                .issuedAt(now)
                .expiresAt(actualExpiry)
                .build();

        refreshTokenRepository.save(refreshToken);
        return rawToken;
    }

    @Override
    public String hashToken(String rawToken) {
        if (rawToken == null || rawToken.trim().isEmpty()) {
            throw new UnauthorizedException("Missing refresh token");
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 digest algorithm unavailable", e);
        }
    }

    @Override
    @Transactional
    public RefreshTokenResult rotateRefreshToken(String rawRefreshToken) {
        String tokenHash = hashToken(rawRefreshToken);
        LocalDateTime now = LocalDateTime.now();

        // Locked lookup to guarantee concurrency safety
        RefreshToken existingToken = refreshTokenRepository.findByTokenHashWithLock(tokenHash)
                .orElseThrow(() -> {
                    log.warn("Refresh request with completely unknown token hash");
                    return new UnauthorizedException("Invalid refresh token");
                });

        AuthSession session = existingToken.getSession();

        // Theft Reuse Detection: If already consumed or replaced, revoke entire session
        if (existingToken.getConsumedAt() != null || existingToken.getReplacedBy() != null) {
            log.warn("SECURITY ALERT: Reuse of consumed refresh token ID: {}! Revoking session ID: {}", 
                    existingToken.getId(), session.getSessionId());
            authSessionService.revokeSession(session.getSessionId(), "REFRESH_TOKEN_REUSE_THEFT_DETECTED");
            throw new UnauthorizedException("Invalid or reused refresh token");
        }

        // Check if token or session is revoked or expired
        if (existingToken.getRevokedAt() != null || now.isAfter(existingToken.getExpiresAt()) || !session.isActive()) {
            log.warn("Attempt to refresh with expired/revoked token ID: {}", existingToken.getId());
            throw new UnauthorizedException("Invalid or expired refresh token");
        }

        // Mark existing token consumed
        existingToken.setConsumedAt(now);

        // Generate and save new rotated refresh token
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);
        String newRawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
        String newHash = hashToken(newRawToken);

        LocalDateTime maxRefreshExpiry = now.plus(Duration.ofMillis(authProperties.getRefreshTokenExpirationMs()));
        LocalDateTime actualExpiry = maxRefreshExpiry.isBefore(session.getExpiresAt()) ? maxRefreshExpiry : session.getExpiresAt();

        RefreshToken replacementToken = RefreshToken.builder()
                .session(session)
                .tokenHash(newHash)
                .issuedAt(now)
                .expiresAt(actualExpiry)
                .build();

        RefreshToken savedReplacement = refreshTokenRepository.save(replacementToken);
        existingToken.setReplacedBy(savedReplacement);
        refreshTokenRepository.save(existingToken);

        // Update session last-used
        authSessionService.updateSessionLastUsed(session.getSessionId());

        return new RefreshTokenResult(newRawToken, savedReplacement);
    }

    @Override
    @Transactional
    public void revokeTokensForSession(String sessionId) {
        if (sessionId == null) return;
        refreshTokenRepository.revokeAllTokensForSession(sessionId, LocalDateTime.now());
    }
}
