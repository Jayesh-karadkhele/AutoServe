package com.car_backend.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.car_backend.entities.AuthSession;

@Repository
public interface AuthSessionRepository extends JpaRepository<AuthSession, String> {

    Optional<AuthSession> findBySessionId(String sessionId);

    @Query("SELECT s FROM AuthSession s WHERE s.sessionId = :sessionId AND s.revokedAt IS NULL AND s.expiresAt > :now")
    Optional<AuthSession> findActiveSessionById(@Param("sessionId") String sessionId, @Param("now") LocalDateTime now);

    @Query("SELECT s FROM AuthSession s WHERE s.user.id = :userId AND s.revokedAt IS NULL AND s.expiresAt > :now")
    List<AuthSession> findAllActiveByUserId(@Param("userId") Long userId, @Param("now") LocalDateTime now);

    @Modifying
    @Query("UPDATE AuthSession s SET s.revokedAt = :now, s.revocationReason = :reason WHERE s.user.id = :userId AND s.revokedAt IS NULL")
    int revokeAllActiveSessionsForUser(@Param("userId") Long userId, @Param("now") LocalDateTime now, @Param("reason") String reason);

    @Modifying
    @Query("DELETE FROM AuthSession s WHERE s.expiresAt < :cutoff AND s.revokedAt IS NOT NULL")
    int deleteExpiredAndRevokedSessions(@Param("cutoff") LocalDateTime cutoff);
}
