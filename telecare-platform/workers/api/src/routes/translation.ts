// Translation service routes for Gemini API integration

import { Hono } from 'hono';
import type { Env } from '../types/env';
import type { ApiResponse, TranslationRequest, TranslationResponse } from '../types/api';

export const translationRoutes = new Hono<{ Bindings: Env }>();

// Translate text
translationRoutes.post('/translate', async (c) => {
  try {
    const { text, sourceLanguage, targetLanguage } = await c.req.json() as TranslationRequest;

    // Check cache first
    const cacheKey = `translation:${sourceLanguage}:${targetLanguage}:${btoa(text)}`;
    const cached = await c.env.CACHE.get(cacheKey);
    
    if (cached) {
      const cachedTranslation = JSON.parse(cached);
      const response: ApiResponse<TranslationResponse> = {
        success: true,
        data: {
          ...cachedTranslation,
          cached: true,
        },
        timestamp: new Date().toISOString(),
      };
      return c.json(response);
    }

    // For now, return a placeholder response
    // TODO: Implement actual Gemini API integration
    const translatedText = `[TRANSLATED from ${sourceLanguage} to ${targetLanguage}] ${text}`;
    
    const translationResult: TranslationResponse = {
      originalText: text,
      translatedText,
      sourceLanguage,
      targetLanguage,
      confidence: 0.95,
      cached: false,
    };

    // Cache the result
    await c.env.CACHE.put(cacheKey, JSON.stringify(translationResult), {
      expirationTtl: 86400, // 24 hours
    });

    const response: ApiResponse<TranslationResponse> = {
      success: true,
      data: translationResult,
      message: 'Translation completed',
      timestamp: new Date().toISOString(),
    };

    return c.json(response);

  } catch (error) {
    return c.json({
      success: false,
      error: 'Translation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, 500);
  }
});

// Get supported languages
translationRoutes.get('/languages', async (c) => {
  const response: ApiResponse<{
    supported: Array<{ code: string; name: string; nativeName: string }>;
  }> = {
    success: true,
    data: {
      supported: [
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
      ],
    },
    timestamp: new Date().toISOString(),
  };

  return c.json(response);
});