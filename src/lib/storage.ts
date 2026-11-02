import { 
  Item, 
  Match, 
  User, 
  NotificationItem, 
  ReceptionRecord, 
  HandoverLog 
} from '../types';

const STORAGE_KEYS = {
  USERS: 'unitrace_users_v2',
  CURRENT_USER: 'unitrace_current_user_v2',
  ITEMS: 'unitrace_items_v2',
  MATCHES: 'unitrace_matches_v2',
  NOTIFICATIONS: 'unitrace_notifications_v2',
  RECEPTIONS: 'unitrace_receptions_v2',
  HANDOVERS: 'unitrace_handovers_v2',
  AUTH_STATE: 'unitrace_auth_state_v2',
};

// Streamlined, professional university users (no clutter)
const DEFAULT_USERS: User[] = [
  {
    id: 'user-student-1',
    fullName: 'Akarsh Mishra',
    registrationNumber: '12204598',
    email: 'akarsh.12204598@lpu.in',
    role: 'STUDENT',
    department: 'School of Computer Science & Engineering',
    isEmailVerified: true,
    phoneMasked: '+91 98*** **412'
  },
  {
    id: 'user-moderator-1',
    fullName: 'Insp. Vikram Rawat',
    registrationNumber: 'SEC-8821',
    email: 'security.desk@lpu.in',
    role: 'MODERATOR',
    department: 'Central Security Office (Block 29)',
    isEmailVerified: true,
    phoneMasked: '+91 99*** **880'
  },
  {
    id: 'user-admin-1',
    fullName: 'Dr. Anita Roy',
    registrationNumber: 'ADM-0104',
    email: 'admin.unitrace@lpu.in',
    role: 'ADMIN',
    department: 'Dean of Student Welfare',
    isEmailVerified: true,
  }
];

// Clean, realistic 5 items (no fake database bloat)
const DEFAULT_ITEMS: Item[] = [
  {
    id: 'ITEM-1001',
    title: 'Apple MacBook Air 13" (Silver)',
    type: 'LOST',
    category: 'ELECTRONICS',
    description: 'Silver MacBook Air in a dark gray sleeve. Left on a study table in the quiet section.',
    imageUrl: '/src/assets/images/lost_silver_laptop_1793556900422.jpg',
    location: 'Central Library, Level 3',
    eventDate: '2026-10-30',
    eventTime: '14:30',
    status: 'MATCHED',
    submissionStatus: 'NOT_APPLICABLE',
    reporterId: 'user-student-1',
    reporterRegNo: '12204598',
    reporterNameMasked: 'A**** M****',
    createdAt: '2026-10-30T15:00:00Z',
    updatedAt: '2026-10-31T09:00:00Z',
  },
  {
    id: 'ITEM-1002',
    title: 'Silver Laptop with Gray Protective Case',
    type: 'FOUND',
    category: 'ELECTRONICS',
    description: 'Found on table near books. Safely handed over to the desk officer.',
    imageUrl: '/src/assets/images/lost_silver_laptop_1793556900422.jpg',
    location: 'Central Library, Level 3 Table 12',
    eventDate: '2026-10-30',
    eventTime: '15:45',
    status: 'MATCHED',
    submissionStatus: 'RECEIVED_BY_DESK',
    submissionDeadline: 'Completed',
    receivedAt: '2026-10-30T16:30:00Z',
    receivedByModeratorId: 'user-moderator-1',
    reporterId: 'user-student-2',
    reporterRegNo: '12219430',
    reporterNameMasked: 'R**** K****',
    deskNotes: 'Vault Locker B-04. Intact condition.',
    createdAt: '2026-10-30T16:00:00Z',
    updatedAt: '2026-10-31T09:00:00Z',
  },
  {
    id: 'ITEM-1003',
    title: 'Wireless Over-Ear Headphones (Black)',
    type: 'LOST',
    category: 'ELECTRONICS',
    description: 'Black headphones left on the front row seat after lecture.',
    imageUrl: '/src/assets/images/lost_wireless_headphones_1793556901856.jpg',
    location: 'Block 34, Auditorium 2',
    eventDate: '2026-10-31',
    eventTime: '11:15',
    status: 'OPEN',
    submissionStatus: 'NOT_APPLICABLE',
    reporterId: 'user-student-1',
    reporterRegNo: '12204598',
    reporterNameMasked: 'A**** M****',
    createdAt: '2026-10-31T11:45:00Z',
    updatedAt: '2026-10-31T11:45:00Z',
  },
  {
    id: 'ITEM-1004',
    title: 'Navy Campus Backpack with Water Bottle',
    type: 'LOST',
    category: 'BAGS_AND_WALLETS',
    description: 'Dark blue backpack with student notebooks and bottle in side pocket.',
    imageUrl: '/src/assets/images/lost_campus_backpack_1793556901682.jpg',
    location: 'Student UniMall Ground Foyer',
    eventDate: '2026-11-01',
    eventTime: '08:45',
    status: 'OPEN',
    submissionStatus: 'NOT_APPLICABLE',
    reporterId: 'user-student-1',
    reporterRegNo: '12204598',
    reporterNameMasked: 'A**** M****',
    createdAt: '2026-11-01T09:00:00Z',
    updatedAt: '2026-11-01T09:00:00Z',
  },
  {
    id: 'ITEM-1005',
    title: 'Brown Leather Bifold Wallet & Steel Flask',
    type: 'FOUND',
    category: 'BAGS_AND_WALLETS',
    description: 'Left on the reading table after seminar.',
    imageUrl: '/src/assets/images/lost_leather_wallet_1793556902318.jpg',
    location: 'Law Faculty Reading Room',
    eventDate: '2026-11-01',
    eventTime: '09:50',
    status: 'OPEN',
    submissionStatus: 'PENDING_SUBMISSION',
    submissionDeadline: 'Today by 5:00 PM (Security Office Block 29)',
    reporterId: 'user-student-1',
    reporterRegNo: '12204598',
    reporterNameMasked: 'A**** M****',
    createdAt: '2026-11-01T10:00:00Z',
    updatedAt: '2026-11-01T10:00:00Z',
  }
];

