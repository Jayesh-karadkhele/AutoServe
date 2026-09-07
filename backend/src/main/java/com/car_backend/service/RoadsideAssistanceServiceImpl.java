package com.car_backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.car_backend.dto.CreateRoadsideRequestDto;
import com.car_backend.dto.RoadsideResponseDto;
import com.car_backend.dto.UpdateRoadsideStatusDto;
import com.car_backend.entities.RoadsideAssistance;
import com.car_backend.entities.Role;
import com.car_backend.entities.RsaStatus;
import com.car_backend.entities.User;
import com.car_backend.entities.Vehicle;
import com.car_backend.exceptions.InvalidOperationException;
import com.car_backend.exceptions.ResourceNotFoundException;
import com.car_backend.exceptions.UnauthorizedException;
import com.car_backend.repository.RoadsideAssistanceRepository;
import com.car_backend.repository.UserRepository;
import com.car_backend.repository.VehicleRepository;
import com.car_backend.security.service.CurrentUserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class RoadsideAssistanceServiceImpl implements RoadsideAssistanceService {

    private final RoadsideAssistanceRepository rsaRepository;
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;
    private final NotificationService notificationService;

    @Override
    public RoadsideResponseDto createRequest(CreateRoadsideRequestDto dto) {
        User customer = currentUserService.getAuthenticatedUser();

        Vehicle vehicle = vehicleRepository.findByIdAndIsActiveTrue(dto.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        if (!vehicle.getCustomer().getId().equals(customer.getId())) {
            throw new UnauthorizedException("Vehicle does not belong to the current customer");
        }

        RoadsideAssistance rsa = RoadsideAssistance.builder()
                .customer(customer)
                .vehicle(vehicle)
                .assistanceType(dto.getAssistanceType().trim())
                .description(dto.getDescription() != null ? dto.getDescription().trim() : null)
                .locationText(dto.getLocationText() != null ? dto.getLocationText().trim() : null)
                .coordinates(dto.getCoordinates() != null ? dto.getCoordinates().trim() : null)
                .status(RsaStatus.REQUESTED)
                .build();

        RoadsideAssistance saved = rsaRepository.save(rsa);
        log.info("Roadside assistance request created ID {} by customer {}", saved.getId(), customer.getId());

        // Notify workshop managers
        notifyManagers(saved, "New Roadside Assistance Request", "Customer requested roadside help: " + dto.getAssistanceType());

        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RoadsideResponseDto> getCustomerRequests(Pageable pageable) {
        Long customerId = currentUserService.getUserId();
        return rsaRepository.findByCustomer_IdOrderByCreatedOnDesc(customerId, pageable).map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RoadsideResponseDto> getAllRequests(Pageable pageable) {
        return rsaRepository.findAllByOrderByCreatedOnDesc(pageable).map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public RoadsideResponseDto getRequestById(Long requestId) {
        RoadsideAssistance rsa = rsaRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Roadside assistance request not found"));

        User current = currentUserService.getAuthenticatedUser();
        if (current.getUserRole() == Role.CUSTOMER && !rsa.getCustomer().getId().equals(current.getId())) {
            throw new UnauthorizedException("Access denied to roadside request");
        }

        return mapToDto(rsa);
    }

    @Override
    public RoadsideResponseDto updateStatus(Long requestId, UpdateRoadsideStatusDto dto) {
        RoadsideAssistance rsa = rsaRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Roadside assistance request not found"));

        rsa.setStatus(dto.getStatus());

        if (dto.getAssignedHandlerId() != null) {
            User handler = userRepository.findById(dto.getAssignedHandlerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assigned staff user not found"));
            rsa.setAssignedHandler(handler);
        }

        if (dto.getResolutionNotes() != null) {
            rsa.setResolutionNotes(dto.getResolutionNotes().trim());
        }

        RoadsideAssistance updated = rsaRepository.save(rsa);
        log.info("Roadside request {} status updated to {}", requestId, dto.getStatus());

        // Notify customer
        notificationService.createNotification(
                updated.getCustomer(),
                "Roadside Request Update",
                "Your roadside request status is now " + dto.getStatus(),
                "ROADSIDE",
                updated.getId(),
                "/roadside-assistance"
        );

        return mapToDto(updated);
    }

    @Override
    public void cancelRequest(Long requestId) {
        RoadsideAssistance rsa = rsaRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Roadside assistance request not found"));

        User current = currentUserService.getAuthenticatedUser();
        if (current.getUserRole() == Role.CUSTOMER && !rsa.getCustomer().getId().equals(current.getId())) {
            throw new UnauthorizedException("Access denied to roadside request");
        }

        if (rsa.getStatus() == RsaStatus.RESOLVED) {
            throw new InvalidOperationException("Resolved roadside requests cannot be cancelled");
        }

        rsa.setStatus(RsaStatus.CANCELLED);
        rsaRepository.save(rsa);
    }

    private void notifyManagers(RoadsideAssistance rsa, String title, String message) {
        userRepository.findByUserRole(Role.MANAGER).forEach(manager -> {
            notificationService.createNotification(manager, title, message, "ROADSIDE", rsa.getId(), "/roadside-assistance");
        });
    }

    private RoadsideResponseDto mapToDto(RoadsideAssistance rsa) {
        User customer = rsa.getCustomer();
        Vehicle vehicle = rsa.getVehicle();
        User handler = rsa.getAssignedHandler();

        return RoadsideResponseDto.builder()
                .id(rsa.getId())
                .customerId(customer.getId())
                .customerName(customer.getUserName())
                .customerMobile(customer.getMobile())
                .vehicleId(vehicle.getId())
                .vehiclePlate(vehicle.getLicensePlate())
                .vehicleModel(vehicle.getBrand() + " " + vehicle.getModel())
                .assignedHandlerId(handler != null ? handler.getId() : null)
                .assignedHandlerName(handler != null ? handler.getUserName() : null)
                .assistanceType(rsa.getAssistanceType())
                .description(rsa.getDescription())
                .locationText(rsa.getLocationText())
                .coordinates(rsa.getCoordinates())
                .status(rsa.getStatus())
                .resolutionNotes(rsa.getResolutionNotes())
                .createdAt(rsa.getCreatedOn())
                .updatedAt(rsa.getLastUpdated())
                .build();
    }
}
