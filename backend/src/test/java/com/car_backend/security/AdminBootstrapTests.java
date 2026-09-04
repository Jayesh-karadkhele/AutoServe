package com.car_backend.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import com.car_backend.config.AdminBootstrapRunner;
import com.car_backend.entities.Role;
import com.car_backend.entities.User;
import com.car_backend.repository.UserRepository;

@SpringBootTest(properties = {
    "app.bootstrap.admin.enabled=true",
    "app.bootstrap.admin.email=testbootstrapadmin@autoserve.com",
    "app.bootstrap.admin.password=BootstrapAdmin123!",
    "app.bootstrap.admin.name=Initial Bootstrap Admin",
    "app.bootstrap.admin.phone=9998887770"
})
@ActiveProfiles("test")
public class AdminBootstrapTests {

    @Autowired
    private AdminBootstrapRunner adminBootstrapRunner;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("Admin bootstrap runner creates initial ADMIN when zero admins exist")
    void testBootstrapCreatesAdminWhenNoAdminExists() throws Exception {
        long initialCount = userRepository.count();
        assertEquals(0, initialCount);

        adminBootstrapRunner.run();

        assertEquals(1, userRepository.count());
        Optional<User> adminOpt = userRepository.findByEmail("testbootstrapadmin@autoserve.com");
        assertTrue(adminOpt.isPresent());
        User admin = adminOpt.get();
        assertEquals(Role.ADMIN, admin.getUserRole());
        assertTrue(admin.isActive());
        assertTrue(passwordEncoder.matches("BootstrapAdmin123!", admin.getPassword()));
    }

    @Test
    @DisplayName("Admin bootstrap runner is idempotent and skips creation when ADMIN already exists")
    void testBootstrapSkippedWhenAdminAlreadyExists() throws Exception {
        // Create an initial admin
        SecurityTestUtils.createUser(userRepository, passwordEncoder, "Existing Admin", "existingadmin@autoserve.com", "AdminPass123!", Role.ADMIN, "9998887771", null, true);
        assertEquals(1, userRepository.count());

        adminBootstrapRunner.run();

        // Count should remain 1
        assertEquals(1, userRepository.count());
    }
}
