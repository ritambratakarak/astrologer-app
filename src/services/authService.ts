import {apiClient} from '../api/client';
import {Endpoints} from '../api/endpoints';
import {tokenManager} from '../security/tokenManager';
import {csrfTokenManager} from '../security/csrfTokenManager';
import type {
  SendOtpRequest,
  VerifyOtpRequest,
  AuthResponse,
  SendOtpResponse,
  VerifyOtpApiResponse,
} from '../types/auth';

export const authService = {
  async sendOtp(payload: SendOtpRequest): Promise<SendOtpResponse> {
    const {data} = await apiClient.post<SendOtpResponse>(
      Endpoints.auth.sendOtp,
      payload,
    );
    return data;
  },

  async verifyOtp(payload: VerifyOtpRequest): Promise<AuthResponse> {
    const {data: apiResponse} = await apiClient.post<VerifyOtpApiResponse>(
      Endpoints.auth.verifyOtp,
      payload,
    );
    
    // Transform API response to AuthResponse format
    const authResponse: AuthResponse = {
      tokens: {
        accessToken: apiResponse.data.accessToken,
        refreshToken: apiResponse.data.refreshToken,
      },
      user: {
        id: apiResponse.data.user.userId,
        phone: apiResponse.data.user.phone,
        role: apiResponse.data.user.userType,
        isProfileComplete: apiResponse.data.user.isProfileCreated,
      },
    };
    
    tokenManager.saveTokens(authResponse.tokens);
    tokenManager.saveRole(authResponse.user.role);
    tokenManager.saveUserId(authResponse.user.id);
    return authResponse;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(Endpoints.auth.logout);
    } catch {
      // Always clear local tokens even if server call fails
    } finally {
      tokenManager.clearAll();
      csrfTokenManager.clearCsrfToken();
    }
  },
};
