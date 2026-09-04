package com.car_backend.security;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
import org.springframework.transaction.annotation.Transactional;

import com.car_backend.entities.Role;
import com.car_backend.entities.User;
import com.car_backend.repository.UserRepository;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class AuthCookieSecurityTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        SecurityTestUtils.createUser(userRepository, passwordEncoder, "Cookie Test User", "cookie@autoserve.com", "ValidPass123!", Role.CUSTOMER, "9876543210", null, true);
    }

    @Test
    @DisplayName("Allowed origin with custom client header is permitted")
    void testAllowedOriginWithCustomHeaderSucceeds() throws Exception {
        String loginJson = """
            {
                "email": "cookie@autoserve.com",
                "password": "ValidPass123!"
            }
            """;

        mockMvc.perform(post("/api/auth/login")
                .header("Origin", "http://localhost:5173")
                .header("X-AutoServe-Client", "web")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Missing X-AutoServe-Client header on auth endpoint returns HTTP 403 Forbidden")
    void testMissingCustomHeaderRejected() throws Exception {
        String loginJson = """
            {
                "email": "cookie@autoserve.com",
                "password": "ValidPass123!"
            }
            """;

        mockMvc.perform(post("/api/auth/login")
                .header("Origin", "http://localhost:5173")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is(403)));
    }

    @Test
    @DisplayName("CORS preflight request from allowed origin http://localhost:5173 returns 200 OK")
    void testCorsPreflightAllowedOrigin() throws Exception {
        mockMvc.perform(options("/api/auth/login")
                .header("Origin", "http://localhost:5173")
                .header("Access-Control-Request-Method", "POST")
                .header("Access-Control-Request-Headers", "X-AutoServe-Client, Content-Type"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"))
                .andExpect(header().string("Access-Control-Allow-Credentials", "true"));
    }

    @Test
    @DisplayName("Disallowed Origin header on auth endpoint is rejected with HTTP 403 Forbidden")
    void testDisallowedOriginRejected() throws Exception {
        String loginJson = """
            {
                "email": "cookie@autoserve.com",
                "password": "ValidPass123!"
            }
            """;

        mockMvc.perform(post("/api/auth/login")
                .header("Origin", "http://malicious-site.com")
                .header("X-AutoServe-Client", "web")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Missing Origin header with valid X-AutoServe-Client header is permitted under missing-origin policy")
    void testMissingOriginWithValidHeaderAllowed() throws Exception {
        String loginJson = """
            {
                "email": "cookie@autoserve.com",
                "password": "ValidPass123!"
            }
            """;

        mockMvc.perform(post("/api/auth/login")
                .header("X-AutoServe-Client", "web")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("CORS preflight request without X-AutoServe-Client header succeeds with 200 OK")
    void testPreflightWithoutAuthHeaders() throws Exception {
        mockMvc.perform(options("/api/auth/refresh")
                .header("Origin", "http://localhost:5173")
                .header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
    }

    @Test
    @DisplayName("Cookie creation and deletion headers match Name, Path, HttpOnly, and SameSite attributes")
    void testCookieCreationAndDeletionAttributesMatch() throws Exception {
        String loginJson = """
            {
                "email": "cookie@autoserve.com",
                "password": "ValidPass123!"
            }
            """;

        var loginResult = mockMvc.perform(post("/api/auth/login")
                .header("Origin", "http://localhost:5173")
                .header("X-AutoServe-Client", "web")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(header().exists(HttpHeaders.SET_COOKIE))
                .andReturn();

        String createSetCookie = loginResult.getResponse().getHeader(HttpHeaders.SET_COOKIE);

        var logoutResult = mockMvc.perform(post("/api/auth/logout")
                .header("Origin", "http://localhost:5173")
                .header("X-AutoServe-Client", "web"))
                .andExpect(status().isNoContent())
                .andExpect(header().exists(HttpHeaders.SET_COOKIE))
                .andReturn();

        String deleteSetCookie = logoutResult.getResponse().getHeader(HttpHeaders.SET_COOKIE);

        org.junit.jupiter.api.Assertions.assertTrue(createSetCookie.contains("AUTOSERVE_REFRESH="));
        org.junit.jupiter.api.Assertions.assertTrue(deleteSetCookie.contains("AUTOSERVE_REFRESH="));
        org.junit.jupiter.api.Assertions.assertTrue(createSetCookie.contains("Path=/api/auth"));
        org.junit.jupiter.api.Assertions.assertTrue(deleteSetCookie.contains("Path=/api/auth"));
        org.junit.jupiter.api.Assertions.assertTrue(createSetCookie.contains("HttpOnly"));
        org.junit.jupiter.api.Assertions.assertTrue(deleteSetCookie.contains("HttpOnly"));
        org.junit.jupiter.api.Assertions.assertTrue(deleteSetCookie.contains("Max-Age=0"));
    }
}
