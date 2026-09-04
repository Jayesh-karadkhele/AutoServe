# AutoServe Platform - Spring Boot Configuration & Environment Guide

**Date:** September 4, 2026  
**Author:** Senior Spring Boot Configuration & Security Engineer  

---

## Executive Overview

The AutoServe backend uses externalized configuration profiles and environment variables to manage application settings. Real secrets (passwords, tokens, API keys) are **never hardcoded in source control or properties files**.

---

## 1. Available Spring Profiles

The active profile is selected via `SPRING_PROFILES_ACTIVE`.

| Profile | Profile Name | Purpose | Key Behaviors |
| :--- | :--- | :--- | :--- |
| **Development** | `dev` | Local developer environment | Port 8081, readable logs, Swagger enabled (`/swagger-ui.html`), `ddl-auto=update` (temporary until Flyway). |
| **Production** | `prod` | Staging / Production deployment | Port 8080 (or `${PORT}`), Swagger disabled, `ddl-auto=validate`, minimal logging, stack traces hidden. |
| **Demo** | `demo` | Optional seeding profile | Enables `DataInitializer` ONLY when combined with `@ConditionalOnProperty(name="app.demo.seed-enabled", havingValue="true")`. Cannot run in `prod`. |

---

## 2. Environment Variables Reference

### Required Environment Variables
Without these variables, the application will fail during application startup.

| Variable Name | Description | Default Fallback | Requirement / Minimum |
| :--- | :--- | :--- | :--- |
| `DB_PASSWORD` | MySQL Database Password | *None (Required)* | Must match local MySQL `autoserve_app` user password. |
| `JWT_SECRET` | 512-bit (64-byte) HMAC Key | *None (Required)* | **Minimum 64 bytes (512 bits)** required for HS512 algorithm. |

### Optional Environment Variables (With Defaults)

| Variable Name | Description | Local Default Value |
| :--- | :--- | :--- |
| `SPRING_PROFILES_ACTIVE` | Active Spring Profile | `dev` |
| `DB_URL` | JDBC Connection String | `jdbc:mysql://localhost:3306/autoserve_dev?useSSL=false&allowPublicKeyRetrieval=true&createDatabaseIfNotExist=true` |
| `DB_USERNAME` | MySQL Username | `autoserve_app` |
| `JWT_ACCESS_EXPIRATION` | Access Token Lifetime (ms) | `900000` (15 Minutes) |
| `REFRESH_TOKEN_EXPIRATION` | Refresh Token Lifetime (ms) | `604800000` (7 Days) |
| `AUTH_SESSION_EXPIRATION` | Absolute Session Expiration (ms) | `604800000` (7 Days) |
| `APP_BOOTSTRAP_ADMIN_ENABLED` | Enable First-Admin Bootstrap | `false` (dev) / `true` (prod) |
| `BOOTSTRAP_ADMIN_EMAIL` | First Admin Email Address | `admin@autoserve.com` |
| `BOOTSTRAP_ADMIN_PASSWORD` | First Admin Initial Password | *Required if bootstrap enabled* |
| `RAZORPAY_KEY_ID` | Razorpay Key ID | *Empty string (Disabled)* |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret | *Empty string (Disabled)* |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Account Name | *Empty string (Disabled)* |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | *Empty string (Disabled)* |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | *Empty string (Disabled)* |
| `MAIL_HOST` | SMTP Server Host | `localhost` |
| `MAIL_PORT` | SMTP Server Port | `25` |
| `MAIL_USERNAME` | SMTP User | *Empty string* |
| `MAIL_PASSWORD` | SMTP Password | *Empty string* |
| `MAIL_FROM` | Sender Email Address | `noreply@autoserve.com` |
| `FRONTEND_URL` | Client Web App URL | `http://localhost:5173` |
| `CORS_ALLOWED_ORIGINS` | Permitted CORS Origins | `http://localhost:5173` |
| `INVOICE_TAX_PERCENTAGE` | Applicable GST/Tax % | `18.0` |
| `APP_DEMO_SEED_ENABLED` | Enable Demo Seeding | `false` |
| `DEMO_ADMIN_PASSWORD` | Demo Admin User Password | *None (Required if seed enabled)* |
| `DEMO_MANAGER_PASSWORD` | Demo Manager User Password | *None (Required if seed enabled)* |
| `DEMO_MECHANIC_PASSWORD` | Demo Mechanic User Password | *None (Required if seed enabled)* |
| `DEMO_CUSTOMER_PASSWORD` | Demo Customer User Password | *None (Required if seed enabled)* |

