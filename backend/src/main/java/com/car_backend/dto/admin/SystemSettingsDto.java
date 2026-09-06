package com.car_backend.dto.admin;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SystemSettingsDto {
    private String activeProfile;
    private String environmentLabel;
    private String databaseConnectivity;
    private boolean mailConfigured;
    private boolean cloudinaryConfigured;
    private boolean razorpayConfigured;
    private boolean demoSeedingEnabled;
    private boolean adminBootstrapEnabled;
    private String authCookieSecurityMode;
    private String flywaySchemaVersion;
    private String applicationVersion;
}
