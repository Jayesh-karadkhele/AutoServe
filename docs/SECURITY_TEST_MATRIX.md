# AutoServe Platform - Automated Security Test Matrix (Part 4)

**Date:** September 4, 2026  
**Test Suite:** [SecurityAndRbacTests.java](file:///c:/Users/HP/Desktop/Projets/AutoServe-main/backend/src/test/java/com/car_backend/security/SecurityAndRbacTests.java)  
**Profile:** `test` (H2 In-Memory Database)  

---

## Executive Test Summary

| Total Test Cases | Passed | Failed | Skipped | Status |
| :---: | :---: | :---: | :---: | :---: |
| **16** | **16** | **0** | **0** | **ALL PASSED** |

---

## Detailed Test Results Matrix

| # | Test Category | Target Endpoint | Test Description | Expected Result | Actual Result |
| :-: | :--- | :--- | :--- | :---: | :---: |
| 1 | **Authentication** | `POST /api/auth/register` | Public customer registration with valid payload. | `201 Created` (`CUSTOMER`) | **PASSED** |
| 2 | **Authentication** | `POST /api/auth/register` | Public registration payload including `"role": "ADMIN"`. | `400 Bad Request` | **PASSED** |
| 3 | **Authentication** | `POST /api/auth/login` | Login with incorrect password. | `401 Unauthorized` | **PASSED** |
| 4 | **Authentication** | `POST /api/auth/login` | Login attempt by deactivated account (`isActive = false`). | `401 Unauthorized` | **PASSED** |
| 5 | **Authentication** | `GET /api/users/me` | Request using valid JWT belonging to deactivated account. | `401 Unauthorized` | **PASSED** |
| 6 | **Authentication** | `GET /api/users/getUsers` | Unauthenticated request to protected endpoint. | `401 Unauthorized` | **PASSED** |
| 7 | **RBAC Users** | `GET /api/users/getUsers` | Customer role attempting to list system user registry. | `403 Forbidden` | **PASSED** |
| 8 | **RBAC Users** | `POST /api/users` | Customer role attempting to create staff accounts. | `403 Forbidden` | **PASSED** |
| 9 | **RBAC Users** | `POST /api/users` | Admin role creating `MANAGER` staff account. | `201 Created` | **PASSED** |
| 10 | **Profile** | `GET /api/users/me` | Authenticated user retrieving own profile details. | `200 OK` | **PASSED** |
| 11 | **RBAC Inventory** | `GET /api/inventory` | Customer role attempting to list inventory. | `403 Forbidden` | **PASSED** |
| 12 | **RBAC Inventory** | `GET /api/inventory` | Mechanic role viewing inventory stock levels. | `200 OK` | **PASSED** |
| 13 | **RBAC Inventory** | `POST /api/inventory` | Mechanic role attempting to create inventory item. | `403 Forbidden` | **PASSED** |
| 14 | **RBAC Inventory** | `POST /api/inventory` | Admin role creating inventory master item. | `200 OK` | **PASSED** |
| 15 | **RBAC Invoices** | `GET /api/invoices/stats/total_revenue` | Customer role attempting to access total revenue. | `403 Forbidden` | **PASSED** |
| 16 | **Payment Security** | `POST /api/invoices/1/simulate_payment` | Requesting removed payment simulation endpoint. | `404 Not Found` | **PASSED** |
