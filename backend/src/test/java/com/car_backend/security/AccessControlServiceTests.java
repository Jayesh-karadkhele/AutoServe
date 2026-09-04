package com.car_backend.security;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import com.car_backend.entities.Role;
import com.car_backend.entities.User;
import com.car_backend.repository.UserRepository;
import com.car_backend.security.service.AccessControlService;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class AccessControlServiceTests {

    @Autowired
    private AccessControlService accessControlService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User admin;
    private User customer1;
    private User customer2;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        admin = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Admin User", "admin@autoserve.com", "AdminPass123!", Role.ADMIN, "9999999999", null, true);
        customer1 = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Customer One", "customer1@autoserve.com", "CustomerPass123!", Role.CUSTOMER, "6666666666", null, true);
        customer2 = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Customer Two", "customer2@autoserve.com", "CustomerPass123!", Role.CUSTOMER, "5555555555", null, true);
    }

    private void setSecurityContext(User user) {
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getUserRole().name());
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                user.getEmail(), null, List.of(authority));
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    @DisplayName("isSelf returns true for owning user ID and false for another user ID")
    void testIsSelf() {
        setSecurityContext(customer1);
        assertTrue(accessControlService.isSelf(customer1.getId()));
        assertFalse(accessControlService.isSelf(customer2.getId()));
    }

    @Test
    @DisplayName("canViewUser returns true for Admin on any user ID")
    void testAdminCanViewAnyUser() {
        setSecurityContext(admin);
        assertTrue(accessControlService.canViewUser(customer1.getId()));
        assertTrue(accessControlService.canViewUser(customer2.getId()));
    }
}
