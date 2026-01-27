// StonePeak Portfolio Intelligence Platform - Shared Types

// Investment Categories
export const INVESTMENT_CATEGORIES = [
  'Digital Infrastructure',
  'Energy & Energy Transition',
  'Transport & Logistics',
  'Social Infrastructure',
  'Real Estate'
] as const;

export type InvestmentCategory = typeof INVESTMENT_CATEGORIES[number];

// Value Themes
export const VALUE_THEMES = ['Revenue Growth', 'Margin Expansion', 'Cost Cutting'] as const;
export type ValueTheme = typeof VALUE_THEMES[number];

// Hold Period Tracks
export const HOLD_PERIOD_TRACKS = ['EBITDA Accelerator', 'Growth Enabler', 'Exit Multiplier'] as const;
export type HoldPeriodTrack = typeof HOLD_PERIOD_TRACKS[number];

// Platform Classification
export const PLATFORM_CLASSIFICATIONS = ['Platform Play', 'Point Solution'] as const;
export type PlatformClassification = typeof PLATFORM_CLASSIFICATIONS[number];

// Quadrant Types
export const QUADRANTS = ['Champions', 'Quick Wins', 'Strategic', 'Foundations'] as const;
export type Quadrant = typeof QUADRANTS[number];

// BlueAlly Brand Colors
export const BRAND_COLORS = {
  primaryDark: '#003B73',      // Headers, navigation, CTAs
  primaryLight: '#00A3E0',     // Accents, hover states
  secondaryGreen: '#00B34A',   // Success states, positive metrics
  darkCharcoal: '#2C2C2C',     // Body text
  lightGray: '#F5F5F5',        // Backgrounds
  mediumGray: '#999999',       // Secondary text
} as const;

// Theme Colors (for Value Themes)
export const THEME_COLORS: Record<ValueTheme, string> = {
  'Revenue Growth': '#00B34A',    // Green
  'Margin Expansion': '#00A3E0',  // Light Blue
  'Cost Cutting': '#003B73',      // Dark Blue
} as const;

// Category Colors
export const CATEGORY_COLORS: Record<InvestmentCategory, string> = {
  'Digital Infrastructure': '#003B73',
  'Energy & Energy Transition': '#00B34A',
  'Transport & Logistics': '#00A3E0',
  'Social Infrastructure': '#7C3AED',
  'Real Estate': '#F59E0B',
} as const;

// Track Colors
export const TRACK_COLORS: Record<HoldPeriodTrack, string> = {
  'EBITDA Accelerator': '#003B73',
  'Growth Enabler': '#00A3E0',
  'Exit Multiplier': '#00B34A',
} as const;

// Track Allocation Ranges
export const TRACK_ALLOCATIONS = {
  'EBITDA Accelerator': { min: 40, max: 50, default: 45 },
  'Growth Enabler': { min: 30, max: 40, default: 35 },
  'Exit Multiplier': { min: 15, max: 25, default: 20 },
} as const;

// Formula Weights
export const FORMULA_WEIGHTS = {
  value: {
    ebitdaImpact: 0.50,
    revenueEnablement: 0.25,
    riskReduction: 0.25,
  },
  readiness: {
    orgCapacity: 0.35,
    dataQuality: 0.35,
    techInfrastructure: 0.20,
    timelineFit: 0.10,
  },
  priority: {
    valueScore: 0.50,
    readinessScore: 0.50,
  },
  ebitda: {
    baseAssumption: 0.15,  // 15% of EBITDA, Bain benchmark midpoint
  },
  portfolio: {
    replicationMultiplier: 0.10,  // 10% per replication
  },
} as const;

// Quadrant Threshold
export const QUADRANT_THRESHOLD = 7.0;

// Company Score Input Fields
export interface CompanyScores {
  ebitdaImpact: number;          // 1-10
  revenueEnablement: number;     // 1-10
  riskReduction: number;         // 1-10
  organizationalCapacity: number; // 1-10
  dataAvailability: number;      // 1-10
  techInfrastructure: number;    // 1-10
  timelineFit: number;           // 1-10
}

// Calculated Scores
export interface CalculatedScores {
  valueScore: number;
  readinessScore: number;
  priorityScore: number;
  adjustedEbitda: number;
  adjustedPriority: number;
  portfolioAdjustedPriority?: number;
}

// Company Assignments
export interface CompanyAssignments {
  theme: ValueTheme | null;
  track: HoldPeriodTrack | null;
  replicationPotential: number;  // 1-10
  platformClassification: PlatformClassification | null;
}

// Full Company Data
export interface Company {
  id: number;
  companyName: string;
  investmentCategory: InvestmentCategory;
  employees: number;
  annualRevenue: number;
  revenueEstimated: boolean;
  industryVertical: string;
  detailedSector: string;
  stonepeakCategory: string;
  hqCity: string;
  hqState: string;
  hqCountry: string;
  investmentDate: string;
  ebitda: number;
  scores: CompanyScores;
  calculated: CalculatedScores;
  assignments: CompanyAssignments;
  quadrant: Quadrant;
}

// Scenario for save/load
export interface Scenario {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  companies: Company[];
  createdAt: Date;
  updatedAt: Date;
}

// Portfolio Summary Metrics
export interface PortfolioMetrics {
  totalCompanies: number;
  totalEbitda: number;
  totalAdjustedEbitda: number;
  totalAdjustedPriority: number;
  avgValueScore: number;
  avgReadinessScore: number;
  avgPriorityScore: number;
  championsCount: number;
  championsValue: number;
  quickWinsCount: number;
  strategicCount: number;
  foundationsCount: number;
  byCategory: Record<InvestmentCategory, number>;
  byTheme: Record<ValueTheme, number>;
  byTrack: Record<HoldPeriodTrack, number>;
}

// Filter State
export interface FilterState {
  categories: InvestmentCategory[];
  themes: ValueTheme[];
  tracks: HoldPeriodTrack[];
  quadrants: Quadrant[];
  valueScoreRange: [number, number];
  readinessScoreRange: [number, number];
  priorityScoreRange: [number, number];
  searchQuery: string;
}

// Bubble Size Options
export const BUBBLE_SIZE_OPTIONS = ['Adjusted EBITDA', 'Adjusted Priority', 'Revenue'] as const;
export type BubbleSizeOption = typeof BUBBLE_SIZE_OPTIONS[number];

// Color By Options
export const COLOR_BY_OPTIONS = ['Category', 'Theme', 'Track'] as const;
export type ColorByOption = typeof COLOR_BY_OPTIONS[number];

// AI Insight
export interface AIInsight {
  id: string;
  companyId?: number;
  type: 'recommendation' | 'alert' | 'opportunity' | 'risk';
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
}

// Audit Log Entry
export interface AuditLogEntry {
  id: number;
  oduserId: number;
  companyId: number;
  field: string;
  oldValue: string;
  newValue: string;
  timestamp: Date;
}

// Notification Types
export type NotificationType = 
  | 'champion_added'
  | 'priority_change'
  | 'ebitda_threshold'
  | 'scenario_saved';

export interface Notification {
  type: NotificationType;
  title: string;
  content: string;
  companyId?: number;
  timestamp: Date;
}
