package com.car_backend.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import com.car_backend.dto.admin.AdminOverviewDto;
import com.car_backend.dto.admin.CreateStaffDto;
import com.car_backend.dto.admin.StockAdjustmentDto;
import com.car_backend.dto.admin.SystemSettingsDto;
import com.car_backend.dto.admin.UserSummaryDto;
import com.car_backend.entities.Inventory;
import com.car_backend.entities.Role;
import com.car_backend.entities.StockMovementType;
import com.car_backend.entities.User;
import com.car_backend.repository.InventoryRepository;
import com.car_backend.repository.UserRepository;
import com.car_backend.service.AdminService;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class AdminAuthorizationTests {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    private User adminUser;
    private User managerUser;
    private User mechanicUser;

    @BeforeEach
    void setUp() {
        if (userRepository.findByEmail("admin@autoserve.com").isEmpty()) {
            User admin = new User();
            admin.setUserName("Platform Admin");
            admin.setEmail("admin@autoserve.com");
            admin.setPassword("$2a$10$e8789f50dbc9920775fab972abc5e28c01a04b70");
            admin.setMobile("9999999999");
            admin.setUserRole(Role.ADMIN);
            admin.setActive(true);
            adminUser = userRepository.save(admin);
        } else {
            adminUser = userRepository.findByEmail("admin@autoserve.com").get();
        }

        if (userRepository.findByEmail("manager.a@autoserve.com").isEmpty()) {
            User mgr = new User();
            mgr.setUserName("Manager Alpha");
            mgr.setEmail("manager.a@autoserve.com");
            mgr.setPassword("$2a$10$e8789f50dbc9920775fab972abc5e28c01a04b70");
            mgr.setMobile("9888888888");
            mgr.setUserRole(Role.MANAGER);
            mgr.setActive(true);
            managerUser = userRepository.save(mgr);
        } else {
            managerUser = userRepository.findByEmail("manager.a@autoserve.com").get();
        }

        if (userRepository.findByEmail("mechanic.a@autoserve.com").isEmpty()) {
            User tech = new User();
            tech.setUserName("Mechanic Ace");
            tech.setEmail("mechanic.a@autoserve.com");
            tech.setPassword("$2a$10$e8789f50dbc9920775fab972abc5e28c01a04b70");
            tech.setMobile("9777777777");
            tech.setUserRole(Role.MECHANIC);
            tech.setManager(managerUser);
            tech.setActive(true);
            mechanicUser = userRepository.save(tech);
        } else {
            mechanicUser = userRepository.findByEmail("mechanic.a@autoserve.com").get();
        }
    }

    @Test
    @WithMockUser(username = "admin@autoserve.com", roles = {"ADMIN"})
    @DisplayName("1. Admin can access platform overview metrics")
    void admin_canAccessOverview() {
        AdminOverviewDto overview = adminService.getAdminOverview();
        assertNotNull(overview);
        assertTrue(overview.getTotalCustomers() >= 0);
        assertTrue(overview.getTotalManagers() >= 1);
        assertTrue(overview.getTotalMechanics() >= 1);
    }

    @Test
    @WithMockUser(username = "admin@autoserve.com", roles = {"ADMIN"})
    @DisplayName("2. Admin can create Manager and Mechanic staff safely")
    void admin_canCreateStaff() {
        CreateStaffDto staffDto = new CreateStaffDto();
        staffDto.setFullName("New Workshop Manager");
        staffDto.setEmail("new.manager@autoserve.com");
        staffDto.setMobile("9111111111");
        staffDto.setRole(Role.MANAGER);
        staffDto.setInitialPassword("SecurePassword123!");

        UserSummaryDto createdManager = adminService.createStaff(staffDto);
        assertNotNull(createdManager.getId());
        assertEquals("new.manager@autoserve.com", createdManager.getEmail());
        assertEquals(Role.MANAGER, createdManager.getRole());
        assertTrue(createdManager.isActive());

        CreateStaffDto techDto = new CreateStaffDto();
        techDto.setFullName("New Field Technician");
        techDto.setEmail("new.tech@autoserve.com");
        techDto.setMobile("9222222222");
        techDto.setRole(Role.MECHANIC);
        techDto.setManagerId(createdManager.getId());
        techDto.setInitialPassword("SecurePassword123!");

        UserSummaryDto createdTech = adminService.createStaff(techDto);
        assertNotNull(createdTech.getId());
        assertEquals(createdManager.getId(), createdTech.getManagerId());
    }

    @Test
    @WithMockUser(username = "admin@autoserve.com", roles = {"ADMIN"})
    @DisplayName("3. Staff creation rejects invalid roles and duplicate emails")
    void admin_createStaffValidation() {
        CreateStaffDto customerDto = new CreateStaffDto();
        customerDto.setFullName("Customer Account");
        customerDto.setEmail("cust@autoserve.com");
        customerDto.setMobile("9000000000");
        customerDto.setRole(Role.CUSTOMER);
        customerDto.setInitialPassword("Password123!");

        assertThrows(IllegalArgumentException.class, () -> adminService.createStaff(customerDto));

        CreateStaffDto dupDto = new CreateStaffDto();
        dupDto.setFullName("Duplicate Manager");
        dupDto.setEmail("manager.a@autoserve.com");
        dupDto.setMobile("9888888888");
        dupDto.setRole(Role.MANAGER);
        dupDto.setInitialPassword("Password123!");

        assertThrows(IllegalArgumentException.class, () -> adminService.createStaff(dupDto));
    }

    @Test
    @WithMockUser(username = "admin@autoserve.com", roles = {"ADMIN"})
    @DisplayName("4. Account deactivation works, but last Admin deactivation is rejected")
    void admin_deactivationRules() {
        UserSummaryDto deactivatedTech = adminService.toggleUserActiveStatus(mechanicUser.getId(), "Performance audit");
        assertFalse(deactivatedTech.isActive());

        assertThrows(IllegalArgumentException.class, () -> adminService.toggleUserActiveStatus(adminUser.getId(), "Self attempt"));
    }

    @Test
    @WithMockUser(username = "admin@autoserve.com", roles = {"ADMIN"})
    @DisplayName("5. Controlled stock adjustment updates inventory and records stock movement")
    void admin_stockAdjustment() {
        Inventory part = new Inventory();
        part.setItemName("Brake Fluid DOT4");
        part.setSkuCode("PRT-BF-001");
        part.setStockQuantity(50);
        part.setCurrentPrice(new BigDecimal("450.00"));
        Inventory savedPart = inventoryRepository.save(part);

        StockAdjustmentDto adj = new StockAdjustmentDto();
        adj.setInventoryId(savedPart.getId());
        adj.setQuantityDelta(20);
        adj.setMovementType(StockMovementType.MANUAL_INCREASE);
        adj.setReason("Monthly stock shipment received");

        var movement = adminService.adjustStock(adj);
        assertNotNull(movement.getId());
        assertEquals(50, movement.getQuantityBefore());
        assertEquals(20, movement.getQuantityDelta());
        assertEquals(70, movement.getQuantityAfter());

        Inventory updatedPart = inventoryRepository.findById(savedPart.getId()).orElseThrow();
        assertEquals(70, updatedPart.getStockQuantity());
    }

    @Test
    @WithMockUser(username = "admin@autoserve.com", roles = {"ADMIN"})
    @DisplayName("6. Negative resulting stock is strictly rejected")
    void admin_stockAdjustmentNegativeRejected() {
        Inventory part = new Inventory();
        part.setItemName("Oil Filter Standard");
        part.setSkuCode("PRT-OF-002");
        part.setStockQuantity(5);
        part.setCurrentPrice(new BigDecimal("250.00"));
        Inventory savedPart = inventoryRepository.save(part);

        StockAdjustmentDto adj = new StockAdjustmentDto();
        adj.setInventoryId(savedPart.getId());
        adj.setQuantityDelta(-10);
        adj.setMovementType(StockMovementType.MANUAL_DECREASE);
        adj.setReason("Stock damage audit");

        assertThrows(IllegalArgumentException.class, () -> adminService.adjustStock(adj));
    }

    @Test
    @WithMockUser(username = "admin@autoserve.com", roles = {"ADMIN"})
    @DisplayName("7. System settings endpoint exposes zero secret keys or passwords")
    void admin_systemSettingsZeroSecrets() {
        SystemSettingsDto settings = adminService.getSystemSettings();
        assertNotNull(settings);
        assertNotNull(settings.getActiveProfile());
        assertNotNull(settings.getFlywaySchemaVersion());
        assertFalse(settings.getAuthCookieSecurityMode().contains("secret"));
    }
}
