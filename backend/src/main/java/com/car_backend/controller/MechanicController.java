package com.car_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.car_backend.dto.UserResponseDto;
import com.car_backend.dto.mechanic.MechanicOverviewDto;
import com.car_backend.entities.User;
import com.car_backend.repository.UserRepository;
import com.car_backend.security.service.CurrentUserService;
import com.car_backend.service.MechanicService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/mechanic")
@RequiredArgsConstructor
@Slf4j
public class MechanicController {

    private final MechanicService mechanicService;
    private final CurrentUserService currentUserService;
    private final UserRepository userRepository;

    @PreAuthorize("hasRole('MECHANIC')")
    @GetMapping("/dashboard/overview")
    public ResponseEntity<MechanicOverviewDto> getMechanicOverview() {
        Long mechanicId = currentUserService.getUserId();
        log.info("Fetching mechanic dashboard overview for user {}", mechanicId);
        return ResponseEntity.ok(mechanicService.getMechanicOverview(mechanicId));
    }

    @PreAuthorize("hasRole('MECHANIC')")
    @GetMapping("/profile")
    public ResponseEntity<UserResponseDto> getMechanicProfile() {
        Long mechanicId = currentUserService.getUserId();
        User user = userRepository.findById(mechanicId)
                .orElseThrow(() -> new RuntimeException("Mechanic user profile not found"));
        UserResponseDto dto = new UserResponseDto();
        dto.setUserId(user.getId());
        dto.setUserName(user.getUserName());
        dto.setEmail(user.getEmail());
        dto.setMobile(user.getMobile());
        dto.setUserRole(user.getUserRole());
        dto.setIsActive(user.isActive());
        if (user.getManager() != null) {
            dto.setManagerId(user.getManager().getId());
            dto.setManagerName(user.getManager().getUserName());
        }
        return ResponseEntity.ok(dto);
    }
}
