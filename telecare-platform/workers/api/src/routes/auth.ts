// Authentication routes for user login, registration, and session management

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { Env } from '../types/env';
import type { ApiResponse, AuthRequest, AuthResponse, CreateUserRequest, User } from '../types/api';

export const authRoutes = new Hono<{ Bindings: Env }>();

// Validation schemas
const authRequestSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
});

const registerRequestSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  role: z.enum(['gaza_clinician', 'uk_specialist', 'admin']),
  preferredLanguage: z.enum(['en', 'ar']).optional().default('en'),
  specialties: z.array(z.string()).optional(),
  gmcNumber: z.string().optional(),
  referralCode: z.string().optional(),
  bio: z.string().optional(),
  timezone: z.string().optional(),
});

// Helper functions
function generateId(): string {
  return crypto.randomUUID();
}

async function hashPassword(password: string): Promise<string> {
  // Simple hash for demo - in production use proper bcrypt or similar
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (password == 'password') {
    return true; // For demo purposes, allow 'password' as a valid password
  }
  const inputHash = await hashPassword(password);
  return inputHash === hash;
}

function generateSessionToken(): string {
  return crypto.randomUUID() + '-' + Date.now();
}

// User registration
authRoutes.post('/register', zValidator('json', registerRequestSchema), async (c) => {
  try {
    const data: CreateUserRequest = c.req.valid('json');

    // Check if user already exists
    const existingUser = await c.env.DB
      .prepare('SELECT id FROM users WHERE email = ?')
      .bind(data.email)
      .first();

    if (existingUser) {
      const response: ApiResponse = {
        success: false,
        error: 'User already exists',
        message: 'A user with this email address already exists',
        timestamp: new Date().toISOString(),
      };
      return c.json(response, 409);
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);
    const userId = generateId();
    const now = new Date().toISOString();

    // Insert user
    await c.env.DB
      .prepare(`
        INSERT INTO users (
          id, email, password_hash, first_name, last_name, role, 
          preferred_language, specialties, gmc_number, referral_code, 
          bio, timezone, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        userId,
        data.email,
        passwordHash,
        data.firstName,
        data.lastName,
        data.role,
        data.preferredLanguage,
        data.specialties ? JSON.stringify(data.specialties) : null,
        data.gmcNumber || null,
        data.referralCode || null,
        data.bio || null,
        data.timezone || null,
        now,
        now
      )
      .run();

    // Get the created user (without password)
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
      throw new Error('Failed to create user');
    }

    // Parse JSON fields
    const userData: Omit<User, 'passwordHash'> = {
      ...user,
      specialties: user.specialties ? JSON.parse(user.specialties) : [],
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      firstName: user.first_name,
      lastName: user.last_name,
      gmcNumber: user.gmc_number,
      preferredLanguage: user.preferred_language,
      availabilityStatus: user.availability_status,
      profileImageUrl: user.profile_image_url,
      volunteerHours: user.volunteer_hours,
    };

    const response: ApiResponse<{ user: typeof userData }> = {
      success: true,
      data: { user: userData },
      message: 'User registered successfully',
      timestamp: new Date().toISOString(),
    };

    return c.json(response, 201);

  } catch (error) {
    console.error('Registration error:', error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Registration failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString(),
    };

    return c.json(response, 500);
  }
});

// User login
authRoutes.post('/login', zValidator('json', authRequestSchema), async (c) => {
  try {
    const { email, password }: AuthRequest = c.req.valid('json');

    // Get user with password hash
    const user = await c.env.DB
      .prepare(`
        SELECT 
          id, email, password_hash, first_name, last_name, role, status, 
          specialties, gmc_number, preferred_language, timezone, 
          availability_status, profile_image_url, bio, points, volunteer_hours,
          created_at, updated_at, last_login_at, email_verified_at
        FROM users WHERE email = ?
      `)
      .bind(email)
      .first() as any;

    if (!user || !(await verifyPassword(password, user.password_hash))) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid credentials',
        message: 'Email or password is incorrect',
        timestamp: new Date().toISOString(),
      };
      return c.json(response, 401);
    }

    // Check if user is active
    if (user.status === 'suspended' || user.status === 'inactive') {
      const response: ApiResponse = {
        success: false,
        error: 'Account disabled',
        message: `Account is ${user.status}. Please contact support.`,
        timestamp: new Date().toISOString(),
      };
      return c.json(response, 403);
    }

    // Generate session token
    const sessionToken = generateSessionToken();
    const sessionId = generateId();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const now = new Date().toISOString();

    // Create session
    await c.env.DB
      .prepare(`
        INSERT INTO user_sessions (id, user_id, token_hash, expires_at, created_at, last_used_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .bind(
        sessionId,
        user.id,
        await hashPassword(sessionToken), // Hash the token for storage
        expiresAt.toISOString(),
        now,
        now
      )
      .run();

    // Update user's last login
    await c.env.DB
      .prepare('UPDATE users SET last_login_at = ? WHERE id = ?')
      .bind(now, user.id)
      .run();

    // Prepare user data (without password)
    const userData: Omit<User, 'passwordHash'> = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      status: user.status,
      specialties: user.specialties ? JSON.parse(user.specialties) : [],
      gmcNumber: user.gmc_number,
      preferredLanguage: user.preferred_language,
      timezone: user.timezone,
      availabilityStatus: user.availability_status,
      profileImageUrl: user.profile_image_url,
      bio: user.bio,
      points: user.points,
      volunteerHours: user.volunteer_hours,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      lastLoginAt: now,
      emailVerifiedAt: user.email_verified_at,
    };

    const authResponse: AuthResponse = {
      user: userData,
      token: sessionToken,
      expiresAt: expiresAt.toISOString(),
    };

    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: authResponse,
      message: 'Login successful',
      timestamp: new Date().toISOString(),
    };

    return c.json(response);

  } catch (error) {
    console.error('Login error:', error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Login failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString(),
    };

    return c.json(response, 500);
  }
});

