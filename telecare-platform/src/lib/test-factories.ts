/**
 * Test data factories following CLAUDE.md pattern:
 * - Complete objects with sensible defaults
 * - Optional Partial<T> overrides
 * - Composable for complex objects
 */

// User and Authentication Types
export type MockUser = {
  id: string;
  email: string;
  name: string;
  role: "uk_specialist" | "gaza_clinician" | "admin";
  gmcNumber?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type MockConsultation = {
  id: string;
  type: "emergency" | "scheduled" | "forum";
  status: "pending" | "active" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "critical";
  description: string;
  patientAge?: number;
  patientGender?: "male" | "female" | "other";
  symptoms: string[];
  requestedBy: string; // Gaza clinician ID
  assignedTo?: string; // UK specialist ID
  createdAt: Date;
  updatedAt: Date;
};

export type MockSpecialist = {
  id: string;
  userId: string;
  gmcNumber: string;
  specialty: string;
  yearsExperience: number;
  isAvailable: boolean;
  verificationStatus: "pending" | "verified" | "rejected";
  consultationsCompleted: number;
  rating: number;
  responseTimeMinutes: number;
};

export type MockClinicianProfile = {
  id: string;
  userId: string;
  institution: string;
  department: string;
  position: string;
  location: string;
  isActive: boolean;
};

// Factory Functions

export const getMockUser = (overrides?: Partial<MockUser>): MockUser => {
  return {
    id: `user_${Math.random().toString(36).substr(2, 9)}`,
    email: "test@example.com",
    name: "Test User",
    role: "uk_specialist",
    gmcNumber: "1234567",
    isVerified: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    ...overrides,
  };
};

export const getMockUKSpecialist = (
  overrides?: Partial<MockUser>
): MockUser => {
  return getMockUser({
    role: "uk_specialist",
    gmcNumber: "1234567",
    email: "specialist@nhs.uk",
    name: "Dr. Sarah Johnson",
    isVerified: true,
    ...overrides,
  });
};

export const getMockGazaClinician = (
  overrides?: Partial<MockUser>
): MockUser => {
  return getMockUser({
    role: "gaza_clinician",
    gmcNumber: undefined,
    email: "clinician@alshifa.ps",
    name: "Dr. Ahmed Hassan",
    isVerified: true,
    ...overrides,
  });
};

export const getMockConsultation = (
  overrides?: Partial<MockConsultation>
): MockConsultation => {
  return {
    id: `consult_${Math.random().toString(36).substr(2, 9)}`,
    type: "emergency",
    status: "pending",
    priority: "high",
    description: "Patient presenting with chest pain and shortness of breath",
    patientAge: 45,
    patientGender: "male",
    symptoms: ["chest pain", "shortness of breath", "sweating"],
    requestedBy: "user_gaza123",
    assignedTo: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};

export const getMockEmergencyConsultation = (
  overrides?: Partial<MockConsultation>
): MockConsultation => {
  return getMockConsultation({
    type: "emergency",
    priority: "critical",
    status: "pending",
    description: "Trauma patient with multiple injuries from blast",
    symptoms: ["trauma", "bleeding", "unconscious"],
    ...overrides,
  });
};

export const getMockScheduledConsultation = (
  overrides?: Partial<MockConsultation>
): MockConsultation => {
  return getMockConsultation({
    type: "scheduled",
    priority: "medium",
    status: "pending",
    description: "Complex surgical case requiring specialist input",
    symptoms: ["complex surgical case"],
    ...overrides,
  });
};

export const getMockForumConsultation = (
  overrides?: Partial<MockConsultation>
): MockConsultation => {
  return getMockConsultation({
    type: "forum",
    priority: "low",
    status: "pending",
    description: "General question about treatment protocol",
    symptoms: ["general inquiry"],
    ...overrides,
  });
};

export const getMockSpecialistProfile = (
  overrides?: Partial<MockSpecialist>
): MockSpecialist => {
  return {
    id: `specialist_${Math.random().toString(36).substr(2, 9)}`,
    userId: "user_uk123",
    gmcNumber: "1234567",
    specialty: "Emergency Medicine",
    yearsExperience: 10,
    isAvailable: true,
    verificationStatus: "verified",
    consultationsCompleted: 150,
    rating: 4.8,
    responseTimeMinutes: 15,
    ...overrides,
  };
};

export const getMockCardiology = (
  overrides?: Partial<MockSpecialist>
): MockSpecialist => {
  return getMockSpecialistProfile({
    specialty: "Cardiology",
    yearsExperience: 15,
    consultationsCompleted: 200,
    rating: 4.9,
    responseTimeMinutes: 12,
    ...overrides,
  });
};

export const getMockTraumaSurgery = (
  overrides?: Partial<MockSpecialist>
): MockSpecialist => {
  return getMockSpecialistProfile({
    specialty: "Trauma Surgery",
    yearsExperience: 20,
    consultationsCompleted: 300,
    rating: 4.7,
    responseTimeMinutes: 8,
    ...overrides,
  });
};

export const getMockClinicianProfile = (
  overrides?: Partial<MockClinicianProfile>
): MockClinicianProfile => {
  return {
    id: `clinician_${Math.random().toString(36).substr(2, 9)}`,
    userId: "user_gaza123",
    institution: "Al-Shifa Hospital",
    department: "Emergency Department",
    position: "Senior Resident",
    location: "Gaza City",
    isActive: true,
    ...overrides,
  };
};

// Complex object composition examples
export const getMockEmergencyScenario = () => {
  const gazaClinicianUser = getMockGazaClinician();
  const ukSpecialistUser = getMockUKSpecialist();
  const consultation = getMockEmergencyConsultation({
    requestedBy: gazaClinicianUser.id,
    assignedTo: ukSpecialistUser.id,
  });
  const specialistProfile = getMockTraumaSurgery({
    userId: ukSpecialistUser.id,
  });
  const clinicianProfile = getMockClinicianProfile({
    userId: gazaClinicianUser.id,
  });

  return {
    gazaClinicianUser,
    ukSpecialistUser,
    consultation,
    specialistProfile,
    clinicianProfile,
  };
};

export const getMockScheduledMDTScenario = () => {
  const gazaClinicianUser = getMockGazaClinician();
  const cardiologist = getMockUKSpecialist({ name: "Dr. Sarah Wilson" });
  const surgeon = getMockUKSpecialist({ name: "Dr. Michael Brown" });

  const consultation = getMockScheduledConsultation({
    requestedBy: gazaClinicianUser.id,
    description:
      "Complex cardiac surgery case requiring multidisciplinary input",
  });

  const cardiologyProfile = getMockCardiology({ userId: cardiologist.id });
  const surgeryProfile = getMockTraumaSurgery({ userId: surgeon.id });

  return {
    gazaClinicianUser,
    specialists: [cardiologist, surgeon],
    consultation,
    specialistProfiles: [cardiologyProfile, surgeryProfile],
  };
};

// Translation test data
export const getMockTranslationPair = () => {
  return {
    english: "Patient presents with acute chest pain radiating to left arm",
    arabic: "يعاني المريض من ألم حاد في الصدر ينتشر إلى الذراع الأيسر",
    medicalTerms: ["acute", "chest pain", "radiating"],
  };
};

// Network condition mocks
export const getMockNetworkConditions = {
  offline: {
    online: false,
    effectiveType: undefined,
  },
  slow2g: {
    online: true,
    effectiveType: "slow-2g",
  },
  "2g": {
    online: true,
    effectiveType: "2g",
  },
  "3g": {
    online: true,
    effectiveType: "3g",
  },
  "4g": {
    online: true,
    effectiveType: "4g",
  },
};

// Device and viewport mocks
export const getMockViewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
  ultrawide: { width: 1920, height: 1080 },
};
