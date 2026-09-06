package com.car_backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.car_backend.entities.AdminAuditEvent;
import com.car_backend.entities.AuditEventAction;
import com.car_backend.entities.AuditEventResource;

@Repository
public interface AdminAuditEventRepository extends JpaRepository<AdminAuditEvent, Long> {

    @Query("SELECT a FROM AdminAuditEvent a WHERE " +
           "(:actorId IS NULL OR a.actor.id = :actorId) AND " +
           "(:actionType IS NULL OR a.actionType = :actionType) AND " +
           "(:resourceType IS NULL OR a.resourceType = :resourceType) " +
           "ORDER BY a.createdAt DESC")
    Page<AdminAuditEvent> filterAuditEvents(
            @Param("actorId") Long actorId,
            @Param("actionType") AuditEventAction actionType,
            @Param("resourceType") AuditEventResource resourceType,
            Pageable pageable
    );
}
