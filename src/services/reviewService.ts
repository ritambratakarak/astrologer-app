import {apiClient} from '../api/client';
import {Endpoints} from '../api/endpoints';

export const reviewService = {
  async submitReview(payload: {
    consultationId: string;
    rating: number;
    comment?: string;
  }): Promise<void> {
    await apiClient.post(Endpoints.reviews.submit, payload);
  },
};
