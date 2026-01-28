/**
 * Hook for loading and managing AI Assessment data for all 17 companies
 * Provides portfolio-level and company-level data access with caching
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { 
  CompanyAssessment, 
  AIUseCase, 
  BenefitQuantification,
  PriorityRoadmap,
  StrategicTheme,
  BusinessKPI,
  FrictionPoint,
  EffortTokenModel,
  ExecutiveDashboardSummary,
} from '@shared/assessmentTypes';
import { 
  ASSESSMENT_COMPANIES, 
  parseAssessment,
  parseCurrency as parseCurrencyUtil,
  formatCurrency as formatCurrencyUtil,
} from '@shared/assessmentTypes';
import type { ParsedAssessment, PortfolioMetrics } from '@shared/assessmentTypes';
import { calculatePortfolioMetrics } from '@/lib/calculationEngine';

// Cache for loaded assessments
const assessmentCache = new Map<string, CompanyAssessment>();
let portfolioCache: CompanyAssessment[] | null = null;

/**
 * Load a single company assessment
 */
async function loadAssessment(companyName: string): Promise<CompanyAssessment | null> {
  // Check cache first
  if (assessmentCache.has(companyName)) {
    return assessmentCache.get(companyName)!;
  }

  const fileName = ASSESSMENT_COMPANIES[companyName];
  if (!fileName) {
    console.warn(`No assessment file found for company: ${companyName}`);
    return null;
  }

  try {
    const response = await fetch(`/data/${fileName}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${fileName}: ${response.status}`);
    }
    const data: CompanyAssessment = await response.json();
    // Normalize company name to match our mapping
    data.companyName = companyName;
    assessmentCache.set(companyName, data);
    return data;
  } catch (error) {
    console.error(`Error loading assessment for ${companyName}:`, error);
    return null;
  }
}

/**
 * Load all company assessments
 */
async function loadAllAssessments(): Promise<CompanyAssessment[]> {
  if (portfolioCache) {
    return portfolioCache;
  }

  const companyNames = Object.keys(ASSESSMENT_COMPANIES);
  const results = await Promise.all(companyNames.map(loadAssessment));
  portfolioCache = results.filter((a): a is CompanyAssessment => a !== null);
  return portfolioCache;
}

/**
 * Main hook for accessing assessment data - supports both legacy and new patterns
 */
