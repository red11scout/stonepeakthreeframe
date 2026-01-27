import Layout from "@/components/Layout";
import { CompanyLogo } from "@/components/CompanyLogo";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { useMemo } from "react";
import { Link } from "wouter";
import {
  Calendar,
  Zap,
  TrendingUp,
  Target,
  ArrowRight,
  Clock,
  DollarSign,
} from "lucide-react";

const TRACK_COLORS: Record<string, string> = {
  "EBITDA Accelerator": "#003B73",
  "Growth Enabler": "#00A3E0",
  "Exit Multiplier": "#00B34A",
};

const TRACK_ALLOCATIONS = {
  "EBITDA Accelerator": { min: 40, max: 50, default: 45 },
  "Growth Enabler": { min: 30, max: 40, default: 35 },
  "Exit Multiplier": { min: 15, max: 25, default: 20 },
};

const TRACK_DESCRIPTIONS: Record<string, { timeline: string; focus: string; examples: string }> = {
  "EBITDA Accelerator": {
    timeline: "0-12 months",
    focus: "Immediate margin improvement and cost reduction",
    examples: "Process automation, operational efficiency, cost optimization",
  },
  "Growth Enabler": {
    timeline: "12-24 months",
    focus: "Revenue growth and market expansion",
    examples: "Customer analytics, pricing optimization, new market entry",
  },
  "Exit Multiplier": {
    timeline: "24-36+ months",
    focus: "Strategic positioning and multiple expansion",
    examples: "AI capabilities, platform development, competitive moat",
  },
};

