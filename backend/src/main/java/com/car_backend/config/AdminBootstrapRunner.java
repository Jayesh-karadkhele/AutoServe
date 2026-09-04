package com.car_backend.config;

import java.util.Locale;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.car_backend.entities.Role;
import com.car_backend.entities.User;
import com.car_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@ConditionalOnProperty(prefix = "app.bootstrap.admin", name = "enabled", havingValue = "true")
@RequiredArgsConstructor
@Slf4j
public class AdminBootstrapRunner implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.bootstrap.admin.email:${BOOTSTRAP_ADMIN_EMAIL:}}")
    private String adminEmail;

    @Value("${app.bootstrap.admin.password:${BOOTSTRAP_ADMIN_PASSWORD:}}")
    private String adminPassword;

    @Value("${app.bootstrap.admin.name:${BOOTSTRAP_ADMIN_NAME:System Administrator}}")
    private String adminName;

    @Value("${app.bootstrap.admin.phone:${BOOTSTRAP_ADMIN_PHONE:9999999999}}")
    private String adminPhone;

    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#^()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?])[A-Za-z\\d@$!%*?&#^()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]{8,72}$"
    );

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("First-Admin bootstrap runner initialized.");

        if (adminEmail == null || adminEmail.trim().isEmpty() || adminPassword == null || adminPassword.trim().isEmpty()) {
            throw new IllegalStateException("Admin bootstrap configuration failure: BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD must be configured.");
        }

        if (!PASSWORD_PATTERN.matcher(adminPassword).matches()) {
            throw new IllegalStateException("Admin bootstrap configuration failure: BOOTSTRAP_ADMIN_PASSWORD does not satisfy security complexity requirements.");
        }

        boolean adminExists = userRepository.existsByUserRole(Role.ADMIN);
        if (adminExists) {
            log.info("First-Admin bootstrap skipped: ADMIN user already exists in database.");
            return;
        }

        String normalizedEmail = adminEmail.trim().toLowerCase(Locale.ROOT);
        if (userRepository.existsByEmail(normalizedEmail)) {
            log.warn("First-Admin bootstrap skipped: Email is already registered with another role.");
            return;
        }

        User admin = new User();
        admin.setUserName(adminName.trim());
        admin.setEmail(normalizedEmail);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setUserRole(Role.ADMIN);
        admin.setMobile(adminPhone.trim());
        admin.setActive(true);

        User saved = userRepository.save(admin);
        log.info("First-Admin bootstrap successfully created initial ADMIN user with ID: {}", saved.getId());
    }
}
