package com.car_backend.security;

import org.springframework.security.crypto.password.PasswordEncoder;
import com.car_backend.entities.Role;
import com.car_backend.entities.User;
import com.car_backend.repository.UserRepository;
import com.car_backend.security.jwt.JwtUtil;

public class SecurityTestUtils {

    public static User createUser(UserRepository userRepository, PasswordEncoder passwordEncoder,
                                  String name, String email, String password, Role role, String mobile, User manager, boolean active) {
        User u = new User();
        u.setUserName(name);
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode(password));
        u.setUserRole(role);
        u.setMobile(mobile);
        u.setManager(manager);
        u.setActive(active);
        return userRepository.save(u);
    }

    public static String createToken(JwtUtil jwtUtil, User user) {
        return jwtUtil.generateToken(user.getId(), user.getEmail(), user.getUserRole());
    }
}
