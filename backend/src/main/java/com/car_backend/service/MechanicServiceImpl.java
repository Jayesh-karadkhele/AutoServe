package com.car_backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.car_backend.dto.jobCard.JobCardResponseDto;
import com.car_backend.dto.mechanic.MechanicOverviewDto;
import com.car_backend.entities.JobCard;
import com.car_backend.entities.JobCardStatus;
import com.car_backend.entities.Role;
import com.car_backend.entities.User;
import com.car_backend.exceptions.InvalidRoleException;
import com.car_backend.exceptions.UserNotFoundException;
import com.car_backend.repository.JobCardRepository;
import com.car_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class MechanicServiceImpl implements MechanicService {

    private final UserRepository userRepo;
    private final JobCardRepository jobCardRepo;
    private final JobCardService jobCardService;

    @Override
    public MechanicOverviewDto getMechanicOverview(Long mechanicId) {
        User mechanic = userRepo.findById(mechanicId)
                .orElseThrow(() -> new UserNotFoundException("Mechanic not found"));

        if (mechanic.getUserRole() != Role.MECHANIC) {
            throw new InvalidRoleException("User is not a mechanic");
        }

        List<JobCard> mechanicJobs = jobCardRepo.findByMechanic(mechanic);

        List<JobCardResponseDto> allJobDtos = mechanicJobs.stream()
                .map(jc -> jobCardService.getJobCardById(jc.getId()))
                .collect(Collectors.toList());

        JobCardResponseDto activeJob = allJobDtos.stream()
                .filter(j -> j.getStatus() == JobCardStatus.IN_PROGRESS)
                .findFirst()
                .orElse(null);

        long awaitingStartCount = allJobDtos.stream()
                .filter(j -> j.getStatus() == JobCardStatus.CREATED)
                .count();

        long inProgressCount = allJobDtos.stream()
                .filter(j -> j.getStatus() == JobCardStatus.IN_PROGRESS)
                .count();

        long totalCompletedCount = allJobDtos.stream()
                .filter(j -> j.getStatus() == JobCardStatus.COMPLETED)
                .count();

        List<JobCardResponseDto> recentAssignedJobs = allJobDtos.stream()
                .filter(j -> j.getStatus() == JobCardStatus.CREATED || j.getStatus() == JobCardStatus.IN_PROGRESS)
                .limit(5)
                .collect(Collectors.toList());

        List<JobCardResponseDto> recentCompletedJobs = allJobDtos.stream()
                .filter(j -> j.getStatus() == JobCardStatus.COMPLETED)
                .limit(5)
                .collect(Collectors.toList());

        return MechanicOverviewDto.builder()
                .activeJobCard(activeJob)
                .assignedJobsCount(awaitingStartCount + inProgressCount)
                .jobsAwaitingStartCount(awaitingStartCount)
                .jobsInProgressCount(inProgressCount)
                .jobsCompletedTodayCount(totalCompletedCount) // Total completed assigned jobs
                .totalCompletedCount(totalCompletedCount)
                .recentAssignedJobs(recentAssignedJobs)
                .recentCompletedJobs(recentCompletedJobs)
                .build();
    }
}
