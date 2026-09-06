package com.car_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.car_backend.entities.PaymentAttempt;
import com.car_backend.entities.PaymentAttemptStatus;

@Repository
public interface PaymentAttemptRepository extends JpaRepository<PaymentAttempt, Long> {

    Optional<PaymentAttempt> findByAttemptRef(String attemptRef);

    Optional<PaymentAttempt> findByProviderOrderId(String providerOrderId);

    List<PaymentAttempt> findByInvoiceIdOrderByCreatedAtDesc(Long invoiceId);

    List<PaymentAttempt> findByInvoiceIdAndStatus(Long invoiceId, PaymentAttemptStatus status);

    Page<PaymentAttempt> findAllByOrderByCreatedAtDesc(Pageable pageable);

    boolean existsByProviderOrderId(String providerOrderId);
}
