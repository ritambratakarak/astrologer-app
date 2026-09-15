import {apiClient} from '../api/client';
import {Endpoints} from '../api/endpoints';
import {tokenManager} from '../security/tokenManager';
import type {CustomerProfile, ProfileSetupRequest} from '../types/user';

interface CustomerProfileResponse {
  status: number;
  success: boolean;
  data: CustomerProfile;
  message: string;
  requestId: string;
}

export interface CustomerHomeData {
  recentAstrologers: Array<{
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    chatRate: number;
    callRate: number;
    videoRate: number;
  }>;
  recommendedAstrologers: Array<{
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    specializations: string[];
    chatRate: number;
  }>;
  upcomingConsultations: Array<{
    id: string;
    astrologerName: string;
    type: string;
    scheduledAt: string;
  }>;
}

export const customerService = {
  async getProfile(): Promise<CustomerProfile> {
    const {data} = await apiClient.get<CustomerProfile>(
      Endpoints.customer.profile,
    );
    return data;
  },

  async updateProfile(payload: ProfileSetupRequest): Promise<CustomerProfile> {
    const accessToken = tokenManager.getAccessToken();
    const {data: response} = await apiClient.patch<CustomerProfileResponse>(
      Endpoints.customer.updateProfile,
      payload,
      {
        headers: accessToken
          ? {Authorization: `Bearer ${accessToken}`}
          : undefined,
      },
    );
    return response.data;
  },

  async getHome(): Promise<CustomerHomeData> {
    const {data} = await apiClient.get<CustomerHomeData>(
      Endpoints.customer.home,
    );
    return data;
  },
};
