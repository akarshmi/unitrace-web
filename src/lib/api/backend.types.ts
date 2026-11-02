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
  receivedAtDesk: boolean;
  dropOffDeadline: string | null;
}

export interface BackendStudentMatchResponse {
  id: string;
  status: string;
  yourRole: 'LOST_OWNER' | 'FOUND_OWNER';
  confidencePercent: number;
  otherItem: BackendMatchItemView;
  handoverKeyExpiresAt: string | null;
  nextStep: string;
  createdAt: string;
}
