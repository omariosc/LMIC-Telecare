// API request/response wrapper types and common API interfaces

import type {
  ID,
  Timestamp,
  PaginatedResponse,
  PaginationParams,
  ValidationError,
  ErrorInfo,
} from './common';

// Generic API response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  timestamp: Timestamp;
  requestId: string;
  version: string;
}

// Paginated API response
export interface PaginatedApiResponse<T = unknown> extends ApiResponse<PaginatedResponse<T>> {
  data: PaginatedResponse<T>;
}

// API error details
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  field?: string; // For field-specific validation errors
  validationErrors?: ValidationError[];
  stack?: string; // Only in development
  retryable?: boolean;
  retryAfter?: number; // Seconds to wait before retry
}

// Rate limiting response headers
export interface RateLimitInfo {
  limit: number; // Max requests per window
  remaining: number; // Remaining requests in current window
  reset: Timestamp; // When the rate limit resets
  retryAfter?: number; // Seconds to wait if rate limited
}

// Standard API request options
export interface ApiRequestOptions {
  timeout?: number; // Request timeout in milliseconds
  retries?: number; // Number of retry attempts
  retryDelay?: number; // Delay between retries in milliseconds
  headers?: Record<string, string>;
  signal?: AbortSignal; // For request cancellation
}

// Authentication headers
export interface AuthHeaders {
  Authorization?: string; // Bearer token
  'X-API-Key'?: string; // API key for service-to-service
  'X-Session-ID'?: string; // Session identifier
  'X-Request-ID'?: string; // Unique request identifier
  'X-Client-Version'?: string; // Client application version
}

// Standard request metadata
export interface RequestMetadata {
  requestId: string;
  timestamp: Timestamp;
  userAgent?: string;
  clientVersion?: string;
  correlationId?: string; // For tracing across services
}

// Health check response
export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Timestamp;
  version: string;
  uptime: number; // Seconds since startup
  
  // Service dependencies
  dependencies: {
    [serviceName: string]: {
      status: 'healthy' | 'degraded' | 'unhealthy';
      responseTime?: number; // milliseconds
      lastChecked: Timestamp;
      error?: string;
    };
  };
  
  // System metrics
  metrics?: {
    memoryUsage?: number; // bytes
    cpuUsage?: number; // percentage
    activeConnections?: number;
    requestsPerSecond?: number;
  };
}

// API versioning
export interface ApiVersion {
  version: string;
  releaseDate: Timestamp;
  deprecated?: boolean;
  deprecationDate?: Timestamp;
  sunsetDate?: Timestamp;
  supportedUntil?: Timestamp;
  migrationGuide?: string;
  changelog?: string;
}

// Batch operation request
export interface BatchRequest<T> {
  operations: T[];
  failFast?: boolean; // Stop on first error
  transactional?: boolean; // All or nothing
  batchId?: string; // Optional batch identifier
}

// Batch operation response
export interface BatchResponse<T> {
  batchId: string;
  results: BatchResult<T>[];
  summary: {
    total: number;
    successful: number;
    failed: number;
    skipped: number;
  };
  errors?: ApiError[];
}

export interface BatchResult<T> {
  index: number;
  success: boolean;
  data?: T;
  error?: ApiError;
}

// Search request parameters
export interface SearchRequest extends PaginationParams {
  query?: string;
  filters?: Record<string, unknown>;
  facets?: string[]; // Fields to generate facets for
  highlight?: string[]; // Fields to highlight in results
  boost?: Record<string, number>; // Field boosting for relevance
  includeTotal?: boolean; // Whether to include total count
}

// Search response with facets and highlighting
export interface SearchResponse<T> {
  items: SearchResultItem<T>[];
  total?: number;
  facets?: SearchFacets;
  suggestions?: string[]; // Query suggestions
  correctedQuery?: string; // Spelling correction
  searchTime: number; // milliseconds
}

