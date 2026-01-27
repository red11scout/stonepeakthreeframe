import HyperFormula from 'hyperformula';
import { FORMULA_WEIGHTS, QUADRANT_THRESHOLD, type Quadrant } from '../shared/stonepeak';
import type { ValueTheme, HoldPeriodTrack } from '../shared/stonepeak';

// Initialize HyperFormula with configuration
const hfInstance = HyperFormula.buildEmpty({
  licenseKey: 'gpl-v3',
  precisionRounding: 10,
});

/**
 * Calculate Value Score using the formula:
 * Value_Score = (EBITDA_Impact × 0.50) + (Revenue_Enablement × 0.25) + (Risk_Reduction × 0.25)
 */
export function calculateValueScore(
  ebitdaImpact: number,
  revenueEnablement: number,
  riskReduction: number
): number {
  const { ebitdaImpact: w1, revenueEnablement: w2, riskReduction: w3 } = FORMULA_WEIGHTS.value;
  return (ebitdaImpact * w1) + (revenueEnablement * w2) + (riskReduction * w3);
}

/**
 * Calculate Readiness Score using the formula:
 * Readiness_Score = (Org_Capacity × 0.35) + (Data_Quality × 0.35) + (Tech_Infrastructure × 0.20) + (Timeline_Fit × 0.10)
 */
export function calculateReadinessScore(
  orgCapacity: number,
  dataQuality: number,
  techInfrastructure: number,
  timelineFit: number
): number {
  const { orgCapacity: w1, dataQuality: w2, techInfrastructure: w3, timelineFit: w4 } = FORMULA_WEIGHTS.readiness;
  return (orgCapacity * w1) + (dataQuality * w2) + (techInfrastructure * w3) + (timelineFit * w4);
}

/**
 * Calculate Priority Score using the formula:
 * Priority_Score = (Value_Score × 0.50) + (Readiness_Score × 0.50)
 */
export function calculatePriorityScore(
  valueScore: number,
  readinessScore: number
): number {
  const { valueScore: w1, readinessScore: w2 } = FORMULA_WEIGHTS.priority;
  return (valueScore * w1) + (readinessScore * w2);
}

/**
 * Calculate Adjusted EBITDA using the EBITDA Translation Layer:
 * Base_Assumption = 0.15 (15% of EBITDA, Bain benchmark midpoint)
 * Adjusted_Lift = 0.15 × (Value_Score / 7)
 * Adjusted_EBITDA = EBITDA × Adjusted_Lift
 */
export function calculateAdjustedEbitda(
  ebitda: number,
  valueScore: number
): number {
  const { baseAssumption } = FORMULA_WEIGHTS.ebitda;
  const adjustedLift = baseAssumption * (valueScore / 7);
  return ebitda * adjustedLift;
}

/**
 * Calculate Adjusted Priority:
 * Adjusted_Priority = Priority_Score × Adjusted_EBITDA
 */
export function calculateAdjustedPriority(
  priorityScore: number,
  adjustedEbitda: number
): number {
  return priorityScore * adjustedEbitda;
}

/**
 * Calculate Portfolio-Adjusted Priority (Framework 2):
 * Portfolio_Adjusted_Priority = (Priority_Score × Adjusted_EBITDA) × (1 + (Replication_Count × 0.10))
 */
export function calculatePortfolioAdjustedPriority(
  priorityScore: number,
  adjustedEbitda: number,
  replicationPotential: number
): number {
  const { replicationMultiplier } = FORMULA_WEIGHTS.portfolio;
  const adjustedPriority = priorityScore * adjustedEbitda;
  return adjustedPriority * (1 + (replicationPotential * replicationMultiplier));
}

/**
 * Determine quadrant based on Value and Readiness scores
 * Threshold is 7.0 (70%)
 */
export function determineQuadrant(
  valueScore: number,
  readinessScore: number
): Quadrant {
  const highValue = valueScore >= QUADRANT_THRESHOLD;
  const highReadiness = readinessScore >= QUADRANT_THRESHOLD;
  
  if (highValue && highReadiness) return 'Champions';
  if (!highValue && highReadiness) return 'Quick Wins';
  if (highValue && !highReadiness) return 'Strategic';
  return 'Foundations';
}

