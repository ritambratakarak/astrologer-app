import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import {API_BASE_URL} from '../constants';
import {tokenManager} from '../security/tokenManager';
import {csrfTokenManager} from '../security/csrfTokenManager';
import {Endpoints} from './endpoints';
import type {RefreshTokenApiResponse} from '../types/auth';

const TOKEN_EXPIRY_BUFFER_MS = 30_000;
let refreshPromise: Promise<string> | null = null;

function decodeBase64Url(value: string): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  let decoded = '';
  let buffer = 0;
  let bits = 0;

  for (const character of base64) {
    if (character === '=') {
      break;
    }

    const digit = alphabet.indexOf(character);
    if (digit < 0) {
      throw new Error('Invalid JWT payload encoding.');
    }

    buffer = buffer * 64 + digit;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      const remainingBitValue = 2 ** bits;
      decoded += String.fromCharCode(Math.floor(buffer / remainingBitValue) % 256);
      buffer %= remainingBitValue;
    }
  }

  return decoded;
}

function isAccessTokenExpired(token: string): boolean {
  const payload = token.split('.')[1];
  if (!payload) {
    return false;
  }

  try {
    const claims = JSON.parse(decodeBase64Url(payload)) as {exp?: unknown};
    return (
      typeof claims.exp === 'number' &&
      claims.exp * 1000 <= Date.now() + TOKEN_EXPIRY_BUFFER_MS
    );
  } catch (error) {
    console.warn('Could not inspect access token expiry; relying on the API response.', error);
    return false;
  }
}

async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = tokenManager.getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token is available.');
  }

  refreshPromise = (async () => {
    let csrfToken: string | undefined;
    try {
      csrfToken = await csrfTokenManager.getOrFetchCsrfToken();
    } catch (error) {
      console.warn('Failed to attach CSRF token to refresh request:', error);
    }

    try {
      const {data: apiResponse} = await axios.post<RefreshTokenApiResponse>(
        `${API_BASE_URL}${Endpoints.auth.refreshToken}`,
        {refreshToken},
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(csrfToken ? {'x-csrf-token': csrfToken} : {}),
          },
        },
      );

      const responseData = apiResponse.data;
      const accessToken =
        responseData.accessToken ?? responseData.tokens?.accessToken;
      const nextRefreshToken =
        responseData.refreshToken ?? responseData.tokens?.refreshToken;
      if (typeof accessToken !== 'string' || !accessToken) {
        throw new Error('Token refresh succeeded, but the access token was missing.');
      }

      tokenManager.updateAccessToken(accessToken);
      if (nextRefreshToken) {
        tokenManager.updateRefreshToken(nextRefreshToken);
      }
      return accessToken;
    } catch (error) {
      tokenManager.clearAll();
      throw error;
    }
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Attach Bearer token and CSRF token to every request
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    let token = tokenManager.getAccessToken();
    if (token && isAccessTokenExpired(token) && tokenManager.getRefreshToken()) {
      token = await refreshAccessToken();
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Fetch and attach CSRF token
    try {
      const csrfToken = await csrfTokenManager.getOrFetchCsrfToken();
      config.headers['x-csrf-token'] = csrfToken;
    } catch (error) {
      console.warn('Failed to attach CSRF token:', error);
      // Continue with request even if CSRF token fetch fails
    }
    
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// Handle unexpected 401 responses by refreshing and retrying once.
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {_retry?: boolean})
      | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      !originalRequest.headers.Authorization
    ) {
      return Promise.reject(error);
    }

    // Skip refresh for the refresh endpoint itself to avoid loops
    if (originalRequest.url?.includes(Endpoints.auth.refreshToken)) {
      tokenManager.clearAll();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const accessToken = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);
