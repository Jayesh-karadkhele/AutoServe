package com.car_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.car_backend.dto.manager.ManagerActivityItemDto;
import com.car_backend.dto.manager.ManagerOverviewDto;
import com.car_backend.dto.manager.ManagerReportSummaryDto;
import com.car_backend.dto.manager.MechanicWorkloadItemDto;
import com.car_backend.security.service.CurrentUserService;
import com.car_backend.service.ManagerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
@PreAuthorize("hasRole('MANAGER')")
public class ManagerController {

    private final ManagerService managerService;
    private final CurrentUserService currentUserService;

    @GetMapping("/dashboard/overview")
    public ResponseEntity<ManagerOverviewDto> getOverview() {
        Long managerId = currentUserService.getUserId();
        return ResponseEntity.ok(managerService.getOverview(managerId));
    }

    @GetMapping("/reports/summary")
    public ResponseEntity<ManagerReportSummaryDto> getReportSummary() {
        Long managerId = currentUserService.getUserId();
        return ResponseEntity.ok(managerService.getReportSummary(managerId));
    }

    @GetMapping("/team")
    public ResponseEntity<List<MechanicWorkloadItemDto>> getTeamWorkload() {
        Long managerId = currentUserService.getUserId();
        return ResponseEntity.ok(managerService.getTeamWorkload(managerId));
    }

    @GetMapping("/activity")
    public ResponseEntity<List<ManagerActivityItemDto>> getActivityLog() {
        Long managerId = currentUserService.getUserId();
        return ResponseEntity.ok(managerService.getActivityLog(managerId));
    }
}
