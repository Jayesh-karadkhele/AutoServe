package com.car_backend.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class CronCleanupControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("1. Missing Authorization header returns 401 Unauthorized")
    void testMissingAuthorizationReturns401() throws Exception {
        mockMvc.perform(get("/api/cron/cleanup"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("2. Invalid Bearer token returns 401 Unauthorized")
    void testInvalidBearerTokenReturns401() throws Exception {
        mockMvc.perform(get("/api/cron/cleanup")
                .header("Authorization", "Bearer invalid_secret_token_123"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("3. Valid Bearer CRON_SECRET token returns 200 OK")
    void testValidBearerTokenReturns200() throws Exception {
        mockMvc.perform(get("/api/cron/cleanup")
                .header("Authorization", "Bearer default_cron_secret_change_in_prod"))
                .andExpect(status().isOk());
    }
}
