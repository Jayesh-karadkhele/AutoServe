package com.car_backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.car_backend.entities.RoadsideAssistance;
import com.car_backend.entities.RsaStatus;

public interface RoadsideAssistanceRepository extends JpaRepository<RoadsideAssistance, Long> {

    Page<RoadsideAssistance> findByCustomer_IdOrderByCreatedOnDesc(Long customerId, Pageable pageable);

    List<RoadsideAssistance> findByCustomer_IdOrderByCreatedOnDesc(Long customerId);

    Page<RoadsideAssistance> findByStatusOrderByCreatedOnDesc(RsaStatus status, Pageable pageable);

    Page<RoadsideAssistance> findAllByOrderByCreatedOnDesc(Pageable pageable);

    long countByStatus(RsaStatus status);
}
