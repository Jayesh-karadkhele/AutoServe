package com.car_backend.entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "auth_sessions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthSession {

    @Id
    @Column(name = "session_id", length = 36, nullable = false)
    private String sessionId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    private User user;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "last_used_at", nullable = false)
    private LocalDateTime lastUsedAt;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "revoked_at")
    private LocalDateTime revokedAt;

    @Column(name = "revocation_reason", length = 255)
    private String revocationReason;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @ToString.Exclude
    private List<RefreshToken> refreshTokens = new ArrayList<>();

    public boolean isActive() {
        return revokedAt == null && LocalDateTime.now().isBefore(expiresAt);
    }

    public boolean isRevoked() {
        return revokedAt != null;
    }

    public void revoke(String reason) {
        this.revokedAt = LocalDateTime.now();
        this.revocationReason = reason;
    }
}
