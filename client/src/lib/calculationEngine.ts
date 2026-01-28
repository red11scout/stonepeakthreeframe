/**
 * HyperFormula Calculation Engine
 * Deterministic, repeatable calculations for AI Use Case portfolio analysis
 * 
 * All calculations use HyperFormula to ensure:
 * 1. Same inputs always produce same outputs
 * 2. Formula-based calculations are transparent and auditable
 * 3. Complex aggregations are handled consistently
 */

import HyperFormula from 'hyperformula';
import type { 
  ParsedAssessment, 
  BenefitQuantification, 
  PriorityRoadmap, 
  EffortTokenModel,
  FrictionPoint,
  PortfolioMetrics 
} from '@shared/assessmentTypes';
import { parseCurrency } from '@shared/assessmentTypes';

// Initialize HyperFormula with configuration
const hfInstance = HyperFormula.buildEmpty({
  licenseKey: 'gpl-v3',
  precisionRounding: 10,
  useColumnIndex: true,
});

// Sheet names for different calculation contexts
const PORTFOLIO_SHEET = 'Portfolio';
const COMPANY_SHEET = 'Company';

/**
 * Calculate portfolio-level metrics from all assessments
 * Uses HyperFormula for deterministic aggregation
 */
export function calculatePortfolioMetrics(assessments: ParsedAssessment[]): PortfolioMetrics {
  if (assessments.length === 0) {
    return {
      totalCompanies: 0,
      totalUseCases: 0,
      totalAnnualValue: 0,
      totalCostBenefit: 0,
      totalRevenueBenefit: 0,
      totalRiskBenefit: 0,
      totalCashFlowBenefit: 0,
      totalMonthlyTokens: 0,
      avgValuePerCompany: 0,
      avgUseCasesPerCompany: 0,
      criticalUseCases: 0,
      highUseCases: 0,
      mediumUseCases: 0,
      lowUseCases: 0,
      totalFrictionCost: 0,
      avgPriorityScore: 0,
    };
  }

  // Build data matrix for HyperFormula
  // Row format: [annualValue, costBenefit, revenueBenefit, riskBenefit, cashFlowBenefit, monthlyTokens, useCaseCount, frictionCost]
  const dataRows: (number | string)[][] = assessments.map(a => {
    const dashboard = a.executiveDashboard;
    const frictionCost = a.frictionPoints.reduce((sum, fp) => sum + parseCurrency(fp["Estimated Annual Cost ($)"]), 0);
    return [
      dashboard.totalAnnualValue,
      dashboard.totalCostBenefit,
      dashboard.totalRevenueBenefit,
      dashboard.totalRiskBenefit,
      dashboard.totalCashFlowBenefit,
      dashboard.totalMonthlyTokens,
      a.useCases.length,
      frictionCost,
    ];
  });

  // Add formula row for aggregations
  const rowCount = dataRows.length;
  const formulaRow = [
    `=SUM(A1:A${rowCount})`,  // Total Annual Value
    `=SUM(B1:B${rowCount})`,  // Total Cost Benefit
    `=SUM(C1:C${rowCount})`,  // Total Revenue Benefit
    `=SUM(D1:D${rowCount})`,  // Total Risk Benefit
    `=SUM(E1:E${rowCount})`,  // Total Cash Flow Benefit
    `=SUM(F1:F${rowCount})`,  // Total Monthly Tokens
    `=SUM(G1:G${rowCount})`,  // Total Use Cases
    `=SUM(H1:H${rowCount})`,  // Total Friction Cost
  ];

  // Create or update sheet
  try {
    const sheetId = hfInstance.getSheetId(PORTFOLIO_SHEET);
    if (sheetId !== undefined) {
      hfInstance.removeSheet(sheetId);
    }
  } catch (e) {
    // Sheet doesn't exist, continue
  }

  hfInstance.addSheet(PORTFOLIO_SHEET);
  const sheetId = hfInstance.getSheetId(PORTFOLIO_SHEET)!;
  
  // Set data and formulas
  hfInstance.setSheetContent(sheetId, [...dataRows, formulaRow]);

  // Get calculated values
  const formulaRowIndex = rowCount;
  const totalAnnualValue = hfInstance.getCellValue({ sheet: sheetId, row: formulaRowIndex, col: 0 }) as number;
  const totalCostBenefit = hfInstance.getCellValue({ sheet: sheetId, row: formulaRowIndex, col: 1 }) as number;
  const totalRevenueBenefit = hfInstance.getCellValue({ sheet: sheetId, row: formulaRowIndex, col: 2 }) as number;
  const totalRiskBenefit = hfInstance.getCellValue({ sheet: sheetId, row: formulaRowIndex, col: 3 }) as number;
  const totalCashFlowBenefit = hfInstance.getCellValue({ sheet: sheetId, row: formulaRowIndex, col: 4 }) as number;
  const totalMonthlyTokens = hfInstance.getCellValue({ sheet: sheetId, row: formulaRowIndex, col: 5 }) as number;
  const totalUseCases = hfInstance.getCellValue({ sheet: sheetId, row: formulaRowIndex, col: 6 }) as number;
  const totalFrictionCost = hfInstance.getCellValue({ sheet: sheetId, row: formulaRowIndex, col: 7 }) as number;

  // Count priority tiers
  let criticalUseCases = 0;
  let highUseCases = 0;
  let mediumUseCases = 0;
  let lowUseCases = 0;
  let totalPriorityScore = 0;
  let priorityCount = 0;

  assessments.forEach(a => {
    a.roadmap.forEach(r => {
      const score = r["Priority Score (0-100)"];
      // Only count valid numeric scores
      if (typeof score === 'number' && !isNaN(score)) {
        priorityCount++;
        totalPriorityScore += score;
      }
      switch (r["Priority Tier"]) {
        case "Critical": criticalUseCases++; break;
        case "High": highUseCases++; break;
        case "Medium": mediumUseCases++; break;
        case "Low": lowUseCases++; break;
      }
    });
  });

  return {
    totalCompanies: assessments.length,
    totalUseCases,
    totalAnnualValue,
    totalCostBenefit,
    totalRevenueBenefit,
    totalRiskBenefit,
    totalCashFlowBenefit,
    totalMonthlyTokens,
    avgValuePerCompany: totalAnnualValue / assessments.length,
    avgUseCasesPerCompany: totalUseCases / assessments.length,
    criticalUseCases,
    highUseCases,
    mediumUseCases,
    lowUseCases,
    totalFrictionCost,
    avgPriorityScore: priorityCount > 0 ? totalPriorityScore / priorityCount : 0,
  };
}

