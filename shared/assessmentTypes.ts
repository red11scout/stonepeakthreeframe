/**
 * Comprehensive Assessment Data Types for AI Use Cases
 * Designed for world-class visualization and deterministic HyperFormula calculations
 */

// Strategic Anchoring Theme
export interface StrategicTheme {
  "Strategic Theme": string;
  "Primary Driver": "Reduce Cost" | "Grow Revenue" | "Decrease Risk";
  "Secondary Driver": "Reduce Cost" | "Grow Revenue" | "Decrease Risk";
  "Current State": string;
  "Target State": string;
}

// Business Function KPI
export interface BusinessKPI {
  Function: string;
  "Sub-Function": string;
  "KPI Name": string;
  "Baseline Value": string;
  "Target Value": string;
  Direction: "↑" | "↓";
  Timeframe: string;
  "Industry Benchmark": string;
  "Measurement Method": string;
}

// Friction Point
export interface FrictionPoint {
  Function: string;
  "Sub-Function": string;
  "Friction Point": string;
  Severity: "Critical" | "High" | "Medium" | "Low";
  "Primary Driver Impact": "Reduce Cost" | "Grow Revenue" | "Decrease Risk";
  "Estimated Annual Cost ($)": string;
}

// AI Use Case
export interface AIUseCase {
  ID: string;
  "Use Case Name": string;
  Function: string;
  "Sub-Function": string;
  Description: string;
  "AI Primitives"?: string;
  "Target Friction": string;
  "Human-in-the-Loop Checkpoint": string;
}

// Benefits Quantification
export interface BenefitQuantification {
  ID: string;
  "Use Case": string;
  "Cost Formula": string;
  "Cost Benefit ($)": string;
  "Revenue Formula": string;
  "Revenue Benefit ($)": string;
  "Risk Formula": string;
  "Risk Benefit ($)": string;
  "Cash Flow Formula": string;
  "Cash Flow Benefit ($)": string;
  "Probability of Success": number;
  "Total Annual Value ($)": string;
}

// Effort & Token Model
export interface EffortTokenModel {
  ID: string;
  "Use Case": string;
  "Effort Score (1-5)": number;
  "Data Readiness (1-5)": number;
  "Integration Complexity (1-5)": number;
  "Change Mgmt (1-5)": number;
  "Time-to-Value (months)": number;
  "Runs/Month": number;
  "Input Tokens/Run": number;
  "Output Tokens/Run": number;
  "Monthly Tokens": number;
  "Annual Token Cost ($)": string;
  // Additional fields that may be present in some JSON files
  Complexity?: "High" | "Medium" | "Low";
  "Effort (Weeks)"?: number;
  "Team Size"?: number;
  "Estimated Cost ($)"?: string;
}

// Priority Roadmap
export interface PriorityRoadmap {
  ID: string;
  "Use Case": string;
  "Value Score (0-40)": number;
  "Effort Score (0-30)": number;
  "TTV Score (0-30)": number;
  "Priority Score (0-100)": number;
  "Priority Tier": "Critical" | "High" | "Medium" | "Low";
  "Recommended Phase": string;
}

// Top Use Case Summary
export interface TopUseCase {
  rank: number;
  useCase: string;
  annualValue: number;
  monthlyTokens: number;
  priorityScore: number;
}

// Executive Dashboard Summary
export interface ExecutiveDashboardSummary {
  totalAnnualValue: number;
  totalCostBenefit: number;
  totalRevenueBenefit: number;
  totalRiskBenefit: number;
  totalCashFlowBenefit: number;
  totalMonthlyTokens: number;
  valuePerMillionTokens: number;
  topUseCases: TopUseCase[];
}

// Analysis Step
export interface AnalysisStep {
  step: number;
  title: string;
  content: string;
  data: StrategicTheme[] | BusinessKPI[] | FrictionPoint[] | AIUseCase[] | BenefitQuantification[] | EffortTokenModel[] | PriorityRoadmap[] | null;
}

// Complete Company Assessment
export interface CompanyAssessment {
  companyName: string;
  generatedAt: string;
  analysis: {
    steps: AnalysisStep[];
    summary: string;
    executiveDashboard: ExecutiveDashboardSummary;
  };
}

// Parsed Assessment with typed sections for easy access
export interface ParsedAssessment {
  companyName: string;
  generatedAt: string;
  overview: string;
  overviewTitle: string;
  strategicThemes: StrategicTheme[];
  strategicThemesTitle: string;
  strategicThemesContent: string;
  businessFunctions: BusinessKPI[];
  businessFunctionsTitle: string;
  businessFunctionsContent: string;
  frictionPoints: FrictionPoint[];
  frictionPointsTitle: string;
  frictionPointsContent: string;
  useCases: AIUseCase[];
  useCasesTitle: string;
  useCasesContent: string;
  benefits: BenefitQuantification[];
  benefitsTitle: string;
  benefitsContent: string;
  effortModel: EffortTokenModel[];
  effortModelTitle: string;
  effortModelContent: string;
  roadmap: PriorityRoadmap[];
  roadmapTitle: string;
  roadmapContent: string;
  summary: string;
  executiveDashboard: ExecutiveDashboardSummary;
}

