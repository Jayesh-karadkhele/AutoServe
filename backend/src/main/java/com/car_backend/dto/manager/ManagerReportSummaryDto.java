package com.car_backend.dto.manager;

import java.math.BigDecimal;
import java.util.Map;
import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ManagerReportSummaryDto {
    private Map<String, Long> appointmentsByStatus;
    private Map<String, Long> jobsByStatus;
    private List<MechanicWorkloadItemDto> mechanicWorkload;
    private BigDecimal totalBilledValue;
    private BigDecimal paidInvoiceValue;
    private BigDecimal outstandingInvoiceValue;
    private long totalInvoicesCount;
    private long paidInvoicesCount;
    private long pendingInvoicesCount;
}
