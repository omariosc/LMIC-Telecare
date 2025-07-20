-- Initial database schema for Telecare Platform
-- Created: 2025-01-20

-- Users table for authentication and user management
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('gaza_clinician', 'uk_specialist', 'admin')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'suspended', 'inactive')),
    specialties TEXT, -- JSON array of medical specialties
    gmc_number TEXT, -- For UK doctors
    verification_documents TEXT, -- JSON array of document URLs
    referral_code TEXT, -- For Gaza clinicians
    preferred_language TEXT NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'ar')),
    timezone TEXT DEFAULT 'UTC',
    availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'offline')),
    profile_image_url TEXT,
    bio TEXT,
    points INTEGER DEFAULT 0,
    volunteer_hours INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login_at DATETIME,
    email_verified_at DATETIME,
    verification_requested_at DATETIME,
    verification_completed_at DATETIME
);

-- User sessions table
CREATE TABLE user_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    device_info TEXT, -- JSON with device/browser info
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_used_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Medical cases table
CREATE TABLE medical_cases (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    specialty TEXT NOT NULL,
    urgency TEXT NOT NULL CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    patient_age INTEGER,
    patient_gender TEXT CHECK (patient_gender IN ('male', 'female', 'other', 'not_specified')),
    symptoms TEXT, -- JSON array
    medical_history TEXT,
    current_medications TEXT, -- JSON array
    test_results TEXT, -- JSON array
    images TEXT, -- JSON array of image URLs
    attachments TEXT, -- JSON array of attachment URLs
    language TEXT NOT NULL DEFAULT 'en',
    translated_content TEXT, -- JSON with translations
    created_by TEXT NOT NULL REFERENCES users(id),
    assigned_to TEXT REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME,
    tags TEXT -- JSON array of tags
);

-- Case responses/consultations table
CREATE TABLE case_responses (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL REFERENCES medical_cases(id) ON DELETE CASCADE,
    parent_response_id TEXT REFERENCES case_responses(id), -- For threaded responses
    content TEXT NOT NULL,
    response_type TEXT NOT NULL DEFAULT 'consultation' CHECK (response_type IN ('consultation', 'question', 'clarification', 'follow_up')),
    language TEXT NOT NULL DEFAULT 'en',
    translated_content TEXT, -- JSON with translations
    attachments TEXT, -- JSON array of attachment URLs
    is_private BOOLEAN DEFAULT FALSE, -- For internal notes
    created_by TEXT NOT NULL REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    edited_at DATETIME
);

-- Case assignments and specialist involvement
CREATE TABLE case_assignments (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL REFERENCES medical_cases(id) ON DELETE CASCADE,
    specialist_id TEXT NOT NULL REFERENCES users(id),
    assigned_by TEXT NOT NULL REFERENCES users(id),
    assignment_type TEXT NOT NULL DEFAULT 'primary' CHECK (assignment_type IN ('primary', 'secondary', 'observer')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'declined')),
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    notes TEXT
);

-- File uploads and attachments
CREATE TABLE file_uploads (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_url TEXT NOT NULL, -- R2 storage URL
    thumbnail_url TEXT, -- For images
    uploaded_by TEXT NOT NULL REFERENCES users(id),
    case_id TEXT REFERENCES medical_cases(id) ON DELETE CASCADE,
    response_id TEXT REFERENCES case_responses(id) ON DELETE CASCADE,
    upload_purpose TEXT NOT NULL CHECK (upload_purpose IN ('case_attachment', 'response_attachment', 'profile_image', 'verification_document')),
    is_processed BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Notifications system
CREATE TABLE notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('new_case', 'case_response', 'case_assignment', 'system_message', 'achievement')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data TEXT, -- JSON with additional data
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    read_at DATETIME
);

-- User achievements and badges
CREATE TABLE user_achievements (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_type TEXT NOT NULL CHECK (achievement_type IN ('first_response', 'helpful_response', 'quick_response', 'specialist_of_month', 'volunteer_hours')),
    achievement_data TEXT, -- JSON with achievement details
    points_awarded INTEGER DEFAULT 0,
    awarded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- System settings and configuration
CREATE TABLE system_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_by TEXT REFERENCES users(id)
);

-- Translation cache to reduce API costs
CREATE TABLE translation_cache (
    id TEXT PRIMARY KEY,
    source_text_hash TEXT NOT NULL, -- Hash of source text
    source_language TEXT NOT NULL,
    target_language TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    translation_service TEXT DEFAULT 'gemini',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    usage_count INTEGER DEFAULT 1
);

-- Audit log for important actions
CREATE TABLE audit_log (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    old_values TEXT, -- JSON
    new_values TEXT, -- JSON
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX idx_medical_cases_created_by ON medical_cases(created_by);
CREATE INDEX idx_medical_cases_specialty ON medical_cases(specialty);
CREATE INDEX idx_medical_cases_status ON medical_cases(status);
CREATE INDEX idx_medical_cases_urgency ON medical_cases(urgency);
CREATE INDEX idx_medical_cases_created_at ON medical_cases(created_at);
CREATE INDEX idx_case_responses_case_id ON case_responses(case_id);
CREATE INDEX idx_case_responses_created_by ON case_responses(created_by);
CREATE INDEX idx_case_responses_parent_response_id ON case_responses(parent_response_id);
CREATE INDEX idx_case_assignments_case_id ON case_assignments(case_id);
CREATE INDEX idx_case_assignments_specialist_id ON case_assignments(specialist_id);
CREATE INDEX idx_file_uploads_case_id ON file_uploads(case_id);
CREATE INDEX idx_file_uploads_response_id ON file_uploads(response_id);
CREATE INDEX idx_file_uploads_uploaded_by ON file_uploads(uploaded_by);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_translation_cache_hash ON translation_cache(source_text_hash, source_language, target_language);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);

-- Insert default system settings
INSERT INTO system_settings (key, value, description) VALUES
('site_maintenance_mode', 'false', 'Enable/disable site maintenance mode'),
('max_file_upload_size', '10485760', 'Maximum file upload size in bytes (10MB)'),
('supported_file_types', '["jpg", "jpeg", "png", "pdf", "doc", "docx"]', 'Allowed file upload types'),
('default_case_urgency', 'medium', 'Default urgency level for new cases'),
('points_per_response', '10', 'Points awarded for case responses'),
('points_per_resolution', '25', 'Points awarded for case resolutions'),
('notification_retention_days', '30', 'Days to keep notifications'),
('translation_cache_retention_days', '90', 'Days to keep translation cache'),
('audit_log_retention_days', '365', 'Days to keep audit logs');