// Clean, realistic match records (simple, human scores)
const DEFAULT_MATCHES: Match[] = [
  {
    id: 'MATCH-101',
    lostItemId: 'ITEM-1001',
    foundItemId: 'ITEM-1002',
    lostItem: DEFAULT_ITEMS[0],
    foundItem: DEFAULT_ITEMS[1],
    status: 'APPROVED',
    similarity: {
      textSimilarity: 0.94,
      imageSimilarity: 0.96,
      timeSimilarity: 0.92,
      finalScore: 0.95,
    },
    reviewedByModeratorId: 'user-moderator-1',
    moderatorRemarks: 'Visual details, sleeve color, and room location match.',
    reviewedAt: '2026-10-31T09:30:00Z',
    oneTimeHandoverKey: 'UT-8942',
    handoverKeyExpiresAt: '2026-11-05T18:00:00Z',
    keyVerificationAttempts: 0,
    isKeyLocked: false,
    createdAt: '2026-10-30T17:30:00Z',
  }
];

// Clean notifications
const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-01',
    userId: 'user-student-1',
    title: 'Match Approved for Collection',
    message: 'The Security Office approved the match for your Apple MacBook Air. Visit Block 29 Room 102 with your student card and key UT-8942.',
    type: 'MATCH_APPROVED',
    isRead: false,
    relatedItemId: 'ITEM-1001',
    relatedMatchId: 'MATCH-101',
    createdAt: '2026-10-31T09:30:00Z',
  },
  {
    id: 'NOTIF-02',
    userId: 'user-student-1',
    title: 'Drop-off Reminder',
    message: 'Please hand in the Brown Leather Wallet at the Security Desk before 5:00 PM today.',
    type: 'SUBMISSION_RECEIVED',
    isRead: true,
    relatedItemId: 'ITEM-1005',
    createdAt: '2026-11-01T10:05:00Z',
  }
];