/**
 * Calculate all scores for a company given input scores
 */
export interface CompanyInputScores {
  ebitdaImpact: number;
  revenueEnablement: number;
  riskReduction: number;
  organizationalCapacity: number;
  dataAvailability: number;
  techInfrastructure: number;
  timelineFit: number;
  ebitda: number;
  replicationPotential?: number;
}

export interface CalculatedCompanyScores {
  valueScore: number;
  readinessScore: number;
  priorityScore: number;
  adjustedEbitda: number;
  adjustedPriority: number;
  portfolioAdjustedPriority: number;
  quadrant: Quadrant;
}

export function calculateAllScores(input: CompanyInputScores): CalculatedCompanyScores {
  const valueScore = calculateValueScore(
    input.ebitdaImpact,
    input.revenueEnablement,
    input.riskReduction
  );
  
  const readinessScore = calculateReadinessScore(
    input.organizationalCapacity,
    input.dataAvailability,
    input.techInfrastructure,
    input.timelineFit
  );
  
  const priorityScore = calculatePriorityScore(valueScore, readinessScore);
  const adjustedEbitda = calculateAdjustedEbitda(input.ebitda, valueScore);
  const adjustedPriority = calculateAdjustedPriority(priorityScore, adjustedEbitda);
  const portfolioAdjustedPriority = calculatePortfolioAdjustedPriority(
    priorityScore,
    adjustedEbitda,
    input.replicationPotential ?? 5
  );
  const quadrant = determineQuadrant(valueScore, readinessScore);
  
  return {
    valueScore: Math.round(valueScore * 10000) / 10000,
    readinessScore: Math.round(readinessScore * 10000) / 10000,
    priorityScore: Math.round(priorityScore * 10000) / 10000,
    adjustedEbitda: Math.round(adjustedEbitda * 100) / 100,
    adjustedPriority: Math.round(adjustedPriority * 100) / 100,
    portfolioAdjustedPriority: Math.round(portfolioAdjustedPriority * 100) / 100,
    quadrant,
  };
}

/**
 * HyperFormula-based calculation for spreadsheet-like operations
 * This provides deterministic, auditable calculations
 */
