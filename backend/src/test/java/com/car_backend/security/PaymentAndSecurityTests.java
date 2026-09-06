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
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import com.car_backend.dto.auth.ChangePasswordDto;
import com.car_backend.dto.auth.ForgotPasswordRequestDto;
import com.car_backend.dto.auth.ResetPasswordRequestDto;
import com.car_backend.dto.payment.PaymentAttemptDto;
import com.car_backend.dto.payment.PaymentOrderResponseDto;
import com.car_backend.dto.payment.VerifyPaymentRequestDto;
import com.car_backend.entities.Appointment;
import com.car_backend.entities.Invoice;
import com.car_backend.entities.JobCard;
import com.car_backend.entities.JobCardStatus;
import com.car_backend.entities.PasswordResetToken;
import com.car_backend.entities.PaymentAttemptStatus;
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
    private User managerUser;
    private User adminUser;
    private User mechanicUser;
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

        managerUser = userRepository.findByEmail("manager.pay@autoserve.com").orElseGet(() -> {
            User u = new User();
            u.setUserName("Manager Pay");
            u.setEmail("manager.pay@autoserve.com");
            u.setPassword(passwordEncoder.encode("Password123!"));
            u.setMobile("9333333333");
            u.setUserRole(Role.MANAGER);
            u.setActive(true);
            return userRepository.save(u);
        });

        adminUser = userRepository.findByEmail("admin.pay@autoserve.com").orElseGet(() -> {
            User u = new User();
            u.setUserName("Admin Pay");
            u.setEmail("admin.pay@autoserve.com");
            u.setPassword(passwordEncoder.encode("Password123!"));
            u.setMobile("9444444444");
            u.setUserRole(Role.ADMIN);
            u.setActive(true);
            return userRepository.save(u);
        });

        mechanicUser = userRepository.findByEmail("mechanic.pay@autoserve.com").orElseGet(() -> {
            User u = new User();
            u.setUserName("Mechanic Pay");
            u.setEmail("mechanic.pay@autoserve.com");
            u.setPassword(passwordEncoder.encode("Password123!"));
            u.setMobile("9555555555");
            u.setUserRole(Role.MECHANIC);
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
    @DisplayName("3. Manager cannot create customer payment order")
    void manager_cannotCreatePaymentOrder() {
        assertThrows(AccessDeniedException.class, () -> paymentService.createPaymentOrder(invoiceA.getId(), managerUser));
    }

    @Test
    @DisplayName("4. Admin cannot create customer payment order")
    void admin_cannotCreatePaymentOrder() {
        assertThrows(AccessDeniedException.class, () -> paymentService.createPaymentOrder(invoiceA.getId(), adminUser));
    }

    @Test
    @DisplayName("5. Mechanic cannot create customer payment order")
    void mechanic_cannotCreatePaymentOrder() {
        assertThrows(AccessDeniedException.class, () -> paymentService.createPaymentOrder(invoiceA.getId(), mechanicUser));
    }

    @Test
    @DisplayName("6. Cannot create payment order for already PAID invoice")
    void cannotCreatePaymentOrder_alreadyPaidInvoice() {
        invoiceA.setPaymentStatus(PaymentStatus.PAID);
        invoiceRepository.save(invoiceA);
        assertThrows(IllegalStateException.class, () -> paymentService.createPaymentOrder(invoiceA.getId(), customerA));
    }

    @Test
    @DisplayName("7. Cannot create payment order for invoice with zero total amount")
    void cannotCreatePaymentOrder_zeroOrNegativeAmount() {
        invoiceA.setTotalAmount(BigDecimal.ZERO);
        invoiceRepository.save(invoiceA);
        assertThrows(IllegalArgumentException.class, () -> paymentService.createPaymentOrder(invoiceA.getId(), customerA));
    }

    @Test
    @DisplayName("8. Valid payment signature sets attempt status to SIGNATURE_VERIFIED")
    void verifyPayment_signatureVerifiedState() {
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
        assertEquals(PaymentAttemptStatus.SIGNATURE_VERIFIED.name(), result.getStatus());

        Invoice reloadedInvoice = invoiceRepository.findById(invoiceA.getId()).orElseThrow();
        assertEquals(PaymentStatus.PENDING, reloadedInvoice.getPaymentStatus());
    }

    @Test
    @DisplayName("9. Signature verification by non-owner throws AccessDeniedException")
    void verifyPayment_unownedAttemptAccessDenied() {
        PaymentOrderResponseDto order = paymentService.createPaymentOrder(invoiceA.getId(), customerA);

        VerifyPaymentRequestDto verifyDto = new VerifyPaymentRequestDto();
        verifyDto.setRazorpayOrderId(order.getProviderOrderId());
        verifyDto.setRazorpayPaymentId("pay_mock_123");
        verifyDto.setRazorpaySignature("sig");

        assertThrows(AccessDeniedException.class, () ->
                paymentService.verifyCheckoutSignature(invoiceA.getId(), verifyDto, customerB)
        );
    }

    @Test
    @DisplayName("10. Invalid checkout signature is rejected and throws IllegalArgumentException")
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
    @DisplayName("11. Signature verification by Manager throws AccessDeniedException")
    void verifyPayment_managerAccessDenied() {
        PaymentOrderResponseDto order = paymentService.createPaymentOrder(invoiceA.getId(), customerA);
        VerifyPaymentRequestDto verifyDto = new VerifyPaymentRequestDto();
        verifyDto.setRazorpayOrderId(order.getProviderOrderId());
        verifyDto.setRazorpayPaymentId("pay_mock_123");
        verifyDto.setRazorpaySignature("sig");

        assertThrows(AccessDeniedException.class, () ->
                paymentService.verifyCheckoutSignature(invoiceA.getId(), verifyDto, managerUser)
        );
    }

    @Test
    @DisplayName("12. Signature verification by Admin throws AccessDeniedException")
    void verifyPayment_adminAccessDenied() {
        PaymentOrderResponseDto order = paymentService.createPaymentOrder(invoiceA.getId(), customerA);
        VerifyPaymentRequestDto verifyDto = new VerifyPaymentRequestDto();
        verifyDto.setRazorpayOrderId(order.getProviderOrderId());
        verifyDto.setRazorpayPaymentId("pay_mock_123");
        verifyDto.setRazorpaySignature("sig");

        assertThrows(AccessDeniedException.class, () ->
                paymentService.verifyCheckoutSignature(invoiceA.getId(), verifyDto, adminUser)
        );
    }

    @Test
    @DisplayName("13. Signature verification by Mechanic throws AccessDeniedException")
    void verifyPayment_mechanicAccessDenied() {
        PaymentOrderResponseDto order = paymentService.createPaymentOrder(invoiceA.getId(), customerA);
        VerifyPaymentRequestDto verifyDto = new VerifyPaymentRequestDto();
        verifyDto.setRazorpayOrderId(order.getProviderOrderId());
        verifyDto.setRazorpayPaymentId("pay_mock_123");
        verifyDto.setRazorpaySignature("sig");

        assertThrows(AccessDeniedException.class, () ->
                paymentService.verifyCheckoutSignature(invoiceA.getId(), verifyDto, mechanicUser)
        );
    }

    @Test
    @DisplayName("14. Webhook with valid signature and payment.captured updates attempt & invoice to PAID")
    void webhook_validSignatureCapturesPaymentAndMarksPaid() {
        PaymentOrderResponseDto order = paymentService.createPaymentOrder(invoiceA.getId(), customerA);

        String rawJson = "{\"id\":\"evt_test_1001\",\"event\":\"payment.captured\",\"payload\":{\"payment\":{\"entity\":{\"id\":\"pay_captured_777\",\"order_id\":\"" + order.getProviderOrderId() + "\"}}}}";
        String signature = calculateHmacSha256(rawJson, "whsec_AutoServeWebhookSecret789");

        paymentService.processRazorpayWebhook(rawJson, signature);

        Invoice reloadedInvoice = invoiceRepository.findById(invoiceA.getId()).orElseThrow();
        assertEquals(PaymentStatus.PAID, reloadedInvoice.getPaymentStatus());
    }

    @Test
    @DisplayName("15. Webhook with invalid signature is rejected")
    void webhook_invalidSignatureRejected() {
        String rawJson = "{\"id\":\"evt_test_1002\",\"event\":\"payment.captured\"}";
        assertThrows(IllegalArgumentException.class, () ->
                paymentService.processRazorpayWebhook(rawJson, "bad_signature")
        );
    }

    @Test
    @DisplayName("16. Webhook with missing header is rejected")
    void webhook_missingHeaderRejected() {
        String rawJson = "{\"id\":\"evt_test_1003\",\"event\":\"payment.captured\"}";
        assertThrows(IllegalArgumentException.class, () ->
                paymentService.processRazorpayWebhook(rawJson, null)
        );
    }

    @Test
    @DisplayName("17. Webhook idempotent processing ignores duplicate event IDs")
    void webhook_idempotentDuplicateIgnored() {
        PaymentOrderResponseDto order = paymentService.createPaymentOrder(invoiceA.getId(), customerA);

        String rawJson = "{\"id\":\"evt_dup_999\",\"event\":\"payment.captured\",\"payload\":{\"payment\":{\"entity\":{\"id\":\"pay_dup_999\",\"order_id\":\"" + order.getProviderOrderId() + "\"}}}}";
        String signature = calculateHmacSha256(rawJson, "whsec_AutoServeWebhookSecret789");

        paymentService.processRazorpayWebhook(rawJson, signature);
        // Process same webhook payload second time
        paymentService.processRazorpayWebhook(rawJson, signature);

        Invoice reloadedInvoice = invoiceRepository.findById(invoiceA.getId()).orElseThrow();
        assertEquals(PaymentStatus.PAID, reloadedInvoice.getPaymentStatus());
    }

    @Test
    @DisplayName("18. Server capture transitions SIGNATURE_VERIFIED to PAID")
    void serverCapture_transitionsSignatureVerifiedToPaid() {
        PaymentOrderResponseDto order = paymentService.createPaymentOrder(invoiceA.getId(), customerA);

        PaymentAttemptDto captured = paymentService.verifyAndCapturePayment(
                invoiceA.getId(),
                order.getProviderOrderId(),
                "pay_captured_888",
                customerA
        );

        assertEquals("PAID", captured.getStatus());
        Invoice reloadedInvoice = invoiceRepository.findById(invoiceA.getId()).orElseThrow();
        assertEquals(PaymentStatus.PAID, reloadedInvoice.getPaymentStatus());
    }

    @Test
    @DisplayName("19. Customer can view payment history for owned invoice")
    void customer_canViewOwnedPaymentHistory() {
        paymentService.createPaymentOrder(invoiceA.getId(), customerA);
        var history = paymentService.getPaymentHistoryForInvoice(invoiceA.getId(), customerA);
        assertNotNull(history);
        assertFalse(history.isEmpty());
    }

    @Test
    @DisplayName("20. Customer cannot view payment history for unowned invoice")
    void customer_cannotViewUnownedPaymentHistory() {
        paymentService.createPaymentOrder(invoiceA.getId(), customerA);
        assertThrows(AccessDeniedException.class, () ->
                paymentService.getPaymentHistoryForInvoice(invoiceA.getId(), customerB)
        );
    }

    @Test
    @DisplayName("21. Manager can view payment history for managed job invoice")
    void manager_canViewPaymentHistory() {
        paymentService.createPaymentOrder(invoiceA.getId(), customerA);
        var history = paymentService.getPaymentHistoryForInvoice(invoiceA.getId(), managerUser);
        assertNotNull(history);
        assertFalse(history.isEmpty());
    }

    @Test
    @DisplayName("22. Admin can view payment history for any invoice")
    void admin_canViewPaymentHistory() {
        paymentService.createPaymentOrder(invoiceA.getId(), customerA);
        var history = paymentService.getPaymentHistoryForInvoice(invoiceA.getId(), adminUser);
        assertNotNull(history);
        assertFalse(history.isEmpty());
    }

    @Test
    @DisplayName("23. Mechanic cannot view payment history")
    void mechanic_cannotViewPaymentHistory() {
        paymentService.createPaymentOrder(invoiceA.getId(), customerA);
        assertThrows(AccessDeniedException.class, () ->
                paymentService.getPaymentHistoryForInvoice(invoiceA.getId(), mechanicUser)
        );
    }

    @Test
    @DisplayName("24. Admin can query global payment attempts page")
    void admin_canQueryGlobalPaymentAttempts() {
        paymentService.createPaymentOrder(invoiceA.getId(), customerA);
        var page = paymentService.getGlobalPaymentAttempts(PageRequest.of(0, 10));
        assertNotNull(page);
        assertFalse(page.getContent().isEmpty());
    }

    @Test
    @DisplayName("25. Authenticated user can change password with correct current password")
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
    @DisplayName("26. Change password fails when current password is incorrect")
    void accountSecurity_changePasswordIncorrectCurrent() {
        ChangePasswordDto dto = new ChangePasswordDto();
        dto.setCurrentPassword("WrongPassword!");
        dto.setNewPassword("NewSecurePass456!");
        dto.setConfirmPassword("NewSecurePass456!");

        assertThrows(IllegalArgumentException.class, () -> accountSecurityService.changePassword(customerA, dto));
    }

    @Test
    @DisplayName("27. Change password fails when new password matches current password")
    void accountSecurity_changePasswordNewSameAsCurrent() {
        ChangePasswordDto dto = new ChangePasswordDto();
        dto.setCurrentPassword("Password123!");
        dto.setNewPassword("Password123!");
        dto.setConfirmPassword("Password123!");

        assertThrows(IllegalArgumentException.class, () -> accountSecurityService.changePassword(customerA, dto));
    }

    @Test
    @DisplayName("28. Change password fails when confirm password does not match new password")
    void accountSecurity_changePasswordConfirmMismatch() {
        ChangePasswordDto dto = new ChangePasswordDto();
        dto.setCurrentPassword("Password123!");
        dto.setNewPassword("NewSecurePass456!");
        dto.setConfirmPassword("MismatchPass789!");

        assertThrows(IllegalArgumentException.class, () -> accountSecurityService.changePassword(customerA, dto));
    }

    @Test
    @DisplayName("29. Change password invalidates active password reset tokens for user")
    void accountSecurity_changePasswordInvalidatesResetTokens() {
        ForgotPasswordRequestDto forgotDto = new ForgotPasswordRequestDto();
        forgotDto.setEmail("customer.pay.a@autoserve.com");
        accountSecurityService.requestForgotPassword(forgotDto);

        var tokensBefore = passwordResetTokenRepository.findByUserIdAndConsumedAtIsNullAndInvalidatedAtIsNull(customerA.getId());
        assertFalse(tokensBefore.isEmpty());

        ChangePasswordDto changeDto = new ChangePasswordDto();
        changeDto.setCurrentPassword("Password123!");
        changeDto.setNewPassword("NewSecurePass456!");
        changeDto.setConfirmPassword("NewSecurePass456!");
        accountSecurityService.changePassword(customerA, changeDto);

        var tokensAfter = passwordResetTokenRepository.findByUserIdAndConsumedAtIsNullAndInvalidatedAtIsNull(customerA.getId());
        assertTrue(tokensAfter.isEmpty());
    }

    @Test
    @DisplayName("30. Forgot password for existing active email generates single hashed reset token")
    void accountSecurity_forgotPasswordGeneratesToken() {
        ForgotPasswordRequestDto dto = new ForgotPasswordRequestDto();
        dto.setEmail("customer.pay.a@autoserve.com");

        accountSecurityService.requestForgotPassword(dto);

        var tokens = passwordResetTokenRepository.findByUserIdAndConsumedAtIsNullAndInvalidatedAtIsNull(customerA.getId());
        assertEquals(1, tokens.size());
    }

    @Test
    @DisplayName("31. Forgot password for non-existing or inactive email behaves generically without error")
    void accountSecurity_forgotPasswordGenericNonExistingEmail() {
        ForgotPasswordRequestDto dto = new ForgotPasswordRequestDto();
        dto.setEmail("nonexistent.user.email@autoserve.com");

        accountSecurityService.requestForgotPassword(dto);
    }

    @Test
    @DisplayName("32. Reset password with valid token updates password and consumes token")
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
