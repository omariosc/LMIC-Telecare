// Notification and achievement system type definitions

import type {
  ID,
  UUID,
  Timestamp,
  EmailAddress,
  NotificationType,
  AchievementType,
  Language,
  UserRole,
  MedicalSpecialty,
  Metadata,
} from "./common";
import type { PublicUserProfile } from "./user";

// Core notification interface
export interface Notification extends Metadata {
  id: ID;
  recipientId: ID;
  type: NotificationType;

  // Content
  title: string;
  message: string;
  shortMessage?: string; // For mobile/compact displays
  actionText?: string; // Button text (e.g., "View Case", "Respond")
  actionUrl?: string; // Where to navigate when clicked

  // Rich content
  imageUrl?: string;
  iconName?: string; // Icon identifier for UI
  iconColor?: string;

  // Context and metadata
  sourceId?: ID; // Related resource ID (case, response, etc.)
  sourceType?: "case" | "response" | "user" | "system" | "achievement";
  sourceData?: Record<string, unknown>; // Additional context data

  // Delivery and status
  channels: NotificationChannel[];
  deliveryStatus: NotificationDeliveryStatus;
  priority: "low" | "medium" | "high" | "urgent";

  // User interaction
  isRead: boolean;
  readAt?: Timestamp;
  isClicked: boolean;
  clickedAt?: Timestamp;
  isArchived: boolean;
  archivedAt?: Timestamp;

  // Scheduling
  scheduledFor?: Timestamp; // For delayed notifications
  expiresAt?: Timestamp; // When notification becomes irrelevant

  // Localization
  language: Language;
  translatedContent?: {
    [key in Language]?: {
      title: string;
      message: string;
      shortMessage?: string;
      actionText?: string;
    };
  };

  // Grouping and threading
  groupKey?: string; // For grouping similar notifications
  threadId?: ID; // For conversation threading
  replaces?: ID; // ID of notification this replaces

  // Sender information
  senderId?: ID; // Who triggered this notification
  senderType?: "system" | "user" | "automated";

  // Metadata for analytics
  campaignId?: string;
  templateId?: string;
  batchId?: string;
}

// Notification delivery channels and status
export type NotificationChannel =
  | "in_app"
  | "email"
  | "push"
  | "sms"
  | "webhook";

export interface NotificationDeliveryStatus {
  inApp?: DeliveryChannelStatus;
  email?: DeliveryChannelStatus;
  push?: DeliveryChannelStatus;
  sms?: DeliveryChannelStatus;
  webhook?: DeliveryChannelStatus;
}

export interface DeliveryChannelStatus {
  status: "pending" | "sent" | "delivered" | "failed" | "skipped";
  sentAt?: Timestamp;
  deliveredAt?: Timestamp;
  failedAt?: Timestamp;
  error?: string;
  attempts?: number;
  nextRetryAt?: Timestamp;
  metadata?: Record<string, unknown>;
}

// Notification preferences
export interface NotificationPreferences {
  userId: ID;

  // Global settings
  enabled: boolean;
  quietHours?: {
    enabled: boolean;
    startTime: string; // HH:MM format
    endTime: string; // HH:MM format
    timezone: string;
  };

  // Channel preferences
  channels: {
    inApp: boolean;
    email: boolean;
    push: boolean;
    sms: boolean;
  };

  // Type-specific preferences
  types: {
    [K in NotificationType]: {
      enabled: boolean;
      channels: NotificationChannel[];
      priority?: "low" | "medium" | "high" | "urgent";
      frequency?: "immediate" | "batched" | "daily_digest" | "weekly_digest";
    };
  };

  // Medical case preferences
  caseNotifications: {
    onlyMySpecialties: boolean;
    urgencyFilter: ("low" | "medium" | "high" | "critical")[];
    maxPerDay?: number;
    batchInterval?: number; // minutes
  };

  // Digest settings
  digestSettings: {
    email: {
      frequency: "daily" | "weekly" | "never";
      time: string; // HH:MM format
      dayOfWeek?: number; // 0-6 for weekly
      includeTypes: NotificationType[];
    };
  };

  updatedAt: Timestamp;
}

// Notification templates
export interface NotificationTemplate {
  id: ID;
  name: string;
  type: NotificationType;

