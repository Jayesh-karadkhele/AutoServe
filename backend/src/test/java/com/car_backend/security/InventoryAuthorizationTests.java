package com.car_backend.security;

import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
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

import com.car_backend.entities.Inventory;
import com.car_backend.entities.Role;
import com.car_backend.entities.User;
import com.car_backend.repository.InventoryRepository;
import com.car_backend.repository.UserRepository;
import com.car_backend.security.jwt.JwtUtil;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class InventoryAuthorizationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    private User admin;
    private User manager;
    private User mechanic;
    private User customer;

    private Inventory item1;

    private String adminToken;
    private String managerToken;
    private String mechanicToken;
    private String customerToken;

    @BeforeEach
    void setUp() {
        inventoryRepository.deleteAll();
        userRepository.deleteAll();

        admin = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Admin User", "admin@autoserve.com", "AdminPass123!", Role.ADMIN, "9999999999", null, true);
        manager = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Manager User", "mgr@autoserve.com", "ManagerPass123!", Role.MANAGER, "8888888888", null, true);
        mechanic = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Mechanic User", "mech@autoserve.com", "MechanicPass123!", Role.MECHANIC, "7777777777", manager, true);
        customer = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Customer User", "customer@autoserve.com", "CustomerPass123!", Role.CUSTOMER, "6666666666", null, true);

        adminToken = SecurityTestUtils.createToken(jwtUtil, admin);
        managerToken = SecurityTestUtils.createToken(jwtUtil, manager);
        mechanicToken = SecurityTestUtils.createToken(jwtUtil, mechanic);
        customerToken = SecurityTestUtils.createToken(jwtUtil, customer);

        item1 = new Inventory();
        item1.setItemName("Brake Pad");
        item1.setSkuCode("BP-001");
        item1.setStockQuantity(20);
        item1.setCurrentPrice(1500.0);
        item1.setDeleted(false);
        item1 = inventoryRepository.save(item1);
    }

    @Test
    @DisplayName("Customer cannot read inventory list (returns 403)")
    void testCustomerCannotReadInventory() throws Exception {
        mockMvc.perform(get("/api/inventory")
                .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Customer cannot search inventory (returns 403)")
    void testCustomerCannotSearchInventory() throws Exception {
        mockMvc.perform(get("/api/inventory/search?keyword=Brake")
                .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Customer cannot create inventory (returns 403)")
    void testCustomerCannotCreateInventory() throws Exception {
        long count = inventoryRepository.count();
        String json = """
            {
                "itemName": "Oil Filter",
                "skuCode": "OF-001",
                "stockQuantity": 10,
                "currentPrice": 500.0
            }
            """;

        mockMvc.perform(post("/api/inventory")
                .header("Authorization", "Bearer " + customerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isForbidden());

        assertEquals(count, inventoryRepository.count());
    }

    @Test
    @DisplayName("Mechanic can read inventory list (returns 200)")
    void testMechanicCanReadInventory() throws Exception {
        mockMvc.perform(get("/api/inventory")
                .header("Authorization", "Bearer " + mechanicToken))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Mechanic cannot create inventory (returns 403)")
    void testMechanicCannotCreateInventory() throws Exception {
        long count = inventoryRepository.count();
        String json = """
            {
                "itemName": "Oil Filter",
                "skuCode": "OF-001",
                "stockQuantity": 10,
                "currentPrice": 500.0
            }
            """;

        mockMvc.perform(post("/api/inventory")
                .header("Authorization", "Bearer " + mechanicToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isForbidden());

        assertEquals(count, inventoryRepository.count());
    }

    @Test
    @DisplayName("Manager cannot delete inventory item (returns 403) and DB remains unchanged")
    void testManagerCannotDeleteInventory() throws Exception {
        mockMvc.perform(delete("/api/inventory/" + item1.getId())
                .header("Authorization", "Bearer " + managerToken))
                .andExpect(status().isForbidden());

        assertEquals(1, inventoryRepository.count());
    }

    @Test
    @DisplayName("Admin can create inventory item (returns 200)")
    void testAdminCanCreateInventory() throws Exception {
        long count = inventoryRepository.count();
        String json = """
            {
                "itemName": "Oil Filter",
                "skuCode": "OF-001",
                "stockQuantity": 10,
                "currentPrice": 500.0
            }
            """;

        mockMvc.perform(post("/api/inventory")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.skuCode", is("OF-001")));

        assertEquals(count + 1, inventoryRepository.count());
    }

    @Test
    @DisplayName("Admin can soft-delete inventory item")
    void testAdminCanDeleteInventory() throws Exception {
        mockMvc.perform(delete("/api/inventory/" + item1.getId())
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNoContent());

        Inventory deleted = inventoryRepository.findById(item1.getId()).orElseThrow();
        assertTrue(deleted.isDeleted());
    }
}
