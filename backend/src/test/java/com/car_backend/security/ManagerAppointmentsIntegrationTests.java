package com.car_backend.security;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.Collections;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.car_backend.entities.Appointment;
import com.car_backend.entities.Role;
import com.car_backend.entities.Status;
import com.car_backend.entities.User;
import com.car_backend.entities.Vehicle;
import com.car_backend.exceptions.AppointmentAlreadyClaimedException;
import com.car_backend.repository.AppointmentRepository;
import com.car_backend.repository.UserRepository;
import com.car_backend.repository.VehicleRepository;
import com.car_backend.security.jwt.JwtUtil;
import com.car_backend.service.AppointmentService;

import lombok.extern.slf4j.Slf4j;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Slf4j
public class ManagerAppointmentsIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    private User admin;
    private User customer;
    private User manager1;
    private User manager2;
    private User mechanic;
    private Vehicle vehicle;

    private String adminToken;
    private String customerToken;
    private String manager1Token;
    private String manager2Token;
    private String mechanicToken;

    @BeforeEach
    void setUp() {
        appointmentRepository.deleteAll();
        vehicleRepository.deleteAll();
        userRepository.deleteAll();

        admin = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Admin User", "admin.appts@autoserve.com", "AdminPass123!", Role.ADMIN, "9876543209", null, true);
        customer = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Customer User", "cust.appts@autoserve.com", "CustPass123!", Role.CUSTOMER, "9876543210", null, true);
        manager1 = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Manager One", "mgr1.appts@autoserve.com", "manager0521", Role.MANAGER, "9876543211", null, true);
        manager2 = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Manager Two", "mgr2.appts@autoserve.com", "manager0521", Role.MANAGER, "9876543212", null, true);
        mechanic = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Mechanic One", "mech1.appts@autoserve.com", "Mech0521", Role.MECHANIC, "9876543213", manager1, true);

        vehicle = new Vehicle();
        vehicle.setCustomer(customer);
        vehicle.setBrand("Toyota");
        vehicle.setModel("Camry");
        vehicle.setLicensePlate("MH12AB1234");
        vehicle.setActive(true);
        vehicle = vehicleRepository.save(vehicle);

        adminToken = SecurityTestUtils.createToken(jwtUtil, admin);
        customerToken = SecurityTestUtils.createToken(jwtUtil, customer);
        manager1Token = SecurityTestUtils.createToken(jwtUtil, manager1);
        manager2Token = SecurityTestUtils.createToken(jwtUtil, manager2);
        mechanicToken = SecurityTestUtils.createToken(jwtUtil, mechanic);
    }

    private Appointment createCustomerAppointment(LocalDate requestDate) {
        Appointment appt = new Appointment();
        appt.setVehicleDetails(vehicle);
        appt.setRequestDate(requestDate);
        appt.setProblemDescription("Brake inspection and oil change");
        appt.setStatus(Status.PENDING);
        appt.setManager(null);
        appt.setMechanic(null);
        return appointmentRepository.save(appt);
    }

    @Test
    @DisplayName("1. Customer created appointment is PENDING and unassigned in database")
    void testCustomerAppointmentIsPendingAndUnassigned() {
        Appointment appt = createCustomerAppointment(LocalDate.now().plusDays(2));

        assertNotNull(appt.getId());
        assertEquals(Status.PENDING, appt.getStatus());
        assertNull(appt.getManager());
        assertNull(appt.getMechanic());
    }

    @Test
    @DisplayName("2. Manager pending endpoint returns paginated unassigned appointments including future dates")
    void testManagerPendingEndpointReturnsPaginatedUnassignedAppointments() throws Exception {
        createCustomerAppointment(LocalDate.now());
        createCustomerAppointment(LocalDate.now().plusDays(5));

        mockMvc.perform(get("/api/appointments/manager/pending?page=0&size=10")
                .header("Authorization", "Bearer " + manager1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(2)))
                .andExpect(jsonPath("$.content[0].status", is("PENDING")))
                .andExpect(jsonPath("$.content[0].managerId", nullValue()))
                .andExpect(jsonPath("$.content[1].status", is("PENDING")))
                .andExpect(jsonPath("$.content[1].managerId", nullValue()));
    }

    @Test
    @DisplayName("3. Manager overview counts future pending under Awaiting Decision but NOT Today's Appointments")
    void testFuturePendingCountedInAwaitingDecisionNotToday() throws Exception {
        createCustomerAppointment(LocalDate.now().plusDays(3));

        mockMvc.perform(get("/api/manager/dashboard/overview")
                .header("Authorization", "Bearer " + manager1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.awaitingDecisionCount", is(1)))
                .andExpect(jsonPath("$.assignedAppointmentsToday", is(0)));
    }

    @Test
    @DisplayName("4. Customer cannot access Manager pending queue (403 Forbidden)")
    void testCustomerCannotAccessManagerPendingQueue() throws Exception {
        createCustomerAppointment(LocalDate.now());

        mockMvc.perform(get("/api/appointments/manager/pending")
                .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("5. Mechanic cannot access Manager pending queue (403 Forbidden)")
    void testMechanicCannotAccessManagerPendingQueue() throws Exception {
        createCustomerAppointment(LocalDate.now());

        mockMvc.perform(get("/api/appointments/manager/pending")
                .header("Authorization", "Bearer " + mechanicToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("6. Admin CANNOT directly approve/claim appointment as Manager (403 Forbidden)")
    void testAdminCannotApproveAndClaimAppointment() throws Exception {
        Appointment appt = createCustomerAppointment(LocalDate.now().plusDays(1));

        mockMvc.perform(put("/api/appointments/" + appt.getId() + "/approve")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("7. Manager approval claims appointment, updates metrics (decrements pending, increments unassigned approved)")
    void testManagerApprovalUpdatesMetricsAndQueue() throws Exception {
        Appointment appt = createCustomerAppointment(LocalDate.now().plusDays(1));

        mockMvc.perform(get("/api/manager/dashboard/overview")
                .header("Authorization", "Bearer " + manager1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.awaitingDecisionCount", is(1)))
                .andExpect(jsonPath("$.approvedAwaitingMechanicCount", is(0)));

        mockMvc.perform(put("/api/appointments/" + appt.getId() + "/approve")
                .header("Authorization", "Bearer " + manager1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("APPROVED")))
                .andExpect(jsonPath("$.managerId", is(manager1.getId().intValue())));

        mockMvc.perform(get("/api/manager/dashboard/overview")
                .header("Authorization", "Bearer " + manager1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.awaitingDecisionCount", is(0)))
                .andExpect(jsonPath("$.approvedAwaitingMechanicCount", is(1)));
    }

    @Test
    @DisplayName("8. Second Manager sequential attempt returns 409 Conflict")
    void testSecondManagerSequentialClaimAttemptReturnsConflict() throws Exception {
        Appointment appt = createCustomerAppointment(LocalDate.now().plusDays(1));

        mockMvc.perform(put("/api/appointments/" + appt.getId() + "/approve")
                .header("Authorization", "Bearer " + manager1Token))
                .andExpect(status().isOk());

        mockMvc.perform(put("/api/appointments/" + appt.getId() + "/approve")
                .header("Authorization", "Bearer " + manager2Token))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status", is(409)))
                .andExpect(jsonPath("$.error", is("Conflict")))
                .andExpect(jsonPath("$.message", is("Appointment has already been claimed by another manager.")));
    }

    @Test
    @DisplayName("9. Multi-threaded simultaneous claim attempts by two Managers result in exactly 1 success and 1 409 Conflict")
    void testSimultaneousMultiThreadedManagerClaimAttempts() throws Exception {
        Appointment appt = createCustomerAppointment(LocalDate.now().plusDays(2));
        Long apptId = appt.getId();

        ExecutorService executor = Executors.newFixedThreadPool(2);
        CountDownLatch readyLatch = new CountDownLatch(2);
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch doneLatch = new CountDownLatch(2);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger conflictCount = new AtomicInteger(0);

        executor.submit(() -> {
            try {
                readyLatch.countDown();
                startLatch.await();
                SecurityContextHolder.getContext().setAuthentication(
                        new UsernamePasswordAuthenticationToken(manager1.getEmail(), null,
                                Collections.singletonList(new SimpleGrantedAuthority("ROLE_MANAGER"))));
                appointmentService.approveAppointment(apptId);
                successCount.incrementAndGet();
            } catch (AppointmentAlreadyClaimedException e) {
                conflictCount.incrementAndGet();
            } catch (Exception e) {
                log.error("Thread 1 unexpected exception", e);
            } finally {
                SecurityContextHolder.clearContext();
                doneLatch.countDown();
            }
        });

        executor.submit(() -> {
            try {
                readyLatch.countDown();
                startLatch.await();
                SecurityContextHolder.getContext().setAuthentication(
                        new UsernamePasswordAuthenticationToken(manager2.getEmail(), null,
                                Collections.singletonList(new SimpleGrantedAuthority("ROLE_MANAGER"))));
                appointmentService.approveAppointment(apptId);
                successCount.incrementAndGet();
            } catch (AppointmentAlreadyClaimedException e) {
                conflictCount.incrementAndGet();
            } catch (Exception e) {
                log.error("Thread 2 unexpected exception", e);
            } finally {
                SecurityContextHolder.clearContext();
                doneLatch.countDown();
            }
        });

        readyLatch.await();
        startLatch.countDown();
        doneLatch.await(5, TimeUnit.SECONDS);
        executor.shutdown();

        assertEquals(1, successCount.get(), "Exactly one manager claim must succeed");
        assertEquals(1, conflictCount.get(), "Exactly one manager claim must result in 409 Conflict");
    }
}
