import { describe, expect, it } from "vitest";
import {
  calculateValueScore,
  calculateReadinessScore,
  calculatePriorityScore,
  calculateAdjustedEbitda,
  calculateAdjustedPriority,
  calculatePortfolioAdjustedPriority,
  determineQuadrant,
  calculateAllScores,
} from "./calculations";
import { QUADRANT_THRESHOLD } from "../shared/stonepeak";

describe("Calculation Engine", () => {
  describe("calculateValueScore", () => {
    it("calculates value score with weighted formula: (EBITDA×0.5) + (Revenue×0.25) + (Risk×0.25)", () => {
      // (8 × 0.5) + (7 × 0.25) + (6 × 0.25) = 4 + 1.75 + 1.5 = 7.25
      const result = calculateValueScore(8, 7, 6);
      expect(result).toBe(7.25);
    });

    it("handles decimal inputs correctly", () => {
      // (7.5 × 0.5) + (8.5 × 0.25) + (6 × 0.25) = 3.75 + 2.125 + 1.5 = 7.375
      const result = calculateValueScore(7.5, 8.5, 6);
      expect(result).toBeCloseTo(7.375, 4);
    });

    it("returns 0 when all inputs are 0", () => {
      const result = calculateValueScore(0, 0, 0);
      expect(result).toBe(0);
    });

    it("returns 10 when all inputs are 10", () => {
      const result = calculateValueScore(10, 10, 10);
      expect(result).toBe(10);
    });
  });

  describe("calculateReadinessScore", () => {
    it("calculates readiness score with weighted formula: (Org×0.35) + (Data×0.35) + (Tech×0.20) + (Timeline×0.10)", () => {
      // (8 × 0.35) + (7 × 0.35) + (6 × 0.20) + (9 × 0.10) = 2.8 + 2.45 + 1.2 + 0.9 = 7.35
      const result = calculateReadinessScore(8, 7, 6, 9);
      expect(result).toBeCloseTo(7.35, 4);
    });

    it("handles decimal inputs correctly", () => {
      // (7.5 × 0.35) + (8.5 × 0.35) + (6.5 × 0.20) + (7.5 × 0.10) = 2.625 + 2.975 + 1.3 + 0.75 = 7.65
      const result = calculateReadinessScore(7.5, 8.5, 6.5, 7.5);
      expect(result).toBeCloseTo(7.65, 4);
    });

    it("returns 0 when all inputs are 0", () => {
      const result = calculateReadinessScore(0, 0, 0, 0);
      expect(result).toBe(0);
    });

    it("returns 10 when all inputs are 10", () => {
      const result = calculateReadinessScore(10, 10, 10, 10);
      expect(result).toBe(10);
    });
  });

  describe("calculatePriorityScore", () => {
    it("calculates priority score as weighted average: (Value×0.5) + (Readiness×0.5)", () => {
      // (8 × 0.5) + (6 × 0.5) = 4 + 3 = 7
      const result = calculatePriorityScore(8, 6);
      expect(result).toBe(7);
    });

    it("handles decimal inputs correctly", () => {
      // (7.5 × 0.5) + (8.5 × 0.5) = 3.75 + 4.25 = 8
      const result = calculatePriorityScore(7.5, 8.5);
      expect(result).toBe(8);
    });
  });

  describe("calculateAdjustedEbitda", () => {
    it("calculates adjusted EBITDA: EBITDA × 0.15 × (ValueScore / 7)", () => {
      // 100000000 × 0.15 × (7 / 7) = 100000000 × 0.15 × 1 = 15000000
      const result = calculateAdjustedEbitda(100000000, 7);
      expect(result).toBe(15000000);
    });

    it("scales with value score above baseline", () => {
      // 100000000 × 0.15 × (8 / 7) = 100000000 × 0.15 × 1.142857 = 17142857.14
      const result = calculateAdjustedEbitda(100000000, 8);
      expect(result).toBeCloseTo(17142857.14, 0);
    });

    it("scales with value score below baseline", () => {
      // 100000000 × 0.15 × (5 / 7) = 100000000 × 0.15 × 0.714286 = 10714285.71
      const result = calculateAdjustedEbitda(100000000, 5);
      expect(result).toBeCloseTo(10714285.71, 0);
    });
  });

  describe("calculateAdjustedPriority", () => {
    it("calculates adjusted priority as priority score times adjusted EBITDA", () => {
      const result = calculateAdjustedPriority(7.5, 1000000);
      expect(result).toBe(7500000);
    });

    it("handles decimal priority scores", () => {
      const result = calculateAdjustedPriority(6.75, 1000000);
      expect(result).toBe(6750000);
    });
  });

  describe("calculatePortfolioAdjustedPriority", () => {
    it("applies replication multiplier: AdjPriority × (1 + Replication × 0.10)", () => {
      // priorityScore × adjustedEbitda × (1 + replication × 0.10)
      // 7.5 × 1000000 × (1 + 8 × 0.10) = 7500000 × 1.8 = 13500000
      const result = calculatePortfolioAdjustedPriority(7.5, 1000000, 8);
      expect(result).toBe(13500000);
    });

    it("returns base adjusted priority when replication potential is 0", () => {
      // 7.5 × 1000000 × (1 + 0 × 0.10) = 7500000 × 1 = 7500000
      const result = calculatePortfolioAdjustedPriority(7.5, 1000000, 0);
      expect(result).toBe(7500000);
    });

    it("doubles adjusted priority when replication potential is 10", () => {
      // 7.5 × 1000000 × (1 + 10 × 0.10) = 7500000 × 2 = 15000000
      const result = calculatePortfolioAdjustedPriority(7.5, 1000000, 10);
      expect(result).toBe(15000000);
    });
  });

  describe("determineQuadrant", () => {
    it("returns Champions for high value and high readiness", () => {
      const result = determineQuadrant(8, 8);
      expect(result).toBe("Champions");
    });

    it("returns Quick Wins for lower value and high readiness", () => {
      const result = determineQuadrant(6, 8);
      expect(result).toBe("Quick Wins");
    });

    it("returns Strategic for high value and lower readiness", () => {
      const result = determineQuadrant(8, 6);
      expect(result).toBe("Strategic");
    });

    it("returns Foundations for lower value and lower readiness", () => {
      const result = determineQuadrant(6, 6);
      expect(result).toBe("Foundations");
    });

    it("uses 7.0 as the threshold", () => {
      expect(QUADRANT_THRESHOLD).toBe(7.0);
    });

    it("treats exactly 7.0 as meeting the threshold", () => {
      const result = determineQuadrant(7, 7);
      expect(result).toBe("Champions");
    });

    it("treats 6.99 as below threshold", () => {
      const result = determineQuadrant(6.99, 6.99);
      expect(result).toBe("Foundations");
    });
  });

  describe("Deterministic calculations", () => {
    it("produces identical results for identical inputs", () => {
      const inputs = { ebitdaImpact: 8, revenueEnablement: 7, riskReduction: 6 };
      const result1 = calculateValueScore(inputs.ebitdaImpact, inputs.revenueEnablement, inputs.riskReduction);
      const result2 = calculateValueScore(inputs.ebitdaImpact, inputs.revenueEnablement, inputs.riskReduction);
      expect(result1).toBe(result2);
    });

    it("maintains precision across calculation chain", () => {
      // Full calculation chain for a company
      const ebitdaImpact = 8;
      const revenueEnablement = 7;
      const riskReduction = 6;
      const orgCapacity = 7;
      const dataAvailability = 8;
      const techInfra = 7;
      const timelineFit = 8;
      const ebitda = 100000000;
      const replicationPotential = 8;

      // Value Score: (8 × 0.5) + (7 × 0.25) + (6 × 0.25) = 4 + 1.75 + 1.5 = 7.25
      const valueScore = calculateValueScore(ebitdaImpact, revenueEnablement, riskReduction);
      expect(valueScore).toBe(7.25);

      // Readiness Score: (7 × 0.35) + (8 × 0.35) + (7 × 0.20) + (8 × 0.10) = 2.45 + 2.8 + 1.4 + 0.8 = 7.45
      const readinessScore = calculateReadinessScore(orgCapacity, dataAvailability, techInfra, timelineFit);
      expect(readinessScore).toBeCloseTo(7.45, 4);

      // Priority Score: (7.25 × 0.5) + (7.45 × 0.5) = 3.625 + 3.725 = 7.35
      const priorityScore = calculatePriorityScore(valueScore, readinessScore);
      expect(priorityScore).toBeCloseTo(7.35, 4);

      // Adjusted EBITDA: 100000000 × 0.15 × (7.25 / 7) = 15535714.29
      const adjustedEbitda = calculateAdjustedEbitda(ebitda, valueScore);
      expect(adjustedEbitda).toBeCloseTo(15535714.29, 0);

      // Adjusted Priority: 7.35 × 15535714.29 = 114187500
      const adjustedPriority = calculateAdjustedPriority(priorityScore, adjustedEbitda);
      expect(adjustedPriority).toBeCloseTo(114187500, -4);

      // Portfolio Adjusted Priority: 114187500 × (1 + 8 × 0.10) = 114187500 × 1.8 = 205537500
      const portfolioAdjustedPriority = calculatePortfolioAdjustedPriority(priorityScore, adjustedEbitda, replicationPotential);
      expect(portfolioAdjustedPriority).toBeCloseTo(205537500, -4);
    });
  });

  describe("calculateAllScores", () => {
    it("calculates all scores for a company", () => {
      const input = {
        ebitdaImpact: 8,
        revenueEnablement: 7,
        riskReduction: 6,
        organizationalCapacity: 8,
        dataAvailability: 8,
        techInfrastructure: 7,
        timelineFit: 8,
        ebitda: 100000000,
        replicationPotential: 8,
      };

      const result = calculateAllScores(input);

      expect(result.valueScore).toBe(7.25);
      expect(result.readinessScore).toBeCloseTo(7.8, 1);
      expect(result.priorityScore).toBeCloseTo(7.525, 2);
      expect(result.quadrant).toBe("Champions");
      expect(result.adjustedEbitda).toBeGreaterThan(0);
      expect(result.adjustedPriority).toBeGreaterThan(0);
      expect(result.portfolioAdjustedPriority).toBeGreaterThan(result.adjustedPriority);
    });

    it("assigns correct quadrant based on scores", () => {
      // Low value, low readiness -> Foundations
      const foundationsInput = {
        ebitdaImpact: 5,
        revenueEnablement: 5,
        riskReduction: 5,
        organizationalCapacity: 5,
        dataAvailability: 5,
        techInfrastructure: 5,
        timelineFit: 5,
        ebitda: 100000000,
      };
      expect(calculateAllScores(foundationsInput).quadrant).toBe("Foundations");

      // High value, high readiness -> Champions
      const championsInput = {
        ebitdaImpact: 9,
        revenueEnablement: 9,
        riskReduction: 9,
        organizationalCapacity: 9,
        dataAvailability: 9,
        techInfrastructure: 9,
        timelineFit: 9,
        ebitda: 100000000,
      };
      expect(calculateAllScores(championsInput).quadrant).toBe("Champions");
    });
  });
});
