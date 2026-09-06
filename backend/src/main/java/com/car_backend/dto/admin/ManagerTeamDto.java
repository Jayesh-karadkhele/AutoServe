package com.car_backend.dto.admin;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ManagerTeamDto {
    private Long managerId;
    private String managerName;
    private String managerEmail;
    private String managerMobile;
    private boolean managerActive;
    private List<UserSummaryDto> mechanics;
    private int activeAppointmentsCount;
    private int activeJobsCount;
}
