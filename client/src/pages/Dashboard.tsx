import Layout from "@/components/Layout";
import { CompanyLogo } from "@/components/CompanyLogo";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  TrendingUp,
  Trophy,
  Zap,
  Target,
  DollarSign,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const QUADRANT_COLORS = {
  Champions: "#00B34A",
  "Quick Wins": "#00A3E0",
  Strategic: "#7C3AED",
  Foundations: "#999999",
};

const CATEGORY_COLORS: Record<string, string> = {
  "Digital Infrastructure": "#003B73",
  "Energy & Energy Transition": "#00B34A",
  "Transport & Logistics": "#00A3E0",
  "Social Infrastructure": "#7C3AED",
  "Real Estate": "#F59E0B",
};

function formatCurrency(value: number): string {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(value));
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "primary",
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: number;
  color?: string;
}) {
  return (
    <Card className="blueally-metric-card">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl md:text-3xl font-bold financial-number">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div
            className={`p-3 rounded-lg ${
              color === "green"
                ? "bg-green-100 dark:bg-green-900/30"
                : color === "blue"
                ? "bg-blue-100 dark:bg-blue-900/30"
                : color === "purple"
                ? "bg-purple-100 dark:bg-purple-900/30"
                : "bg-primary/10"
            }`}
          >
            <Icon
              className={`w-5 h-5 ${
                color === "green"
                  ? "text-green-600 dark:text-green-400"
                  : color === "blue"
                  ? "text-blue-600 dark:text-blue-400"
                  : color === "purple"
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-primary"
              }`}
            />
          </div>
        </div>
        {trend !== undefined && (
          <div className="mt-3 flex items-center gap-1">
            <ArrowUpRight
              className={`w-4 h-4 ${
                trend >= 0 ? "text-green-500" : "text-red-500 rotate-90"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                trend >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {trend >= 0 ? "+" : ""}
              {trend.toFixed(1)}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function QuadrantCard({
  name,
  count,
  total,
  color,
}: {
  name: string;
  count: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm font-medium">{name}</span>
        </div>
        <span className="text-sm font-bold">{count}</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}

export default function Dashboard() {
  const { data: metrics, isLoading } = trpc.portfolio.metrics.useQuery();
  const { data: companies } = trpc.companies.list.useQuery();

  if (isLoading) {
    return (
      <Layout title="Executive Summary" subtitle="Portfolio AI Intelligence Overview">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="blueally-metric-card">
              <CardContent className="p-5">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </Layout>
    );
  }

  if (!metrics) {
    return (
      <Layout title="Executive Summary">
        <div className="text-center py-12">
          <p className="text-muted-foreground">No portfolio data available.</p>
        </div>
      </Layout>
    );
  }

  // Prepare chart data
  const quadrantData = [
    { name: "Champions", value: metrics.championsCount, color: QUADRANT_COLORS.Champions },
    { name: "Quick Wins", value: metrics.quickWinsCount, color: QUADRANT_COLORS["Quick Wins"] },
    { name: "Strategic", value: metrics.strategicCount, color: QUADRANT_COLORS.Strategic },
    { name: "Foundations", value: metrics.foundationsCount, color: QUADRANT_COLORS.Foundations },
  ];

  const categoryData = Object.entries(metrics.byCategory || {}).map(([name, count]) => ({
    name: name.split(" ")[0], // Shorten for display
    fullName: name,
    count,
    color: CATEGORY_COLORS[name] || "#999",
  }));

  const themeData = Object.entries(metrics.byTheme || {}).map(([name, count]) => ({
    name,
    count,
  }));

  return (
    <Layout
      title="Executive Summary"
      subtitle="Portfolio AI Intelligence Overview"
    >
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard
          title="Portfolio Companies"
          value={metrics.totalCompanies}
          subtitle="Active investments"
          icon={Building2}
          color="blue"
        />
        <MetricCard
          title="Total Adjusted EBITDA Impact"
          value={formatCurrency(metrics.totalAdjustedEbitda)}
          subtitle="AI-enabled value creation"
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title="Champions"
          value={metrics.championsCount}
          subtitle={`${formatCurrency(metrics.championsValue)} total value`}
          icon={Trophy}
          color="green"
        />
        <MetricCard
          title="Avg Priority Score"
          value={metrics.avgPriorityScore.toFixed(1)}
          subtitle="Out of 10.0"
          icon={Target}
          color="purple"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <MetricCard
          title="Avg Value Score"
          value={metrics.avgValueScore.toFixed(1)}
          icon={TrendingUp}
        />
        <MetricCard
          title="Avg Readiness Score"
          value={metrics.avgReadinessScore.toFixed(1)}
          icon={Zap}
        />
        <MetricCard
          title="Total Portfolio EBITDA"
          value={formatCurrency(metrics.totalEbitda)}
          icon={BarChart3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Quadrant Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Quadrant Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={quadrantData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {quadrantData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [value, "Companies"]}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3 w-full">
                {quadrantData.map((q) => (
                  <QuadrantCard
                    key={q.name}
                    name={q.name}
                    count={q.value}
                    total={metrics.totalCompanies}
                    color={q.color}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Investment Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <XAxis type="number" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={80}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value: number, name: string, props: any) => [
                      value,
                      props.payload.fullName,
                    ]}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top 10 Companies */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Top 10 Companies by Adjusted Priority
          </CardTitle>
          <Link href="/matrix">
            <Button variant="outline" size="sm" className="gap-2">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                    Rank
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                    Company
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden md:table-cell">
                    Category
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">
                    Quadrant
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
                    Priority
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
                    Adj. Priority
                  </th>
                </tr>
              </thead>
              <tbody>
                {metrics.topCompanies?.map((company: any, index: number) => (
                  <tr
                    key={company.id}
                    className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-2">
                      <span className="font-bold text-muted-foreground">
                        #{index + 1}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <Link href={`/company/${company.id}`}>
                        <div className="flex items-center gap-3 hover:text-primary cursor-pointer">
                          <CompanyLogo companyName={company.companyName} size="sm" />
                          <span className="font-medium">
                            {company.companyName}
                          </span>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 px-2 hidden md:table-cell">
                      <Badge
                        variant="outline"
                        style={{
                          borderColor:
                            CATEGORY_COLORS[company.investmentCategory] || "#999",
                          color:
                            CATEGORY_COLORS[company.investmentCategory] || "#999",
                        }}
                      >
                        {company.investmentCategory.split(" ")[0]}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <Badge
                        style={{
                          backgroundColor:
                            QUADRANT_COLORS[
                              company.quadrant as keyof typeof QUADRANT_COLORS
                            ] + "20",
                          color:
                            QUADRANT_COLORS[
                              company.quadrant as keyof typeof QUADRANT_COLORS
                            ],
                          borderColor:
                            QUADRANT_COLORS[
                              company.quadrant as keyof typeof QUADRANT_COLORS
                            ],
                        }}
                        variant="outline"
                      >
                        {company.quadrant}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-right font-medium financial-number">
                      {Number(company.priorityScore).toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-right font-bold financial-number text-green-600 dark:text-green-400">
                      {formatCurrency(Number(company.adjustedPriority))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Link href="/matrix">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold">Value-Readiness Matrix</h3>
                <p className="text-sm text-muted-foreground">
                  Visualize company positioning
                </p>
              </div>
              <ArrowRight className="w-5 h-5 ml-auto text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/portfolio">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold">Portfolio Amplification</h3>
                <p className="text-sm text-muted-foreground">
                  Cross-portfolio synergies
                </p>
              </div>
              <ArrowRight className="w-5 h-5 ml-auto text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/ai">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-sm text-muted-foreground">
                  Natural language insights
                </p>
              </div>
              <ArrowRight className="w-5 h-5 ml-auto text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </Layout>
  );
}
