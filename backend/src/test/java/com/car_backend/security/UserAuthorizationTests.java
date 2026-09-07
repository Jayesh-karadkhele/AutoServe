package com.car_backend.security;

import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
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
public class UserAuthorizationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private com.car_backend.repository.VehicleRepository vehicleRepository;

    @Autowired
    private com.car_backend.repository.AppointmentRepository appointmentRepository;

    @Autowired
    private com.car_backend.repository.JobCardRepository jobCardRepository;

    @Autowired
    private com.car_backend.repository.InvoiceRepository invoiceRepository;

    private User admin;
    private User manager;
    private User mechanic;
    private User customer1;
    private User customer2;

    private String adminToken;
    private String managerToken;
    private String mechanicToken;
    private String customer1Token;

    @BeforeEach
    void setUp() {
        invoiceRepository.deleteAll();
        jobCardRepository.deleteAll();
        appointmentRepository.deleteAll();
        vehicleRepository.deleteAll();
        userRepository.findAll().forEach(u -> { u.setManager(null); userRepository.save(u); });
        userRepository.deleteAll();
        admin = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Admin User", "admin@autoserve.com", "AdminPass123!", Role.ADMIN, "9999999999", null, true);
        manager = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Manager User", "manager@autoserve.com", "ManagerPass123!", Role.MANAGER, "8888888888", null, true);
        mechanic = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Mechanic User", "mechanic@autoserve.com", "MechanicPass123!", Role.MECHANIC, "7777777777", manager, true);
        customer1 = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Customer One", "customer1@autoserve.com", "CustomerPass123!", Role.CUSTOMER, "6666666666", null, true);
        customer2 = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Customer Two", "customer2@autoserve.com", "CustomerPass123!", Role.CUSTOMER, "5555555555", null, true);

        adminToken = SecurityTestUtils.createToken(jwtUtil, admin);
        managerToken = SecurityTestUtils.createToken(jwtUtil, manager);
        mechanicToken = SecurityTestUtils.createToken(jwtUtil, mechanic);
        customer1Token = SecurityTestUtils.createToken(jwtUtil, customer1);
    }

    @Test
    @DisplayName("Customer cannot list all users (returns 403)")
    void testCustomerCannotListUsers() throws Exception {
        mockMvc.perform(get("/api/users/getUsers")
                .header("Authorization", "Bearer " + customer1Token))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is(403)));
    }

    @Test
    @DisplayName("Manager cannot list all users (returns 403)")
    void testManagerCannotListUsers() throws Exception {
        mockMvc.perform(get("/api/users/getUsers")
                .header("Authorization", "Bearer " + managerToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Mechanic cannot list all users (returns 403)")
    void testMechanicCannotListUsers() throws Exception {
        mockMvc.perform(get("/api/users/getUsers")
                .header("Authorization", "Bearer " + mechanicToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Admin can list all users (returns 200)")
    void testAdminCanListUsers() throws Exception {
        mockMvc.perform(get("/api/users/getUsers")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Customer cannot create staff (returns 403) and user count is unchanged")
    void testCustomerCannotCreateStaff() throws Exception {
        long initialCount = userRepository.count();
        String json = """
            {
                "userName": "New Manager",
                "email": "newmanager@autoserve.com",
                "password": "ValidPass123!",
                "mobile": "9990001112",
                "userRole": "MANAGER"
            }
            """;

        mockMvc.perform(post("/api/users")
                .header("Authorization", "Bearer " + customer1Token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isForbidden());

        assertEquals(initialCount, userRepository.count());
    }

    @Test
    @DisplayName("Admin can create MANAGER staff (returns 201)")
    void testAdminCanCreateManagerStaff() throws Exception {
        long initialCount = userRepository.count();
        String json = """
            {
                "userName": "New Manager",
                "email": "newmanager@autoserve.com",
                "password": "ValidPass123!",
                "mobile": "9990001112",
                "userRole": "MANAGER"
            }
            """;

        mockMvc.perform(post("/api/users")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.userRole", is("MANAGER")))
                .andExpect(jsonPath("$.email", is("newmanager@autoserve.com")));

        assertEquals(initialCount + 1, userRepository.count());
    }

    @Test
    @DisplayName("GET /api/users/me returns authenticated profile")
    void testGetMyProfile() throws Exception {
        mockMvc.perform(get("/api/users/me")
                .header("Authorization", "Bearer " + customer1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is("customer1@autoserve.com")))
                .andExpect(jsonPath("$.userRole", is("CUSTOMER")));
    }

    @Test
    @DisplayName("PUT /api/users/me updates safe fields only and cannot change role")
    void testUpdateSelfProfileSafeFieldsOnly() throws Exception {
        String json = """
            {
                "userName": "Updated Customer Name",
                "mobile": "9112233445"
            }
            """;

        mockMvc.perform(put("/api/users/me")
                .header("Authorization", "Bearer " + customer1Token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userName", is("Updated Customer Name")))
                .andExpect(jsonPath("$.mobile", is("9112233445")))
                .andExpect(jsonPath("$.userRole", is("CUSTOMER")));

        User updated = userRepository.findById(customer1.getId()).orElseThrow();
        assertEquals("Updated Customer Name", updated.getUserName());
        assertEquals(Role.CUSTOMER, updated.getUserRole());
    }

    @Test
    @DisplayName("Customer cannot access another customer's profile (returns 403)")
    void testCustomerCannotAccessAnotherCustomerProfile() throws Exception {
        mockMvc.perform(get("/api/users/customer/" + customer2.getId())
                .header("Authorization", "Bearer " + customer1Token))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Manager can view mechanics reporting to them")
    void testManagerCanViewOwnMechanics() throws Exception {
        mockMvc.perform(get("/api/users/managers/" + manager.getId() + "/mechanics")
                .header("Authorization", "Bearer " + managerToken))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Manager cannot view another manager's team mechanics (returns 403)")
    void testManagerCannotViewAnotherManagerMechanics() throws Exception {
        User otherManager = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Manager 2", "mgr2@autoserve.com", "MgrPass123!", Role.MANAGER, "8887776665", null, true);

        mockMvc.perform(get("/api/users/managers/" + otherManager.getId() + "/mechanics")
                .header("Authorization", "Bearer " + managerToken))
                .andExpect(status().isForbidden());
    }
}
