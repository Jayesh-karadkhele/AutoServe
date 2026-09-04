package com.car_backend.security;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
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
import com.car_backend.security.service.AccessControlService;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class AccessControlServiceTests {

    @Autowired
    private AccessControlService accessControlService;

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

    private User admin;
    private User manager1;
    private User manager2;
    private User mechanic1;
    private User customer1;
    private User customer2;

    private Vehicle vehicle1;
    private Appointment appointment1;
    private JobCard jobCard1;
    private Invoice invoice1;

    @BeforeEach
    void setUp() {
        invoiceRepository.deleteAll();
        jobCardRepository.deleteAll();
        appointmentRepository.deleteAll();
        vehicleRepository.deleteAll();
        userRepository.deleteAll();

        admin = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Admin User", "admin@autoserve.com", "AdminPass123!", Role.ADMIN, "9999999999", null, true);
        manager1 = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Manager One", "mgr1@autoserve.com", "ManagerPass123!", Role.MANAGER, "8888888888", null, true);
        manager2 = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Manager Two", "mgr2@autoserve.com", "ManagerPass123!", Role.MANAGER, "8888888887", null, true);
        mechanic1 = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Mechanic One", "mech1@autoserve.com", "MechanicPass123!", Role.MECHANIC, "7777777777", manager1, true);
        customer1 = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Customer One", "customer1@autoserve.com", "CustomerPass123!", Role.CUSTOMER, "6666666666", null, true);
        customer2 = SecurityTestUtils.createUser(userRepository, passwordEncoder, "Customer Two", "customer2@autoserve.com", "CustomerPass123!", Role.CUSTOMER, "5555555555", null, true);

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
        appointment1.setProblemDescription("Repair");
        appointment1.setRequestDate(LocalDate.now().plusDays(2));
        appointment1.setStatus(Status.APPROVED);
        appointment1.setManager(manager1);
        appointment1.setMechanic(mechanic1);
        appointment1 = appointmentRepository.save(appointment1);

        jobCard1 = new JobCard();
        jobCard1.setAppointment(appointment1);
        jobCard1.setManager(manager1);
        jobCard1.setMechanic(mechanic1);
        jobCard1.setJobCardStatus(JobCardStatus.CREATED);
        jobCard1 = jobCardRepository.save(jobCard1);

        invoice1 = new Invoice();
        invoice1.setJobCard(jobCard1);
        invoice1.setInvoiceNumber("INV-1001");
        invoice1.setBaseAmount(BigDecimal.valueOf(1000.0));
        invoice1.setLaborCost(BigDecimal.valueOf(500.0));
        invoice1.setTaxPercentage(BigDecimal.valueOf(18.0));
        invoice1.setTaxAmount(BigDecimal.valueOf(270.0));
        invoice1.setTotalAmount(BigDecimal.valueOf(1770.0));
        invoice1.setPaymentStatus(PaymentStatus.PENDING);
        invoice1 = invoiceRepository.save(invoice1);
    }

    private void setSecurityContext(User user) {
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getUserRole().name());
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                user.getEmail(), null, List.of(authority));
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    @DisplayName("isSelf check")
    void testIsSelf() {
        setSecurityContext(customer1);
        assertTrue(accessControlService.isSelf(customer1.getId()));
        assertFalse(accessControlService.isSelf(customer2.getId()));
    }

    @Test
    @DisplayName("canViewUser check")
    void testCanViewUser() {
        setSecurityContext(admin);
        assertTrue(accessControlService.canViewUser(customer1.getId()));

        setSecurityContext(customer1);
        assertTrue(accessControlService.canViewUser(customer1.getId()));
        assertFalse(accessControlService.canViewUser(customer2.getId()));
    }

    @Test
    @DisplayName("ownsVehicle and canAccessVehicle checks")
    void testVehicleAccess() {
        setSecurityContext(customer1);
        assertTrue(accessControlService.ownsVehicle(vehicle1.getId()));
        assertTrue(accessControlService.canAccessVehicle(vehicle1.getId()));

        setSecurityContext(customer2);
        assertFalse(accessControlService.ownsVehicle(vehicle1.getId()));
        assertFalse(accessControlService.canAccessVehicle(vehicle1.getId()));

        setSecurityContext(manager1);
        assertTrue(accessControlService.canAccessVehicle(vehicle1.getId()));

        setSecurityContext(admin);
        assertTrue(accessControlService.canAccessVehicle(vehicle1.getId()));
    }

    @Test
    @DisplayName("ownsAppointment, canAccessAppointment, managesAppointment checks")
    void testAppointmentAccess() {
        setSecurityContext(customer1);
        assertTrue(accessControlService.ownsAppointment(appointment1.getId()));
        assertTrue(accessControlService.canAccessAppointment(appointment1.getId()));
        assertFalse(accessControlService.managesAppointment(appointment1.getId()));

        setSecurityContext(manager1);
        assertTrue(accessControlService.managesAppointment(appointment1.getId()));
        assertTrue(accessControlService.canAccessAppointment(appointment1.getId()));

        setSecurityContext(manager2);
        assertFalse(accessControlService.managesAppointment(appointment1.getId()));
        assertFalse(accessControlService.canAccessAppointment(appointment1.getId()));

        setSecurityContext(mechanic1);
        assertTrue(accessControlService.isAssignedMechanicForAppointment(appointment1.getId()));
        assertTrue(accessControlService.canAccessAppointment(appointment1.getId()));
    }

    @Test
    @DisplayName("ownsJobCard, managesJobCard, isAssignedMechanicForJobCard, canAccessJobCard checks")
    void testJobCardAccess() {
        setSecurityContext(customer1);
        assertTrue(accessControlService.ownsJobCard(jobCard1.getId()));
        assertTrue(accessControlService.canAccessJobCard(jobCard1.getId()));
        assertFalse(accessControlService.managesJobCard(jobCard1.getId()));

        setSecurityContext(manager1);
        assertTrue(accessControlService.managesJobCard(jobCard1.getId()));
        assertTrue(accessControlService.canAccessJobCard(jobCard1.getId()));

        setSecurityContext(manager2);
        assertFalse(accessControlService.managesJobCard(jobCard1.getId()));

        setSecurityContext(mechanic1);
        assertTrue(accessControlService.isAssignedMechanicForJobCard(jobCard1.getId()));
        assertTrue(accessControlService.canAccessJobCard(jobCard1.getId()));
    }

    @Test
    @DisplayName("ownsInvoice, managesInvoice, canAccessInvoice checks")
    void testInvoiceAccess() {
        setSecurityContext(customer1);
        assertTrue(accessControlService.ownsInvoice(invoice1.getId()));
        assertTrue(accessControlService.canAccessInvoice(invoice1.getId()));
        assertFalse(accessControlService.managesInvoice(invoice1.getId()));

        setSecurityContext(customer2);
        assertFalse(accessControlService.ownsInvoice(invoice1.getId()));
        assertFalse(accessControlService.canAccessInvoice(invoice1.getId()));

        setSecurityContext(manager1);
        assertTrue(accessControlService.managesInvoice(invoice1.getId()));
        assertTrue(accessControlService.canAccessInvoice(invoice1.getId()));

        setSecurityContext(admin);
        assertTrue(accessControlService.canAccessInvoice(invoice1.getId()));
    }

    @Test
    @DisplayName("mechanicReportsToCurrentManager check")
    void testMechanicReportsToCurrentManager() {
        setSecurityContext(manager1);
        assertTrue(accessControlService.mechanicReportsToCurrentManager(mechanic1.getId()));

        setSecurityContext(manager2);
        assertFalse(accessControlService.mechanicReportsToCurrentManager(mechanic1.getId()));
    }
}
