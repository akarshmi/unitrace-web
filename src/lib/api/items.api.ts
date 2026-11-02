import { ItemCategory, ItemStatus, ItemType, PhysicalSubmissionStatus, StudentItem } from '../../types';
import { apiRequest } from './client';
import { BackendItemResponse, BackendPage } from './backend.types';
import { adaptItemResponse, adaptStudentItem } from './adapters';

export interface ItemFilters {
  type?: ItemType;
  category?: ItemCategory;
  status?: ItemStatus;
  submissionStatus?: PhysicalSubmissionStatus;
  search?: string;
  reporterId?: string;
}

export interface CreateItemPayload {
  title: string;
  type: ItemType;
  description: string;
  location: string;
  eventFrom: string;
  eventTo: string;
  image: File;
}

export const itemsApi = {
  async getMyItems(page = 0, size = 20) {
    const response = await apiRequest<BackendPage<BackendItemResponse>>(
      `/users/me/items?page=${page}&size=${size}`
    );
    return {
      ...response,
      content: response.content.map(adaptStudentItem),
    };
  },

  async getItems(filters: ItemFilters = {}) {
    const params = new URLSearchParams();
    if (filters.type) params.set('type', filters.type);
    if (filters.category) params.set('category', filters.category);
    if (filters.status) params.set('status', filters.status);
    if (filters.search) params.set('query', filters.search);

    return await apiRequest<BackendPage<BackendItemResponse>>(`/items?${params.toString()}`);
  },

  async getItemById(id: string): Promise<StudentItem> {
    const response = await apiRequest<BackendItemResponse>(`/items/${id}`);
    return adaptItemResponse(response);
  },

  async updateStatus(id: string, status: ItemStatus): Promise<StudentItem> {
    const response = await apiRequest<BackendItemResponse>(`/items/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return adaptItemResponse(response);
  },

  async reportItem(payload: CreateItemPayload): Promise<StudentItem> {
    const formData = new FormData();
    formData.append('type', payload.type);
    formData.append('title', payload.title.trim());
    formData.append('description', payload.description.trim());
    formData.append('location', payload.location.trim());
    formData.append('eventFrom', payload.eventFrom);
    formData.append('eventTo', payload.eventTo);
    formData.append('image', payload.image, payload.image.name);

    const response = await apiRequest<BackendItemResponse>('/items', {
      method: 'POST',
      body: formData,
    });
    return adaptItemResponse(response);
  }
};
