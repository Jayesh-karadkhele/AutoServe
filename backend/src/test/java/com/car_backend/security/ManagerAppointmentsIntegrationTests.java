package com.car_backend.security;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;

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

import com.car_backend.entities.Appointment;
import com.car_backend.entities.Role;
import com.car_backend.entities.Status;
import com.car_backend.entities.User;
import com.car_backend.entities.Vehicle;
import com.car_backend.repository.AppointmentRepository;
import com.car_backend.repository.UserRepository;
import com.car_backend.repository.VehicleRepository;
import com.car_backend.security.jwt.JwtUtil;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
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
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    private User customer;
    private User manager1;
    private User manager2;
    private User mechanic;
    private Vehicle vehicle;

    private String customerToken;
    private String manager1Token;
    private String manager2Token;
    private String mechanicToken;

    @BeforeEach
    void setUp() {
        appointmentRepository.deleteAll();
        vehicleRepository.deleteAll();
        userRepository.deleteAll();

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
    @DisplayName("1 & 2. Customer created appointment is PENDING and unassigned in database")
    void testCustomerAppointmentIsPendingAndUnassigned() {
        Appointment appt = createCustomerAppointment(LocalDate.now().plusDays(2));

        assertNotNull(appt.getId());
        assertEquals(Status.PENDING, appt.getStatus());
        assertNull(appt.getManager());
        assertNull(appt.getMechanic());
    }

    @Test
    @DisplayName("3 & 5. Manager pending endpoint returns unassigned pending appointments including future dates")
    void testManagerPendingEndpointReturnsUnassignedAppointments() throws Exception {
        createCustomerAppointment(LocalDate.now());
        createCustomerAppointment(LocalDate.now().plusDays(5)); // Future date

        mockMvc.perform(get("/api/appointments/manager/pending")
                .header("Authorization", "Bearer " + manager1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].status", is("PENDING")))
                .andExpect(jsonPath("$[0].managerId", nullValue()))
                .andExpect(jsonPath("$[1].status", is("PENDING")))
                .andExpect(jsonPath("$[1].managerId", nullValue()));
    }

    @Test
    @DisplayName("4. Manager dashboard overview counts unassigned pending under Awaiting Decision")
    void testManagerDashboardAwaitingDecisionMetric() throws Exception {
        createCustomerAppointment(LocalDate.now());
        createCustomerAppointment(LocalDate.now().plusDays(3));

        mockMvc.perform(get("/api/manager/dashboard/overview")
                .header("Authorization", "Bearer " + manager1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.awaitingDecisionCount", is(2)))
                .andExpect(jsonPath("$.assignedAppointmentsToday", is(1)));
    }

    @Test
    @DisplayName("6. Customer cannot access Manager pending queue (403 Forbidden)")
    void testCustomerCannotAccessManagerPendingQueue() throws Exception {
        createCustomerAppointment(LocalDate.now());

        mockMvc.perform(get("/api/appointments/manager/pending")
                .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("7. Mechanic cannot access Manager pending queue (403 Forbidden)")
    void testMechanicCannotAccessManagerPendingQueue() throws Exception {
        createCustomerAppointment(LocalDate.now());

        mockMvc.perform(get("/api/appointments/manager/pending")
                .header("Authorization", "Bearer " + mechanicToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("8 & 10. Manager can approve and claim appointment, updating status and assigned manager ID")
    void testManagerApproveAndClaimAppointment() throws Exception {
        Appointment appt = createCustomerAppointment(LocalDate.now().plusDays(1));

        mockMvc.perform(put("/api/appointments/" + appt.getId() + "/approve")
                .header("Authorization", "Bearer " + manager1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("APPROVED")))
                .andExpect(jsonPath("$.managerId", is(manager1.getId().intValue())));

        // Verify in DB
        Appointment updated = appointmentRepository.findById(appt.getId()).orElseThrow();
        assertEquals(Status.APPROVED, updated.getStatus());
        assertEquals(manager1.getId(), updated.getManager().getId());

        // Verify it disappears from pending decision queue
        mockMvc.perform(get("/api/appointments/manager/pending")
                .header("Authorization", "Bearer " + manager1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @DisplayName("9. Second Manager cannot claim an appointment already claimed by another Manager (409 Conflict)")
    void testSecondManagerCannotClaimAlreadyClaimedAppointment() throws Exception {
        Appointment appt = createCustomerAppointment(LocalDate.now().plusDays(1));

        // Manager 1 approves and claims
        mockMvc.perform(put("/api/appointments/" + appt.getId() + "/approve")
                .header("Authorization", "Bearer " + manager1Token))
                .andExpect(status().isOk());

        // Manager 2 attempts to approve same appointment -> 409 Conflict
        mockMvc.perform(put("/api/appointments/" + appt.getId() + "/approve")
                .header("Authorization", "Bearer " + manager2Token))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status", is(409)))
                .andExpect(jsonPath("$.error", is("Conflict")))
                .andExpect(jsonPath("$.message", is("Appointment has already been claimed by another manager.")));
    }

    @Test
    @DisplayName("11. Refresh retrieves updated persisted metrics and queues")
    void testRefreshRetrievesUpdatedPersistedMetrics() throws Exception {
        // Initial state: 0 appointments
        mockMvc.perform(get("/api/manager/dashboard/overview")
                .header("Authorization", "Bearer " + manager1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.awaitingDecisionCount", is(0)));

        // Create 1 customer appointment
        createCustomerAppointment(LocalDate.now());

        // Refresh overview
        mockMvc.perform(get("/api/manager/dashboard/overview")
                .header("Authorization", "Bearer " + manager1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.awaitingDecisionCount", is(1)));
    }
}
