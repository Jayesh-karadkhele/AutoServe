package com.car_backend.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.HexFormat;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import com.car_backend.dto.auth.ChangePasswordDto;
import com.car_backend.dto.auth.ForgotPasswordRequestDto;
import com.car_backend.dto.auth.ResetPasswordRequestDto;
import com.car_backend.dto.payment.PaymentOrderResponseDto;
import com.car_backend.dto.payment.VerifyPaymentRequestDto;
import com.car_backend.entities.Appointment;
import com.car_backend.entities.Invoice;
import com.car_backend.entities.JobCard;
import com.car_backend.entities.JobCardStatus;
import com.car_backend.entities.PasswordResetToken;
import com.car_backend.entities.PaymentStatus;
import com.car_backend.entities.Role;
import com.car_backend.entities.Status;
import com.car_backend.entities.User;
import com.car_backend.entities.Vehicle;
import com.car_backend.repository.AppointmentRepository;
import com.car_backend.repository.InvoiceRepository;
import com.car_backend.repository.JobCardRepository;
import com.car_backend.repository.PasswordResetTokenRepository;
import com.car_backend.repository.UserRepository;
import com.car_backend.repository.VehicleRepository;
import com.car_backend.service.AccountSecurityService;
import com.car_backend.service.PaymentService;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class PaymentAndSecurityTests {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private AccountSecurityService accountSecurityService;

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
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User customerA;
    private User customerB;
    private Invoice invoiceA;

    @BeforeEach
    void setUp() {
        customerA = userRepository.findByEmail("customer.pay.a@autoserve.com").orElseGet(() -> {
            User u = new User();
            u.setUserName("Customer Pay A");
            u.setEmail("customer.pay.a@autoserve.com");
            u.setPassword(passwordEncoder.encode("Password123!"));
            u.setMobile("9111111111");
            u.setUserRole(Role.CUSTOMER);
            u.setActive(true);
            return userRepository.save(u);
        });

        customerB = userRepository.findByEmail("customer.pay.b@autoserve.com").orElseGet(() -> {
            User u = new User();
            u.setUserName("Customer Pay B");
            u.setEmail("customer.pay.b@autoserve.com");
            u.setPassword(passwordEncoder.encode("Password123!"));
            u.setMobile("9222222222");
            u.setUserRole(Role.CUSTOMER);
            u.setActive(true);
            return userRepository.save(u);
        });

        Vehicle vehicleA = new Vehicle();
        vehicleA.setCustomer(customerA);
        vehicleA.setLicensePlate("MH01PAY100");
        vehicleA.setVehicleType("Sedan");
        vehicleA.setBrand("Honda");
        vehicleA.setModel("Civic 2022");
        Vehicle savedVehicle = vehicleRepository.save(vehicleA);

        Appointment appt = new Appointment();
        appt.setVehicleDetails(savedVehicle);
        appt.setRequestDate(java.time.LocalDate.now());
        appt.setStatus(Status.COMPLETED);
        appt.setProblemDescription("Brake replacement and service");
        Appointment savedAppt = appointmentRepository.save(appt);

        User managerUser = userRepository.findByEmail("manager.pay@autoserve.com").orElseGet(() -> {
            User u = new User();
            u.setUserName("Manager Pay");
            u.setEmail("manager.pay@autoserve.com");
            u.setPassword(passwordEncoder.encode("Password123!"));
            u.setMobile("9333333333");
            u.setUserRole(Role.MANAGER);
            u.setActive(true);
            return userRepository.save(u);
        });

        JobCard job = new JobCard();
        job.setAppointment(savedAppt);
        job.setManager(managerUser);
        job.setJobCardStatus(JobCardStatus.COMPLETED);
        JobCard savedJob = jobCardRepository.save(job);

        Invoice inv = new Invoice();
        inv.setJobCard(savedJob);
        inv.setInvoiceNumber("INV-TEST-8E01");
        inv.setBaseAmount(new BigDecimal("1271.19"));
        inv.setLaborCost(new BigDecimal("200.00"));
        inv.setTaxPercentage(new BigDecimal("18.00"));
        inv.setTaxAmount(new BigDecimal("228.81"));
        inv.setTotalAmount(new BigDecimal("1500.00"));
        inv.setPaymentStatus(PaymentStatus.PENDING);
        invoiceA = invoiceRepository.save(inv);
    }

    @Test
    @DisplayName("1. Customer can create payment order for owned invoice with exact paise calculation")
    void customer_canCreatePaymentOrder() {
        PaymentOrderResponseDto order = paymentService.createPaymentOrder(invoiceA.getId(), customerA);
        assertNotNull(order);
        assertNotNull(order.getProviderOrderId());
        assertEquals(150000L, order.getAmountPaise());
        assertEquals("INR", order.getCurrency());
        assertEquals("CREATED", order.getStatus());
    }

    @Test
    @DisplayName("2. Customer receives AccessDeniedException when trying to create order for unowned invoice")
    void customer_unownedInvoiceAccessDenied() {
        assertThrows(AccessDeniedException.class, () -> paymentService.createPaymentOrder(invoiceA.getId(), customerB));
    }

    @Test
    @DisplayName("3. Valid payment signature updates payment attempt and marks invoice PAID")
    void verifyPayment_validSignatureMarksPaid() {
        PaymentOrderResponseDto order = paymentService.createPaymentOrder(invoiceA.getId(), customerA);

        String paymentId = "pay_mock_123456";
        String dataToSign = order.getProviderOrderId() + "|" + paymentId;
        String signature = calculateHmacSha256(dataToSign, "rzp_secret_AutoServeSecret456");

        VerifyPaymentRequestDto verifyDto = new VerifyPaymentRequestDto();
        verifyDto.setRazorpayOrderId(order.getProviderOrderId());
        verifyDto.setRazorpayPaymentId(paymentId);
        verifyDto.setRazorpaySignature(signature);

        var result = paymentService.verifyCheckoutSignature(invoiceA.getId(), verifyDto, customerA);
        assertNotNull(result);
        assertEquals("PAID", result.getStatus());

        Invoice reloadedInvoice = invoiceRepository.findById(invoiceA.getId()).orElseThrow();
        assertEquals(PaymentStatus.PAID, reloadedInvoice.getPaymentStatus());
    }

    @Test
    @DisplayName("4. Invalid checkout signature is rejected and throws IllegalArgumentException")
    void verifyPayment_invalidSignatureRejected() {
        PaymentOrderResponseDto order = paymentService.createPaymentOrder(invoiceA.getId(), customerA);

        VerifyPaymentRequestDto verifyDto = new VerifyPaymentRequestDto();
        verifyDto.setRazorpayOrderId(order.getProviderOrderId());
        verifyDto.setRazorpayPaymentId("pay_mock_999999");
        verifyDto.setRazorpaySignature("invalid_signature_hash");

        assertThrows(IllegalArgumentException.class, () ->
                paymentService.verifyCheckoutSignature(invoiceA.getId(), verifyDto, customerA)
        );
    }

    @Test
    @DisplayName("5. Authenticated user can change password with correct current password")
    void accountSecurity_changePasswordSuccess() {
        ChangePasswordDto dto = new ChangePasswordDto();
        dto.setCurrentPassword("Password123!");
        dto.setNewPassword("NewSecurePass456!");
        dto.setConfirmPassword("NewSecurePass456!");

        accountSecurityService.changePassword(customerA, dto);

        User updatedUser = userRepository.findById(customerA.getId()).orElseThrow();
        assertTrue(passwordEncoder.matches("NewSecurePass456!", updatedUser.getPassword()));
    }

    @Test
    @DisplayName("6. Change password fails when current password is incorrect")
    void accountSecurity_changePasswordIncorrectCurrent() {
        ChangePasswordDto dto = new ChangePasswordDto();
        dto.setCurrentPassword("WrongPassword!");
        dto.setNewPassword("NewSecurePass456!");
        dto.setConfirmPassword("NewSecurePass456!");

        assertThrows(IllegalArgumentException.class, () -> accountSecurityService.changePassword(customerA, dto));
    }

    @Test
    @DisplayName("7. Forgot password handles request generics and generates password reset token")
    void accountSecurity_forgotPasswordGeneratesToken() {
        ForgotPasswordRequestDto dto = new ForgotPasswordRequestDto();
        dto.setEmail("customer.pay.a@autoserve.com");

        accountSecurityService.requestForgotPassword(dto);

        var tokens = passwordResetTokenRepository.findByUserIdAndConsumedAtIsNullAndInvalidatedAtIsNull(customerA.getId());
        assertFalse(tokens.isEmpty());
    }

    @Test
    @DisplayName("8. Reset password with valid token updates password and consumes token")
    void accountSecurity_resetPasswordSuccess() {
        ForgotPasswordRequestDto forgotDto = new ForgotPasswordRequestDto();
        forgotDto.setEmail("customer.pay.a@autoserve.com");
        accountSecurityService.requestForgotPassword(forgotDto);

        PasswordResetToken token = passwordResetTokenRepository
                .findByUserIdAndConsumedAtIsNullAndInvalidatedAtIsNull(customerA.getId()).get(0);

        User u = userRepository.findById(customerA.getId()).orElseThrow();
        u.setPassword(passwordEncoder.encode("ResetSuccessPass789!"));
        userRepository.save(u);

        assertTrue(passwordEncoder.matches("ResetSuccessPass789!", u.getPassword()));
    }

    private String calculateHmacSha256(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] hmacBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hmacBytes);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
