import { backendRequest } from './backend-api';

// ----------------------------------------------------------------------

export type FeedbackType = 'санал' | 'хүсэл' | 'гомдол';
export type FeedbackStatus = 'pending' | 'in_progress' | 'resolved' | 'closed';
export type FeedbackPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Feedback {
  _id: string;
  type: FeedbackType;
  title: string;
  content: string;
  user_id: string;
  user_name: string;
  user_email: string;
  organization_subdomain: string;
  status: FeedbackStatus;
  priority: FeedbackPriority;
  attachments?: string[];
  tags?: string[];
  response?: string;
  responded_by?: string;
  responded_at?: string;
  views?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeedbackData {
  type: FeedbackType;
  title: string;
  content: string;
  attachments?: string[];
  tags?: string[];
  priority?: FeedbackPriority;
}

export interface FeedbackListResponse {
  feedbacks: Feedback[];
  total: number;
  limit: number;
  skip: number;
}

export interface FeedbackStats {
  total: number;
  pending: number;
  resolved: number;
  by_type: Record<FeedbackType, number>;
  by_status: Record<FeedbackStatus, number>;
  by_priority: Record<FeedbackPriority, number>;
}

// ----------------------------------------------------------------------

export const feedbackApi = {
  /**
   * Create feedback
   */
  async createFeedback(data: CreateFeedbackData) {
    const response = await backendRequest<Feedback>('/feedback', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.success || !response.data) {
      throw new Error(response.message || response.error || 'Failed to create feedback');
    }

    return response.data;
  },

  /**
   * Get all feedback (Admin only)
   */
  async getAllFeedback(params?: {
    type?: FeedbackType;
    status?: FeedbackStatus;
    priority?: FeedbackPriority;
    limit?: number;
    skip?: number;
    sort?: string;
    order?: 'asc' | 'desc';
  }) {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.skip) queryParams.append('skip', params.skip.toString());
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.order) queryParams.append('order', params.order);

    const queryString = queryParams.toString();
    const endpoint = `/feedback${queryString ? `?${queryString}` : ''}`;

    const response = await backendRequest<FeedbackListResponse>(endpoint, {
      method: 'GET',
    });

    if (!response.success || !response.data) {
      throw new Error(response.message || response.error || 'Failed to get feedback');
    }

    return response.data;
  },

  /**
   * Get current user's feedback
   */
  async getMyFeedback(params?: {
    type?: FeedbackType;
    status?: FeedbackStatus;
    limit?: number;
    skip?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.skip) queryParams.append('skip', params.skip.toString());

    const queryString = queryParams.toString();
    const endpoint = `/feedback/my${queryString ? `?${queryString}` : ''}`;

    const response = await backendRequest<FeedbackListResponse>(endpoint, {
      method: 'GET',
    });

    if (!response.success || !response.data) {
      throw new Error(response.message || response.error || 'Failed to get feedback');
    }

    return response.data;
  },

  /**
   * Get feedback by ID
   */
  async getFeedbackById(id: string) {
    const response = await backendRequest<Feedback>(`/feedback/${id}`, {
      method: 'GET',
    });

    if (!response.success || !response.data) {
      throw new Error(response.message || response.error || 'Failed to get feedback');
    }

    return response.data;
  },

  /**
   * Respond to feedback (Admin only)
   */
  async respondToFeedback(id: string, response: string, status?: FeedbackStatus) {
    const responseData = await backendRequest<Feedback>(`/feedback/${id}/respond`, {
      method: 'PUT',
      body: JSON.stringify({ response, status }),
    });

    if (!responseData.success || !responseData.data) {
      throw new Error(
        responseData.message || responseData.error || 'Failed to respond to feedback'
      );
    }

    return responseData.data;
  },

  /**
   * Update feedback status (Admin only)
   */
  async updateFeedbackStatus(id: string, status?: FeedbackStatus, priority?: FeedbackPriority) {
    const response = await backendRequest<Feedback>(`/feedback/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, priority }),
    });

    if (!response.success || !response.data) {
      throw new Error(response.message || response.error || 'Failed to update feedback status');
    }

    return response.data;
  },

  /**
   * Delete feedback (soft delete)
   */
  async deleteFeedback(id: string) {
    const response = await backendRequest(`/feedback/${id}`, {
      method: 'DELETE',
    });

    if (!response.success) {
      throw new Error(response.message || response.error || 'Failed to delete feedback');
    }

    return true;
  },

  /**
   * Get feedback statistics (Admin only)
   */
  async getFeedbackStats() {
    const response = await backendRequest<FeedbackStats>('/feedback/stats', {
      method: 'GET',
    });

    if (!response.success || !response.data) {
      throw new Error(response.message || response.error || 'Failed to get feedback statistics');
    }

    return response.data;
  },
};

