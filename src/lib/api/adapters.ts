import { StudentItem, StudentMatch, User } from '../../types';
import {
  BackendItemResponse,
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

export const adaptStudentMatch = (match: BackendStudentMatchResponse): StudentMatch => ({
  id: match.id,
  status: match.status,
  yourRole: match.yourRole,
  confidencePercent: match.confidencePercent,
  otherItem: match.otherItem,
  handoverKeyExpiresAt: match.handoverKeyExpiresAt,
  nextStep: match.nextStep,
  createdAt: match.createdAt,
});
