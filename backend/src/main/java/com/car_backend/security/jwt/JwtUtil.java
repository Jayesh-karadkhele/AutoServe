package com.car_backend.security.jwt;

import java.security.Key;
import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.car_backend.entities.Role;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration:900000}") // Default 15 minutes
    private long jwtExpirationMs;

    @jakarta.annotation.PostConstruct
    public void validateSecretKeyLength() {
        if (jwtSecret == null || jwtSecret.trim().isEmpty()) {
            throw new IllegalStateException("JWT secret configuration error: JWT_SECRET environment variable is missing or empty.");
        }
        if (jwtSecret.getBytes(java.nio.charset.StandardCharsets.UTF_8).length < 64) {
            throw new IllegalStateException("JWT secret configuration error: Key length must be at least 64 bytes (512 bits) for HS512 signature algorithm.");
        }
    }

    /**
     * Generate JWT token with session ID (sid) and jti
     */
    public String generateToken(Long userId, String email, Role role, String sessionId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        var builder = Jwts.builder()
                .setId(UUID.randomUUID().toString()) // jti
                .setSubject(String.valueOf(userId)) // sub = userId
                .claim("email", email)
                .claim("role", role != null ? role.name() : null)
                .setIssuedAt(now)
                .setExpiration(expiryDate);

        if (sessionId != null) {
            builder.claim("sid", sessionId);
        }

        return builder.signWith(getSigningKey(), SignatureAlgorithm.HS512).compact();
    }

    /**
     * Backwards-compatible token generation without explicit sessionId
     */
    public String generateToken(Long userId, String email, Role role) {
        return generateToken(userId, email, role, null);
    }

    public Long getUserIdFromToken(String token) {
        Claims claims = getClaims(token);
        return Long.parseLong(claims.getSubject());
    }

    public String getEmailFromToken(String token) {
        Claims claims = getClaims(token);
        return claims.get("email", String.class);
    }

    public String getRoleFromToken(String token) {
        Claims claims = getClaims(token);
        return String.valueOf(claims.get("role"));
    }

    public String getSessionIdFromToken(String token) {
        Claims claims = getClaims(token);
        return claims.get("sid", String.class);
    }

    public String getJtiFromToken(String token) {
        Claims claims = getClaims(token);
        return claims.getId();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}