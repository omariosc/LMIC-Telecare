// Common types and enums used throughout the application

// Language types
export type Language = "en" | "ar";

// Status types
export type UserRole = "gaza_clinician" | "uk_specialist" | "admin";
export type UserStatus = "pending" | "verified" | "suspended" | "inactive";
export type AvailabilityStatus = "available" | "busy" | "offline";

// Medical case types
export type CaseUrgency = "low" | "medium" | "high" | "critical";
export type CaseStatus = "open" | "in_progress" | "resolved" | "closed";
export type PatientGender = "male" | "female" | "other" | "not_specified";

// Response and assignment types
export type ResponseType =
  | "consultation"
  | "question"
  | "clarification"
  | "follow_up";
export type AssignmentType = "primary" | "secondary" | "observer";
export type AssignmentStatus = "active" | "completed" | "declined";

// File upload types
export type UploadPurpose =
  | "case_attachment"
  | "response_attachment"
  | "profile_image"
  | "verification_document";
export type FileType = "image" | "document" | "video" | "audio" | "other";
export type MimeType =
  | "image/jpeg"
  | "image/png"
  | "image/gif"
  | "image/webp"
  | "application/pdf"
  | "application/msword"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "text/plain"
  | "video/mp4"
  | "audio/mpeg"
  | "audio/wav";

// Notification types
export type NotificationType =
  | "new_case"
  | "case_response"
  | "case_assignment"
  | "system_message"
  | "achievement";

// Achievement types
export type AchievementType =
  | "first_response"
  | "helpful_response"
  | "quick_response"
  | "specialist_of_month"
  | "volunteer_hours";

// Medical specialties (common ones for the platform)
export type MedicalSpecialty =
  | "general_medicine"
  | "cardiology"
  | "neurology"
  | "orthopedics"
  | "pediatrics"
  | "psychiatry"
  | "dermatology"
  | "ophthalmology"
  | "oncology"
  | "emergency_medicine"
  | "surgery"
  | "radiology"
  | "pathology"
  | "anesthesiology"
  | "obstetrics_gynecology"
  | "internal_medicine"
  | "family_medicine"
  | "infectious_diseases"
  | "endocrinology"
  | "gastroenterology"
  | "pulmonology"
  | "nephrology"
  | "rheumatology"
  | "hematology"
  | "urology"
  | "plastic_surgery"
  | "critical_care"
  | "rehabilitation"
  | "pain_management"
  | "other";

// Common utility types
export type ID = string;
export type UUID = string;
export type Timestamp = string; // ISO 8601 format
export type EmailAddress = string;
export type PhoneNumber = string;
export type URL = string;

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

// Search and filter types
export interface SearchParams {
  query?: string;
  filters?: Record<string, unknown>;
  tags?: string[];
}

export interface SortParams {
  field: string;
  direction: "asc" | "desc";
}

// Geolocation types
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location {
  coordinates?: Coordinates;
  city?: string;
  region?: string;
  country?: string;
  timezone?: string;
}

// Date range types
export interface DateRange {
  startDate: Timestamp;
  endDate: Timestamp;
}

// Error types
export interface ErrorInfo {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Timestamp;
}

// Validation types
export interface ValidationRule {
  field: string;
  rule: string;
  message: string;
}

export interface ValidationError {
  field: string;
  value: unknown;
  message: string;
  code: string;
}

// Configuration types
export interface AppConfig {
  apiUrl: string;
  environment: "development" | "staging" | "production";
  version: string;
  features: Record<string, boolean>;
  limits: {
    maxFileSize: number;
    maxFilesPerUpload: number;
    sessionTimeout: number;
  };
}

// Metadata types
export interface Metadata {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: ID;
  updatedBy?: ID;
  version?: number;
}

// Translation context
export type TranslationContext =
  | "medical"
  | "general"
  | "urgent"
  | "administrative";

// Device and session info
export interface DeviceInfo {
  userAgent?: string;
  platform?: string;
  browser?: string;
  version?: string;
  isMobile?: boolean;
  isTablet?: boolean;
  isDesktop?: boolean;
}

export interface SessionInfo {
  id: ID;
  userId: ID;
  deviceInfo?: DeviceInfo;
  ipAddress?: string;
  location?: Location;
  createdAt: Timestamp;
  lastUsedAt: Timestamp;
  expiresAt: Timestamp;
}
