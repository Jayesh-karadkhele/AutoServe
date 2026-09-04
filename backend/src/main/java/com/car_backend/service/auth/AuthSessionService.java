package com.car_backend.service.auth;

import com.car_backend.entities.AuthSession;
import com.car_backend.entities.User;

public interface AuthSessionService {
    AuthSession createSession(User user);
    boolean isSessionActive(String sessionId);
    void updateSessionLastUsed(String sessionId);
    void revokeSession(String sessionId, String reason);
    void revokeAllUserSessions(Long userId, String reason);
}
