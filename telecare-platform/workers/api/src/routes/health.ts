// Health check routes for monitoring and diagnostics

import { Hono } from 'hono';
import type { Env } from '../types/env';
import type { ApiResponse } from '../types/api';

export const healthRoutes = new Hono<{ Bindings: Env }>();

// Basic health check
healthRoutes.get('/', async (c) => {
  const response: ApiResponse<{
    status: string;
    environment: string;
    version: string;
    timestamp: string;
  }> = {
    success: true,
    data: {
      status: 'healthy',
      environment: c.env.ENVIRONMENT || 'development',
      version: c.env.API_VERSION || 'v1',
      timestamp: new Date().toISOString(),
    },
    timestamp: new Date().toISOString(),
  };

  return c.json(response);
});

// Database health check
healthRoutes.get('/db', async (c) => {
  try {
    // Test database connection
    const result = await c.env.DB
      .prepare('SELECT COUNT(*) as count FROM sqlite_master WHERE type="table"')
      .first() as { count: number };

    const response: ApiResponse<{
      status: string;
      tablesCount: number;
      connectionTime: number;
    }> = {
      success: true,
      data: {
        status: 'healthy',
        tablesCount: result.count,
        connectionTime: 0, // Could measure actual connection time
      },
      timestamp: new Date().toISOString(),
    };

    return c.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Database connection failed',
      message: error instanceof Error ? error.message : 'Unknown database error',
      timestamp: new Date().toISOString(),
    };

    return c.json(response, 500);
  }
});

// Storage health check
healthRoutes.get('/storage', async (c) => {
  try {
    // Test R2 storage access by listing buckets (this just checks if binding works)
    const testKey = `health-check-${Date.now()}.txt`;
    const testContent = 'Health check test file';
    
    // Put a small test file
    await c.env.STORAGE.put(testKey, testContent);
    
    // Retrieve it
    const retrievedObject = await c.env.STORAGE.get(testKey);
    const retrievedContent = await retrievedObject?.text();
    
    // Clean up
    await c.env.STORAGE.delete(testKey);

    const response: ApiResponse<{
      status: string;
      writeTest: boolean;
      readTest: boolean;
      deleteTest: boolean;
    }> = {
      success: true,
      data: {
        status: 'healthy',
        writeTest: true,
        readTest: retrievedContent === testContent,
        deleteTest: true,
      },
      timestamp: new Date().toISOString(),
    };

    return c.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Storage access failed',
      message: error instanceof Error ? error.message : 'Unknown storage error',
      timestamp: new Date().toISOString(),
    };

    return c.json(response, 500);
  }
});

// Cache health check
healthRoutes.get('/cache', async (c) => {
  try {
    // Test KV namespace access
    const testKey = `health-check-${Date.now()}`;
    const testValue = { message: 'Health check test', timestamp: Date.now() };
    
    // Put a test value
    await c.env.CACHE.put(testKey, JSON.stringify(testValue), { expirationTtl: 60 });
    
    // Get it back
    const retrievedValue = await c.env.CACHE.get(testKey);
    const parsed = retrievedValue ? JSON.parse(retrievedValue) : null;
    
    // Clean up
    await c.env.CACHE.delete(testKey);

    const response: ApiResponse<{
      status: string;
      writeTest: boolean;
      readTest: boolean;
      deleteTest: boolean;
    }> = {
      success: true,
      data: {
        status: 'healthy',
        writeTest: true,
        readTest: parsed?.message === testValue.message,
        deleteTest: true,
      },
      timestamp: new Date().toISOString(),
    };

    return c.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Cache access failed',
      message: error instanceof Error ? error.message : 'Unknown cache error',
      timestamp: new Date().toISOString(),
    };

    return c.json(response, 500);
  }
});

// Comprehensive health check
healthRoutes.get('/full', async (c) => {
  const checks = {
    api: { status: 'healthy', timestamp: new Date().toISOString() },
    database: { status: 'unknown', error: null as string | null },
    storage: { status: 'unknown', error: null as string | null },
    cache: { status: 'unknown', error: null as string | null },
  };

  // Test database
  try {
    await c.env.DB
      .prepare('SELECT 1')
      .first();
    checks.database.status = 'healthy';
  } catch (error) {
    checks.database.status = 'unhealthy';
    checks.database.error = error instanceof Error ? error.message : 'Database error';
  }

  // Test storage
  try {
    const testKey = `health-check-${Date.now()}.txt`;
    await c.env.STORAGE.put(testKey, 'test');
    const obj = await c.env.STORAGE.get(testKey);
    if (obj) {
      await c.env.STORAGE.delete(testKey);
      checks.storage.status = 'healthy';
    } else {
      checks.storage.status = 'unhealthy';
      checks.storage.error = 'Could not retrieve test object';
    }
  } catch (error) {
    checks.storage.status = 'unhealthy';
    checks.storage.error = error instanceof Error ? error.message : 'Storage error';
  }

  // Test cache
  try {
    const testKey = `health-check-${Date.now()}`;
    await c.env.CACHE.put(testKey, 'test', { expirationTtl: 60 });
    const value = await c.env.CACHE.get(testKey);
    await c.env.CACHE.delete(testKey);
    checks.cache.status = value === 'test' ? 'healthy' : 'unhealthy';
  } catch (error) {
    checks.cache.status = 'unhealthy';
    checks.cache.error = error instanceof Error ? error.message : 'Cache error';
  }

  const allHealthy = Object.values(checks).every(check => check.status === 'healthy');

  const response: ApiResponse<typeof checks & { overall: string }> = {
    success: allHealthy,
    data: {
      ...checks,
      overall: allHealthy ? 'healthy' : 'degraded',
    },
    timestamp: new Date().toISOString(),
  };

  return c.json(response, allHealthy ? 200 : 503);
});