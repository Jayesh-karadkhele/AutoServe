package com.car_backend.service.auth;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.car_backend.config.AuthProperties;
import com.car_backend.entities.AuthSession;
import com.car_backend.entities.User;
import com.car_backend.repository.AuthSessionRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthSessionServiceImpl implements AuthSessionService {

    private final AuthSessionRepository authSessionRepository;
    private final AuthProperties authProperties;

    @Override
    @Transactional
    public AuthSession createSession(User user) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plus(Duration.ofMillis(authProperties.getSessionExpirationMs()));

        AuthSession session = AuthSession.builder()
                .sessionId(UUID.randomUUID().toString())
                .user(user)
                .createdAt(now)
                .lastUsedAt(now)
                .expiresAt(expiresAt)
                .build();

        AuthSession saved = authSessionRepository.save(session);
        log.info("Created new auth session ID: {} for user ID: {}", saved.getSessionId(), user.getId());
        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isSessionActive(String sessionId) {
        if (sessionId == null || sessionId.trim().isEmpty()) {
            return false;
        }
        return authSessionRepository.findActiveSessionById(sessionId, LocalDateTime.now()).isPresent();
    }

    @Override
    @Transactional
    public void updateSessionLastUsed(String sessionId) {
        if (sessionId == null) return;
        authSessionRepository.findById(sessionId).ifPresent(session -> {
            session.setLastUsedAt(LocalDateTime.now());
            authSessionRepository.save(session);
        });
    }

    @Override
    @Transactional
    public void revokeSession(String sessionId, String reason) {
        if (sessionId == null) return;
        authSessionRepository.findById(sessionId).ifPresent(session -> {
            if (session.getRevokedAt() == null) {
                session.setRevokedAt(LocalDateTime.now());
                session.setRevocationReason(reason);
                authSessionRepository.save(session);
                log.info("Revoked session ID: {} for reason: {}", sessionId, reason);
            }
        });
    }

    @Override
    @Transactional
    public void revokeAllUserSessions(Long userId, String reason) {
        if (userId == null) return;
        int count = authSessionRepository.revokeAllActiveSessionsForUser(userId, LocalDateTime.now(), reason);
        log.info("Revoked {} active sessions for user ID: {} with reason: {}", count, userId, reason);
    }
}
