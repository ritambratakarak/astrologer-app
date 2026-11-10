export type NotificationCategory =
  | 'general'
  | 'wallet'
  | 'consultation'
  | 'promotion'
  | 'astrologer_status'
  | 'reminder'
  | (string & {});

export interface AppNotification {
  _id: string;
  userId: string;
  type: NotificationCategory;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface NotificationsPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface NotificationsResponse {
  status: number;
  success: boolean;
  data: {
    items: AppNotification[];
    pagination: NotificationsPagination;
  };
  message: string;
  requestId: string;
}
