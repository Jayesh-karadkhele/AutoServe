/**
 * AutoServe Environment Configuration & Validation
 */

export const getApiBaseUrl = (): string => {
  const url = import.meta.env.VITE_API_BASE_URL;
  if (!url || typeof url !== 'string' || !url.trim()) {
    console.warn('[AutoServe] VITE_API_BASE_URL missing or empty. Falling back to http://localhost:8081');
    return 'http://localhost:8081';
  }
  return url.trim().replace(/\/+$/, '');
};

export const getClientHeaderName = (): string => {
  return 'X-AutoServe-Client';
};

export const getClientHeaderValue = (): string => {
  return import.meta.env.VITE_AUTOSERVE_CLIENT_HEADER || 'web';
};
