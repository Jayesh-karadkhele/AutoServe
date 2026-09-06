package com.car_backend.service;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.car_backend.dto.payment.PaymentAttemptDto;
import com.car_backend.dto.payment.PaymentOrderResponseDto;
import com.car_backend.dto.payment.VerifyPaymentRequestDto;
import com.car_backend.entities.AuditEventAction;
import com.car_backend.entities.AuditEventResource;
import com.car_backend.entities.Invoice;
import com.car_backend.entities.PaymentAttempt;
import com.car_backend.entities.PaymentAttemptStatus;
import com.car_backend.entities.PaymentStatus;
import com.car_backend.entities.Role;
import com.car_backend.entities.User;
import com.car_backend.entities.WebhookEvent;
import com.car_backend.entities.WebhookProcessingStatus;
import com.car_backend.exceptions.ResourceNotFoundException;
import com.car_backend.repository.InvoiceRepository;
import com.car_backend.repository.PaymentAttemptRepository;
import com.car_backend.repository.WebhookEventRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final InvoiceRepository invoiceRepository;
    private final PaymentAttemptRepository paymentAttemptRepository;
    private final WebhookEventRepository webhookEventRepository;
    private final AdminService adminService;

    @Value("${razorpay.key.id:rzp_test_AutoServeKey123}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret:rzp_secret_AutoServeSecret456}")
    private String razorpayKeySecret;

    @Value("${razorpay.webhook.secret:whsec_AutoServeWebhookSecret789}")
    private String razorpayWebhookSecret;

    @Override
    public PaymentOrderResponseDto createPaymentOrder(Long invoiceId, User customerUser) {
        if (customerUser == null || customerUser.getUserRole() != Role.CUSTOMER) {
            throw new AccessDeniedException("Only customers can create payment orders");
        }

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with ID: " + invoiceId));

        if (!invoice.getJobCard().getAppointment().getVehicleDetails().getCustomer().getId().equals(customerUser.getId())) {
            throw new AccessDeniedException("You do not own this invoice");
        }

        if (invoice.getPaymentStatus() == PaymentStatus.PAID) {
            throw new IllegalStateException("Invoice is already paid");
        }

        BigDecimal totalAmount = invoice.getTotalAmount();
        if (totalAmount == null || totalAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Invoice total amount must be greater than zero");
        }

        long amountPaise = totalAmount.multiply(BigDecimal.valueOf(100)).longValueExact();
        String attemptRef = "PA-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        String providerOrderId = "order_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14);

        PaymentAttempt attempt = new PaymentAttempt();
        attempt.setAttemptRef(attemptRef);
        attempt.setInvoice(invoice);
        attempt.setCustomer(customerUser);
        attempt.setProvider("RAZORPAY");
        attempt.setProviderOrderId(providerOrderId);
        attempt.setAmountPaise(amountPaise);
        attempt.setCurrency("INR");
        attempt.setStatus(PaymentAttemptStatus.CREATED);

        PaymentAttempt saved = paymentAttemptRepository.save(attempt);

        PaymentOrderResponseDto dto = new PaymentOrderResponseDto();
        dto.setAttemptRef(saved.getAttemptRef());
        dto.setProviderOrderId(saved.getProviderOrderId());
        dto.setRazorpayKeyId(getEffectiveRazorpayKeyId());
        dto.setAmountPaise(saved.getAmountPaise());
        dto.setCurrency(saved.getCurrency());
        dto.setInvoiceId(invoice.getId());
        dto.setInvoiceNumber(invoice.getInvoiceNumber());
        dto.setCustomerName(customerUser.getUserName());
        dto.setCustomerEmail(customerUser.getEmail());
        dto.setCustomerPhone(customerUser.getMobile());
        dto.setStatus(saved.getStatus().name());

        return dto;
    }

    @Override
    public PaymentAttemptDto verifyCheckoutSignature(Long invoiceId, VerifyPaymentRequestDto dto, User customerUser) {
        if (customerUser == null || customerUser.getUserRole() != Role.CUSTOMER) {
            throw new AccessDeniedException("Only customers can verify payment signatures");
        }

        PaymentAttempt attempt = paymentAttemptRepository.findByProviderOrderId(dto.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment order not found: " + dto.getRazorpayOrderId()));

        if (!attempt.getInvoice().getId().equals(invoiceId)) {
            throw new IllegalArgumentException("Invoice ID mismatch for payment order");
        }

        if (!attempt.getCustomer().getId().equals(customerUser.getId())) {
            throw new AccessDeniedException("You do not own this payment attempt");
        }

        String dataToSign = dto.getRazorpayOrderId() + "|" + dto.getRazorpayPaymentId();
        String expectedSignature = calculateHmacSha256(dataToSign, getEffectiveRazorpayKeySecret());

        if (!constantTimeEquals(expectedSignature, dto.getRazorpaySignature())) {
            attempt.setStatus(PaymentAttemptStatus.FAILED);
            attempt.setFailureCode("INVALID_SIGNATURE");
            attempt.setFailureDescription("Server signature verification failed");
            paymentAttemptRepository.save(attempt);
            throw new IllegalArgumentException("Invalid Razorpay payment signature");
        }

        attempt.setProviderPaymentId(dto.getRazorpayPaymentId());
        attempt.setStatus(PaymentAttemptStatus.SIGNATURE_VERIFIED);
        attempt.setSignatureVerifiedAt(LocalDateTime.now());
        PaymentAttempt savedAttempt = paymentAttemptRepository.save(attempt);

        return mapToDto(savedAttempt);
    }

    @Override
    public PaymentAttemptDto verifyAndCapturePayment(Long invoiceId, String providerOrderId, String providerPaymentId, User currentUser) {
        if (currentUser == null || (currentUser.getUserRole() != Role.CUSTOMER && currentUser.getUserRole() != Role.ADMIN)) {
            throw new AccessDeniedException("Unauthorized to capture payment");
        }

        PaymentAttempt attempt = paymentAttemptRepository.findByProviderOrderId(providerOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment order not found: " + providerOrderId));

        if (!attempt.getInvoice().getId().equals(invoiceId)) {
            throw new IllegalArgumentException("Invoice ID mismatch for payment order");
        }

        if (currentUser.getUserRole() == Role.CUSTOMER && !attempt.getCustomer().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You do not own this payment attempt");
        }

        if (providerPaymentId != null && !providerPaymentId.isBlank()) {
            attempt.setProviderPaymentId(providerPaymentId);
        }

        attempt.setStatus(PaymentAttemptStatus.PAID);
        attempt.setCapturedAt(LocalDateTime.now());
        PaymentAttempt savedAttempt = paymentAttemptRepository.save(attempt);

        Invoice invoice = attempt.getInvoice();
        invoice.setPaymentStatus(PaymentStatus.PAID);
        invoiceRepository.save(invoice);

        adminService.recordAuditEvent(AuditEventAction.INVOICE_PAID, AuditEventResource.INVOICE,
                String.valueOf(invoice.getId()), "SUCCESS",
                "Payment captured & invoice marked PAID via Razorpay order: " + providerOrderId);

        return mapToDto(savedAttempt);
    }

    @Override
    public void processRazorpayWebhook(String rawBody, String signatureHeader) {
        if (signatureHeader == null || signatureHeader.isBlank()) {
            throw new IllegalArgumentException("Missing X-Razorpay-Signature header");
        }

        String expectedSignature = calculateHmacSha256(rawBody, getEffectiveWebhookSecret());
        if (!constantTimeEquals(expectedSignature, signatureHeader)) {
            log.warn("Razorpay webhook signature verification failed!");
            throw new IllegalArgumentException("Invalid webhook signature");
        }

        String eventId = extractJsonValue(rawBody, "id");
        String eventType = extractJsonValue(rawBody, "event");
        String providerOrderId = extractJsonValue(rawBody, "order_id");
        String providerPaymentId = extractJsonValue(rawBody, "payment_id");

        if (eventId == null || eventId.isBlank()) {
            eventId = "evt_" + MessageDigestUtilHash(rawBody);
        }

        if (webhookEventRepository.existsByProviderEventId(eventId)) {
            log.info("Webhook event {} already processed, skipping duplicate", eventId);
            return;
        }

        WebhookEvent event = new WebhookEvent();
        event.setProviderEventId(eventId);
        event.setEventType(eventType != null ? eventType : "payment.captured");
        event.setPayloadHash(MessageDigestUtilHash(rawBody));
        event.setOrderRef(providerOrderId);
        event.setPaymentRef(providerPaymentId);

        try {
            if (providerOrderId != null && !providerOrderId.isBlank()) {
                paymentAttemptRepository.findByProviderOrderId(providerOrderId).ifPresent(attempt -> {
                    if (attempt.getStatus() != PaymentAttemptStatus.PAID) {
                        attempt.setStatus(PaymentAttemptStatus.PAID);
                        if (providerPaymentId != null && !providerPaymentId.isBlank()) {
                            attempt.setProviderPaymentId(providerPaymentId);
                        }
                        attempt.setCapturedAt(LocalDateTime.now());
                        paymentAttemptRepository.save(attempt);

                        Invoice invoice = attempt.getInvoice();
                        invoice.setPaymentStatus(PaymentStatus.PAID);
                        invoiceRepository.save(invoice);

                        adminService.recordAuditEvent(AuditEventAction.INVOICE_PAID, AuditEventResource.INVOICE,
                                String.valueOf(invoice.getId()), "SUCCESS",
                                "Payment captured via Razorpay Webhook event: " + eventType);
                    }
                });
            }
            event.setProcessingStatus(WebhookProcessingStatus.PROCESSED);
        } catch (Exception e) {
            log.error("Error processing webhook payload: ", e);
            event.setProcessingStatus(WebhookProcessingStatus.FAILED);
            event.setSanitizedError(e.getMessage());
        }

        webhookEventRepository.save(event);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentAttemptDto> getPaymentHistoryForInvoice(Long invoiceId, User currentUser) {
        if (currentUser == null || currentUser.getUserRole() == Role.MECHANIC) {
            throw new AccessDeniedException("Mechanics have no access to payment history");
        }

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with ID: " + invoiceId));

        if (currentUser.getUserRole() == Role.CUSTOMER) {
            if (!invoice.getJobCard().getAppointment().getVehicleDetails().getCustomer().getId().equals(currentUser.getId())) {
                throw new AccessDeniedException("You do not own this invoice");
            }
        }

        return paymentAttemptRepository.findByInvoiceIdOrderByCreatedAtDesc(invoiceId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PaymentAttemptDto> getGlobalPaymentAttempts(Pageable pageable) {
        return paymentAttemptRepository.findAllByOrderByCreatedAtDesc(pageable).map(this::mapToDto);
    }

    private PaymentAttemptDto mapToDto(PaymentAttempt pa) {
        PaymentAttemptDto dto = new PaymentAttemptDto();
        dto.setId(pa.getId());
        dto.setAttemptRef(pa.getAttemptRef());
        dto.setInvoiceId(pa.getInvoice().getId());
        dto.setProvider(pa.getProvider());
        dto.setProviderOrderId(pa.getProviderOrderId());
        dto.setProviderPaymentId(pa.getProviderPaymentId());
        dto.setAmountPaise(pa.getAmountPaise());
        dto.setCurrency(pa.getCurrency());
        dto.setStatus(pa.getStatus().name());
        dto.setCreatedAt(pa.getCreatedAt());
        dto.setSignatureVerifiedAt(pa.getSignatureVerifiedAt());
        dto.setCapturedAt(pa.getCapturedAt());
        dto.setFailureCode(pa.getFailureCode());
        dto.setFailureDescription(pa.getFailureDescription());
        return dto;
    }

    private String getEffectiveRazorpayKeyId() {
        return (razorpayKeyId != null && !razorpayKeyId.isBlank()) ? razorpayKeyId : "rzp_test_AutoServeKey123";
    }

    private String getEffectiveRazorpayKeySecret() {
        return (razorpayKeySecret != null && !razorpayKeySecret.isBlank()) ? razorpayKeySecret : "rzp_secret_AutoServeSecret456";
    }

    private String getEffectiveWebhookSecret() {
        return (razorpayWebhookSecret != null && !razorpayWebhookSecret.isBlank()) ? razorpayWebhookSecret : "whsec_AutoServeWebhookSecret789";
    }

    private String calculateHmacSha256(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] hmacBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hmacBytes);
        } catch (Exception e) {
            throw new RuntimeException("Failed to calculate HMAC SHA256", e);
        }
    }

    private boolean constantTimeEquals(String a, String b) {
        if (a == null || b == null) return false;
        byte[] aBytes = a.getBytes(StandardCharsets.UTF_8);
        byte[] bBytes = b.getBytes(StandardCharsets.UTF_8);
        return MessageDigest.isEqual(aBytes, bBytes);
    }

    private String MessageDigestUtilHash(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash).substring(0, 32);
        } catch (Exception e) {
            return String.valueOf(input.hashCode());
        }
    }

    private String extractJsonValue(String json, String key) {
        if (json == null) return null;
        int idx = json.indexOf("\"" + key + "\"");
        if (idx == -1) return null;
        int colonIdx = json.indexOf(":", idx);
        if (colonIdx == -1) return null;
        int quoteStart = json.indexOf("\"", colonIdx);
        if (quoteStart == -1) return null;
        int quoteEnd = json.indexOf("\"", quoteStart + 1);
        if (quoteEnd == -1) return null;
        return json.substring(quoteStart + 1, quoteEnd);
    }
}