export interface SearchResultItem<T> {
  item: T;
  score?: number; // Relevance score
  highlights?: Record<string, string[]>; // Highlighted snippets
  explanation?: string; // Why this result was returned
}

export interface SearchFacets {
  [fieldName: string]: {
    values: {
      value: string | number | boolean;
      count: number;
      selected?: boolean;
    }[];
    total: number;
    otherCount?: number; // Count of values not shown
  };
}

// File upload API types
export interface FileUploadRequest {
  purpose: string;
  metadata?: Record<string, unknown>;
}

export interface FileUploadResponse {
  fileId: ID;
  uploadUrl: string;
  expiresAt: Timestamp;
  maxSize: number; // bytes
  allowedTypes: string[];
}

export interface FileDownloadRequest {
  fileId: ID;
  inline?: boolean; // Display inline vs download
  thumbnail?: boolean; // Request thumbnail version
}

export interface FileDownloadResponse {
  downloadUrl: string;
  expiresAt: Timestamp;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

// WebSocket API types
export interface WebSocketMessage {
  type: string;
  id?: string; // Message ID for acknowledgments
  timestamp: Timestamp;
  data?: unknown;
  error?: ApiError;
}

export interface WebSocketSubscription {
  channel: string;
  filters?: Record<string, unknown>;
  subscriptionId: string;
}

export interface WebSocketEvent {
  channel: string;
  eventType: string;
  data: unknown;
  timestamp: Timestamp;
  subscriptionId?: string;
}

// Webhook types
export interface WebhookPayload<T = unknown> {
  id: string;
  eventType: string;
  timestamp: Timestamp;
  data: T;
  attempt: number;
  signature?: string; // HMAC signature for verification
}

export interface WebhookDelivery {
  id: ID;
  webhookId: ID;
  eventType: string;
  payload: unknown;
  url: string;
  httpMethod: 'POST' | 'PUT' | 'PATCH';
  status: 'pending' | 'delivered' | 'failed' | 'retrying';
  attempts: number;
  maxAttempts: number;
  lastAttemptAt?: Timestamp;
  nextAttemptAt?: Timestamp;
  responseStatus?: number;
  responseBody?: string;
  error?: string;
  createdAt: Timestamp;
}

// API metrics and monitoring
export interface ApiMetrics {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  timeframe: {
    startTime: Timestamp;
    endTime: Timestamp;
  };
  
  // Request metrics
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  errorRate: number; // percentage
  
  // Response time metrics
  averageResponseTime: number; // milliseconds
  p50ResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  maxResponseTime: number;
  minResponseTime: number;
  
  // Status code breakdown
  statusCodes: {
    [statusCode: string]: number;
  };
  
  // Error breakdown
  errors: {
    [errorCode: string]: {
      count: number;
      percentage: number;
      lastOccurrence: Timestamp;
    };
  };
  
  // Rate limiting
  rateLimitHits: number;
  throttledRequests: number;
  
  // Geographic distribution (if applicable)
  requestsByRegion?: {
    [region: string]: number;
  };
  
  // User agent breakdown
  requestsByUserAgent?: {
    [userAgent: string]: number;
  };
}

// API configuration
export interface ApiConfig {
  baseUrl: string;
  version: string;
  timeout: number; // milliseconds
  retries: number;
  rateLimiting: {
    enabled: boolean;
    requestsPerMinute: number;
    burstLimit: number;
  };
  
  // Authentication
  authentication: {
    type: 'bearer' | 'api_key' | 'basic' | 'oauth2';
    headerName?: string;
    tokenPrefix?: string;
  };
  
  // Request/response handling
  defaultHeaders: Record<string, string>;
  responseInterceptors: string[]; // Names of registered interceptors
  requestInterceptors: string[];
  
  // Error handling
  retryableStatusCodes: number[];
  retryableErrorCodes: string[];
  maxRetryDelay: number; // milliseconds
  
  // Caching
  caching: {
    enabled: boolean;
    defaultTtl: number; // seconds
    maxSize: number; // maximum cache entries
  };
  
