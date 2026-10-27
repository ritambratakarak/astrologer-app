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
  userType: UserRole;
}

export interface AuthResponse {
  tokens: AuthTokens;
  user: {
    id: string;
    phone: string;
    role: UserRole;
    isProfileComplete: boolean;
    name?: string;
    isApproved?: boolean;
  };
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface SendOtpResponse {
  status: number;
  success: boolean;
  data: {
    message: string;
    otp: string;
  };
  message: string;
  requestId: string;
}

export interface VerifyOtpApiResponse {
  status: number;
  success: boolean;
  data: {
    login?: boolean;
    accessToken?: string;
    tokens?: AuthTokens;
    user: {
      userId?: string;
      id?: string;
      userType?: UserRole;
      role?: UserRole;
      phone?: string;
      isProfileCreated?: boolean;
      isProfileComplete?: boolean;
      name?: string;
      fullName?: string;
    };
    refreshToken?: string;
    userType?: UserRole;
    isNewUser?: boolean;
  };
  message: string;
  requestId: string;
}
