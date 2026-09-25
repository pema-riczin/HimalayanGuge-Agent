export type AgentRole = 'general' | 'field_ops' | 'cultural_codex' | 'impact_engine' | 'route_intel';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  role?: AgentRole;
  source?: 'gemini-3.8-flash' | 'gemini-3.5-flash (Google Maps Grounded)' | 'hgo-knowledge-base' | 'system';
  suggestedActions?: string[];
  groundingMetadata?: any;
}

export interface ClinicSite {
  id: string;
  name: string;
  nameTibetan: string;
  location: string;
  altitudeMeters: number;
  coordinator: string;
  contactChannel: string;
  populationServed: number;
  status: 'operational' | 'restock_urgently' | 'winter_standby';
  description: string;
  coordinates: string;
  distanceFromJomsom: string;
}

export interface InventoryItem {
  id: string;
  clinicId: string;
  name: string;
  category: 'antibiotic' | 'dental' | 'analgesic' | 'surgical' | 'ophthalmic' | 'altitude_emergency' | 'sowa_rigpa';
  quantity: number;
  minThreshold: number;
  unit: string;
  expiryDate: string;
  criticalForWinter: boolean;
  notes?: string;
}

export interface LakeLouiseEvaluation {
  headache: number; // 0-3
  gastrointestinal: number; // 0-3
  fatigueWeakness: number; // 0-3
  dizzinessLightheadedness: number; // 0-3
  functionalImpairment: number; // 0-3
}

export interface TriageRecord {
  id: string;
  timestamp: string;
  patientName: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  village: string;
  clinicSiteId: string;
  altitudeMeters: number;
  chiefComplaint: string;
  lakeLouise: LakeLouiseEvaluation;
  totalAMSScore: number;
  vitals: {
    spo2: number;
    heartRate: number;
    bpSystolic?: number;
    bpDiastolic?: number;
    respRate?: number;
    tempCelsius?: number;
  };
  triageCategory: 'GREEN' | 'YELLOW' | 'RED';
  allopathicRecommendations: string;
  sowaRigpaDiagnosis: string;
  sowaRigpaHerbalSuggestions: string[];
  nepaliInstructions: string;
  tibetanInstructions: string;
  synced: boolean;
  evacuationRequested?: boolean;
}

export type HumoralType = 'rLung (Wind)' | 'mKhris-pa (Bile)' | 'Bad-kan (Phlegm)' | 'Dual / Complex';

export interface SowaRigpaRemedy {
  id: string;
  nameTibetan: string;
  nameWylie: string;
  nameEnglish: string;
  primaryHumor: HumoralType;
  thermalNature: 'Warm / Hot' | 'Cool / Cold' | 'Neutral';
  dominantTastes: string[];
  primaryIndication: string;
  traditionalPreparation: string;
  dosageGuidelines: string;
  highAltitudeContext: string;
  contraindications: string;
}

export interface MonasteryArchive {
  id: string;
  name: string;
  nameTibetan: string;
  location: string;
  establishedCentury: string;
  tradition: 'Sakya' | 'Nyingma' | 'Drukpa Kagyu' | 'Gelug';
  altitudeMeters: number;
  communityMembers: number; // monks, nuns, or students
  restorationStatus: 'In Progress' | 'Urgent Appeal' | 'Completed Phase 1';
  targetFundingUSD: number;
  raisedFundingUSD: number;
  keyProjects: {
    title: string;
    description: string;
    urgency: 'high' | 'medium' | 'low';
    costUSD: number;
  }[];
  description: string;
  heritageSignificance: string;
}

export interface ImpactReport {
  id: string;
  title: string;
  campLocation: string;
  dates: string;
  partnerName: string;
  metrics: {
    patientsServed: number;
    dentalProcedures: number;
    eyeScreenings: number;
    glassesDispensed: number;
    pediatricChecks: number;
    villagesReached: number;
    costPerPatientUSD: number;
  };
  executiveSummary: string;
  partnerBrief: string;
  socialStory: string;
  rawNotes: string;
  createdAt: string;
}

export interface GratitudeCertificate {
  donorName: string;
  amountUSD: number;
  date: string;
  impactProject: string;
  certificateNumber: string;
  fieldDirector: string;
  currency: string;
  notes: string;
}

export interface MapsGroundingPlace {
  title?: string;
  uri?: string;
  address?: string;
}

export interface MapsGroundingResponse {
  answer: string;
  source: string;
  groundingMetadata?: any;
}
