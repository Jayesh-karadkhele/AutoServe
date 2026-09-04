import React, { useReducer, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { authReducer, initialAuthState } from './authReducer';
import { setAccessToken, clearAccessToken } from '../session/accessTokenStore';
import { registerSessionExpiredHandler } from '../../../lib/api/apiClient';
import {
  loginApi,
  registerApi,
  refreshApi,
  logoutApi,
  logoutAllApi,
  getCurrentUserApi,
} from '../api/authApi';
import type {
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from '../api/authContracts';
import {
  normalizeAuthResponse,
  normalizeUserResponse,
} from '../api/authContracts';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // Global Session Expiration Listener (triggered when single-flight refresh fails)
  useEffect(() => {
    registerSessionExpiredHandler(() => {
      clearAccessToken();
      dispatch({ type: 'LOGOUT' });
    });
    return () => {
      registerSessionExpiredHandler(null);
    };
  }, []);

  // Session Restoration Bootstrap on Application Mount
  useEffect(() => {
    let isMounted = true;

    const bootstrapSession = async () => {
      try {
        // Attempt silent refresh using HttpOnly cookie
        const refreshResult = await refreshApi();
        if (!isMounted) return;

        setAccessToken(refreshResult.token);

        // Fetch full profile of authenticated user
        const userDto = await getCurrentUserApi();
        if (!isMounted) return;

        const authUser = normalizeUserResponse(userDto);
        dispatch({ type: 'BOOTSTRAP_SUCCESS', payload: authUser });
      } catch {
        if (!isMounted) return;
        clearAccessToken();
        dispatch({ type: 'BOOTSTRAP_ANONYMOUS' });
      }
    };

    bootstrapSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginRequest): Promise<AuthUser> => {
    const authResponse = await loginApi(credentials);
    setAccessToken(authResponse.token);
    const user = normalizeAuthResponse(authResponse);
    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    return user;
  }, []);

  const register = useCallback(async (data: RegisterRequest): Promise<void> => {
    await registerApi(data);
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await logoutApi();
    } catch (err) {
      console.warn('[AutoServe Auth] Server logout request failed, clearing local session state', err);
    } finally {
      clearAccessToken();
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const logoutAll = useCallback(async (): Promise<void> => {
    try {
      await logoutAllApi();
    } catch (err) {
      console.warn('[AutoServe Auth] Server logout-all request failed, clearing local session state', err);
    } finally {
      clearAccessToken();
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const userDto = await getCurrentUserApi();
      const authUser = normalizeUserResponse(userDto);
      dispatch({ type: 'SET_USER', payload: authUser });
    } catch (err) {
      console.error('[AutoServe Auth] Failed to refresh user profile', err);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        logoutAll,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