/**
 * Calculate company-level benefit breakdown
 * Returns deterministic values for each benefit category
 */
export function calculateCompanyBenefits(benefits: BenefitQuantification[]): {
  totalValue: number;
  costBenefit: number;
  revenueBenefit: number;
  riskBenefit: number;
  cashFlowBenefit: number;
  avgProbability: number;
} {
  if (benefits.length === 0) {
    return { totalValue: 0, costBenefit: 0, revenueBenefit: 0, riskBenefit: 0, cashFlowBenefit: 0, avgProbability: 0 };
  }

  // Build data matrix
  const dataRows: number[][] = benefits.map(b => [
    parseCurrency(b["Cost Benefit ($)"]),
    parseCurrency(b["Revenue Benefit ($)"]),
    parseCurrency(b["Risk Benefit ($)"]),
    parseCurrency(b["Cash Flow Benefit ($)"]),
    b["Probability of Success"],
  ]);

  // Create or update sheet
  try {
    const sheetId = hfInstance.getSheetId(COMPANY_SHEET);
    if (sheetId !== undefined) {
      hfInstance.removeSheet(sheetId);
    }
  } catch (e) {
    // Sheet doesn't exist
  }

  hfInstance.addSheet(COMPANY_SHEET);
  const sheetId = hfInstance.getSheetId(COMPANY_SHEET)!;

  const rowCount = dataRows.length;
  const formulaRow = [
    `=SUM(A1:A${rowCount})`,
    `=SUM(B1:B${rowCount})`,
    `=SUM(C1:C${rowCount})`,
    `=SUM(D1:D${rowCount})`,
    `=AVERAGE(E1:E${rowCount})`,
  ];

  hfInstance.setSheetContent(sheetId, [...dataRows, formulaRow]);

  const formulaRowIndex = rowCount;
  return {
    costBenefit: hfInstance.getCellValue({ sheet: sheetId, row: formulaRowIndex, col: 0 }) as number,
    revenueBenefit: hfInstance.getCellValue({ sheet: sheetId, row: formulaRowIndex, col: 1 }) as number,
    riskBenefit: hfInstance.getCellValue({ sheet: sheetId, row: formulaRowIndex, col: 2 }) as number,
    cashFlowBenefit: hfInstance.getCellValue({ sheet: sheetId, row: formulaRowIndex, col: 3 }) as number,
    avgProbability: hfInstance.getCellValue({ sheet: sheetId, row: formulaRowIndex, col: 4 }) as number,
    totalValue: (hfInstance.getCellValue({ sheet: sheetId, row: formulaRowIndex, col: 0 }) as number) +
                (hfInstance.getCellValue({ sheet: sheetId, row: formulaRowIndex, col: 1 }) as number) +
                (hfInstance.getCellValue({ sheet: sheetId, row: formulaRowIndex, col: 2 }) as number) +
                (hfInstance.getCellValue({ sheet: sheetId, row: formulaRowIndex, col: 3 }) as number),
  };
}

