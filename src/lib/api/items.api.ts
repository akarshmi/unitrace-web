import { Item, ItemCategory, ItemStatus, ItemType, PhysicalSubmissionStatus } from '../../types';
import { UniTraceStorage } from '../storage';
import { apiRequest } from './client';

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
  category: ItemCategory;
  description: string;
  imageUrl?: string;
  location: string;
  eventDate: string;
  eventTime: string;
  additionalImages?: string[];
}

export const itemsApi = {
  async getItems(filters: ItemFilters = {}): Promise<Item[]> {
    try {
      const params = new URLSearchParams();
      if (filters.type) params.set('type', filters.type);
      if (filters.category) params.set('category', filters.category);
      if (filters.status) params.set('status', filters.status);
      if (filters.search) params.set('query', filters.search);

      return await apiRequest<Item[]>(`/items?${params.toString()}`);
    } catch {
      let items = UniTraceStorage.getItems();

      if (filters.type) {
        items = items.filter(i => i.type === filters.type);
      }
      if (filters.category) {
        items = items.filter(i => i.category === filters.category);
      }
      if (filters.status) {
        items = items.filter(i => i.status === filters.status);
      }
      if (filters.submissionStatus) {
        items = items.filter(i => i.submissionStatus === filters.submissionStatus);
      }
      if (filters.reporterId) {
        items = items.filter(i => i.reporterId === filters.reporterId);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        items = items.filter(i =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q) ||
          i.reporterRegNo.toLowerCase().includes(q)
        );
      }

      return items;
    }
  },

  async getItemById(id: string): Promise<Item | null> {
    try {
      return await apiRequest<Item>(`/items/${id}`);
    } catch {
      const items = UniTraceStorage.getItems();
      return items.find(i => i.id === id) || null;
    }
  },

  async reportItem(payload: CreateItemPayload): Promise<Item> {
    const user = UniTraceStorage.getCurrentUser() || UniTraceStorage.getAllUsers()[0];
    
    // Default image if student doesn't provide photo
    const defaultImage = payload.imageUrl || (
      payload.category === 'ELECTRONICS' 
        ? '/src/assets/images/lost_silver_laptop_1793556900422.jpg'
        : payload.category === 'BAGS_AND_WALLETS'
        ? '/src/assets/images/lost_campus_backpack_1793556901682.jpg'
        : '/src/assets/images/lost_leather_wallet_1793556902318.jpg'
    );

    const submissionStatus: PhysicalSubmissionStatus = 
      payload.type === 'FOUND' ? 'PENDING_SUBMISSION' : 'NOT_APPLICABLE';
      
    const submissionDeadline = 
      payload.type === 'FOUND' ? 'Today by 5:00 PM (Security Office Block 29 Room 102)' : undefined;

    const maskedName = user.fullName
      .split(' ')
      .map(part => part[0] + '*'.repeat(Math.max(2, part.length - 1)))
      .join(' ');

    const newItem = UniTraceStorage.addItem({
      title: payload.title,
      type: payload.type,
      category: payload.category,
      description: payload.description,
      imageUrl: defaultImage,
      additionalImages: payload.additionalImages || [],
      location: payload.location,
      eventDate: payload.eventDate,
      eventTime: payload.eventTime,
      status: 'OPEN',
      submissionStatus,
      submissionDeadline,
      reporterId: user.id,
      reporterRegNo: user.registrationNumber,
      reporterNameMasked: maskedName,
    });

    return newItem;
  }
};