// Portfolio-level aggregated metrics
export interface PortfolioMetrics {
  totalCompanies: number;
  totalUseCases: number;
  totalAnnualValue: number;
  totalCostBenefit: number;
  totalRevenueBenefit: number;
  totalRiskBenefit: number;
  totalCashFlowBenefit: number;
  totalMonthlyTokens: number;
  avgValuePerCompany: number;
  avgUseCasesPerCompany: number;
  criticalUseCases: number;
  highUseCases: number;
  mediumUseCases: number;
  lowUseCases: number;
  totalFrictionCost: number;
  avgPriorityScore: number;
}

// Company mapping for file loading - all 17 companies
export const ASSESSMENT_COMPANIES: Record<string, string> = {
  "Lineage (LINE)": "BlueAlly_AI_Assessment_Lineage.json",
  "Venture Global Calcasieu Pass": "BlueAlly_AI_Assessment_Venture_Global.json",
  "CoreSite (JV)": "BlueAlly_AI_Assessment_CoreSite.json",
  "The AA": "BlueAlly_AI_Assessment_The_AA.json",
  "Akumin": "BlueAlly_AI_Assessment_Akumin.json",
  "Inspired Education Group": "BlueAlly_AI_Assessment_Inspired_Education.json",
  "ATSG": "BlueAlly_AI_Assessment_ATSG.json",
  "Intrado": "BlueAlly_AI_Assessment_Intrado.json",
  "Clean Energy Fuels (CLNE)": "BlueAlly_AI_Assessment_Clean_Energy_Fuels.json",
  "Cologix": "BlueAlly_AI_Assessment_Cologix.json",
  "Seapeak": "BlueAlly_AI_Assessment_Seapeak.json",
  "Oryx Midstream": "BlueAlly_AI_Assessment_Oryx_Midstream.json",
  "Astound Broadband": "BlueAlly_AI_Assessment_Astound_Broadband.json",
  "DELTA Fiber": "BlueAlly_AI_Assessment_Delta_Fiber.json",
  "euNetworks": "BlueAlly_AI_Assessment_euNetworks.json",
  "Extenet": "BlueAlly_AI_Assessment_Extenet.json",
  "Forgital": "BlueAlly_AI_Assessment_Forgital.json",
};

// Helper function to parse assessment data into typed sections
export function parseAssessment(data: CompanyAssessment): ParsedAssessment {
  const steps = data.analysis.steps;
  
  return {
    companyName: data.companyName,
    generatedAt: data.generatedAt,
    overview: steps[0]?.content || "",
    overviewTitle: steps[0]?.title || "Company Overview",
    strategicThemes: (steps[1]?.data as StrategicTheme[]) || [],
    strategicThemesTitle: steps[1]?.title || "Strategic Anchoring",
    strategicThemesContent: steps[1]?.content || "",
    businessFunctions: (steps[2]?.data as BusinessKPI[]) || [],
    businessFunctionsTitle: steps[2]?.title || "Business Functions",
    businessFunctionsContent: steps[2]?.content || "",
    frictionPoints: (steps[3]?.data as FrictionPoint[]) || [],
    frictionPointsTitle: steps[3]?.title || "Friction Points",
    frictionPointsContent: steps[3]?.content || "",
    useCases: (steps[4]?.data as AIUseCase[]) || [],
    useCasesTitle: steps[4]?.title || "AI Use Cases",
    useCasesContent: steps[4]?.content || "",
    benefits: (steps[5]?.data as BenefitQuantification[]) || [],
    benefitsTitle: steps[5]?.title || "Benefits Quantification",
    benefitsContent: steps[5]?.content || "",
    effortModel: (steps[6]?.data as EffortTokenModel[]) || [],
    effortModelTitle: steps[6]?.title || "Effort & Token Model",
    effortModelContent: steps[6]?.content || "",
    roadmap: (steps[7]?.data as PriorityRoadmap[]) || [],
    roadmapTitle: steps[7]?.title || "Priority Roadmap",
    roadmapContent: steps[7]?.content || "",
    summary: data.analysis.summary,
    executiveDashboard: data.analysis.executiveDashboard,
  };
}

// Helper to parse currency strings to numbers
export function parseCurrency(value: string): number {
  if (!value || value === "N/A" || value === "$0") return 0;
  // Remove $ and commas first
  let cleaned = value.replace(/[$,]/g, "");
  // Handle K, M, B suffixes with proper multiplication
  if (cleaned.endsWith('K')) {
    return parseFloat(cleaned.slice(0, -1)) * 1000;
  }
  if (cleaned.endsWith('M')) {
    return parseFloat(cleaned.slice(0, -1)) * 1000000;
  }
  if (cleaned.endsWith('B')) {
    return parseFloat(cleaned.slice(0, -1)) * 1000000000;
  }
  return parseFloat(cleaned) || 0;
}

