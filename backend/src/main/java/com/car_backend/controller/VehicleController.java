package com.car_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.car_backend.dto.CreateVehicleDto;
import com.car_backend.dto.VehicleResponseDto;
import com.car_backend.dto.VehicleUpdateDto;
import com.car_backend.entities.Role;
import com.car_backend.security.service.CurrentUserService;
import com.car_backend.service.VehicleService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;
    private final CurrentUserService currentUserService;

    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    @PostMapping
    public ResponseEntity<VehicleResponseDto> createVehicle(@RequestBody @Valid CreateVehicleDto dto) {
        if (currentUserService.getRole() == Role.CUSTOMER) {
            dto.setCustomerId(currentUserService.getUserId());
        }
        return ResponseEntity.ok(vehicleService.createVehicle(dto));
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/me")
    public ResponseEntity<List<VehicleResponseDto>> getMyVehicles() {
        Long currentUserId = currentUserService.getUserId();
        return ResponseEntity.ok(vehicleService.getCustomerVehicles(currentUserId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<VehicleResponseDto>> getVehicles() {
        return ResponseEntity.ok(vehicleService.getVehicles());
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.ownsVehicle(#vehicleId)")
    @PutMapping("/{vehicleId}")
    public ResponseEntity<VehicleResponseDto> updateVehicle(@PathVariable Long vehicleId, @RequestBody @Valid VehicleUpdateDto dto) {
        return ResponseEntity.ok(vehicleService.updateVehicle(vehicleId, dto));
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.canAccessVehicle(#vehicleId)")
    @GetMapping("/{vehicleId}")
    public ResponseEntity<VehicleResponseDto> getVehicleById(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(vehicleService.getVehicleById(vehicleId));
    }

    @PreAuthorize("hasAnyRole('MANAGER','MECHANIC','ADMIN')")
    @GetMapping("/license_plate/{licensePlate}")
    public ResponseEntity<VehicleResponseDto> getVehicleByLicensePlate(@PathVariable String licensePlate) {
        return ResponseEntity.ok(vehicleService.getVehicleByRegistration(licensePlate));
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.isSelf(#customerId)")
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<VehicleResponseDto>> getCustomerVehicles(@PathVariable Long customerId) {
        return ResponseEntity.ok(vehicleService.getCustomerVehicles(customerId));
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.ownsVehicle(#vehicleId)")
    @DeleteMapping("/{vehicleId}")
    public ResponseEntity<VehicleResponseDto> deleteVehicle(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(vehicleService.deleteVehicle(vehicleId));
    }
}
