package com.car_backend.security;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.car_backend.entities.Role;
import com.car_backend.entities.User;
import com.car_backend.repository.UserRepository;
import com.car_backend.security.jwt.JwtUtil;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class AuthenticationSecurityTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    private User activeUser;
    private User inactiveUser;
    private String activeToken;
    private String inactiveToken;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        activeUser = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Active User", "active@autoserve.com", "ActivePass123!", Role.CUSTOMER, "9876543210", null, true);
        inactiveUser = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Inactive User", "inactive@autoserve.com", "InactivePass123!", Role.CUSTOMER, "9876543211", null, false);

        activeToken = SecurityTestUtils.createToken(jwtUtil, activeUser);
        inactiveToken = SecurityTestUtils.createToken(jwtUtil, inactiveUser);
    }

    @Test
    @DisplayName("Public customer registration succeeds with Role.CUSTOMER")
    void testPublicRegistrationSuccess() throws Exception {
        long initialCount = userRepository.count();
        String json = """
            {
                "name": "Jane Customer",
                "email": "jane@autoserve.com",
                "password": "ValidPass123!",
                "phone": "9988776655"
            }
            """;

        mockMvc.perform(post("/api/auth/register")
                .header("X-AutoServe-Client", "web")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.userId", notNullValue()))
                .andExpect(jsonPath("$.userRole", is("CUSTOMER")))
                .andExpect(jsonPath("$.email", is("jane@autoserve.com")));

        assertEquals(initialCount + 1, userRepository.count());
    }

    @Test
    @DisplayName("Public registration with role=ADMIN returns 400 Bad Request and does not insert user")
    void testPublicRegistrationRejectsAdminRole() throws Exception {
        long initialCount = userRepository.count();
        String json = """
            {
                "name": "Attacker",
                "email": "attacker@autoserve.com",
                "password": "AttackerPass123!",
                "phone": "9998887776",
                "role": "ADMIN"
            }
            """;

        mockMvc.perform(post("/api/auth/register")
                .header("X-AutoServe-Client", "web")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isBadRequest());

        assertEquals(initialCount, userRepository.count());
    }

    @Test
    @DisplayName("Public registration with role=MANAGER returns 400 Bad Request and does not insert user")
    void testPublicRegistrationRejectsManagerRole() throws Exception {
        long initialCount = userRepository.count();
        String json = """
            {
                "name": "Attacker",
                "email": "attacker2@autoserve.com",
                "password": "AttackerPass123!",
                "phone": "9998887775",
                "role": "MANAGER"
            }
            """;

        mockMvc.perform(post("/api/auth/register")
                .header("X-AutoServe-Client", "web")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isBadRequest());

        assertEquals(initialCount, userRepository.count());
    }

    @Test
    @DisplayName("Public registration with role=MECHANIC returns 400 Bad Request and does not insert user")
    void testPublicRegistrationRejectsMechanicRole() throws Exception {
        long initialCount = userRepository.count();
        String json = """
            {
                "name": "Attacker",
                "email": "attacker3@autoserve.com",
                "password": "AttackerPass123!",
                "phone": "9998887774",
                "role": "MECHANIC"
            }
            """;

        mockMvc.perform(post("/api/auth/register")
                .header("X-AutoServe-Client", "web")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isBadRequest());

        assertEquals(initialCount, userRepository.count());
    }

    @Test
    @DisplayName("Public registration normalizes email to lowercase")
    void testPublicRegistrationNormalizesEmail() throws Exception {
        String json = """
            {
                "name": "Normalized User",
                "email": "NORMALIZED@AutoServe.Com",
                "password": "ValidPass123!",
                "phone": "9988776644"
            }
            """;

        mockMvc.perform(post("/api/auth/register")
                .header("X-AutoServe-Client", "web")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email", is("normalized@autoserve.com")));
    }

    @Test
    @DisplayName("Weak password in public registration is rejected with 400 Bad Request")
    void testPublicRegistrationRejectsWeakPassword() throws Exception {
        long initialCount = userRepository.count();
        String json = """
            {
                "name": "Weak User",
                "email": "weak@autoserve.com",
                "password": "weak",
                "phone": "9988776633"
            }
            """;

        mockMvc.perform(post("/api/auth/register")
                .header("X-AutoServe-Client", "web")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isBadRequest());

        assertEquals(initialCount, userRepository.count());
    }

    @Test
    @DisplayName("Password longer than 72 characters is rejected with 400 Bad Request")
    void testPublicRegistrationRejectsLongPassword() throws Exception {
        long initialCount = userRepository.count();
        String longPass = "A1!" + "a".repeat(70);
        String json = String.format("""
            {
                "name": "Long Pass User",
                "email": "longpass@autoserve.com",
                "password": "%s",
                "phone": "9988776622"
            }
            """, longPass);

        mockMvc.perform(post("/api/auth/register")
                .header("X-AutoServe-Client", "web")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isBadRequest());

        assertEquals(initialCount, userRepository.count());
    }

    @Test
    @DisplayName("Invalid login credentials return HTTP 401 JSON")
    void testInvalidLoginReturns401() throws Exception {
        String json = """
            {
                "email": "active@autoserve.com",
                "password": "WrongPassword123!",
                "role": "CUSTOMER"
            }
            """;

        mockMvc.perform(post("/api/auth/login")
                .header("X-AutoServe-Client", "web")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)))
                .andExpect(jsonPath("$.error", is("Unauthorized")));
    }

    @Test
    @DisplayName("Inactive user login returns HTTP 401 JSON")
    void testInactiveLoginReturns401() throws Exception {
        String json = """
            {
                "email": "inactive@autoserve.com",
                "password": "InactivePass123!",
                "role": "CUSTOMER"
            }
            """;

        mockMvc.perform(post("/api/auth/login")
                .header("X-AutoServe-Client", "web")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)));
    }

    @Test
    @DisplayName("JWT of an inactive user is rejected with HTTP 401 JSON")
    void testInactiveUserJwtRejected() throws Exception {
        mockMvc.perform(get("/api/users/me")
                .header("Authorization", "Bearer " + inactiveToken))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)));
    }

    @Test
    @DisplayName("Missing JWT token returns HTTP 401 JSON")
    void testMissingTokenReturns401() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)));
    }

    @Test
    @DisplayName("Malformed JWT token returns HTTP 401 JSON")
    void testMalformedTokenReturns401() throws Exception {
        mockMvc.perform(get("/api/users/me")
                .header("Authorization", "Bearer malformed.invalid.token"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)));
    }
}
