package com.car_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.car_backend.entities.WebhookEvent;

@Repository
public interface WebhookEventRepository extends JpaRepository<WebhookEvent, Long> {

    boolean existsByProviderEventId(String providerEventId);

    Optional<WebhookEvent> findByProviderEventId(String providerEventId);
}
