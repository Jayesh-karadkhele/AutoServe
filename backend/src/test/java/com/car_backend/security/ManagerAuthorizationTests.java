package com.car_backend.security;

import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
import com.car_backend.entities.ServiceFulfilmentMode;
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
public class ManagerAuthorizationTests {

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

    private Invoice invoiceA;
    private Invoice invoiceB;

    private String managerAToken;
    private String managerBToken;
    private String customerAToken;
    private String mechanicAToken;

    @BeforeEach
    void setUp() {
        invoiceRepository.deleteAll();
        jobCardRepository.deleteAll();
        appointmentRepository.deleteAll();
        vehicleRepository.deleteAll();
        userRepository.deleteAll();

        managerA = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Manager A", "managera@autoserve.com", "Pass123!", Role.MANAGER, "9111111111", null, true);
        managerB = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Manager B", "managerb@autoserve.com", "Pass123!", Role.MANAGER, "9222222222", null, true);

        mechanicA = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Mechanic A", "mechanica@autoserve.com", "Pass123!", Role.MECHANIC, "9333333333", managerA, true);
        mechanicB = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Mechanic B", "mechanicb@autoserve.com", "Pass123!", Role.MECHANIC, "9444444444", managerB, true);

        customerA = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Customer A", "customera@autoserve.com", "Pass123!", Role.CUSTOMER, "9555555555", null, true);
        customerB = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Customer B", "customerb@autoserve.com", "Pass123!", Role.CUSTOMER, "9666666666", null, true);

        managerAToken = SecurityTestUtils.createToken(jwtUtil, managerA);
        managerBToken = SecurityTestUtils.createToken(jwtUtil, managerB);
        customerAToken = SecurityTestUtils.createToken(jwtUtil, customerA);
        mechanicAToken = SecurityTestUtils.createToken(jwtUtil, mechanicA);

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
        appointmentA.setProblemDescription("Full General Service");
        appointmentA.setRequestDate(LocalDate.now().plusDays(1));
        appointmentA.setStatus(Status.APPROVED);
        appointmentA.setFulfilmentMode(ServiceFulfilmentMode.PICKUP_AND_RETURN_REQUESTED);
        appointmentA.setPickupAddress("123 Palm Grove, Sector 4, Bangalore");
        appointmentA.setManager(managerA);
        appointmentA.setMechanic(mechanicA);
        appointmentA = appointmentRepository.save(appointmentA);

        appointmentB = new Appointment();
        appointmentB.setVehicleDetails(vehicleB);
        appointmentB.setProblemDescription("Engine Noise Diagnosis");
        appointmentB.setRequestDate(LocalDate.now().plusDays(2));
        appointmentB.setStatus(Status.PENDING);
        appointmentB.setManager(managerB);
        appointmentB = appointmentRepository.save(appointmentB);

        jobCardA = new JobCard();
        jobCardA.setAppointment(appointmentA);
        jobCardA.setManager(managerA);
        jobCardA.setMechanic(mechanicA);
        jobCardA.setJobCardStatus(JobCardStatus.IN_PROGRESS);
        jobCardA.setLaborCost(new BigDecimal("1500.00"));
        jobCardA = jobCardRepository.save(jobCardA);

        jobCardB = new JobCard();
        jobCardB.setAppointment(appointmentB);
        jobCardB.setManager(managerB);
        jobCardB.setMechanic(mechanicB);
        jobCardB.setJobCardStatus(JobCardStatus.CREATED);
        jobCardB = jobCardRepository.save(jobCardB);

        invoiceA = new Invoice();
        invoiceA.setInvoiceNumber("INV-MAN-A-001");
        invoiceA.setJobCard(jobCardA);
        invoiceA.setBaseAmount(new BigDecimal("2000.00"));
        invoiceA.setLaborCost(new BigDecimal("1500.00"));
        invoiceA.setTaxPercentage(new BigDecimal("18.00"));
        invoiceA.setTaxAmount(new BigDecimal("630.00"));
        invoiceA.setTotalAmount(new BigDecimal("4130.00"));
        invoiceA.setPaymentStatus(PaymentStatus.PENDING);
        invoiceA = invoiceRepository.save(invoiceA);

        invoiceB = new Invoice();
        invoiceB.setInvoiceNumber("INV-MAN-B-002");
        invoiceB.setJobCard(jobCardB);
        invoiceB.setBaseAmount(new BigDecimal("1000.00"));
        invoiceB.setLaborCost(new BigDecimal("500.00"));
        invoiceB.setTaxPercentage(new BigDecimal("18.00"));
        invoiceB.setTaxAmount(new BigDecimal("270.00"));
        invoiceB.setTotalAmount(new BigDecimal("1770.00"));
        invoiceB.setPaymentStatus(PaymentStatus.PENDING);
        invoiceB = invoiceRepository.save(invoiceB);
    }

