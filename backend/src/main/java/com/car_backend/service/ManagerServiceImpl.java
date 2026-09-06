package com.car_backend.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.car_backend.dto.AppointmentResponseDto;
import com.car_backend.dto.jobCard.JobCardResponseDto;
import com.car_backend.dto.manager.ManagerActivityItemDto;
import com.car_backend.dto.manager.ManagerOverviewDto;
import com.car_backend.dto.manager.ManagerReportSummaryDto;
import com.car_backend.dto.manager.MechanicWorkloadItemDto;
import com.car_backend.entities.Appointment;
import com.car_backend.entities.Inventory;
import com.car_backend.entities.Invoice;
import com.car_backend.entities.JobCard;
import com.car_backend.entities.JobCardStatus;
import com.car_backend.entities.PaymentStatus;
import com.car_backend.entities.Role;
import com.car_backend.entities.Status;
import com.car_backend.entities.User;
import com.car_backend.repository.AppointmentRepository;
import com.car_backend.repository.InventoryRepository;
import com.car_backend.repository.InvoiceRepository;
import com.car_backend.repository.JobCardRepository;
import com.car_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class ManagerServiceImpl implements ManagerService {

    private final AppointmentRepository appointmentRepo;
    private final JobCardRepository jobCardRepo;
    private final InvoiceRepository invoiceRepo;
    private final InventoryRepository inventoryRepo;
    private final UserRepository userRepo;

    private final AppointmentService appointmentService;
    private final JobCardService jobCardService;

    @Override
    public ManagerOverviewDto getOverview(Long managerId) {
        List<Appointment> managerAppointments = appointmentRepo.findByManager_Id(managerId);
        User manager = userRepo.findById(managerId).orElse(null);
        List<JobCard> managerJobCards = jobCardRepo.findByManager(manager);
        List<Invoice> managerInvoices = invoiceRepo.findByJobCard_Manager_Id(managerId);
        List<Inventory> lowStockItems = inventoryRepo.findLowStockItems();
        List<User> mechanics = userRepo.findByManagerId(managerId);

        LocalDate today = LocalDate.now();

        long assignedAppointmentsToday = managerAppointments.stream()
                .filter(a -> a.getRequestDate() != null && a.getRequestDate().equals(today))
                .count();

        long awaitingDecisionCount = managerAppointments.stream()
                .filter(a -> a.getStatus() == Status.PENDING)
                .count();

        long approvedAwaitingMechanicCount = managerAppointments.stream()
                .filter(a -> a.getStatus() == Status.APPROVED && a.getMechanic() == null)
                .count();

        long jobsInProgressCount = managerJobCards.stream()
                .filter(j -> j.getJobCardStatus() == JobCardStatus.IN_PROGRESS)
                .count();

        long jobsAwaitingAttentionCount = managerAppointments.stream()
                .filter(a -> a.getStatus() == Status.PENDING)
                .count() + managerJobCards.stream()
                .filter(j -> j.getJobCardStatus() == JobCardStatus.CREATED)
                .count();

        long jobsCompletedTodayCount = managerJobCards.stream()
                .filter(j -> j.getJobCardStatus() == JobCardStatus.COMPLETED && j.getLastUpdated() != null && j.getLastUpdated().toLocalDate().equals(today))
                .count();

        long activeMechanicsCount = mechanics.stream()
                .filter(User::isActive)
                .count();

        long lowStockItemsCount = lowStockItems.size();

        long invoiceReadyJobsCount = managerJobCards.stream()
                .filter(j -> j.getJobCardStatus() == JobCardStatus.COMPLETED)
                .filter(j -> managerInvoices.stream().noneMatch(inv -> inv.getJobCard().getId().equals(j.getId())))
                .count();

        long outstandingInvoiceCount = managerInvoices.stream()
                .filter(inv -> inv.getPaymentStatus() == PaymentStatus.PENDING)
                .count();

        List<AppointmentResponseDto> recentAppointments = appointmentService.getAppointmentsByManagerId(managerId);
        if (recentAppointments.size() > 5) {
            recentAppointments = recentAppointments.subList(0, 5);
        }

        List<JobCardResponseDto> activeJobCards = jobCardService.getJobCardByManager(managerId);
        if (activeJobCards.size() > 5) {
            activeJobCards = activeJobCards.subList(0, 5);
        }

        return ManagerOverviewDto.builder()
                .assignedAppointmentsToday(assignedAppointmentsToday)
                .awaitingDecisionCount(awaitingDecisionCount)
                .approvedAwaitingMechanicCount(approvedAwaitingMechanicCount)
                .jobsInProgressCount(jobsInProgressCount)
                .jobsAwaitingAttentionCount(jobsAwaitingAttentionCount)
                .jobsCompletedTodayCount(jobsCompletedTodayCount)
                .activeMechanicsCount(activeMechanicsCount)
                .lowStockItemsCount(lowStockItemsCount)
                .invoiceReadyJobsCount(invoiceReadyJobsCount)
                .outstandingInvoiceCount(outstandingInvoiceCount)
                .recentAppointments(recentAppointments)
                .activeJobCards(activeJobCards)
                .build();
    }

    @Override
    public ManagerReportSummaryDto getReportSummary(Long managerId) {
        List<Appointment> managerAppointments = appointmentRepo.findByManager_Id(managerId);
        User manager = userRepo.findById(managerId).orElse(null);
        List<JobCard> managerJobCards = jobCardRepo.findByManager(manager);
        List<Invoice> managerInvoices = invoiceRepo.findByJobCard_Manager_Id(managerId);
        List<MechanicWorkloadItemDto> teamWorkload = getTeamWorkload(managerId);

        Map<String, Long> appointmentsByStatus = new HashMap<>();
        for (Status s : Status.values()) {
            long count = managerAppointments.stream().filter(a -> a.getStatus() == s).count();
            appointmentsByStatus.put(s.name(), count);
        }

        Map<String, Long> jobsByStatus = new HashMap<>();
        for (JobCardStatus s : JobCardStatus.values()) {
            long count = managerJobCards.stream().filter(j -> j.getJobCardStatus() == s).count();
            jobsByStatus.put(s.name(), count);
        }

        BigDecimal totalBilledValue = managerInvoices.stream()
                .map(Invoice::getTotalAmount)
                .filter(val -> val != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal paidInvoiceValue = managerInvoices.stream()
                .filter(i -> i.getPaymentStatus() == PaymentStatus.PAID)
                .map(Invoice::getTotalAmount)
                .filter(val -> val != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal outstandingInvoiceValue = managerInvoices.stream()
                .filter(i -> i.getPaymentStatus() == PaymentStatus.PENDING)
                .map(Invoice::getTotalAmount)
                .filter(val -> val != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long paidCount = managerInvoices.stream().filter(i -> i.getPaymentStatus() == PaymentStatus.PAID).count();
        long pendingCount = managerInvoices.stream().filter(i -> i.getPaymentStatus() == PaymentStatus.PENDING).count();

        return ManagerReportSummaryDto.builder()
                .appointmentsByStatus(appointmentsByStatus)
                .jobsByStatus(jobsByStatus)
                .mechanicWorkload(teamWorkload)
                .totalBilledValue(totalBilledValue)
                .paidInvoiceValue(paidInvoiceValue)
                .outstandingInvoiceValue(outstandingInvoiceValue)
                .totalInvoicesCount(managerInvoices.size())
                .paidInvoicesCount(paidCount)
                .pendingInvoicesCount(pendingCount)
                .build();
    }

    @Override
    public List<MechanicWorkloadItemDto> getTeamWorkload(Long managerId) {
        List<User> mechanics = userRepo.findByManagerId(managerId);
        List<MechanicWorkloadItemDto> result = new ArrayList<>();

        for (User mechanic : mechanics) {
            if (mechanic.getUserRole() != Role.MECHANIC) continue;

            long activeJobCount = jobCardRepo.countByMechanicIdAndJobCardStatus(mechanic.getId(), JobCardStatus.IN_PROGRESS);
            long completedJobCount = jobCardRepo.countByMechanicIdAndJobCardStatus(mechanic.getId(), JobCardStatus.COMPLETED);

            String status = "No active conflict detected";
            if (!mechanic.isActive()) {
                status = "Inactive";
            } else if (activeJobCount > 0) {
                status = "Currently assigned";
            }

            result.add(MechanicWorkloadItemDto.builder()
                    .mechanicId(mechanic.getId())
                    .mechanicName(mechanic.getUserName())
                    .email(mechanic.getEmail())
                    .mobile(mechanic.getMobile())
                    .isActive(mechanic.isActive())
                    .activeJobCount(activeJobCount)
                    .completedJobCount(completedJobCount)
                    .availabilityStatus(status)
                    .build());
        }

        return result;
    }

    @Override
    public List<ManagerActivityItemDto> getActivityLog(Long managerId) {
        List<ManagerActivityItemDto> activities = new ArrayList<>();
        List<Appointment> managerAppointments = appointmentRepo.findByManager_Id(managerId);
        User manager = userRepo.findById(managerId).orElse(null);
        List<JobCard> managerJobCards = jobCardRepo.findByManager(manager);
        List<Invoice> managerInvoices = invoiceRepo.findByJobCard_Manager_Id(managerId);

        for (Appointment appt : managerAppointments) {
            String vehicleInfo = appt.getVehicleDetails() != null
                    ? (appt.getVehicleDetails().getBrand() + " " + appt.getVehicleDetails().getModel())
                    : "Vehicle";
            String customerName = (appt.getVehicleDetails() != null && appt.getVehicleDetails().getCustomer() != null)
                    ? appt.getVehicleDetails().getCustomer().getUserName()
                    : "Customer";

            activities.add(ManagerActivityItemDto.builder()
                    .id("APPT-" + appt.getId())
                    .title("Appointment #" + appt.getId() + " (" + appt.getStatus() + ")")
                    .description("Customer: " + customerName + " | Vehicle: " + vehicleInfo)
                    .category("APPOINTMENT")
                    .timestamp(appt.getCreatedOn() != null ? appt.getCreatedOn() : LocalDateTime.now())
                    .referenceId(String.valueOf(appt.getId()))
                    .status(appt.getStatus().name())
                    .build());
        }

        for (JobCard jc : managerJobCards) {
            activities.add(ManagerActivityItemDto.builder()
                    .id("JC-" + jc.getId())
                    .title("Job Card #" + jc.getId() + " (" + jc.getJobCardStatus() + ")")
                    .description("Assigned Mechanic: " + (jc.getMechanic() != null ? jc.getMechanic().getUserName() : "Unassigned"))
                    .category("JOB_CARD")
                    .timestamp(jc.getCreatedOn() != null ? jc.getCreatedOn() : LocalDateTime.now())
                    .referenceId(String.valueOf(jc.getId()))
                    .status(jc.getJobCardStatus().name())
                    .build());
        }

        for (Invoice inv : managerInvoices) {
            activities.add(ManagerActivityItemDto.builder()
                    .id("INV-" + inv.getId())
                    .title("Invoice #" + inv.getInvoiceNumber() + " (" + inv.getPaymentStatus() + ")")
                    .description("Amount: ₹" + inv.getTotalAmount())
                    .category("INVOICE")
                    .timestamp(inv.getCreatedOn() != null ? inv.getCreatedOn() : LocalDateTime.now())
                    .referenceId(String.valueOf(inv.getId()))
                    .status(inv.getPaymentStatus().name())
                    .build());
        }

        // Sort descending by timestamp
        activities.sort((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()));

        if (activities.size() > 20) {
            return activities.subList(0, 20);
        }
        return activities;
    }
}
