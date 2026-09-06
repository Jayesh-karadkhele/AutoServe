package com.car_backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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

public interface AdminService {
    AdminOverviewDto getAdminOverview();
    Page<UserSummaryDto> getUsers(Role role, Boolean isActive, String search, Pageable pageable);
    UserSummaryDto getUserDetails(Long userId);
    UserSummaryDto createStaff(CreateStaffDto dto);
    UserSummaryDto toggleUserActiveStatus(Long userId, String reason);
    ManagerTeamDto getManagerTeam(Long managerId);
    Page<UserSummaryDto> getManagers(Pageable pageable);
    Page<UserSummaryDto> getMechanics(Pageable pageable);
    UserSummaryDto reassignMechanic(ReassignMechanicDto dto);
    void assignManagerToAppointment(AssignManagerAppointmentDto dto);
    StockMovementDto adjustStock(StockAdjustmentDto dto);
    Page<StockMovementDto> getStockMovements(Long inventoryId, Pageable pageable);
    Page<AdminAuditEventDto> getAuditEvents(Long actorId, AuditEventAction actionType, AuditEventResource resourceType, Pageable pageable);
    SystemSettingsDto getSystemSettings();
    void recordAuditEvent(AuditEventAction actionType, AuditEventResource resourceType, String resourceId, String outcome, String details);
}
