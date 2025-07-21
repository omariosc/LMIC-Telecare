// Translation and localization type definitions

import type {
  ID,
  Timestamp,
  Language,
  TranslationContext,
  Metadata,
} from "./common";
import type { PublicUserProfile } from "./user";

// Core translation interface
export interface Translation extends Metadata {
  id: ID;
  sourceText: string;
  sourceLanguage: Language;
  targetLanguage: Language;
  translatedText: string;

  // Translation quality and validation
  confidence: number; // 0-1, translation confidence score
  quality: "draft" | "reviewed" | "approved" | "rejected";
  qualityScore?: number; // 0-100, human-assessed quality

  // Context and categorization
  context: TranslationContext;
  domain?: string; // More specific domain (e.g., 'cardiology', 'emergency')
  contentType:
    | "text"
    | "medical_term"
    | "instruction"
    | "diagnosis"
    | "treatment";

  // Translation source and method
  translationMethod: "ai" | "human" | "hybrid" | "pre_existing";
  aiModel?: string; // e.g., 'gemini-1.5-pro', 'gpt-4'
  aiProvider?: string; // e.g., 'google', 'openai'

  // Human translation details
  translatedBy?: ID; // Human translator ID
  reviewedBy?: ID; // Human reviewer ID
  reviewedAt?: Timestamp;
  reviewNotes?: string;

  // Usage and context tracking
  sourceResourceType?:
    | "case"
    | "response"
    | "ui_text"
    | "notification"
    | "document";
  sourceResourceId?: ID;
  usageCount: number;
  lastUsedAt?: Timestamp;

  // Validation and verification
  isVerified: boolean;
  verifiedBy?: ID;
  verifiedAt?: Timestamp;
  verificationMethod?: "human" | "automated" | "crowd_sourced";

  // Alternative translations
  alternatives?: AlternativeTranslation[];

  // Metadata and tags
  tags?: string[];
  medicalCodes?: MedicalCode[]; // ICD-10, SNOMED, etc.

  // Cache and performance
  cacheKey?: string;
  cacheExpiry?: Timestamp;

  // Feedback and improvement
  feedback?: TranslationFeedback[];
  reportedIssues?: TranslationIssue[];
}

// Alternative translation options
export interface AlternativeTranslation {
  text: string;
  confidence: number;
  method: "ai" | "human" | "dictionary";
  source?: string;
  votes?: number; // Community voting
  createdAt: Timestamp;
  createdBy?: ID;
}

// Medical coding systems
export interface MedicalCode {
  system: "icd10" | "icd11" | "snomed" | "cpt" | "loinc";
  code: string;
  display: string;
  language: Language;
}

// Translation feedback
export interface TranslationFeedback {
  id: ID;
  translationId: ID;
  userId: ID;
  rating: 1 | 2 | 3 | 4 | 5; // 1 = poor, 5 = excellent
  feedback: string;
  suggestedImprovement?: string;
  categories: FeedbackCategory[];
  isHelpful: boolean;
  createdAt: Timestamp;
}

export type FeedbackCategory =
  | "accuracy"
  | "fluency"
  | "medical_accuracy"
  | "cultural_appropriateness"
  | "terminology"
  | "grammar"
  | "context_understanding";

// Translation issues and reports
export interface TranslationIssue {
  id: ID;
  translationId: ID;
  reportedBy: ID;
  issueType: IssueType;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  suggestedCorrection?: string;
  status: "open" | "in_review" | "resolved" | "dismissed";

  // Resolution
  resolvedBy?: ID;
  resolvedAt?: Timestamp;
  resolutionNotes?: string;
  resolutionAction?:
    | "updated_translation"
    | "marked_correct"
    | "added_alternative"
    | "removed_translation";

  createdAt: Timestamp;
}

export type IssueType =
  | "medical_inaccuracy"
  | "cultural_insensitivity"
  | "grammatical_error"
  | "mistranslation"
  | "missing_context"
  | "inappropriate_tone"
  | "technical_error";

// Translation memory and terminology
export interface TranslationMemory {
  id: ID;
  sourceSegment: string;
  targetSegment: string;
  sourceLanguage: Language;
  targetLanguage: Language;
  context: TranslationContext;
  domain?: string;

