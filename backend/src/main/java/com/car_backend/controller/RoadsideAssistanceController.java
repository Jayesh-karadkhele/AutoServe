package com.car_backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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

import com.car_backend.dto.CreateRoadsideRequestDto;
import com.car_backend.dto.RoadsideResponseDto;
import com.car_backend.dto.UpdateRoadsideStatusDto;
import com.car_backend.service.RoadsideAssistanceService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/roadside")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class RoadsideAssistanceController {

    private final RoadsideAssistanceService roadsideService;

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping
    public ResponseEntity<RoadsideResponseDto> createRequest(@Valid @RequestBody CreateRoadsideRequestDto dto) {
        return ResponseEntity.ok(roadsideService.createRequest(dto));
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/me")
    public ResponseEntity<Page<RoadsideResponseDto>> getMyRequests(
            @PageableDefault(size = 10, sort = "createdOn", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(roadsideService.getCustomerRequests(pageable));
    }

    @PreAuthorize("hasAnyRole('MANAGER','MECHANIC','ADMIN')")
    @GetMapping
    public ResponseEntity<Page<RoadsideResponseDto>> getAllRequests(
            @PageableDefault(size = 15, sort = "createdOn", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(roadsideService.getAllRequests(pageable));
    }

    @GetMapping("/{requestId}")
    public ResponseEntity<RoadsideResponseDto> getRequestById(@PathVariable("requestId") Long requestId) {
        return ResponseEntity.ok(roadsideService.getRequestById(requestId));
    }

    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @PutMapping("/{requestId}/status")
    public ResponseEntity<RoadsideResponseDto> updateStatus(
            @PathVariable("requestId") Long requestId,
            @Valid @RequestBody UpdateRoadsideStatusDto dto) {
        return ResponseEntity.ok(roadsideService.updateStatus(requestId, dto));
    }

    @PutMapping("/{requestId}/cancel")
    public ResponseEntity<Void> cancelRequest(@PathVariable("requestId") Long requestId) {
        roadsideService.cancelRequest(requestId);
        return ResponseEntity.noContent().build();
    }
}
