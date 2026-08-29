import {apiClient} from '../api/client';
import {Endpoints} from '../api/endpoints';
import type {
  Astrologer,
  AstrologerListResponse,
  AstrologerFilter,
  AstrologerReview,
} from '../types/astrologer';
import type {AstrologerProfile} from '../types/user';

export const astrologerService = {
  async listAstrologers(
    filter: AstrologerFilter = {},
    page = 1,
  ): Promise<AstrologerListResponse> {
    const {data} = await apiClient.get<AstrologerListResponse>(
      Endpoints.astrologers.list,
      {params: {...filter, page}},
    );
    return data;
  },

  async getAstrologer(id: string): Promise<Astrologer> {
    const {data} = await apiClient.get<Astrologer>(
      Endpoints.astrologers.detail(id),
    );
    return data;
  },

  async getAstrologerReviews(
    id: string,
    page = 1,
  ): Promise<AstrologerReview[]> {
    const {data} = await apiClient.get<AstrologerReview[]>(
      Endpoints.astrologers.reviews(id),
      {params: {page}},
    );
    return data;
  },

  // Self-profile (for logged-in astrologer)
  async getSelfProfile(): Promise<AstrologerProfile> {
    const {data} = await apiClient.get<AstrologerProfile>(
      Endpoints.astrologer.profile,
    );
    return data;
  },

  async updateSelfProfile(
    payload: Partial<AstrologerProfile>,
  ): Promise<AstrologerProfile> {
    const {data} = await apiClient.put<AstrologerProfile>(
      Endpoints.astrologer.updateProfile,
      payload,
    );
    return data;
  },

  async updateAvailability(payload: {
    isOnline: boolean;
    chatEnabled: boolean;
    callEnabled: boolean;
    videoEnabled: boolean;
  }): Promise<void> {
    await apiClient.put(Endpoints.astrologer.updateAvailability, payload);
  },

  async getDashboard(): Promise<{
    todayEarnings: number;
    monthEarnings: number;
    rating: number;
    walletBalance: number;
    todaySessions: number;
    monthSessions: number;
  }> {
    const {data} = await apiClient.get(Endpoints.astrologer.dashboard);
    return data;
  },
};
