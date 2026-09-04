package com.car_backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import jakarta.annotation.PostConstruct;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Component
@ConfigurationProperties(prefix = "app.auth")
@Validated
@Data
public class AuthProperties {

    @Min(value = 60000, message = "Access token expiration must be at least 60000ms")
    private long jwtAccessExpirationMs = 900000; // 15 mins default

    @Min(value = 300000, message = "Refresh token expiration must be at least 300000ms")
    private long refreshTokenExpirationMs = 604800000; // 7 days default

    @Min(value = 300000, message = "Session expiration must be at least 300000ms")
    private long sessionExpirationMs = 604800000; // 7 days default

    @NotBlank(message = "Refresh cookie name must not be blank")
    private String cookieName = "AUTOSERVE_REFRESH";

    private boolean cookieSecure = true;

    @NotBlank(message = "SameSite policy must be specified")
    private String cookieSameSite = "Strict";

    private String cookiePath = "/api/auth";

    private String cookieDomain = "";

    @NotBlank(message = "Client header name must not be blank")
    private String clientHeaderName = "X-AutoServe-Client";

    @NotBlank(message = "Client header value must not be blank")
    private String clientHeaderValue = "web";

    @PostConstruct
    public void validateProperties() {
        if (jwtAccessExpirationMs >= refreshTokenExpirationMs) {
            throw new IllegalStateException("JWT access token lifetime must be strictly shorter than refresh token lifetime.");
        }
        if (refreshTokenExpirationMs > sessionExpirationMs) {
            throw new IllegalStateException("Refresh token lifetime cannot exceed absolute session lifetime.");
        }
        if ("None".equalsIgnoreCase(cookieSameSite) && !cookieSecure) {
            throw new IllegalStateException("SameSite=None requires Secure=true for cookie configuration.");
        }
    }
}
