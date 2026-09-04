package com.car_backend.security;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.car_backend.entities.Appointment;
import com.car_backend.entities.Invoice;
import com.car_backend.entities.JobCard;
import com.car_backend.entities.JobCardStatus;
import com.car_backend.entities.PaymentStatus;
import com.car_backend.entities.Role;
import com.car_backend.entities.Status;
import com.car_backend.entities.User;
import com.car_backend.entities.Vehicle;
import com.car_backend.repository.AppointmentRepository;
import com.car_backend.repository.InvoiceRepository;
import com.car_backend.repository.JobCardRepository;
import com.car_backend.repository.UserRepository;
import com.car_backend.repository.VehicleRepository;
import com.car_backend.security.jwt.JwtUtil;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class InvoiceAuthorizationTests {

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
    private InvoiceRepository invoiceRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    private User admin;
    private User manager;
    private User mechanic;
    private User customer1;
    private User customer2;

    private Invoice invoice1;

    private String adminToken;
    private String managerToken;
    private String mechanicToken;
    private String customer1Token;
    private String customer2Token;

    @BeforeEach
    void setUp() {
        invoiceRepository.deleteAll();
        jobCardRepository.deleteAll();
        appointmentRepository.deleteAll();
        vehicleRepository.deleteAll();
        userRepository.deleteAll();

        admin = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Admin User", "admin@autoserve.com", "AdminPass123!", Role.ADMIN, "9999999999", null, true);
        manager = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Manager User", "mgr@autoserve.com", "ManagerPass123!", Role.MANAGER, "8888888888", null, true);
        mechanic = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Mechanic User", "mech@autoserve.com", "MechanicPass123!", Role.MECHANIC, "7777777777", manager, true);
        customer1 = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Customer One", "customer1@autoserve.com", "CustomerPass123!", Role.CUSTOMER, "6666666666", null, true);
        customer2 = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Customer Two", "customer2@autoserve.com", "CustomerPass123!", Role.CUSTOMER, "5555555555", null, true);

        adminToken = SecurityTestUtils.createToken(jwtUtil, admin);
        managerToken = SecurityTestUtils.createToken(jwtUtil, manager);
        mechanicToken = SecurityTestUtils.createToken(jwtUtil, mechanic);
        customer1Token = SecurityTestUtils.createToken(jwtUtil, customer1);
        customer2Token = SecurityTestUtils.createToken(jwtUtil, customer2);

        Vehicle v1 = new Vehicle();
        v1.setCustomer(customer1);
        v1.setBrand("Toyota");
        v1.setModel("Camry");
        v1.setManufacturingYear(2022);
        v1.setLicensePlate("KA-01-AB-1234");
        v1 = vehicleRepository.save(v1);

        Appointment appt1 = new Appointment();
        appt1.setVehicleDetails(v1);
        appt1.setProblemDescription("Service");
        appt1.setRequestDate(LocalDate.now());
        appt1.setStatus(Status.APPROVED);
        appt1.setManager(manager);
        appt1 = appointmentRepository.save(appt1);

        JobCard jc1 = new JobCard();
        jc1.setAppointment(appt1);
        jc1.setManager(manager);
        jc1.setMechanic(mechanic);
        jc1.setJobCardStatus(JobCardStatus.COMPLETED);
        jc1 = jobCardRepository.save(jc1);

        invoice1 = new Invoice();
        invoice1.setJobCard(jc1);
        invoice1.setInvoiceNumber("INV-0001");
        invoice1.setLaborCost(BigDecimal.valueOf(500.0));
        invoice1.setBaseAmount(BigDecimal.valueOf(1000.0));
        invoice1.setTaxPercentage(BigDecimal.valueOf(18.0));
        invoice1.setTaxAmount(BigDecimal.valueOf(270.0));
        invoice1.setTotalAmount(BigDecimal.valueOf(1770.0));
        invoice1.setPaymentStatus(PaymentStatus.PENDING);
        invoice1 = invoiceRepository.save(invoice1);
    }

    @Test
    @DisplayName("Customer can view owned invoice")
    void testCustomerViewOwnInvoice() throws Exception {
        mockMvc.perform(get("/api/invoices/" + invoice1.getId())
                .header("Authorization", "Bearer " + customer1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(invoice1.getId().intValue())));
    }

    @Test
    @DisplayName("Customer cannot view another customer's invoice (returns 403)")
    void testCustomerCannotViewAnotherInvoice() throws Exception {
        mockMvc.perform(get("/api/invoices/" + invoice1.getId())
                .header("Authorization", "Bearer " + customer2Token))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Customer cannot list all invoices (returns 403)")
    void testCustomerCannotListAllInvoices() throws Exception {
        mockMvc.perform(get("/api/invoices")
                .header("Authorization", "Bearer " + customer1Token))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Mechanic cannot generate invoice (returns 403)")
    void testMechanicCannotGenerateInvoice() throws Exception {
        mockMvc.perform(post("/api/invoices/generate/job_card/999")
                .header("Authorization", "Bearer " + mechanicToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Simulate payment endpoint returns 404 Not Found")
    void testSimulatePaymentReturns404() throws Exception {
        mockMvc.perform(post("/api/invoices/" + invoice1.getId() + "/simulate_payment")
                .header("Authorization", "Bearer " + customer1Token))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Admin can view global invoice statistics")
    void testAdminViewTotalInvoicesCount() throws Exception {
        mockMvc.perform(get("/api/invoices/stats/total_count")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());
    }
}
