package com.car_backend.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.car_backend.dto.payment.PaymentAttemptDto;
import com.car_backend.dto.payment.PaymentOrderResponseDto;
import com.car_backend.dto.payment.VerifyPaymentRequestDto;
import com.car_backend.entities.User;
import com.car_backend.exceptions.ResourceNotFoundException;
import com.car_backend.repository.UserRepository;
import com.car_backend.service.PaymentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final UserRepository userRepository;

    @PostMapping("/api/invoices/{invoiceId}/payment-order")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<PaymentOrderResponseDto> createPaymentOrder(@PathVariable("invoiceId") Long invoiceId) {
        User currentUser = getCurrentUser();
        PaymentOrderResponseDto response = paymentService.createPaymentOrder(invoiceId, currentUser);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/invoices/{invoiceId}/verify-payment")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<PaymentAttemptDto> verifyPayment(
            @PathVariable("invoiceId") Long invoiceId,
            @Valid @RequestBody VerifyPaymentRequestDto dto) {
        User currentUser = getCurrentUser();
        PaymentAttemptDto result = paymentService.verifyCheckoutSignature(invoiceId, dto, currentUser);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/api/invoices/{invoiceId}/capture-payment")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<PaymentAttemptDto> capturePayment(
            @PathVariable("invoiceId") Long invoiceId,
            @RequestParam String providerOrderId,
            @RequestParam(required = false) String providerPaymentId) {
        User currentUser = getCurrentUser();
        PaymentAttemptDto result = paymentService.verifyAndCapturePayment(invoiceId, providerOrderId, providerPaymentId, currentUser);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/api/payments/webhooks/razorpay")
    public ResponseEntity<String> handleRazorpayWebhook(
            @RequestBody String rawBody,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signatureHeader) {
        paymentService.processRazorpayWebhook(rawBody, signatureHeader);
        return ResponseEntity.ok("Webhook processed successfully");
    }

    @GetMapping("/api/invoices/{invoiceId}/payment-history")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'MANAGER', 'ADMIN')")
    public ResponseEntity<List<PaymentAttemptDto>> getInvoicePaymentHistory(@PathVariable("invoiceId") Long invoiceId) {
        User currentUser = getCurrentUser();
        List<PaymentAttemptDto> history = paymentService.getPaymentHistoryForInvoice(invoiceId, currentUser);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/api/admin/payments/attempts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<PaymentAttemptDto>> getGlobalPaymentAttempts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<PaymentAttemptDto> attempts = paymentService.getGlobalPaymentAttempts(PageRequest.of(page, size));
        return ResponseEntity.ok(attempts);
    }

    private User getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new ResourceNotFoundException("Authenticated user context not found");
        }
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + auth.getName()));
    }
}
