// Shared API types for the Telecare Platform

export type UserRole = 'gaza_clinician' | 'uk_specialist' | 'admin';
export type UserStatus = 'pending' | 'verified' | 'suspended' | 'inactive';
export type AvailabilityStatus = 'available' | 'busy' | 'offline';
export type Language = 'en' | 'ar';

export type PatientGender = 'male' | 'female' | 'other' | 'not_specified';
export type CaseUrgency = 'low' | 'medium' | 'high' | 'critical';
export type CaseStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export type ResponseType = 'consultation' | 'question' | 'clarification' | 'follow_up';
export type AssignmentType = 'primary' | 'secondary' | 'observer';
export type AssignmentStatus = 'active' | 'completed' | 'declined';

export type UploadPurpose = 'case_attachment' | 'response_attachment' | 'profile_image' | 'verification_document';
export type NotificationType = 'new_case' | 'case_response' | 'case_assignment' | 'system_message' | 'achievement';
export type AchievementType = 'first_response' | 'helpful_response' | 'quick_response' | 'specialist_of_month' | 'volunteer_hours';

// API Response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  specialties?: string[];
  gmcNumber?: string;
  verificationDocuments?: string[];
  referralCode?: string;
  preferredLanguage: Language;
  timezone?: string;
  availabilityStatus: AvailabilityStatus;
  profileImageUrl?: string;
  bio?: string;
  points: number;
  volunteerHours: number;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  emailVerifiedAt?: string;
  verificationRequestedAt?: string;
  verificationCompletedAt?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  preferredLanguage?: Language;
  specialties?: string[];
  gmcNumber?: string;
  referralCode?: string;
  bio?: string;
  timezone?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  specialties?: string[];
  preferredLanguage?: Language;
  timezone?: string;
  availabilityStatus?: AvailabilityStatus;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  token: string;
  expiresAt: string;
}

// Medical Case types
export interface MedicalCase {
  id: string;
  title: string;
  description: string;
  specialty: string;
  urgency: CaseUrgency;
  status: CaseStatus;
  patientAge?: number;
  patientGender?: PatientGender;
  symptoms?: string[];
  medicalHistory?: string;
  currentMedications?: string[];
  testResults?: string[];
  images?: string[];
  attachments?: string[];
  language: Language;
  translatedContent?: Record<string, unknown>;
  createdBy: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  tags?: string[];
}

export interface CreateCaseRequest {
  title: string;
  description: string;
  specialty: string;
  urgency: CaseUrgency;
  patientAge?: number;
  patientGender?: PatientGender;
  symptoms?: string[];
  medicalHistory?: string;
  currentMedications?: string[];
  testResults?: string[];
  language?: Language;
  tags?: string[];
}

export interface UpdateCaseRequest {
  title?: string;
  description?: string;
  urgency?: CaseUrgency;
  status?: CaseStatus;
  assignedTo?: string;
  tags?: string[];
}

// Case Response types
export interface CaseResponse {
  id: string;
  caseId: string;
  parentResponseId?: string;
  content: string;
  responseType: ResponseType;
  language: Language;
  translatedContent?: Record<string, unknown>;
  attachments?: string[];
  isPrivate: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  editedAt?: string;
}

export interface CreateResponseRequest {
  caseId: string;
  parentResponseId?: string;
  content: string;
  responseType?: ResponseType;
  language?: Language;
  isPrivate?: boolean;
}

export interface UpdateResponseRequest {
  content?: string;
  isPrivate?: boolean;
}

// File Upload types
export interface FileUpload {
  id: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  fileUrl: string;
  thumbnailUrl?: string;
  uploadedBy: string;
  caseId?: string;
  responseId?: string;
  uploadPurpose: UploadPurpose;
  isProcessed: boolean;
  createdAt: string;
}

export interface UploadRequest {
  file: File;
  purpose: UploadPurpose;
  caseId?: string;
  responseId?: string;
}

// Translation types
export interface TranslationRequest {
  text: string;
  sourceLanguage: Language;
  targetLanguage: Language;
  context?: 'medical' | 'general' | 'urgent';
}

export interface TranslationResponse {
  originalText: string;
  translatedText: string;
  sourceLanguage: Language;
  targetLanguage: Language;
  confidence?: number;
  cached: boolean;
}

// Error types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ValidationError extends ApiError {
  field: string;
  value: unknown;
}