export function useAssessmentData() {
  const [assessments, setAssessments] = useState<CompanyAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  // Load all assessments on mount
  useEffect(() => {
    loadAllAssessments()
      .then(data => {
        setAssessments(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Get selected assessment
  const selectedAssessment = useMemo(() => {
    if (!selectedCompany) return null;
    return assessments.find(a => a.companyName === selectedCompany) || null;
  }, [assessments, selectedCompany]);

  // Parse selected assessment into typed sections
  const parsedAssessment = useMemo(() => {
    if (!selectedAssessment) return null;
    return parseAssessment(selectedAssessment);
  }, [selectedAssessment]);

  // Calculate portfolio metrics using HyperFormula
  const portfolioMetrics = useMemo(() => {
    if (assessments.length === 0) return null;
    const parsed = assessments.map(parseAssessment);
    return calculatePortfolioMetrics(parsed);
  }, [assessments]);

  // Aggregated metrics (legacy format)
  const aggregatedMetrics = useMemo(() => {
    if (assessments.length === 0) return null;
    
    let totalValue = 0;
    let totalUseCases = 0;
    let totalCostBenefit = 0;
    let totalRevenueBenefit = 0;
    let totalRiskBenefit = 0;
    
    assessments.forEach(a => {
      const dashboard = a.analysis.executiveDashboard;
      totalValue += dashboard.totalAnnualValue || 0;
      totalCostBenefit += dashboard.totalCostBenefit || 0;
      totalRevenueBenefit += dashboard.totalRevenueBenefit || 0;
      totalRiskBenefit += dashboard.totalRiskBenefit || 0;
      const useCases = getStepData<AIUseCase>(a, 'AI Use Case Generation');
      totalUseCases += useCases.length;
    });
    
    return {
      totalValue,
      totalUseCases,
      companiesCount: assessments.length,
      avgValuePerCompany: totalValue / assessments.length,
      totalCostBenefit,
      totalRevenueBenefit,
      totalRiskBenefit,
    };
  }, [assessments]);

  // Company list with summary info
  const companyList = useMemo(() => {
    return assessments.map(a => {
      const useCases = getStepData<AIUseCase>(a, 'AI Use Case Generation');
      const roadmap = getStepData<PriorityRoadmap>(a, 'Priority Scoring & Roadmap');
      const criticalCount = roadmap.filter(r => r["Priority Tier"] === "Critical").length;
      
      return {
        name: a.companyName,
        totalValue: a.analysis.executiveDashboard.totalAnnualValue,
        useCaseCount: useCases.length,
        criticalCount,
        costBenefit: a.analysis.executiveDashboard.totalCostBenefit,
        revenueBenefit: a.analysis.executiveDashboard.totalRevenueBenefit,
        riskBenefit: a.analysis.executiveDashboard.totalRiskBenefit,
      };
    }).sort((a, b) => b.totalValue - a.totalValue);
  }, [assessments]);

  return {
    assessments,
    loading,
    error,
    selectedCompany,
    setSelectedCompany,
    selectedAssessment,
    parsedAssessment,
    aggregatedMetrics,
    portfolioMetrics,
    companyList,
    companyCount: assessments.length,
  };
}

/**
 * Hook for accessing a single company's assessment data
 */
export function useCompanyAssessment(companyName: string | null) {
  const [assessment, setAssessment] = useState<CompanyAssessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyName) {
      setAssessment(null);
      return;
    }

    setLoading(true);
    setError(null);

    // Find matching company name
    const matchedName = findAssessmentCompanyName(companyName);
    if (!matchedName) {
      setError(`No assessment found for ${companyName}`);
      setLoading(false);
      return;
    }

    loadAssessment(matchedName)
      .then(data => {
        setAssessment(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [companyName]);

  // Parse assessment into typed sections
  const parsed = useMemo(() => {
    if (!assessment) return null;
    return parseAssessment(assessment);
  }, [assessment]);

  return { assessment, parsed, loading, error };
}

/**
 * Hook for portfolio-level analytics
 */
export function usePortfolioAnalytics() {
  const { assessments, loading, error, portfolioMetrics } = useAssessmentData();

  // Aggregate use cases by function
  const useCasesByFunction = useMemo(() => {
    const byFunction: Record<string, { count: number; totalValue: number }> = {};
    assessments.forEach(a => {
      const useCases = getStepData<AIUseCase>(a, 'AI Use Case Generation');
      const benefits = getStepData<BenefitQuantification>(a, 'Benefits Quantification by Driver');
      
      useCases.forEach(uc => {
        if (!byFunction[uc.Function]) {
          byFunction[uc.Function] = { count: 0, totalValue: 0 };
        }
        byFunction[uc.Function].count++;
        const benefit = benefits.find(b => b.ID === uc.ID);
        if (benefit) {
          byFunction[uc.Function].totalValue += parseCurrency(benefit["Total Annual Value ($)"]);
        }
      });
    });
    return Object.entries(byFunction)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.totalValue - a.totalValue);
  }, [assessments]);

  // Aggregate friction points by severity
  const frictionBySeverity = useMemo(() => {
    const bySeverity: Record<string, { count: number; totalCost: number }> = {
      Critical: { count: 0, totalCost: 0 },
      High: { count: 0, totalCost: 0 },
      Medium: { count: 0, totalCost: 0 },
      Low: { count: 0, totalCost: 0 },
    };
    assessments.forEach(a => {
      const frictionPoints = getStepData<FrictionPoint>(a, 'Friction Point Mapping');
      frictionPoints.forEach(fp => {
        bySeverity[fp.Severity].count++;
        bySeverity[fp.Severity].totalCost += parseCurrency(fp["Estimated Annual Cost ($)"]);
      });
    });
    return bySeverity;
  }, [assessments]);

  // Aggregate roadmap by quarter
  const roadmapByQuarter = useMemo(() => {
    const byQuarter: Record<string, { count: number; companies: Set<string> }> = {};
    assessments.forEach(a => {
      const roadmap = getStepData<PriorityRoadmap>(a, 'Priority Scoring & Roadmap');
      roadmap.forEach(r => {
        const quarter = r["Recommended Phase"];
        if (!byQuarter[quarter]) {
          byQuarter[quarter] = { count: 0, companies: new Set() };
        }
        byQuarter[quarter].count++;
        byQuarter[quarter].companies.add(a.companyName);
      });
    });
    return Object.entries(byQuarter)
      .map(([quarter, data]) => ({ 
        quarter, 
        count: data.count, 
        companyCount: data.companies.size 
      }))
      .sort((a, b) => a.quarter.localeCompare(b.quarter));
  }, [assessments]);

  // AI Primitives distribution
  const aiPrimitives = useMemo(() => {
    const primitives: Record<string, number> = {};
    assessments.forEach(a => {
      const useCases = getStepData<AIUseCase>(a, 'AI Use Case Generation');
      useCases.forEach(uc => {
        if (uc["AI Primitives"]) {
          uc["AI Primitives"].split(', ').forEach(p => {
            primitives[p.trim()] = (primitives[p.trim()] || 0) + 1;
          });
        }
      });
    });
    return Object.entries(primitives)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [assessments]);

  // Top use cases across portfolio
  const topUseCases = useMemo(() => {
    const allUseCases: Array<{
      company: string;
      id: string;
      name: string;
      value: number;
      priorityScore: number;
      tier: string;
    }> = [];

    assessments.forEach(a => {
      const roadmap = getStepData<PriorityRoadmap>(a, 'Priority Scoring & Roadmap');
      const benefits = getStepData<BenefitQuantification>(a, 'Benefits Quantification by Driver');
      
      roadmap.forEach(r => {
        const benefit = benefits.find(b => b.ID === r.ID);
        allUseCases.push({
          company: a.companyName,
          id: r.ID,
          name: r["Use Case"],
          value: benefit ? parseCurrency(benefit["Total Annual Value ($)"]) : 0,
          priorityScore: r["Priority Score (0-100)"],
          tier: r["Priority Tier"],
        });
      });
    });

    return allUseCases.sort((a, b) => b.value - a.value).slice(0, 20);
  }, [assessments]);

  return {
    loading,
    error,
    metrics: portfolioMetrics,
    useCasesByFunction,
    frictionBySeverity,
    roadmapByQuarter,
    aiPrimitives,
    topUseCases,
    assessments,
  };
}

// Helper to extract step data by title
export function getStepData<T>(assessment: CompanyAssessment, stepTitle: string): T[] {
  const step = assessment.analysis.steps.find(s => s.title === stepTitle);
  return (step?.data as T[]) || [];
}

// Format currency helper
export function formatCurrency(value: number): string {
  return formatCurrencyUtil(value, true);
}

// Parse currency string to number
export function parseCurrency(value: string): number {
  return parseCurrencyUtil(value);
}

/**
 * Get list of companies with assessments
 */
export function getCompaniesWithAssessments(): string[] {
  return Object.keys(ASSESSMENT_COMPANIES);
}

/**
 * Check if a company has an assessment
 */
export function hasAssessment(companyName: string): boolean {
  // Check exact match first
  if (ASSESSMENT_COMPANIES[companyName]) return true;
  
  // Check partial matches
  const normalizedName = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
  return Object.keys(ASSESSMENT_COMPANIES).some(key => {
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    return normalizedKey.includes(normalizedName) || normalizedName.includes(normalizedKey);
  });
}

/**
 * Find matching company name for assessment lookup
 */
export function findAssessmentCompanyName(companyName: string): string | null {
  // Check exact match first
  if (ASSESSMENT_COMPANIES[companyName]) return companyName;
  
  // Check partial matches
  const normalizedName = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const match = Object.keys(ASSESSMENT_COMPANIES).find(key => {
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    return normalizedKey.includes(normalizedName) || normalizedName.includes(normalizedKey);
  });
  
  return match || null;
}

// Clear cache (useful for testing or forced refresh)
export function clearAssessmentCache() {
  assessmentCache.clear();
  portfolioCache = null;
}
