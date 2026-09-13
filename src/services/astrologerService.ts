import {apiClient} from '../api/client';
import {Endpoints} from '../api/endpoints';
import type {
  Astrologer,
  AstrologerListResponse,
  AstrologerFilter,
  AstrologerReview,
} from '../types/astrologer';
import type {AstrologerProfile} from '../types/user';
import type {Consultation} from '../types/consultation';

export interface AstrologerRates {
  chatRate: number;
  callRate: number;
  videoRate: number;
}

export interface AstrologerDashboard {
  todayEarnings: number;
  monthEarnings: number;
  rating: number;
  walletBalance: number;
  todaySessions: number;
  monthSessions: number;
}

export interface AstrologerEarnings {
  todayEarnings: number;
  weekEarnings: number;
  monthEarnings: number;
  totalEarnings: number;
  chartData: Array<{
    date: string;
    amount: number;
  }>;
}

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

  async updateRates(payload: AstrologerRates): Promise<void> {
    await apiClient.put(Endpoints.astrologer.updateRates, payload);
  },

  async getDashboard(): Promise<AstrologerDashboard> {
    const {data} = await apiClient.get<AstrologerDashboard>(
      Endpoints.astrologer.dashboard,
    );
    return data;
  },

  async getSessions(page = 1): Promise<Consultation[]> {
    const {data} = await apiClient.get<Consultation[]>(
      Endpoints.astrologer.sessions,
      {params: {page}},
    );
    return data;
  },

  async getEarnings(): Promise<AstrologerEarnings> {
    const {data} = await apiClient.get<AstrologerEarnings>(
      Endpoints.astrologer.earnings,
    );
    return data;
  },
};
