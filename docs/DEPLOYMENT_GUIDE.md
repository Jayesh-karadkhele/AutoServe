# AutoServe — Production Deployment Guide

## Prerequisites
- **Docker**: Engine v20+ with Docker Compose V2
- **Java**: OpenJDK 21 (for manual backend builds)
- **Node.js**: Node 18 or 20 (for manual frontend builds)
- **MySQL**: MySQL 8.0+ (if deploying outside Docker)

## Option 1: Docker Compose Deployment (Recommended)

### 1. Configure Environment Variables
Copy `.env.production.example` to `.env`:
```bash
cp .env.production.example .env
```
Ensure `JWT_SECRET` is set to a secure, 64-character (512-bit) secret key:
```env
MYSQL_ROOT_PASSWORD=AutoServeRootPass2026!
MYSQL_DATABASE=autoservedb
MYSQL_USER=autoserve
MYSQL_PASSWORD=AutoServeAppPass2026!
JWT_SECRET=super_secret_jwt_signing_key_must_be_at_least_64_bytes_long_autoserve_2026_key!
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost
```

### 2. Build & Launch Containers
Run:
```bash
docker compose up -d --build
```
This spins up:
1. `autoserve-mysql`: MySQL 8.0 database container listening on port 3306.
2. `autoserve-backend`: Multi-stage built Spring Boot 3 app running on port 8080.
3. `autoserve-frontend`: Nginx reverse proxy serving the React 18 production build on port 80 (and proxying `/api` & `/ws-autoserve` to backend).

### 3. Verify Health & Initial Credentials
- Web Portal: `http://localhost`
- API Health Check: `http://localhost/actuator/health`
- Initial Admin Staff Account: Created automatically on first boot.
  - Username: `admin@autoserve.com`
  - Password: `AdminPass123!` (or enter any valid email with portfolio password `ad0521`).

---

## Option 2: Manual / Standalone Deployment

### 1. MySQL Database Setup
Create database and user:
```sql
CREATE DATABASE autoservedb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'autoserve'@'%' IDENTIFIED BY 'AutoServeAppPass2026!';
GRANT ALL PRIVILEGES ON autoservedb.* TO 'autoserve'@'%';
FLUSH PRIVILEGES;
```

### 2. Backend Build & Run
```bash
cd backend
./mvnw clean package -DskipTests
java -jar target/healtcare_backend_secured_jwt-0.0.1.jar \
  --spring.profiles.active=prod \
  --spring.datasource.url=jdbc:mysql://localhost:3306/autoservedb \
  --spring.datasource.username=autoserve \
  --spring.datasource.password=AutoServeAppPass2026! \
  --jwt.secret=super_secret_jwt_signing_key_must_be_at_least_64_bytes_long_autoserve_2026_key!
```

### 3. Frontend Build & Serve
```bash
cd frontend
npm install
npm run build
```
Copy contents of `frontend/dist` to your Nginx static folder (e.g. `/var/www/html`) and configure Nginx SPA fallback to `index.html`.
