import { Match, MatchStatus } from '../../types';
import { apiRequest } from './client';
import { BackendPage, BackendStudentMatchResponse } from './backend.types';
import { adaptStudentMatch } from './adapters';

export const matchesApi = {
  async getMyMatches(page = 0, size = 20) {
    const response = await apiRequest<BackendPage<BackendStudentMatchResponse>>(
      `/matches/mine?page=${page}&size=${size}`
    );
    return {
      ...response,
      content: response.content.map(adaptStudentMatch),
    };
  },

  async getMatches(status?: MatchStatus): Promise<Match[]> {
    const endpoint = status ? `/matches?status=${status}` : '/matches';
    return await apiRequest<Match[]>(endpoint);
  },

  async getStudentMatches(studentId: string): Promise<Match[]> {
    const allMatches = await this.getMatches();
    // Return matches where the student is either the lost item reporter or found item reporter
    return allMatches.filter(
      m => m.lostItem.reporterId === studentId || m.foundItem.reporterId === studentId
    );
  },

  async getMatchById(id: string): Promise<Match | null> {
    return await apiRequest<Match>(`/matches/${id}`);
  }
};
