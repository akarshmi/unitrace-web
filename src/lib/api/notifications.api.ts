import { NotificationItem } from '../../types';
import { apiRequest } from './client';

export const notificationsApi = {
  async getNotifications(userId: string): Promise<NotificationItem[]> {
    return await apiRequest<NotificationItem[]>(`/notifications?userId=${userId}`);
  },

  async markAsRead(id: string): Promise<void> {
    await apiRequest(`/notifications/${id}/read`, { method: 'PATCH' });
  }
};
