# AutoServe Platform - Duplicated Backend Comparison Report

**Date:** September 4, 2026  
**Auditor:** Principal Java Full-Stack Architect  

---

## Executive Summary

The repository contains two copies of the backend project:
1. **Active Backend:** Located in `backend/` (111 Java files)
2. **Archived Legacy Copy:** Located in `archive/legacy-backend/` (103 Java files)

This document provides a detailed component-by-component comparison of both copies.

---

## 1. Summary Comparison Matrix

| Component | Active Backend (`/backend`) | Legacy Copy (`/archive/legacy-backend`) | Difference |
| :--- | :--- | :--- | :--- |
| **Java Files Count** | 111 source files | 103 source files | +8 files in Active |
| **`pom.xml` Size** | 5,708 bytes (204 lines) | 5,300 bytes (187 lines) | Active contains additional dependencies |
| **Resources Folder** | `src/main/resources` present | `src/main/resources` MISSING | Legacy project cannot run standalone |
| **`application.properties`** | Present with complete configuration | MISSING | Legacy project fails at runtime |
| **Static HTML Prototype** | Present in `static/index.html` | MISSING | Active includes UI prototype |
| **Data Seeding** | `DataInitializer.java` present | MISSING | Active auto-seeds initial Admin, Manager, Mechanic, Vehicles |
| **Cloudinary Integration** | `CloudinaryConfig.java`, `CloudinaryServiceImpl.java` | MISSING | Active supports image uploads to Cloudinary |
| **PDF Generation** | `PdfService.java`, `PdfServiceImpl.java` | MISSING | Active supports PDF invoice downloading |
| **Workload DTO** | `MechanicWorkloadDto.java` present | MISSING | Active supports mechanic workload dashboard queries |
| **CORS / Web Config** | `WebConfig.java` present | MISSING | Active contains web MVC configuration |
| **Build Status** | `BUILD SUCCESS` | `BUILD SUCCESS` | Both compile, but legacy fails runtime execution |

---

## 2. Detailed Dependency Comparison (`pom.xml`)

Both projects derive from `spring-boot-starter-parent:3.5.7` and share core dependencies (`spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `spring-boot-starter-security`, `mysql-connector-j`, `lombok`, `modelmapper:3.2.5`, `springdoc-openapi:2.8.14`, `razorpay-java:1.4.8`, `spring-boot-starter-mail`, `jjwt:0.11.5`).

### Dependencies present ONLY in Active `backend/pom.xml`:
1. `org.json:json:20231013`: Used for constructing Razorpay order JSON requests.
2. `com.github.librepdf:openpdf:2.0.3`: Used by `PdfServiceImpl` for generating downloadable PDF invoices.
3. `com.cloudinary:cloudinary-http44:1.36.0`: Used by `CloudinaryServiceImpl` for image uploads.

---

## 3. Source File Differences

### Files Present ONLY in Active Backend (`backend/`):
1. `com.car_backend.config.CloudinaryConfig`: Cloudinary SDK Bean setup.
2. `com.car_backend.config.DataInitializer`: Spring `CommandLineRunner` populating default demo accounts (`admin@autoserve.com`, `manager@autoserve.com`, `mechanic@autoserve.com`, `customer@autoserve.com`) and inventory items.
3. `com.car_backend.dto.jobCard.MechanicWorkloadDto`: DTO representing active job counts per mechanic under a manager.
4. `com.car_backend.security.config.WebConfig`: Web MVC config for CORS mapping.
5. `com.car_backend.service.CloudinaryServiceImpl`: Image service implementing Cloudinary upload API.
6. `com.car_backend.service.ImageService`: Interface for image uploads.
7. `com.car_backend.service.PdfService`: Interface for PDF invoice creation.
8. `com.car_backend.service.PdfServiceImpl`: Implementation of PDF document construction using OpenPDF.

---

## 4. Identical Components Between Both Copies

- **Controllers:** `AuthController`, `UserController`, `VehicleController`, `AppointmentController`, `JobCardController`, `InventoryController`, `InvoiceController`.
- **Entities:** `User`, `Vehicle`, `Appointment`, `JobCard`, `JobCardItem`, `JobCardEvidence`, `Inventory`, `Invoice`, `Chat`, `BaseEntity`.
- **Repositories:** `UserRepository`, `VehicleRepository`, `AppointmentRepository`, `JobCardRepository`, `JobCardItemRepository`, `InventoryRepository`, `InvoiceRepository`.

---

## 5. Architectural Recommendation

> [!IMPORTANT]
> **ACTIVE BACKEND MOVED TO `/backend`**  
> The active backend (`/backend`) is **newer, more feature-complete, and runnable**. It includes Cloudinary image uploads, PDF invoice generation, database seeding, web configuration, and required properties.

> [!NOTE]
> Per audit guidelines, the obsolete backend is preserved in [`/archive/legacy-backend`](../archive/legacy-backend) for reference and will not be compiled or deployed during active development.
