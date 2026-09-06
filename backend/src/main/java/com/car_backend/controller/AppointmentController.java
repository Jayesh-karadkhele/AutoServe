package com.car_backend.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.car_backend.dto.AppointmentResponseDto;
import com.car_backend.dto.ApproveRejectDto;
import com.car_backend.dto.CreateAppointmentDto;
import com.car_backend.dto.UpdateAppointmentDto;
import com.car_backend.entities.Status;
import com.car_backend.security.service.CurrentUserService;
import com.car_backend.service.AppointmentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@Slf4j
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final CurrentUserService currentUserService;

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/me")
    public ResponseEntity<List<AppointmentResponseDto>> getMyAppointments() {
        Long currentUserId = currentUserService.getUserId();
        return ResponseEntity.ok(appointmentService.getAppointmentsByCustomerId(currentUserId));
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/manager/me")
    public ResponseEntity<List<AppointmentResponseDto>> getMyManagerAppointments() {
        Long currentUserId = currentUserService.getUserId();
        return ResponseEntity.ok(appointmentService.getAppointmentsByManagerId(currentUserId));
    }

    @PreAuthorize("hasRole('ADMIN') or (hasRole('CUSTOMER') and @accessControlService.ownsVehicle(#dto.vehicleId))")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AppointmentResponseDto> createAppointment(
            @RequestPart("appointment") @Valid CreateAppointmentDto dto,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        log.info("Received request to create appointment for vehicle {}", dto.getVehicleId());
        return ResponseEntity.ok(appointmentService.createAppointment(dto, image));
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.ownsAppointment(#appointmentId)")
    @PutMapping("/{appointmentId}")
    public ResponseEntity<AppointmentResponseDto> updateAppointment(
            @PathVariable("appointmentId") Long appointmentId,
            @Valid @RequestBody UpdateAppointmentDto dto) {
        log.info("Received update appointment request for ID {}", appointmentId);
        return ResponseEntity.ok(appointmentService.updateAppointment(appointmentId, dto));
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.ownsAppointment(#appointmentId)")
    @DeleteMapping("/{appointmentId}/cancel")
    public ResponseEntity<Void> cancelAppointment(@PathVariable("appointmentId") Long appointmentId) {
        appointmentService.cancelAppointment(appointmentId);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.isSelf(#customerId)")
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<AppointmentResponseDto>> getAllAppointmentsByCustomer(@PathVariable("customerId") Long customerId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByCustomerId(customerId));
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.canAccessVehicle(#vehicleId)")
    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<AppointmentResponseDto>> getAppointmentsByVehicle(@PathVariable("vehicleId") Long vehicleId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByVehicleId(vehicleId));
    }

    // ----------MANAGER & STAFF MAPPING----------
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<AppointmentResponseDto>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.canAccessAppointment(#appointmentId)")
    @GetMapping("/{appointmentId}")
    public ResponseEntity<AppointmentResponseDto> getAppointmentById(@PathVariable("appointmentId") Long appointmentId) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(appointmentId));
    }

    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @GetMapping("/pending")
    public ResponseEntity<List<AppointmentResponseDto>> getPendingAppointments() {
        return ResponseEntity.ok(appointmentService.findPendingAppointments());
    }

    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @GetMapping("/manager/pending")
    public ResponseEntity<Page<AppointmentResponseDto>> getManagerPendingAppointments(
            @PageableDefault(size = 10, sort = {"requestDate", "createdOn"}, direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(appointmentService.findManagerPendingQueue(pageable));
    }

    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @GetMapping("/status/{status}")
    public ResponseEntity<List<AppointmentResponseDto>> getAppointmentsByStatus(@PathVariable("status") Status status) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByStatus(status));
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PutMapping("/{appointmentId}/approve")
    public ResponseEntity<AppointmentResponseDto> approveAppointment(@PathVariable("appointmentId") Long appointmentId) {
        return ResponseEntity.ok(appointmentService.approveAppointment(appointmentId));
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PutMapping("/{appointmentId}/reject")
    public ResponseEntity<AppointmentResponseDto> rejectAppointment(
            @PathVariable("appointmentId") Long appointmentId,
            @Valid @RequestBody ApproveRejectDto dto) {
        return ResponseEntity.ok(appointmentService.rejectAppointment(appointmentId, dto.getRejectionReason()));
    }

    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @GetMapping("/status/pending_count")
    public ResponseEntity<Long> getPendingAppointmentCount() {
        return ResponseEntity.ok(appointmentService.getPendingAppointmentCount());
    }

    // -----------RSA Mapping------------
    @PreAuthorize("hasAnyRole('MANAGER','MECHANIC','ADMIN')")
    @GetMapping("/rsa")
    public ResponseEntity<List<AppointmentResponseDto>> getAllRsaAppointments() {
        return ResponseEntity.ok(appointmentService.getRsaAppointments());
    }

    @PreAuthorize("hasAnyRole('MANAGER','MECHANIC','ADMIN')")
    @GetMapping("/rsa/pending")
    public ResponseEntity<List<AppointmentResponseDto>> getPendingRsaAppointments() {
        return ResponseEntity.ok(appointmentService.getPendingRsaAppointments());
    }

    @PreAuthorize("hasAnyRole('MANAGER','MECHANIC','ADMIN')")
    @GetMapping("/rsa/{status}")
    public ResponseEntity<List<AppointmentResponseDto>> getRsaAppointmentsByStatus(@PathVariable("status") Status status) {
        return ResponseEntity.ok(appointmentService.getRsaAppointmentsByStatus(status));
    }

    @PreAuthorize("hasAnyRole('MANAGER','MECHANIC','ADMIN')")
    @GetMapping("/status/rsa_count")
    public ResponseEntity<Long> getRsaCount() {
        return ResponseEntity.ok(appointmentService.getRsaCount());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{appointmentId}/assign-manager/{managerId}")
    public ResponseEntity<AppointmentResponseDto> assignManager(
            @PathVariable("appointmentId") Long appointmentId,
            @PathVariable("managerId") Long managerId) {
        log.info("Request to assign manager {} to appointment {}", managerId, appointmentId);
        return ResponseEntity.ok(appointmentService.assignManager(appointmentId, managerId));
    }

    @PreAuthorize("hasRole('ADMIN') or (@accessControlService.managesAppointment(#appointmentId) and @accessControlService.mechanicReportsToCurrentManager(#mechanicId))")
    @PutMapping("/{appointmentId}/assign-mechanic/{mechanicId}")
    public ResponseEntity<AppointmentResponseDto> assignMechanic(
            @PathVariable("appointmentId") Long appointmentId,
            @PathVariable("mechanicId") Long mechanicId) {
        log.info("Request to assign mechanic {} to appointment {}", mechanicId, appointmentId);
        return ResponseEntity.ok(appointmentService.assignMechanic(appointmentId, mechanicId));
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.isSelf(#mechanicId)")
    @GetMapping("/mechanic/{mechanicId}")
    public ResponseEntity<List<AppointmentResponseDto>> getAppointmentsByMechanic(@PathVariable("mechanicId") Long mechanicId) {
        log.info("Request for appointments of mechanic {}", mechanicId);
        return ResponseEntity.ok(appointmentService.getAppointmentsByMechanicId(mechanicId));
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.isSelf(#managerId)")
    @GetMapping("/manager/{managerId}")
    public ResponseEntity<List<AppointmentResponseDto>> getAppointmentsByManager(@PathVariable("managerId") Long managerId) {
        log.info("Request for appointments of manager {}", managerId);
        return ResponseEntity.ok(appointmentService.getAppointmentsByManagerId(managerId));
    }
}
