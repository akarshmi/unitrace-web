import { HandoverLog, ReceptionRecord, User } from '../../types';
import { UniTraceStorage } from '../storage';
import { apiRequest } from './client';

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

export interface PhysicalIntakePayload {
  itemId: string;
  itemTitle: string;
  reporterRegNo: string;
  intakeCondition: 'MINT' | 'GOOD' | 'WORN' | 'DAMAGED';
  officerName: string;
  officerRegNo: string;
  storageBin: string;
  notes: string;
}

export const deskApi = {
  async getDeskStats(): Promise<DeskStats> {
    try {
      return await apiRequest<DeskStats>('/desk/statistics');
    } catch {
      const items = UniTraceStorage.getItems();
      const matches = UniTraceStorage.getMatches();
      const handovers = UniTraceStorage.getHandoverLogs();
      const receptions = UniTraceStorage.getReceptions();

      const totalReports = items.length;
      const pendingPhysicalSubmissions = items.filter(
        i => i.type === 'FOUND' && i.submissionStatus === 'PENDING_SUBMISSION'
      ).length;
      const receivedItems = items.filter(
        i => i.submissionStatus === 'RECEIVED_BY_DESK'
      ).length;
      const pendingAiMatches = matches.filter(m => m.status === 'PENDING_REVIEW').length;
      const approvedMatches = matches.filter(m => m.status === 'APPROVED').length;
      const pendingHandovers = matches.filter(m => m.status === 'APPROVED').length;
      const completedHandovers = handovers.filter(h => h.status === 'SUCCESS').length;
      const todaySubmissions = receptions.length;

      return {
        totalReports,
        pendingPhysicalSubmissions,
        receivedItems,
        pendingAiMatches,
        approvedMatches,
        pendingHandovers,
        completedHandovers,
        todaySubmissions,
      };
    }
  },

  async receivePhysicalItem(payload: PhysicalIntakePayload): Promise<ReceptionRecord> {
    try {
      return await apiRequest<ReceptionRecord>('/desk/submissions/receive', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch {
      return UniTraceStorage.recordPhysicalReception(payload);
    }
  },

  async getReceptionHistory(): Promise<ReceptionRecord[]> {
    return UniTraceStorage.getReceptions();
  },

  async approveMatch(matchId: string, remarks: string, moderator: User) {
    try {
      return await apiRequest(`/desk/matches/${matchId}/approve`, {
        method: 'POST',
        body: JSON.stringify({ remarks }),
      });
    } catch {
      return UniTraceStorage.approveMatch(matchId, moderator.id, remarks);
    }
  },

  async rejectMatch(matchId: string, remarks: string, moderator: User) {
    try {
      return await apiRequest(`/desk/matches/${matchId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ remarks }),
      });
    } catch {
      return UniTraceStorage.rejectMatch(matchId, moderator.id, remarks);
    }
  },

  async verifyHandover(
    matchId: string,
    claimantRegNo: string,
    keyEntered: string,
    officer: User,
    deskRemarks: string
  ) {
    try {
      return await apiRequest<{ success: boolean; message: string; remainingAttempts?: number; isLocked?: boolean }>(
        `/desk/handovers/${matchId}/verify`,
        {
          method: 'POST',
          body: JSON.stringify({ claimantRegNo, keyEntered, deskRemarks }),
        }
      );
    } catch {
      return UniTraceStorage.verifyHandover(matchId, claimantRegNo, keyEntered, officer, deskRemarks);
    }
  },

  async reissueHandoverKey(matchId: string) {
    return UniTraceStorage.reissueHandoverKey(matchId);
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
