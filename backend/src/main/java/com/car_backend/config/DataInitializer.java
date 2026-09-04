package com.car_backend.config;

import java.math.BigDecimal;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Profile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.car_backend.entities.Inventory;
import com.car_backend.entities.Role;
import com.car_backend.entities.User;
import com.car_backend.repository.InventoryRepository;
import com.car_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Profile("demo & !prod")
@ConditionalOnProperty(prefix = "app.demo", name = "seed-enabled", havingValue = "true")
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final InventoryRepository inventoryRepository;
    private final com.car_backend.repository.VehicleRepository vehicleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.demo.admin-password:}")
    private String adminPassword;

    @Value("${app.demo.manager-password:}")
    private String managerPassword;

    @Value("${app.demo.mechanic-password:}")
    private String mechanicPassword;

    @Value("${app.demo.customer-password:}")
    private String customerPassword;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            if (adminPassword.isBlank() || managerPassword.isBlank() || mechanicPassword.isBlank() || customerPassword.isBlank()) {
                log.warn("Demo profile is active but demo passwords are not configured via environment variables (app.demo.*-password). Skipping demo user seeding.");
            } else {
                log.info("Seeding default demo users into database...");

            // 1. Admin User
            User admin = new User();
            admin.setUserName("System Admin");
            admin.setEmail("admin@autoserve.com");
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setUserRole(Role.ADMIN);
            admin.setMobile("9876543210");
            admin.setActive(true);
            userRepository.save(admin);

            // 2. Manager User
            User manager = new User();
            manager.setUserName("Rajesh Kumar (Manager)");
            manager.setEmail("manager@autoserve.com");
            manager.setPassword(passwordEncoder.encode(managerPassword));
            manager.setUserRole(Role.MANAGER);
            manager.setMobile("9876543211");
            manager.setSalary(BigDecimal.valueOf(75000.0));
            manager.setActive(true);
            manager = userRepository.save(manager);

            // 3. Mechanic User (Assigned to Manager)
            User mechanic = new User();
            mechanic.setUserName("Aniket Verma (Mechanic)");
            mechanic.setEmail("mechanic@autoserve.com");
            mechanic.setPassword(passwordEncoder.encode(mechanicPassword));
            mechanic.setUserRole(Role.MECHANIC);
            mechanic.setMobile("9876543212");
            mechanic.setSalary(BigDecimal.valueOf(45000.0));
            mechanic.setActive(true);
            mechanic.setManager(manager);
            userRepository.save(mechanic);

            // 4. Customer User
            User customer = new User();
            customer.setUserName("Rahul Sharma (Customer)");
            customer.setEmail("customer@autoserve.com");
            customer.setPassword(passwordEncoder.encode(customerPassword));
            customer.setUserRole(Role.CUSTOMER);
            customer.setMobile("9876543213");
            customer.setActive(true);
            customer = userRepository.save(customer);

            // 5. Seed Customer Vehicles
            if (vehicleRepository.count() == 0) {
                com.car_backend.entities.Vehicle v1 = new com.car_backend.entities.Vehicle();
                v1.setLicensePlate("MH-12-PQ-4567");
                v1.setBrand("Honda");
                v1.setModel("City ZX i-VTEC");
                v1.setColor("Pearl White");
                v1.setVehicleType("Sedan");
                v1.setManufacturingYear(2021);
                v1.setFuelType("Petrol");
                v1.setLastServiceDate("2026-01-15");
                v1.setTotalServices(4);
                v1.setActive(true);
                v1.setCustomer(customer);
                vehicleRepository.save(v1);

                com.car_backend.entities.Vehicle v2 = new com.car_backend.entities.Vehicle();
                v2.setLicensePlate("KA-01-MJ-8821");
                v2.setBrand("Hyundai");
                v2.setModel("Tucson Signature 2.0");
                v2.setColor("Titan Grey");
                v2.setVehicleType("SUV");
                v2.setManufacturingYear(2023);
                v2.setFuelType("Diesel");
                v2.setLastServiceDate("2026-02-10");
                v2.setTotalServices(2);
                v2.setActive(true);
                v2.setCustomer(customer);
                vehicleRepository.save(v2);

                log.info("Demo vehicles (MH-12-PQ-4567, KA-01-MJ-8821) successfully seeded for Customer!");
            }

            log.info("Demo users successfully seeded! (admin@autoserve.com, manager@autoserve.com, mechanic@autoserve.com, customer@autoserve.com)");
            }
        } else {
            log.info("Users table already contains records. Skipping user seeding.");
        }

        if (inventoryRepository.count() == 0) {
            log.info("Seeding initial workshop inventory items...");

            Inventory item1 = new Inventory();
            item1.setItemName("Motul 8100 X-cess Fully Synthetic Oil 5W-40 (5L)");
            item1.setSkuCode("MOTUL-5W40-synth");
            item1.setCurrentPrice(BigDecimal.valueOf(3850.0));
            item1.setStockQuantity(35);
            item1.setDeleted(false);
            inventoryRepository.save(item1);

            Inventory item2 = new Inventory();
            item2.setItemName("Brembo Front Ceramic Brake Pads Set");
            item2.setSkuCode("BREMBO-P83067");
            item2.setCurrentPrice(BigDecimal.valueOf(4200.0));
            item2.setStockQuantity(12);
            item2.setDeleted(false);
            inventoryRepository.save(item2);

            Inventory item3 = new Inventory();
            item3.setItemName("Bosch Double Iridium Spark Plugs (4-Pack)");
            item3.setSkuCode("BOSCH-SP-IRID");
            item3.setCurrentPrice(BigDecimal.valueOf(2100.0));
            item3.setStockQuantity(50);
            item3.setDeleted(false);
            inventoryRepository.save(item3);

            Inventory item4 = new Inventory();
            item4.setItemName("Denso Anti-Bacterial Cabin AC Filter");
            item4.setSkuCode("DENSO-AC-FILT");
            item4.setCurrentPrice(BigDecimal.valueOf(850.0));
            item4.setStockQuantity(60);
            item4.setDeleted(false);
            inventoryRepository.save(item4);

            log.info("Inventory items successfully seeded!");
        }
    }
}
