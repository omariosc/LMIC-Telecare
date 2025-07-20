// User-related type definitions

import type {
  ID,
  UUID,
  Timestamp,
  EmailAddress,
  PhoneNumber,
  URL,
  UserRole,
  UserStatus,
  AvailabilityStatus,
  Language,
  MedicalSpecialty,
  Metadata,
  Location,
} from './common';

// Core User interface
export interface User extends Metadata {
  id: ID;
  email: EmailAddress;
  firstName: string;
  lastName: string;
  displayName?: string; // Computed: firstName + lastName
  role: UserRole;
  status: UserStatus;
  
  // Profile information
  bio?: string;
  profileImageUrl?: URL;
  specialties?: MedicalSpecialty[];
  
  // Professional credentials
  gmcNumber?: string; // UK General Medical Council number
  licenseNumber?: string; // Medical license number
  institution?: string; // Hospital or clinic affiliation
  department?: string; // Department within institution
  yearsOfExperience?: number;
  
  // Contact and location
  phoneNumber?: PhoneNumber;
  alternateEmail?: EmailAddress;
  location?: Location;
  timezone?: string;
  
  // Platform-specific settings
  preferredLanguage: Language;
  availabilityStatus: AvailabilityStatus;
  notificationPreferences?: NotificationPreferences;
  
  // Verification and security
  emailVerified: boolean;
  phoneVerified: boolean;
  identityVerified: boolean;
  backgroundCheckCompleted: boolean;
  
  // Professional verification
  verificationDocuments?: string[]; // Array of document URLs
  verificationNotes?: string;
  verifiedBy?: ID; // Admin who verified the user
  
  // Platform engagement
  points: number;
  volunteerHours: number;
  totalCasesHandled?: number;
  averageResponseTime?: number; // in minutes
  satisfactionRating?: number; // 1-5 scale
  
  // Activity tracking
  lastLoginAt?: Timestamp;
  lastActiveAt?: Timestamp;
  joinedAt: Timestamp;
  
  // Account management
  isActive: boolean;
  suspensionReason?: string;
  suspendedBy?: ID;
  suspendedAt?: Timestamp;
  
  // Referral system (for Gaza clinicians)
  referralCode?: string;
  referredBy?: ID;
  referralApproved?: boolean;
}

// Notification preferences
export interface NotificationPreferences {
  email: {
    newCases: boolean;
    caseResponses: boolean;
    caseAssignments: boolean;
    systemUpdates: boolean;
    weeklyDigest: boolean;
  };
  push: {
    newCases: boolean;
    urgentCases: boolean;
    caseResponses: boolean;
    mentions: boolean;
  };
  sms: {
    criticalCases: boolean;
    securityAlerts: boolean;
  };
  inApp: {
    all: boolean;
    sound: boolean;
    vibration: boolean;
  };
}

// Availability schedule
export interface AvailabilitySchedule {
  id: ID;
  userId: ID;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  timezone: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// User session
export interface UserSession {
  id: ID;
  userId: ID;
  tokenHash: string;
  deviceInfo?: {
    userAgent?: string;
    platform?: string;
    browser?: string;
    version?: string;
    isMobile?: boolean;
  };
  ipAddress?: string;
  location?: Location;
  createdAt: Timestamp;
  lastUsedAt: Timestamp;
  expiresAt: Timestamp;
  isActive: boolean;
}

// User statistics and analytics
export interface UserStats {
  userId: ID;
  totalCases: number;
  resolvedCases: number;
  averageResponseTime: number; // in minutes
  averageResolutionTime: number; // in hours
  satisfactionRating: number; // 1-5 scale
  totalPoints: number;
  volunteerHours: number;
  achievements: number;
  streakDays: number; // consecutive days active
  lastCalculatedAt: Timestamp;
}

// User preferences
export interface UserPreferences {
  userId: ID;
  theme: 'light' | 'dark' | 'auto';
  language: Language;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  timezone: string;
  autoTranslate: boolean;
  compactMode: boolean;
  soundEnabled: boolean;
  emailDigestFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
  caseFilters: {
    specialties?: MedicalSpecialty[];
    urgency?: string[];
    maxCasesPerDay?: number;
  };
  updatedAt: Timestamp;
}

// Professional verification data
export interface VerificationData {
  id: ID;
  userId: ID;
  verificationType: 'identity' | 'medical_license' | 'employment' | 'background_check';
  documentType: string; // e.g., 'passport', 'medical_license', 'employment_letter'
  documentUrl: URL;
  documentNumber?: string;
  issuedBy?: string; // Issuing authority
  issuedAt?: Timestamp;
  expiresAt?: Timestamp;
  verificationStatus: 'pending' | 'approved' | 'rejected' | 'expired';
  verifiedBy?: ID; // Admin who verified
  verificationNotes?: string;
  submittedAt: Timestamp;
  verifiedAt?: Timestamp;
}

// User activity log
export interface UserActivity {
  id: ID;
  userId: ID;
  action: 'login' | 'logout' | 'case_created' | 'case_responded' | 'profile_updated' | 'file_uploaded';
  resourceType?: 'case' | 'response' | 'user' | 'file';
  resourceId?: ID;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Timestamp;
}

// User achievement
export interface UserAchievement {
  id: ID;
  userId: ID;
  achievementType: string;
  title: string;
  description: string;
  iconUrl?: URL;
  pointsAwarded: number;
  badgeLevel?: 'bronze' | 'silver' | 'gold' | 'platinum';
  achievementData?: Record<string, unknown>;
  earnedAt: Timestamp;
  isVisible: boolean;
}

// Derived types for specific use cases

// Public user profile (safe for display)
export type PublicUserProfile = Pick<
  User,
  | 'id'
  | 'firstName'
  | 'lastName'
  | 'displayName'
  | 'role'
  | 'specialties'
  | 'bio'
  | 'profileImageUrl'
  | 'institution'
  | 'yearsOfExperience'
  | 'points'
  | 'volunteerHours'
  | 'satisfactionRating'
  | 'joinedAt'
  | 'availabilityStatus'
  | 'preferredLanguage'
> & {
  isOnline: boolean;
  lastActiveAt?: Timestamp;
};

// User profile for listings (minimal info)
export type UserListItem = Pick<
  User,
  | 'id'
  | 'firstName'
  | 'lastName'
  | 'role'
  | 'specialties'
  | 'profileImageUrl'
  | 'availabilityStatus'
  | 'points'
>;

// User profile for admin management
export type AdminUserView = Omit<User, 'verificationDocuments'> & {
  verificationDocuments: VerificationData[];
  stats: UserStats;
  recentActivity: UserActivity[];
};

// Search filters for users
export interface UserSearchFilters {
  role?: UserRole[];
  specialties?: MedicalSpecialty[];
  status?: UserStatus[];
  availabilityStatus?: AvailabilityStatus[];
  location?: {
    city?: string;
    region?: string;
    country?: string;
  };
  experience?: {
    min?: number;
    max?: number;
  };
  points?: {
    min?: number;
    max?: number;
  };
  isOnline?: boolean;
  verificationStatus?: boolean;
}