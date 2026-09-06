package com.car_backend.security;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

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
import com.car_backend.entities.Role;
import com.car_backend.entities.User;
import com.car_backend.repository.AuthSessionRepository;
import com.car_backend.repository.UserRepository;

import jakarta.servlet.http.Cookie;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class LogoutLifecycleTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthSessionRepository authSessionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testUser;

    @BeforeEach
    void setUp() {
        authSessionRepository.deleteAll();
        userRepository.deleteAll();
        testUser = SecurityTestUtils.createUser(
                userRepository, passwordEncoder, "Logout User", "logout@autoserve.com",
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
    @DisplayName("Logout with refresh cookie revokes session and returns cleared cookie with 204 No Content")
    void testLogoutWithCookieRevokesSessionAndClearsCookie() throws Exception {
        String loginJson = """
            {
                "email": "logout@autoserve.com",
                "password": "ValidPass123!",
                "role": "CUSTOMER"
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

        // Perform logout
        MvcResult logoutResult = mockMvc.perform(post("/api/auth/logout")
                .header("Origin", "http://localhost:5173")
                .header("X-AutoServe-Client", "web")
                .cookie(refreshCookie))
                .andExpect(status().isNoContent())
                .andExpect(header().exists(HttpHeaders.SET_COOKIE))
                .andReturn();

        String setCookieHeader = logoutResult.getResponse().getHeader(HttpHeaders.SET_COOKIE);
        assertNotNull(setCookieHeader);
        assertTrue(setCookieHeader.contains("Max-Age=0"));

        // Verify session in DB is revoked
        List<AuthSession> sessions = authSessionRepository.findAll();
        assertEquals(1, sessions.size());
        assertTrue(sessions.get(0).isRevoked());
    }

    @Test
    @DisplayName("Repeated logout is safe and returns 204 No Content")
    void testRepeatedLogoutIsIdempotent() throws Exception {
        mockMvc.perform(post("/api/auth/logout")
                .header("Origin", "http://localhost:5173")
                .header("X-AutoServe-Client", "web"))
                .andExpect(status().isNoContent());

        mockMvc.perform(post("/api/auth/logout")
                .header("Origin", "http://localhost:5173")
                .header("X-AutoServe-Client", "web"))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("AccessToken becomes rejected after session logout")
    void testAccessTokenRejectedPostLogout() throws Exception {
        String loginJson = """
            {
                "email": "logout@autoserve.com",
                "password": "ValidPass123!",
                "role": "CUSTOMER"
            }
            """;

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .header("Origin", "http://localhost:5173")
                .header("X-AutoServe-Client", "web")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andReturn();

        String content = loginResult.getResponse().getContentAsString();
        String accessToken = com.fasterxml.jackson.databind.ObjectMapper.class
                .getDeclaredConstructor().newInstance()
                .readTree(content).get("token").asText();
        Cookie refreshCookie = extractRefreshCookie(loginResult);

        // Verify access token works initially
        mockMvc.perform(get("/api/users/me")
                .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk());

        // Logout
        mockMvc.perform(post("/api/auth/logout")
                .header("Origin", "http://localhost:5173")
                .header("X-AutoServe-Client", "web")
                .cookie(refreshCookie))
                .andExpect(status().isNoContent());

        // Verify access token fails post-logout
        mockMvc.perform(get("/api/users/me")
                .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Logout-all revokes all active sessions for user")
    void testLogoutAllRevokesAllSessionsForUser() throws Exception {
        // Create 2 logins (sessions)
        String loginJson = """
            {
                "email": "logout@autoserve.com",
                "password": "ValidPass123!",
                "role": "CUSTOMER"
            }
            """;

        MvcResult login1 = mockMvc.perform(post("/api/auth/login")
                .header("Origin", "http://localhost:5173")
                .header("X-AutoServe-Client", "web")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andReturn();

        MvcResult login2 = mockMvc.perform(post("/api/auth/login")
                .header("Origin", "http://localhost:5173")
                .header("X-AutoServe-Client", "web")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andReturn();

        String token1 = com.fasterxml.jackson.databind.ObjectMapper.class
                .getDeclaredConstructor().newInstance()
                .readTree(login1.getResponse().getContentAsString()).get("token").asText();

        // Check 2 sessions in DB
        List<AuthSession> activeSessions = authSessionRepository.findAllActiveByUserId(testUser.getId(), java.time.LocalDateTime.now());
        assertEquals(2, activeSessions.size());

        // Call logout-all
        mockMvc.perform(post("/api/auth/logout-all")
                .header("Origin", "http://localhost:5173")
                .header("X-AutoServe-Client", "web")
                .header("Authorization", "Bearer " + token1))
                .andExpect(status().isNoContent());

        // Verify 0 active sessions in DB
        List<AuthSession> activeSessionsAfter = authSessionRepository.findAllActiveByUserId(testUser.getId(), java.time.LocalDateTime.now());
        assertEquals(0, activeSessionsAfter.size());
    }
}
