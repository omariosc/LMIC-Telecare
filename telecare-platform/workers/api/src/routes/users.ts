// User management routes

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { Env } from '../types/env';
import type { ApiResponse, UpdateUserRequest } from '../types/api';

export const usersRoutes = new Hono<{ Bindings: Env }>();

// Validation schemas
const updateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  bio: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  preferredLanguage: z.enum(['en', 'ar']).optional(),
  timezone: z.string().optional(),
  availabilityStatus: z.enum(['available', 'busy', 'offline']).optional(),
});

const userQuerySchema = z.object({
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  role: z.enum(['gaza_clinician', 'uk_specialist', 'admin']).optional(),
  specialty: z.string().optional(),
  status: z.enum(['pending', 'verified', 'suspended', 'inactive']).optional(),
});

// Helper function to authenticate user
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

// Get all users (with filtering and pagination)
usersRoutes.get('/', zValidator('query', userQuerySchema), async (c) => {
  try {
    const auth = await authenticateUser(c);
    if (!auth) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const { page = 1, limit = 20, role, specialty, status } = c.req.valid('query');
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        id, email, first_name, last_name, role, status, specialties,
        gmc_number, preferred_language, timezone, availability_status,
        profile_image_url, bio, points, volunteer_hours, created_at, updated_at
      FROM users
      WHERE 1=1
    `;
    const params: any[] = [];

    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (specialty) {
      query += ' AND specialties LIKE ?';
      params.push(`%"${specialty}"%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const users = await c.env.DB
      .prepare(query)
      .bind(...params)
      .all();

    const response: ApiResponse<{ users: any[] }> = {
      success: true,
      data: {
        users: users.results?.map((user: any) => ({
          ...user,
          firstName: user.first_name,
          lastName: user.last_name,
          specialties: user.specialties ? JSON.parse(user.specialties) : [],
          gmcNumber: user.gmc_number,
          preferredLanguage: user.preferred_language,
          availabilityStatus: user.availability_status,
          profileImageUrl: user.profile_image_url,
          volunteerHours: user.volunteer_hours,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        })) || [],
      },
      timestamp: new Date().toISOString(),
    };

    return c.json(response);

  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to fetch users',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, 500);
  }
});

// Get user by ID
usersRoutes.get('/:id', async (c) => {
  try {
    const auth = await authenticateUser(c);
    if (!auth) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const userId = c.req.param('id');

    const user = await c.env.DB
      .prepare(`
        SELECT 
          id, email, first_name, last_name, role, status, specialties,
          gmc_number, preferred_language, timezone, availability_status,
          profile_image_url, bio, points, volunteer_hours, created_at, updated_at
        FROM users WHERE id = ?
      `)
      .bind(userId)
      .first() as any;

    if (!user) {
      return c.json({
        success: false,
        error: 'User not found',
        timestamp: new Date().toISOString(),
      }, 404);
    }

    const userData = {
      ...user,
      firstName: user.first_name,
      lastName: user.last_name,
      specialties: user.specialties ? JSON.parse(user.specialties) : [],
      gmcNumber: user.gmc_number,
      preferredLanguage: user.preferred_language,
      availabilityStatus: user.availability_status,
      profileImageUrl: user.profile_image_url,
      volunteerHours: user.volunteer_hours,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };

    const response: ApiResponse<{ user: typeof userData }> = {
      success: true,
      data: { user: userData },
      timestamp: new Date().toISOString(),
    };

    return c.json(response);

  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to fetch user',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, 500);
  }
});

// Update user profile
usersRoutes.put('/:id', zValidator('json', updateUserSchema), async (c) => {
  try {
    const auth = await authenticateUser(c);
    if (!auth) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const userId = c.req.param('id');
    const updateData: UpdateUserRequest = c.req.valid('json');

    // Check if user can update this profile (self or admin)
    if (auth.userId !== userId && auth.role !== 'admin') {
      return c.json({
        success: false,
        error: 'Forbidden',
        message: 'You can only update your own profile',
        timestamp: new Date().toISOString(),
      }, 403);
    }

    // Build update query
    const updateFields: string[] = [];
    const params: any[] = [];

    if (updateData.firstName) {
      updateFields.push('first_name = ?');
      params.push(updateData.firstName);
    }

    if (updateData.lastName) {
      updateFields.push('last_name = ?');
      params.push(updateData.lastName);
    }

    if (updateData.bio !== undefined) {
      updateFields.push('bio = ?');
      params.push(updateData.bio);
    }

    if (updateData.specialties) {
      updateFields.push('specialties = ?');
      params.push(JSON.stringify(updateData.specialties));
    }

    if (updateData.preferredLanguage) {
      updateFields.push('preferred_language = ?');
      params.push(updateData.preferredLanguage);
    }

    if (updateData.timezone) {
      updateFields.push('timezone = ?');
      params.push(updateData.timezone);
    }

    if (updateData.availabilityStatus) {
      updateFields.push('availability_status = ?');
      params.push(updateData.availabilityStatus);
    }

    if (updateFields.length === 0) {
      return c.json({
        success: false,
        error: 'No valid fields to update',
        timestamp: new Date().toISOString(),
      }, 400);
    }

    updateFields.push('updated_at = ?');
    params.push(new Date().toISOString());
    params.push(userId);

    await c.env.DB
      .prepare(`UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`)
      .bind(...params)
      .run();

    // Get updated user
    const updatedUser = await c.env.DB
      .prepare(`
        SELECT 
          id, email, first_name, last_name, role, status, specialties,
          gmc_number, preferred_language, timezone, availability_status,
          profile_image_url, bio, points, volunteer_hours, created_at, updated_at
        FROM users WHERE id = ?
      `)
      .bind(userId)
      .first() as any;

    const userData = {
      ...updatedUser,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      specialties: updatedUser.specialties ? JSON.parse(updatedUser.specialties) : [],
      gmcNumber: updatedUser.gmc_number,
      preferredLanguage: updatedUser.preferred_language,
      availabilityStatus: updatedUser.availability_status,
      profileImageUrl: updatedUser.profile_image_url,
      volunteerHours: updatedUser.volunteer_hours,
      createdAt: updatedUser.created_at,
      updatedAt: updatedUser.updated_at,
    };

    const response: ApiResponse<{ user: typeof userData }> = {
      success: true,
      data: { user: userData },
      message: 'User updated successfully',
      timestamp: new Date().toISOString(),
    };

    return c.json(response);

  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to update user',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, 500);
  }
});