export function createCalculationSheet(companies: CompanyInputScores[]): CalculatedCompanyScores[] {
  // Create a new sheet for calculations
  const sheetName = 'Portfolio' + Date.now();
  const sheetIdResult = hfInstance.addSheet(sheetName);
  if (sheetIdResult === undefined) {
    throw new Error('Failed to create calculation sheet');
  }
  const sheetId = typeof sheetIdResult === 'number' ? sheetIdResult : parseInt(sheetIdResult as string, 10);
  
  // Build the data matrix with formulas
  const data: (string | number)[][] = [];
  
  // Header row
  data.push([
    'EBITDA_Impact', 'Revenue_Enablement', 'Risk_Reduction',
    'Org_Capacity', 'Data_Quality', 'Tech_Infrastructure', 'Timeline_Fit',
    'EBITDA', 'Replication_Potential',
    'Value_Score', 'Readiness_Score', 'Priority_Score',
    'Adjusted_EBITDA', 'Adjusted_Priority', 'Portfolio_Adjusted_Priority'
  ]);
  
  // Data rows with formulas
  companies.forEach((company, idx) => {
    const row = idx + 2; // 1-indexed, skip header
    data.push([
      company.ebitdaImpact,
      company.revenueEnablement,
      company.riskReduction,
      company.organizationalCapacity,
      company.dataAvailability,
      company.techInfrastructure,
      company.timelineFit,
      company.ebitda,
      company.replicationPotential ?? 5,
      // Value Score formula
      `=(A${row}*0.5)+(B${row}*0.25)+(C${row}*0.25)`,
      // Readiness Score formula
      `=(D${row}*0.35)+(E${row}*0.35)+(F${row}*0.2)+(G${row}*0.1)`,
      // Priority Score formula
      `=(J${row}*0.5)+(K${row}*0.5)`,
      // Adjusted EBITDA formula
      `=H${row}*0.15*(J${row}/7)`,
      // Adjusted Priority formula
      `=L${row}*M${row}`,
      // Portfolio Adjusted Priority formula
      `=N${row}*(1+(I${row}*0.1))`
    ]);
  });
  
  // Set the data
  hfInstance.setSheetContent(sheetId as number, data);
  
  // Extract calculated values
  const results: CalculatedCompanyScores[] = [];
  for (let i = 0; i < companies.length; i++) {
    const row = i + 1; // 0-indexed in results, but 1-indexed in sheet (skip header)
    const valueScore = Number(hfInstance.getCellValue({ sheet: sheetId as number, row: row, col: 9 })) || 0;
    const readinessScore = Number(hfInstance.getCellValue({ sheet: sheetId as number, row: row, col: 10 })) || 0;
    const priorityScore = Number(hfInstance.getCellValue({ sheet: sheetId as number, row: row, col: 11 })) || 0;
    const adjustedEbitda = Number(hfInstance.getCellValue({ sheet: sheetId as number, row: row, col: 12 })) || 0;
    const adjustedPriority = Number(hfInstance.getCellValue({ sheet: sheetId as number, row: row, col: 13 })) || 0;
    const portfolioAdjustedPriority = Number(hfInstance.getCellValue({ sheet: sheetId as number, row: row, col: 14 })) || 0;
    
    results.push({
      valueScore: Math.round(valueScore * 10000) / 10000,
      readinessScore: Math.round(readinessScore * 10000) / 10000,
      priorityScore: Math.round(priorityScore * 10000) / 10000,
      adjustedEbitda: Math.round(adjustedEbitda * 100) / 100,
      adjustedPriority: Math.round(adjustedPriority * 100) / 100,
      portfolioAdjustedPriority: Math.round(portfolioAdjustedPriority * 100) / 100,
      quadrant: determineQuadrant(valueScore, readinessScore),
    });
  }
  
  // Clean up
  hfInstance.removeSheet(sheetId as number);
  
  return results;
}

/**
 * Validate score input (must be 1-10)
 */
export function validateScore(score: number): boolean {
  return score >= 1 && score <= 10;
}

/**
 * Get formula documentation for audit purposes
 */
export function getFormulaDocumentation() {
  return {
    valueScore: {
      formula: 'Value_Score = (EBITDA_Impact × 0.50) + (Revenue_Enablement × 0.25) + (Risk_Reduction × 0.25)',
      weights: FORMULA_WEIGHTS.value,
      description: 'Measures the potential value creation from AI initiatives',
    },
    readinessScore: {
      formula: 'Readiness_Score = (Org_Capacity × 0.35) + (Data_Quality × 0.35) + (Tech_Infrastructure × 0.20) + (Timeline_Fit × 0.10)',
      weights: FORMULA_WEIGHTS.readiness,
      description: 'Measures organizational readiness to implement AI initiatives',
    },
    priorityScore: {
      formula: 'Priority_Score = (Value_Score × 0.50) + (Readiness_Score × 0.50)',
      weights: FORMULA_WEIGHTS.priority,
      description: 'Combined score for prioritizing AI investments',
    },
    adjustedEbitda: {
      formula: 'Adjusted_EBITDA = EBITDA × 0.15 × (Value_Score / 7)',
      baseAssumption: '15% of EBITDA (Bain benchmark midpoint)' as const,
      description: 'Estimated EBITDA impact from AI initiatives',
    },
    adjustedPriority: {
      formula: 'Adjusted_Priority = Priority_Score × Adjusted_EBITDA',
      description: 'Priority weighted by financial impact',
    },
    portfolioAdjustedPriority: {
      formula: 'Portfolio_Adjusted_Priority = Adjusted_Priority × (1 + (Replication_Potential × 0.10))',
      replicationMultiplier: '10% per replication potential point' as const,
      description: 'Priority adjusted for cross-portfolio replication potential',
    },
    quadrantThreshold: {
      value: QUADRANT_THRESHOLD,
      description: 'Score of 7.0 (70%) defines "High" classification for quadrant placement',
    },
  };
}
