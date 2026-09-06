package com.car_backend.service;

import java.util.List;

import com.car_backend.dto.manager.ManagerActivityItemDto;
import com.car_backend.dto.manager.ManagerOverviewDto;
import com.car_backend.dto.manager.ManagerReportSummaryDto;
import com.car_backend.dto.manager.MechanicWorkloadItemDto;

public interface ManagerService {
    ManagerOverviewDto getOverview(Long managerId);
    ManagerReportSummaryDto getReportSummary(Long managerId);
    List<ManagerActivityItemDto> getActivityLog(Long managerId);
    List<MechanicWorkloadItemDto> getTeamWorkload(Long managerId);
}
