package com.car_backend.security;

import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
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
import org.springframework.mock.web.MockPart;
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
public class AppointmentAuthorizationTests {

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

    private User admin;
    private User manager1;
    private User manager2;
    private User mechanic1;
    private User customer1;
    private User customer2;

    private Vehicle vehicle1;
    private Vehicle vehicle2;
    private Appointment appointment1;

    private String adminToken;
    private String manager1Token;
    private String manager2Token;
    private String mechanic1Token;
    private String customer1Token;
    private String customer2Token;

    @BeforeEach
    void setUp() {
        appointmentRepository.deleteAll();
        vehicleRepository.deleteAll();
        userRepository.deleteAll();

        admin = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Admin User", "admin@autoserve.com", "AdminPass123!", Role.ADMIN, "9999999999", null, true);
        manager1 = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Manager One", "mgr1@autoserve.com", "ManagerPass123!", Role.MANAGER, "8888888888", null, true);
        manager2 = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Manager Two", "mgr2@autoserve.com", "ManagerPass123!", Role.MANAGER, "8888888887", null, true);
        mechanic1 = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Mechanic One", "mech1@autoserve.com", "MechanicPass123!", Role.MECHANIC, "7777777777", manager1, true);
        customer1 = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Customer One", "customer1@autoserve.com", "CustomerPass123!", Role.CUSTOMER, "6666666666", null, true);
        customer2 = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Customer Two", "customer2@autoserve.com", "CustomerPass123!", Role.CUSTOMER, "5555555555", null, true);

        adminToken = SecurityTestUtils.createToken(jwtUtil, admin);
        manager1Token = SecurityTestUtils.createToken(jwtUtil, manager1);
        manager2Token = SecurityTestUtils.createToken(jwtUtil, manager2);
        mechanic1Token = SecurityTestUtils.createToken(jwtUtil, mechanic1);
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

        appointment1 = new Appointment();
        appointment1.setVehicleDetails(vehicle1);
        appointment1.setProblemDescription("General Repair");
        appointment1.setRequestDate(LocalDate.now().plusDays(2));
        appointment1.setStatus(Status.PENDING);
        appointment1.setManager(manager1);
        appointment1 = appointmentRepository.save(appointment1);
    }

    @Test
    @DisplayName("Customer creates appointment for owned vehicle successfully")
    void testCustomerCreateAppointmentOwnedVehicle() throws Exception {
        long initialCount = appointmentRepository.count();
        String jsonDto = String.format("""
            {
                "vehicleId": %d,
                "description": "Oil Change Service Required",
                "requestDate": "2026-10-10"
            }
            """, vehicle1.getId());

        MockPart appointmentPart = new MockPart("appointment", jsonDto.getBytes());
        appointmentPart.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        mockMvc.perform(multipart("/api/appointments")
                .part(appointmentPart)
                .header("Authorization", "Bearer " + customer1Token))
                .andExpect(status().isOk());

        assertEquals(initialCount + 1, appointmentRepository.count());
    }

    @Test
    @DisplayName("Customer cannot create appointment for another customer's vehicle (returns 403)")
    void testCustomerCannotCreateAppointmentUnownedVehicle() throws Exception {
        long initialCount = appointmentRepository.count();
        String jsonDto = String.format("""
            {
                "vehicleId": %d,
                "description": "Brake Replacement Required",
                "requestDate": "2026-10-10"
            }
            """, vehicle2.getId());

        MockPart appointmentPart = new MockPart("appointment", jsonDto.getBytes());
        appointmentPart.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        mockMvc.perform(multipart("/api/appointments")
                .part(appointmentPart)
                .header("Authorization", "Bearer " + customer1Token))
                .andExpect(status().isForbidden());

        assertEquals(initialCount, appointmentRepository.count());
    }

    @Test
    @DisplayName("Customer can view owned appointment")
    void testCustomerViewOwnAppointment() throws Exception {
        mockMvc.perform(get("/api/appointments/" + appointment1.getId())
                .header("Authorization", "Bearer " + customer1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(appointment1.getId().intValue())));
    }

    @Test
    @DisplayName("Customer cannot view another customer's appointment (returns 403)")
    void testCustomerCannotViewAnotherAppointment() throws Exception {
        mockMvc.perform(get("/api/appointments/" + appointment1.getId())
                .header("Authorization", "Bearer " + customer2Token))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Customer cannot approve appointment (returns 403) and status is unchanged")
    void testCustomerCannotApproveAppointment() throws Exception {
        mockMvc.perform(put("/api/appointments/" + appointment1.getId() + "/approve")
                .header("Authorization", "Bearer " + customer1Token))
                .andExpect(status().isForbidden());

        Appointment dbAppt = appointmentRepository.findById(appointment1.getId()).orElseThrow();
        assertEquals(Status.PENDING, dbAppt.getStatus());
    }

    @Test
    @DisplayName("Assigned manager can approve appointment")
    void testAssignedManagerCanApproveAppointment() throws Exception {
        mockMvc.perform(put("/api/appointments/" + appointment1.getId() + "/approve")
                .header("Authorization", "Bearer " + manager1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("APPROVED")));

        Appointment dbAppt = appointmentRepository.findById(appointment1.getId()).orElseThrow();
        assertEquals(Status.APPROVED, dbAppt.getStatus());
    }

    @Test
    @DisplayName("Unassigned manager cannot approve appointment (returns 403)")
    void testUnassignedManagerCannotApproveAppointment() throws Exception {
        mockMvc.perform(put("/api/appointments/" + appointment1.getId() + "/approve")
                .header("Authorization", "Bearer " + manager2Token))
                .andExpect(status().isForbidden());

        Appointment dbAppt = appointmentRepository.findById(appointment1.getId()).orElseThrow();
        assertEquals(Status.PENDING, dbAppt.getStatus());
    }

    @Test
    @DisplayName("Customer can view their own appointments via /me endpoint")
    void testCustomerCanViewOwnAppointmentsViaMe() throws Exception {
        mockMvc.perform(get("/api/appointments/me")
                .header("Authorization", "Bearer " + customer1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", is(1)))
                .andExpect(jsonPath("$[0].id", is(appointment1.getId().intValue())));
    }
}
