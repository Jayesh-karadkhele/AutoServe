package com.car_backend.dto.mechanic;

import java.util.List;
import com.car_backend.dto.jobCard.JobCardResponseDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MechanicOverviewDto {
    private JobCardResponseDto activeJobCard;
    private long assignedJobsCount;
    private long jobsAwaitingStartCount;
    private long jobsInProgressCount;
    private long jobsCompletedTodayCount;
    private long totalCompletedCount;
    private List<JobCardResponseDto> recentAssignedJobs;
    private List<JobCardResponseDto> recentCompletedJobs;
}
