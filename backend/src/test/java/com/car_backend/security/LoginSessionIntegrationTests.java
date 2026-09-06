package com.car_backend.security;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
import com.car_backend.entities.Role;
import com.car_backend.entities.User;
import com.car_backend.repository.AuthSessionRepository;
import com.car_backend.repository.UserRepository;
import com.car_backend.security.jwt.JwtUtil;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class LoginSessionIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthSessionRepository authSessionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    private User testUser;

    @BeforeEach
    void setUp() {
        authSessionRepository.deleteAll();
        userRepository.deleteAll();
        testUser = SecurityTestUtils.createUser(
                userRepository, passwordEncoder, "Test User", "testuser@autoserve.com",
                "ValidPass123!", Role.CUSTOMER, "9876543210", null, true);
    }

    @Test
    @DisplayName("Login creates active AuthSession and returns JWT, User details, and HttpOnly cookie")
    void testLoginCreatesActiveSessionAndReturnsJwtAndCookie() throws Exception {
        String loginJson = """
            {
                "email": "testuser@autoserve.com",
                "password": "ValidPass123!",
                "role": "CUSTOMER"
            }
            """;

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .header("Origin", "http://localhost:5173")
                .header("X-AutoServe-Client", "web")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(header().exists(HttpHeaders.SET_COOKIE))
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.tokenType", is("Bearer")))
                .andExpect(jsonPath("$.role", is("CUSTOMER")))
                .andExpect(jsonPath("$.email", is("testuser@autoserve.com")))
                .andExpect(jsonPath("$.sessionId", notNullValue()))
                .andReturn();

        String setCookie = result.getResponse().getHeader(HttpHeaders.SET_COOKIE);
        assertNotNull(setCookie);
        assertTrue(setCookie.contains("AUTOSERVE_REFRESH="));
        assertTrue(setCookie.contains("HttpOnly"));
        assertTrue(setCookie.contains("Path=/api/auth"));

        // Verify DB session
        long sessionCount = authSessionRepository.count();
        assertEquals(1, sessionCount);
        AuthSession session = authSessionRepository.findAll().get(0);
        assertTrue(session.isActive());
        assertEquals(testUser.getId(), session.getUser().getId());
    }

    @Test
    @DisplayName("Manager login with manager0521 succeeds and binds session to MANAGER principal")
    void testManagerLoginSuccess() throws Exception {
        String loginJson = """
            {
                "email": "alex.manager@service.com",
                "password": "manager0521",
                "role": "MANAGER"
            }
            """;

        mockMvc.perform(post("/api/auth/login")
                .header("Origin", "http://localhost:5173")
                .header("X-AutoServe-Client", "web")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role", is("MANAGER")))
                .andExpect(jsonPath("$.email", is("alex.manager@service.com")))
                .andExpect(jsonPath("$.token", notNullValue()));

        assertEquals(1, authSessionRepository.count());
    }

    @Test
    @DisplayName("Mechanic login with Mech0521 succeeds and binds session to MECHANIC principal")
    void testMechanicLoginSuccess() throws Exception {
        String loginJson = """
            {
                "email": "sam.mechanic@service.com",
                "password": "Mech0521",
                "role": "MECHANIC"
            }
            """;

        mockMvc.perform(post("/api/auth/login")
                .header("Origin", "http://localhost:5173")
                .header("X-AutoServe-Client", "web")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role", is("MECHANIC")))
                .andExpect(jsonPath("$.email", is("sam.mechanic@service.com")))
                .andExpect(jsonPath("$.token", notNullValue()));

        assertEquals(1, authSessionRepository.count());
    }

    @Test
    @DisplayName("Admin login with ad0521 succeeds and binds session to ADMIN principal")
    void testAdminLoginSuccess() throws Exception {
        String loginJson = """
            {
                "email": "sysadmin@service.com",
                "password": "ad0521",
                "role": "ADMIN"
            }
            """;

        mockMvc.perform(post("/api/auth/login")
                .header("Origin", "http://localhost:5173")
                .header("X-AutoServe-Client", "web")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role", is("ADMIN")))
                .andExpect(jsonPath("$.email", is("sysadmin@service.com")))
                .andExpect(jsonPath("$.token", notNullValue()));

        assertEquals(1, authSessionRepository.count());
    }

    @Test
    @DisplayName("Manager login with wrong password returns 401 Unauthorized")
    void testManagerLoginWrongPasswordReturns401() throws Exception {
        String loginJson = """
            {
                "email": "alex.manager@service.com",
                "password": "wrongpassword",
                "role": "MANAGER"
            }
            """;

        mockMvc.perform(post("/api/auth/login")
                .header("Origin", "http://localhost:5173")
                .header("X-AutoServe-Client", "web")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error", is("Unauthorized")))
                .andExpect(jsonPath("$.message", is("Invalid email, password, or selected role")));
    }

    @Test
    @DisplayName("Login for inactive user is rejected with HTTP 401")
    void testLoginValidatesActiveUserStatus() throws Exception {
        User inactive = SecurityTestUtils.createUser(
                userRepository, passwordEncoder, "Inactive User", "inactive@autoserve.com",
                "ValidPass123!", Role.CUSTOMER, "9876543211", null, false);

        String loginJson = """
            {
                "email": "inactive@autoserve.com",
                "password": "ValidPass123!",
                "role": "CUSTOMER"
            }
            """;

        mockMvc.perform(post("/api/auth/login")
                .header("Origin", "http://localhost:5173")
                .header("X-AutoServe-Client", "web")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)));
    }

    @Test
    @DisplayName("JWT claims contain userId, sid, email, and role")
    void testJwtContainsSidAndClaims() throws Exception {
        String loginJson = """
            {
                "email": "testuser@autoserve.com",
                "password": "ValidPass123!",
                "role": "CUSTOMER"
            }
            """;

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .header("Origin", "http://localhost:5173")
                .header("X-AutoServe-Client", "web")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        String token = com.fasterxml.jackson.databind.ObjectMapper.class
                .getDeclaredConstructor().newInstance()
                .readTree(content).get("token").asText();

        Long userId = jwtUtil.getUserIdFromToken(token);
        assertEquals(testUser.getId(), userId);

        String email = jwtUtil.getEmailFromToken(token);
        assertEquals("testuser@autoserve.com", email);

        String sid = jwtUtil.getSessionIdFromToken(token);
        assertNotNull(sid);
        assertFalse(sid.isEmpty());
    }

    @Test
    @DisplayName("Accessing /api/users/me with valid JWT and active DB session succeeds")
    void testAccessingMeWithValidJwtAndActiveSession() throws Exception {
        String loginJson = """
            {
                "email": "testuser@autoserve.com",
                "password": "ValidPass123!",
                "role": "CUSTOMER"
            }
            """;

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .header("Origin", "http://localhost:5173")
                .header("X-AutoServe-Client", "web")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        String token = com.fasterxml.jackson.databind.ObjectMapper.class
                .getDeclaredConstructor().newInstance()
                .readTree(content).get("token").asText();

        mockMvc.perform(get("/api/users/me")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is("testuser@autoserve.com")))
                .andExpect(jsonPath("$.userId", is(testUser.getId().intValue())));
    }

    @Test
    @DisplayName("Accessing /api/users/me with valid JWT but revoked DB session fails with HTTP 401")
    void testAccessingMeWithValidJwtButRevokedSession() throws Exception {
        String loginJson = """
            {
                "email": "testuser@autoserve.com",
                "password": "ValidPass123!",
                "role": "CUSTOMER"
            }
            """;

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .header("Origin", "http://localhost:5173")
                .header("X-AutoServe-Client", "web")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        String token = com.fasterxml.jackson.databind.ObjectMapper.class
                .getDeclaredConstructor().newInstance()
                .readTree(content).get("token").asText();
        String sid = jwtUtil.getSessionIdFromToken(token);

        // Manually revoke the session in DB
        Optional<AuthSession> sessionOpt = authSessionRepository.findById(sid);
        assertTrue(sessionOpt.isPresent());
        AuthSession session = sessionOpt.get();
        session.revoke("Test revocation");
        authSessionRepository.saveAndFlush(session);

        // Attempt request with valid JWT
        mockMvc.perform(get("/api/users/me")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)));
    }
}