  // Template content
  title: string;
  message: string;
  shortMessage?: string;
  actionText?: string;

  // Localized versions
  localizations: {
    [key in Language]?: {
      title: string;
      message: string;
      shortMessage?: string;
      actionText?: string;
    };
  };

  // Template variables
  variables: TemplateVariable[];

  // Configuration
  defaultChannels: NotificationChannel[];
  defaultPriority: "low" | "medium" | "high" | "urgent";
  isActive: boolean;

  // Metadata
  createdBy: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  version: number;
}

export interface TemplateVariable {
  name: string;
  type: "string" | "number" | "date" | "user" | "case" | "url";
  required: boolean;
  description: string;
  defaultValue?: string;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
}

// Achievement system
export interface Achievement {
  id: ID;
  type: AchievementType;
  name: string;
  description: string;
  category: "engagement" | "quality" | "volume" | "recognition" | "milestone";

  // Visual elements
  iconUrl?: string;
  badgeUrl?: string;
  color?: string;
  level: "bronze" | "silver" | "gold" | "platinum" | "diamond";

  // Requirements
  requirements: AchievementRequirement[];
  pointsAwarded: number;

  // Visibility and availability
  isActive: boolean;
  isPublic: boolean; // Visible on user profiles
  isSecret: boolean; // Hidden until earned

  // Localization
  localizations: {
    [key in Language]?: {
      name: string;
      description: string;
    };
  };

  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  totalEarned: number; // How many users have earned this
}

export interface AchievementRequirement {
  type:
    | "case_count"
    | "response_count"
    | "satisfaction_rating"
    | "response_time"
    | "consecutive_days"
    | "specialty_coverage"
    | "volunteer_hours";
  operator: "gte" | "lte" | "eq" | "between";
  value: number | string;
  secondaryValue?: number; // For 'between' operator
  timeframe?: "all_time" | "month" | "quarter" | "year" | "week";
  conditions?: {
    specialties?: MedicalSpecialty[];
    roles?: UserRole[];
    urgency?: ("low" | "medium" | "high" | "critical")[];
  };
}

// User achievement records
export interface UserAchievement extends Metadata {
  id: ID;
  userId: ID;
  achievementId: ID;

  // Earning details
  earnedAt: Timestamp;
  pointsAwarded: number;
  progress: number; // 0-100 percentage

  // Context
  triggerSource?: "case" | "response" | "system" | "manual";
  triggerSourceId?: ID;
  progressData?: Record<string, unknown>;

  // Visibility
  isVisible: boolean; // User can hide achievements
  isPinned: boolean; // Highlighted on profile

  // Notifications
  notificationSent: boolean;
  notificationId?: ID;

  // Verification (for manual achievements)
  verifiedBy?: ID;
  verificationNotes?: string;
}

// Achievement progress tracking
export interface AchievementProgress {
  userId: ID;
  achievementId: ID;
  currentValue: number;
  targetValue: number;
  percentage: number; // 0-100
  lastUpdated: Timestamp;

  // Milestone tracking
  milestones: {
    value: number;
    achievedAt?: Timestamp;
    notified: boolean;
  }[];

  // Historical data
  progressHistory: {
    date: string; // YYYY-MM-DD
    value: number;
  }[];
}

// Leaderboards
export interface Leaderboard {
  id: ID;
  name: string;
  description: string;
  type:
    | "points"
    | "cases_handled"
    | "response_time"
    | "satisfaction"
    | "volunteer_hours";

  // Scope and filtering
  scope: "global" | "specialty" | "role" | "region";
  filters?: {
    specialties?: MedicalSpecialty[];
    roles?: UserRole[];
    regions?: string[];
    timeframe?: "week" | "month" | "quarter" | "year" | "all_time";
  };

  // Configuration
  maxEntries: number;
  updateFrequency: "realtime" | "hourly" | "daily" | "weekly";
  isPublic: boolean;
  isActive: boolean;

  // Ranking data
  entries: LeaderboardEntry[];
  lastUpdated: Timestamp;

