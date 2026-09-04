package com.car_backend.service.auth;

import java.time.Duration;
import java.util.Locale;

import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.car_backend.config.AuthProperties;
import com.car_backend.dto.CreateUserDto;
import com.car_backend.dto.UserResponseDto;
import com.car_backend.dto.auth.AuthResponseDto;
import com.car_backend.dto.auth.LoginRequestDto;
import com.car_backend.dto.auth.RegisterRequestDto;
import com.car_backend.entities.AuthSession;
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
    private final AuthSessionService authSessionService;
    private final RefreshTokenService refreshTokenService;
    private final com.car_backend.repository.RefreshTokenRepository refreshTokenRepository;
    private final AuthProperties authProperties;

    @Override
    @Transactional
    public UserResponseDto register(RegisterRequestDto request) throws DuplicateEmailException {
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
        log.info("Customer registered successfully with ID: {}. No auto-login session created.", savedUser.getUserId());
        return savedUser;
    }

    @Override
    @Transactional
    public AuthResult login(LoginRequestDto request) {
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
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!user.isActive()) {
            throw new UnauthorizedException("User account is inactive");
        }

        // 1. Create database-backed authentication session
        AuthSession session = authSessionService.createSession(user);

        // 2. Issue short-lived JWT carrying sid
        String accessToken = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getUserRole(), session.getSessionId());

        // 3. Issue opaque refresh token and build HttpOnly cookie
        String rawRefreshToken = refreshTokenService.generateAndSaveRefreshToken(session);
        ResponseCookie cookie = createRefreshCookie(rawRefreshToken);

        AuthResponseDto responseDto = AuthResponseDto.builder()
                .token(accessToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .name(user.getUserName())
                .email(user.getEmail())
                .phone(user.getMobile())
                .role(user.getUserRole())
                .sessionId(session.getSessionId())
                .build();

        return new AuthResult(responseDto, cookie);
    }

    @Override
    @Transactional
    public AuthResult refresh(String rawRefreshToken) {
        if (rawRefreshToken == null || rawRefreshToken.trim().isEmpty()) {
            throw new UnauthorizedException("Missing refresh token cookie");
        }

        // 1. Rotate refresh token and retrieve matching session
        var rotationResult = refreshTokenService.rotateRefreshToken(rawRefreshToken);
        AuthSession session = rotationResult.tokenEntity().getSession();
        User user = session.getUser();

        if (!user.isActive()) {
            throw new UnauthorizedException("User account is inactive");
        }

        // 2. Generate new short-lived access token with session sid
        String newAccessToken = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getUserRole(), session.getSessionId());

        // 3. Build new HttpOnly cookie
        ResponseCookie newCookie = createRefreshCookie(rotationResult.newRawToken());

        AuthResponseDto responseDto = AuthResponseDto.builder()
                .token(newAccessToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .name(user.getUserName())
                .email(user.getEmail())
                .phone(user.getMobile())
                .role(user.getUserRole())
                .sessionId(session.getSessionId())
                .build();

        return new AuthResult(responseDto, newCookie);
    }

    @Override
    @Transactional
    public ResponseCookie logout(String bearerToken, String rawRefreshToken) {
        String sessionIdToRevoke = null;

        // Extract session ID from Bearer token if present
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            String jwt = bearerToken.substring(7);
            if (jwtUtil.validateToken(jwt)) {
                sessionIdToRevoke = jwtUtil.getSessionIdFromToken(jwt);
            }
        }

        // Or extract session ID from refresh token cookie if available
        if (sessionIdToRevoke == null && rawRefreshToken != null && !rawRefreshToken.trim().isEmpty()) {
            try {
                String tokenHash = refreshTokenService.hashToken(rawRefreshToken);
                var tokenOpt = refreshTokenRepository.findByTokenHash(tokenHash);
                if (tokenOpt.isPresent()) {
                    sessionIdToRevoke = tokenOpt.get().getSession().getSessionId();
                }
            } catch (Exception e) {
                log.debug("Logout refresh token lookup failed: {}", e.getMessage());
            }
        }

        if (sessionIdToRevoke != null) {
            authSessionService.revokeSession(sessionIdToRevoke, "USER_LOGOUT");
            refreshTokenService.revokeTokensForSession(sessionIdToRevoke);
        }

        return createClearRefreshCookie();
    }

    @Override
    @Transactional
    public ResponseCookie logoutAll(Long userId) {
        if (userId == null) {
            throw new UnauthorizedException("User not authenticated");
        }
        authSessionService.revokeAllUserSessions(userId, "USER_LOGOUT_ALL");
        return createClearRefreshCookie();
    }

    private ResponseCookie createRefreshCookie(String rawToken) {
        var builder = ResponseCookie.from(authProperties.getCookieName(), rawToken)
                .httpOnly(true)
                .secure(authProperties.isCookieSecure())
                .path(authProperties.getCookiePath())
                .maxAge(Duration.ofMillis(authProperties.getRefreshTokenExpirationMs()));

        if (authProperties.getCookieSameSite() != null && !authProperties.getCookieSameSite().isEmpty()) {
            builder.sameSite(authProperties.getCookieSameSite());
        }
        if (authProperties.getCookieDomain() != null && !authProperties.getCookieDomain().isEmpty()) {
            builder.domain(authProperties.getCookieDomain());
        }

        return builder.build();
    }

    private ResponseCookie createClearRefreshCookie() {
        var builder = ResponseCookie.from(authProperties.getCookieName(), "")
                .httpOnly(true)
                .secure(authProperties.isCookieSecure())
                .path(authProperties.getCookiePath())
                .maxAge(0);

        if (authProperties.getCookieSameSite() != null && !authProperties.getCookieSameSite().isEmpty()) {
            builder.sameSite(authProperties.getCookieSameSite());
        }
        if (authProperties.getCookieDomain() != null && !authProperties.getCookieDomain().isEmpty()) {
            builder.domain(authProperties.getCookieDomain());
        }

        return builder.build();
    }
}
