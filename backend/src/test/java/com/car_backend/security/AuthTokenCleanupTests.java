package com.car_backend.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import com.car_backend.entities.AuthSession;
import com.car_backend.entities.RefreshToken;
import com.car_backend.entities.Role;
import com.car_backend.entities.User;
import com.car_backend.repository.AuthSessionRepository;
import com.car_backend.repository.RefreshTokenRepository;
import com.car_backend.repository.UserRepository;
import com.car_backend.service.auth.AuthTokenCleanupService;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class AuthTokenCleanupTests {

    @Autowired
    private AuthTokenCleanupService cleanupService;

    @Autowired
    private AuthSessionRepository authSessionRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testUser;

    @BeforeEach
    void setUp() {
        refreshTokenRepository.deleteAll();
        authSessionRepository.deleteAll();
        userRepository.deleteAll();
        testUser = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Cleanup User", "cleanup@autoserve.com", "ValidPass123!", Role.CUSTOMER, "9876543210", null, true);
    }

    @Test
    @DisplayName("Bounded cleanup purges old expired tokens and sessions while preserving active data")
    void testBoundedCleanupDeletesOldTokensAndSessions() {
        LocalDateTime now = LocalDateTime.now();

        // 1. Create an active session and active token
        AuthSession activeSession = AuthSession.builder()
                .sessionId("active-session-uuid-1111")
                .user(testUser)
                .createdAt(now)
                .lastUsedAt(now)
                .expiresAt(now.plusDays(7))
                .build();
        authSessionRepository.save(activeSession);

        RefreshToken activeToken = RefreshToken.builder()
                .session(activeSession)
                .tokenHash("active_token_hash_111111111111111111111111111111111111111111111")
                .issuedAt(now)
                .expiresAt(now.plusDays(7))
                .build();
        refreshTokenRepository.save(activeToken);

        // 2. Create an old expired session and old consumed token (older than 14 days)
        AuthSession oldSession = AuthSession.builder()
                .sessionId("old-session-uuid-9999")
                .user(testUser)
                .createdAt(now.minusDays(30))
                .lastUsedAt(now.minusDays(30))
                .expiresAt(now.minusDays(20))
                .revokedAt(now.minusDays(20))
                .revocationReason("EXPIRED_TEST")
                .build();
        authSessionRepository.save(oldSession);

        RefreshToken oldToken = RefreshToken.builder()
                .session(oldSession)
                .tokenHash("old_token_hash_9999999999999999999999999999999999999999999999")
                .issuedAt(now.minusDays(30))
                .expiresAt(now.minusDays(23))
                .consumedAt(now.minusDays(20))
                .build();
        refreshTokenRepository.save(oldToken);

        assertEquals(2, authSessionRepository.count());
        assertEquals(2, refreshTokenRepository.count());

        // Execute cleanup
        AuthTokenCleanupService.CleanupResult result = cleanupService.purgeExpiredAndRevokedTokensAndSessions();

        assertEquals(1, result.deletedTokens());
        assertEquals(1, result.deletedSessions());

        // Verify active session and token remain
        assertEquals(1, authSessionRepository.count());
        assertEquals(1, refreshTokenRepository.count());
        assertTrue(authSessionRepository.findById("active-session-uuid-1111").isPresent());
    }
}
