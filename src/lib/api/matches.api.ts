import { Match, MatchStatus } from '../../types';
import { UniTraceStorage } from '../storage';
import { apiRequest } from './client';

export const matchesApi = {
  async getMatches(status?: MatchStatus): Promise<Match[]> {
    try {
      const endpoint = status ? `/matches?status=${status}` : '/matches';
      return await apiRequest<Match[]>(endpoint);
    } catch {
      let matches = UniTraceStorage.getMatches();
      if (status) {
        matches = matches.filter(m => m.status === status);
      }
      return matches;
    }
  },

  async getStudentMatches(studentId: string): Promise<Match[]> {
    const allMatches = await this.getMatches();
    // Return matches where the student is either the lost item reporter or found item reporter
    return allMatches.filter(
      m => m.lostItem.reporterId === studentId || m.foundItem.reporterId === studentId
    );
  },

  async getMatchById(id: string): Promise<Match | null> {
    try {
      return await apiRequest<Match>(`/matches/${id}`);
    } catch {
      const matches = UniTraceStorage.getMatches();
      return matches.find(m => m.id === id) || null;
    }
  }
};
