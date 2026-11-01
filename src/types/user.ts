export interface CustomerProfile {
  fullName: string;
  email?: string;
  profilePhoto?: string;
}

export interface AstrologerProfile {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  role: 'astrologer';
  bio: string;
  experience: number;
  languages: string[];
  specializations: string[];
  rating: number;
  reviewCount: number;
  totalSessions: number;
  walletBalance: number;
  isOnline: boolean;
  isApproved: boolean;
  chatRate: number;
  callRate: number;
  videoRate: number;
  chatEnabled: boolean;
  callEnabled: boolean;
  videoEnabled: boolean;
  createdAt: string;
}

export type UserProfile = CustomerProfile | AstrologerProfile;

export interface ProfileSetupRequest {
  fullName: string;
  email?: string;
  profilePhoto?: string;
}

export interface ProfileUpdateRequest {
  fullName?: string;
  email?: string;
  profilePhoto?: string;
}
