import { createMMKV } from 'react-native-mmkv'
import {TOKEN_KEYS} from '../constants';
import type {AuthTokens, UserRole} from '../types/auth';

// Dedicated MMKV instance for auth tokens — separate from general storage
const secureStorage = createMMKV({id: 'astro-auth-store'});

export const tokenManager = {
  saveTokens(tokens: AuthTokens): void {
    secureStorage.set(TOKEN_KEYS.ACCESS, tokens.accessToken);
    secureStorage.set(TOKEN_KEYS.REFRESH, tokens.refreshToken);
  },

  getAccessToken(): string | undefined {
    return secureStorage.getString(TOKEN_KEYS.ACCESS);
  },

  getRefreshToken(): string | undefined {
    return secureStorage.getString(TOKEN_KEYS.REFRESH);
  },

  saveRole(role: UserRole): void {
    secureStorage.set(TOKEN_KEYS.ROLE, role);
  },

  getRole(): UserRole | undefined {
    const role = secureStorage.getString(TOKEN_KEYS.ROLE);
    return role as UserRole | undefined;
  },

  saveUserId(id: string): void {
    secureStorage.set(TOKEN_KEYS.USER_ID, id);
  },

  getUserId(): string | undefined {
    return secureStorage.getString(TOKEN_KEYS.USER_ID);
  },

  updateAccessToken(accessToken: string): void {
    secureStorage.set(TOKEN_KEYS.ACCESS, accessToken);
  },

  clearAll(): void {
    secureStorage.remove(TOKEN_KEYS.ACCESS);
    secureStorage.remove(TOKEN_KEYS.REFRESH);
    secureStorage.remove(TOKEN_KEYS.ROLE);
    secureStorage.remove(TOKEN_KEYS.USER_ID);
  },

  hasValidSession(): boolean {
    const token = secureStorage.getString(TOKEN_KEYS.ACCESS);
    const role = secureStorage.getString(TOKEN_KEYS.ROLE);
    return Boolean(token && role);
  },
};
