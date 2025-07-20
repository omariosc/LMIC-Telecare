// Environment bindings for Cloudflare Worker

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