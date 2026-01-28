/**
 * AI Use Cases - Executive Intelligence Platform
 * World-class design with all 8 JSON sections:
 * 1. Company Overview
 * 2. Strategic Anchoring
 * 3. Business Functions (KPIs)
 * 4. Friction Points
 * 5. AI Use Cases
 * 6. Benefits Quantification
 * 7. Effort & Token Model
 * 8. Priority Roadmap
 * 
 * Design Philosophy:
 * - Clean, executive-level presentation inspired by aiplatformsforscale.com
 * - Comprehensive data with drill-down capabilities
 * - Mobile-first responsive design
 * - Interactive visualizations and charts
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  useAssessmentData, 
  useCompanyAssessment,
  usePortfolioAnalytics,
  getStepData,
  formatCurrency,
  parseCurrency,
} from '@/hooks/useAssessmentData';
import type { 
  AIUseCase, 
  BenefitQuantification, 
  PriorityRoadmap,
  StrategicTheme,
  FrictionPoint,
  BusinessKPI,
  EffortTokenModel,
} from '@shared/assessmentTypes';
import {
  Building2,
  TrendingUp,
  DollarSign,
  Shield,
  Zap,
  Target,
  ChevronRight,
  ChevronDown,
  Brain,
  Search,
  ArrowLeft,
  Sparkles,
  BarChart3,
  Clock,
  Users,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Layers,
  FileText,
  Calendar,
  Activity,
  Cpu,
  Database,
  Settings,
  TrendingDown,
  PieChart,
  GitBranch,
  Timer,
  Coins,
  Factory,
  Briefcase,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';

// Color palette for visualizations
const COLORS = {
  cost: 'oklch(0.70 0.18 145)',
  revenue: 'oklch(0.60 0.18 250)',
  risk: 'oklch(0.60 0.15 300)',
  cashflow: 'oklch(0.70 0.15 45)',
};

const TIER_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  Critical: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', border: 'border-red-500/30' },
  High: { bg: 'bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-500/30' },
  Medium: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/30' },
  Low: { bg: 'bg-gray-500/10', text: 'text-gray-600 dark:text-gray-400', border: 'border-gray-500/30' },
};

const SEVERITY_STYLES: Record<string, string> = {
  Critical: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
  High: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30',
  Medium: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
  Low: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/30',
};

// Portfolio Overview Dashboard
function PortfolioOverview({ onSelectCompany }: { onSelectCompany: (name: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const { loading, error, metrics, assessments } = usePortfolioAnalytics();

  const filteredAssessments = useMemo(() => {
    if (!assessments) return [];
    return assessments
      .filter(a => a.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => b.analysis.executiveDashboard.totalAnnualValue - a.analysis.executiveDashboard.totalAnnualValue);
  }, [assessments, searchQuery]);

  // Calculate portfolio-wide analytics
  const portfolioAnalytics = useMemo(() => {
    if (!assessments) return null;
    
    const allUseCases: { company: string; useCase: AIUseCase; benefit: BenefitQuantification | undefined }[] = [];
    const functionCounts: Record<string, number> = {};
    const primitiveCounts: Record<string, number> = {};
    
    assessments.forEach(a => {
      const useCases = getStepData<AIUseCase>(a, 'AI Use Case Generation');
      const benefits = getStepData<BenefitQuantification>(a, 'Benefits Quantification by Driver');
      
      useCases.forEach(uc => {
        const benefit = benefits.find(b => b.ID === uc.ID);
        allUseCases.push({ company: a.companyName, useCase: uc, benefit });
        
        // Count functions
        if (uc.Function) {
          functionCounts[uc.Function] = (functionCounts[uc.Function] || 0) + 1;
        }
        
        // Count AI primitives
        if (uc["AI Primitives"]) {
          uc["AI Primitives"].split(',').forEach(p => {
            const primitive = p.trim();
            primitiveCounts[primitive] = (primitiveCounts[primitive] || 0) + 1;
          });
        }
      });
    });

    // Top use cases by value
    const topUseCases = allUseCases
      .map(({ company, useCase, benefit }) => ({
        company,
        name: useCase["Use Case Name"],
        value: benefit ? 
          parseCurrency(benefit["Cost Benefit ($)"]) + 
          parseCurrency(benefit["Revenue Benefit ($)"]) + 
          parseCurrency(benefit["Risk Benefit ($)"]) : 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    return { topUseCases, functionCounts, primitiveCounts };
  }, [assessments]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-pulse">
            <Brain className="h-16 w-16 text-primary/30 mx-auto mb-4" />
          </div>
          <p className="text-muted-foreground">Loading portfolio intelligence...</p>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
        <p className="text-muted-foreground">{error || 'Unable to load data'}</p>
      </div>
    );
  }

  // Prepare chart data
  const valueBreakdownData = [
    { name: 'Cost Savings', value: metrics.totalCostBenefit, color: COLORS.cost },
    { name: 'Revenue Growth', value: metrics.totalRevenueBenefit, color: COLORS.revenue },
    { name: 'Risk Reduction', value: metrics.totalRiskBenefit, color: COLORS.risk },
  ];

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto px-4"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-foreground/90 mb-3 md:mb-4 tracking-tight">
          <span className="italic">Intelligence,</span>
          <span className="font-normal ml-2">Quantified.</span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground font-light">
          {formatCurrency(metrics.totalAnnualValue)} in AI opportunities across {metrics.totalCompanies} portfolio companies.
        </p>
      </motion.div>

      {/* Key Metrics Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
      >
        <MetricCard
          label="Total Value"
          value={formatCurrency(metrics.totalAnnualValue)}
          sublabel="Annual opportunity"
          icon={<DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />}
          highlight
        />
        <MetricCard
          label="Use Cases"
          value={metrics.totalUseCases.toString()}
          sublabel="AI initiatives"
          icon={<Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" />}
        />
        <MetricCard
          label="Cost Savings"
          value={formatCurrency(metrics.totalCostBenefit)}
          sublabel={`${((metrics.totalCostBenefit / metrics.totalAnnualValue) * 100).toFixed(0)}% of total`}
          icon={<TrendingDown className="h-4 w-4 sm:h-5 sm:w-5" />}
          color="emerald"
        />
        <MetricCard
          label="Revenue Growth"
          value={formatCurrency(metrics.totalRevenueBenefit)}
          sublabel={`${((metrics.totalRevenueBenefit / metrics.totalAnnualValue) * 100).toFixed(0)}% of total`}
          icon={<TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />}
          color="blue"
        />
      </motion.div>

      {/* Value Breakdown Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-2 gap-4 md:gap-6"
      >
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
              <PieChart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Value Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 sm:h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={valueBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {valueBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {valueBreakdownData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Use Cases */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Top 10 Use Cases by Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
              {portfolioAnalytics?.topUseCases.map((uc, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => onSelectCompany(uc.company)}
                >
                  <span className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold",
                    i < 3 ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{uc.name}</p>
                    <p className="text-xs text-muted-foreground">{uc.company}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary whitespace-nowrap">
                    {formatCurrency(uc.value)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-md mx-auto px-4"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-11 sm:h-12 bg-muted/30 border-border/50 rounded-xl"
          />
        </div>
      </motion.div>

      {/* Company Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-lg sm:text-xl font-semibold mb-4 px-1">
          Portfolio Companies ({filteredAssessments.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {filteredAssessments.map((assessment, index) => {
            const dashboard = assessment.analysis.executiveDashboard;
            const useCases = getStepData<AIUseCase>(assessment, 'AI Use Case Generation');
            
            return (
              <motion.div
                key={assessment.companyName}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
              >
                <Card 
                  className="group cursor-pointer border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full"
                  onClick={() => { console.log("Clicked:", assessment.companyName); onSelectCompany(assessment.companyName); }}
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-primary/10">
                        <span className="text-base sm:text-lg font-semibold text-primary/70">
                          {assessment.companyName.charAt(0)}
                        </span>
                      </div>
                      {index < 3 && (
                        <Badge variant="secondary" className="text-xs font-normal">
                          #{index + 1}
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="font-medium text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1 text-sm sm:text-base">
                      {assessment.companyName}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                      {useCases.length} use cases
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <span className="text-base sm:text-lg font-semibold text-primary">
                        {formatCurrency(dashboard.totalAnnualValue)}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ 
  label, 
  value, 
  sublabel, 
  icon,
  highlight = false,
  color,
}: { 
  label: string; 
  value: string; 
  sublabel: string; 
  icon: React.ReactNode;
  highlight?: boolean;
  color?: 'emerald' | 'blue' | 'purple' | 'orange';
}) {
  const colorClasses = {
    emerald: 'text-emerald-600 dark:text-emerald-400',
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    orange: 'text-orange-600 dark:text-orange-400',
  };

  return (
    <Card className={cn("border-border/50", highlight && "border-primary/30 bg-primary/5")}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center gap-2 text-muted-foreground mb-2 sm:mb-3">
          {icon}
          <span className="text-xs sm:text-sm font-medium truncate">{label}</span>
        </div>
        <div className={cn(
          "text-xl sm:text-2xl md:text-3xl font-semibold mb-1",
          color ? colorClasses[color] : (highlight ? "text-primary" : "text-foreground")
        )}>
          {value}
        </div>
        <div className="text-xs text-muted-foreground truncate">{sublabel}</div>
      </CardContent>
    </Card>
  );
}

// Company Detail View with all 8 sections
function CompanyDetail({ companyName, onBack }: { companyName: string; onBack: () => void }) {
  const { assessment, loading, error } = useCompanyAssessment(companyName);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedUseCase, setExpandedUseCase] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-center">
          <Building2 className="h-12 w-12 text-primary/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
        <p className="text-muted-foreground mb-4">{error || 'Assessment not found'}</p>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Portfolio
        </Button>
      </div>
    );
  }

  // Extract all data sections
  const dashboard = assessment.analysis.executiveDashboard;
  const themes = getStepData<StrategicTheme>(assessment, 'Strategic Anchoring & Business Drivers');
  const kpis = getStepData<BusinessKPI>(assessment, 'Business Function Inventory & KPI Baselines');
  const frictions = getStepData<FrictionPoint>(assessment, 'Friction Point Mapping');
  const useCases = getStepData<AIUseCase>(assessment, 'AI Use Case Generation');
  const benefits = getStepData<BenefitQuantification>(assessment, 'Benefits Quantification by Driver');
  const effort = getStepData<EffortTokenModel>(assessment, 'Effort & Token Modeling');
  const roadmap = getStepData<PriorityRoadmap>(assessment, 'Priority Scoring & Roadmap');

  // Calculate totals
  const totalFrictionCost = frictions.reduce((sum, f) => sum + parseCurrency(f["Estimated Annual Cost ($)"]), 0);
  const totalTokenCost = effort.reduce((sum, e) => sum + parseCurrency(e["Annual Token Cost ($)"] || "0"), 0);

  // Group use cases by function
  const useCasesByFunction = useCases.reduce((acc, uc) => {
    const func = uc.Function || 'Other';
    if (!acc[func]) acc[func] = [];
    acc[func].push(uc);
    return acc;
  }, {} as Record<string, AIUseCase[]>);

  // Priority tier counts
  const tierCounts = roadmap.reduce((acc, r) => {
    const tier = r["Priority Tier"] || 'Medium';
    acc[tier] = (acc[tier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Back Button */}
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Portfolio
        </Button>
      </motion.div>

      {/* Company Header */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/5 via-background to-background rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-border/50"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
              <span className="text-xl sm:text-2xl font-bold text-primary">
                {companyName.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground">{companyName}</h1>
              <p className="text-sm sm:text-base text-muted-foreground">AI Transformation Assessment</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Badge variant="outline" className="text-sm sm:text-lg px-3 sm:px-4 py-1.5 sm:py-2 font-semibold text-primary border-primary/30">
              {formatCurrency(dashboard.totalAnnualValue)}
            </Badge>
            <Badge variant="secondary" className="text-sm sm:text-lg px-3 sm:px-4 py-1.5 sm:py-2">
              {useCases.length} Use Cases
            </Badge>
          </div>
        </div>

        {/* Value Breakdown Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mt-6 md:mt-8">
          <ValueCard label="Cost Reduction" value={dashboard.totalCostBenefit} color="emerald" />
          <ValueCard label="Revenue Growth" value={dashboard.totalRevenueBenefit} color="blue" />
          <ValueCard label="Risk Mitigation" value={dashboard.totalRiskBenefit} color="purple" />
          <ValueCard label="Friction Cost" value={totalFrictionCost} color="orange" />
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto -mx-3 px-3 pb-2">
            <TabsList className="bg-muted/30 p-1 rounded-xl inline-flex min-w-max">
              <TabsTrigger value="overview" className="rounded-lg text-xs sm:text-sm px-3 sm:px-4">
                <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="strategic" className="rounded-lg text-xs sm:text-sm px-3 sm:px-4">
                <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                Strategic
              </TabsTrigger>
              <TabsTrigger value="friction" className="rounded-lg text-xs sm:text-sm px-3 sm:px-4">
                <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                Friction
              </TabsTrigger>
              <TabsTrigger value="usecases" className="rounded-lg text-xs sm:text-sm px-3 sm:px-4">
                <Lightbulb className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                Use Cases
              </TabsTrigger>
              <TabsTrigger value="benefits" className="rounded-lg text-xs sm:text-sm px-3 sm:px-4">
                <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                Benefits
              </TabsTrigger>
              <TabsTrigger value="effort" className="rounded-lg text-xs sm:text-sm px-3 sm:px-4">
                <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                Effort
              </TabsTrigger>
              <TabsTrigger value="roadmap" className="rounded-lg text-xs sm:text-sm px-3 sm:px-4">
                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                Roadmap
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            {/* Executive Summary */}
            {assessment.analysis.summary && (
              <Card className="border-border/50">
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Executive Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                    {assessment.analysis.summary}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Top 5 Use Cases */}
            <Card className="border-border/50">
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Top 5 Use Cases by Priority
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboard.topUseCases?.slice(0, 5).map((uc, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <span className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold shrink-0",
                        i < 3 ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      )}>
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base truncate">{uc.useCase}</p>
                        <p className="text-xs text-muted-foreground">Priority Score: {uc.priorityScore}</p>
                      </div>
                      <span className="text-sm sm:text-base font-semibold text-primary whitespace-nowrap">
                        {formatCurrency(uc.annualValue)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Strategic Tab */}
          <TabsContent value="strategic" className="space-y-4 sm:space-y-6">
            {/* Strategic Themes */}
            {themes.length > 0 && (
              <Card className="border-border/50">
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
                    <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Strategic Themes ({themes.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {themes.map((theme, i) => (
                      <div key={i} className="p-4 bg-muted/30 rounded-xl border border-border/30">
                        <h4 className="font-semibold text-sm sm:text-base mb-3">{theme["Strategic Theme"]}</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="outline" className="text-xs">
                            Primary: {theme["Primary Driver"]}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Secondary: {theme["Secondary Driver"]}
                          </Badge>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                          <div className="p-3 bg-background/50 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1 font-medium">Current State</p>
                            <p className="text-sm">{theme["Current State"]}</p>
                          </div>
                          <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                            <p className="text-xs text-primary mb-1 font-medium">Target State</p>
                            <p className="text-sm">{theme["Target State"]}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Business KPIs */}
            {kpis.length > 0 && (
              <Card className="border-border/50">
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Business Function KPIs ({kpis.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <table className="w-full min-w-[500px]">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Function</th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">KPI</th>
                          <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground">Baseline</th>
                          <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground">Target</th>
                        </tr>
                      </thead>
                      <tbody>
                        {kpis.map((kpi, i) => (
                          <tr key={i} className="border-b border-border/30">
                            <td className="py-2 px-3 text-sm">{kpi.Function}</td>
                            <td className="py-2 px-3 text-sm font-medium">{kpi["KPI Name"]}</td>
                            <td className="py-2 px-3 text-sm text-right">{kpi["Baseline Value"]}</td>
                            <td className="py-2 px-3 text-sm text-right text-primary font-medium">{kpi["Target Value"]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Friction Tab */}
          <TabsContent value="friction" className="space-y-4 sm:space-y-6">
            <Card className="border-border/50">
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-base sm:text-lg font-medium flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                    Friction Points ({frictions.length})
                  </div>
                  <Badge variant="outline" className="text-orange-600 border-orange-500/30">
                    {formatCurrency(totalFrictionCost)} Total Cost
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {frictions.map((friction, i) => (
                    <div key={i} className="p-4 bg-muted/30 rounded-xl border border-border/30">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm sm:text-base">{friction["Friction Point"]}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {friction.Function} → {friction["Sub-Function"]}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={cn("text-xs border", SEVERITY_STYLES[friction.Severity] || SEVERITY_STYLES.Medium)}>
                            {friction.Severity}
                          </Badge>
                          <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                            {friction["Estimated Annual Cost ($)"]}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">Impact: {friction["Primary Driver Impact"]}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Use Cases Tab */}
          <TabsContent value="usecases" className="space-y-4 sm:space-y-6">
            {Object.entries(useCasesByFunction).map(([func, cases]) => (
              <Card key={func} className="border-border/50">
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    {func} ({cases.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cases.map((uc) => {
                      const benefit = benefits.find(b => b.ID === uc.ID);
                      const roadmapItem = roadmap.find(r => r.ID === uc.ID);
                      const totalValue = benefit ? 
                        parseCurrency(benefit["Cost Benefit ($)"]) + 
                        parseCurrency(benefit["Revenue Benefit ($)"]) + 
                        parseCurrency(benefit["Risk Benefit ($)"]) : 0;
                      const isExpanded = expandedUseCase === uc.ID;

                      return (
                        <div 
                          key={uc.ID} 
                          className="border border-border/30 rounded-xl overflow-hidden"
                        >
                          <div 
                            className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                            onClick={() => setExpandedUseCase(isExpanded ? null : uc.ID)}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <Badge variant="secondary" className="text-xs">{uc.ID}</Badge>
                                  {roadmapItem && (
                                    <Badge className={cn(
                                      "text-xs border",
                                      TIER_STYLES[roadmapItem["Priority Tier"]]?.bg,
                                      TIER_STYLES[roadmapItem["Priority Tier"]]?.text,
                                      TIER_STYLES[roadmapItem["Priority Tier"]]?.border,
                                    )}>
                                      {roadmapItem["Priority Tier"]}
                                    </Badge>
                                  )}
                                </div>
                                <h4 className="font-semibold text-sm sm:text-base mb-1">{uc["Use Case Name"]}</h4>
                                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{uc.Description}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-lg sm:text-xl font-bold text-primary">{formatCurrency(totalValue)}</p>
                                <ChevronDown className={cn(
                                  "h-4 w-4 text-muted-foreground mx-auto mt-1 transition-transform",
                                  isExpanded && "rotate-180"
                                )} />
                              </div>
                            </div>
                          </div>
                          
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-border/30"
                              >
                                <div className="p-4 bg-muted/20 space-y-4">
                                  {/* AI Primitives */}
                                  {uc["AI Primitives"] && (
                                    <div>
                                      <p className="text-xs font-medium text-muted-foreground mb-2">AI Primitives</p>
                                      <div className="flex flex-wrap gap-2">
                                        {uc["AI Primitives"].split(',').map((p, i) => (
                                          <Badge key={i} variant="outline" className="text-xs bg-primary/5">
                                            <Brain className="h-3 w-3 mr-1" />
                                            {p.trim()}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Target Friction */}
                                  {uc["Target Friction"] && (
                                    <div>
                                      <p className="text-xs font-medium text-muted-foreground mb-1">Target Friction</p>
                                      <p className="text-sm">{uc["Target Friction"]}</p>
                                    </div>
                                  )}

                                  {/* Human in the Loop */}
                                  {uc["Human-in-the-Loop Checkpoint"] && (
                                    <div>
                                      <p className="text-xs font-medium text-muted-foreground mb-1">Human-in-the-Loop</p>
                                      <p className="text-sm">{uc["Human-in-the-Loop Checkpoint"]}</p>
                                    </div>
                                  )}

                                  {/* Benefits Breakdown */}
                                  {benefit && (
                                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/30">
                                      <div className="text-center p-2 bg-emerald-500/10 rounded-lg">
                                        <p className="text-xs text-muted-foreground mb-1">Cost Savings</p>
                                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                          {benefit["Cost Benefit ($)"]}
                                        </p>
                                      </div>
                                      <div className="text-center p-2 bg-blue-500/10 rounded-lg">
                                        <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                                        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                          {benefit["Revenue Benefit ($)"]}
                                        </p>
                                      </div>
                                      <div className="text-center p-2 bg-purple-500/10 rounded-lg">
                                        <p className="text-xs text-muted-foreground mb-1">Risk</p>
                                        <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                                          {benefit["Risk Benefit ($)"]}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Benefits Tab */}
          <TabsContent value="benefits" className="space-y-4 sm:space-y-6">
            <Card className="border-border/50">
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Benefits Quantification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">ID</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Use Case</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Cost</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Revenue</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Risk</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {benefits.map((b, i) => {
                        const total = parseCurrency(b["Cost Benefit ($)"]) + 
                          parseCurrency(b["Revenue Benefit ($)"]) + 
                          parseCurrency(b["Risk Benefit ($)"]);
                        return (
                          <tr key={i} className="border-b border-border/30 hover:bg-muted/30">
                            <td className="py-2 px-2 text-xs sm:text-sm">{b.ID}</td>
                            <td className="py-2 px-2 text-xs sm:text-sm font-medium max-w-[200px] truncate">{b["Use Case"]}</td>
                            <td className="py-2 px-2 text-xs sm:text-sm text-right text-emerald-600 dark:text-emerald-400">{b["Cost Benefit ($)"]}</td>
                            <td className="py-2 px-2 text-xs sm:text-sm text-right text-blue-600 dark:text-blue-400">{b["Revenue Benefit ($)"]}</td>
                            <td className="py-2 px-2 text-xs sm:text-sm text-right text-purple-600 dark:text-purple-400">{b["Risk Benefit ($)"]}</td>
                            <td className="py-2 px-2 text-xs sm:text-sm text-right font-semibold">{formatCurrency(total)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-border bg-muted/30">
                        <td colSpan={2} className="py-2 px-2 text-sm font-semibold">Total</td>
                        <td className="py-2 px-2 text-sm text-right font-semibold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(dashboard.totalCostBenefit)}
                        </td>
                        <td className="py-2 px-2 text-sm text-right font-semibold text-blue-600 dark:text-blue-400">
                          {formatCurrency(dashboard.totalRevenueBenefit)}
                        </td>
                        <td className="py-2 px-2 text-sm text-right font-semibold text-purple-600 dark:text-purple-400">
                          {formatCurrency(dashboard.totalRiskBenefit)}
                        </td>
                        <td className="py-2 px-2 text-sm text-right font-bold text-primary">
                          {formatCurrency(dashboard.totalAnnualValue)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Effort Tab */}
          <TabsContent value="effort" className="space-y-4 sm:space-y-6">
            <Card className="border-border/50">
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-base sm:text-lg font-medium flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Effort & Token Model
                  </div>
                  <Badge variant="outline">
                    {formatCurrency(totalTokenCost)} Annual Token Cost
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">ID</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Use Case</th>
                        <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Effort</th>
                        <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Data Ready</th>
                        <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Integration</th>
                        <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">TTV</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Token Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {effort.map((e, i) => (
                        <tr key={i} className="border-b border-border/30 hover:bg-muted/30">
                          <td className="py-2 px-2 text-xs sm:text-sm">{e.ID}</td>
                          <td className="py-2 px-2 text-xs sm:text-sm font-medium max-w-[200px] truncate">{e["Use Case"]}</td>
                          <td className="py-2 px-2 text-center">
                            <EffortBadge value={e["Effort Score (1-5)"]} />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <EffortBadge value={e["Data Readiness (1-5)"]} />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <EffortBadge value={e["Integration Complexity (1-5)"]} />
                          </td>
                          <td className="py-2 px-2 text-xs sm:text-sm text-center">
                            {e["Time-to-Value (months)"]}mo
                          </td>
                          <td className="py-2 px-2 text-xs sm:text-sm text-right">{e["Annual Token Cost ($)"]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roadmap Tab */}
          <TabsContent value="roadmap" className="space-y-4 sm:space-y-6">
            {/* Priority Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map(tier => {
                const count = tierCounts[tier] || 0;
                const style = TIER_STYLES[tier];
                return (
                  <Card key={tier} className={cn("border", style?.border)}>
                    <CardContent className={cn("p-4 text-center", style?.bg)}>
                      <p className={cn("text-2xl sm:text-3xl font-bold", style?.text)}>{count}</p>
                      <p className={cn("text-sm", style?.text)}>{tier}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Roadmap Table */}
            <Card className="border-border/50">
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Priority Roadmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">ID</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Use Case</th>
                        <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Value</th>
                        <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Effort</th>
                        <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">TTV</th>
                        <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Priority</th>
                        <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Tier</th>
                        <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Phase</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roadmap
                        .sort((a, b) => (b["Priority Score (0-100)"] || 0) - (a["Priority Score (0-100)"] || 0))
                        .map((r, i) => {
                          const style = TIER_STYLES[r["Priority Tier"]] || TIER_STYLES.Medium;
                          return (
                            <tr key={i} className="border-b border-border/30 hover:bg-muted/30">
                              <td className="py-2 px-2 text-xs sm:text-sm">{r.ID}</td>
                              <td className="py-2 px-2 text-xs sm:text-sm font-medium max-w-[200px] truncate">{r["Use Case"]}</td>
                              <td className="py-2 px-2 text-xs sm:text-sm text-center">{r["Value Score (0-40)"]}/40</td>
                              <td className="py-2 px-2 text-xs sm:text-sm text-center">{r["Effort Score (0-30)"]}/30</td>
                              <td className="py-2 px-2 text-xs sm:text-sm text-center">{r["TTV Score (0-30)"]}/30</td>
                              <td className="py-2 px-2 text-xs sm:text-sm text-center font-bold">{r["Priority Score (0-100)"]}</td>
                              <td className="py-2 px-2 text-center">
                                <Badge className={cn("text-xs border", style.bg, style.text, style.border)}>
                                  {r["Priority Tier"]}
                                </Badge>
                              </td>
                              <td className="py-2 px-2 text-center">
                                <Badge variant="outline" className="text-xs">{r["Recommended Phase"]}</Badge>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

// Value Card Component
function ValueCard({ label, value, color }: { label: string; value: number; color: 'emerald' | 'blue' | 'purple' | 'orange' }) {
  const colorClasses = {
    emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-500/10',
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-500/10',
    orange: 'text-orange-600 dark:text-orange-400 bg-orange-500/10',
  };

  return (
    <div className={cn("rounded-lg sm:rounded-xl p-3 sm:p-4 border border-border/50", colorClasses[color])}>
      <p className="text-xs sm:text-sm text-muted-foreground mb-1">{label}</p>
      <p className={cn("text-lg sm:text-xl font-semibold", colorClasses[color].split(' ')[0])}>
        {formatCurrency(value)}
      </p>
    </div>
  );
}

// Effort Badge Component
function EffortBadge({ value }: { value: number | undefined }) {
  if (!value) return <span className="text-muted-foreground">-</span>;
  
  const colors = {
    1: 'bg-green-500/20 text-green-600 dark:text-green-400',
    2: 'bg-green-500/15 text-green-600 dark:text-green-400',
    3: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
    4: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
    5: 'bg-red-500/20 text-red-600 dark:text-red-400',
  };

  return (
    <span className={cn("px-2 py-0.5 rounded text-xs font-medium", colors[value as keyof typeof colors] || colors[3])}>
      {value}/5
    </span>
  );
}

// Main Use Cases Page
export default function UseCases() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {selectedCompany ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <CompanyDetail 
              companyName={selectedCompany} 
              onBack={() => setSelectedCompany(null)} 
            />
          </motion.div>
        ) : (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <PortfolioOverview onSelectCompany={setSelectedCompany} />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
