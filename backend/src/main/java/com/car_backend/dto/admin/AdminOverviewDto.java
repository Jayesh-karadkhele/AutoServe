package com.car_backend.dto.admin;

import java.math.BigDecimal;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminOverviewDto {
    private long totalCustomers;
    private long totalManagers;
    private long totalMechanics;
    private long inactiveUsersCount;
    private long unassignedAppointmentsCount;
    private long scheduledAppointmentsCount;
    private long inProgressAppointmentsCount;
    private long activeJobCardsCount;
    private long completedJobsToday;
    private long lowStockCount;
    private long invoiceReadyJobsCount;
    private long outstandingInvoicesCount;
    private long verifiedPaidInvoicesCount;
    private BigDecimal paidInvoiceTotal;
    private BigDecimal outstandingInvoiceTotal;
    private BigDecimal totalBilledAmount;
    private List<AdminAuditEventDto> recentAuditEvents;
}
