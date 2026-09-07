package com.car_backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.car_backend.entities.Chat;

public interface ChatRepository extends JpaRepository<Chat, Long> {

    Page<Chat> findByJobCard_IdOrderByCreatedOnDesc(Long jobCardId, Pageable pageable);

    @Modifying
    @Query("UPDATE Chat c SET c.isRead = true WHERE c.jobCard.id = :jobCardId AND c.sender.id <> :userId AND c.isRead = false")
    int markMessagesAsReadForJobCard(@Param("jobCardId") Long jobCardId, @Param("userId") Long userId);
}
