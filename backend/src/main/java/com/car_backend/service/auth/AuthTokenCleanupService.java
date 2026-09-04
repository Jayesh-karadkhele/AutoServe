package com.car_backend.service.auth;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.car_backend.repository.AuthSessionRepository;
import com.car_backend.repository.RefreshTokenRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthTokenCleanupService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final AuthSessionRepository authSessionRepository;

    /**
     * Bounded cleanup strategy:
     * 1. Delete consumed refresh tokens older than 14 days (preserves theft detection window).
     * 2. Delete expired refresh tokens older than 7 days.
     * 3. Delete expired or revoked auth sessions older than 14 days.
     * Deletes tokens before sessions to respect foreign key constraints.
     */
    @Transactional
    public CleanupResult purgeExpiredAndRevokedTokensAndSessions() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime consumedCutoff = now.minusDays(14);
        LocalDateTime expiredTokenCutoff = now.minusDays(7);
        LocalDateTime sessionCutoff = now.minusDays(14);

        log.info("Starting bounded cleanup of expired and consumed tokens and sessions...");

        // 1. Delete old tokens first (child entities)
        int deletedTokens = refreshTokenRepository.deleteOldTokens(consumedCutoff, expiredTokenCutoff);

        // 2. Delete old sessions (parent entities)
        int deletedSessions = authSessionRepository.deleteOldSessions(sessionCutoff);

        log.info("Completed bounded cleanup. Deleted tokens: {}, Deleted sessions: {}", deletedTokens, deletedSessions);
        return new CleanupResult(deletedTokens, deletedSessions);
    }

    public record CleanupResult(int deletedTokens, int deletedSessions) {}
}
