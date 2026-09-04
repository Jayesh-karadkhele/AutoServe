/**
 * AutoServe In-Memory Access Token Store
 * Access tokens are stored exclusively in JavaScript memory and NEVER persisted
 * in localStorage, sessionStorage, cookies, or window variables.
 */

let currentAccessToken: string | null = null;

export const getAccessToken = (): string | null => {
  return currentAccessToken;
};

export const setAccessToken = (token: string | null): void => {
  currentAccessToken = token;
};

export const clearAccessToken = (): void => {
  currentAccessToken = null;
};
