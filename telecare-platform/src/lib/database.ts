// Database helper functions and utilities for Cloudflare D1
import type {
  User,
  MedicalCase,
  CaseResponse,
  CaseAssignment,
  FileUpload,
  Notification,
  UserAchievement,
  TranslationCache,
  AuditLog,
  CaseWithUser,
  ResponseWithUser,
  UserWithStats,
  CaseFilters,
  UserFilters,
  NotificationFilters,
  CreateUserInput,
  UpdateUserInput,
  CreateCaseInput,
  UpdateCaseInput,
  CreateResponseInput,
} from '@/types/database';

// Database connection type for Cloudflare D1
export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  exec(query: string): Promise<D1ExecResult>;
  batch(statements: D1PreparedStatement[]): Promise<D1Result[]>;
}

interface D1PreparedStatement {
  bind(...params: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run(): Promise<D1Result>;
  all<T = unknown>(): Promise<D1Result<T>>;
}

interface D1Result<T = unknown> {
  results?: T[];
  success: boolean;
  error?: string;
  meta: {
    changes: number;
    last_row_id: number;
    duration: number;
  };
}

interface D1ExecResult {
  count: number;
  duration: number;
}

export class DatabaseHelper {
  constructor(private db: D1Database) {}

  // Utility functions
  private generateId(): string {
    return crypto.randomUUID();
  }

  private parseJsonField<T>(value: string | null): T | undefined {
    if (!value) return undefined;
    try {
      return JSON.parse(value) as T;
    } catch {
      return undefined;
    }
  }

  private stringifyJsonField<T>(value: T[] | Record<string, unknown> | undefined): string | null {
    if (!value) return null;
    return JSON.stringify(value);
  }

