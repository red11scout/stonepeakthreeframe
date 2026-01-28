import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Calculator,
  Info,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FormulaItem {
  name: string;
  formula: string;
  description: string;
  components?: {
    name: string;
    weight: string;
    rationale: string;
  }[];
}

interface QuadrantDefinition {
  name: string;
  condition: string;
  action: string;
  color: string;
}

interface MethodologyPanelProps {
  title: string;
  subtitle: string;
  coreQuestion: string;
  formulas: FormulaItem[];
  quadrants?: QuadrantDefinition[];
  keyInsights?: string[];
  constraints?: string[];
  source?: string;
}

export function MethodologyPanel({
  title,
  subtitle,
  coreQuestion,
  formulas,
  quadrants,
  keyInsights,
  constraints,
  source,
}: MethodologyPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFormula, setActiveFormula] = useState<string | null>(null);

  return (
    <div className="bg-card/80 backdrop-blur-xl rounded-xl border border-border/50 overflow-hidden mb-6">
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 md:p-5 flex items-center justify-between hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-base md:text-lg flex items-center gap-2">
              {title}
              <Badge variant="outline" className="text-xs font-normal hidden sm:inline-flex">
                Methodology
              </Badge>
            </h3>
            <p className="text-sm text-muted-foreground hidden sm:block">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden md:inline">
            {isExpanded ? "Hide details" : "View calculation methodology"}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 md:px-5 pb-5 space-y-6 border-t border-border/30 pt-5">
              {/* Core Question */}
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-primary mb-1">Core Decision Question</p>
                    <p className="text-sm text-foreground/90">{coreQuestion}</p>
                  </div>
                </div>
              </div>

              {/* Formulas Section */}
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Calculation Formulas
                </h4>
                <div className="space-y-3">
                  {formulas.map((formula) => (
                    <div
                      key={formula.name}
                      className="border border-border/50 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setActiveFormula(activeFormula === formula.name ? null : formula.name)
                        }
                        className="w-full p-3 md:p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                      >
                        <div className="text-left">
                          <p className="font-medium text-sm">{formula.name}</p>
                          <code className="text-xs text-primary/80 font-mono bg-primary/5 px-2 py-0.5 rounded mt-1 inline-block">
                            {formula.formula}
                          </code>
                        </div>
                        {formula.components && (
                          <ChevronDown
                            className={`w-4 h-4 text-muted-foreground transition-transform ${
                              activeFormula === formula.name ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </button>

                      <AnimatePresence>
                        {activeFormula === formula.name && formula.components && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 md:px-4 pb-4 pt-2 border-t border-border/30 bg-muted/20">
                              <p className="text-xs text-muted-foreground mb-3">
                                {formula.description}
                              </p>
                              <div className="space-y-2">
                                {formula.components.map((comp) => (
                                  <div
                                    key={comp.name}
                                    className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs bg-background/50 rounded p-2"
                                  >
                                    <div className="flex items-center gap-2 min-w-[140px]">
                                      <span className="font-medium">{comp.name}</span>
                                      <Badge variant="secondary" className="text-[10px] px-1.5">
                                        {comp.weight}
                                      </Badge>
                                    </div>
                                    <span className="text-muted-foreground">{comp.rationale}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quadrant Definitions */}
              {quadrants && quadrants.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Quadrant Definitions (70% Threshold)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {quadrants.map((q) => (
                      <div
                        key={q.name}
                        className="p-3 rounded-lg border-l-4"
                        style={{ borderLeftColor: q.color, backgroundColor: `${q.color}10` }}
                      >
                        <p className="font-semibold text-sm" style={{ color: q.color }}>
                          {q.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{q.condition}</p>
                        <div className="flex items-center gap-1 mt-2 text-xs">
                          <ArrowRight className="w-3 h-3" />
                          <span className="font-medium">{q.action}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Insights */}
              {keyInsights && keyInsights.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Key Insights
                  </h4>
                  <ul className="space-y-2">
                    {keyInsights.map((insight, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-green-500 mt-1">•</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Constraints */}
              {constraints && constraints.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Critical Constraints
                  </h4>
                  <ul className="space-y-2">
                    {constraints.map((constraint, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm bg-amber-500/10 rounded p-2 border border-amber-500/20"
                      >
                        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        {constraint}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Source */}
              {source && (
                <p className="text-xs text-muted-foreground pt-2 border-t border-border/30">
                  Source: {source}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Pre-configured methodology panels for each framework
export const VALUE_READINESS_METHODOLOGY = {
  title: "Value-Readiness Model",
  subtitle: "Framework 1: Use case-level investment decisions",
  coreQuestion:
    "Is this specific AI initiative worth pursuing at this specific company?",
  formulas: [
    {
      name: "Value Score (50% of Priority)",
      formula: "Value = (EBITDA × 0.50) + (Revenue × 0.25) + (Risk × 0.25)",
      description: "Measures potential value creation from AI initiatives",
      components: [
        {
          name: "EBITDA Impact",
          weight: "50%",
          rationale: "PE's native language; directly translates to exit value",
        },
        {
          name: "Revenue Enablement",
          weight: "25%",
          rationale: "Growth story matters for multiple expansion",
        },
        {
          name: "Risk Reduction",
          weight: "25%",
          rationale: "Downside protection often equals upside capture in PE",
        },
      ],
    },
    {
      name: "Readiness Score (50% of Priority)",
      formula: "Readiness = (Org × 0.35) + (Data × 0.35) + (Tech × 0.20) + (Timeline × 0.10)",
      description: "Measures organizational readiness to implement AI initiatives",
      components: [
        {
          name: "Organizational Capacity",
          weight: "35%",
          rationale: "BCG's 70% rule: most initiatives fail on change management",
        },
        {
          name: "Data Availability",
          weight: "35%",
          rationale: "Forrester: 73% cite data as primary barrier",
        },
        {
          name: "Technical Infrastructure",
          weight: "20%",
          rationale: "Important but increasingly commoditized (cloud/API)",
        },
        {
          name: "Timeline Fit",
          weight: "10%",
          rationale: "Hold period alignment consideration",
        },
      ],
    },
    {
      name: "Priority Score",
      formula: "Priority = (Value × 0.50) + (Readiness × 0.50)",
      description: "Combined score for prioritizing AI investments",
      components: [],
    },
    {
      name: "EBITDA Translation Layer",
      formula: "Adjusted EBITDA = EBITDA × 0.15 × (Value Score / 7)",
      description:
        "Converts scores to estimated dollar impact using Bain benchmark (5-25% range, 15% midpoint)",
      components: [
        {
          name: "Base Assumption",
          weight: "15%",
          rationale: "Conservative midpoint of Bain benchmark range (5-25%)",
        },
        {
          name: "Value Adjustment",
          weight: "÷ 7",
          rationale: "Companies with Value Score > 7 capture more lift",
        },
      ],
    },
    {
      name: "Adjusted Priority",
      formula: "Adjusted Priority = Priority Score × Adjusted EBITDA",
      description: "Priority weighted by financial impact for cross-company comparison",
      components: [],
    },
  ],
  quadrants: [
    {
      name: "Strategic",
      condition: "Value ≥ 7, Readiness < 7",
      action: "Invest in readiness enablers first",
      color: "oklch(0.60 0.15 300)",
    },
    {
      name: "Champions",
      condition: "Value ≥ 7, Readiness ≥ 7",
      action: "Full resources, 90-day implementation target",
      color: "oklch(0.65 0.18 145)",
    },
    {
      name: "Foundations",
      condition: "Value < 7, Readiness < 7",
      action: "Revisit after foundation work",
      color: "oklch(0.45 0.02 250)",
    },
    {
      name: "Quick Wins",
      condition: "Value < 7, Readiness ≥ 7",
      action: "Fast implementation, accumulate learnings",
      color: "oklch(0.60 0.18 250)",
    },
  ],
  keyInsights: [
    "Research consistently uses 70% (score of 7.0) threshold for 'High' classification",
    "Every use case must have estimated annual EBITDA impact before scoring",
    "Initiatives requiring >$1M investment require separate strategic review regardless of score",
  ],
  constraints: [
    "Investment Magnitude Threshold: Initiatives >$1M require separate strategic review",
  ],
  source: "PE AI Investment Framework Research",
};

export const PORTFOLIO_AMPLIFICATION_METHODOLOGY = {
  title: "Portfolio Amplification Model",
  subtitle: "Framework 2: Cross-portfolio synergy optimization",
  coreQuestion:
    "How do we maximize total returns across all companies, not just optimize each one independently?",
  formulas: [
    {
      name: "Replication Potential (1-10 Scale)",
      formula: "Score based on deployment breadth across portfolio",
      description: "Measures how broadly an AI initiative can be deployed across portfolio companies",
      components: [
        {
          name: "Score 9-10",
          weight: "10+ companies",
          rationale: "Directly deployable with minimal customization (e.g., contract analysis, procurement)",
        },
        {
          name: "Score 7-8",
          weight: "5-10 companies",
          rationale: "Deployable with moderate customization (e.g., sales forecasting)",
        },
        {
          name: "Score 5-6",
          weight: "2-4 companies",
          rationale: "Deployable with significant customization (e.g., industry-specific compliance)",
        },
        {
          name: "Score 1-4",
          weight: "1 company",
          rationale: "Single company use case (highly specialized process)",
        },
      ],
    },
    {
      name: "Platform Classification",
      formula: "Platform Play vs. Point Solution",
      description: "Determines build strategy: centralized vs. local implementation",
      components: [
        {
          name: "Platform Play",
          weight: "Build centrally",
          rationale: "Creates shared infrastructure (data lake, ML registry, contract intelligence)",
        },
        {
          name: "Point Solution",
          weight: "Build locally",
          rationale: "Solves specific problem at specific company, share learnings only",
        },
      ],
    },
    {
      name: "Portfolio-Adjusted Priority",
      formula: "Portfolio Priority = (Priority × Adj. EBITDA) × (1 + (Replication × 0.10))",
      description: "Quantifies portfolio leverage that makes PE AI investment fundamentally different",
      components: [
        {
          name: "Base Priority",
          weight: "Priority × EBITDA",
          rationale: "Standard adjusted priority from Framework 1",
        },
        {
          name: "Replication Multiplier",
          weight: "+10% per point",
          rationale: "Each replication potential point adds 10% to priority",
        },
      ],
    },
  ],
  keyInsights: [
    "This is the framework PE firms should care most about—captures structural advantage",
    "No standalone company can replicate cross-portfolio deployment",
    "Portfolio Multipliers (high priority + high replication) are the gold standard",
    "An initiative scoring 7.5 with 8+ replication across 15 companies beats a 9.0 with 3 replication at one company",
  ],
  constraints: [],
  source: "PE AI Investment Framework Research",
};

export const HOLD_PERIOD_METHODOLOGY = {
  title: "Hold Period Value Capture Model",
  subtitle: "Framework 3: Investment timing and sequencing",
  coreQuestion:
    "How do we sequence investments against our hold period to maximize realized value at exit?",
  formulas: [
    {
      name: "Track 1: EBITDA Accelerators",
      formula: "Timeline: 0-12 months | Investment: 40-50%",
      description: "Realized P&L impact before exit",
      components: [
        {
          name: "Target",
          weight: "6 months",
          rationale: "Measurable EBITDA contribution within 6 months (Bain benchmark)",
        },
        {
          name: "Use Cases",
          weight: "Automation",
          rationale: "Customer support, procurement, back-office, developer productivity",
        },
        {
          name: "Exit Relevance",
          weight: "QoE",
          rationale: "Proven, recurring EBITDA improvement shown in quality of earnings",
        },
      ],
    },
    {
      name: "Track 2: Growth Enablers",
      formula: "Timeline: 6-24 months | Investment: 30-40%",
      description: "Revenue/margin trajectory improvement",
      components: [
        {
          name: "Target",
          weight: "Trajectory",
          rationale: "Demonstrated revenue or margin trajectory inflection",
        },
        {
          name: "Use Cases",
          weight: "Analytics",
          rationale: "Sales forecasting, pricing optimization, churn prediction, demand planning",
        },
        {
          name: "Exit Relevance",
          weight: "Growth story",
          rationale: "'AI-enhanced growth story' for management presentation",
        },
      ],
    },
    {
      name: "Track 3: Exit Multiplier Plays",
      formula: "Timeline: 12-36 months | Investment: 15-25%",
      description: "AI narrative that commands premium multiple",
      components: [
        {
          name: "Target",
          weight: "Positioning",
          rationale: "AI capabilities that position company for premium valuation",
        },
        {
          name: "Use Cases",
          weight: "Products",
          rationale: "AI-enhanced products (ARR), proprietary data assets, AI-native architecture",
        },
        {
          name: "Exit Relevance",
          weight: "2-4x premium",
          rationale: "'AI company' narrative commands 2-4x revenue multiple vs. 'company using AI'",
        },
      ],
    },
    {
      name: "Phase-Gate Model",
      formula: "Year 1 → Year 2 → Year 3 → Year 4+",
      description: "Maps hold period to required value capture milestones",
      components: [
        {
          name: "Year 1 (Foundation)",
          weight: "Launch",
          rationale: "100% Track 1 launched; 25% showing measurable impact",
        },
        {
          name: "Year 2 (Acceleration)",
          weight: "Run-rate",
          rationale: "Track 1 at run-rate; Track 2 showing trajectory change",
        },
        {
          name: "Year 3 (Proof)",
          weight: "Results",
          rationale: "Track 1 in QoE; Track 2 in presentation; Track 3 architecture visible",
        },
        {
          name: "Year 4+ (Exit Prep)",
          weight: "Diligence",
          rationale: "AI narrative documented; buyer diligence-ready",
        },
      ],
    },
  ],
  keyInsights: [
    "PE hold periods (3-5 years) are shorter than AI transformation timelines (2-4 years)",
    "Three-track approach balances EBITDA capture now with exit narrative later",
    "88% of AI POCs fail to reach production—PE firms can't afford this failure rate",
  ],
  constraints: [
    "No more than 25% of AI investment should go to initiatives without 12-month value visibility",
  ],
  source: "PE AI Investment Framework Research",
};
