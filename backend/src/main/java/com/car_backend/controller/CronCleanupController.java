package com.car_backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.car_backend.service.auth.AuthTokenCleanupService;
import com.car_backend.service.auth.AuthTokenCleanupService.CleanupResult;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/cron")
@RequiredArgsConstructor
@Slf4j
public class CronCleanupController {

    private final AuthTokenCleanupService cleanupService;

    @Value("${cron.secret:${CRON_SECRET:default_cron_secret_change_in_prod}}")
    private String cronSecret;

    @GetMapping("/cleanup")
    public ResponseEntity<?> handleVercelCronGet(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-Cron-Secret", required = false) String cronSecretHeader) {
        return executeCleanup(authHeader, cronSecretHeader);
    }

    @PostMapping("/cleanup")
    public ResponseEntity<?> handleVercelCronPost(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-Cron-Secret", required = false) String cronSecretHeader) {
        return executeCleanup(authHeader, cronSecretHeader);
    }

    private ResponseEntity<?> executeCleanup(String authHeader, String cronSecretHeader) {
        boolean authorized = false;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7).trim();
            if (cronSecret.equals(token)) {
                authorized = true;
            }
        }

        if (!authorized && cronSecretHeader != null) {
            if (cronSecret.equals(cronSecretHeader.trim())) {
                authorized = true;
            }
        }

        if (!authorized) {
            log.warn("Unauthorized Vercel Cron invocation attempt.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized cron request");
        }

        log.info("Authorized Vercel Cron cleanup triggered.");
        CleanupResult result = cleanupService.purgeExpiredAndRevokedTokensAndSessions();
        return ResponseEntity.ok(result);
    }
}