  // User operations
  async createUser(input: CreateUserInput): Promise<User> {
    const id = this.generateId();
    const now = new Date().toISOString();
    
    const stmt = this.db.prepare(`
      INSERT INTO users (
        id, email, first_name, last_name, role, specialties, gmc_number, 
        referral_code, preferred_language, bio, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      input.email,
      input.first_name,
      input.last_name,
      input.role,
      this.stringifyJsonField(input.specialties),
      input.gmc_number || null,
      input.referral_code || null,
      input.preferred_language || 'en',
      input.bio || null,
      now,
      now
    );

    await stmt.run();
    return this.getUserById(id) as Promise<User>;
  }

  async getUserById(id: string): Promise<User | null> {
    const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?').bind(id);
    const result = await stmt.first<User>();
    
    if (!result) return null;
    
    return {
      ...result,
      specialties: this.parseJsonField<string[]>(result.specialties as unknown as string),
      verification_documents: this.parseJsonField<string[]>(result.verification_documents as unknown as string),
      created_at: new Date(result.created_at),
      updated_at: new Date(result.updated_at),
      last_login_at: result.last_login_at ? new Date(result.last_login_at) : undefined,
      email_verified_at: result.email_verified_at ? new Date(result.email_verified_at) : undefined,
      verification_requested_at: result.verification_requested_at ? new Date(result.verification_requested_at) : undefined,
      verification_completed_at: result.verification_completed_at ? new Date(result.verification_completed_at) : undefined,
    };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?').bind(email);
    const result = await stmt.first<User>();
    
    if (!result) return null;
    return this.parseUserResult(result);
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<User | null> {
    const updates: string[] = [];
    const values: unknown[] = [];

    if (input.first_name !== undefined) {
      updates.push('first_name = ?');
      values.push(input.first_name);
    }
    if (input.last_name !== undefined) {
      updates.push('last_name = ?');
      values.push(input.last_name);
    }
    if (input.specialties !== undefined) {
      updates.push('specialties = ?');
      values.push(this.stringifyJsonField(input.specialties));
    }
    if (input.preferred_language !== undefined) {
      updates.push('preferred_language = ?');
      values.push(input.preferred_language);
    }
    if (input.timezone !== undefined) {
      updates.push('timezone = ?');
      values.push(input.timezone);
    }
    if (input.availability_status !== undefined) {
      updates.push('availability_status = ?');
      values.push(input.availability_status);
    }
    if (input.bio !== undefined) {
      updates.push('bio = ?');
      values.push(input.bio);
    }

    if (updates.length === 0) {
      return this.getUserById(id);
    }

    updates.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);

    const stmt = this.db.prepare(`
      UPDATE users SET ${updates.join(', ')} WHERE id = ?
    `).bind(...values);

    await stmt.run();
    return this.getUserById(id);
  }

  async getUsers(filters: UserFilters = {}): Promise<{ users: UserWithStats[]; total: number }> {
    let query = `
      SELECT u.*, 
             COUNT(DISTINCT mc.id) as total_cases,
             COUNT(DISTINCT CASE WHEN mc.status = 'resolved' THEN mc.id END) as resolved_cases,
             COUNT(DISTINCT cr.id) as total_responses
      FROM users u
      LEFT JOIN medical_cases mc ON u.id = mc.created_by OR u.id = mc.assigned_to
      LEFT JOIN case_responses cr ON u.id = cr.created_by
    `;
    
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (filters.role) {
      conditions.push('u.role = ?');
      values.push(filters.role);
    }
    if (filters.status) {
      conditions.push('u.status = ?');
      values.push(filters.status);
    }
    if (filters.availability_status) {
      conditions.push('u.availability_status = ?');
      values.push(filters.availability_status);
    }
    if (filters.search) {
      conditions.push('(u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)');
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm, searchTerm);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY u.id';

    const sortBy = filters.sort_by || 'created_at';
    const sortOrder = filters.sort_order || 'desc';
    query += ` ORDER BY u.${sortBy} ${sortOrder}`;

    const limit = filters.limit || 20;
    const offset = ((filters.page || 1) - 1) * limit;
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    const stmt = this.db.prepare(query).bind(...values);
    const result = await stmt.all<UserWithStats>();
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM users u';
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }
    
    const countStmt = this.db.prepare(countQuery).bind(...values.slice(0, conditions.length));
    const countResult = await countStmt.first<{ total: number }>();

    return {
      users: result.results?.map(user => ({
        ...this.parseUserResult(user),
        total_cases: user.total_cases || 0,
        resolved_cases: user.resolved_cases || 0,
        total_responses: user.total_responses || 0,
        recent_activity_count: 0, // TODO: Calculate recent activity
      })) || [],
      total: countResult?.total || 0,
    };
  }

  // Medical Case operations
  async createCase(input: CreateCaseInput, created_by: string): Promise<MedicalCase> {
    const id = this.generateId();
    const now = new Date().toISOString();
    
    const stmt = this.db.prepare(`
      INSERT INTO medical_cases (
        id, title, description, specialty, urgency, patient_age, patient_gender,
        symptoms, medical_history, current_medications, test_results, language,
        created_by, tags, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      input.title,
      input.description,
      input.specialty,
      input.urgency,
      input.patient_age || null,
      input.patient_gender || null,
      this.stringifyJsonField(input.symptoms),
      input.medical_history || null,
      this.stringifyJsonField(input.current_medications),
      this.stringifyJsonField(input.test_results),
      input.language || 'en',
      created_by,
      this.stringifyJsonField(input.tags),
      now,
      now
    );

    await stmt.run();
    return this.getCaseById(id) as Promise<MedicalCase>;
  }

  async getCaseById(id: string): Promise<MedicalCase | null> {
    const stmt = this.db.prepare('SELECT * FROM medical_cases WHERE id = ?').bind(id);
    const result = await stmt.first<MedicalCase>();
    
    if (!result) return null;
    return this.parseCaseResult(result);
  }

  async getCases(filters: CaseFilters = {}): Promise<{ cases: CaseWithUser[]; total: number }> {
    let query = `
      SELECT mc.*, 
             u1.id as created_by_id, u1.first_name as created_by_first_name, 
             u1.last_name as created_by_last_name, u1.role as created_by_role,
             u1.specialties as created_by_specialties,
             u2.id as assigned_to_id, u2.first_name as assigned_to_first_name,
             u2.last_name as assigned_to_last_name, u2.role as assigned_to_role,
             u2.specialties as assigned_to_specialties,
             COUNT(DISTINCT cr.id) as response_count,
             MAX(cr.created_at) as latest_response_at
      FROM medical_cases mc
      LEFT JOIN users u1 ON mc.created_by = u1.id
      LEFT JOIN users u2 ON mc.assigned_to = u2.id
      LEFT JOIN case_responses cr ON mc.id = cr.case_id
    `;
    
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (filters.specialty) {
      conditions.push('mc.specialty = ?');
      values.push(filters.specialty);
    }
    if (filters.urgency && filters.urgency.length > 0) {
      conditions.push(`mc.urgency IN (${filters.urgency.map(() => '?').join(', ')})`);
      values.push(...filters.urgency);
    }
    if (filters.status && filters.status.length > 0) {
      conditions.push(`mc.status IN (${filters.status.map(() => '?').join(', ')})`);
      values.push(...filters.status);
    }
    if (filters.created_by) {
      conditions.push('mc.created_by = ?');
      values.push(filters.created_by);
    }
    if (filters.assigned_to) {
      conditions.push('mc.assigned_to = ?');
      values.push(filters.assigned_to);
    }
    if (filters.language) {
      conditions.push('mc.language = ?');
      values.push(filters.language);
    }
    if (filters.search) {
      conditions.push('(mc.title LIKE ? OR mc.description LIKE ?)');
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY mc.id';

    const sortBy = filters.sort_by || 'created_at';
    const sortOrder = filters.sort_order || 'desc';
    query += ` ORDER BY mc.${sortBy} ${sortOrder}`;

    const limit = filters.limit || 20;
    const offset = ((filters.page || 1) - 1) * limit;
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    const stmt = this.db.prepare(query).bind(...values);
    const result = await stmt.all<any>();
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM medical_cases mc';
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }
    
    const countStmt = this.db.prepare(countQuery).bind(...values.slice(0, conditions.length));
    const countResult = await countStmt.first<{ total: number }>();

    return {
      cases: result.results?.map(row => ({
        ...this.parseCaseResult(row),
        created_by_user: {
          id: row.created_by_id,
          first_name: row.created_by_first_name,
          last_name: row.created_by_last_name,
          role: row.created_by_role,
          specialties: this.parseJsonField<string[]>(row.created_by_specialties),
        },
        assigned_to_user: row.assigned_to_id ? {
          id: row.assigned_to_id,
          first_name: row.assigned_to_first_name,
          last_name: row.assigned_to_last_name,
          role: row.assigned_to_role,
          specialties: this.parseJsonField<string[]>(row.assigned_to_specialties),
        } : undefined,
        response_count: row.response_count || 0,
        latest_response_at: row.latest_response_at ? new Date(row.latest_response_at) : undefined,
      })) || [],
      total: countResult?.total || 0,
    };
  }

  // Case Response operations
  async createResponse(input: CreateResponseInput, created_by: string): Promise<CaseResponse> {
    const id = this.generateId();
    const now = new Date().toISOString();
    
    const stmt = this.db.prepare(`
      INSERT INTO case_responses (
        id, case_id, parent_response_id, content, response_type, language,
        attachments, is_private, created_by, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      input.case_id,
      input.parent_response_id || null,
      input.content,
      input.response_type || 'consultation',
      input.language || 'en',
      this.stringifyJsonField(input.attachments),
      input.is_private || false,
      created_by,
      now,
      now
    );

    await stmt.run();
    return this.getResponseById(id) as Promise<CaseResponse>;
  }

  async getResponseById(id: string): Promise<CaseResponse | null> {
    const stmt = this.db.prepare('SELECT * FROM case_responses WHERE id = ?').bind(id);
    const result = await stmt.first<CaseResponse>();
    
    if (!result) return null;
    return this.parseResponseResult(result);
  }

  async getResponsesByCase(caseId: string): Promise<ResponseWithUser[]> {
    const stmt = this.db.prepare(`
      SELECT cr.*, 
             u.id as user_id, u.first_name, u.last_name, u.role, u.profile_image_url,
             COUNT(replies.id) as reply_count
      FROM case_responses cr
      LEFT JOIN users u ON cr.created_by = u.id
      LEFT JOIN case_responses replies ON cr.id = replies.parent_response_id
      WHERE cr.case_id = ?
      GROUP BY cr.id
      ORDER BY cr.created_at ASC
    `).bind(caseId);
    
    const result = await stmt.all<any>();
    
    return result.results?.map(row => ({
      ...this.parseResponseResult(row),
      created_by_user: {
        id: row.user_id,
        first_name: row.first_name,
        last_name: row.last_name,
        role: row.role,
        profile_image_url: row.profile_image_url,
      },
      reply_count: row.reply_count || 0,
    })) || [];
  }

  // Notification operations
  async createNotification(
    user_id: string,
    type: string,
    title: string,
    message: string,
    data?: Record<string, unknown>
  ): Promise<void> {
    const id = this.generateId();
    const now = new Date().toISOString();
    
    const stmt = this.db.prepare(`
      INSERT INTO notifications (id, user_id, type, title, message, data, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(id, user_id, type, title, message, this.stringifyJsonField(data), now);

    await stmt.run();
  }

  async getNotifications(filters: NotificationFilters): Promise<{ notifications: Notification[]; total: number }> {
    let query = 'SELECT * FROM notifications WHERE user_id = ?';
    const values: unknown[] = [filters.user_id];

    if (filters.type && filters.type.length > 0) {
      query += ` AND type IN (${filters.type.map(() => '?').join(', ')})`;
      values.push(...filters.type);
    }
    if (filters.is_read !== undefined) {
      query += ' AND is_read = ?';
      values.push(filters.is_read);
    }

    query += ' ORDER BY created_at DESC';

    const limit = filters.limit || 20;
    const offset = ((filters.page || 1) - 1) * limit;
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    const stmt = this.db.prepare(query).bind(...values);
    const result = await stmt.all<Notification>();
    
    // Get total count
    const countQuery = query.split('ORDER BY')[0];
    const countStmt = this.db.prepare(`SELECT COUNT(*) as total FROM (${countQuery})`).bind(...values);
    const countResult = await countStmt.first<{ total: number }>();

    return {
      notifications: result.results?.map(this.parseNotificationResult.bind(this)) || [],
      total: countResult?.total || 0,
    };
  }

  // Audit logging
  async logAction(
    user_id: string | null,
    action: string,
    resource_type: string,
    resource_id?: string,
    old_values?: Record<string, unknown>,
    new_values?: Record<string, unknown>,
    ip_address?: string,
    user_agent?: string
  ): Promise<void> {
    const id = this.generateId();
    const now = new Date().toISOString();
    
    const stmt = this.db.prepare(`
      INSERT INTO audit_log (
        id, user_id, action, resource_type, resource_id, old_values, 
        new_values, ip_address, user_agent, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      user_id,
      action,
      resource_type,
      resource_id || null,
      this.stringifyJsonField(old_values),
      this.stringifyJsonField(new_values),
      ip_address || null,
      user_agent || null,
      now
    );

    await stmt.run();
  }

  // Helper methods for parsing results
  private parseUserResult(result: any): User {
    return {
      ...result,
      specialties: this.parseJsonField<string[]>(result.specialties),
      verification_documents: this.parseJsonField<string[]>(result.verification_documents),
      created_at: new Date(result.created_at),
      updated_at: new Date(result.updated_at),
      last_login_at: result.last_login_at ? new Date(result.last_login_at) : undefined,
      email_verified_at: result.email_verified_at ? new Date(result.email_verified_at) : undefined,
      verification_requested_at: result.verification_requested_at ? new Date(result.verification_requested_at) : undefined,
      verification_completed_at: result.verification_completed_at ? new Date(result.verification_completed_at) : undefined,
    };
  }

  private parseCaseResult(result: any): MedicalCase {
    return {
      ...result,
      symptoms: this.parseJsonField<string[]>(result.symptoms),
      current_medications: this.parseJsonField<string[]>(result.current_medications),
      test_results: this.parseJsonField<string[]>(result.test_results),
      images: this.parseJsonField<string[]>(result.images),
      attachments: this.parseJsonField<string[]>(result.attachments),
      translated_content: this.parseJsonField<Record<string, unknown>>(result.translated_content),
      tags: this.parseJsonField<string[]>(result.tags),
      created_at: new Date(result.created_at),
      updated_at: new Date(result.updated_at),
      resolved_at: result.resolved_at ? new Date(result.resolved_at) : undefined,
    };
  }

  private parseResponseResult(result: any): CaseResponse {
    return {
      ...result,
      translated_content: this.parseJsonField<Record<string, unknown>>(result.translated_content),
      attachments: this.parseJsonField<string[]>(result.attachments),
      created_at: new Date(result.created_at),
      updated_at: new Date(result.updated_at),
      edited_at: result.edited_at ? new Date(result.edited_at) : undefined,
    };
  }

  private parseNotificationResult(result: any): Notification {
    return {
      ...result,
      data: this.parseJsonField<Record<string, unknown>>(result.data),
      created_at: new Date(result.created_at),
      read_at: result.read_at ? new Date(result.read_at) : undefined,
    };
  }
}