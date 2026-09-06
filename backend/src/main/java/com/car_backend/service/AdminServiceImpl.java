package com.car_backend.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.car_backend.dto.admin.AdminAuditEventDto;
import com.car_backend.dto.admin.AdminOverviewDto;
import com.car_backend.dto.admin.AssignManagerAppointmentDto;
import com.car_backend.dto.admin.CreateStaffDto;
import com.car_backend.dto.admin.ManagerTeamDto;
import com.car_backend.dto.admin.ReassignMechanicDto;
import com.car_backend.dto.admin.StockAdjustmentDto;
import com.car_backend.dto.admin.StockMovementDto;
import com.car_backend.dto.admin.SystemSettingsDto;
import com.car_backend.dto.admin.UserSummaryDto;
import com.car_backend.entities.AdminAuditEvent;
import com.car_backend.entities.Appointment;
import com.car_backend.entities.AuditEventAction;
import com.car_backend.entities.AuditEventResource;
import com.car_backend.entities.Inventory;
import com.car_backend.entities.Invoice;
import com.car_backend.entities.JobCard;
import com.car_backend.entities.JobCardStatus;
import com.car_backend.entities.PaymentStatus;
import com.car_backend.entities.Role;
import com.car_backend.entities.Status;
import com.car_backend.entities.StockMovement;
import com.car_backend.entities.StockMovementType;
import com.car_backend.entities.User;
import com.car_backend.exceptions.ResourceNotFoundException;
import com.car_backend.repository.AdminAuditEventRepository;
import com.car_backend.repository.AppointmentRepository;
import com.car_backend.repository.InventoryRepository;
import com.car_backend.repository.InvoiceRepository;
import com.car_backend.repository.JobCardRepository;
import com.car_backend.repository.StockMovementRepository;
import com.car_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final JobCardRepository jobCardRepository;
    private final InventoryRepository inventoryRepository;
    private final InvoiceRepository invoiceRepository;
    private final StockMovementRepository stockMovementRepository;
    private final AdminAuditEventRepository auditEventRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public AdminOverviewDto getAdminOverview() {
        AdminOverviewDto dto = new AdminOverviewDto();
        dto.setTotalCustomers(userRepository.countByUserRole(Role.CUSTOMER));
        dto.setTotalManagers(userRepository.countByUserRole(Role.MANAGER));
        dto.setTotalMechanics(userRepository.countByUserRole(Role.MECHANIC));
        dto.setInactiveUsersCount(userRepository.countByIsActive(false));

        dto.setUnassignedAppointmentsCount(appointmentRepository.countByManagerIsNull());
        dto.setScheduledAppointmentsCount(appointmentRepository.countByStatus(Status.APPROVED));
        dto.setInProgressAppointmentsCount(appointmentRepository.countByStatus(Status.IN_PROGRESS));

        dto.setActiveJobCardsCount(jobCardRepository.countByJobCardStatusIn(List.of(JobCardStatus.CREATED, JobCardStatus.IN_PROGRESS)));
        dto.setCompletedJobsToday(jobCardRepository.countByJobCardStatusIn(List.of(JobCardStatus.COMPLETED)));

        dto.setLowStockCount(inventoryRepository.countByDeletedFalseAndStockQuantityLessThan(10));

        List<Invoice> invoices = invoiceRepository.findAll();
        long outstandingCount = invoices.stream().filter(i -> i.getPaymentStatus() != PaymentStatus.PAID).count();
        long paidCount = invoices.stream().filter(i -> i.getPaymentStatus() == PaymentStatus.PAID).count();
        BigDecimal paidSum = invoices.stream().filter(i -> i.getPaymentStatus() == PaymentStatus.PAID)
                .map(Invoice::getTotalAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal outstandingSum = invoices.stream().filter(i -> i.getPaymentStatus() != PaymentStatus.PAID)
                .map(Invoice::getTotalAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

        dto.setInvoiceReadyJobsCount(jobCardRepository.countByJobCardStatusIn(List.of(JobCardStatus.COMPLETED)));
        dto.setOutstandingInvoicesCount(outstandingCount);
        dto.setVerifiedPaidInvoicesCount(paidCount);
        dto.setPaidInvoiceTotal(paidSum);
        dto.setOutstandingInvoiceTotal(outstandingSum);
        dto.setTotalBilledAmount(paidSum.add(outstandingSum));

        Page<AdminAuditEvent> recentEvents = auditEventRepository.findAll(PageRequest.of(0, 5));
        dto.setRecentAuditEvents(recentEvents.getContent().stream().map(this::mapAuditEventToDto).collect(Collectors.toList()));

        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserSummaryDto> getUsers(Role role, Boolean isActive, String search, Pageable pageable) {
        Page<User> users;
        if (role != null) {
            users = userRepository.findByUserRole(role, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }
        return users.map(this::mapUserToSummaryDto);
    }

    @Override
    @Transactional(readOnly = true)
    public UserSummaryDto getUserDetails(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        return mapUserToSummaryDto(user);
    }

    @Override
    public UserSummaryDto createStaff(CreateStaffDto dto) {
        if (dto.getRole() != Role.MANAGER && dto.getRole() != Role.MECHANIC) {
            throw new IllegalArgumentException("Only MANAGER or MECHANIC accounts can be created via staff management");
        }

        String email = dto.getEmail().toLowerCase().trim();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("User with email already exists: " + email);
        }

        User user = new User();
        user.setUserName(dto.getFullName().trim());
        user.setEmail(email);
        user.setMobile(dto.getMobile().trim());
        user.setUserRole(dto.getRole());
        user.setPassword(passwordEncoder.encode(dto.getInitialPassword()));
        user.setActive(dto.getActiveState() != null ? dto.getActiveState() : true);

        if (dto.getRole() == Role.MECHANIC) {
            if (dto.getManagerId() == null) {
                throw new IllegalArgumentException("Manager assignment is required when creating a Mechanic");
            }
            User manager = userRepository.findById(dto.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assigned Manager not found"));
            if (manager.getUserRole() != Role.MANAGER || !manager.isActive()) {
                throw new IllegalArgumentException("Assigned user must be an active Manager");
            }
            user.setManager(manager);
        }

        User saved = userRepository.save(user);
        recordAuditEvent(AuditEventAction.STAFF_CREATE, AuditEventResource.USER, String.valueOf(saved.getId()), "SUCCESS",
                "Created staff account: " + saved.getUserName() + " (" + saved.getUserRole() + ")");

        return mapUserToSummaryDto(saved);
    }

    @Override
    public UserSummaryDto toggleUserActiveStatus(Long userId, String reason) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        User currentActor = getCurrentAuthenticatedUser();
        if (user.getId().equals(currentActor.getId()) && user.isActive()) {
            throw new IllegalArgumentException("Admins cannot self-deactivate their active session");
        }

        if (user.getUserRole() == Role.ADMIN && user.isActive()) {
            long activeAdminCount = userRepository.findByUserRole(Role.ADMIN).stream().filter(User::isActive).count();
            if (activeAdminCount <= 1) {
                throw new IllegalArgumentException("Cannot deactivate the last active Admin account");
            }
        }

        boolean newStatus = !user.isActive();
        user.setActive(newStatus);
        User saved = userRepository.save(user);

        AuditEventAction action = newStatus ? AuditEventAction.USER_ACTIVATED : AuditEventAction.USER_DEACTIVATED;
        recordAuditEvent(action, AuditEventResource.USER, String.valueOf(saved.getId()), "SUCCESS",
                (newStatus ? "Activated" : "Deactivated") + " user " + saved.getUserName() + ". Reason: " + reason);

        return mapUserToSummaryDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ManagerTeamDto getManagerTeam(Long managerId) {
        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found"));
        if (manager.getUserRole() != Role.MANAGER) {
            throw new IllegalArgumentException("Target user is not a Manager");
        }

        List<User> mechanics = userRepository.findAll().stream()
                .filter(u -> u.getManager() != null && u.getManager().getId().equals(managerId))
                .collect(Collectors.toList());

        ManagerTeamDto dto = new ManagerTeamDto();
        dto.setManagerId(manager.getId());
        dto.setManagerName(manager.getUserName());
        dto.setManagerEmail(manager.getEmail());
        dto.setManagerMobile(manager.getMobile());
        dto.setManagerActive(manager.isActive());
        dto.setMechanics(mechanics.stream().map(this::mapUserToSummaryDto).collect(Collectors.toList()));
        dto.setActiveAppointmentsCount((int) appointmentRepository.countByManager_Id(managerId));
        dto.setActiveJobsCount((int) jobCardRepository.countByMechanic_Manager_Id(managerId));

        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserSummaryDto> getManagers(Pageable pageable) {
        return userRepository.findByUserRole(Role.MANAGER, pageable).map(this::mapUserToSummaryDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserSummaryDto> getMechanics(Pageable pageable) {
        return userRepository.findByUserRole(Role.MECHANIC, pageable).map(this::mapUserToSummaryDto);
    }

    @Override
    public UserSummaryDto reassignMechanic(ReassignMechanicDto dto) {
        User mechanic = userRepository.findById(dto.getMechanicId())
                .orElseThrow(() -> new ResourceNotFoundException("Mechanic not found"));
        if (mechanic.getUserRole() != Role.MECHANIC) {
            throw new IllegalArgumentException("User is not a Mechanic");
        }

        User targetManager = userRepository.findById(dto.getTargetManagerId())
                .orElseThrow(() -> new ResourceNotFoundException("Target Manager not found"));
        if (targetManager.getUserRole() != Role.MANAGER || !targetManager.isActive()) {
            throw new IllegalArgumentException("Target user must be an active Manager");
        }

        List<JobCard> activeJobs = jobCardRepository.findByMechanicIdAndJobCardStatusIn(
                dto.getMechanicId(), List.of(JobCardStatus.CREATED, JobCardStatus.IN_PROGRESS));
        if (!activeJobs.isEmpty()) {
            String blockingJobRefs = activeJobs.stream()
                    .map(j -> "JC-" + j.getId())
                    .collect(Collectors.joining(", "));
            throw new com.car_backend.exceptions.MechanicTransferConflictException(
                    "Cannot reassign Mechanic " + mechanic.getUserName() + " with active assigned jobs: [" + blockingJobRefs + "]. Please complete or reassign active jobs first.");
        }

        mechanic.setManager(targetManager);
        User saved = userRepository.save(mechanic);

        recordAuditEvent(AuditEventAction.TEAM_REASSIGNMENT, AuditEventResource.USER, String.valueOf(saved.getId()), "SUCCESS",
                "Reassigned Mechanic " + saved.getUserName() + " to Manager " + targetManager.getUserName() + ". Reason: " + dto.getReason());

        return mapUserToSummaryDto(saved);
    }

    @Override
    public void assignManagerToAppointment(AssignManagerAppointmentDto dto) {
        Appointment appt = appointmentRepository.findById(dto.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        User manager = userRepository.findById(dto.getManagerId())
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found"));
        if (manager.getUserRole() != Role.MANAGER || !manager.isActive()) {
            throw new IllegalArgumentException("Assigned user must be an active Manager");
        }

        appt.setManager(manager);
        appointmentRepository.save(appt);

        recordAuditEvent(AuditEventAction.APPOINTMENT_MANAGER_ASSIGNMENT, AuditEventResource.APPOINTMENT, String.valueOf(appt.getId()), "SUCCESS",
                "Assigned Manager " + manager.getUserName() + " to Appointment ID " + appt.getId() + ". Reason: " + dto.getReason());
    }

    @Override
    public StockMovementDto adjustStock(StockAdjustmentDto dto) {
        Inventory inventory = inventoryRepository.findById(dto.getInventoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found"));

        int currentQty = inventory.getStockQuantity() != null ? inventory.getStockQuantity() : 0;
        int newQty = currentQty + dto.getQuantityDelta();
        if (newQty < 0) {
            throw new IllegalArgumentException("Stock quantity cannot be negative. Current: " + currentQty + ", Delta: " + dto.getQuantityDelta());
        }

        inventory.setStockQuantity(newQty);
        Inventory savedInventory = inventoryRepository.save(inventory);

        User actor = getCurrentAuthenticatedUser();

        StockMovement movement = new StockMovement();
        movement.setInventory(savedInventory);
        movement.setMovementType(dto.getMovementType());
        movement.setQuantityBefore(currentQty);
        movement.setQuantityDelta(dto.getQuantityDelta());
        movement.setQuantityAfter(newQty);
        movement.setActor(actor);
        movement.setReason(dto.getReason());
        StockMovement savedMovement = stockMovementRepository.save(movement);

        recordAuditEvent(AuditEventAction.STOCK_ADJUSTMENT, AuditEventResource.INVENTORY, String.valueOf(savedInventory.getId()), "SUCCESS",
                "Adjusted stock for " + savedInventory.getItemName() + " (" + dto.getMovementType() + "): " + currentQty + " -> " + newQty);

        return mapStockMovementToDto(savedMovement);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StockMovementDto> getStockMovements(Long inventoryId, Pageable pageable) {
        Page<StockMovement> movements;
        if (inventoryId != null) {
            movements = stockMovementRepository.findByInventoryIdOrderByCreatedAtDesc(inventoryId, pageable);
        } else {
            movements = stockMovementRepository.findAllByOrderByCreatedAtDesc(pageable);
        }
        return movements.map(this::mapStockMovementToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminAuditEventDto> getAuditEvents(Long actorId, AuditEventAction actionType, AuditEventResource resourceType, Pageable pageable) {
        return auditEventRepository.filterAuditEvents(actorId, actionType, resourceType, pageable).map(this::mapAuditEventToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public SystemSettingsDto getSystemSettings() {
        SystemSettingsDto dto = new SystemSettingsDto();
        dto.setActiveProfile("dev/test");
        dto.setEnvironmentLabel("AutoServe Enterprise Platform");
        dto.setDatabaseConnectivity("Connected (Relational MySQL / H2)");
        dto.setMailConfigured(true);
        dto.setCloudinaryConfigured(true);
        dto.setRazorpayConfigured(false); // Razorpay is Part 8E
        dto.setDemoSeedingEnabled(true);
        dto.setAdminBootstrapEnabled(true);
        dto.setAuthCookieSecurityMode("HttpOnly Strict JWT Refresh Cookie");
        dto.setFlywaySchemaVersion("v7");
        dto.setApplicationVersion("1.0.0-PART8D");
        return dto;
    }

    @Override
    public void recordAuditEvent(AuditEventAction actionType, AuditEventResource resourceType, String resourceId, String outcome, String details) {
        User actor = getCurrentAuthenticatedUser();
        AdminAuditEvent event = new AdminAuditEvent();
        event.setActor(actor);
        event.setActionType(actionType);
        event.setResourceType(resourceType);
        event.setResourceId(resourceId);
        event.setOutcome(outcome);
        event.setDetails(details);
        auditEventRepository.save(event);
    }

    private User getCurrentAuthenticatedUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getName() != null) {
            return userRepository.findByEmail(auth.getName())
                    .orElseGet(() -> userRepository.findAll().stream().filter(User::isActive).findFirst().orElseThrow());
        }
        return userRepository.findAll().stream().filter(User::isActive).findFirst().orElseThrow();
    }

    private UserSummaryDto mapUserToSummaryDto(User user) {
        UserSummaryDto dto = new UserSummaryDto();
        dto.setId(user.getId());
        dto.setFullName(user.getUserName());
        dto.setEmail(user.getEmail());
        dto.setMobile(user.getMobile());
        dto.setRole(user.getUserRole());
        dto.setActive(user.isActive());
        if (user.getManager() != null) {
            dto.setManagerId(user.getManager().getId());
            dto.setManagerName(user.getManager().getUserName());
        }
        dto.setCreatedAt(user.getCreatedOn());
        if (user.getUserRole() == Role.MECHANIC) {
            dto.setAssignedJobCount((int) jobCardRepository.countByMechanicIdAndJobCardStatusIn(user.getId(), List.of(JobCardStatus.CREATED, JobCardStatus.IN_PROGRESS)));
            dto.setCompletedJobCount((int) jobCardRepository.countByMechanicIdAndJobCardStatusIn(user.getId(), List.of(JobCardStatus.COMPLETED)));
        }
        return dto;
    }

    private StockMovementDto mapStockMovementToDto(StockMovement sm) {
        StockMovementDto dto = new StockMovementDto();
        dto.setId(sm.getId());
        dto.setInventoryId(sm.getInventory().getId());
        dto.setPartName(sm.getInventory().getItemName());
        dto.setPartNumber(sm.getInventory().getSkuCode());
        dto.setMovementType(sm.getMovementType());
        dto.setQuantityBefore(sm.getQuantityBefore());
        dto.setQuantityDelta(sm.getQuantityDelta());
        dto.setQuantityAfter(sm.getQuantityAfter());
        if (sm.getJobCard() != null) {
            dto.setJobCardId(sm.getJobCard().getId());
            dto.setJobCardRef("JC-" + sm.getJobCard().getId());
        }
        dto.setActorId(sm.getActor().getId());
        dto.setActorName(sm.getActor().getUserName());
        dto.setReason(sm.getReason());
        dto.setCreatedAt(sm.getCreatedAt());
        return dto;
    }

    private AdminAuditEventDto mapAuditEventToDto(AdminAuditEvent ae) {
        AdminAuditEventDto dto = new AdminAuditEventDto();
        dto.setId(ae.getId());
        dto.setActorId(ae.getActor().getId());
        dto.setActorName(ae.getActor().getUserName());
        dto.setActorEmail(ae.getActor().getEmail());
        dto.setActionType(ae.getActionType());
        dto.setResourceType(ae.getResourceType());
        dto.setResourceId(ae.getResourceId());
        dto.setOutcome(ae.getOutcome());
        dto.setDetails(ae.getDetails());
        dto.setCreatedAt(ae.getCreatedAt());
        return dto;
    }
}
