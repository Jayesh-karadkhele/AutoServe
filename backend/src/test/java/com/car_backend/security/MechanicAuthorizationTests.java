package com.car_backend.security;

import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
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
import com.car_backend.entities.EvidenceType;
import com.car_backend.entities.Inventory;
import com.car_backend.entities.JobCard;
import com.car_backend.entities.JobCardEvidence;
import com.car_backend.entities.JobCardStatus;
import com.car_backend.entities.Role;
import com.car_backend.entities.ServiceFulfilmentMode;
import com.car_backend.entities.Status;
import com.car_backend.entities.User;
import com.car_backend.entities.Vehicle;
import com.car_backend.repository.AppointmentRepository;
import com.car_backend.repository.InventoryRepository;
import com.car_backend.repository.JobCardRepository;
import com.car_backend.repository.UserRepository;
import com.car_backend.repository.VehicleRepository;
import com.car_backend.security.jwt.JwtUtil;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class MechanicAuthorizationTests {

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
    private InventoryRepository inventoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    private User managerA;
    private User managerB;
    private User mechanicA;
    private User mechanicB;
    private User customerA;
    private User customerB;

    private Vehicle vehicleA;
    private Vehicle vehicleB;

    private Appointment appointmentA;
    private Appointment appointmentB;

    private JobCard jobCardA;
    private JobCard jobCardB;

    private Inventory inventoryItem;

    private String mechanicAToken;
    private String mechanicBToken;
    private String managerAToken;
    private String managerBToken;
    private String customerAToken;
    private String customerBToken;

    @BeforeEach
    void setUp() {
        jobCardRepository.deleteAll();
        jobCardRepository.deleteAll();
        appointmentRepository.deleteAll();
        vehicleRepository.deleteAll();
        inventoryRepository.deleteAll();
        userRepository.deleteAll();

        managerA = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Manager A", "managera@autoserve.com", "Pass123!", Role.MANAGER, "9111111111", null, true);
        managerB = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Manager B", "managerb@autoserve.com", "Pass123!", Role.MANAGER, "9222222222", null, true);

        mechanicA = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Mechanic A", "mechanica@autoserve.com", "Pass123!", Role.MECHANIC, "9333333333", managerA, true);
        mechanicB = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Mechanic B", "mechanicb@autoserve.com", "Pass123!", Role.MECHANIC, "9444444444", managerB, true);

        customerA = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Customer A", "customera@autoserve.com", "Pass123!", Role.CUSTOMER, "9555555555", null, true);
        customerB = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Customer B", "customerb@autoserve.com", "Pass123!", Role.CUSTOMER, "9666666666", null, true);

        mechanicAToken = SecurityTestUtils.createToken(jwtUtil, mechanicA);
        mechanicBToken = SecurityTestUtils.createToken(jwtUtil, mechanicB);
        managerAToken = SecurityTestUtils.createToken(jwtUtil, managerA);
        managerBToken = SecurityTestUtils.createToken(jwtUtil, managerB);
        customerAToken = SecurityTestUtils.createToken(jwtUtil, customerA);
        customerBToken = SecurityTestUtils.createToken(jwtUtil, customerB);

        vehicleA = new Vehicle();
        vehicleA.setCustomer(customerA);
        vehicleA.setBrand("Toyota");
        vehicleA.setModel("Glanza");
        vehicleA.setLicensePlate("KA01AA1111");
        vehicleA = vehicleRepository.save(vehicleA);

        vehicleB = new Vehicle();
        vehicleB.setCustomer(customerB);
        vehicleB.setBrand("Hyundai");
        vehicleB.setModel("i20");
        vehicleB.setLicensePlate("KA02BB2222");
        vehicleB = vehicleRepository.save(vehicleB);

        appointmentA = new Appointment();
        appointmentA.setVehicleDetails(vehicleA);
        appointmentA.setProblemDescription("Brake Pads Replacement & Maintenance");
        appointmentA.setRequestDate(LocalDate.now().plusDays(1));
        appointmentA.setStatus(Status.APPROVED);
        appointmentA.setFulfilmentMode(ServiceFulfilmentMode.WORKSHOP_DROP_OFF);
        appointmentA.setManager(managerA);
        appointmentA.setMechanic(mechanicA);
        appointmentA = appointmentRepository.save(appointmentA);

        appointmentB = new Appointment();
        appointmentB.setVehicleDetails(vehicleB);
        appointmentB.setProblemDescription("Engine Noise Diagnosis");
        appointmentB.setRequestDate(LocalDate.now().plusDays(2));
        appointmentB.setStatus(Status.APPROVED);
        appointmentB.setManager(managerB);
        appointmentB.setMechanic(mechanicB);
        appointmentB = appointmentRepository.save(appointmentB);

        jobCardA = new JobCard();
        jobCardA.setAppointment(appointmentA);
        jobCardA.setManager(managerA);
        jobCardA.setMechanic(mechanicA);
        jobCardA.setJobCardStatus(JobCardStatus.CREATED);
        jobCardA.setLaborCost(new BigDecimal("1500.00"));
        jobCardA = jobCardRepository.save(jobCardA);

        jobCardB = new JobCard();
        jobCardB.setAppointment(appointmentB);
        jobCardB.setManager(managerB);
        jobCardB.setMechanic(mechanicB);
        jobCardB.setJobCardStatus(JobCardStatus.CREATED);
        jobCardB.setLaborCost(new BigDecimal("2000.00"));
        jobCardB = jobCardRepository.save(jobCardB);

        inventoryItem = new Inventory();
        inventoryItem.setItemName("Synthetic 5W30 Oil 4L");
        inventoryItem.setSkuCode("OIL-SYN-5W30");
        inventoryItem.setCurrentPrice(new BigDecimal("2400.00"));
        inventoryItem.setStockQuantity(10);
        inventoryItem = inventoryRepository.save(inventoryItem);
    }

    @Test
    @DisplayName("1 & 2. Mechanic A can list Mechanic A's jobs, but cannot list Mechanic B's jobs")
    void testMechanicJobListingIsolation() throws Exception {
        mockMvc.perform(get("/api/job_cards/mechanic/me")
                .header("Authorization", "Bearer " + mechanicAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", is(1)))
                .andExpect(jsonPath("$[0].id", is(jobCardA.getId().intValue())));
    }

    @Test
    @DisplayName("3 & 4. Mechanic A can open assigned job A, but receives 403 for Mechanic B's job B")
    void testMechanicJobAccessBoundaries() throws Exception {
        mockMvc.perform(get("/api/job_cards/" + jobCardA.getId())
                .header("Authorization", "Bearer " + mechanicAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(jobCardA.getId().intValue())));

        mockMvc.perform(get("/api/job_cards/" + jobCardB.getId())
                .header("Authorization", "Bearer " + mechanicAToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("5 & 6. Mechanic A can start work on job A, but receives 403 for job B")
    void testMechanicStartWorkPermissions() throws Exception {
        mockMvc.perform(put("/api/job_cards/" + jobCardA.getId() + "/start")
                .header("Authorization", "Bearer " + mechanicAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("IN_PROGRESS")));

        mockMvc.perform(put("/api/job_cards/" + jobCardB.getId() + "/start")
                .header("Authorization", "Bearer " + mechanicAToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("9, 10 & 11. Mechanic A can add part to active job A, stock decreases, insufficient stock rejected")
    void testPartsUsageWorkflows() throws Exception {
        // Start job A first
        jobCardA.setJobCardStatus(JobCardStatus.IN_PROGRESS);
        jobCardRepository.save(jobCardA);

        String itemPayload = """
            {
                "inventoryItemId": %d,
                "quantity": 2
            }
        """.formatted(inventoryItem.getId());

        mockMvc.perform(post("/api/job_cards/" + jobCardA.getId() + "/items")
                .header("Authorization", "Bearer " + mechanicAToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(itemPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items.length()", is(1)));

        // Verify stock decreased to 8
        Inventory updatedInventory = inventoryRepository.findById(inventoryItem.getId()).orElseThrow();
        assertEquals(8, updatedInventory.getStockQuantity());

        // Mechanic A cannot add parts to Mechanic B's job B -> 403
        mockMvc.perform(post("/api/job_cards/" + jobCardB.getId() + "/items")
                .header("Authorization", "Bearer " + mechanicAToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(itemPayload))
                .andExpect(status().isForbidden());

        // Insufficient stock request (requested 100 > available 8) -> 400 Bad Request
        String overstockPayload = """
            {
                "inventoryItemId": %d,
                "quantity": 100
            }
        """.formatted(inventoryItem.getId());

        mockMvc.perform(post("/api/job_cards/" + jobCardA.getId() + "/items")
                .header("Authorization", "Bearer " + mechanicAToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(overstockPayload))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("14 & 15. Mechanic A can upload evidence to job A, receives 403 for job B")
    void testEvidenceUploadPermissions() throws Exception {
        jobCardA.setJobCardStatus(JobCardStatus.IN_PROGRESS);
        jobCardRepository.save(jobCardA);

        String evidencePayload = """
            {
                "photoUrl": "https://res.cloudinary.com/demo/image/upload/sample.jpg",
                "description": "Brake Rotor Measurement",
                "evidenceType": "DIAGNOSIS",
                "mediaType": "image/jpeg",
                "originalFilename": "brake_rotor_measurement.jpg"
            }
        """;

        mockMvc.perform(post("/api/job_cards/" + jobCardA.getId() + "/evidence")
                .header("Authorization", "Bearer " + mechanicAToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(evidencePayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.evidence.length()", is(1)));

        mockMvc.perform(post("/api/job_cards/" + jobCardB.getId() + "/evidence")
                .header("Authorization", "Bearer " + mechanicAToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(evidencePayload))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("18 & 19. Customer A can view evidence for job A, Customer B receives 403 for job A")
    void testCustomerEvidenceViewPermissions() throws Exception {
        JobCardEvidence evidence = new JobCardEvidence();
        evidence.setJobCard(jobCardA);
        evidence.setPhotoUrl("https://res.cloudinary.com/demo/image/upload/sample.jpg");
        evidence.setDescription("Initial brake pads inspection");
        evidence.setEvidenceType(EvidenceType.DIAGNOSIS);
        evidence.setUploadedAt(java.time.LocalDateTime.now());
        jobCardA.getEvidences().add(evidence);
        jobCardRepository.save(jobCardA);

        mockMvc.perform(get("/api/job_cards/" + jobCardA.getId() + "/evidence")
                .header("Authorization", "Bearer " + customerAToken))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/job_cards/" + jobCardA.getId() + "/evidence")
                .header("Authorization", "Bearer " + customerBToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("22 & 23. Mechanic cannot generate invoice or view manager reports")
    void testMechanicProhibitedActions() throws Exception {
        mockMvc.perform(post("/api/invoices/generate/job_card/" + jobCardA.getId())
                .header("Authorization", "Bearer " + mechanicAToken))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/manager/reports/summary")
                .header("Authorization", "Bearer " + mechanicAToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("24. Deactivated Mechanic receives 401 Unauthorized")
    void testDeactivatedMechanicReceives401() throws Exception {
        mechanicA.setActive(false);
        userRepository.save(mechanicA);

        mockMvc.perform(get("/api/mechanic/dashboard/overview")
                .header("Authorization", "Bearer " + mechanicAToken))
                .andExpect(status().isUnauthorized());
    }
}