  // Rewards
  rewards?: {
    rank: number;
    reward: string;
    pointsAwarded: number;
  }[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: ID;
  user: PublicUserProfile;
  value: number;
  change?: number; // Change in rank since last update
  badge?: string; // Special badge for top performers
}

// Notification analytics and insights
export interface NotificationAnalytics {
  userId?: ID; // If null, system-wide analytics
  timeframe: {
    startDate: Timestamp;
    endDate: Timestamp;
  };

  // Delivery metrics
  sent: number;
  delivered: number;
  failed: number;
  deliveryRate: number;

  // Engagement metrics
  opened: number;
  clicked: number;
  openRate: number;
  clickRate: number;

  // Channel breakdown
  byChannel: {
    [K in NotificationChannel]: {
      sent: number;
      delivered: number;
      opened: number;
      clicked: number;
    };
  };

  // Type breakdown
  byType: {
    [K in NotificationType]: {
      sent: number;
      opened: number;
      clicked: number;
    };
  };

  // Time-based patterns
  byHour: { hour: number; sent: number; opened: number }[];
  byDay: { date: string; sent: number; opened: number }[];

  // User engagement patterns
  topPerformingTypes: {
    type: NotificationType;
    openRate: number;
    clickRate: number;
  }[];

  // Issues and optimization
  failureReasons: {
    reason: string;
    count: number;
    percentage: number;
  }[];

  recommendations: string[];
}

// Derived types for different contexts

// Notification list item (for notification listings)
export type NotificationListItem = Pick<
  Notification,
  | "id"
  | "type"
  | "title"
  | "shortMessage"
  | "message"
  | "actionText"
  | "actionUrl"
  | "imageUrl"
  | "iconName"
  | "iconColor"
  | "priority"
  | "isRead"
  | "isClicked"
  | "createdAt"
  | "expiresAt"
  | "groupKey"
> & {
  sender?: PublicUserProfile;
  relatedResource?: {
    type: string;
    id: ID;
    title: string;
  };
  canMarkAsRead: boolean;
  canArchive: boolean;
  isExpired: boolean;
};

// Achievement list item
export type AchievementListItem = Pick<
  Achievement,
  | "id"
  | "type"
  | "name"
  | "description"
  | "category"
  | "iconUrl"
  | "badgeUrl"
  | "color"
  | "level"
  | "pointsAwarded"
  | "isSecret"
  | "totalEarned"
> & {
  isEarned: boolean;
  earnedAt?: Timestamp;
  progress?: number; // 0-100
  nextMilestone?: number;
};

// Notification creation requests
export interface CreateNotificationRequest {
  recipientId: ID | ID[]; // Single user or multiple users
  type: NotificationType;
  title: string;
  message: string;
  shortMessage?: string;
  actionText?: string;
  actionUrl?: string;
  channels?: NotificationChannel[];
  priority?: "low" | "medium" | "high" | "urgent";
  sourceId?: ID;
  sourceType?: "case" | "response" | "user" | "system" | "achievement";
  sourceData?: Record<string, unknown>;
  scheduledFor?: Timestamp;
  expiresAt?: Timestamp;
  groupKey?: string;
  threadId?: ID;
  replaces?: ID;
  templateVariables?: Record<string, unknown>;
}

export interface BulkNotificationRequest {
  recipients: {
    userId: ID;
    variables?: Record<string, unknown>;
  }[];
  templateId: ID;
  channels?: NotificationChannel[];
  priority?: "low" | "medium" | "high" | "urgent";
  scheduledFor?: Timestamp;
  batchId?: string;
}

// Notification search and filtering
export interface NotificationSearchFilters {
  types?: NotificationType[];
  isRead?: boolean;
  isClicked?: boolean;
  isArchived?: boolean;
  priority?: ("low" | "medium" | "high" | "urgent")[];
  channels?: NotificationChannel[];
  senderId?: ID[];
  sourceType?: ("case" | "response" | "user" | "system" | "achievement")[];
  sourceId?: ID[];
  createdAfter?: Timestamp;
  createdBefore?: Timestamp;
  groupKey?: string;
  threadId?: ID;
  query?: string; // Search in title/message
}

export interface NotificationSearchResult {
  notifications: NotificationListItem[];
  total: number;
  unreadCount: number;
  facets?: {
    types: { value: NotificationType; count: number }[];
    priorities: { value: string; count: number }[];
    senders: { value: ID; count: number; user: PublicUserProfile }[];
  };
}
