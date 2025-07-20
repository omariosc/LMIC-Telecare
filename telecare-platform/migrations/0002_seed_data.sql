-- Seed data for development and testing
-- Created: 2025-01-20

-- Insert dummy users for development
INSERT INTO users (
    id, email, first_name, last_name, role, status, specialties, gmc_number, 
    preferred_language, points, volunteer_hours, email_verified_at, verification_completed_at
) VALUES
-- Gaza Clinicians
('gaza_clinic_001', 'dr.ahmad@gaza-health.ps', 'Ahmad', 'Al-Sharif', 'gaza_clinician', 'verified', 
 '["general_medicine", "emergency_medicine"]', NULL, 'ar', 150, 25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
 
('gaza_clinic_002', 'dr.fatima@gaza-health.ps', 'Fatima', 'Hassan', 'gaza_clinician', 'verified', 
 '["pediatrics", "family_medicine"]', NULL, 'ar', 200, 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('gaza_clinic_003', 'dr.omar@gaza-health.ps', 'Omar', 'Zaid', 'gaza_clinician', 'verified', 
 '["surgery", "trauma"]', NULL, 'ar', 180, 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- UK Specialists
('uk_spec_001', 'dr.smith@nhs.uk', 'Sarah', 'Smith', 'uk_specialist', 'verified', 
 '["cardiology", "internal_medicine"]', 'GMC123456', 'en', 500, 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('uk_spec_002', 'dr.johnson@nhs.uk', 'Michael', 'Johnson', 'uk_specialist', 'verified', 
 '["neurology", "stroke_medicine"]', 'GMC234567', 'en', 450, 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('uk_spec_003', 'dr.patel@nhs.uk', 'Priya', 'Patel', 'uk_specialist', 'verified', 
 '["pediatrics", "neonatology"]', 'GMC345678', 'en', 600, 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('uk_spec_004', 'dr.wilson@nhs.uk', 'James', 'Wilson', 'uk_specialist', 'verified', 
 '["orthopedics", "trauma_surgery"]', 'GMC456789', 'en', 380, 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('uk_spec_005', 'dr.brown@nhs.uk', 'Emma', 'Brown', 'uk_specialist', 'verified', 
 '["emergency_medicine", "critical_care"]', 'GMC567890', 'en', 520, 85, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Admin user
('admin_001', 'admin@telecare-platform.org', 'Admin', 'User', 'admin', 'verified', 
 '["administration"]', NULL, 'en', 1000, 200, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample medical cases
INSERT INTO medical_cases (
    id, title, description, specialty, urgency, status, patient_age, patient_gender,
    symptoms, medical_history, current_medications, language, created_by, assigned_to, tags
) VALUES
('case_001', 'Chest Pain in Young Adult', 
 'A 28-year-old male presents with acute chest pain that started 2 hours ago. Pain is sharp, localized to the left side, and worsens with deep breathing. No shortness of breath or palpitations. Patient is otherwise healthy.',
 'cardiology', 'medium', 'open', 28, 'male',
 '["chest_pain", "sharp_pain", "left_sided"]',
 'No significant medical history. Non-smoker, occasional alcohol use.',
 '["paracetamol_500mg_prn"]',
 'en', 'gaza_clinic_001', 'uk_spec_001',
 '["chest_pain", "young_adult", "cardiac"]'),

('case_002', 'Pediatric Fever and Rash',
 'A 5-year-old girl has had fever (39°C) for 3 days with a red rash appearing on trunk and extremities. Child is lethargic but responsive. No vomiting or diarrhea.',
 'pediatrics', 'high', 'in_progress', 5, 'female',
 '["fever", "rash", "lethargy"]',
 'Born at term, normal development, up to date with vaccinations.',
 '["paracetamol_120mg_q6h"]',
 'en', 'gaza_clinic_002', 'uk_spec_003',
 '["pediatrics", "fever", "rash", "infectious_disease"]'),

('case_003', 'Post-Operative Wound Infection',
 'Patient underwent appendectomy 5 days ago. Now presenting with wound redness, swelling, and purulent discharge. Temperature 38.5°C.',
 'surgery', 'high', 'open', 35, 'male',
 '["wound_infection", "fever", "purulent_discharge"]',
 'Recent appendectomy, diabetes mellitus type 2.',
 '["metformin_500mg_bd", "insulin_lantus_20u_daily"]',
 'ar', 'gaza_clinic_003', NULL,
 '["surgery", "wound_infection", "post_operative"]'),

('case_004', 'Neurological Symptoms Post-Trauma',
 'A 45-year-old construction worker fell from height 1 week ago. Initially seemed fine but now complaining of headaches, dizziness, and memory problems.',
 'neurology', 'critical', 'open', 45, 'male',
 '["headache", "dizziness", "memory_problems", "head_trauma"]',
 'Hypertension, controlled with medication. History of smoking.',
 '["amlodipine_5mg_daily", "atorvastatin_20mg_daily"]',
 'ar', 'gaza_clinic_001', 'uk_spec_002',
 '["neurology", "head_trauma", "tbi", "critical"]'),

('case_005', 'Chronic Cough in Elderly',
 'An 72-year-old woman has had a persistent dry cough for 6 weeks. No fever, but reports weight loss and fatigue. Former smoker (quit 10 years ago).',
 'pulmonology', 'medium', 'open', 72, 'female',
 '["chronic_cough", "weight_loss", "fatigue"]',
 'COPD, former smoker (30 pack-years), hypertension.',
 '["salbutamol_inhaler_prn", "tiotropium_18mcg_daily", "ramipril_5mg_daily"]',
 'en', 'gaza_clinic_002', NULL,
 '["pulmonology", "chronic_cough", "elderly", "copd"]');

-- Insert case responses
INSERT INTO case_responses (
    id, case_id, content, response_type, language, created_by
) VALUES
('resp_001', 'case_001', 
 'Thank you for this case. Based on the presentation, this sounds like pleuritic chest pain. Given the patient''s age and lack of risk factors, pulmonary embolism is less likely but should be considered. I would recommend: 1) ECG to rule out cardiac causes 2) Chest X-ray 3) D-dimer if PE suspected. The sharp, pleuritic nature suggests musculoskeletal or pleural cause. Please let me know if you have access to these investigations.',
 'consultation', 'en', 'uk_spec_001'),

('resp_002', 'case_002',
 'This presentation is concerning for a viral exanthem, but we need to rule out more serious conditions like scarlet fever or Kawasaki disease. Key questions: 1) Any strawberry tongue? 2) Conjunctival injection? 3) Hand/foot swelling? 4) Recent strep throat? The fever duration and rash pattern will help differentiate. Please monitor closely and consider blood tests if available.',
 'consultation', 'en', 'uk_spec_003'),

('resp_003', 'case_002',
 'Following up on the pediatric case - have you been able to examine for the features I mentioned? Also, is the child taking fluids well? Any signs of dehydration? The high fever for 3 days with rash does warrant close monitoring.',
 'follow_up', 'en', 'uk_spec_003'),

('resp_004', 'case_004',
 'This is very concerning for a delayed traumatic brain injury or chronic subdural hematoma. The symptom onset 1 week post-trauma is classic. This patient needs urgent CT head if available. Signs to watch for: deteriorating consciousness, pupil changes, focal neurological deficits. This is a neurosurgical emergency that may require evacuation if imaging shows significant bleeding.',
 'consultation', 'en', 'uk_spec_002');

-- Insert case assignments
INSERT INTO case_assignments (
    id, case_id, specialist_id, assigned_by, assignment_type, status
) VALUES
('assign_001', 'case_001', 'uk_spec_001', 'gaza_clinic_001', 'primary', 'active'),
('assign_002', 'case_002', 'uk_spec_003', 'gaza_clinic_002', 'primary', 'active'),
('assign_003', 'case_004', 'uk_spec_002', 'gaza_clinic_001', 'primary', 'active');

-- Insert notifications
INSERT INTO notifications (
    id, user_id, type, title, message, data
) VALUES
('notif_001', 'uk_spec_001', 'case_assignment', 'New Case Assignment', 
 'You have been assigned to a new cardiology case: Chest Pain in Young Adult', 
 '{"case_id": "case_001", "specialty": "cardiology"}'),

('notif_002', 'gaza_clinic_001', 'case_response', 'New Response on Your Case', 
 'Dr. Sarah Smith has responded to your case about chest pain', 
 '{"case_id": "case_001", "response_id": "resp_001"}'),

('notif_003', 'uk_spec_003', 'case_assignment', 'New Case Assignment', 
 'You have been assigned to a new pediatrics case: Pediatric Fever and Rash', 
 '{"case_id": "case_002", "specialty": "pediatrics"}'),

('notif_004', 'gaza_clinic_002', 'case_response', 'New Response on Your Case', 
 'Dr. Priya Patel has responded to your pediatric case', 
 '{"case_id": "case_002", "response_id": "resp_002"}');

-- Insert some achievements
INSERT INTO user_achievements (
    id, user_id, achievement_type, achievement_data, points_awarded
) VALUES
('achieve_001', 'uk_spec_001', 'first_response', '{"case_id": "case_001"}', 25),
('achieve_002', 'uk_spec_003', 'quick_response', '{"case_id": "case_002", "response_time_minutes": 15}', 50),
('achieve_003', 'gaza_clinic_001', 'helpful_response', '{"response_id": "resp_001", "helpfulness_rating": 5}', 30);