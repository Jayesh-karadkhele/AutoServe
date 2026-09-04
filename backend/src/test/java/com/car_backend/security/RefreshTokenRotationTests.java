package com.car_backend.security;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import com.car_backend.entities.AuthSession;
import com.car_backend.entities.RefreshToken;
import com.car_backend.entities.Role;
import com.car_backend.entities.User;
import com.car_backend.repository.AuthSessionRepository;
import com.car_backend.repository.RefreshTokenRepository;
import com.car_backend.repository.UserRepository;

import jakarta.servlet.http.Cookie;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class RefreshTokenRotationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthSessionRepository authSessionRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testUser;

    @BeforeEach
    void setUp() {
        refreshTokenRepository.deleteAll();
        authSessionRepository.deleteAll();
        userRepository.deleteAll();
        testUser = SecurityTestUtils.createUser(
                userRepository, passwordEncoder, "Test User", "testuser@autoserve.com",
                "ValidPass123!", Role.CUSTOMER, "9876543210", null, true);
    }

    private Cookie extractRefreshCookie(MvcResult result) {
        String setCookieHeader = result.getResponse().getHeader(HttpHeaders.SET_COOKIE);
        if (setCookieHeader == null) return null;
        String[] parts = setCookieHeader.split(";");
        String[] nameValue = parts[0].split("=");
        return new Cookie(nameValue[0], nameValue.length > 1 ? nameValue[1] : "");
    }

    @Test
    @DisplayName("Refreshing token successfully rotates refresh token and returns new access token")
    void testSuccessfulRefreshTokenRotation() throws Exception {
        String loginJson = """
            {
                "email": "testuser@autoserve.com",
                "password": "ValidPass123!"
            }
            """;

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .header("Origin", "http://localhost:5173")
                .header("X-AutoServe-Client", "web")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andReturn();

        Cookie refreshCookie = extractRefreshCookie(loginResult);
        assertNotNull(refreshCookie);

        // Perform refresh
        MvcResult refreshResult = mockMvc.perform(post("/api/auth/refresh")
                .header("Origin", "http://localhost:5173")
                .header("X-AutoServe-Client", "web")
                .cookie(refreshCookie))
                .andExpect(status().isOk())
                .andExpect(header().exists(HttpHeaders.SET_COOKIE))
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.sessionId", notNullValue()))
                .andReturn();

        Cookie newRefreshCookie = extractRefreshCookie(refreshResult);
        assertNotNull(newRefreshCookie);
        assertFalse(newRefreshCookie.getValue().equals(refreshCookie.getValue()), "Refresh token should be rotated");

        // Verify in DB: 2 tokens exist (1 consumed, 1 active)
        List<RefreshToken> tokens = refreshTokenRepository.findAll();
        assertEquals(2, tokens.size());
        long consumedCount = tokens.stream().filter(RefreshToken::isConsumed).count();
        long activeCount = tokens.stream().filter(RefreshToken::isUsable).count();
        assertEquals(1, consumedCount);
        assertEquals(1, activeCount);
    }

    @Test
    @DisplayName("Reuse of consumed refresh token triggers theft detection and revokes entire AuthSession")
    void testReuseOfConsumedRefreshTokenTriggersTheftDetection() throws Exception {
        String loginJson = """
            {
                "email": "testuser@autoserve.com",
                "password": "ValidPass123!"
            }
            """;

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .header("Origin", "http://localhost:5173")
                .header("X-AutoServe-Client", "web")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andReturn();

        Cookie firstCookie = extractRefreshCookie(loginResult);
        assertNotNull(firstCookie);

        // First refresh (consumes firstCookie, rotates to secondCookie)
        mockMvc.perform(post("/api/auth/refresh")
                .header("Origin", "http://localhost:5173")
                .header("X-AutoServe-Client", "web")
                .cookie(firstCookie))
                .andExpect(status().isOk());

        // Attacker / duplicate request uses firstCookie AGAIN!
        mockMvc.perform(post("/api/auth/refresh")
                .header("Origin", "http://localhost:5173")
                .header("X-AutoServe-Client", "web")
                .cookie(firstCookie))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)));

        // Verify session was revoked due to theft detection
        List<AuthSession> sessions = authSessionRepository.findAll();
        assertEquals(1, sessions.size());
        assertTrue(sessions.get(0).isRevoked());
        assertTrue(sessions.get(0).getRevocationReason().contains("THEFT"));
    }

    @Test
    @DisplayName("Completely unknown refresh token hash returns HTTP 401 without error")
    void testUnknownRefreshTokenReturns401() throws Exception {
        Cookie unknownCookie = new Cookie("AUTOSERVE_REFRESH", "completely_unknown_token_value_1234567890_abc");

        mockMvc.perform(post("/api/auth/refresh")
                .header("Origin", "http://localhost:5173")
                .header("X-AutoServe-Client", "web")
                .cookie(unknownCookie))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)));
    }
}
