// Medical case and response type definitions

import type {
  ID,
  Timestamp,
  Language,
  CaseUrgency,
  CaseStatus,
  PatientGender,
  ResponseType,
  AssignmentType,
  AssignmentStatus,
  MedicalSpecialty,
  Metadata,
  SearchParams,
} from "./common";
import type { PublicUserProfile } from "./user";

// Core medical case interface
export interface MedicalCase extends Metadata {
  id: ID;
  title: string;
  description: string;
  summary?: string; // AI-generated or manual summary

  // Medical classification
  specialty: MedicalSpecialty;
  urgency: CaseUrgency;
  status: CaseStatus;
  priority?: number; // Calculated priority score

  // Patient information (anonymized)
  patientAge?: number;
  patientGender?: PatientGender;
  patientLocation?: {
    city?: string;
    region?: string;
    country?: string;
  };

  // Medical details
  symptoms: string[];
  primarySymptom?: string;
  symptomDuration?: string; // e.g., "3 days", "2 weeks"
  symptomSeverity?: 1 | 2 | 3 | 4 | 5; // 1 = mild, 5 = severe

  medicalHistory?: string;
  currentMedications?: string[];
  allergies?: string[];
  vitalSigns?: VitalSigns;

  // Diagnostic information
  workingDiagnosis?: string;
  differentialDiagnosis?: string[];
  testResults?: TestResult[];

  // Files and attachments
  images?: string[]; // URLs to medical images
  documents?: string[]; // URLs to medical documents
  attachments?: string[]; // Other file attachments

  // Language and translation
  language: Language;
  translatedContent?: TranslatedContent;
  requiresTranslation?: boolean;

  // Case management
  createdBy: ID; // Gaza clinician ID
  assignedTo?: ID; // UK specialist ID
  consultingSpecialists?: ID[]; // Additional specialists involved

  // Urgency and timing
  estimatedResponseTime?: number; // in minutes
  actualFirstResponseTime?: number; // in minutes
  resolutionTime?: number; // in minutes

  // Case resolution
  resolvedAt?: Timestamp;
  resolutionSummary?: string;
  treatmentPlan?: string;
  followUpRequired?: boolean;
  followUpInstructions?: string;

  // Tags and categorization
  tags?: string[];
  keywords?: string[]; // For search optimization
  caseCategory?: "emergency" | "routine" | "follow_up" | "educational";

  // Quality and feedback
  caseSatisfactionRating?: number; // 1-5 from case creator
  educationalValue?: number; // 1-5 for learning purposes
  complexity?: "simple" | "moderate" | "complex" | "highly_complex";

  // Privacy and visibility
  isAnonymized: boolean;
  isEducational?: boolean; // Can be used for teaching
  isPublic?: boolean; // Visible to all users
  sensitiveContent?: boolean;

  // Statistics
  viewCount?: number;
  responseCount?: number;
  likeCount?: number;
  shareCount?: number;

  // AI assistance
  aiSuggestions?: AISuggestion[];
  confidenceScore?: number; // AI confidence in case analysis
  riskScore?: number; // Calculated risk score
}

// Vital signs
export interface VitalSigns {
  temperature?: number; // Celsius
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  heartRate?: number; // beats per minute
  respiratoryRate?: number; // breaths per minute
  oxygenSaturation?: number; // percentage
  weight?: number; // kg
  height?: number; // cm
  bmi?: number;
  painScale?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  consciousness?: "alert" | "drowsy" | "confused" | "unconscious";
  recordedAt?: Timestamp;
  recordedBy?: ID;
}

// Test results
export interface TestResult {
  id: ID;
  testType: string; // e.g., "Blood Test", "X-Ray", "CT Scan"
  testName: string; // Specific test name
  result: string | number;
  normalRange?: string;
  unit?: string;
  status: "normal" | "abnormal" | "critical" | "pending";
  interpretation?: string;
  performedAt?: Timestamp;
  reportUrl?: string; // Link to full report
  attachmentUrl?: string; // Link to images/files
}

// Translated content
export interface TranslatedContent {
  [key: string]: {
    title?: string;
    description?: string;
    summary?: string;
    symptoms?: string[];
    medicalHistory?: string;
    workingDiagnosis?: string;
    treatmentPlan?: string;
    confidence?: number; // Translation confidence 0-1
    translatedAt?: Timestamp;
    translatedBy?: "ai" | "human";
  };
}

// AI suggestions
export interface AISuggestion {
  id: ID;
  type: "diagnosis" | "treatment" | "test" | "referral" | "urgency";
  suggestion: string;
  confidence: number; // 0-1
  reasoning?: string;
  sources?: string[];
  createdAt: Timestamp;
  isAccepted?: boolean;
  acceptedBy?: ID;
}

// Case response/consultation
export interface CaseResponse extends Metadata {
  id: ID;
  caseId: ID;
  parentResponseId?: ID; // For threaded responses

  // Response content
  content: string;
  responseType: ResponseType;
  isPrivate: boolean; // Internal notes vs public response

  // Response classification
  isHelpful?: boolean; // Marked by case creator
  isPrimaryConsultation?: boolean; // Main specialist response
  confidenceLevel?: "low" | "medium" | "high";

  // Medical content
  diagnosis?: string;
  treatmentRecommendation?: string;
  urgencyAssessment?: CaseUrgency;
  additionalTestsNeeded?: string[];
  referralRecommendation?: {
    specialty: MedicalSpecialty;
    urgency: CaseUrgency;
    reason: string;
  };

  // Files and references
  attachments?: string[];
  references?: Reference[];

  // Language and translation
  language: Language;
  translatedContent?: TranslatedContent;

  // Response metadata
  createdBy: ID;
  editedAt?: Timestamp;
  editReason?: string;

