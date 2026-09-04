import { describe, it, expect, beforeEach } from 'vitest';
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from '../session/accessTokenStore';

describe('In-Memory Access Token Security Store', () => {
  beforeEach(() => {
    clearAccessToken();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('16. Access token never enters localStorage when set', () => {
    setAccessToken('test-mock-jwt-token-123');
    expect(getAccessToken()).toBe('test-mock-jwt-token-123');
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('jwt')).toBeNull();
  });

  it('17. Access token never enters sessionStorage when set', () => {
    setAccessToken('test-mock-jwt-token-456');
    expect(getAccessToken()).toBe('test-mock-jwt-token-456');
    expect(sessionStorage.getItem('token')).toBeNull();
    expect(sessionStorage.getItem('accessToken')).toBeNull();
    expect(sessionStorage.getItem('jwt')).toBeNull();
  });

  it('clears access token cleanly from memory', () => {
    setAccessToken('test-token-to-clear');
    clearAccessToken();
    expect(getAccessToken()).toBeNull();
  });
});
