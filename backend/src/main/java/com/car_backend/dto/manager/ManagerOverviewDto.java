package com.car_backend.dto.manager;

import java.util.List;

import com.car_backend.dto.AppointmentResponseDto;
import com.car_backend.dto.jobCard.JobCardResponseDto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ManagerOverviewDto {
    private long assignedAppointmentsToday;
    private long awaitingDecisionCount;
    private long approvedAwaitingMechanicCount;
    private long jobsInProgressCount;
    private long jobsAwaitingAttentionCount;
    private long jobsCompletedTodayCount;
    private long activeMechanicsCount;
    private long lowStockItemsCount;
    private long invoiceReadyJobsCount;
    private long outstandingInvoiceCount;

    private List<AppointmentResponseDto> recentAppointments;
    private List<JobCardResponseDto> activeJobCards;
}
