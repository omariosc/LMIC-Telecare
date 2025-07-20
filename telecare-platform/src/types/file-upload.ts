// File upload and storage type definitions

import type {
  ID,
  UUID,
  Timestamp,
  URL,
  EmailAddress,
  UploadPurpose,
  FileType,
  MimeType,
  Metadata,
} from './common';
import type { PublicUserProfile } from './user';

// Core file interface
export interface FileRecord extends Metadata {
  id: ID;
  fileName: string;
  originalFileName: string;
  fileSize: number; // in bytes
  mimeType: MimeType;
  fileType: FileType;
  
  // Storage information
  storageProvider: 'r2' | 'local' | 's3';
  bucketName?: string;
  storageKey: string; // Internal storage path/key
  publicUrl?: URL; // Public access URL if available
  
  // Upload context
  purpose: UploadPurpose;
  uploadedBy: ID;
  associatedResourceType?: 'case' | 'response' | 'user' | 'verification';
  associatedResourceId?: ID;
  
  // File metadata
  checksum?: string; // For integrity verification
  contentLength?: number;
  lastModified?: Timestamp;
  etag?: string;
  
  // Access control
  isPublic: boolean;
  accessLevel: 'public' | 'authenticated' | 'restricted' | 'private';
  allowedRoles?: string[];
  expiresAt?: Timestamp; // For temporary files
  
  // Processing status
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  processingError?: string;
  thumbnailUrl?: URL; // For images
  previewUrl?: URL; // For documents/videos
  
  // Virus scanning and security
  scanStatus: 'pending' | 'clean' | 'infected' | 'error';
  scanResult?: ScanResult;
  quarantined: boolean;
  
  // Usage tracking
  downloadCount?: number;
  lastAccessedAt?: Timestamp;
  
  // Cleanup and lifecycle
  isTemporary: boolean;
  deleteAfter?: Timestamp;
  deletedAt?: Timestamp;
  deletedBy?: ID;
  deleteReason?: string;
}

// Virus scan result
export interface ScanResult {
  scanner: string; // Scanner used (e.g., 'clamav', 'windows_defender')
  scanTime: Timestamp;
  clean: boolean;
  threats?: string[];
  details?: Record<string, unknown>;
}

// File upload request
export interface FileUploadRequest {
  file: File; // Browser File object
  purpose: UploadPurpose;
  associatedResourceType?: 'case' | 'response' | 'user' | 'verification';
  associatedResourceId?: ID;
  isPublic?: boolean;
  expiresAt?: Timestamp;
  metadata?: Record<string, unknown>;
}

// Multipart upload for large files
export interface MultipartUploadRequest {
  fileName: string;
  fileSize: number;
  mimeType: MimeType;
  purpose: UploadPurpose;
  chunkSize?: number; // Default 5MB
  associatedResourceType?: 'case' | 'response' | 'user' | 'verification';
  associatedResourceId?: ID;
  checksum?: string;
}

export interface MultipartUploadSession {
  id: ID;
  uploadId: string; // Provider-specific upload ID
  fileName: string;
  fileSize: number;
  chunkSize: number;
  totalChunks: number;
  uploadedChunks: number[];
  signedUrls: { [chunkNumber: number]: string };
  expiresAt: Timestamp;
  createdAt: Timestamp;
  status: 'active' | 'completed' | 'aborted' | 'expired';
}

