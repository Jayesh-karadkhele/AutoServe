package com.car_backend.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.car_backend.dto.invoice.CreatePaymentOrderResponseDto;
import com.car_backend.dto.invoice.InvoiceResponseDto;
import com.car_backend.dto.invoice.PaymentVerificationResponseDto;
import com.car_backend.dto.invoice.VerifyPaymentRequestDto;
import com.car_backend.entities.PaymentStatus;
import com.car_backend.security.service.CurrentUserService;
import com.car_backend.service.InvoiceService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.core.parameters.P;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
@Slf4j
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final CurrentUserService currentUserService;

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/me")
    public ResponseEntity<List<InvoiceResponseDto>> getMyInvoices() {
        Long currentUserId = currentUserService.getUserId();
        return ResponseEntity.ok(invoiceService.getInvoicesByCustomerId(currentUserId));
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/manager/me")
    public ResponseEntity<List<InvoiceResponseDto>> getManagerInvoices() {
        Long managerId = currentUserService.getUserId();
        return ResponseEntity.ok(invoiceService.getInvoicesByManagerId(managerId));
    }

    // ------------------Invoice Generation-------------------

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.managesJobCard(#jobCardId)")
    @PostMapping("/generate/job_card/{jobCardId}")
    public ResponseEntity<InvoiceResponseDto> generateInvoice(@P("jobCardId") @PathVariable("jobCardId") Long jobCardId) {
        log.info("Generating invoice for job card: {}", jobCardId);
        return ResponseEntity.ok(invoiceService.generateInvoice(jobCardId));
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.canAccessInvoice(#id)")
    @GetMapping("/{id}")
    public ResponseEntity<InvoiceResponseDto> getInvoiceById(@P("id") @PathVariable("id") Long id) {
        return ResponseEntity.ok(invoiceService.getInvoice(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/number/{invoiceNumber}")
    public ResponseEntity<InvoiceResponseDto> getInvoiceByNumber(@P("invoiceNumber") @PathVariable("invoiceNumber") String invoiceNumber) {
        return ResponseEntity.ok(invoiceService.getInvoiceByNumber(invoiceNumber));
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.canAccessJobCard(#jobCardId)")
    @GetMapping("/job_card/{jobCardId}")
    public ResponseEntity<InvoiceResponseDto> getInvoiceByJobCard(@P("jobCardId") @PathVariable("jobCardId") Long jobCardId) {
        return ResponseEntity.ok(invoiceService.getInvoiceByJobCard(jobCardId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<InvoiceResponseDto>> getAllInvoices() {
        return ResponseEntity.ok(invoiceService.getAllInvoices());
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.isSelf(#customerId)")
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<InvoiceResponseDto>> getInvoicesByCustomerId(@P("customerId") @PathVariable("customerId") Long customerId) {
        return ResponseEntity.ok(invoiceService.getInvoicesByCustomerId(customerId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/status/{status}")
    public ResponseEntity<List<InvoiceResponseDto>> getInvoiceByStatus(@P("status") @PathVariable("status") PaymentStatus status) {
        return ResponseEntity.ok(invoiceService.getInvoicesByStatus(status));
    }

    // --------------Payment Operations------------------------

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.ownsInvoice(#id)")
    @PostMapping("/{id}/create_payment_order")
    public ResponseEntity<CreatePaymentOrderResponseDto> createPaymentOrder(@P("id") @PathVariable("id") Long id) {
        return ResponseEntity.ok(invoiceService.createPaymentDto(id));
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.ownsInvoice(#id)")
    @PostMapping("/{id}/verify_payment")
    public ResponseEntity<PaymentVerificationResponseDto> verifyPayment(@P("id") @PathVariable("id") Long id, @Valid @RequestBody VerifyPaymentRequestDto request) {
        PaymentVerificationResponseDto response = invoiceService.verifyPayment(id, request);
        if (Boolean.TRUE.equals(response.getVerified())) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/{id}/simulate_payment")
    public ResponseEntity<?> simulatePayment(@P("id") @PathVariable("id") Long id) {
        throw new com.car_backend.exceptions.ResourceNotFoundException("Payment simulation endpoint is unavailable");
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.canAccessInvoice(#id)")
    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadInvoice(@P("id") @PathVariable("id") Long id) {
        byte[] pdf = invoiceService.getInvoicePdf(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "invoice_" + id + ".pdf");

        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }

    // -------------------Statistics-----------------------

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stats/total_count")
    public ResponseEntity<Long> getTotalInvoiceCount() {
        return ResponseEntity.ok(invoiceService.getTotalInvoicesCount());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stats/pending_count")
    public ResponseEntity<Long> getPendingPaymentCount() {
        return ResponseEntity.ok(invoiceService.getPendingPaymentCount());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stats/paid_count")
    public ResponseEntity<Long> getPaidInvoiceCount() {
        return ResponseEntity.ok(invoiceService.getPaidInvoicesCount());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stats/total_revenue")
    public ResponseEntity<BigDecimal> getTotalRevenue() {
        return ResponseEntity.ok(invoiceService.getTotalRevenue());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stats/pending_revenue")
    public ResponseEntity<BigDecimal> getPendingRevenue() {
        return ResponseEntity.ok(invoiceService.getPendingRevenue());
    }
}
