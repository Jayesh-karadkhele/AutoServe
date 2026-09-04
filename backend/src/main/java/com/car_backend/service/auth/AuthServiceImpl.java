package com.car_backend.service.auth;

import java.util.Locale;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.car_backend.dto.CreateUserDto;
import com.car_backend.dto.UserResponseDto;
import com.car_backend.dto.auth.AuthResponseDto;
import com.car_backend.dto.auth.LoginRequestDto;
import com.car_backend.dto.auth.RegisterRequestDto;
import com.car_backend.entities.Role;
import com.car_backend.entities.User;
import com.car_backend.exceptions.DuplicateEmailException;
import com.car_backend.exceptions.InvalidCredentialsException;
import com.car_backend.exceptions.UnauthorizedException;
import com.car_backend.repository.UserRepository;
import com.car_backend.security.jwt.JwtUtil;
import com.car_backend.service.UserServiceImpl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserServiceImpl userServiceImpl;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponseDto register(RegisterRequestDto request) throws DuplicateEmailException {
        String normalizedEmail = request.getEmail().trim().toLowerCase(Locale.ROOT);
        log.info("Registering new customer account for email: {}", normalizedEmail);

        CreateUserDto userDto = new CreateUserDto();
        userDto.setUserName(request.getName().trim());
        userDto.setEmail(normalizedEmail);
        userDto.setPassword(request.getPassword());
        userDto.setUserRole(Role.CUSTOMER); // Strictly CUSTOMER
        userDto.setMobile(request.getPhone().trim());
        userDto.setSalary(null);
        userDto.setManagerId(null);
        userDto.setActive(true);

        UserResponseDto savedUser = userServiceImpl.createUser(userDto);
        log.info("Customer registered successfully with ID: {}", savedUser.getUserId());

        String token = jwtUtil.generateToken(savedUser.getUserId(), savedUser.getEmail(), Role.CUSTOMER);

        return AuthResponseDto.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(savedUser.getUserId())
                .name(savedUser.getUserName())
                .email(savedUser.getEmail())
                .phone(savedUser.getMobile())
                .role(Role.CUSTOMER)
                .build();
    }

    @Override
    public AuthResponseDto login(LoginRequestDto request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase(Locale.ROOT);
        log.info("Login request for email: {}", normalizedEmail);

        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword()));
        } catch (Exception e) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));

        if (!user.isActive()) {
            throw new UnauthorizedException("User account is inactive");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getUserRole());

        return AuthResponseDto.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .name(user.getUserName())
                .email(user.getEmail())
                .phone(user.getMobile())
                .role(user.getUserRole())
                .build();
    }
}