// File upload response
export interface FileUploadResponse {
  success: boolean;
  file?: FileRecord;
  uploadUrl?: string; // For direct uploads
  multipartSession?: MultipartUploadSession; // For large files
  error?: string;
  validationErrors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Signed URL request
export interface SignedUrlRequest {
  fileId: ID;
  operation: 'download' | 'upload' | 'delete';
  expiresIn?: number; // Seconds, default 3600 (1 hour)
  responseType?: 'json' | 'redirect';
}

export interface SignedUrlResponse {
  url: string;
  expiresAt: Timestamp;
  headers?: Record<string, string>;
}

// File metadata update
export interface FileMetadataUpdate {
  fileName?: string;
  isPublic?: boolean;
  accessLevel?: 'public' | 'authenticated' | 'restricted' | 'private';
  expiresAt?: Timestamp;
  associatedResourceType?: 'case' | 'response' | 'user' | 'verification';
  associatedResourceId?: ID;
  metadata?: Record<string, unknown>;
}

// Bulk operations
export interface BulkFileOperation {
  fileIds: ID[];
  operation: 'delete' | 'move' | 'copy' | 'updateAccess';
  parameters?: Record<string, unknown>;
}

export interface BulkFileOperationResult {
  success: boolean;
  results: {
    fileId: ID;
    success: boolean;
    error?: string;
  }[];
  summary: {
    total: number;
    succeeded: number;
    failed: number;
  };
}

// File search and filtering
export interface FileSearchFilters {
  purpose?: UploadPurpose[];
  fileType?: FileType[];
  mimeType?: MimeType[];
  uploadedBy?: ID[];
  associatedResourceType?: string[];
  associatedResourceId?: ID[];
  isPublic?: boolean;
  uploadedAfter?: Timestamp;
  uploadedBefore?: Timestamp;
  sizeMin?: number; // bytes
  sizeMax?: number; // bytes
  scanStatus?: ('pending' | 'clean' | 'infected' | 'error')[];
  processingStatus?: ('pending' | 'processing' | 'completed' | 'failed')[];
  query?: string; // Search in filename
}

export interface FileSearchResult {
  files: FileListItem[];
  total: number;
  totalSize: number; // Total size in bytes
  facets?: {
    fileTypes: { value: FileType; count: number }[];
    purposes: { value: UploadPurpose; count: number }[];
    uploaders: { value: ID; count: number; user: PublicUserProfile }[];
  };
}

// File analytics
export interface FileAnalytics {
  totalFiles: number;
  totalSize: number; // bytes
  filesByType: { type: FileType; count: number; size: number }[];
  filesByPurpose: { purpose: UploadPurpose; count: number; size: number }[];
  uploadsByDate: { date: string; count: number; size: number }[];
  topUploaders: { userId: ID; user: PublicUserProfile; count: number; size: number }[];
  storageUsage: {
    used: number; // bytes
    available: number; // bytes
    quota: number; // bytes
    percentage: number;
  };
  scanSummary: {
    clean: number;
    infected: number;
    pending: number;
    errors: number;
  };
}

// Derived types for different contexts

// File list item (for file listings)
export type FileListItem = Pick<
  FileRecord,
  | 'id'
  | 'fileName'
  | 'fileSize'
  | 'mimeType'
  | 'fileType'
  | 'purpose'
  | 'uploadedBy'
  | 'createdAt'
  | 'isPublic'
  | 'thumbnailUrl'
  | 'scanStatus'
  | 'processingStatus'
> & {
  uploader: PublicUserProfile;
  downloadUrl?: string;
  canDelete: boolean;
  canEdit: boolean;
  canDownload: boolean;
};

// File detail view
export type FileDetail = FileRecord & {
  uploader: PublicUserProfile;
  downloadUrl?: string;
  associatedResource?: {
    type: string;
    id: ID;
    title: string;
    url?: string;
  };
  permissions: {
    canDelete: boolean;
    canEdit: boolean;
    canDownload: boolean;
    canShare: boolean;
  };
  downloadHistory?: {
    downloadedBy: ID;
    downloadedAt: Timestamp;
    userAgent?: string;
    ipAddress?: string;
  }[];
};

// File upload progress
export interface UploadProgress {
  fileId?: ID;
  fileName: string;
  loaded: number; // bytes uploaded
  total: number; // total file size
  percentage: number; // 0-100
  speed?: number; // bytes per second
  eta?: number; // estimated time remaining in seconds
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

// Storage configuration
export interface StorageConfig {
  provider: 'r2' | 'local' | 's3';
  bucket: string;
  region?: string;
  endpoint?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  publicUrlBase?: string;
  
  // Upload limits
  maxFileSize: number; // bytes
  maxTotalSize: number; // bytes per user
  allowedMimeTypes: MimeType[];
  allowedFileTypes: FileType[];
  
  // Security settings
  virusScanEnabled: boolean;
  virusScanner?: 'clamav' | 'windows_defender';
  quarantineInfected: boolean;
  
  // Lifecycle settings
  defaultExpiration?: number; // days
  cleanupInterval: number; // hours
  enableCompression: boolean;
  generateThumbnails: boolean;
  
  // Performance settings
  multipartThreshold: number; // bytes
  multipartChunkSize: number; // bytes
  concurrentUploads: number;
  retryAttempts: number;
}

// File system events
export interface FileEvent {
  id: ID;
  type: 'uploaded' | 'downloaded' | 'deleted' | 'moved' | 'scanned' | 'accessed';
  fileId: ID;
  userId: ID;
  timestamp: Timestamp;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

// Cleanup and maintenance
export interface CleanupJob {
  id: ID;
  type: 'expired_files' | 'orphaned_files' | 'temp_files' | 'large_files';
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: Timestamp;
  completedAt?: Timestamp;
  filesProcessed: number;
  filesDeleted: number;
  spaceReclaimed: number; // bytes
  errors?: string[];
  configuration: Record<string, unknown>;
}