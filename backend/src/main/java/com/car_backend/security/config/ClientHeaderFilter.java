package com.car_backend.security.config;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.car_backend.config.AuthProperties;
import com.car_backend.dto.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class ClientHeaderFilter extends OncePerRequestFilter {

    private final AuthProperties authProperties;
    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        // Enforce custom security header validation on /api/auth/* state-changing POST endpoints
        if (path.startsWith("/api/auth/") && "POST".equalsIgnoreCase(method)) {
            String clientHeader = request.getHeader(authProperties.getClientHeaderName());

            if (clientHeader == null || !authProperties.getClientHeaderValue().equals(clientHeader.trim())) {
                log.warn("Rejected auth request to {} due to missing or invalid client header: {}", path, clientHeader);
                response.setStatus(HttpStatus.FORBIDDEN.value());
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                
                java.util.Map<String, Object> body = new java.util.HashMap<>();
                body.put("timestamp", java.time.Instant.now().toString());
                body.put("status", HttpServletResponse.SC_FORBIDDEN);
                body.put("error", "Forbidden");
                body.put("message", "Missing or invalid required client security header");
                body.put("path", path);

                objectMapper.writeValue(response.getOutputStream(), body);
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
