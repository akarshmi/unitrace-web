export type UserRole = 'STUDENT' | 'MODERATOR' | 'ADMIN';

export interface User {
  id: string;
  fullName: string;
  registrationNumber: string;
  email: string;
  role: UserRole;
  department?: string;
  isEmailVerified: boolean;
  avatarUrl?: string;
  phoneMasked?: string;
}

export type ItemType = 'LOST' | 'FOUND';

export type ItemCategory = 
  | 'ELECTRONICS' 
  | 'DOCUMENTS_AND_CARDS' 
  | 'BAGS_AND_WALLETS' 
  | 'KEYS' 
  | 'ACCESSORIES' 
  | 'BOOKS_AND_STATIONERY' 
  | 'OTHER';

export type ItemStatus = 'OPEN' | 'MATCHED' | 'CLAIMED' | 'CLOSED';

export type PhysicalSubmissionStatus = 
  | 'NOT_APPLICABLE' // for LOST items
  | 'PENDING_SUBMISSION' // for FOUND items reported by student
  | 'RECEIVED_BY_DESK'; // verified and received physically by Security Office

export interface Item {
  id: string;
  title: string;
  type: ItemType;
  category: ItemCategory;
  description: string;
  imageUrl: string;
  additionalImages?: string[];
  location: string;
  eventDate: string; // ISO string or YYYY-MM-DD
  eventTime: string; // HH:mm
  status: ItemStatus;
  submissionStatus: PhysicalSubmissionStatus;
  submissionDeadline?: string; // e.g., "Today by 5:00 PM"
  receivedAt?: string;
  receivedByModeratorId?: string;
  reporterId: string;
  reporterRegNo: string;
  reporterNameMasked: string; // "A**** S****"
  deskNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentItem {
  id: string;
  title: string;
  type: ItemType;
  description: string;
  imageUrl: string;
  location: string;
  status: ItemStatus;
  eventFrom: string | null;
  eventTo: string | null;
  deskReceivedAt: string | null;
  createdAt: string;
}

export interface StudentMatchItem {
  id: string;
  title: string;
  type: ItemType;
  description: string;
  imageUrl: string;
  location: string;
  status: ItemStatus;
  eventFrom: string | null;
  eventTo: string | null;
  receivedAtDesk: boolean;
  dropOffDeadline: string | null;
}

export interface StudentMatch {
  id: string;
  status: string;
  yourRole: 'LOST_OWNER' | 'FOUND_OWNER';
  confidencePercent: number;
  otherItem: StudentMatchItem;
  handoverKeyExpiresAt: string | null;
  nextStep: string;
  createdAt: string;
}

export type MatchStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'CLAIMED';

export interface SimilarityBreakdown {
  textSimilarity: number; // 0.00 - 1.00
  imageSimilarity: number; // 0.00 - 1.00
  timeSimilarity: number; // 0.00 - 1.00
  finalScore: number; // 0.00 - 1.00
}

export interface Match {
  id: string;
  lostItemId: string;
  foundItemId: string;
  lostItem: Item;
  foundItem: Item;
  status: MatchStatus;
  similarity: SimilarityBreakdown;
  reviewedByModeratorId?: string;
  moderatorRemarks?: string;
  reviewedAt?: string;
  oneTimeHandoverKey?: string; // only authorized for verification / approved view
  handoverKeyExpiresAt?: string;
  keyVerificationAttempts: number; // max 3
  isKeyLocked: boolean;
  createdAt: string;
}

export interface ReceptionRecord {
  id: string;
  itemId: string;
  itemTitle: string;
  reporterRegNo: string;
  intakeCondition: 'MINT' | 'GOOD' | 'WORN' | 'DAMAGED';
  officerName: string;
  officerRegNo: string;
  storageBin: string;
  notes: string;
  receivedAt: string;
}

export interface HandoverLog {
  id: string;
  matchId: string;
  lostItemId: string;
  foundItemId: string;
  itemTitle: string;
  claimantRegNo: string;
  claimantName: string;
  moderatorId: string;
  moderatorName: string;
  handoverKeyUsed: string;
  completedAt: string;
  status: 'SUCCESS' | 'LOCKED' | 'FAILED_ATTEMPT';
  deskNotes: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'SUBMISSION_RECEIVED' | 'MATCH_FOUND' | 'MATCH_APPROVED' | 'COLLECTION_READY' | 'HANDOVER_COMPLETED';
  isRead: boolean;
  relatedItemId?: string;
  relatedMatchId?: string;
  createdAt: string;
}
