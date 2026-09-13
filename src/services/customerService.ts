import {apiClient} from '../api/client';
import {Endpoints} from '../api/endpoints';
import type {CustomerProfile, ProfileSetupRequest} from '../types/user';

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
    const {data} = await apiClient.put<CustomerProfile>(
      Endpoints.customer.updateProfile,
      payload,
    );
    return data;
  },

  async getHome(): Promise<CustomerHomeData> {
    const {data} = await apiClient.get<CustomerHomeData>(
      Endpoints.customer.home,
    );
    return data;
  },
};
