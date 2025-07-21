// Environment bindings for Cloudflare Worker

// Cloudflare Workers types
declare global {
  interface D1Database {
    prepare(query: string): D1PreparedStatement;
    exec(query: string): Promise<D1ExecResult>;
    dump(): Promise<ArrayBuffer>;
    batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  }

  interface D1PreparedStatement {
    bind(...values: unknown[]): D1PreparedStatement;
    first<T = unknown>(colName?: string): Promise<T>;
    run(): Promise<D1Result>;
    all<T = unknown>(): Promise<D1Result<T>>;
    raw<T = unknown[]>(): Promise<T[]>;
  }

  interface D1Result<T = unknown> {
    results?: T[];
    success: boolean;
    error?: string;
    changes?: number;
    duration?: number;
    meta: {
      served_by?: string;
      duration?: number;
      changes?: number;
      last_row_id?: number;
      changed_db?: boolean;
      size_after?: number;
      rows_read?: number;
      rows_written?: number;
    };
  }

  interface D1ExecResult {
    count: number;
    duration: number;
  }

  interface KVNamespace {
    get(key: string, options?: { type?: "text" | "json" | "arrayBuffer" | "stream" }): Promise<string | null>;
    put(key: string, value: string | ArrayBuffer | ReadableStream, options?: { expiration?: number; expirationTtl?: number }): Promise<void>;
    delete(key: string): Promise<void>;
    list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{ keys: { name: string; expiration?: number }[]; list_complete: boolean; cursor?: string }>;
  }

  interface R2Bucket {
    get(key: string): Promise<R2Object | null>;
    put(key: string, value: ReadableStream | ArrayBuffer | string, options?: R2PutOptions): Promise<R2Object>;
    delete(key: string): Promise<void>;
    list(options?: R2ListOptions): Promise<R2Objects>;
  }

  interface R2Object {
    key: string;
    size: number;
    etag: string;
    uploaded: Date;
    version: string;
    body: ReadableStream;
    httpMetadata?: {
      contentType?: string;
      contentEncoding?: string;
      contentDisposition?: string;
      contentLanguage?: string;
      cacheControl?: string;
      expires?: Date;
    };
    customMetadata?: Record<string, string>;
    arrayBuffer(): Promise<ArrayBuffer>;
    text(): Promise<string>;
    json<T = unknown>(): Promise<T>;
  }

  interface R2PutOptions {
    contentType?: string;
    contentEncoding?: string;
    cacheControl?: string;
    metadata?: Record<string, string>;
    httpMetadata?: {
      contentType?: string;
      contentEncoding?: string;
      contentDisposition?: string;
      contentLanguage?: string;
      cacheControl?: string;
      expires?: Date;
    };
  }

  interface R2ListOptions {
    prefix?: string;
    delimiter?: string;
    limit?: number;
    include?: ("httpMetadata" | "customMetadata")[];
    cursor?: string;
  }

  interface R2Objects {
    objects: R2Object[];
    truncated: boolean;
    cursor?: string;
  }
}

export interface Env {
  // Environment variables
  ENVIRONMENT: string;
  API_VERSION: string;
  ALLOWED_ORIGINS: string;
  
  // Cloudflare bindings
  DB: D1Database;
  CACHE: KVNamespace;
  STORAGE: R2Bucket;
  
  // Optional secrets (for future use)
  JWT_SECRET?: string;
  GEMINI_API_KEY?: string;
  ENCRYPTION_KEY?: string;
}