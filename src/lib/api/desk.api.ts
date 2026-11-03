import { HandoverLog } from '../../types';
import { UniTraceStorage } from '../storage';
import { apiRequest } from './client';
import {
  BackendDeskMatchResponse,
  BackendItemResponse,
  BackendMatchStatus,
  BackendPage,
} from './backend.types';
import { DeskMatch, adaptDeskMatch } from './adapters';

export interface DeskStats {
  totalReports: number;
  pendingPhysicalSubmissions: number;
  receivedItems: number;
  pendingAiMatches: number;
  approvedMatches: number;
  pendingHandovers: number;
  completedHandovers: number;
  todaySubmissions: number;
}

export const deskApi = {
  async getReceivableItems(page = 0, size = 20): Promise<BackendPage<BackendItemResponse>> {
    return apiRequest<BackendPage<BackendItemResponse>>(
      `/items?type=FOUND&status=OPEN&page=${page}&size=${size}`
    );
  },

  async getMatches(status: BackendMatchStatus, page = 0, size = 20) {
    const response = await apiRequest<BackendPage<BackendDeskMatchResponse>>(
      `/desk/matches?status=${status}&page=${page}&size=${size}`
    );
    return {
      ...response,
      content: response.content.map(adaptDeskMatch),
    };
  },

  async getMatch(matchId: string): Promise<DeskMatch> {
    const response = await apiRequest<BackendDeskMatchResponse>(`/desk/matches/${matchId}`);
    return adaptDeskMatch(response);
  },

  async getDeskStats(): Promise<DeskStats> {
    return await apiRequest<DeskStats>('/desk/statistics');
  },

  async receivePhysicalItem(itemId: string): Promise<BackendItemResponse> {
    return await apiRequest<BackendItemResponse>(`/desk/items/${itemId}/receive`, {
      method: 'POST',
    });
  },

  async approveMatch(matchId: string, note: string) {
    const response = await apiRequest<BackendDeskMatchResponse>(`/desk/matches/${matchId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    });
    return adaptDeskMatch(response);
  },

  async rejectMatch(matchId: string, note: string) {
    const response = await apiRequest<BackendDeskMatchResponse>(`/desk/matches/${matchId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    });
    return adaptDeskMatch(response);
  },

  async completeHandover(matchId: string, handoverKey: string, verifiedRegistrationNumber: number) {
    const response = await apiRequest<BackendDeskMatchResponse>(
      `/desk/matches/${matchId}/complete`,
      {
        method: 'POST',
        body: JSON.stringify({ handoverKey, verifiedRegistrationNumber }),
      }
    );
    return adaptDeskMatch(response);
  },

  async reissueHandoverKey(matchId: string) {
    const response = await apiRequest<BackendDeskMatchResponse>(
      `/desk/matches/${matchId}/reissue-key`,
      { method: 'POST' }
    );
    return adaptDeskMatch(response);
  },

  async getHandoverLogs(): Promise<HandoverLog[]> {
    return UniTraceStorage.getHandoverLogs();
  },

  async lookupStudent(regNo: string) {
    const cleanReg = regNo.trim().toUpperCase();
    const users = UniTraceStorage.getAllUsers();
    const user = users.find(u => u.registrationNumber.toUpperCase() === cleanReg);

    const items = UniTraceStorage.getItems().filter(
      i => i.reporterRegNo.toUpperCase() === cleanReg
    );

    const matches = UniTraceStorage.getMatches().filter(
      m => m.lostItem.reporterRegNo.toUpperCase() === cleanReg ||
           m.foundItem.reporterRegNo.toUpperCase() === cleanReg
    );

    const handovers = UniTraceStorage.getHandoverLogs().filter(
      h => h.claimantRegNo.toUpperCase() === cleanReg
    );

    return {
      student: user || {
        id: `unknown-${cleanReg}`,
        fullName: 'Registered Student',
        registrationNumber: cleanReg,
        email: `${cleanReg.toLowerCase()}@lpu.in`,
        role: 'STUDENT' as const,
        department: 'School of Technology',
        isEmailVerified: true,
      },
      items,
      matches,
      handovers,
    };
  }
};
