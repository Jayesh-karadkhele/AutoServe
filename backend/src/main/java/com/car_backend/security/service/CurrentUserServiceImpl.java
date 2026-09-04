package com.car_backend.security.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.car_backend.entities.Role;
import com.car_backend.entities.User;
import com.car_backend.exceptions.UnauthorizedException;
import com.car_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CurrentUserServiceImpl implements CurrentUserService {

    private final UserRepository userRepository;

    @Override
    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new UnauthorizedException("Authentication is required");
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Authenticated user not found"));

        if (!user.isActive()) {
            throw new UnauthorizedException("User account is inactive");
        }

        return user;
    }

    @Override
    public Long getUserId() {
        return getAuthenticatedUser().getId();
    }

    @Override
    public String getEmail() {
        return getAuthenticatedUser().getEmail();
    }

    @Override
    public Role getRole() {
        return getAuthenticatedUser().getUserRole();
    }

    @Override
    public boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated()
                && !"anonymousUser".equals(authentication.getPrincipal());
    }
}
