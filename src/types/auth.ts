export type UserRole = 'customer' | 'astrologer';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SendOtpRequest {
  phone: string;
  countryCode: string;
  role: UserRole;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
  role: UserRole;
}

export interface AuthResponse {
  tokens: AuthTokens;
  user: {
    id: string;
    phone: string;
    role: UserRole;
    isProfileComplete: boolean;
    isApproved?: boolean;
  };
}

export interface RefreshTokenResponse {
  accessToken: string;
}
