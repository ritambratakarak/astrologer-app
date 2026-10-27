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

    const responseData = apiResponse.data;
    const accessToken =
      responseData.accessToken ?? responseData.tokens?.accessToken;
    if (!accessToken) {
      throw new Error('OTP verification succeeded, but the access token was missing.');
    }

    const user = responseData.user;
    const authResponse: AuthResponse = {
      tokens: {
        accessToken,
        refreshToken: responseData.refreshToken ?? responseData.tokens?.refreshToken ?? '',
      },
      user: {
        id: user.userId ?? user.id ?? '',
        phone: user.phone ?? payload.phone,
        role: user.userType ?? user.role ?? responseData.userType ?? payload.userType,
        isProfileComplete:
          user.isProfileCreated ??
          user.isProfileComplete ??
          !(responseData.isNewUser ?? false),
        name: user.name ?? user.fullName,
      },
    };
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