/**
 * Calculate effort metrics for a company
 */
export function calculateEffortMetrics(effortModel: EffortTokenModel[]): {
  avgEffortScore: number;
  avgDataReadiness: number;
  avgIntegrationComplexity: number;
  avgChangeManagement: number;
  avgTimeToValue: number;
  totalAnnualTokenCost: number;
  totalMonthlyTokens: number;
} {
  if (effortModel.length === 0) {
    return {
      avgEffortScore: 0,
      avgDataReadiness: 0,
      avgIntegrationComplexity: 0,
      avgChangeManagement: 0,
      avgTimeToValue: 0,
      totalAnnualTokenCost: 0,
      totalMonthlyTokens: 0,
    };
  }

  const dataRows: number[][] = effortModel.map(e => [
    e["Effort Score (1-5)"],
    e["Data Readiness (1-5)"],
    e["Integration Complexity (1-5)"],
    e["Change Mgmt (1-5)"],
    e["Time-to-Value (months)"],
    parseCurrency(e["Annual Token Cost ($)"]),
    e["Monthly Tokens"],
  ]);

  try {
    const sheetId = hfInstance.getSheetId('Effort');
    if (sheetId !== undefined) {
      hfInstance.removeSheet(sheetId);
    }
  } catch (e) {}

  hfInstance.addSheet('Effort');
  const sheetId = hfInstance.getSheetId('Effort')!;

  const rowCount = dataRows.length;
  const formulaRow = [
    `=AVERAGE(A1:A${rowCount})`,
    `=AVERAGE(B1:B${rowCount})`,
    `=AVERAGE(C1:C${rowCount})`,
    `=AVERAGE(D1:D${rowCount})`,
    `=AVERAGE(E1:E${rowCount})`,
    `=SUM(F1:F${rowCount})`,
    `=SUM(G1:G${rowCount})`,
  ];

  hfInstance.setSheetContent(sheetId, [...dataRows, formulaRow]);

  const formulaRowIndex = rowCount;
  return {
    avgEffortScore: hfInstance.getCellValue({ sheet: sheetId, row: formulaRowIndex, col: 0 }) as number,
    avgDataReadiness: hfInstance.getCellValue({ sheet: sheetId, row: formulaRowIndex, col: 1 }) as number,
    avgIntegrationComplexity: hfInstance.getCellValue({ sheet: sheetId, row: formulaRowIndex, col: 2 }) as number,
    avgChangeManagement: hfInstance.getCellValue({ sheet: sheetId, row: formulaRowIndex, col: 3 }) as number,
    avgTimeToValue: hfInstance.getCellValue({ sheet: sheetId, row: formulaRowIndex, col: 4 }) as number,
    totalAnnualTokenCost: hfInstance.getCellValue({ sheet: sheetId, row: formulaRowIndex, col: 5 }) as number,
    totalMonthlyTokens: hfInstance.getCellValue({ sheet: sheetId, row: formulaRowIndex, col: 6 }) as number,
  };
}

/**
 * Calculate friction point totals by severity
 */
