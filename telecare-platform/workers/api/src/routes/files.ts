// File upload and management routes for R2 storage

import { Hono } from 'hono';
import type { Env } from '../types/env';
import type { ApiResponse } from '../types/api';

export const filesRoutes = new Hono<{ Bindings: Env }>();

// Upload file to R2
filesRoutes.post('/upload', async (c) => {
  try {
    // Basic file upload implementation
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({
        success: false,
        error: 'No file provided',
        timestamp: new Date().toISOString(),
      }, 400);
    }

    const fileId = crypto.randomUUID();
    const key = `uploads/${fileId}_${file.name}`;
    
    // Upload to R2
    await c.env.STORAGE.put(key, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
    });

    const response: ApiResponse<{
      fileId: string;
      key: string;
      filename: string;
      size: number;
      type: string;
    }> = {
      success: true,
      data: {
        fileId,
        key,
        filename: file.name,
        size: file.size,
        type: file.type,
      },
      message: 'File uploaded successfully',
      timestamp: new Date().toISOString(),
    };

    return c.json(response);

  } catch (error) {
    return c.json({
      success: false,
      error: 'Upload failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, 500);
  }
});

// Download file from R2
filesRoutes.get('/download/:key', async (c) => {
  try {
    const key = c.req.param('key');
    
    const object = await c.env.STORAGE.get(key);
    
    if (!object) {
      return c.json({
        success: false,
        error: 'File not found',
        timestamp: new Date().toISOString(),
      }, 404);
    }

    return new Response(object.body, {
      headers: {
        'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
        'Content-Length': object.size.toString(),
      },
    });

  } catch (error) {
    return c.json({
      success: false,
      error: 'Download failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, 500);
  }
});

// Delete file from R2
filesRoutes.delete('/:key', async (c) => {
  try {
    const key = c.req.param('key');
    
    await c.env.STORAGE.delete(key);

    const response: ApiResponse<{ key: string }> = {
      success: true,
      data: { key },
      message: 'File deleted successfully',
      timestamp: new Date().toISOString(),
    };

    return c.json(response);

  } catch (error) {
    return c.json({
      success: false,
      error: 'Delete failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, 500);
  }
});