// TypeScript interfaces for database models
// Generated from database schema

export type UserRole = 'gaza_clinician' | 'uk_specialist' | 'admin';
export type UserStatus = 'pending' | 'verified' | 'suspended' | 'inactive';
export type AvailabilityStatus = 'available' | 'busy' | 'offline';
export type Language = 'en' | 'ar';
export type Gender = 'male' | 'female' | 'other' | 'not_specified';
export type CaseUrgency = 'low' | 'medium' | 'high' | 'critical';
export type CaseStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type ResponseType = 'consultation' | 'question' | 'clarification' | 'follow_up';
export type AssignmentType = 'primary' | 'secondary' | 'observer';
export type AssignmentStatus = 'active' | 'completed' | 'declined';
export type UploadPurpose = 'case_attachment' | 'response_attachment' | 'profile_image' | 'verification_document';
export type NotificationType = 'new_case' | 'case_response' | 'case_assignment' | 'system_message' | 'achievement';
export type AchievementType = 'first_response' | 'helpful_response' | 'quick_response' | 'specialist_of_month' | 'volunteer_hours';

export interface User {
  id: string;
  email: string;
  password_hash?: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  status: UserStatus;
  specialties?: string[]; // JSON array
  gmc_number?: string;
  verification_documents?: string[]; // JSON array
  referral_code?: string;
  preferred_language: Language;
  timezone?: string;
  availability_status: AvailabilityStatus;
  profile_image_url?: string;
  bio?: string;
  points: number;
  volunteer_hours: number;
  created_at: Date;
  updated_at: Date;
  last_login_at?: Date;
  email_verified_at?: Date;
  verification_requested_at?: Date;
  verification_completed_at?: Date;
}

export interface UserSession {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  device_info?: Record<string, unknown>; // JSON
  ip_address?: string;
  created_at: Date;
  last_used_at: Date;
}

export interface MedicalCase {
  id: string;
  title: string;
  description: string;
  specialty: string;
  urgency: CaseUrgency;
  status: CaseStatus;
  patient_age?: number;
  patient_gender?: Gender;
  symptoms?: string[]; // JSON array
  medical_history?: string;
  current_medications?: string[]; // JSON array
  test_results?: string[]; // JSON array
  images?: string[]; // JSON array
  attachments?: string[]; // JSON array
  language: Language;
  translated_content?: Record<string, unknown>; // JSON with translations
  created_by: string;
  assigned_to?: string;
  created_at: Date;
  updated_at: Date;
  resolved_at?: Date;
  tags?: string[]; // JSON array
}

export interface CaseResponse {
  id: string;
  case_id: string;
  parent_response_id?: string;
  content: string;
  response_type: ResponseType;
  language: Language;
  translated_content?: Record<string, unknown>; // JSON with translations
  attachments?: string[]; // JSON array
  is_private: boolean;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  edited_at?: Date;
}

export interface CaseAssignment {
  id: string;
  case_id: string;
  specialist_id: string;
  assigned_by: string;
  assignment_type: AssignmentType;
  status: AssignmentStatus;
  assigned_at: Date;
  completed_at?: Date;
  notes?: string;
}

export interface FileUpload {
  id: string;
  filename: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  file_url: string;
  thumbnail_url?: string;
  uploaded_by: string;
  case_id?: string;
  response_id?: string;
  upload_purpose: UploadPurpose;
  is_processed: boolean;
  created_at: Date;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>; // JSON
  is_read: boolean;
  created_at: Date;
  read_at?: Date;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_type: AchievementType;
  achievement_data?: Record<string, unknown>; // JSON
  points_awarded: number;
  awarded_at: Date;
}

export interface SystemSetting {
  key: string;
  value: string;
  description?: string;
  updated_at: Date;
  updated_by?: string;
}

export interface TranslationCache {
  id: string;
  source_text_hash: string;
  source_language: Language;
  target_language: Language;
  translated_text: string;
  translation_service: string;
  created_at: Date;
  last_used_at: Date;
  usage_count: number;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  old_values?: Record<string, unknown>; // JSON
  new_values?: Record<string, unknown>; // JSON
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}

// Joined/Extended types for complex queries
export interface CaseWithUser extends MedicalCase {
  created_by_user: Pick<User, 'id' | 'first_name' | 'last_name' | 'role' | 'specialties'>;
  assigned_to_user?: Pick<User, 'id' | 'first_name' | 'last_name' | 'role' | 'specialties'>;
  response_count: number;
  latest_response_at?: Date;
}

export interface ResponseWithUser extends CaseResponse {
  created_by_user: Pick<User, 'id' | 'first_name' | 'last_name' | 'role' | 'profile_image_url'>;
  reply_count: number;
}

export interface NotificationWithCase extends Notification {
  case?: Pick<MedicalCase, 'id' | 'title' | 'specialty' | 'urgency'>;
}

export interface UserWithStats extends User {
  total_cases: number;
  resolved_cases: number;
  total_responses: number;
  avg_response_time_hours?: number;
  recent_activity_count: number;
}

// Input types for API operations
export interface CreateUserInput {
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  specialties?: string[];
  gmc_number?: string;
  referral_code?: string;
  preferred_language?: Language;
  bio?: string;
}

export interface UpdateUserInput {
  first_name?: string;
  last_name?: string;
  specialties?: string[];
  preferred_language?: Language;
  timezone?: string;
  availability_status?: AvailabilityStatus;
  bio?: string;
}

export interface CreateCaseInput {
  title: string;
  description: string;
  specialty: string;
  urgency: CaseUrgency;
  patient_age?: number;
  patient_gender?: Gender;
  symptoms?: string[];
  medical_history?: string;
  current_medications?: string[];
  test_results?: string[];
  language?: Language;
  tags?: string[];
}

export interface UpdateCaseInput {
  title?: string;
  description?: string;
  specialty?: string;
  urgency?: CaseUrgency;
  status?: CaseStatus;
  assigned_to?: string;
  tags?: string[];
}

export interface CreateResponseInput {
  case_id: string;
  parent_response_id?: string;
  content: string;
  response_type?: ResponseType;
  language?: Language;
  attachments?: string[];
  is_private?: boolean;
}

// Query filter types
export interface CaseFilters {
  specialty?: string;
  urgency?: CaseUrgency[];
  status?: CaseStatus[];
  created_by?: string;
  assigned_to?: string;
  language?: Language;
  created_after?: Date;
  created_before?: Date;
  search?: string;
  tags?: string[];
  page?: number;
  limit?: number;
  sort_by?: 'created_at' | 'updated_at' | 'urgency' | 'title';
  sort_order?: 'asc' | 'desc';
}

export interface UserFilters {
  role?: UserRole;
  status?: UserStatus;
  specialties?: string[];
  availability_status?: AvailabilityStatus;
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: 'created_at' | 'last_login_at' | 'points' | 'volunteer_hours';
  sort_order?: 'asc' | 'desc';
}

export interface NotificationFilters {
  user_id: string;
  type?: NotificationType[];
  is_read?: boolean;
  created_after?: Date;
  page?: number;
  limit?: number;
}