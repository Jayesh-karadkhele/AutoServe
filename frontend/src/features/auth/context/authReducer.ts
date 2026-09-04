import type { AuthUser } from '../api/authContracts';

export type AuthStatus = 'bootstrapping' | 'authenticated' | 'anonymous' | 'error';

export interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  error: string | null;
}

export type AuthAction =
  | { type: 'BOOTSTRAP_SUCCESS'; payload: AuthUser }
  | { type: 'BOOTSTRAP_ANONYMOUS' }
  | { type: 'LOGIN_SUCCESS'; payload: AuthUser }
  | { type: 'SET_USER'; payload: AuthUser }
  | { type: 'LOGOUT' }
  | { type: 'SET_ERROR'; payload: string };

export const initialAuthState: AuthState = {
  status: 'bootstrapping',
  user: null,
  error: null,
};

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'BOOTSTRAP_SUCCESS':
      return {
        status: 'authenticated',
        user: action.payload,
        error: null,
      };
    case 'BOOTSTRAP_ANONYMOUS':
      return {
        status: 'anonymous',
        user: null,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        status: 'authenticated',
        user: action.payload,
        error: null,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'LOGOUT':
      return {
        status: 'anonymous',
        user: null,
        error: null,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};
