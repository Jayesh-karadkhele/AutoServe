package com.car_backend.service;

import com.car_backend.dto.auth.ChangePasswordDto;
import com.car_backend.dto.auth.ForgotPasswordRequestDto;
import com.car_backend.dto.auth.ResetPasswordRequestDto;
import com.car_backend.entities.User;

public interface AccountSecurityService {

    void changePassword(User currentUser, ChangePasswordDto dto);

    void requestForgotPassword(ForgotPasswordRequestDto dto);

    void resetPassword(ResetPasswordRequestDto dto);
}
