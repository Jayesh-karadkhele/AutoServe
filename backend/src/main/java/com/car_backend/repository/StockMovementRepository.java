package com.car_backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.car_backend.entities.StockMovement;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    Page<StockMovement> findByInventoryIdOrderByCreatedAtDesc(Long inventoryId, Pageable pageable);
    Page<StockMovement> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
