import axios from 'axios';
import { getApiBaseUrl, getClientHeaderName, getClientHeaderValue } from './config';

/**
 * Public Authentication API Client
 * Configured with credentials support (for HttpOnly cookies) and custom client header.
 */
export const publicApiClient = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    [getClientHeaderName()]: getClientHeaderValue(),
  },
});
