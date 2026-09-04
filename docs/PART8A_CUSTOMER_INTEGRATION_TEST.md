# AutoServe Part 8A — Customer Integration Test Documentation

## Overview
This document logs the execution and verification of the 14-step real Customer integration test flow. The test executes against the Spring Boot backend (`http://localhost:8080/api`) using an isolated test user lifecycle.

## 14-Step Verification Matrix

| Step | Operation / Action | Endpoint / Target | Expected Behavior | Status |
| ---- | ------------------ | ----------------- | ----------------- | ------ |
| 1 | Register Customer | `POST /api/auth/register` | Customer account created with `ROLE_CUSTOMER`. | PASS |
| 2 | Login Customer | `POST /api/auth/login` | Short-lived access token received; HttpOnly refresh cookie set. | PASS |
| 3 | Session Restoration | `GET /api/users/me` | User details restored using Bearer access token. | PASS |
| 4 | Create Vehicle | `POST /api/vehicles` | Vehicle added with normalized uppercase registration plate. | PASS |
| 5 | View Owned Vehicles | `GET /api/vehicles/me` | List includes newly added vehicle; single vehicle GET succeeds. | PASS |
| 6 | Book Appointment | `POST /api/appointments` | Appointment created with initial status `REQUESTED`. | PASS |
| 7 | View Appointments | `GET /api/appointments/me` | List contains newly created appointment reference. | PASS |
| 8 | Unowned Vehicle Check | `GET /api/vehicles/99999` | Server responds with `403 Forbidden` or `404 Not Found`. | PASS |
| 9 | Unowned Appointment Check | `GET /api/appointments/99999` | Server responds with `403 Forbidden` or `404 Not Found`. | PASS |
| 10 | View Customer Job Cards | `GET /api/job_cards/me` | Returns list of job cards connected to owned vehicles. | PASS |
| 11 | View Customer Invoices | `GET /api/invoices/me` | Returns list of invoices connected to owned vehicles. | PASS |
| 12 | Update Profile | `PUT /api/users/me` | Updates customer `name` and `phone`; excludes protected fields. | PASS |
| 13 | Logout Session | `POST /api/auth/logout` | Session revoked in backend database; cookie cleared. | PASS |
| 14 | Unauthenticated Rejection | `GET /api/users/me` (no auth) | Server responds with `401 Unauthorized`. | PASS |

## Test Script
The automated node script `scripts/customer_integration_test.mjs` executes all 14 steps sequentially without hardcoded credentials or database mutations outside the test user boundary.
