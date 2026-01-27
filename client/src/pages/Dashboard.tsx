import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Layout from "@/components/Layout";
import { CompanyLogo } from "@/components/CompanyLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Zap,
  Target,
  Layers,
  TrendingUp,
  DollarSign,
  Building2,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const QUADRANT_CONFIG = {
  Champions: { color: "oklch(0.65 0.18 145)", icon: Trophy },
  "Quick Wins": { color: "oklch(0.60 0.18 250)", icon: Zap },
  Strategic: { color: "oklch(0.60 0.15 300)", icon: Target },
  Foundations: { color: "oklch(0.45 0.02 250)", icon: Layers },
};

const THEME_COLORS: Record<string, string> = {
  "Revenue Growth": "oklch(0.70 0.18 145)",
  "Margin Expansion": "oklch(0.70 0.15 200)",
  "Cost Cutting": "oklch(0.65 0.18 250)",
};

const CATEGORY_COLORS: Record<string, string> = {
  "Digital Infrastructure": "oklch(0.65 0.18 250)",
  "Energy & Energy Transition": "oklch(0.70 0.18 145)",
  "Transport & Logistics": "oklch(0.70 0.15 200)",
  "Social Infrastructure": "oklch(0.65 0.15 300)",
  "Real Estate": "oklch(0.70 0.15 45)",
};

type Company = {
  id: number;
  companyName: string;
  investmentCategory: string;
  valueScore: string | null;
  readinessScore: string | null;
  priorityScore: string | null;
  adjustedEbitda: string | null;
  adjustedPriority: string | null;
  quadrant: string | null;
  theme: string | null;
  track: string | null;
};

