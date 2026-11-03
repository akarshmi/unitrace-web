import { StudentItem, StudentMatch, User } from '../../types';
import {
  BackendItemResponse,
  BackendDeskMatchResponse,
  BackendStudentMatchResponse,
  BackendUserSummary,
} from './backend.types';

export const adaptUser = (user: BackendUserSummary): User => ({
  id: user.id,
  fullName: user.fullName,
  registrationNumber: user.registrationNumber === null ? '' : String(user.registrationNumber),
  email: user.uniEmail,
  role: user.role,
  department: user.department || undefined,
  isEmailVerified: user.verified,
  phoneMasked: user.phoneNumber || undefined,
});

export const adaptStudentItem = (item: BackendItemResponse): StudentItem => ({
  id: item.id,
  type: item.type,
  title: item.title,
  description: item.description,
  status: item.status,
  location: item.location,
  imageUrl: item.imageUrl,
  createdAt: item.createdAt,
  eventFrom: item.eventFrom,
  eventTo: item.eventTo,
  deskReceivedAt: item.deskReceivedAt,
});

export const adaptItemResponse = adaptStudentItem;

export interface DeskMatch {
  id: string;
  status: BackendDeskMatchResponse['status'];
  finalScore: number;
  textScore: number;
  imageCompared: boolean;
  imageScore: number;
  timeScore: number;
  lostItem: BackendDeskMatchResponse['lostItem'];
  foundItem: BackendDeskMatchResponse['foundItem'];
  createdAt: string;
  reviewedAt: string | null;
  reviewNote: string | null;
  handoverKeyExpiresAt: string | null;
  handoverFailedAttempts: number;
  completedAt: string | null;
}

export const adaptDeskMatch = (match: BackendDeskMatchResponse): DeskMatch => ({
  ...match,
});

export const adaptStudentMatch = (match: BackendStudentMatchResponse): StudentMatch => ({
  id: match.id,
  status: match.status,
  yourRole: match.yourRole,
  confidencePercent: match.confidencePercent,
  finalScore: match.finalScore,
  textScore: match.textScore,
  imageCompared: match.imageCompared,
  imageScore: match.imageScore,
  timeScore: match.timeScore,
  yourItem: match.yourItem,
  otherItem: match.otherItem,
  handoverKeyIssued: match.handoverKeyIssued,
  handoverKeyExpiresAt: match.handoverKeyExpiresAt,
  nextStep: match.nextStep,
  createdAt: match.createdAt,
  reviewedAt: match.reviewedAt,
  completedAt: match.completedAt,
});