  // Monitoring
  monitoring: {
    enabled: boolean;
    metricsEndpoint?: string;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  };
}

// Client-side API utilities
export interface ApiClient {
  // HTTP methods
  get<T>(url: string, options?: ApiRequestOptions): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: unknown, options?: ApiRequestOptions): Promise<ApiResponse<T>>;
  put<T>(url: string, data?: unknown, options?: ApiRequestOptions): Promise<ApiResponse<T>>;
  patch<T>(url: string, data?: unknown, options?: ApiRequestOptions): Promise<ApiResponse<T>>;
  delete<T>(url: string, options?: ApiRequestOptions): Promise<ApiResponse<T>>;
  
  // Specialized methods
  upload(file: File, endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<unknown>>;
  download(url: string, options?: ApiRequestOptions): Promise<Blob>;
  
  // Batch operations
  batch<T>(requests: BatchRequest<T>, options?: ApiRequestOptions): Promise<BatchResponse<T>>;
  
  // Configuration
  setAuthToken(token: string): void;
  setDefaultHeader(name: string, value: string): void;
  removeDefaultHeader(name: string): void;
  
  // Interceptors
  addRequestInterceptor(interceptor: RequestInterceptor): void;
  addResponseInterceptor(interceptor: ResponseInterceptor): void;
  
  // Utilities
  isOnline(): boolean;
  getMetrics(): ApiMetrics[];
  clearCache(): void;
}

// Interceptor types
export type RequestInterceptor = (
  config: RequestConfig
) => RequestConfig | Promise<RequestConfig>;

export type ResponseInterceptor = (
  response: ApiResponse<unknown>
) => ApiResponse<unknown> | Promise<ApiResponse<unknown>>;

export interface RequestConfig {
  url: string;
  method: string;
  headers: Record<string, string>;
  data?: unknown;
  params?: Record<string, unknown>;
  timeout?: number;
  signal?: AbortSignal;
}

// Cache-related types
export interface CacheEntry<T> {
  key: string;
  data: T;
  createdAt: Timestamp;
  expiresAt: Timestamp;
  accessCount: number;
  lastAccessed: Timestamp;
  size: number; // bytes
}

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // Cache tags for invalidation
  skipCache?: boolean; // Skip cache for this request
  refreshCache?: boolean; // Force refresh of cached data
}

// API testing and mocking types
export interface MockApiResponse<T> {
  status: number;
  data: T;
  headers?: Record<string, string>;
  delay?: number; // Artificial delay in milliseconds
}

export interface ApiMockConfig {
  baseUrl: string;
  mocks: {
    [endpoint: string]: {
      [method: string]: MockApiResponse<unknown>;
    };
  };
  globalDelay?: number;
  failureRate?: number; // Percentage of requests that should fail
}

// Performance monitoring
export interface PerformanceMetrics {
  dnsLookup: number;
  tcpConnect: number;
  tlsHandshake: number;
  requestSent: number;
  waitingTime: number;
  contentDownload: number;
  totalTime: number;
  transferSize: number;
  decodedBodySize: number;
  encodedBodySize: number;
}

// API documentation types
export interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  summary: string;
  description?: string;
  parameters?: ApiParameter[];
  requestBody?: ApiRequestBody;
  responses: {
    [statusCode: string]: ApiResponseSpec;
  };
  tags?: string[];
  deprecated?: boolean;
  security?: string[];
}

export interface ApiParameter {
  name: string;
  in: 'query' | 'path' | 'header' | 'cookie';
  required: boolean;
  type: string;
  description?: string;
  example?: unknown;
  enum?: unknown[];
}

export interface ApiRequestBody {
  description?: string;
  required: boolean;
  contentType: string;
  schema: string; // JSON schema or type reference
  example?: unknown;
}

export interface ApiResponseSpec {
  description: string;
  contentType?: string;
  schema?: string; // JSON schema or type reference
  headers?: Record<string, ApiParameter>;
  example?: unknown;
}