export default function Dashboard() {
  const { data: companies = [], isLoading } = trpc.companies.list.useQuery();
  const { data: metrics } = trpc.portfolio.metrics.useQuery();

  // Calculate metrics
  const totalCompanies = companies.length;
  const totalEbitda = companies.reduce((sum: number, c: Company) => 
    sum + parseFloat(c.adjustedEbitda || "0"), 0
  );
  const totalPriority = companies.reduce((sum: number, c: Company) => 
    sum + parseFloat(c.adjustedPriority || "0"), 0
  );

  // Quadrant distribution
  const quadrantCounts = companies.reduce((acc: Record<string, number>, c: Company) => {
    if (c.quadrant) {
      acc[c.quadrant] = (acc[c.quadrant] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const quadrantData = Object.entries(QUADRANT_CONFIG).map(([name, config]) => ({
    name,
    value: quadrantCounts[name] || 0,
    color: config.color,
  }));

  // Theme distribution
  const themeCounts = companies.reduce((acc: Record<string, number>, c: Company) => {
    if (c.theme) {
      acc[c.theme] = (acc[c.theme] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const themeData = Object.entries(THEME_COLORS).map(([name, color]) => ({
    name,
    value: themeCounts[name] || 0,
    color,
  }));

  // Category distribution
  const categoryCounts = companies.reduce((acc: Record<string, number>, c: Company) => {
    acc[c.investmentCategory] = (acc[c.investmentCategory] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Top 10 companies by adjusted priority
  const top10 = [...companies]
    .sort((a: Company, b: Company) => 
      parseFloat(b.adjustedPriority || "0") - parseFloat(a.adjustedPriority || "0")
    )
    .slice(0, 10);

  // Champions
  const champions = companies.filter((c: Company) => c.quadrant === "Champions");

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  if (isLoading) {
    return (
      <Layout title="Executive Dashboard" subtitle="Loading portfolio data...">
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading portfolio intelligence...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="" subtitle="">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif italic tracking-tight text-4xl md:text-5xl mb-2">
              Executive<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 not-italic font-semibold">Dashboard</span>
            </h1>
            <p className="text-muted-foreground text-lg font-light max-w-lg">
              The complete view of your portfolio's AI potential. 
              Clear numbers. Clear priorities. Clear action.
            </p>
          </div>
          <Link href="/matrix">
            <Button className="relative overflow-hidden rounded-lg px-6 py-3 font-medium bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg hover:shadow-xl transition-all">
              View Matrix
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            className="bg-card/90 backdrop-blur-xl rounded-xl border border-border/50 p-6 hover:border-primary/30 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/15 text-primary">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-sm text-muted-foreground">Portfolio Companies</span>
            </div>
            <p className="text-4xl font-bold">{totalCompanies}</p>
            <p className="text-sm text-muted-foreground mt-1">Active investments</p>
          </motion.div>

          <motion.div
            className="bg-card/90 backdrop-blur-xl rounded-xl border border-border/50 p-6 hover:border-primary/30 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/15 text-primary shadow-[0_0_40px_-10px_rgba(34,197,94,0.4)]">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className="text-sm text-muted-foreground">Total EBITDA Impact</span>
            </div>
            <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">{formatCurrency(totalEbitda)}</p>
            <p className="text-sm text-muted-foreground mt-1">Adjusted potential</p>
          </motion.div>

          <motion.div
            className="bg-card/90 backdrop-blur-xl rounded-xl border border-border/50 p-6 hover:border-primary/30 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/15 text-primary shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-sm text-muted-foreground">Total Priority Value</span>
            </div>
            <p className="text-4xl font-bold">{formatCurrency(totalPriority)}</p>
            <p className="text-sm text-muted-foreground mt-1">Portfolio-adjusted</p>
          </motion.div>

          <motion.div
            className="bg-card/90 backdrop-blur-xl rounded-xl border border-border/50 p-6 hover:border-primary/30 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/15 text-primary" style={{ color: QUADRANT_CONFIG.Champions.color }}>
                <Trophy className="w-5 h-5" />
              </div>
              <span className="text-sm text-muted-foreground">Champions</span>
            </div>
            <p className="text-4xl font-bold" style={{ color: QUADRANT_CONFIG.Champions.color }}>
              {champions.length}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Ready for deployment</p>
          </motion.div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quadrant Distribution */}
          <motion.div
            className="bg-card/90 backdrop-blur-xl rounded-xl border border-border/50 p-6 hover:border-primary/30 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Quadrant Distribution</h2>
            </div>
            
            <div className="h-[200px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={quadrantData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {quadrantData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.15 0.01 250)",
                      border: "1px solid oklch(0.25 0.01 250)",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {Object.entries(QUADRANT_CONFIG).map(([name, config]) => {
                const Icon = config.icon;
                const count = quadrantCounts[name] || 0;
                const percentage = totalCompanies > 0 ? (count / totalCompanies) * 100 : 0;
                return (
                  <div key={name} className="flex items-center gap-3">
                    <Icon className="w-4 h-4" style={{ color: config.color }} />
                    <span className="text-sm flex-1">{name}</span>
                    <span className="text-sm font-medium">{count}</span>
                    <div className="w-16">
                      <Progress value={percentage} className="h-1.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Theme Distribution */}
          <motion.div
            className="bg-card/90 backdrop-blur-xl rounded-xl border border-border/50 p-6 hover:border-primary/30 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Value Themes</h2>
            </div>

            <div className="h-[200px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={themeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {themeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.15 0.01 250)",
                      border: "1px solid oklch(0.25 0.01 250)",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {Object.entries(THEME_COLORS).map(([name, color]) => {
                const count = themeCounts[name] || 0;
                const percentage = totalCompanies > 0 ? (count / totalCompanies) * 100 : 0;
                return (
                  <div key={name} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-sm flex-1">{name}</span>
                    <span className="text-sm font-medium">{count}</span>
                    <div className="w-16">
                      <Progress value={percentage} className="h-1.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            className="bg-card/90 backdrop-blur-xl rounded-xl border border-border/50 p-6 hover:border-primary/30 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Investment Categories</h2>
            </div>

            <div className="space-y-4">
              {Object.entries(CATEGORY_COLORS).map(([name, color]) => {
                const count = categoryCounts[name] || 0;
                const percentage = totalCompanies > 0 ? (count / totalCompanies) * 100 : 0;
                return (
                  <div key={name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm">{name}</span>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Top 10 Companies */}
        <motion.div
          className="bg-card/90 backdrop-blur-xl rounded-xl border border-border/50 p-6 hover:border-primary/30 transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Top 10 Companies by Priority</h2>
            </div>
            <Link href="/portfolio">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                View All
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Rank</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Company</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Quadrant</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Value</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Readiness</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Adj. Priority</th>
                </tr>
              </thead>
              <tbody>
                {top10.map((company: Company, index: number) => (
                  <tr 
                    key={company.id} 
                    className="border-b border-border/30 hover:bg-card/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
                        index < 3 ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Link href={`/company/${company.id}`}>
                        <div className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors">
                          <CompanyLogo companyName={company.companyName} size="sm" />
                          <span className="font-medium">{company.companyName}</span>
                        </div>
                      </Link>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell">
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        style={{ 
                          borderColor: CATEGORY_COLORS[company.investmentCategory],
                          color: CATEGORY_COLORS[company.investmentCategory]
                        }}
                      >
                        {company.investmentCategory}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      {company.quadrant && (
                        <Badge 
                          className="text-xs"
                          style={{ 
                            backgroundColor: `color-mix(in oklch, ${QUADRANT_CONFIG[company.quadrant as keyof typeof QUADRANT_CONFIG]?.color || "gray"} 20%, transparent)`,
                            color: QUADRANT_CONFIG[company.quadrant as keyof typeof QUADRANT_CONFIG]?.color
                          }}
                        >
                          {company.quadrant}
                        </Badge>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right font-medium">
                      {parseFloat(company.valueScore || "0").toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-right font-medium">
                      {parseFloat(company.readinessScore || "0").toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-bold text-primary">
                        {formatCurrency(parseFloat(company.adjustedPriority || "0"))}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/matrix">
            <motion.div
              className="bg-card/90 backdrop-blur-xl rounded-xl border border-border/50 p-6 hover:border-primary/30 transition-all cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/15 text-primary group-hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] transition-all">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Value-Readiness Matrix</h3>
                  <p className="text-sm text-muted-foreground">Visualize company positioning</p>
                </div>
                <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </motion.div>
          </Link>

          <Link href="/portfolio">
            <motion.div
              className="bg-card/90 backdrop-blur-xl rounded-xl border border-border/50 p-6 hover:border-primary/30 transition-all cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/15 text-primary group-hover:shadow-[0_0_40px_-10px_rgba(34,211,238,0.4)] transition-all">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Portfolio Amplification</h3>
                  <p className="text-sm text-muted-foreground">Cross-portfolio synergies</p>
                </div>
                <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </motion.div>
          </Link>

          <Link href="/ai">
            <motion.div
              className="bg-card/90 backdrop-blur-xl rounded-xl border border-border/50 p-6 hover:border-primary/30 transition-all cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/15 text-primary group-hover:shadow-[0_0_40px_-10px_rgba(34,197,94,0.4)] transition-all">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Assistant</h3>
                  <p className="text-sm text-muted-foreground">Natural language insights</p>
                </div>
                <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