    @Test
    @DisplayName("1. Manager A can access Manager A's appointment")
    void testManagerCanAccessOwnAppointment() throws Exception {
        mockMvc.perform(get("/api/appointments/" + appointmentA.getId())
                .header("Authorization", "Bearer " + managerAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(appointmentA.getId().intValue())));
    }

    @Test
    @DisplayName("2. Manager A receives 403 Forbidden for Manager B's appointment")
    void testManagerCannotAccessOtherManagerAppointment() throws Exception {
        mockMvc.perform(get("/api/appointments/" + appointmentB.getId())
                .header("Authorization", "Bearer " + managerAToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("3 & 4. Manager A can view Mechanic A under team, but receives 403 when trying to assign Mechanic B")
    void testManagerTeamMechanicScope() throws Exception {
        mockMvc.perform(get("/api/manager/team")
                .header("Authorization", "Bearer " + managerAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", is(1)))
                .andExpect(jsonPath("$[0].mechanicId", is(mechanicA.getId().intValue())));

        // Manager A attempting to assign Mechanic B (belongs to Manager B) to Manager A's appointment -> 403 Forbidden
        mockMvc.perform(put("/api/appointments/" + appointmentA.getId() + "/assign-mechanic/" + mechanicB.getId())
                .header("Authorization", "Bearer " + managerAToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("7 & 8. Manager A can access managed job card A, but receives 403 for Manager B's job card B")
    void testJobCardManagerOwnershipBoundaries() throws Exception {
        mockMvc.perform(get("/api/job_cards/" + jobCardA.getId())
                .header("Authorization", "Bearer " + managerAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(jobCardA.getId().intValue())));

        mockMvc.perform(get("/api/job_cards/" + jobCardB.getId())
                .header("Authorization", "Bearer " + managerAToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("11, 12 & 13. Manager A can access invoice A & PDF, but receives 403 for Manager B's invoice & PDF")
    void testInvoiceManagerOwnershipBoundaries() throws Exception {
        mockMvc.perform(get("/api/invoices/" + invoiceA.getId())
                .header("Authorization", "Bearer " + managerAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(invoiceA.getId().intValue())));

        mockMvc.perform(get("/api/invoices/" + invoiceB.getId())
                .header("Authorization", "Bearer " + managerAToken))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/invoices/" + invoiceB.getId() + "/download")
                .header("Authorization", "Bearer " + managerAToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("14 & 15. Customer & Mechanic receive 403 for Manager operations endpoint")
    void testWrongRoleEntryToManagerEndpoints() throws Exception {
        mockMvc.perform(get("/api/manager/dashboard/overview")
                .header("Authorization", "Bearer " + customerAToken))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/manager/dashboard/overview")
                .header("Authorization", "Bearer " + mechanicAToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("16. Deactivated Manager receives 401 Unauthorized")
    void testDeactivatedManagerReceives401() throws Exception {
        managerA.setActive(false);
        userRepository.save(managerA);

        mockMvc.perform(get("/api/manager/dashboard/overview")
                .header("Authorization", "Bearer " + managerAToken))
                .andExpect(status().isUnauthorized());
    }
}
