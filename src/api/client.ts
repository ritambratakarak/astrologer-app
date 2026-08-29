import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import {API_BASE_URL} from '../constants';
import {tokenManager} from '../security/tokenManager';
import {Endpoints} from './endpoints';
import type {RefreshTokenResponse} from '../types/auth';

// Queue of failed requests waiting for token refresh
type QueueItem = {
  resolve: (value: string) => void;
  reject: (reason: unknown) => void;
};
let refreshQueue: QueueItem[] = [];
let isRefreshing = false;

function processQueue(error: unknown, token: string | null): void {
  refreshQueue.forEach(item => {
    if (error) {
      item.reject(error);
    } else if (token) {
      item.resolve(token);
    }
  });
  refreshQueue = [];
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Attach Bearer token to every request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// Handle 401 → refresh token → retry once
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Skip refresh for the refresh endpoint itself to avoid loops
    if (originalRequest.url?.includes(Endpoints.auth.refreshToken)) {
      tokenManager.clearAll();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        refreshQueue.push({resolve, reject});
      }).then(newToken => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const {data} = await axios.post<RefreshTokenResponse>(
        `${API_BASE_URL}${Endpoints.auth.refreshToken}`,
        {refreshToken},
        {headers: {'Content-Type': 'application/json'}},
      );

      tokenManager.updateAccessToken(data.accessToken);
      processQueue(null, data.accessToken);

      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      tokenManager.clearAll();
      // Signal auth store to logout — screens listen to store
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