  // Quality and usage
  quality: "approved" | "verified" | "unverified";
  usageCount: number;
  lastUsed: Timestamp;

  // Source tracking
  createdFrom?: ID; // Original translation ID
  approvedBy?: ID;
  approvedAt?: Timestamp;

  // Metadata
  tags?: string[];
  medicalCodes?: MedicalCode[];

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Terminology database
export interface TerminologyEntry {
  id: ID;
  term: string;
  language: Language;
  translations: {
    [key in Language]?: {
      term: string;
      confidence: number;
      verified: boolean;
      alternatives?: string[];
    };
  };

  // Classification
  category:
    | "anatomy"
    | "symptom"
    | "disease"
    | "treatment"
    | "medication"
    | "procedure"
    | "general";
  specialty?: string;

  // Definitions and context
  definition?: string;
  usage?: string;
  examples?: string[];
  synonyms?: string[];

  // Medical coding
  medicalCodes?: MedicalCode[];

  // Quality and verification
  isVerified: boolean;
  verifiedBy?: ID;
  verifiedAt?: Timestamp;
  sources?: string[];

  // Usage statistics
  usageCount: number;
  lastUsed: Timestamp;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Translation requests and jobs
export interface TranslationRequest {
  id: ID;
  requesterId: ID;

  // Content to translate
  sourceText: string;
  sourceLanguage: Language;
  targetLanguage: Language;
  context: TranslationContext;
  contentType:
    | "text"
    | "medical_term"
    | "instruction"
    | "diagnosis"
    | "treatment";

  // Priority and urgency
  priority: "low" | "medium" | "high" | "urgent";
  urgency: "standard" | "rush" | "emergency";
  deadline?: Timestamp;

  // Requirements
  requiresHumanTranslation: boolean;
  requiresMedicalExpertise: boolean;
  specialtyRequired?: string;
  qualityLevel: "basic" | "professional" | "medical_grade";

  // Status and assignment
  status:
    | "pending"
    | "assigned"
    | "in_progress"
    | "review"
    | "completed"
    | "cancelled";
  assignedTo?: ID; // Translator ID
  assignedAt?: Timestamp;

  // Results
  translationId?: ID;
  completedAt?: Timestamp;
  reviewedAt?: Timestamp;

  // Additional context
  sourceResourceType?:
    | "case"
    | "response"
    | "ui_text"
    | "notification"
    | "document";
  sourceResourceId?: ID;
  additionalInstructions?: string;

  // Feedback
  requesterFeedback?: {
    rating: 1 | 2 | 3 | 4 | 5;
    comments?: string;
    wouldUseAgain: boolean;
  };

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Translation service configuration
export interface TranslationServiceConfig {
  // AI Translation settings
  defaultAiProvider: "google" | "openai" | "azure" | "aws";
  aiModels: {
    [provider: string]: {
      model: string;
      maxTokens?: number;
      temperature?: number;
      supportedLanguages: Language[];
    };
  };

  // Quality thresholds
  confidenceThresholds: {
    autoApprove: number; // Auto-approve if confidence above this
    requireReview: number; // Require review if confidence below this
    reject: number; // Auto-reject if confidence below this
  };

  // Language support
  supportedLanguagePairs: {
    source: Language;
    target: Language;
    quality: "basic" | "good" | "excellent";
    aiSupported: boolean;
    humanTranslatorsAvailable: boolean;
  }[];

  // Cache settings
  cacheEnabled: boolean;
  cacheExpiry: number; // hours
  cacheStrategy: "aggressive" | "conservative" | "disabled";

  // Human translation
  humanTranslationEnabled: boolean;
  autoAssignHuman: boolean;
  humanReviewRequired: boolean;

  // Performance settings
  maxConcurrentRequests: number;
  requestTimeout: number; // seconds
  retryAttempts: number;
  batchProcessing: boolean;
  maxBatchSize: number;
}

// Translation analytics and metrics
export interface TranslationAnalytics {
  timeframe: {
    startDate: Timestamp;
    endDate: Timestamp;
  };

  // Volume metrics
  totalTranslations: number;
  uniqueSourceTexts: number;
  languagePairVolume: {
    source: Language;
    target: Language;
    count: number;
  }[];