export function calculateFrictionMetrics(frictionPoints: FrictionPoint[]): {
  totalCost: number;
  criticalCost: number;
  highCost: number;
  mediumCost: number;
  lowCost: number;
  countBySeverity: Record<string, number>;
  costByFunction: Record<string, number>;
} {
  const countBySeverity: Record<string, number> = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  const costByFunction: Record<string, number> = {};
  let criticalCost = 0;
  let highCost = 0;
  let mediumCost = 0;
  let lowCost = 0;

  frictionPoints.forEach(fp => {
    const cost = parseCurrency(fp["Estimated Annual Cost ($)"]);
    countBySeverity[fp.Severity] = (countBySeverity[fp.Severity] || 0) + 1;
    costByFunction[fp.Function] = (costByFunction[fp.Function] || 0) + cost;

    switch (fp.Severity) {
      case "Critical": criticalCost += cost; break;
      case "High": highCost += cost; break;
      case "Medium": mediumCost += cost; break;
      case "Low": lowCost += cost; break;
    }
  });

  return {
    totalCost: criticalCost + highCost + mediumCost + lowCost,
    criticalCost,
    highCost,
    mediumCost,
    lowCost,
    countBySeverity,
    costByFunction,
  };
}

/**
 * Calculate roadmap distribution by quarter
 */
export function calculateRoadmapDistribution(roadmap: PriorityRoadmap[]): {
  byQuarter: Record<string, { count: number; totalValue: number; useCases: string[] }>;
  byTier: Record<string, number>;
  avgPriorityScore: number;
} {
  const byQuarter: Record<string, { count: number; totalValue: number; useCases: string[] }> = {};
  const byTier: Record<string, number> = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  let totalScore = 0;

  roadmap.forEach(r => {
    const quarter = r["Recommended Phase"];
    if (!byQuarter[quarter]) {
      byQuarter[quarter] = { count: 0, totalValue: 0, useCases: [] };
    }
    byQuarter[quarter].count++;
    byQuarter[quarter].useCases.push(r["Use Case"]);
    byTier[r["Priority Tier"]]++;
    totalScore += r["Priority Score (0-100)"];
  });

  return {
    byQuarter,
    byTier,
    avgPriorityScore: roadmap.length > 0 ? totalScore / roadmap.length : 0,
  };
}

/**
 * Calculate ROI metrics
 */
export function calculateROI(
  totalBenefit: number,
  totalTokenCost: number,
  implementationMonths: number = 12
): {
  roi: number;
  paybackMonths: number;
  benefitCostRatio: number;
} {
  const annualizedCost = totalTokenCost;
  const roi = annualizedCost > 0 ? ((totalBenefit - annualizedCost) / annualizedCost) * 100 : 0;
  const monthlyBenefit = totalBenefit / 12;
  const paybackMonths = monthlyBenefit > 0 ? annualizedCost / monthlyBenefit : 0;
  const benefitCostRatio = annualizedCost > 0 ? totalBenefit / annualizedCost : 0;

  return {
    roi,
    paybackMonths,
    benefitCostRatio,
  };
}

/**
 * Get cross-company comparison data
 */
export function getCompanyComparison(assessments: ParsedAssessment[]): Array<{
  company: string;
  totalValue: number;
  costBenefit: number;
  revenueBenefit: number;
  riskBenefit: number;
  useCaseCount: number;
  avgPriorityScore: number;
  criticalCount: number;
  frictionCost: number;
}> {
  return assessments.map(a => {
    const frictionCost = a.frictionPoints.reduce((sum, fp) => sum + parseCurrency(fp["Estimated Annual Cost ($)"]), 0);
    const avgPriorityScore = a.roadmap.length > 0 
      ? a.roadmap.reduce((sum, r) => sum + r["Priority Score (0-100)"], 0) / a.roadmap.length 
      : 0;
    const criticalCount = a.roadmap.filter(r => r["Priority Tier"] === "Critical").length;

    return {
      company: a.companyName,
      totalValue: a.executiveDashboard.totalAnnualValue,
      costBenefit: a.executiveDashboard.totalCostBenefit,
      revenueBenefit: a.executiveDashboard.totalRevenueBenefit,
      riskBenefit: a.executiveDashboard.totalRiskBenefit,
      useCaseCount: a.useCases.length,
      avgPriorityScore,
      criticalCount,
      frictionCost,
    };
  }).sort((a, b) => b.totalValue - a.totalValue);
}

export { hfInstance };
