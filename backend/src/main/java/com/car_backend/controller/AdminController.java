package com.car_backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.car_backend.dto.admin.AdminAuditEventDto;
import com.car_backend.dto.admin.AdminOverviewDto;
import com.car_backend.dto.admin.AssignManagerAppointmentDto;
import com.car_backend.dto.admin.CreateStaffDto;
import com.car_backend.dto.admin.ManagerTeamDto;
import com.car_backend.dto.admin.ReassignMechanicDto;
import com.car_backend.dto.admin.StockAdjustmentDto;
import com.car_backend.dto.admin.StockMovementDto;
import com.car_backend.dto.admin.SystemSettingsDto;
import com.car_backend.dto.admin.UserSummaryDto;
import com.car_backend.entities.AuditEventAction;
import com.car_backend.entities.AuditEventResource;
import com.car_backend.entities.Role;
import com.car_backend.service.AdminService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/overview")
    public ResponseEntity<AdminOverviewDto> getOverview() {
        return ResponseEntity.ok(adminService.getAdminOverview());
    }

    @GetMapping("/users")
    public ResponseEntity<Page<UserSummaryDto>> getUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) String search,
            Pageable pageable) {
        return ResponseEntity.ok(adminService.getUsers(role, isActive, search, pageable));
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<UserSummaryDto> getUserDetails(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(adminService.getUserDetails(userId));
    }

    @PostMapping("/staff")
    public ResponseEntity<UserSummaryDto> createStaff(@Valid @RequestBody CreateStaffDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.createStaff(dto));
    }

    @PutMapping("/users/{userId}/toggle-active")
    public ResponseEntity<UserSummaryDto> toggleUserActiveStatus(
            @PathVariable("userId") Long userId,
            @RequestParam(name = "reason", defaultValue = "Admin manual action") String reason) {
        return ResponseEntity.ok(adminService.toggleUserActiveStatus(userId, reason));
    }

    @GetMapping("/managers")
    public ResponseEntity<Page<UserSummaryDto>> getManagers(Pageable pageable) {
        return ResponseEntity.ok(adminService.getManagers(pageable));
    }

    @GetMapping("/managers/{managerId}/team")
    public ResponseEntity<ManagerTeamDto> getManagerTeam(@PathVariable("managerId") Long managerId) {
        return ResponseEntity.ok(adminService.getManagerTeam(managerId));
    }

    @GetMapping("/mechanics")
    public ResponseEntity<Page<UserSummaryDto>> getMechanics(Pageable pageable) {
        return ResponseEntity.ok(adminService.getMechanics(pageable));
    }

    @PutMapping("/mechanics/reassign")
    public ResponseEntity<UserSummaryDto> reassignMechanic(@Valid @RequestBody ReassignMechanicDto dto) {
        return ResponseEntity.ok(adminService.reassignMechanic(dto));
    }

    @PutMapping("/appointments/assign-manager")
    public ResponseEntity<Void> assignManagerToAppointment(@Valid @RequestBody AssignManagerAppointmentDto dto) {
        adminService.assignManagerToAppointment(dto);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/inventory/adjust-stock")
    public ResponseEntity<StockMovementDto> adjustStock(@Valid @RequestBody StockAdjustmentDto dto) {
        return ResponseEntity.ok(adminService.adjustStock(dto));
    }

    @GetMapping("/inventory/movements")
    public ResponseEntity<Page<StockMovementDto>> getStockMovements(
            @RequestParam(required = false) Long inventoryId,
            Pageable pageable) {
        return ResponseEntity.ok(adminService.getStockMovements(inventoryId, pageable));
    }

    @GetMapping("/audit-events")
    public ResponseEntity<Page<AdminAuditEventDto>> getAuditEvents(
            @RequestParam(required = false) Long actorId,
            @RequestParam(required = false) AuditEventAction actionType,
            @RequestParam(required = false) AuditEventResource resourceType,
            Pageable pageable) {
        return ResponseEntity.ok(adminService.getAuditEvents(actorId, actionType, resourceType, pageable));
    }

    @GetMapping("/settings")
    public ResponseEntity<SystemSettingsDto> getSystemSettings() {
        return ResponseEntity.ok(adminService.getSystemSettings());
    }

    @GetMapping("/profile")
    public ResponseEntity<UserSummaryDto> getAdminProfile() {
        return ResponseEntity.ok(adminService.getAdminOverview() != null ? adminService.getUserDetails(1L) : null);
    }
}
