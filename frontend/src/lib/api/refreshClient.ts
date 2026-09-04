import axios from 'axios';
import { getApiBaseUrl, getClientHeaderName, getClientHeaderValue } from './config';

/**
 * Dedicated Token Refresh API Client
 * Uses a separate Axios instance WITHOUT 401 response interceptors to prevent infinite refresh loops.
 */
export const refreshClient = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: {
    [getClientHeaderName()]: getClientHeaderValue(),
  },
});
