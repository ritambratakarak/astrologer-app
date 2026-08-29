import {apiClient} from '../api/client';
import {Endpoints} from '../api/endpoints';
import type {CustomerProfile, ProfileSetupRequest} from '../types/user';

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
};
