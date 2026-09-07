package com.car_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.car_backend.dto.CreateStaffDto;
import com.car_backend.dto.CreateUserDto;
import com.car_backend.dto.UpdateSelfProfileDto;
import com.car_backend.dto.UpdateUserDto;
import com.car_backend.dto.UserResponseDto;
import com.car_backend.entities.User;
import com.car_backend.security.service.CurrentUserService;
import com.car_backend.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final CurrentUserService currentUserService;

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getMyProfile() {
        Long currentUserId = currentUserService.getUserId();
        return ResponseEntity.ok(userService.getUserById(currentUserId));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponseDto> updateMyProfile(@RequestBody @Valid UpdateSelfProfileDto dto) {
        Long currentUserId = currentUserService.getUserId();
        UpdateUserDto updateDto = new UpdateUserDto();
        updateDto.setUserName(dto.getUserName());
        updateDto.setMobile(dto.getMobile());
        return ResponseEntity.ok(userService.updateUser(currentUserId, updateDto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<UserResponseDto> createStaff(@RequestBody @Valid CreateStaffDto dto) {
        CreateUserDto userDto = new CreateUserDto();
        userDto.setUserName(dto.getUserName());
        userDto.setEmail(dto.getEmail());
        userDto.setPassword(dto.getPassword());
        userDto.setUserRole(dto.getUserRole());
        userDto.setMobile(dto.getMobile());
        userDto.setSalary(dto.getSalary());
        userDto.setManagerId(dto.getManagerId());
        userDto.setActive(true);

        UserResponseDto created = userService.createUser(userDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getUsers")
    public ResponseEntity<?> getUsers() {
        return ResponseEntity.ok(userService.getUsers());
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.canViewUser(#userId)")
    @GetMapping("/getUserById/{userId}")
    public ResponseEntity<?> findById(@P("userId") @PathVariable("userId") Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@P("userId") @PathVariable("userId") Long userId, @RequestBody UpdateUserDto dto) {
        return ResponseEntity.ok(userService.updateUser(userId, dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@P("userId") @PathVariable("userId") Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok().body("User deactivated successfully");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/active")
    public ResponseEntity<?> getActiveUsers() {
        return ResponseEntity.ok(userService.findActiveUsers());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/customers")
    public ResponseEntity<?> getCustomers() {
        return ResponseEntity.ok(userService.getAllCustomers());
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.canViewUser(#customerId)")
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<?> getCustomer(@P("customerId") @PathVariable("customerId") Long customerId) {
        return ResponseEntity.ok(userService.getCustomerById(customerId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/managers")
    public ResponseEntity<?> getManagers() {
        return ResponseEntity.ok(userService.getAllManagers());
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.canViewUser(#managerId)")
    @GetMapping("/manager/{managerId}")
    public ResponseEntity<?> getManager(@P("managerId") @PathVariable("managerId") Long managerId) {
        return ResponseEntity.ok(userService.getManager(managerId));
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.isSelf(#managerId)")
    @GetMapping("/managers/{managerId}/mechanics")
    public ResponseEntity<?> getMechanicsUnderManager(@P("managerId") @PathVariable("managerId") Long managerId) {
        return ResponseEntity.ok(userService.getMechanicsUnderManager(managerId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/mechanics")
    public ResponseEntity<?> getMechanics() {
        return ResponseEntity.ok(userService.getAllMechanics());
    }

    @PreAuthorize("hasRole('ADMIN') or @accessControlService.canViewUser(#mechanicId)")
    @GetMapping("/mechanic/{mechanicId}")
    public ResponseEntity<?> getMechanic(@P("mechanicId") @PathVariable("mechanicId") Long mechanicId) {
        return ResponseEntity.ok(userService.getMechanic(mechanicId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/mechanics/{mechanicId}/assign_manager/{managerId}")
    public ResponseEntity<?> assignManager(@P("mechanicId") @PathVariable("mechanicId") Long mechanicId, @P("managerId") @PathVariable("managerId") Long managerId) {
        return ResponseEntity.ok(userService.assignManagerToMechanic(mechanicId, managerId));
    }
}
