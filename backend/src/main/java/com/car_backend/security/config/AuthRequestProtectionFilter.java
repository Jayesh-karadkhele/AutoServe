package com.car_backend.security.config;

import java.io.IOException;
import java.time.Instant;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.car_backend.config.AuthProperties;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class AuthRequestProtectionFilter extends OncePerRequestFilter {

    private final AuthProperties authProperties;
    private final ObjectMapper objectMapper;
    private final List<String> allowedOrigins;

    private static class RateWindow {
        final long windowStartSecond;
        final AtomicInteger count;

        RateWindow(long windowStartSecond) {
            this.windowStartSecond = windowStartSecond;
            this.count = new AtomicInteger(1);
        }
    }

    private final Map<String, RateWindow> rateLimitMap = new ConcurrentHashMap<>();
    private static final int MAX_REQUESTS_PER_MINUTE = 20;

    public AuthRequestProtectionFilter(
            AuthProperties authProperties,
            ObjectMapper objectMapper,
            @Value("${cors.allowed-origins:http://localhost:5173}") String rawAllowedOrigins) {
        this.authProperties = authProperties;
        this.objectMapper = objectMapper;
        this.allowedOrigins = Arrays.stream(rawAllowedOrigins.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        boolean isTargetAuthEndpoint = "POST".equalsIgnoreCase(method) &&
                (path.equalsIgnoreCase("/api/auth/register") ||
                 path.equalsIgnoreCase("/api/auth/login") ||
                 path.equalsIgnoreCase("/api/auth/refresh") ||
                 path.equalsIgnoreCase("/api/auth/logout") ||
                 path.equalsIgnoreCase("/api/auth/logout-all") ||
                 path.equalsIgnoreCase("/api/auth/forgot-password") ||
                 path.equalsIgnoreCase("/api/auth/reset-password") ||
                 path.equalsIgnoreCase("/api/users/me/change-password"));

        boolean isRateLimitedEndpoint = "POST".equalsIgnoreCase(method) &&
                (isTargetAuthEndpoint || path.contains("/payment-order") || path.contains("/verify-payment"));

        if (isRateLimitedEndpoint) {
            String clientIp = getClientIp(request);
            String rateKey = clientIp + ":" + path;
            long currentSecond = Instant.now().getEpochSecond();
            long currentMinuteWindow = currentSecond / 60;

            RateWindow window = rateLimitMap.compute(rateKey, (k, v) -> {
                if (v == null || v.windowStartSecond != currentMinuteWindow) {
                    return new RateWindow(currentMinuteWindow);
                } else {
                    v.count.incrementAndGet();
                    return v;
                }
            });

            if (window.count.get() > MAX_REQUESTS_PER_MINUTE) {
                log.warn("Rate limit exceeded for IP {} on path {}", clientIp, path);
                response.setStatus(429);
                response.setHeader("Retry-After", "60");
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);

                Map<String, Object> body = new HashMap<>();
                body.put("timestamp", Instant.now().toString());
                body.put("status", 429);
                body.put("error", "Too Many Requests");
                body.put("message", "Rate limit exceeded. Please try again after 60 seconds.");
                body.put("path", path);

                objectMapper.writeValue(response.getOutputStream(), body);
                return;
            }
        }

        if (isTargetAuthEndpoint) {
            // 1. Verify custom client header
            String clientHeader = request.getHeader(authProperties.getClientHeaderName());
            if (clientHeader == null || !authProperties.getClientHeaderValue().equals(clientHeader.trim())) {
                log.warn("Rejected auth request to {} due to missing or invalid client header", path);
                sendForbiddenError(response, path, "Missing or invalid required client security header");
                return;
            }

            // 2. Verify Origin header if present
            String origin = request.getHeader("Origin");
            if (origin != null && !origin.trim().isEmpty()) {
                String normalizedOrigin = origin.trim();
                boolean isOriginAllowed = allowedOrigins.contains(normalizedOrigin);
                if (!isOriginAllowed) {
                    log.warn("Rejected auth request to {} due to disallowed Origin: {}", path, normalizedOrigin);
                    sendForbiddenError(response, path, "Disallowed Origin");
                    return;
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private void sendForbiddenError(HttpServletResponse response, String path, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", HttpServletResponse.SC_FORBIDDEN);
        body.put("error", "Forbidden");
        body.put("message", message);
        body.put("path", path);

        objectMapper.writeValue(response.getOutputStream(), body);
    }
}
