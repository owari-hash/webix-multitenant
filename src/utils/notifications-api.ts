import { backendRequest } from './backend-api';

// ----------------------------------------------------------------------

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
  action?: string | null;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  unread_count: number;
  limit: number;
  skip: number;
}

// ----------------------------------------------------------------------

export const notificationsApi = {
  /**
   * Get user notifications
   */
  async getNotifications(params?: {
    limit?: number;
    skip?: number;
    unread_only?: boolean;
  }): Promise<NotificationsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.skip) queryParams.append('skip', params.skip.toString());
    if (params?.unread_only) queryParams.append('unread_only', 'true');

    const queryString = queryParams.toString();
    const endpoint = `/notifications${queryString ? `?${queryString}` : ''}`;

    const response = await backendRequest<NotificationsResponse>(endpoint, {
      method: 'GET',
    });

    if (!response.success || !response.data) {
      throw new Error(response.message || response.error || 'Failed to get notifications');
    }

    return response.data;
  },

  /**
   * Mark notification as read
   */
  async markAsRead(id: string) {
    const response = await backendRequest(`/notifications/${id}/read`, {
      method: 'PUT',
    });

    if (!response.success) {
      throw new Error(response.message || response.error || 'Failed to mark notification as read');
    }

    return true;
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    const response = await backendRequest<{ updated_count?: number }>('/notifications/read-all', {
      method: 'PUT',
    });

    if (!response.success) {
      throw new Error(
        response.message || response.error || 'Failed to mark all notifications as read'
      );
    }

    return response.data?.updated_count || 0;
  },
};