  // Quality metrics
  averageConfidence: number;
  qualityDistribution: {
    quality: "draft" | "reviewed" | "approved" | "rejected";
    count: number;
    percentage: number;
  }[];

  // Performance metrics
  averageTranslationTime: number; // milliseconds
  cacheHitRate: number; // percentage
  aiVsHumanRatio: number; // percentage AI

  // Method breakdown
  byMethod: {
    method: "ai" | "human" | "hybrid" | "pre_existing";
    count: number;
    averageQuality: number;
    averageTime: number;
  }[];

  // Context analysis
  byContext: {
    context: TranslationContext;
    count: number;
    averageQuality: number;
  }[];

  // Error and feedback analysis
  feedbackSummary: {
    averageRating: number;
    totalFeedback: number;
    issueCategories: {
      category: FeedbackCategory;
      count: number;
    }[];
  };

  // Cost analysis (if applicable)
  costBreakdown?: {
    aiCosts: number;
    humanCosts: number;
    totalCosts: number;
    costPerTranslation: number;
  };

  // Improvement opportunities
  recommendations: string[];
}

// Localization and content management
export interface LocalizedContent {
  id: ID;
  contentKey: string; // Unique identifier for the content
  contentType:
    | "ui_text"
    | "email_template"
    | "notification"
    | "help_text"
    | "error_message";

  // Content versions
  versions: {
    [key in Language]?: {
      content: string;
      lastModified: Timestamp;
      modifiedBy: ID;
      status: "draft" | "review" | "approved" | "published";
      version: number;
    };
  };

  // Metadata
  category?: string;
  tags?: string[];
  description?: string;

  // Publication
  isPublished: boolean;
  publishedAt?: Timestamp;
  publishedBy?: ID;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Derived types for different contexts

// Translation list item (for translation management)
export type TranslationListItem = Pick<
  Translation,
  | "id"
  | "sourceText"
  | "translatedText"
  | "sourceLanguage"
  | "targetLanguage"
  | "context"
  | "quality"
  | "confidence"
  | "translationMethod"
  | "isVerified"
  | "usageCount"
  | "createdAt"
> & {
  translator?: PublicUserProfile;
  reviewer?: PublicUserProfile;
  canEdit: boolean;
  canReview: boolean;
  canDelete: boolean;
  hasIssues: boolean;
  issueCount: number;
};

// Translation request summary
export type TranslationRequestSummary = Pick<
  TranslationRequest,
  | "id"
  | "sourceText"
  | "sourceLanguage"
  | "targetLanguage"
  | "context"
  | "priority"
  | "status"
  | "deadline"
  | "createdAt"
  | "completedAt"
> & {
  requester: PublicUserProfile;
  translator?: PublicUserProfile;
  isOverdue: boolean;
  canAssign: boolean;
  canComplete: boolean;
  canCancel: boolean;
};

// API request/response types for translation service
export interface TranslateTextRequest {
  text: string;
  sourceLanguage: Language;
  targetLanguage: Language;
  context?: TranslationContext;
  contentType?:
    | "text"
    | "medical_term"
    | "instruction"
    | "diagnosis"
    | "treatment";
  useCache?: boolean;
  preferredMethod?: "ai" | "human" | "memory";
  qualityLevel?: "basic" | "professional" | "medical_grade";
}

export interface TranslateTextResponse {
  translatedText: string;
  confidence: number;
  method: "ai" | "human" | "memory" | "cache";
  alternatives?: string[];
  cacheHit: boolean;
  processingTime: number; // milliseconds
  translationId?: ID;
  warnings?: string[];
}

export interface BatchTranslateRequest {
  items: {
    id: string; // Client-provided ID for tracking
    text: string;
    sourceLanguage: Language;
    targetLanguage: Language;
    context?: TranslationContext;
  }[];
  options: {
    useCache?: boolean;
    preferredMethod?: "ai" | "human" | "memory";
    qualityLevel?: "basic" | "professional" | "medical_grade";
  };
}

export interface BatchTranslateResponse {
  results: {
    id: string;
    translatedText?: string;
    confidence?: number;
    method?: "ai" | "human" | "memory" | "cache";
    error?: string;
  }[];
  summary: {
    total: number;
    successful: number;
    failed: number;
    fromCache: number;
  };
  batchId: ID;
}