  // Interaction and feedback
  likeCount?: number;
  thanksCount?: number;
  followUpQuestions?: string[];

  // Quality metrics
  helpfulnessRating?: number; // 1-5
  accuracyRating?: number; // 1-5
  timelinessScore?: number; // Based on response time

  // Status tracking
  isRead: boolean;
  readBy?: ID[];
  acknowledgedBy?: ID; // Case creator acknowledgment
}

// Medical references
export interface Reference {
  id: ID;
  type: "journal" | "guideline" | "textbook" | "website" | "study";
  title: string;
  authors?: string[];
  journal?: string;
  year?: number;
  doi?: string;
  url?: string;
  relevanceScore?: number; // 1-5
}

// Case assignment
export interface CaseAssignment extends Metadata {
  id: ID;
  caseId: ID;
  specialistId: ID;
  assignedBy: ID;
  assignmentType: AssignmentType;
  status: AssignmentStatus;

  // Assignment details
  reason?: string;
  expectedResponseTime?: number; // in minutes
  priority?: "low" | "medium" | "high" | "urgent";

  // Specialist response
  acceptedAt?: Timestamp;
  declinedAt?: Timestamp;
  declineReason?: string;
  completedAt?: Timestamp;

  // Performance tracking
  responseTime?: number; // actual time taken in minutes
  quality?: number; // 1-5 rating
  notes?: string;
}

// Case statistics and analytics
export interface CaseAnalytics {
  caseId: ID;

  // Timing metrics
  createdAt: Timestamp;
  firstResponseTime?: number; // minutes
  resolutionTime?: number; // minutes
  averageResponseTime?: number; // minutes

  // Engagement metrics
  totalResponses: number;
  uniqueResponders: number;
  viewCount: number;
  likeCount: number;
  shareCount: number;

  // Quality metrics
  satisfactionRating?: number; // 1-5
  helpfulnessRating?: number; // 1-5
  educationalValue?: number; // 1-5

  // Outcome tracking
  wasResolved: boolean;
  treatmentFollowed?: boolean;
  patientOutcome?: "improved" | "stable" | "worsened" | "unknown";

  // Knowledge sharing
  isEducational: boolean;
  citationCount?: number;
  savedByUsers?: number;

  lastUpdated: Timestamp;
}

// Search and filtering
export interface CaseSearchFilters extends SearchParams {
  specialty?: MedicalSpecialty[];
  urgency?: CaseUrgency[];
  status?: CaseStatus[];
  language?: Language[];
  createdBy?: ID[];
  assignedTo?: ID[];
  hasImages?: boolean;
  hasAttachments?: boolean;
  isUnassigned?: boolean;
  isUrgent?: boolean;
  ageRange?: {
    min?: number;
    max?: number;
  };
  gender?: PatientGender[];
  createdAfter?: Timestamp;
  createdBefore?: Timestamp;
  responseTimeMin?: number;
  responseTimeMax?: number;
  complexity?: string[];
  tags?: string[];
  keywords?: string[];
}

export interface CaseSearchResult {
  cases: CaseListItem[];
  total: number;
  facets?: {
    specialties: { value: MedicalSpecialty; count: number }[];
    urgency: { value: CaseUrgency; count: number }[];
    status: { value: CaseStatus; count: number }[];
    tags: { value: string; count: number }[];
  };
}

// Derived types for different contexts

// Case list item (for case listings)
export type CaseListItem = Pick<
  MedicalCase,
  | "id"
  | "title"
  | "summary"
  | "specialty"
  | "urgency"
  | "status"
  | "patientAge"
  | "patientGender"
  | "symptoms"
  | "language"
  | "createdBy"
  | "assignedTo"
  | "createdAt"
  | "responseCount"
  | "images"
  | "tags"
> & {
  creator: PublicUserProfile;
  assignedSpecialist?: PublicUserProfile;
  firstResponse?: {
    id: ID;
    createdAt: Timestamp;
    createdBy: ID;
    specialist: PublicUserProfile;
  };
  isUnread?: boolean;
  isUrgent?: boolean;
  responseTime?: number;
};

// Case detail view
export type CaseDetail = MedicalCase & {
  creator: PublicUserProfile;
  assignedSpecialist?: PublicUserProfile;
  consultingSpecialists: PublicUserProfile[];
  responses: (CaseResponse & {
    author: PublicUserProfile;
    children?: CaseResponse[];
  })[];
  assignments: (CaseAssignment & {
    specialist: PublicUserProfile;
    assignedByUser: PublicUserProfile;
  })[];
  analytics?: CaseAnalytics;
  relatedCases?: CaseListItem[];
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
    canAssign: boolean;
    canRespond: boolean;
    canViewPrivate: boolean;
  };
};

// Case creation/update requests
export interface CreateCaseRequest {
  title: string;
  description: string;
  specialty: MedicalSpecialty;
  urgency: CaseUrgency;

  // Patient info
  patientAge?: number;
  patientGender?: PatientGender;

  // Medical details
  symptoms: string[];
  medicalHistory?: string;
  currentMedications?: string[];
  allergies?: string[];
  vitalSigns?: Partial<VitalSigns>;

  // Files
  imageUrls?: string[];
  documentUrls?: string[];

  // Additional info
  language?: Language;
  tags?: string[];
  isAnonymized?: boolean;
  sensitiveContent?: boolean;
}

export interface UpdateCaseRequest {
  title?: string;
  description?: string;
  urgency?: CaseUrgency;
  status?: CaseStatus;

  // Resolution info
  resolutionSummary?: string;
  treatmentPlan?: string;
  followUpRequired?: boolean;
  followUpInstructions?: string;

  // Additional info
  tags?: string[];
  assignedTo?: ID;
}
