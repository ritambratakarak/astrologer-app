import {apiClient} from '../api/client';
import {Endpoints} from '../api/endpoints';
import type {NotificationsResponse} from '../types/notification';

export const notificationService = {
  async getNotifications(page = 1, limit = 20): Promise<NotificationsResponse> {
    const {data: response} = await apiClient.get<NotificationsResponse>(
      Endpoints.notifications.list,
      {params: {page, limit}},
    );
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Could not load notifications.');
    }
    return response;
  },

  async markRead(notificationId: string): Promise<void> {
    await apiClient.patch(Endpoints.notifications.markRead(notificationId));
  },

  async markAllRead(): Promise<void> {
    await apiClient.patch(Endpoints.notifications.markAllRead);
  },
};
