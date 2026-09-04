package com.car_backend.controller;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.car_backend.dto.jobCard.AddItemToJobCardDto;
import com.car_backend.dto.jobCard.AssignMechanicDto;
import com.car_backend.dto.jobCard.CancelJobCardDto;
import com.car_backend.dto.jobCard.CreateJobCardDto;
import com.car_backend.dto.jobCard.JobCardEvidenceDto;
import com.car_backend.dto.jobCard.JobCardResponseDto;
import com.car_backend.dto.jobCard.ManagerDashboardDto;
import com.car_backend.dto.jobCard.MechanicDashboardDto;
import com.car_backend.entities.JobCardStatus;
import com.car_backend.service.JobCardService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/job_cards")
@RequiredArgsConstructor
@Slf4j
public class JobCardController {

    private final JobCardService jobCardService;

    // -----------------------Job Card Management-----------------------

    @PreAuthorize("hasRole('ADMIN') or (hasRole('MANAGER') and @accessControlService.managesAppointment(#dto.appointmentId))")
    @PostMapping
    public ResponseEntity<JobCardResponseDto> createJobCard(@Valid @RequestBody CreateJobCardDto dto) {
        log.info("Creating job card for appointment {}", dto.getAppointmentId());
        return ResponseEntity.ok(jobCardService.createJobCard(dto));
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.canAccessJobCard(#id)")
    @GetMapping("/{id}")
    public ResponseEntity<JobCardResponseDto> getJobCardById(@PathVariable Long id) {
        return ResponseEntity.ok(jobCardService.getJobCardById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<JobCardResponseDto>> getAllJobCards() {
        return ResponseEntity.ok(jobCardService.getAllJobCards());
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.canAccessAppointment(#appointmentId)")
    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<JobCardResponseDto> getJobCardByAppointmentId(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(jobCardService.getJobCardByAppointmentId(appointmentId));
    }

    // -----------------------Mechanic Assignment-----------------------

    @PreAuthorize("hasRole('ADMIN') or (@accessControlService.managesJobCard(#id) and @accessControlService.mechanicReportsToCurrentManager(#dto.mechanicId))")
    @PutMapping("/{id}/assign_mechanic")
    public ResponseEntity<JobCardResponseDto> assignMechanic(@PathVariable Long id, @Valid @RequestBody AssignMechanicDto dto) {
        return ResponseEntity.ok(jobCardService.updateMechanic(id, dto));
    }

    @PreAuthorize("hasRole('ADMIN') or (@accessControlService.managesJobCard(#id) and @accessControlService.mechanicReportsToCurrentManager(#dto.mechanicId))")
    @PutMapping("/{id}/reassign_mechanic")
    public ResponseEntity<JobCardResponseDto> reassignMechanic(@PathVariable Long id, @Valid @RequestBody AssignMechanicDto dto) {
        return ResponseEntity.ok(jobCardService.updateMechanic(id, dto));
    }

    // -----------------------Status Management-----------------------

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.isAssignedMechanicForJobCard(#id)")
    @PutMapping("/{id}/start")
    public ResponseEntity<JobCardResponseDto> startWork(@PathVariable Long id) {
        return ResponseEntity.ok(jobCardService.startWork(id));
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.isAssignedMechanicForJobCard(#id)")
    @PutMapping("/{id}/complete")
    public ResponseEntity<JobCardResponseDto> completeWork(@PathVariable Long id) {
        return ResponseEntity.ok(jobCardService.completeWork(id));
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.managesJobCard(#id)")
    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<JobCardResponseDto> cancelJobCard(@PathVariable Long id, @Valid @RequestBody CancelJobCardDto dto) {
        return ResponseEntity.ok(jobCardService.cancelJobCard(id, dto.getReason()));
    }

    // -----------------------Items Management-----------------------

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.managesJobCard(#id) or @accessControlService.isAssignedMechanicForJobCard(#id)")
    @PostMapping("/{id}/items")
    public ResponseEntity<JobCardResponseDto> addItemToJobCard(@PathVariable Long id, @RequestBody AddItemToJobCardDto dto) {
        return ResponseEntity.ok(jobCardService.addItemToJobCard(id, dto));
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.managesJobCard(#jobCardId) or @accessControlService.isAssignedMechanicForJobCard(#jobCardId)")
    @DeleteMapping("/{jobCardId}/items/{itemId}")
    public ResponseEntity<JobCardResponseDto> removeItemsFromJobCard(@PathVariable Long jobCardId, @PathVariable Long itemId) {
        return ResponseEntity.ok(jobCardService.removeItemsFromJobCard(jobCardId, itemId));
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.canAccessJobCard(#id)")
    @GetMapping("/{id}/items")
    public ResponseEntity<JobCardResponseDto> getJobCardItems(@PathVariable Long id) {
        return ResponseEntity.ok(jobCardService.getJobCardItems(id));
    }

    // -----------------------Evidence Management-----------------------

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.managesJobCard(#id) or @accessControlService.isAssignedMechanicForJobCard(#id)")
    @PostMapping("/{id}/evidence")
    public ResponseEntity<JobCardResponseDto> addEvidence(@PathVariable Long id, @RequestBody JobCardEvidenceDto dto) {
        return ResponseEntity.ok(jobCardService.addEvidence(id, dto));
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.managesJobCard(#jobCardId)")
    @DeleteMapping("/{jobCardId}/evidence/{evidenceId}")
    public ResponseEntity<JobCardResponseDto> removeEvidence(@PathVariable Long jobCardId, @PathVariable Long evidenceId) {
        return ResponseEntity.ok(jobCardService.removeEvidence(jobCardId, evidenceId));
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.canAccessJobCard(#id)")
    @GetMapping("/{id}/evidence")
    public ResponseEntity<JobCardResponseDto> getJobCardEvidence(@PathVariable Long id) {
        return ResponseEntity.ok(jobCardService.getJobCardById(id));
    }

    // -----------------------Query Endpoints-----------------------

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.isSelf(#managerId)")
    @GetMapping("/manager/{managerId}")
    public ResponseEntity<List<JobCardResponseDto>> getJobCardsByManager(@PathVariable Long managerId) {
        return ResponseEntity.ok(jobCardService.getJobCardByManager(managerId));
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.isSelf(#mechanicId)")
    @GetMapping("/mechanic/{mechanicId}")
    public ResponseEntity<List<JobCardResponseDto>> getJobCardByMechanic(@PathVariable Long mechanicId) {
        return ResponseEntity.ok(jobCardService.getJobCardByMechanic(mechanicId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/status/{status}")
    public ResponseEntity<List<JobCardResponseDto>> getJobCardsByStatus(@PathVariable JobCardStatus status) {
        return ResponseEntity.ok(jobCardService.getJobCardByStatus(status));
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.isSelf(#managerId)")
    @GetMapping("/manager/{managerId}/status/{status}")
    public ResponseEntity<List<JobCardResponseDto>> getManagerJobCardsByStatus(@PathVariable Long managerId, @PathVariable JobCardStatus status) {
        return ResponseEntity.ok(jobCardService.getManagerJobCardsByStatus(managerId, status));
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.isSelf(#mechanicId)")
    @GetMapping("/mechanic/{mechanicId}/status/{status}")
    public ResponseEntity<List<JobCardResponseDto>> getMechanicJobCardsByStatus(@PathVariable Long mechanicId, @PathVariable JobCardStatus status) {
        return ResponseEntity.ok(jobCardService.getMechanicJobCardsByStatus(mechanicId, status));
    }

    // -----------------------Statistics Endpoints--------------------------

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stats/total_count")
    public ResponseEntity<Long> getTotalJobCardCount() {
        return ResponseEntity.ok(jobCardService.getJobCardCount());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stats/in_progress")
    public ResponseEntity<Long> getInProgressJobCardCount() {
        return ResponseEntity.ok(jobCardService.getInProgressCount());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stats/completed_count")
    public ResponseEntity<Long> getCompletedCount() {
        return ResponseEntity.ok(jobCardService.getCompletedCount());
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.isSelf(#managerId)")
    @GetMapping("/stats/manager/{managerId}/count")
    public ResponseEntity<Long> getManagerJobCardCount(@PathVariable Long managerId) {
        return ResponseEntity.ok(jobCardService.getManagerJobCardCount(managerId));
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.isSelf(#mechanicId)")
    @GetMapping("/stats/mechanic/{mechanicId}/count")
    public ResponseEntity<Long> getMechanicJobCardCount(@PathVariable Long mechanicId) {
        return ResponseEntity.ok(jobCardService.getMechanicJobCardCount(mechanicId));
    }

    // ----------------------------Dashboard Endpoints-----------------------

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.isSelf(#managerId)")
    @GetMapping("/dashboard/manager/{managerId}")
    public ResponseEntity<ManagerDashboardDto> getManagerDashboard(@PathVariable Long managerId) {
        Long totalJobs = jobCardService.getManagerJobCardCount(managerId);
        Long inProgress = (long) jobCardService.getManagerJobCardsByStatus(managerId, JobCardStatus.IN_PROGRESS).size();
        Long completed = jobCardService.countManagerJobCardByStatus(managerId, JobCardStatus.COMPLETED);
        List<JobCardResponseDto> recentJobs = jobCardService.getJobCardByManager(managerId)
                .stream().limit(5).collect(Collectors.toList());

        ManagerDashboardDto dashboard = ManagerDashboardDto.builder()
                .totalJobCards(totalJobs)
                .inProgressJobCards(inProgress)
                .completedJobCards(completed)
                .recentJobCards(recentJobs)
                .build();

        return ResponseEntity.ok(dashboard);
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.isSelf(#mechanicId)")
    @GetMapping("/dashboard/mechanic/{mechanicId}")
    public ResponseEntity<MechanicDashboardDto> getMechanicDashboard(@PathVariable Long mechanicId) {
        Long totalJobs = jobCardService.getMechanicJobCardCount(mechanicId);
        List<JobCardResponseDto> assignedJobs = jobCardService.getMechanicJobCardsByStatus(mechanicId, JobCardStatus.CREATED);
        List<JobCardResponseDto> inProgress = jobCardService.getMechanicJobCardsByStatus(mechanicId, JobCardStatus.IN_PROGRESS);
        Long completedJobs = jobCardService.countMechanicJobCardByStatus(mechanicId, JobCardStatus.COMPLETED);

        MechanicDashboardDto dashboard = MechanicDashboardDto.builder()
                .totalJobCards(totalJobs)
                .assignedJobCards(assignedJobs)
                .inProgressJobCards(inProgress)
                .completedJobCards(completedJobs)
                .build();

        return ResponseEntity.ok(dashboard);
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.isSelf(#managerId)")
    @GetMapping("/revenue/manager/{managerId}")
    public ResponseEntity<Map<String, Double>> getManagerRevenue(@PathVariable Long managerId) {
        return ResponseEntity.ok(Collections.singletonMap("revenue", jobCardService.getManagerRevenue(managerId)));
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.isSelf(#managerId)")
    @GetMapping("/team/manager/{managerId}")
    public ResponseEntity<?> getManagerTeamWorkload(@PathVariable Long managerId) {
        return ResponseEntity.ok(jobCardService.getManagerTeamWorkload(managerId));
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.isSelf(#managerId)")
    @GetMapping("/search-history")
    public ResponseEntity<List<JobCardResponseDto>> searchHistory(@RequestParam String keyword, @RequestParam Long managerId) {
        return ResponseEntity.ok(jobCardService.searchHistory(keyword, managerId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/revenue/total")
    public ResponseEntity<Map<String, Double>> getTotalRevenue() {
        return ResponseEntity.ok(Collections.singletonMap("totalRevenue", jobCardService.getTotalRevenue()));
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.isSelf(#customerId)")
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<JobCardResponseDto>> getCustomerJobCards(@PathVariable Long customerId) {
        return ResponseEntity.ok(jobCardService.getCustomerJobCards(customerId));
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.ownsJobCard(#id)")
    @PutMapping("/{id}/rate")
    public ResponseEntity<JobCardResponseDto> rateJobCard(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Integer rating = (Integer) payload.get("rating");
        String feedback = (String) payload.get("feedback");
        return ResponseEntity.ok(jobCardService.submitRating(id, rating, feedback));
    }
}