// Helper to format currency for display (using millions as preferred)
export function formatCurrency(value: number, compact = true): string {
  if (compact) {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Helper to format large numbers with thousands separators
export function formatNumber(value: number, compact = false): string {
  if (compact) {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toFixed(0);
  }
  return new Intl.NumberFormat("en-US").format(value);
}

// AI Primitives with gradient colors for visual distinction
export const AI_PRIMITIVE_COLORS: Record<string, { gradient: string; bg: string; text: string }> = {
  "Data Analysis": { gradient: "from-blue-500 to-cyan-400", bg: "bg-blue-500/20", text: "text-blue-400" },
  "Workflow Automation": { gradient: "from-purple-500 to-violet-400", bg: "bg-purple-500/20", text: "text-purple-400" },
  "Content Creation": { gradient: "from-pink-500 to-rose-400", bg: "bg-pink-500/20", text: "text-pink-400" },
  "Conversational Interfaces": { gradient: "from-green-500 to-emerald-400", bg: "bg-green-500/20", text: "text-green-400" },
  "Research & Information Retrieval": { gradient: "from-orange-500 to-amber-400", bg: "bg-orange-500/20", text: "text-orange-400" },
  "Computer Vision": { gradient: "from-indigo-500 to-blue-400", bg: "bg-indigo-500/20", text: "text-indigo-400" },
  "Predictive Analytics": { gradient: "from-teal-500 to-cyan-400", bg: "bg-teal-500/20", text: "text-teal-400" },
};

// Priority tier colors for visual hierarchy
export const PRIORITY_TIER_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  Critical: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30", glow: "shadow-red-500/20" },
  High: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30", glow: "shadow-orange-500/20" },
  Medium: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/30", glow: "shadow-yellow-500/20" },
  Low: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30", glow: "shadow-green-500/20" },
};

// Severity colors for friction points
export const SEVERITY_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  Critical: { bg: "bg-red-500/20", text: "text-red-400", icon: "🔴" },
  High: { bg: "bg-orange-500/20", text: "text-orange-400", icon: "🟠" },
  Medium: { bg: "bg-yellow-500/20", text: "text-yellow-400", icon: "🟡" },
  Low: { bg: "bg-green-500/20", text: "text-green-400", icon: "🟢" },
};

// Driver colors for strategic themes
export const DRIVER_COLORS: Record<string, { bg: string; text: string; icon: string; gradient: string }> = {
  "Reduce Cost": { bg: "bg-emerald-500/20", text: "text-emerald-400", icon: "💰", gradient: "from-emerald-500 to-green-400" },
  "Grow Revenue": { bg: "bg-blue-500/20", text: "text-blue-400", icon: "📈", gradient: "from-blue-500 to-cyan-400" },
  "Decrease Risk": { bg: "bg-purple-500/20", text: "text-purple-400", icon: "🛡️", gradient: "from-purple-500 to-violet-400" },
};

// Function colors for business functions
export const FUNCTION_COLORS: Record<string, string> = {
  "Warehouse Operations": "from-blue-600 to-blue-400",
  "Facilities & Energy": "from-green-600 to-green-400",
  "Quality Assurance": "from-purple-600 to-purple-400",
  "Customer Service": "from-pink-600 to-pink-400",
  "Compliance": "from-orange-600 to-orange-400",
  "Sales & Business Development": "from-cyan-600 to-cyan-400",
  "Transportation": "from-indigo-600 to-indigo-400",
  "Finance": "from-emerald-600 to-emerald-400",
  "Operations": "from-teal-600 to-teal-400",
  "IT": "from-violet-600 to-violet-400",
  "HR": "from-rose-600 to-rose-400",
  "Marketing": "from-amber-600 to-amber-400",
  "Supply Chain": "from-lime-600 to-lime-400",
  "Engineering": "from-sky-600 to-sky-400",
  "Fleet Management": "from-slate-600 to-slate-400",
  "Network Operations": "from-fuchsia-600 to-fuchsia-400",
  "Education Delivery": "from-red-600 to-red-400",
  "Student Services": "from-yellow-600 to-yellow-400",
};

// Quarter colors for roadmap visualization
export const QUARTER_COLORS: Record<string, { bg: string; border: string }> = {
  "Q1 2026": { bg: "bg-emerald-500/20", border: "border-emerald-500/40" },
  "Q2 2026": { bg: "bg-blue-500/20", border: "border-blue-500/40" },
  "Q3 2026": { bg: "bg-purple-500/20", border: "border-purple-500/40" },
  "Q4 2026": { bg: "bg-orange-500/20", border: "border-orange-500/40" },
  "Q1 2027": { bg: "bg-pink-500/20", border: "border-pink-500/40" },
  "Q2 2027": { bg: "bg-cyan-500/20", border: "border-cyan-500/40" },
};
