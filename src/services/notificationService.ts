import {apiClient} from '../api/client';
import {Endpoints} from '../api/endpoints';
import type {AppNotification} from '../types/notification';

export const notificationService = {
  async getNotifications(page = 1): Promise<AppNotification[]> {
    const {data} = await apiClient.get<AppNotification[]>(
      Endpoints.notifications.list,
      {params: {page}},
    );
    return data;
  },

  async markRead(id: string): Promise<void> {
    await apiClient.put(Endpoints.notifications.markRead(id));
  },

  async markAllRead(): Promise<void> {
    await apiClient.put(Endpoints.notifications.markAllRead);
  },
};
