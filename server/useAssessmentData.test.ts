/**
 * Tests for useAssessmentData hook utility functions
 */

import { describe, it, expect } from 'vitest';
import { formatCurrency, parseCurrency, getStepData } from '../client/src/hooks/useAssessmentData';
import type { CompanyAssessment, AIUseCase } from '../shared/assessmentTypes';

describe('formatCurrency', () => {
  it('formats billions correctly', () => {
    expect(formatCurrency(1500000000)).toBe('$1.5B');
    expect(formatCurrency(2000000000)).toBe('$2.0B');
  });

  it('formats millions correctly', () => {
    expect(formatCurrency(135500000)).toBe('$135.5M');
    expect(formatCurrency(1000000)).toBe('$1.0M');
  });

  it('formats thousands correctly', () => {
    expect(formatCurrency(50000)).toBe('$50K');
    expect(formatCurrency(1500)).toBe('$2K'); // rounds to nearest K
  });

  it('formats small values correctly', () => {
    expect(formatCurrency(500)).toBe('$500');
    expect(formatCurrency(0)).toBe('$0');
  });
});

describe('parseCurrency', () => {
  it('parses dollar amounts with commas', () => {
    expect(parseCurrency('$1,500,000')).toBe(1500000);
    expect(parseCurrency('$50,000')).toBe(50000);
  });

  it('parses amounts with M suffix', () => {
    expect(parseCurrency('$39.1M')).toBe(39100000);
    expect(parseCurrency('$1.5M')).toBe(1500000);
  });

  it('parses amounts with K suffix', () => {
    expect(parseCurrency('$50K')).toBe(50000);
    expect(parseCurrency('$1.5K')).toBe(1500);
  });

  it('parses amounts with B suffix', () => {
    expect(parseCurrency('$1.1B')).toBe(1100000000);
  });

  it('handles empty or invalid values', () => {
    expect(parseCurrency('')).toBe(0);
    expect(parseCurrency('invalid')).toBe(0);
  });
});

describe('getStepData', () => {
  const mockAssessment: CompanyAssessment = {
    companyName: 'Test Company',
    generatedAt: '2026-01-28T00:00:00.000Z',
    analysis: {
      steps: [
        {
          step: 0,
          title: 'Company Overview',
          content: 'Test overview',
          data: null,
        },
        {
          step: 4,
          title: 'AI Use Case Generation',
          content: 'Use cases content',
          data: [
            {
              ID: 'UC-01',
              'Use Case Name': 'Test Use Case',
              Function: 'Operations',
              'Sub-Function': 'Testing',
              Description: 'A test use case',
              'AI Primitives': 'Data Analysis',
              'Target Friction': 'Manual testing',
              'Human-in-the-Loop Checkpoint': 'Review before deploy',
            },
          ],
        },
      ],
      summary: 'Test summary',
      executiveDashboard: {
        totalAnnualValue: 1000000,
        totalCostBenefit: 500000,
        totalRevenueBenefit: 300000,
        totalRiskBenefit: 200000,
        totalCashFlowBenefit: 0,
        totalMonthlyTokens: 1000000,
        valuePerMillionTokens: 1000,
        topUseCases: [],
      },
    },
  };

  it('extracts use case data from assessment', () => {
    const useCases = getStepData<AIUseCase>(mockAssessment, 'AI Use Case Generation');
    expect(useCases).toHaveLength(1);
    expect(useCases[0].ID).toBe('UC-01');
    expect(useCases[0]['Use Case Name']).toBe('Test Use Case');
  });

  it('returns empty array for non-existent step', () => {
    const data = getStepData<AIUseCase>(mockAssessment, 'Non-existent Step');
    expect(data).toEqual([]);
  });

  it('returns empty array for step with null data', () => {
    const data = getStepData<AIUseCase>(mockAssessment, 'Company Overview');
    expect(data).toEqual([]);
  });
});