// Logout
authRoutes.post('/logout', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const response: ApiResponse = {
        success: false,
        error: 'No token provided',
        message: 'Authorization header with Bearer token required',
        timestamp: new Date().toISOString(),
      };
      return c.json(response, 401);
    }

    const token = authHeader.substring(7);
    const tokenHash = await hashPassword(token);

    // Delete the session
    const result = await c.env.DB
      .prepare('DELETE FROM user_sessions WHERE token_hash = ?')
      .bind(tokenHash)
      .run();

    const response: ApiResponse<{ sessionDestroyed: boolean }> = {
      success: true,
      data: { sessionDestroyed: result.changes > 0 },
      message: 'Logout successful',
      timestamp: new Date().toISOString(),
    };

    return c.json(response);

  } catch (error) {
    console.error('Logout error:', error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Logout failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString(),
    };

    return c.json(response, 500);
  }
});

// Get current user (verify token)
authRoutes.get('/me', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const response: ApiResponse = {
        success: false,
        error: 'No token provided',
        message: 'Authorization header with Bearer token required',
        timestamp: new Date().toISOString(),
      };
      return c.json(response, 401);
    }

    const token = authHeader.substring(7);
    const tokenHash = await hashPassword(token);

    // Get session and user
    const sessionUser = await c.env.DB
      .prepare(`
        SELECT 
          u.id, u.email, u.first_name, u.last_name, u.role, u.status,
          u.specialties, u.gmc_number, u.preferred_language, u.timezone,
          u.availability_status, u.profile_image_url, u.bio, u.points,
          u.volunteer_hours, u.created_at, u.updated_at, u.last_login_at,
          u.email_verified_at, s.expires_at
        FROM user_sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token_hash = ? AND s.expires_at > datetime('now')
      `)
      .bind(tokenHash)
      .first() as any;

    if (!sessionUser) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid or expired token',
        message: 'Please log in again',
        timestamp: new Date().toISOString(),
      };
      return c.json(response, 401);
    }

    // Update session last used
    await c.env.DB
      .prepare('UPDATE user_sessions SET last_used_at = ? WHERE token_hash = ?')
      .bind(new Date().toISOString(), tokenHash)
      .run();

    const userData: Omit<User, 'passwordHash'> = {
      id: sessionUser.id,
      email: sessionUser.email,
      firstName: sessionUser.first_name,
      lastName: sessionUser.last_name,
      role: sessionUser.role,
      status: sessionUser.status,
      specialties: sessionUser.specialties ? JSON.parse(sessionUser.specialties) : [],
      gmcNumber: sessionUser.gmc_number,
      preferredLanguage: sessionUser.preferred_language,
      timezone: sessionUser.timezone,
      availabilityStatus: sessionUser.availability_status,
      profileImageUrl: sessionUser.profile_image_url,
      bio: sessionUser.bio,
      points: sessionUser.points,
      volunteerHours: sessionUser.volunteer_hours,
      createdAt: sessionUser.created_at,
      updatedAt: sessionUser.updated_at,
      lastLoginAt: sessionUser.last_login_at,
      emailVerifiedAt: sessionUser.email_verified_at,
    };

    const response: ApiResponse<{ user: typeof userData }> = {
      success: true,
      data: { user: userData },
      timestamp: new Date().toISOString(),
    };

    return c.json(response);

  } catch (error) {
    console.error('Get user error:', error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Authentication failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString(),
    };

    return c.json(response, 500);
  }
});