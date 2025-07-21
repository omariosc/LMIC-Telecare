// Dummy medical case data for demo purposes
import type { MedicalCase, CaseResponse } from "../types";

export const dummyCases: MedicalCase[] = [
  {
    id: "case_001",
    title: "Complex cardiac case - 45yo male",
    description:
      "45-year-old male presenting with chest pain and elevated troponins. ECG shows ST elevation in leads II, III, aVF. Patient has history of diabetes and hypertension. Blood pressure 90/60, HR 110. Considering STEMI but limited catheterization facilities available.",
    summary: "STEMI with cardiogenic shock requiring urgent intervention",
    specialty: "cardiology",
    urgency: "critical",
    status: "in_progress",
    priority: 95,

    // Patient information (anonymized)
    patientAge: 45,
    patientGender: "male",
    patientLocation: {
      city: "Gaza City",
      region: "Gaza Strip",
      country: "Palestine",
    },

    // Medical details
    symptoms: ["chest pain", "shortness of breath", "sweating", "nausea"],
    primarySymptom: "chest pain",
    symptomDuration: "2 hours",
    symptomSeverity: 5,

    medicalHistory:
      "Type 2 diabetes mellitus (10 years), hypertension (5 years), father died of MI at age 50",
    currentMedications: [
      "Metformin 1000mg BD",
      "Amlodipine 10mg OD",
      "Aspirin 75mg OD",
    ],
    allergies: ["NKDA"],
    vitalSigns: {
      temperature: 36.8,
      bloodPressure: { systolic: 90, diastolic: 60 },
      heartRate: 110,
      respiratoryRate: 24,
      oxygenSaturation: 94,
      painScale: 9,
      consciousness: "alert",
      recordedAt: "2025-01-20T14:30:00Z",
      recordedBy: "gaza_001",
    },

    // Diagnostic information
    workingDiagnosis: "STEMI with cardiogenic shock",
    differentialDiagnosis: [
      "STEMI",
      "NSTEMI",
      "Aortic dissection",
      "Pneumothorax",
    ],
    testResults: [
      {
        id: "test_001",
        testType: "Blood Test",
        testName: "Troponin I",
        result: 25.6,
        normalRange: "<0.04",
        unit: "ng/mL",
        status: "critical",
        interpretation:
          "Significantly elevated indicating myocardial infarction",
        performedAt: "2025-01-20T14:00:00Z",
      },
      {
        id: "test_002",
        testType: "ECG",
        testName: "12-lead ECG",
        result: "ST elevation in leads II, III, aVF",
        status: "abnormal",
        interpretation: "Inferior STEMI",
        performedAt: "2025-01-20T14:15:00Z",
      },
    ],

    // Files and attachments
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Chest_X-ray.jpg/1920px-Chest_X-ray.jpg",
      "https://radiologybusiness.com/sites/default/files/styles/top_stories/public/assets/articles/4996132.jpg.webp?itok=sR1hg4KS",
    ],
    documents: ["lab_results_001.pdf"],

    // Language and translation
    language: "ar",
    requiresTranslation: true,

    // Case management
    createdBy: "gaza_001",
    assignedTo: "uk_001",

    // Urgency and timing
    estimatedResponseTime: 15,
    actualFirstResponseTime: 8,

    // Tags and categorization
    tags: ["STEMI", "cardiogenic shock", "urgent"],
    keywords: ["chest pain", "troponin", "ECG", "ST elevation"],
    caseCategory: "emergency",

    // Quality and feedback
    caseSatisfactionRating: 5,
    educationalValue: 4,
    complexity: "complex",

    // Privacy and visibility
    isAnonymized: true,
    isEducational: true,
    isPublic: true,
    sensitiveContent: false,

    // Statistics
    viewCount: 23,
    responseCount: 3,
    likeCount: 5,
    shareCount: 2,

    // Metadata
    createdAt: "2025-01-20T14:00:00Z",
    updatedAt: "2025-01-20T16:30:00Z",
  },

  {
    id: "case_002",
    title: "Pediatric respiratory distress",
    description:
      "3-year-old child with acute respiratory symptoms. Started with fever and cough 2 days ago, now showing increased work of breathing. Temp 38.5°C, RR 45, O2 sat 88% on room air. Bilateral wheeze on auscultation. Mother reports previous episodes of similar symptoms.",
    summary:
      "Acute asthma exacerbation in 3-year-old requiring bronchodilator therapy",
    specialty: "pediatrics",
    urgency: "high",
    status: "resolved",
    priority: 85,

    // Patient information
    patientAge: 3,
    patientGender: "female",
    patientLocation: {
      city: "Khan Yunis",
      region: "Gaza Strip",
      country: "Palestine",
    },

    // Medical details
    symptoms: ["cough", "shortness of breath", "wheeze", "fever"],
    primarySymptom: "shortness of breath",
    symptomDuration: "2 days",
    symptomSeverity: 4,

    medicalHistory:
      "Previous episodes of wheeze, no formal asthma diagnosis, born at term",
    currentMedications: ["None"],
    allergies: ["NKDA"],
    vitalSigns: {
      temperature: 38.5,
      heartRate: 130,
      respiratoryRate: 45,
      oxygenSaturation: 88,
      consciousness: "alert",
      recordedAt: "2025-01-19T10:30:00Z",
      recordedBy: "gaza_002",
    },

    // Diagnostic information
    workingDiagnosis: "Acute asthma exacerbation",
    differentialDiagnosis: [
      "Asthma exacerbation",
      "Bronchiolitis",
      "Pneumonia",
    ],

    // Language and translation
    language: "ar",
    requiresTranslation: true,

    // Case management
    createdBy: "gaza_002",
    assignedTo: "uk_002",

    // Resolution
    resolvedAt: "2025-01-19T16:00:00Z",
    resolutionSummary:
      "Child responded well to nebulized salbutamol and prednisolone. Discharged home with inhaler and spacer device.",
    treatmentPlan:
      "Salbutamol inhaler 2 puffs QID via spacer, Prednisolone 15mg OD for 3 days, follow-up in 48 hours",
    followUpRequired: true,
    followUpInstructions:
      "Return if breathing difficulties worsen or fever persists beyond 48 hours",

    // Tags and categorization
    tags: ["asthma", "pediatric", "respiratory"],
    keywords: ["wheeze", "shortness of breath", "child"],
    caseCategory: "routine",

    // Quality and feedback
    caseSatisfactionRating: 5,
    educationalValue: 3,
    complexity: "moderate",

    // Privacy and visibility
    isAnonymized: true,
    isEducational: true,
    isPublic: true,
    sensitiveContent: false,

    // Statistics
    viewCount: 45,
    responseCount: 4,
    likeCount: 12,
    shareCount: 3,

    // Metadata
    createdAt: "2025-01-19T10:00:00Z",
    updatedAt: "2025-01-19T16:30:00Z",
  },

  {
    id: "case_003",
    title: "Surgical consult needed - abdominal pain",
    description:
      "28-year-old female presenting with 6-hour history of severe right iliac fossa pain. Started periumbilically and migrated to RIF. Associated with nausea and vomiting. No fever initially, now temp 37.8°C. Positive McBurney's point tenderness.",
    summary: "Acute appendicitis requiring urgent surgical evaluation",
    specialty: "surgery",
    urgency: "high",
    status: "resolved",
    priority: 80,

    // Patient information
    patientAge: 28,
    patientGender: "female",
    patientLocation: {
      city: "Rafah",
      region: "Gaza Strip",
      country: "Palestine",
    },

    // Medical details
    symptoms: ["abdominal pain", "nausea", "vomiting", "fever"],
    primarySymptom: "abdominal pain",
    symptomDuration: "6 hours",
    symptomSeverity: 4,

    medicalHistory: "No significant past medical history, LMP 2 weeks ago",
    currentMedications: ["None"],
    allergies: ["NKDA"],
    vitalSigns: {
      temperature: 37.8,
      bloodPressure: { systolic: 110, diastolic: 70 },
      heartRate: 95,
      respiratoryRate: 18,
      painScale: 8,
      consciousness: "alert",
      recordedAt: "2025-01-18T20:00:00Z",
      recordedBy: "gaza_003",
    },

    // Diagnostic information
    workingDiagnosis: "Acute appendicitis",
    differentialDiagnosis: ["Acute appendicitis", "Ovarian cyst", "PID", "UTI"],
    testResults: [
      {
        id: "test_003",
        testType: "Blood Test",
        testName: "White Cell Count",
        result: 14.2,
        normalRange: "4-11",
        unit: "x10^9/L",
        status: "abnormal",
        interpretation: "Elevated WCC suggesting infection/inflammation",
        performedAt: "2025-01-18T20:30:00Z",
      },
    ],

    // Language and translation
    language: "ar",
    requiresTranslation: true,

    // Case management
    createdBy: "gaza_003",
    assignedTo: "uk_003",

    // Resolution
    resolvedAt: "2025-01-18T22:30:00Z",
    resolutionSummary:
      "Patient underwent laparoscopic appendectomy. Appendix was inflamed but not perforated. Good post-operative recovery.",
    treatmentPlan:
      "Laparoscopic appendectomy performed successfully, post-op antibiotics, early mobilization",
    followUpRequired: true,
    followUpInstructions: "Wound check in 5 days, remove sutures in 10 days",

    // Tags and categorization
    tags: ["appendicitis", "surgery", "emergency"],
    keywords: ["abdominal pain", "RIF", "McBurney's point"],
    caseCategory: "emergency",

    // Quality and feedback
    caseSatisfactionRating: 5,
    educationalValue: 4,
    complexity: "moderate",

    // Privacy and visibility
    isAnonymized: true,
    isEducational: true,
    isPublic: true,
    sensitiveContent: false,

    // Statistics
    viewCount: 67,
    responseCount: 7,
    likeCount: 18,
    shareCount: 5,

    // Metadata
    createdAt: "2025-01-18T19:30:00Z",
    updatedAt: "2025-01-18T23:00:00Z",
  },
];

