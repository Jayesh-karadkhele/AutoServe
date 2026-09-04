package com.car_backend.security;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
public class SecurityAndRbacTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    private User adminUser;
    private User managerUser;
    private User mechanicUser;
    private User customer1User;
    private User customer2User;
    private User inactiveUser;

    private String adminToken;
    private String managerToken;
    private String mechanicToken;
    private String customer1Token;
    private String customer2Token;
    private String inactiveToken;

    private User createUser(String name, String email, String password, Role role, String mobile, User manager, boolean active) {
        User u = new User();
        u.setUserName(name);
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode(password));
        u.setUserRole(role);
        u.setMobile(mobile);
        u.setManager(manager);
        u.setActive(active);
        return userRepository.save(u);
    }

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        adminUser = createUser("Admin User", "admin@autoserve.com", "AdminPass123!", Role.ADMIN, "9999999999", null, true);
        adminToken = jwtUtil.generateToken(adminUser.getId(), adminUser.getEmail(), adminUser.getUserRole());

        managerUser = createUser("Manager User", "manager@autoserve.com", "ManagerPass123!", Role.MANAGER, "8888888888", null, true);
        managerToken = jwtUtil.generateToken(managerUser.getId(), managerUser.getEmail(), managerUser.getUserRole());

        mechanicUser = createUser("Mechanic User", "mechanic@autoserve.com", "MechanicPass123!", Role.MECHANIC, "7777777777", managerUser, true);
        mechanicToken = jwtUtil.generateToken(mechanicUser.getId(), mechanicUser.getEmail(), mechanicUser.getUserRole());

        customer1User = createUser("Customer One", "customer1@autoserve.com", "CustomerPass123!", Role.CUSTOMER, "6666666666", null, true);
        customer1Token = jwtUtil.generateToken(customer1User.getId(), customer1User.getEmail(), customer1User.getUserRole());

        customer2User = createUser("Customer Two", "customer2@autoserve.com", "CustomerPass123!", Role.CUSTOMER, "5555555555", null, true);
        customer2Token = jwtUtil.generateToken(customer2User.getId(), customer2User.getEmail(), customer2User.getUserRole());

        inactiveUser = createUser("Inactive User", "inactive@autoserve.com", "InactivePass123!", Role.CUSTOMER, "4444444444", null, false);
        inactiveToken = jwtUtil.generateToken(inactiveUser.getId(), inactiveUser.getEmail(), inactiveUser.getUserRole());
    }

    // ==========================================
    // 1. AUTHENTICATION & PUBLIC REGISTRATION
    // ==========================================

    @Test
    @DisplayName("Public customer registration succeeds and creates CUSTOMER account")
    void testPublicCustomerRegistrationSuccess() throws Exception {
        String payload = """
                {
                    "name": "New Public Customer",
                    "email": "newcustomer@autoserve.com",
                    "password": "ValidPassword123!",
                    "phone": "9876543210"
                }
                """;

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.role", is("CUSTOMER")));
    }

    @Test
    @DisplayName("Submitting unknown role parameter on registration is rejected with HTTP 400 Bad Request")
    void testPublicRegistrationRejectsAdminPrivilegeEscalation() throws Exception {
        String payload = """
                {
                    "name": "Attacker",
                    "email": "attacker@autoserve.com",
                    "password": "ValidPassword123!",
                    "phone": "9876543210",
                    "role": "ADMIN"
                }
                """;

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Invalid login credentials return HTTP 401 Unauthorized")
    void testInvalidLoginReturns401() throws Exception {
        String payload = """
                {
                    "email": "customer1@autoserve.com",
                    "password": "WrongPassword!"
                }
                """;

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)))
                .andExpect(jsonPath("$.error", is("Unauthorized")));
    }

    @Test
    @DisplayName("Inactive user login returns HTTP 401 Unauthorized")
    void testInactiveUserLoginReturns401() throws Exception {
        String payload = """
                {
                    "email": "inactive@autoserve.com",
                    "password": "InactivePass123!"
                }
                """;

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("JWT token for deactivated user is rejected with HTTP 401 Unauthorized")
    void testInactiveUserJwtTokenRejected() throws Exception {
        mockMvc.perform(get("/api/users/me")
                .header("Authorization", "Bearer " + inactiveToken))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Unauthenticated request to protected endpoint returns HTTP 401 Unauthorized")
    void testUnauthenticatedRequestReturns401() throws Exception {
        mockMvc.perform(get("/api/users/getUsers"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)))
                .andExpect(jsonPath("$.error", is("Unauthorized")));
    }

    // ==========================================
    // 2. USER & STAFF MANAGEMENT RBAC
    // ==========================================

    @Test
    @DisplayName("Customer cannot list all users (HTTP 403 Forbidden)")
    void testCustomerCannotListUsers() throws Exception {
        mockMvc.perform(get("/api/users/getUsers")
                .header("Authorization", "Bearer " + customer1Token))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is(403)))
                .andExpect(jsonPath("$.error", is("Forbidden")));
    }

    @Test
    @DisplayName("Customer cannot create staff accounts (HTTP 403 Forbidden)")
    void testCustomerCannotCreateStaff() throws Exception {
        String payload = """
                {
                    "userName": "Rogue Staff",
                    "email": "rogue@autoserve.com",
                    "password": "ValidPassword123!",
                    "userRole": "MANAGER",
                    "mobile": "1234567890"
                }
                """;

        mockMvc.perform(post("/api/users")
                .header("Authorization", "Bearer " + customer1Token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Admin can create staff account successfully")
    void testAdminCanCreateStaff() throws Exception {
        String payload = """
                {
                    "userName": "New Manager Staff",
                    "email": "newmanager@autoserve.com",
                    "password": "ValidPassword123!",
                    "userRole": "MANAGER",
                    "mobile": "1234567890"
                }
                """;

        mockMvc.perform(post("/api/users")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.userRole", is("MANAGER")));
    }

    @Test
    @DisplayName("User can view own profile at GET /api/users/me")
    void testUserCanViewOwnProfile() throws Exception {
        mockMvc.perform(get("/api/users/me")
                .header("Authorization", "Bearer " + customer1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is("customer1@autoserve.com")));
    }

    // ==========================================
    // 3. INVENTORY MANAGEMENT RBAC
    // ==========================================

    @Test
    @DisplayName("Customer cannot read inventory list (HTTP 403 Forbidden)")
    void testCustomerCannotReadInventory() throws Exception {
        mockMvc.perform(get("/api/inventory")
                .header("Authorization", "Bearer " + customer1Token))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Mechanic can read inventory list")
    void testMechanicCanReadInventory() throws Exception {
        mockMvc.perform(get("/api/inventory")
                .header("Authorization", "Bearer " + mechanicToken))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Mechanic cannot create inventory master items (HTTP 403 Forbidden)")
    void testMechanicCannotCreateInventory() throws Exception {
        String payload = """
                {
                    "itemName": "Brake Oil",
                    "skuCode": "SKU-OIL-123",
                    "currentPrice": 450.0,
                    "stockQuantity": 50
                }
                """;

        mockMvc.perform(post("/api/inventory")
                .header("Authorization", "Bearer " + mechanicToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Admin can create inventory master item")
    void testAdminCanCreateInventory() throws Exception {
        String payload = """
                {
                    "itemName": "Brake Oil Synthetics",
                    "skuCode": "SKU-OIL-999",
                    "currentPrice": 450.0,
                    "stockQuantity": 50
                }
                """;

        mockMvc.perform(post("/api/inventory")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.skuCode", is("SKU-OIL-999")));
    }

    // ==========================================
    // 4. INVOICE & PAYMENT SECURITY
    // ==========================================

    @Test
    @DisplayName("Customer cannot view global revenue metrics (HTTP 403 Forbidden)")
    void testCustomerCannotViewTotalRevenue() throws Exception {
        mockMvc.perform(get("/api/invoices/stats/total_revenue")
                .header("Authorization", "Bearer " + customer1Token))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Payment simulation endpoint is unavailable (HTTP 404 Not Found)")
    void testSimulatePaymentEndpointIs404() throws Exception {
        mockMvc.perform(post("/api/invoices/1/simulate_payment")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNotFound());
    }

    // ==========================================
    // 5. CORS CONFIGURATION
    // ==========================================

    @Test
    @DisplayName("Allowed CORS origin http://localhost:5173 is accepted in preflight")
    void testAllowedCorsOriginAccepted() throws Exception {
        mockMvc.perform(options("/api/auth/login")
                .header("Origin", "http://localhost:5173")
                .header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
    }
}
