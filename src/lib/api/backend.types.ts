import { ItemStatus, ItemType, UserRole } from '../../types';

export interface BackendUserSummary {
  id: string;
  registrationNumber: number | null;
  fullName: string;
  uniEmail: string;
  personalEmail: string | null;
  phoneNumber: string | null;
  department: string | null;
  role: UserRole;
  verified: boolean;
}

export interface BackendAuthUserSummary {
  id: string;
  uniEmail: string;
  role: UserRole;
}

export interface BackendTokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: BackendAuthUserSummary;
  timestamp: string;
}

export interface BackendRegisterRequest {
  firstName: string;
  lastName?: string;
  personalEmail?: string;
  registrationNumber: number;
  uniEmail: string;
  phoneNumber: string;
  password: string;
  department?: string;
}

export interface BackendVerifyRegistrationRequest {
  uniEmail: string;
  token: string;
  otp: string;
}

export interface BackendRegisterResponse {
  uniEmail: string;
  token: string;
  otpTtlMinutes: number;
}

export interface BackendRegistrationVerificationResponse {
  uniEmail: string;
  message: string;
}

export interface BackendItemResponse {
  id: string;
  type: ItemType;
  title: string;
  description: string;
  status: ItemStatus;
  location: string;
  imageUrl: string;
  reportedByName: string;
  createdAt: string;
  eventFrom: string | null;
  eventTo: string | null;
  deskReceivedAt: string | null;
}

export interface BackendPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface BackendMatchItemView {
  id: string;
  type: ItemType;
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  status: ItemStatus;
  eventFrom: string | null;
  eventTo: string | null;
  createdAt: string;
  deskReceivedAt: string | null;
  dropOffDeadline: string | null;
}

export interface BackendStudentMatchResponse {
  id: string;
  status: BackendMatchStatus;
  yourRole: 'LOST_OWNER' | 'FOUND_OWNER';
  confidencePercent: number;
  finalScore: number;
  textScore: number;
  imageCompared: boolean;
  imageScore: number;
  timeScore: number;
  yourItem: BackendMatchItemView;
  otherItem: BackendMatchItemView;
  handoverKeyIssued: boolean;
  handoverKeyExpiresAt: string | null;
  nextStep: string;
  createdAt: string;
  reviewedAt: string | null;
  completedAt: string | null;
}

export type BackendMatchStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'EXPIRED';

export interface BackendDeskItemView {
  id: string;
  type: ItemType;
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  status: ItemStatus;
  eventFrom: string | null;
  eventTo: string | null;
  createdAt: string;
  dropOffDeadline: string | null;
  deskReceivedAt: string | null;
  reporterName: string;
  reporterRegistrationNumber: number;
  reporterUniEmail: string;
}

export interface BackendDeskMatchResponse {
  id: string;
  status: BackendMatchStatus;
  finalScore: number;
  textScore: number;
  imageCompared: boolean;
  imageScore: number;
  timeScore: number;
  lostItem: BackendDeskItemView;
  foundItem: BackendDeskItemView;
  createdAt: string;
  reviewedAt: string | null;
  reviewNote: string | null;
  handoverKeyExpiresAt: string | null;
  handoverFailedAttempts: number;
  completedAt: string | null;
}