export const dummyResponses: CaseResponse[] = [
  {
    id: "response_001",
    caseId: "case_001",
    content:
      "Based on the clinical presentation and ECG findings, this is clearly an inferior STEMI with cardiogenic shock. Given the limited catheterization facilities, I recommend immediate dual antiplatelet therapy (aspirin 300mg + clopidogrel 600mg), atorvastatin 80mg, and urgent thrombolysis with alteplase if no contraindications. Monitor closely for reperfusion arrhythmias.",
    responseType: "consultation",
    isPrivate: false,
    isHelpful: true,
    isPrimaryConsultation: true,
    confidenceLevel: "high",
    diagnosis: "Inferior STEMI with cardiogenic shock",
    treatmentRecommendation:
      "Thrombolysis, dual antiplatelet therapy, high-intensity statin",
    urgencyAssessment: "critical",
    additionalTestsNeeded: [
      "Serial ECGs",
      "Repeat troponins in 12h",
      "Echo if available",
    ],
    language: "en",
    createdBy: "uk_001",
    likeCount: 5,
    thanksCount: 3,
    helpfulnessRating: 5,
    accuracyRating: 5,
    timelinessScore: 95,
    isRead: true,
    readBy: ["gaza_001"],
    acknowledgedBy: "gaza_001",
    createdAt: "2025-01-20T14:08:00Z",
    updatedAt: "2025-01-20T14:08:00Z",
  },

  {
    id: "response_002",
    caseId: "case_002",
    content:
      "This presents as acute asthma exacerbation in a young child. I recommend immediate bronchodilator therapy with salbutamol nebulizers (2.5mg) every 20 minutes for the first hour. Consider prednisolone 1-2mg/kg orally. If oxygen saturations remain below 92%, consider IV salbutamol or aminophylline if available. Important to rule out pneumothorax if sudden deterioration.",
    responseType: "consultation",
    isPrivate: false,
    isHelpful: true,
    isPrimaryConsultation: true,
    confidenceLevel: "high",
    diagnosis: "Acute severe asthma exacerbation",
    treatmentRecommendation:
      "Bronchodilators, oral prednisolone, oxygen therapy",
    urgencyAssessment: "high",
    additionalTestsNeeded: [
      "Chest X-ray if available",
      "Peak flow if child cooperative",
    ],
    language: "en",
    createdBy: "uk_002",
    likeCount: 8,
    thanksCount: 5,
    helpfulnessRating: 5,
    accuracyRating: 5,
    timelinessScore: 90,
    isRead: true,
    readBy: ["gaza_002"],
    acknowledgedBy: "gaza_002",
    createdAt: "2025-01-19T10:15:00Z",
    updatedAt: "2025-01-19T10:15:00Z",
  },

  {
    id: "response_003",
    caseId: "case_002",
    content:
      "I agree with Dr. Johnson's management. Additionally, in resource-limited settings, consider spacer devices with MDI if nebulizers are not available. The key teaching point here is recognizing severe asthma - the combination of increased work of breathing, wheeze, and oxygen desaturation requires urgent treatment. Parent education about trigger avoidance and inhaler technique is crucial for prevention.",
    responseType: "follow_up",
    isPrivate: false,
    isHelpful: true,
    isPrimaryConsultation: false,
    confidenceLevel: "medium",
    language: "en",
    createdBy: "uk_004",
    likeCount: 3,
    thanksCount: 2,
    helpfulnessRating: 4,
    accuracyRating: 4,
    timelinessScore: 85,
    isRead: true,
    readBy: ["gaza_002"],
    createdAt: "2025-01-19T10:45:00Z",
    updatedAt: "2025-01-19T10:45:00Z",
  },

  {
    id: "response_004",
    caseId: "case_003",
    content:
      "Classic presentation of acute appendicitis. The migration of pain from periumbilical to right iliac fossa is pathognomonic. Given the clinical picture and elevated WCC, surgical intervention is indicated. In your setting, I would recommend laparoscopic approach if expertise available, otherwise open appendectomy. Pre-operative antibiotics (cefuroxime + metronidazole) should be given.",
    responseType: "consultation",
    isPrivate: false,
    isHelpful: true,
    isPrimaryConsultation: true,
    confidenceLevel: "high",
    diagnosis: "Acute appendicitis",
    treatmentRecommendation:
      "Appendectomy (laparoscopic preferred), prophylactic antibiotics",
    urgencyAssessment: "high",
    additionalTestsNeeded: ["Pregnancy test", "Urinalysis to exclude UTI"],
    language: "en",
    createdBy: "uk_003",
    likeCount: 12,
    thanksCount: 8,
    helpfulnessRating: 5,
    accuracyRating: 5,
    timelinessScore: 88,
    isRead: true,
    readBy: ["gaza_003"],
    acknowledgedBy: "gaza_003",
    createdAt: "2025-01-18T20:10:00Z",
    updatedAt: "2025-01-18T20:10:00Z",
  },
];

// Helper functions
export const getCaseById = (id: string): MedicalCase | undefined =>
  dummyCases.find((case_) => case_.id === id);

export const getResponsesByCase = (caseId: string): CaseResponse[] =>
  dummyResponses.filter((response) => response.caseId === caseId);

export const getCasesBySpecialty = (specialty: string): MedicalCase[] =>
  dummyCases.filter((case_) => case_.specialty === specialty);

export const getCasesByUrgency = (urgency: string): MedicalCase[] =>
  dummyCases.filter((case_) => case_.urgency === urgency);

export const getCasesByStatus = (status: string): MedicalCase[] =>
  dummyCases.filter((case_) => case_.status === status);

export const getCasesByCreator = (creatorId: string): MedicalCase[] =>
  dummyCases.filter((case_) => case_.createdBy === creatorId);
