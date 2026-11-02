import { NotificationItem } from '../../types';
import { UniTraceStorage } from '../storage';
import { apiRequest } from './client';

export const notificationsApi = {
  async getNotifications(userId: string): Promise<NotificationItem[]> {
    try {
      return await apiRequest<NotificationItem[]>(`/notifications?userId=${userId}`);
    } catch {
      return UniTraceStorage.getNotifications(userId);
    }
  },

  async markAsRead(id: string): Promise<void> {
    try {
      await apiRequest(`/notifications/${id}/read`, { method: 'PATCH' });
    } catch {
      UniTraceStorage.markNotificationRead(id);
    }
  }
};
