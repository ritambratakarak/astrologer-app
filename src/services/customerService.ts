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

interface ProfilePhotoUploadResponse {
  success: boolean;
  message?: string;
  url: string;
}

interface ProfilePhotoUploadApiResponse {
  success: boolean;
  message?: string;
  url?: string;
  data?: {
    url?: string;
    avatar?: string;
  };
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
    const {data: response} = await apiClient.get<CustomerProfileResponse>(
      Endpoints.customer.profile,
    );
    return response.data;
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

  async uploadProfilePhoto(image: {
    path: string;
    mime: string;
    filename?: string;
  }): Promise<ProfilePhotoUploadResponse> {
    const accessToken = tokenManager.getAccessToken();
    if (!accessToken) {
      throw new Error('You must be signed in to upload a profile photo.');
    }

    const formData = new FormData();
    formData.append('photo', {
      uri: image.path,
      name: image.filename ?? 'profile-photo.jpg',
      type: image.mime,
    });

    const {data: response} = await apiClient.post<ProfilePhotoUploadApiResponse>(
      Endpoints.customer.uploadProfilePhoto,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!response.success) {
      throw new Error(response.message || 'Profile photo upload failed.');
    }
    const url = response.url ?? response.data?.url ?? response.data?.avatar;
    if (typeof url !== 'string' || !url.trim()) {
      throw new Error('Profile photo upload response did not include a URL.');
    }
    return {
      success: response.success,
      message: response.message,
      url,
    };
  },

  async getHome(): Promise<CustomerHomeData> {
    const {data} = await apiClient.get<CustomerHomeData>(
      Endpoints.customer.home,
    );
    return data;
  },
};
