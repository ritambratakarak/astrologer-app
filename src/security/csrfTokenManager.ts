import axios from 'axios';
import { createMMKV } from 'react-native-mmkv'
import {TOKEN_KEYS, CSRF_TOKEN_URL} from '../constants';

const secureStorage = createMMKV({id: 'astro-csrf-store'});

export const csrfTokenManager = {
  saveCsrfToken(token: string): void {
    secureStorage.set(TOKEN_KEYS.CSRF, token);
  },

  getCsrfToken(): string | undefined {
    return secureStorage.getString(TOKEN_KEYS.CSRF);
  },

  clearCsrfToken(): void {
    secureStorage.remove(TOKEN_KEYS.CSRF);
  },

  async fetchCsrfToken(): Promise<string> {
    try {
      const response = await axios.get<{ csrfToken: string }>(CSRF_TOKEN_URL, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      const csrfToken = response.data.csrfToken;
      this.saveCsrfToken(csrfToken);
      return csrfToken;
    } catch (error) {
      throw error;
    }
  },

  async getOrFetchCsrfToken(): Promise<string> {
    let token = this.getCsrfToken();
    if (!token) {
      token = await this.fetchCsrfToken();
    }
    return token;
  },
};
