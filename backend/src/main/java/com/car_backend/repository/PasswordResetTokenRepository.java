package com.car_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.car_backend.entities.PasswordResetToken;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByTokenHash(String tokenHash);

    List<PasswordResetToken> findByUserIdAndConsumedAtIsNullAndInvalidatedAtIsNull(Long userId);

    @Modifying
    @Query("UPDATE PasswordResetToken p SET p.invalidatedAt = CURRENT_TIMESTAMP WHERE p.user.id = :userId AND p.consumedAt IS NULL AND p.invalidatedAt IS NULL")
    void invalidateActiveTokensForUser(Long userId);
}
