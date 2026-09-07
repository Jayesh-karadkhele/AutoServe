package com.car_backend.security;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
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
import com.car_backend.entities.Vehicle;
import com.car_backend.repository.UserRepository;
import com.car_backend.repository.VehicleRepository;
import com.car_backend.security.jwt.JwtUtil;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class VehicleAuthorizationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private com.car_backend.repository.AppointmentRepository appointmentRepository;

    @Autowired
    private com.car_backend.repository.JobCardRepository jobCardRepository;

    @Autowired
    private com.car_backend.repository.InvoiceRepository invoiceRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private User admin;
    private User customer1;
    private User customer2;
    private Vehicle vehicle1;
    private Vehicle vehicle2;

    private String adminToken;
    private String customer1Token;
    private String customer2Token;

    @BeforeEach
    void setUp() {
        invoiceRepository.deleteAll();
        jobCardRepository.deleteAll();
        appointmentRepository.deleteAll();
        vehicleRepository.deleteAll();
        userRepository.findAll().forEach(u -> { u.setManager(null); userRepository.save(u); });
        userRepository.deleteAll();

        admin = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Admin User", "admin@autoserve.com", "AdminPass123!", Role.ADMIN, "9999999999", null, true);
        customer1 = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Customer One", "customer1@autoserve.com", "CustomerPass123!", Role.CUSTOMER, "6666666666", null, true);
        customer2 = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Customer Two", "customer2@autoserve.com", "CustomerPass123!", Role.CUSTOMER, "5555555555", null, true);

        adminToken = SecurityTestUtils.createToken(jwtUtil, admin);
        customer1Token = SecurityTestUtils.createToken(jwtUtil, customer1);
        customer2Token = SecurityTestUtils.createToken(jwtUtil, customer2);

        vehicle1 = new Vehicle();
        vehicle1.setCustomer(customer1);
        vehicle1.setBrand("Toyota");
        vehicle1.setModel("Camry");
        vehicle1.setColor("Black");
        vehicle1.setManufacturingYear(2022);
        vehicle1.setLicensePlate("KA-01-AB-1234");
        vehicle1 = vehicleRepository.save(vehicle1);

        vehicle2 = new Vehicle();
        vehicle2.setCustomer(customer2);
        vehicle2.setBrand("Honda");
        vehicle2.setModel("Civic");
        vehicle2.setColor("White");
        vehicle2.setManufacturingYear(2021);
        vehicle2.setLicensePlate("KA-02-CD-5678");
        vehicle2 = vehicleRepository.save(vehicle2);
    }

    @Test
    @DisplayName("Customer can create vehicle for themselves and customerId is auto-assigned from token")
    void testCustomerCreateVehicleForSelf() throws Exception {
        long initialCount = vehicleRepository.count();
        String json = String.format("""
            {
                "brand": "Hyundai",
                "model": "i20",
                "color": "Red",
                "manufacturingYear": 2023,
                "licensePlate": "KA-03-EF-9999",
                "customerId": %d
            }
            """, customer1.getId());

        mockMvc.perform(post("/api/vehicles")
                .header("Authorization", "Bearer " + customer1Token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.brand", is("Hyundai")))
                .andExpect(jsonPath("$.customerId", is(customer1.getId().intValue())));

        assertEquals(initialCount + 1, vehicleRepository.count());
    }

    @Test
    @DisplayName("GET /api/vehicles/me returns only current customer's vehicles")
    void testGetMyVehicles() throws Exception {
        mockMvc.perform(get("/api/vehicles/me")
                .header("Authorization", "Bearer " + customer1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].vehicleId", is(vehicle1.getId().intValue())));
    }

    @Test
    @DisplayName("Customer can view owned vehicle")
    void testCustomerViewOwnedVehicle() throws Exception {
        mockMvc.perform(get("/api/vehicles/" + vehicle1.getId())
                .header("Authorization", "Bearer " + customer1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.vehicleId", is(vehicle1.getId().intValue())));
    }

    @Test
    @DisplayName("Customer cannot view another customer's vehicle (returns 403)")
    void testCustomerCannotViewAnotherVehicle() throws Exception {
        mockMvc.perform(get("/api/vehicles/" + vehicle2.getId())
                .header("Authorization", "Bearer " + customer1Token))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Customer cannot update another customer's vehicle (returns 403) and DB remains unchanged")
    void testCustomerCannotUpdateAnotherVehicle() throws Exception {
        String json = """
            {
                "brand": "Hacked",
                "model": "Hacked",
                "color": "Black",
                "manufacturingYear": 2020
            }
            """;

        mockMvc.perform(put("/api/vehicles/" + vehicle2.getId())
                .header("Authorization", "Bearer " + customer1Token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isForbidden());

        Vehicle dbVehicle = vehicleRepository.findById(vehicle2.getId()).orElseThrow();
        assertEquals("Honda", dbVehicle.getBrand());
    }

    @Test
    @DisplayName("Customer cannot delete another customer's vehicle (returns 403) and DB remains unchanged")
    void testCustomerCannotDeleteAnotherVehicle() throws Exception {
        mockMvc.perform(delete("/api/vehicles/" + vehicle2.getId())
                .header("Authorization", "Bearer " + customer1Token))
                .andExpect(status().isForbidden());

        assertEquals(2, vehicleRepository.count());
    }

    @Test
    @DisplayName("Admin can view any vehicle")
    void testAdminViewAnyVehicle() throws Exception {
        mockMvc.perform(get("/api/vehicles/" + vehicle2.getId())
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());
    }
}
