// Telecare Platform API Worker
// Main entry point for Cloudflare Worker API

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { authRoutes } from './routes/auth';
import { casesRoutes } from './routes/cases';
import { filesRoutes } from './routes/files';
import { usersRoutes } from './routes/users';
import { translationRoutes } from './routes/translation';
import { healthRoutes } from './routes/health';
import type { Env } from './types/env';

// Create Hono app with environment bindings
const app = new Hono<{ Bindings: Env }>();

// Global middleware
app.use('*', logger());
app.use('*', prettyJSON());

// CORS middleware - Allow requests from Pages frontend
app.use('*', async (c, next) => {
  const corsHandler = cors({
    origin: (origin) => {
      const allowedOrigins = c.env.ALLOWED_ORIGINS?.split(',') || [
        'http://localhost:3000',
        'https://telecare-platform.pages.dev',
        'https://6f806039.telecare-platform.pages.dev'
      ];
      
      // Debug logging
      console.log('CORS Debug:', {
        origin,
        allowedOrigins,
        envValue: c.env.ALLOWED_ORIGINS
      });
      
      if (!origin) return '*'; // Allow requests with no origin (Postman, curl, etc.)
      
      // Normalize origins by removing trailing slashes for comparison
      const normalizeOrigin = (url: string) => url.replace(/\/$/, '');
      const normalizedOrigin = normalizeOrigin(origin);
      
      const isAllowed = allowedOrigins.some(allowed => {
        if (allowed === '*') return true;
        
        const normalizedAllowed = normalizeOrigin(allowed);
        
        // Exact match after normalization
        if (normalizedOrigin === normalizedAllowed) return true;
        
        // Wildcard matching for subdomains
        if (allowed.includes('*')) {
          const pattern = allowed.replace('*', '');
          return normalizedOrigin.includes(pattern);
        }
        
        return false;
      });
      
      console.log('CORS Result:', { origin, normalizedOrigin, isAllowed });
      
      // Return the actual origin if allowed, or false if not
      return isAllowed ? origin : false;
    },
    allowHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
    ],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  });
  
  return corsHandler(c, next);
});

// API routes
app.route('/api/v1/health', healthRoutes);
app.route('/api/v1/auth', authRoutes);
app.route('/api/v1/users', usersRoutes);
app.route('/api/v1/cases', casesRoutes);
app.route('/api/v1/files', filesRoutes);
app.route('/api/v1/translation', translationRoutes);

// Root endpoint
app.get('/', (c) => {
  return c.json({
    message: 'Telecare Platform API',
    version: c.env.API_VERSION || 'v1',
    environment: c.env.ENVIRONMENT || 'development',
    endpoints: {
      health: '/api/v1/health',
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      cases: '/api/v1/cases',
      files: '/api/v1/files',
      translation: '/api/v1/translation',
    },
    documentation: 'https://docs.telecare-platform.dev/api',
  });
});

// 404 handler
app.notFound((c) => {
  return c.json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
    availableEndpoints: [
      '/api/v1/health',
      '/api/v1/auth',
      '/api/v1/users', 
      '/api/v1/cases',
      '/api/v1/files',
      '/api/v1/translation',
    ],
  }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('API Error:', err);
  
  return c.json({
    error: 'Internal Server Error',
    message: c.env.ENVIRONMENT === 'production' 
      ? 'An unexpected error occurred' 
      : err.message,
    timestamp: new Date().toISOString(),
  }, 500);
});

export default app;