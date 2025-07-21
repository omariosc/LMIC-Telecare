// Authentication-related type definitions

import type {
  ID,
  Timestamp,
  EmailAddress,
  UserRole,
  Language,
  MedicalSpecialty,
  DeviceInfo,
  Location,
} from "./common";
import type { User, PublicUserProfile } from "./user";

// Authentication request types
export interface LoginRequest {
  email: EmailAddress;
  password: string;
  rememberMe?: boolean;
  deviceInfo?: DeviceInfo;
}

export interface RegisterRequest {
  email: EmailAddress;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: UserRole;

  // Optional fields
  specialties?: MedicalSpecialty[];
  gmcNumber?: string; // For UK specialists
  referralCode?: string; // For Gaza clinicians
  institution?: string;
  phoneNumber?: string;
  bio?: string;
  preferredLanguage?: Language;
  timezone?: string;

  // Terms and conditions
  acceptedTerms: boolean;
  acceptedPrivacyPolicy: boolean;
  acceptedCommunityGuidelines: boolean;
}

export interface PasswordResetRequest {
  email: EmailAddress;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface EmailVerificationRequest {
  email: EmailAddress;
}

export interface EmailVerificationConfirm {
  token: string;
  email: EmailAddress;
}

// Two-factor authentication
export interface Enable2FARequest {
  password: string;
}

export interface Verify2FARequest {
  code: string;
  backupCode?: string;
}

export interface Disable2FARequest {
  password: string;
  code?: string;
  backupCode?: string;
}

// Authentication response types
export interface LoginResponse {
  success: boolean;
  user: PublicUserProfile;
  token: string;
  refreshToken?: string;
  expiresAt: Timestamp;
  sessionId: ID;
  requiresEmailVerification?: boolean;
  requires2FA?: boolean;
  tempToken?: string; // For 2FA flow
}

export interface RegisterResponse {
  success: boolean;
  user: PublicUserProfile;
  message: string;
  requiresEmailVerification: boolean;
  requiresManualVerification?: boolean; // For professionals
}

export interface RefreshTokenResponse {
  token: string;
  expiresAt: Timestamp;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
}

export interface EmailVerificationResponse {
  success: boolean;
  message: string;
  user?: PublicUserProfile;
}

export interface Enable2FAResponse {
  qrCode: string;
  secret: string;
  backupCodes: string[];
}

// Authentication state types
export interface AuthState {
  isAuthenticated: boolean;
  user: PublicUserProfile | null;
  token: string | null;
  refreshToken: string | null;
  sessionId: ID | null;
  expiresAt: Timestamp | null;
  isLoading: boolean;
  error: string | null;

  // 2FA state
  requires2FA: boolean;
  tempToken: string | null;

  // Email verification state
  requiresEmailVerification: boolean;
  emailVerificationSent: boolean;
}

// JWT token payload
export interface JWTPayload {
  sub: ID; // User ID
  email: EmailAddress;
  role: UserRole;
  sessionId: ID;
  iat: number; // Issued at
  exp: number; // Expires at
  iss: string; // Issuer
  aud: string; // Audience

  // Custom claims
  emailVerified: boolean;
  identityVerified: boolean;
  specialties?: MedicalSpecialty[];
  preferredLanguage: Language;
}

// Session management
export interface AuthSession {
  id: ID;
  userId: ID;
  token: string;
  refreshToken?: string;
  deviceInfo?: DeviceInfo;
  ipAddress?: string;
  location?: Location;
  userAgent?: string;
  isActive: boolean;
  lastUsedAt: Timestamp;
  createdAt: Timestamp;
  expiresAt: Timestamp;

  // Security flags
  isSuspicious: boolean;
  riskScore?: number;

  // Session metadata
  loginMethod: "password" | "social" | "sso" | "2fa";
  deviceTrusted: boolean;
  sessionName?: string; // User-defined name for the session
}

// Social authentication (for future use)
export interface SocialAuthRequest {
  provider: "google" | "microsoft" | "apple";
  token: string;
  additionalData?: {
    firstName?: string;
    lastName?: string;
    role?: UserRole;
    specialties?: MedicalSpecialty[];
  };
}

export interface SocialAuthResponse {
  success: boolean;
  user: PublicUserProfile;
  token: string;
  expiresAt: Timestamp;
  isNewUser: boolean;
  requiresAdditionalInfo?: boolean;
}

// Account security
export interface SecuritySettings {
  userId: ID;
  twoFactorEnabled: boolean;
  backupCodesGenerated: boolean;
  backupCodesUsed: number;
  trustedDevices: TrustedDevice[];
  securityQuestions: SecurityQuestion[];
  lastPasswordChange: Timestamp;
  loginNotifications: boolean;
  suspiciousActivityNotifications: boolean;
  updatedAt: Timestamp;
}

export interface TrustedDevice {
  id: ID;
  deviceId: string;
  deviceName: string;
  deviceInfo: DeviceInfo;
  ipAddress?: string;
  location?: Location;
  trustedAt: Timestamp;
  lastUsedAt: Timestamp;
  isActive: boolean;
}

export interface SecurityQuestion {
  id: ID;
  question: string;
  answerHash: string; // Hashed answer
  createdAt: Timestamp;
}

// Account verification for professionals
export interface ProfessionalVerification {
  userId: ID;
  verificationType: "gmc" | "medical_license" | "institution" | "referee";
  status: "pending" | "in_review" | "approved" | "rejected" | "expired";

  // Submitted data
  submittedData: Record<string, unknown>;
  documents: string[]; // Document URLs

  // Verification process
  submittedAt: Timestamp;
  reviewStartedAt?: Timestamp;
  reviewedAt?: Timestamp;
  reviewedBy?: ID; // Admin who reviewed
  reviewNotes?: string;

  // Auto-verification (e.g., GMC API check)
  autoVerificationAttempted: boolean;
  autoVerificationResult?: "success" | "failed" | "inconclusive";
  autoVerificationData?: Record<string, unknown>;

  // Manual verification
  requiresManualReview: boolean;
  verificationScore?: number; // 0-100
  riskFlags?: string[];

  // Expiration and renewal
  expiresAt?: Timestamp;
  renewalReminderSent?: boolean;
}

// Rate limiting and security
export interface AuthRateLimitInfo {
  endpoint: string;
  userId?: ID;
  ipAddress?: string;
  requests: number;
  resetTime: Timestamp;
  blocked: boolean;
}

export interface SecurityEvent {
  id: ID;
  userId?: ID;
  eventType:
    | "failed_login"
    | "successful_login"
    | "password_change"
    | "suspicious_activity"
    | "account_locked";
  severity: "low" | "medium" | "high" | "critical";
  ipAddress?: string;
  userAgent?: string;
  location?: Location;
  metadata?: Record<string, unknown>;
  timestamp: Timestamp;
  resolved: boolean;
  resolvedBy?: ID;
  resolvedAt?: Timestamp;
}

// Authentication middleware types
export interface AuthMiddlewareOptions {
  required?: boolean;
  roles?: UserRole[];
  permissions?: string[];
  requireEmailVerification?: boolean;
  requireIdentityVerification?: boolean;
  allow2FABypass?: boolean;
}

export interface AuthContext {
  user: User | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isEmailVerified: boolean;
  isIdentityVerified: boolean;
}
