package com.car_backend.security.config;

import java.io.IOException;
import java.time.Instant;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

        // Target endpoints: POST /api/auth/register, POST /api/auth/login, POST /api/auth/refresh, POST /api/auth/logout, POST /api/auth/logout-all
        boolean isTargetAuthEndpoint = "POST".equalsIgnoreCase(method) &&
                (path.equalsIgnoreCase("/api/auth/register") ||
                 path.equalsIgnoreCase("/api/auth/login") ||
                 path.equalsIgnoreCase("/api/auth/refresh") ||
                 path.equalsIgnoreCase("/api/auth/logout") ||
                 path.equalsIgnoreCase("/api/auth/logout-all"));

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
            // Missing-Origin Policy: Direct same-origin requests or trusted non-browser clients without Origin header
            // are permitted as long as valid X-AutoServe-Client header is present.
        }

        filterChain.doFilter(request, response);
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
