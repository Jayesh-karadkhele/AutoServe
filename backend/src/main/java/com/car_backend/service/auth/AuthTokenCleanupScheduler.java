package com.car_backend.service.auth;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@ConditionalOnProperty(prefix = "app.auth.cleanup", name = "enabled", havingValue = "true", matchIfMissing = false)
@RequiredArgsConstructor
@Slf4j
public class AuthTokenCleanupScheduler {

    private final AuthTokenCleanupService cleanupService;

    @Scheduled(cron = "${app.auth.cleanup.cron:0 0 3 * * *}")
    public void runScheduledCleanup() {
        log.info("Triggering scheduled token and session cleanup job.");
        try {
            cleanupService.purgeExpiredAndRevokedTokensAndSessions();
        } catch (Exception e) {
            log.error("Scheduled token cleanup job failed: {}", e.getMessage(), e);
        }
    }
}