export const UniTraceStorage = {
  getCurrentUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  removeCurrentUser(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getAllUsers(): User[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_USERS;
    }
  },

  getItems(): Item[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ITEMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(DEFAULT_ITEMS));
      return DEFAULT_ITEMS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_ITEMS;
    }
  },

  saveItems(items: Item[]): void {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  },

  addItem(newItem: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Item {
    const items = this.getItems();
    const id = `ITEM-${1000 + items.length + 1}`;
    const now = new Date().toISOString();
    const fullItem: Item = {
      ...newItem,
      id,
      createdAt: now,
      updatedAt: now,
    };
    items.unshift(fullItem);
    this.saveItems(items);
    return fullItem;
  },

  updateItem(id: string, updates: Partial<Item>): Item | null {
    const items = this.getItems();
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return null;
    items[idx] = {
      ...items[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveItems(items);
    return items[idx];
  },

  getMatches(): Match[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MATCHES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(DEFAULT_MATCHES));
      return DEFAULT_MATCHES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_MATCHES;
    }
  },

  saveMatches(matches: Match[]): void {
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
  },

  approveMatch(matchId: string, moderatorId: string, remarks: string): Match | null {
    const matches = this.getMatches();
    const match = matches.find(m => m.id === matchId);
    if (!match) return null;

    const oneTimeKey = `UT-${Math.floor(1000 + Math.random() * 9000)}`;
    const expiresAt = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();

    match.status = 'APPROVED';
    match.reviewedByModeratorId = moderatorId;
    match.moderatorRemarks = remarks;
    match.reviewedAt = new Date().toISOString();
    match.oneTimeHandoverKey = oneTimeKey;
    match.handoverKeyExpiresAt = expiresAt;

    this.saveMatches(matches);

    this.updateItem(match.lostItemId, { status: 'MATCHED' });
    this.updateItem(match.foundItemId, { status: 'MATCHED' });

    this.addNotification({
      userId: match.lostItem.reporterId,
      title: 'Match Approved by Security Office',
      message: `Your report for "${match.lostItem.title}" was approved. Collect at Security Desk (Block 29 Room 102) using Key ${oneTimeKey}.`,
      type: 'MATCH_APPROVED',
      isRead: false,
      relatedItemId: match.lostItemId,
      relatedMatchId: match.id,
    });

    return match;
  },

  rejectMatch(matchId: string, moderatorId: string, remarks: string): Match | null {
    const matches = this.getMatches();
    const match = matches.find(m => m.id === matchId);
    if (!match) return null;

    match.status = 'REJECTED';
    match.reviewedByModeratorId = moderatorId;
    match.moderatorRemarks = remarks;
    match.reviewedAt = new Date().toISOString();

    this.saveMatches(matches);
    return match;
  },

  verifyHandover(
    matchId: string, 
    claimantRegNo: string, 
    keyEntered: string, 
    officer: User, 
    deskRemarks: string
  ): { success: boolean; message: string; remainingAttempts?: number; isLocked?: boolean } {
    const matches = this.getMatches();
    const match = matches.find(m => m.id === matchId);

    if (!match) {
      return { success: false, message: 'Match record not found.' };
    }

    if (match.status === 'CLAIMED') {
      return { success: false, message: 'Item already claimed and returned.' };
    }

    if (match.isKeyLocked) {
      return { 
        success: false, 
        message: 'Security lockout: Maximum attempts reached. Desk Supervisor re-authorization required.',
        isLocked: true 
      };
    }

    const normalizedEnteredReg = claimantRegNo.trim().toUpperCase();
    const expectedReg = match.lostItem.reporterRegNo.trim().toUpperCase();

    if (normalizedEnteredReg !== expectedReg) {
      return { 
        success: false, 
        message: `Registration number ${claimantRegNo} does not match the claimant on this report.` 
      };
    }

    const normalizedKey = keyEntered.trim().toUpperCase();
    const expectedKey = match.oneTimeHandoverKey?.trim().toUpperCase();

    if (normalizedKey !== expectedKey) {
      match.keyVerificationAttempts = (match.keyVerificationAttempts || 0) + 1;
      const remaining = 3 - match.keyVerificationAttempts;

      if (match.keyVerificationAttempts >= 3) {
        match.isKeyLocked = true;
        this.saveMatches(matches);
        return { 
          success: false, 
          message: 'Incorrect key. 3 attempts exceeded. Handover locked.', 
          remainingAttempts: 0, 
          isLocked: true 
        };
      }

      this.saveMatches(matches);
      return { 
        success: false, 
        message: `Invalid key. ${remaining} attempt(s) remaining.`, 
        remainingAttempts: remaining 
      };
    }

    match.status = 'CLAIMED';
    this.saveMatches(matches);

    this.updateItem(match.lostItemId, { status: 'CLAIMED' });
    this.updateItem(match.foundItemId, { status: 'CLAIMED' });

    this.recordHandoverLog({
      matchId: match.id,
      lostItemId: match.lostItemId,
      foundItemId: match.foundItemId,
      itemTitle: match.lostItem.title,
      claimantRegNo,
      claimantName: match.lostItem.reporterNameMasked,
      moderatorId: officer.id,
      moderatorName: officer.fullName,
      handoverKeyUsed: normalizedKey,
      completedAt: new Date().toISOString(),
      status: 'SUCCESS',
      deskNotes: deskRemarks || 'Identity verified; item returned in good order.'
    });

    this.addNotification({
      userId: match.lostItem.reporterId,
      title: 'Item Returned Successfully',
      message: `Your item "${match.lostItem.title}" has been handed over. Status updated to CLAIMED.`,
      type: 'HANDOVER_COMPLETED',
      isRead: false,
      relatedItemId: match.lostItemId,
      relatedMatchId: match.id,
    });

    return { 
      success: true, 
      message: 'Key verified. Property handed over. Records updated to CLAIMED.' 
    };
  },

  reissueHandoverKey(matchId: string): Match | null {
    const matches = this.getMatches();
    const match = matches.find(m => m.id === matchId);
    if (!match) return null;

    const newKey = `UT-${Math.floor(1000 + Math.random() * 9000)}`;
    match.oneTimeHandoverKey = newKey;
    match.keyVerificationAttempts = 0;
    match.isKeyLocked = false;
    match.handoverKeyExpiresAt = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();

    this.saveMatches(matches);
    return match;
  },

  recordPhysicalReception(record: Omit<ReceptionRecord, 'id' | 'receivedAt'>): ReceptionRecord {
    const raw = localStorage.getItem(STORAGE_KEYS.RECEPTIONS);
    const receptions: ReceptionRecord[] = raw ? JSON.parse(raw) : [];
    const newRecord: ReceptionRecord = {
      ...record,
      id: `REC-${Date.now().toString().slice(-4)}`,
      receivedAt: new Date().toISOString()
    };
    receptions.unshift(newRecord);
    localStorage.setItem(STORAGE_KEYS.RECEPTIONS, JSON.stringify(receptions));

    this.updateItem(record.itemId, {
      submissionStatus: 'RECEIVED_BY_DESK',
      receivedAt: newRecord.receivedAt,
      deskNotes: `Locker ${record.storageBin}. Condition: ${record.intakeCondition}.`
    });

    return newRecord;
  },

  getReceptions(): ReceptionRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.RECEPTIONS);
    return raw ? JSON.parse(raw) : [];
  },

  recordHandoverLog(log: Omit<HandoverLog, 'id'>): HandoverLog {
    const raw = localStorage.getItem(STORAGE_KEYS.HANDOVERS);
    const handovers: HandoverLog[] = raw ? JSON.parse(raw) : [];
    const newLog: HandoverLog = {
      ...log,
      id: `HND-${Date.now().toString().slice(-4)}`
    };
    handovers.unshift(newLog);
    localStorage.setItem(STORAGE_KEYS.HANDOVERS, JSON.stringify(handovers));
    return newLog;
  },

  getHandoverLogs(): HandoverLog[] {
    const raw = localStorage.getItem(STORAGE_KEYS.HANDOVERS);
    return raw ? JSON.parse(raw) : [];
  },

  getNotifications(userId: string): NotificationItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const notifs: NotificationItem[] = raw ? JSON.parse(raw) : DEFAULT_NOTIFICATIONS;
    return notifs.filter(n => n.userId === userId);
  },

  addNotification(notif: Omit<NotificationItem, 'id' | 'createdAt'>): void {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const notifs: NotificationItem[] = raw ? JSON.parse(raw) : DEFAULT_NOTIFICATIONS;
    const item: NotificationItem = {
      ...notif,
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString()
    };
    notifs.unshift(item);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },

  markNotificationRead(id: string): void {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) return;
    const notifs: NotificationItem[] = JSON.parse(raw);
    const target = notifs.find(n => n.id === id);
    if (target) {
      target.isRead = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    }
  }
};
