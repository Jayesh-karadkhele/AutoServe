package com.car_backend.security.service;

import com.car_backend.entities.Role;
import com.car_backend.entities.User;

public interface CurrentUserService {

    User getAuthenticatedUser();

    Long getUserId();

    String getEmail();

    Role getRole();

    boolean isAuthenticated();
}
