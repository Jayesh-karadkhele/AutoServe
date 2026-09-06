package com.car_backend.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.car_backend.dto.payment.PaymentAttemptDto;
import com.car_backend.dto.payment.PaymentOrderResponseDto;
import com.car_backend.dto.payment.VerifyPaymentRequestDto;
import com.car_backend.entities.User;

public interface PaymentService {

    PaymentOrderResponseDto createPaymentOrder(Long invoiceId, User customerUser);

    PaymentAttemptDto verifyCheckoutSignature(Long invoiceId, VerifyPaymentRequestDto dto, User customerUser);

    PaymentAttemptDto verifyAndCapturePayment(Long invoiceId, String providerOrderId, String providerPaymentId, User currentUser);

    void processRazorpayWebhook(String rawBody, String signatureHeader);

    List<PaymentAttemptDto> getPaymentHistoryForInvoice(Long invoiceId, User currentUser);

    Page<PaymentAttemptDto> getGlobalPaymentAttempts(Pageable pageable);
}
