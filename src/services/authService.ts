import {apiClient} from '../api/client';
import {Endpoints} from '../api/endpoints';
import {tokenManager} from '../security/tokenManager';
import type {
  SendOtpRequest,
  VerifyOtpRequest,
  AuthResponse,
} from '../types/auth';

export const authService = {
  async sendOtp(payload: SendOtpRequest): Promise<{message: string}> {
    const {data} = await apiClient.post<{message: string}>(
      Endpoints.auth.sendOtp,
      payload,
    );
    return data;
  },

  async verifyOtp(payload: VerifyOtpRequest): Promise<AuthResponse> {
    const {data} = await apiClient.post<AuthResponse>(
      Endpoints.auth.verifyOtp,
      payload,
    );
    tokenManager.saveTokens(data.tokens);
    tokenManager.saveRole(data.user.role);
    tokenManager.saveUserId(data.user.id);
    return data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(Endpoints.auth.logout);
    } catch {
      // Always clear local tokens even if server call fails
    } finally {
      tokenManager.clearAll();
    }
  },
};
