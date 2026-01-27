import Layout from "@/components/Layout";
import { CompanyLogo } from "@/components/CompanyLogo";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useState, useMemo } from "react";
import { Link } from "wouter";
import {
  Network,
  Layers,
  TrendingUp,
  Building2,
  ArrowRight,
  Sparkles,
  Copy,
} from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  "Digital Infrastructure": "#003B73",
  "Energy & Energy Transition": "#00B34A",
  "Transport & Logistics": "#00A3E0",
  "Social Infrastructure": "#7C3AED",
  "Real Estate": "#F59E0B",
};

function formatCurrency(value: number): string {
  if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

export default function Portfolio() {
  const { data: companies, isLoading } = trpc.companies.list.useQuery();
  const [sortBy, setSortBy] = useState<"portfolioAdjustedPriority" | "replicationPotential">("portfolioAdjustedPriority");
  const [filterClassification, setFilterClassification] = useState<string>("all");

  const sortedCompanies = useMemo(() => {
    if (!companies) return [];
    
    let filtered = [...companies];
    
    if (filterClassification !== "all") {
      filtered = filtered.filter(c => c.platformClassification === filterClassification);
    }
    
    return filtered.sort((a, b) => {
      if (sortBy === "portfolioAdjustedPriority") {
        return Number(b.portfolioAdjustedPriority) - Number(a.portfolioAdjustedPriority);
      }
      return Number(b.replicationPotential) - Number(a.replicationPotential);
    });
  }, [companies, sortBy, filterClassification]);

  const platformPlays = useMemo(() => {
    if (!companies) return [];
    return companies.filter(c => c.platformClassification === "Platform Play");
  }, [companies]);

  const pointSolutions = useMemo(() => {
    if (!companies) return [];
    return companies.filter(c => c.platformClassification === "Point Solution");
  }, [companies]);

  const categoryReplicationData = useMemo(() => {
    if (!companies) return [];
    
    const categoryMap = new Map<string, { total: number; count: number }>();
    
    companies.forEach(company => {
      const cat = company.investmentCategory;
      const existing = categoryMap.get(cat) || { total: 0, count: 0 };
      categoryMap.set(cat, {
        total: existing.total + Number(company.replicationPotential || 0),
        count: existing.count + 1,
      });
    });
    
    return Array.from(categoryMap.entries()).map(([name, data]) => ({
      name: name.split(" ")[0],
      fullName: name,
      avgReplication: data.total / data.count,
      count: data.count,
      color: CATEGORY_COLORS[name] || "#999",
    })).sort((a, b) => b.avgReplication - a.avgReplication);
  }, [companies]);

  if (isLoading) {
    return (
      <Layout title="Portfolio Amplification" subtitle="Cross-portfolio synergy analysis">
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
      title="Portfolio Amplification"
      subtitle="Cross-portfolio synergy and replication potential analysis"
    >
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="blueally-metric-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Platform Plays</p>
                <p className="text-3xl font-bold">{platformPlays.length}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  High replication potential (7+)
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="blueally-metric-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Point Solutions</p>
                <p className="text-3xl font-bold">{pointSolutions.length}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Company-specific implementations
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="blueally-metric-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Replication Score</p>
                <p className="text-3xl font-bold">
                  {companies && companies.length > 0
                    ? (companies.reduce((sum, c) => sum + Number(c.replicationPotential || 0), 0) / companies.length).toFixed(1)
                    : "0"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Out of 10.0
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Copy className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Replication Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Network className="w-5 h-5" />
            Replication Potential by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryReplicationData} layout="vertical">
                <XAxis type="number" domain={[0, 10]} />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => [value.toFixed(1), "Avg Replication"]}
                  labelFormatter={(label) => categoryReplicationData.find(c => c.name === label)?.fullName || label}
                />
                <Bar dataKey="avgReplication" radius={[0, 4, 4, 0]}>
                  {categoryReplicationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="portfolioAdjustedPriority">Sort: Portfolio-Adjusted Priority</SelectItem>
            <SelectItem value="replicationPotential">Sort: Replication Potential</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterClassification} onValueChange={setFilterClassification}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classifications</SelectItem>
            <SelectItem value="Platform Play">Platform Plays Only</SelectItem>
            <SelectItem value="Point Solution">Point Solutions Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Company Rankings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Portfolio-Adjusted Priority Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedCompanies.slice(0, 20).map((company, index) => (
              <div
                key={company.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link href={`/company/${company.id}`}>
                      <div className="flex items-center gap-2 hover:text-primary cursor-pointer">
                        <CompanyLogo companyName={company.companyName} size="sm" />
                        <span className="font-medium">
                          {company.companyName}
                        </span>
                      </div>
                    </Link>
                    <Badge
                      variant="outline"
                      className={
                        company.platformClassification === "Platform Play"
                          ? "border-blue-500 text-blue-600"
                          : "border-purple-500 text-purple-600"
                      }
                    >
                      {company.platformClassification}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {company.investmentCategory}
                  </p>
                </div>

                <div className="text-center px-4">
                  <p className="text-xs text-muted-foreground mb-1">Replication</p>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={Number(company.replicationPotential) * 10}
                      className="w-16 h-2"
                    />
                    <span className="font-medium text-sm">
                      {Number(company.replicationPotential).toFixed(0)}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">Portfolio-Adj. Priority</p>
                  <p className="font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(Number(company.portfolioAdjustedPriority))}
                  </p>
                </div>

                <Link href={`/company/${company.id}`}>
                  <Button variant="ghost" size="icon">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Synergy Insights */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Cross-Portfolio Synergy Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">
                Platform Play Opportunities
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Companies with replication potential ≥7 can serve as platforms for
                scaling AI initiatives across the portfolio.
              </p>
              <div className="flex flex-wrap gap-2">
                {platformPlays.slice(0, 5).map((company) => (
                  <Badge key={company.id} variant="secondary">
                    {company.companyName}
                  </Badge>
                ))}
                {platformPlays.length > 5 && (
                  <Badge variant="outline">+{platformPlays.length - 5} more</Badge>
                )}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">
                Replication Multiplier Effect
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Portfolio-Adjusted Priority includes a 10% multiplier per replication
                point, amplifying the value of scalable solutions.
              </p>
              <div className="text-sm">
                <p className="font-medium">Formula:</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  Adj_Priority × (1 + Replication × 0.10)
                </code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}
