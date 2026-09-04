package com.car_backend.security;

import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
import com.car_backend.entities.JobCard;
import com.car_backend.entities.JobCardStatus;
import com.car_backend.entities.Role;
import com.car_backend.entities.Status;
import com.car_backend.entities.User;
import com.car_backend.entities.Vehicle;
import com.car_backend.repository.AppointmentRepository;
import com.car_backend.repository.JobCardRepository;
import com.car_backend.repository.UserRepository;
import com.car_backend.repository.VehicleRepository;
import com.car_backend.security.jwt.JwtUtil;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class JobCardAuthorizationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private JobCardRepository jobCardRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    private User admin;
    private User manager1;
    private User manager2;
    private User mechanic1;
    private User mechanic2;
    private User customer1;
    private User customer2;

    private Vehicle vehicle1;
    private Appointment appointment1;
    private JobCard jobCard1;

    private String manager1Token;
    private String mechanic1Token;
    private String mechanic2Token;
    private String customer1Token;
    private String customer2Token;

    @BeforeEach
    void setUp() {
        jobCardRepository.deleteAll();
        appointmentRepository.deleteAll();
        vehicleRepository.deleteAll();
        userRepository.deleteAll();

        admin = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Admin User", "admin@autoserve.com", "AdminPass123!", Role.ADMIN, "9999999999", null, true);
        manager1 = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Manager One", "mgr1@autoserve.com", "ManagerPass123!", Role.MANAGER, "8888888888", null, true);
        manager2 = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Manager Two", "mgr2@autoserve.com", "ManagerPass123!", Role.MANAGER, "8888888887", null, true);
        mechanic1 = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Mechanic One", "mech1@autoserve.com", "MechanicPass123!", Role.MECHANIC, "7777777777", manager1, true);
        mechanic2 = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Mechanic Two", "mech2@autoserve.com", "MechanicPass123!", Role.MECHANIC, "7777777776", manager2, true);
        customer1 = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Customer One", "customer1@autoserve.com", "CustomerPass123!", Role.CUSTOMER, "6666666666", null, true);
        customer2 = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Customer Two", "customer2@autoserve.com", "CustomerPass123!", Role.CUSTOMER, "5555555555", null, true);

        manager1Token = SecurityTestUtils.createToken(jwtUtil, manager1);
        mechanic1Token = SecurityTestUtils.createToken(jwtUtil, mechanic1);
        mechanic2Token = SecurityTestUtils.createToken(jwtUtil, mechanic2);
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

        appointment1 = new Appointment();
        appointment1.setVehicleDetails(vehicle1);
        appointment1.setProblemDescription("General Service");
        appointment1.setRequestDate(LocalDate.now().plusDays(1));
        appointment1.setStatus(Status.APPROVED);
        appointment1.setManager(manager1);
        appointment1 = appointmentRepository.save(appointment1);

        jobCard1 = new JobCard();
        jobCard1.setAppointment(appointment1);
        jobCard1.setManager(manager1);
        jobCard1.setMechanic(mechanic1);
        jobCard1.setJobCardStatus(JobCardStatus.CREATED);
        jobCard1 = jobCardRepository.save(jobCard1);
    }

    @Test
    @DisplayName("Mechanic cannot create job card (returns 403)")
    void testMechanicCannotCreateJobCard() throws Exception {
        String json = String.format("""
            {
                "appointmentId": %d,
                "managerId": %d,
                "laborCost": 500.0
            }
            """, appointment1.getId(), manager1.getId());

        mockMvc.perform(post("/api/job_cards")
                .header("Authorization", "Bearer " + mechanic1Token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Customer cannot create job card (returns 403)")
    void testCustomerCannotCreateJobCard() throws Exception {
        String json = String.format("""
            {
                "appointmentId": %d,
                "managerId": %d,
                "laborCost": 500.0
            }
            """, appointment1.getId(), manager1.getId());

        mockMvc.perform(post("/api/job_cards")
                .header("Authorization", "Bearer " + customer1Token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Assigned mechanic can start work on job card")
    void testAssignedMechanicCanStartWork() throws Exception {
        mockMvc.perform(put("/api/job_cards/" + jobCard1.getId() + "/start")
                .header("Authorization", "Bearer " + mechanic1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("IN_PROGRESS")));

        JobCard dbJobCard = jobCardRepository.findById(jobCard1.getId()).orElseThrow();
        assertEquals(JobCardStatus.IN_PROGRESS, dbJobCard.getJobCardStatus());
    }

    @Test
    @DisplayName("Unassigned mechanic cannot start work on job card (returns 403)")
    void testUnassignedMechanicCannotStartWork() throws Exception {
        mockMvc.perform(put("/api/job_cards/" + jobCard1.getId() + "/start")
                .header("Authorization", "Bearer " + mechanic2Token))
                .andExpect(status().isForbidden());

        JobCard dbJobCard = jobCardRepository.findById(jobCard1.getId()).orElseThrow();
        assertEquals(JobCardStatus.CREATED, dbJobCard.getJobCardStatus());
    }

    @Test
    @DisplayName("Mechanic cannot complete a CREATED job card before starting it (returns 400 Bad Request)")
    void testMechanicCannotCompleteBeforeStart() throws Exception {
        mockMvc.perform(put("/api/job_cards/" + jobCard1.getId() + "/complete")
                .header("Authorization", "Bearer " + mechanic1Token))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Customer cannot view another customer's job card (returns 403)")
    void testCustomerCannotViewAnotherJobCard() throws Exception {
        mockMvc.perform(get("/api/job_cards/" + jobCard1.getId())
                .header("Authorization", "Bearer " + customer2Token))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Customer cannot rate another customer's job card (returns 403)")
    void testCustomerCannotRateAnotherJobCard() throws Exception {
        String json = """
            {
                "rating": 5,
                "feedback": "Great service!"
            }
            """;

        mockMvc.perform(put("/api/job_cards/" + jobCard1.getId() + "/rate")
                .header("Authorization", "Bearer " + customer2Token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isForbidden());
    }
}