function formatCurrency(value: number): string {
  if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

export default function HoldPeriod() {
  const { data: companies, isLoading } = trpc.companies.list.useQuery();

  const trackData = useMemo(() => {
    if (!companies) return [];
    
    const trackMap = new Map<string, { count: number; totalValue: number; companies: any[] }>();
    
    companies.forEach(company => {
      const track = company.track || "Unassigned";
      const existing = trackMap.get(track) || { count: 0, totalValue: 0, companies: [] };
      trackMap.set(track, {
        count: existing.count + 1,
        totalValue: existing.totalValue + Number(company.adjustedPriority || 0),
        companies: [...existing.companies, company],
      });
    });
    
    return Array.from(trackMap.entries())
      .filter(([name]) => name !== "Unassigned")
      .map(([name, data]) => ({
        name,
        count: data.count,
        totalValue: data.totalValue,
        companies: data.companies.sort((a, b) => Number(b.adjustedPriority) - Number(a.adjustedPriority)),
        color: TRACK_COLORS[name] || "#999",
        allocation: TRACK_ALLOCATIONS[name as keyof typeof TRACK_ALLOCATIONS] || { min: 0, max: 0, default: 0 },
        description: TRACK_DESCRIPTIONS[name] || { timeline: "", focus: "", examples: "" },
      }));
  }, [companies]);

  const totalValue = useMemo(() => {
    return trackData.reduce((sum, track) => sum + track.totalValue, 0);
  }, [trackData]);

  const pieData = useMemo(() => {
    return trackData.map(track => ({
      name: track.name,
      value: track.count,
      color: track.color,
    }));
  }, [trackData]);

  if (isLoading) {
    return (
      <Layout title="Hold Period Planning" subtitle="Three-track value capture model">
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
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

  return (
    <Layout
      title="Hold Period Planning"
      subtitle="Three-track value capture model with phase-gate timeline"
    >
      {/* Track Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {trackData.map((track) => (
          <Card key={track.name} className="blueally-metric-card overflow-hidden">
            <div className="h-1" style={{ backgroundColor: track.color }} />
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg" style={{ color: track.color }}>
                    {track.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {track.description.timeline}
                  </p>
                </div>
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${track.color}20` }}>
                  {track.name === "EBITDA Accelerator" && (
                    <Zap className="w-5 h-5" style={{ color: track.color }} />
                  )}
                  {track.name === "Growth Enabler" && (
                    <TrendingUp className="w-5 h-5" style={{ color: track.color }} />
                  )}
                  {track.name === "Exit Multiplier" && (
                    <Target className="w-5 h-5" style={{ color: track.color }} />
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Companies</span>
                  <span className="font-bold text-xl">{track.count}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Value</span>
                  <span className="font-bold text-green-600">{formatCurrency(track.totalValue)}</span>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Target Allocation</span>
                    <span>{track.allocation.min}-{track.allocation.max}%</span>
                  </div>
                  <Progress
                    value={track.allocation.default}
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Timeline Visualization */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Hold Period Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline bar */}
            <div className="h-4 rounded-full overflow-hidden flex">
              <div
                className="h-full"
                style={{ width: "33%", backgroundColor: TRACK_COLORS["EBITDA Accelerator"] }}
              />
              <div
                className="h-full"
                style={{ width: "33%", backgroundColor: TRACK_COLORS["Growth Enabler"] }}
              />
              <div
                className="h-full"
                style={{ width: "34%", backgroundColor: TRACK_COLORS["Exit Multiplier"] }}
              />
            </div>

            {/* Timeline labels */}
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-muted-foreground">Year 0</span>
              <span className="text-muted-foreground">Year 1</span>
              <span className="text-muted-foreground">Year 2</span>
              <span className="text-muted-foreground">Year 3+</span>
            </div>

            {/* Track descriptions */}
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              {trackData.map((track) => (
                <div
                  key={track.name}
                  className="p-4 rounded-lg border-2"
                  style={{ borderColor: track.color }}
                >
                  <h4 className="font-semibold mb-2" style={{ color: track.color }}>
                    {track.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {track.description.focus}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Examples:</strong> {track.description.examples}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribution Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Track Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name.split(" ")[0]}: ${value}`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Value by Track</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trackData}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value) => value.split(" ")[0]}
                  />
                  <YAxis
                    tickFormatter={(value) => formatCurrency(value)}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), "Total Value"]}
                  />
                  <Bar dataKey="totalValue" radius={[4, 4, 0, 0]}>
                    {trackData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Companies by Track */}
      {trackData.map((track) => (
        <Card key={track.name} className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: track.color }}
                />
                {track.name} Companies ({track.count})
              </CardTitle>
              <Badge variant="outline" style={{ borderColor: track.color, color: track.color }}>
                {track.description.timeline}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 text-sm font-medium text-muted-foreground">
                      Company
                    </th>
                    <th className="text-left py-2 px-2 text-sm font-medium text-muted-foreground hidden md:table-cell">
                      Category
                    </th>
                    <th className="text-center py-2 px-2 text-sm font-medium text-muted-foreground">
                      Theme
                    </th>
                    <th className="text-right py-2 px-2 text-sm font-medium text-muted-foreground">
                      Priority
                    </th>
                    <th className="text-right py-2 px-2 text-sm font-medium text-muted-foreground">
                      Adj. Priority
                    </th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {track.companies.slice(0, 10).map((company: any) => (
                    <tr
                      key={company.id}
                      className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-2">
                        <Link href={`/company/${company.id}`}>
                          <div className="flex items-center gap-2 hover:text-primary cursor-pointer">
                            <CompanyLogo companyName={company.companyName} size="sm" />
                            <span className="font-medium">
                              {company.companyName}
                            </span>
                          </div>
                        </Link>
                      </td>
                      <td className="py-3 px-2 hidden md:table-cell text-sm text-muted-foreground">
                        {company.investmentCategory?.split(" ")[0]}
                      </td>
                      <td className="py-3 px-2 text-center">
                        {company.theme && (
                          <Badge variant="outline" className="text-xs">
                            {company.theme}
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-2 text-right font-medium">
                        {Number(company.priorityScore).toFixed(2)}
                      </td>
                      <td className="py-3 px-2 text-right font-bold text-green-600">
                        {formatCurrency(Number(company.adjustedPriority))}
                      </td>
                      <td className="py-3 px-2">
                        <Link href={`/company/${company.id}`}>
                          <ArrowRight className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {track.companies.length > 10 && (
                <p className="text-sm text-muted-foreground text-center py-3">
                  +{track.companies.length - 10} more companies
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </Layout>
  );
}