---

## 3. Generating a Secure 64-Byte JWT Secret

Because `JwtUtil.java` signs tokens using `SignatureAlgorithm.HS512`, the key string must contain at least 64 bytes (512 bits) of raw entropy.

Generate a secure secret locally in PowerShell using this script:

```powershell
$bytes = New-Object byte[] 64
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
[Convert]::ToBase64String($bytes)
$rng.Dispose()
```

Set the generated Base64 text in your local environment as `$env:JWT_SECRET`. **Never commit or share this key.**

---

## 4. Why `.env` Files Are Not Automatically Loaded

Spring Boot by default loads configuration from `application.yml` and profile-specific YAML files (`application-{profile}.yml`). It **does not automatically parse root `.env` files** at runtime unless a custom library is added.

The [.env.example](../../.env.example) file serves strictly as documentation. Environment variables must be injected into the process environment before launching the Spring Boot JVM.

---

## 5. How to Configure Environment Variables

### 5.1 Windows PowerShell (Current Session)
```powershell
$env:SPRING_PROFILES_ACTIVE="dev"
$env:DB_USERNAME="autoserve_app"
$env:DB_PASSWORD="your_local_app_password"
$env:JWT_SECRET="your_generated_64byte_base64_jwt_secret"

# Run the backend
cd backend
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=dev"
```

### 5.2 Windows Command Prompt (`cmd.exe`)
```cmd
set SPRING_PROFILES_ACTIVE=dev
set DB_USERNAME=autoserve_app
set DB_PASSWORD=your_local_app_password
set JWT_SECRET=your_generated_64byte_base64_jwt_secret

cd backend
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=dev"
```

### 5.3 Linux / macOS Terminal
```bash
export SPRING_PROFILES_ACTIVE=dev
export DB_USERNAME=autoserve_app
export DB_PASSWORD=your_local_app_password
export JWT_SECRET=your_generated_64byte_base64_jwt_secret

cd backend
./mvnw spring-boot:run "-Dspring-boot.run.profiles=dev"
```

### 5.4 IntelliJ IDEA
1. Open **Run/Debug Configurations** (`Run -> Edit Configurations`).
2. Select your Spring Boot application entry (`CarBackendApplication`).
3. In the **Environment variables** field, enter semicolon-separated pairs:
   `SPRING_PROFILES_ACTIVE=dev;DB_USERNAME=autoserve_app;DB_PASSWORD=your_local_app_password;JWT_SECRET=your_generated_64byte_base64_jwt_secret`
4. Click **Apply** and **OK**.

---

## 6. MySQL Database & User Setup Guide

### 6.1 Service Check
```powershell
Get-Service MySQL80
Test-NetConnection -ComputerName localhost -Port 3306
```

### 6.2 Database & User Creation SQL
Execute as MySQL administrator:

```sql
CREATE DATABASE IF NOT EXISTS autoserve_dev
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'autoserve_app'@'localhost'
IDENTIFIED BY 'your_local_app_password';

ALTER USER 'autoserve_app'@'localhost'
IDENTIFIED BY 'your_local_app_password';

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES, DROP
ON autoserve_dev.*
TO 'autoserve_app'@'localhost';

FLUSH PRIVILEGES;
```

---

## 7. Troubleshooting Common Startup Errors

1. **Access Denied for Database (`autoserve_app`):**
   ```
   Access denied for user 'autoserve_app'@'localhost'
   ```
   *Fix:* Verify `$env:DB_PASSWORD` matches the password set in MySQL `ALTER USER`.

2. **JWT Secret Key Length Exception:**
   ```
   IllegalStateException: JWT secret configuration error: Key length must be at least 64 bytes (512 bits) for HS512 signature algorithm.
   ```
   *Fix:* Generate a 64-byte random secret using the PowerShell snippet in Section 3 and pass it via `$env:JWT_SECRET`.

3. **Unresolved Placeholder Error (`${JWT_SECRET}`):**
   ```
   Could not resolve placeholder 'JWT_SECRET' in value "${JWT_SECRET}"
   ```
   *Fix:* Ensure environment variable is set in terminal session or IDE configuration before launching application.
