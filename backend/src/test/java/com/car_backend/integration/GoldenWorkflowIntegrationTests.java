package com.car_backend.integration;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.transaction.annotation.Transactional;

import com.car_backend.dto.CreateAppointmentDto;
import com.car_backend.dto.CreateRatingDto;
import com.car_backend.dto.CreateVehicleDto;
import com.car_backend.dto.auth.LoginRequestDto;
import com.car_backend.dto.auth.RegisterRequestDto;
import com.car_backend.dto.invoice.VerifyPaymentRequestDto;
import com.car_backend.dto.jobCard.CreateJobCardDto;
import com.car_backend.entities.Appointment;
import com.car_backend.entities.Invoice;
import com.car_backend.entities.JobCard;
import com.car_backend.entities.JobCardStatus;
import com.car_backend.entities.PaymentStatus;
import com.car_backend.entities.Role;
import com.car_backend.entities.Status;
import com.car_backend.entities.User;
import com.car_backend.repository.AppointmentRepository;
import com.car_backend.repository.InvoiceRepository;
import com.car_backend.repository.JobCardRepository;
import com.car_backend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class GoldenWorkflowIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private JobCardRepository jobCardRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    private User manager;
    private User mechanic;
    private String customerToken;
    private String managerToken;
    private String mechanicToken;
    private String adminToken;

    @BeforeEach
    void setUp() throws Exception {
        managerToken = loginAndGetToken("manager@autoserve.com", "manager0521", Role.MANAGER);
        mechanicToken = loginAndGetToken("mechanic@autoserve.com", "Mech0521", Role.MECHANIC);
        adminToken = loginAndGetToken("admin@autoserve.com", "ad0521", Role.ADMIN);
        manager = userRepository.findByEmail("manager@autoserve.com").orElseThrow();
        mechanic = userRepository.findByEmail("mechanic@autoserve.com").orElseThrow();
        mechanic.setManager(manager);
        mechanic = userRepository.save(mechanic);
    }

    private String loginAndGetToken(String email, String password, Role role) throws Exception {
        LoginRequestDto loginDto = new LoginRequestDto();
        loginDto.setEmail(email);
        loginDto.setPassword(password);
        loginDto.setRole(role.name());

        String response = mockMvc.perform(post("/api/auth/login")
                .header("X-AutoServe-Client", "web")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        return objectMapper.readTree(response).get("token").asText();
    }

    @Test
    @DisplayName("Golden Workflow: End-to-End Execution across Customer, Manager, Mechanic, Admin roles")
    void testCompleteGoldenWorkflow() throws Exception {
        // Step 1: Customer Registration
        RegisterRequestDto registerDto = new RegisterRequestDto();
        registerDto.setName("John Customer");
        registerDto.setEmail("john.customer@autoserve.com");
        registerDto.setPassword("CustomerPass123!");
        registerDto.setPhone("9998887776");

        mockMvc.perform(post("/api/auth/register")
                .header("X-AutoServe-Client", "web")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("john.customer@autoserve.com"));

        // Step 2: Customer Login
        customerToken = loginAndGetToken("john.customer@autoserve.com", "CustomerPass123!", Role.CUSTOMER);
        Assertions.assertNotNull(customerToken);

        // Step 3: Add Vehicle
        CreateVehicleDto vehicleDto = new CreateVehicleDto();
        vehicleDto.setMake("Toyota");
        vehicleDto.setModel("Camry");
        vehicleDto.setYear(2022);
        vehicleDto.setLicensePlate("KA01AB1234");
        vehicleDto.setVin("1HGCR2F83HA000123");

        String vehicleResponse = mockMvc.perform(post("/api/vehicles")
                .header("X-AutoServe-Client", "web")
                .header("Authorization", "Bearer " + customerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(vehicleDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.licensePlate").value("KA01AB1234"))
                .andReturn().getResponse().getContentAsString();

        Long vehicleId = objectMapper.readTree(vehicleResponse).get("id").asLong();

        // Step 4: Book Appointment (Status -> PENDING)
        CreateAppointmentDto appointmentDto = new CreateAppointmentDto();
        appointmentDto.setVehicleId(vehicleId);
        appointmentDto.setRequestDate(LocalDate.now().plusDays(2));
        appointmentDto.setDescription("Periodic maintenance oil change and multi-point inspection");

        MockMultipartFile appointmentPart = new MockMultipartFile(
                "appointment",
                "",
                "application/json",
                objectMapper.writeValueAsBytes(appointmentDto)
        );

        String appointmentResponse = mockMvc.perform(multipart("/api/appointments")
                .file(appointmentPart)
                .header("X-AutoServe-Client", "web")
                .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andReturn().getResponse().getContentAsString();

        Long appointmentId = objectMapper.readTree(appointmentResponse).get("id").asLong();

        // Assert DB state after appointment creation
        Appointment storedAppointment = appointmentRepository.findById(appointmentId).orElseThrow();
        Assertions.assertEquals(Status.PENDING, storedAppointment.getStatus());

        // Step 5 & 6: Manager Pending Queue Inspection
        mockMvc.perform(get("/api/appointments/pending")
                .header("X-AutoServe-Client", "web")
                .header("Authorization", "Bearer " + managerToken))
                .andExpect(status().isOk());

        // Step 7: Manager Atomic Claim & Approval
        mockMvc.perform(put("/api/appointments/" + appointmentId + "/approve")
                .header("X-AutoServe-Client", "web")
                .header("Authorization", "Bearer " + managerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("APPROVED"));

        // Step 8: Manager Assigns Mechanic & Job Card Creation
        CreateJobCardDto createJobCardDto = new CreateJobCardDto();
        createJobCardDto.setAppointmentId(appointmentId);
        createJobCardDto.setManagerId(manager.getId());
        createJobCardDto.setMechanicId(mechanic.getId());
        createJobCardDto.setLaborCost(BigDecimal.valueOf(1500.0));
        createJobCardDto.setEstimatedCompletionDate(LocalDate.now().plusDays(3));

        String jobCardResponse = mockMvc.perform(post("/api/job_cards")
                .header("X-AutoServe-Client", "web")
                .header("Authorization", "Bearer " + managerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createJobCardDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CREATED"))
                .andReturn().getResponse().getContentAsString();

        Long jobCardId = objectMapper.readTree(jobCardResponse).get("id").asLong();

        // Step 9 & 10: Mechanic Login (Mech0521) & Start Repair
        mockMvc.perform(put("/api/job_cards/" + jobCardId + "/start")
                .header("X-AutoServe-Client", "web")
                .header("Authorization", "Bearer " + mechanicToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"));

        // Step 11 & 12: Mechanic Complete Repair
        mockMvc.perform(put("/api/job_cards/" + jobCardId + "/complete")
                .header("X-AutoServe-Client", "web")
                .header("Authorization", "Bearer " + mechanicToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"));

        JobCard storedJobCard = jobCardRepository.findById(jobCardId).orElseThrow();
        Assertions.assertEquals(JobCardStatus.COMPLETED, storedJobCard.getJobCardStatus());

        // Step 13: Manager Verifies Work & Generates Invoice
        String invoiceResponse = mockMvc.perform(post("/api/invoices/generate/job_card/" + jobCardId)
                .header("X-AutoServe-Client", "web")
                .header("Authorization", "Bearer " + managerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.paymentStatus").value("PENDING"))
                .andReturn().getResponse().getContentAsString();

        Long invoiceId = objectMapper.readTree(invoiceResponse).get("id").asLong();

        // Step 14: Customer Views Invoice
        mockMvc.perform(get("/api/invoices/me")
                .header("X-AutoServe-Client", "web")
                .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk());

        // Step 15: Razorpay Signature Verification & Invoice Settlement
        Invoice invToPay = invoiceRepository.findById(invoiceId).orElseThrow();
        invToPay.setRazorpayOrderId("order_mock_golden_123");
        invoiceRepository.save(invToPay);

        javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
        javax.crypto.spec.SecretKeySpec secretKeySpec = new javax.crypto.spec.SecretKeySpec(
                "rzp_secret_AutoServeSecret456".getBytes(java.nio.charset.StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKeySpec);
        byte[] hash = mac.doFinal("order_mock_golden_123|pay_mock_golden_456".getBytes(java.nio.charset.StandardCharsets.UTF_8));
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            hexString.append(String.format("%02x", b));
        }

        VerifyPaymentRequestDto verifyDto = new VerifyPaymentRequestDto();
        verifyDto.setRazorpayOrderId("order_mock_golden_123");
        verifyDto.setRazorpayPaymentId("pay_mock_golden_456");
        verifyDto.setRazorpaySignature(hexString.toString());

        mockMvc.perform(post("/api/invoices/" + invoiceId + "/verify_payment")
                .header("X-AutoServe-Client", "web")
                .header("Authorization", "Bearer " + customerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(verifyDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.verified").value(true));

        Invoice storedInvoice = invoiceRepository.findById(invoiceId).orElseThrow();
        Assertions.assertEquals(PaymentStatus.PAID, storedInvoice.getPaymentStatus());

        // Step 16: Customer Submits Rating
        CreateRatingDto ratingDto = new CreateRatingDto();
        ratingDto.setJobCardId(jobCardId);
        ratingDto.setRating(5);
        ratingDto.setComment("Outstanding service! Vehicle returned in pristine condition.");

        mockMvc.perform(post("/api/ratings")
                .header("X-AutoServe-Client", "web")
                .header("Authorization", "Bearer " + customerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ratingDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.rating").value(5));

        // Step 17: Admin Login (ad0521) & Dashboard Operations
        mockMvc.perform(get("/api/admin/overview")
                .header("X-AutoServe-Client", "web")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCustomers").exists());
    }
}
