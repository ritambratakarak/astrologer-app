export type NotificationCategory =
  | 'session'
  | 'wallet'
  | 'review'
  | 'request'
  | 'system'
  | 'approval';

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  isRead: boolean;
  data?: Record<string, string>;
  createdAt: string;
}
