// Medical cases management routes

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { Env } from '../types/env';
import type { ApiResponse } from '../types/api';

export const casesRoutes = new Hono<{ Bindings: Env }>();

// Validation schemas
const casesQuerySchema = z.object({
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
  urgency: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  specialty: z.string().optional(),
});

// Helper function to authenticate user (same as users route)
async function authenticateUser(c: any): Promise<{ userId: string; role: string } | null> {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const encoder = new TextEncoder();
  const data = encoder.encode(token + 'salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const tokenHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  const session = await c.env.DB
    .prepare(`
      SELECT u.id, u.role 
      FROM user_sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token_hash = ? AND s.expires_at > datetime('now')
    `)
    .bind(tokenHash)
    .first() as any;

  return session ? { userId: session.id, role: session.role } : null;
}

// Get cases for authenticated user
casesRoutes.get('/', zValidator('query', casesQuerySchema), async (c) => {
  try {
    const auth = await authenticateUser(c);
    if (!auth) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const { page = 1, limit = 20, status, urgency, specialty } = c.req.valid('query');
    const offset = (page - 1) * limit;

    // Build query to get cases where user is involved (created by, assigned to, or has assignment)
    let query = `
      SELECT DISTINCT
        mc.id, mc.title, mc.description, mc.specialty, mc.urgency, mc.status,
        mc.patient_age, mc.patient_gender, mc.symptoms, mc.medical_history,
        mc.current_medications, mc.test_results, mc.images, mc.attachments,
        mc.language, mc.translated_content, mc.created_by, mc.assigned_to,
        mc.created_at, mc.updated_at, mc.resolved_at, mc.tags,
        u_creator.first_name as creator_first_name, u_creator.last_name as creator_last_name,
        u_assigned.first_name as assigned_first_name, u_assigned.last_name as assigned_last_name
      FROM medical_cases mc
      LEFT JOIN users u_creator ON mc.created_by = u_creator.id
      LEFT JOIN users u_assigned ON mc.assigned_to = u_assigned.id
      LEFT JOIN case_assignments ca ON mc.id = ca.case_id AND ca.specialist_id = ? AND ca.status = 'active'
      WHERE (mc.created_by = ? OR mc.assigned_to = ? OR ca.specialist_id = ?)
    `;
    const params: any[] = [auth.userId, auth.userId, auth.userId, auth.userId];

    if (status) {
      query += ' AND mc.status = ?';
      params.push(status);
    }

    if (urgency) {
      query += ' AND mc.urgency = ?';
      params.push(urgency);
    }

    if (specialty) {
      query += ' AND mc.specialty = ?';
      params.push(specialty);
    }

    query += ' ORDER BY mc.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const cases = await c.env.DB
      .prepare(query)
      .bind(...params)
      .all();

    const response: ApiResponse<{ cases: any[] }> = {
      success: true,
      data: {
        cases: cases.results?.map((case_row: any) => ({
          id: case_row.id,
          title: case_row.title,
          description: case_row.description,
          specialty: case_row.specialty,
          urgency: case_row.urgency,
          status: case_row.status,
          patientAge: case_row.patient_age,
          patientGender: case_row.patient_gender,
          symptoms: case_row.symptoms ? JSON.parse(case_row.symptoms) : [],
          medicalHistory: case_row.medical_history,
          currentMedications: case_row.current_medications ? JSON.parse(case_row.current_medications) : [],
          testResults: case_row.test_results ? JSON.parse(case_row.test_results) : [],
          images: case_row.images ? JSON.parse(case_row.images) : [],
          attachments: case_row.attachments ? JSON.parse(case_row.attachments) : [],
          language: case_row.language,
          translatedContent: case_row.translated_content ? JSON.parse(case_row.translated_content) : null,
          createdBy: {
            id: case_row.created_by,
            firstName: case_row.creator_first_name,
            lastName: case_row.creator_last_name,
          },
          assignedTo: case_row.assigned_to ? {
            id: case_row.assigned_to,
            firstName: case_row.assigned_first_name,
            lastName: case_row.assigned_last_name,
          } : null,
          createdAt: case_row.created_at,
          updatedAt: case_row.updated_at,
          resolvedAt: case_row.resolved_at,
          tags: case_row.tags ? JSON.parse(case_row.tags) : [],
        })) || [],
      },
      timestamp: new Date().toISOString(),
    };

    return c.json(response);

  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to fetch cases',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, 500);
  }
});

casesRoutes.post('/', async (c) => {
  const response: ApiResponse<{ message: string }> = {
    success: true,
    data: { message: 'Create case endpoint - coming soon' },
    timestamp: new Date().toISOString(),
  };
  return c.json(response);
});

casesRoutes.get('/:id', async (c) => {
  const caseId = c.req.param('id');
  const response: ApiResponse<{ message: string; caseId: string }> = {
    success: true,
    data: { message: 'Get case endpoint - coming soon', caseId },
    timestamp: new Date().toISOString(),
  };
  return c.json(response);
});

casesRoutes.put('/:id', async (c) => {
  const caseId = c.req.param('id');
  const response: ApiResponse<{ message: string; caseId: string }> = {
    success: true,
    data: { message: 'Update case endpoint - coming soon', caseId },
    timestamp: new Date().toISOString(),
  };
  return c.json(response);
});

// Case responses
casesRoutes.get('/:id/responses', async (c) => {
  const caseId = c.req.param('id');
  const response: ApiResponse<{ message: string; caseId: string }> = {
    success: true,
    data: { message: 'Get case responses endpoint - coming soon', caseId },
    timestamp: new Date().toISOString(),
  };
  return c.json(response);
});

casesRoutes.post('/:id/responses', async (c) => {
  const caseId = c.req.param('id');
  const response: ApiResponse<{ message: string; caseId: string }> = {
    success: true,
    data: { message: 'Create case response endpoint - coming soon', caseId },
    timestamp: new Date().toISOString(),
  };
  return c.json(response);
});