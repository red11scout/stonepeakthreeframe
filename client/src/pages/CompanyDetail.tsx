import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, Link } from "wouter";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Building2,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Target,
  Zap,
  Save,
  RotateCcw,
  Sparkles,
  History,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

const QUADRANT_COLORS: Record<string, string> = {
  Champions: "#00B34A",
  "Quick Wins": "#00A3E0",
  Strategic: "#7C3AED",
  Foundations: "#999999",
};

const THEMES = ["Revenue Growth", "Margin Expansion", "Cost Cutting"];
const TRACKS = ["EBITDA Accelerator", "Growth Enabler", "Exit Multiplier"];

function formatCurrency(value: number): string {
  if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

function ScoreSlider({
  label,
  value,
  onChange,
  description,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  description?: string;
}) {
  const getScoreColor = (score: number) => {
    if (score >= 7) return "text-green-600 dark:text-green-400";
    if (score >= 5) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">{label}</label>
        <span className={`font-bold ${getScoreColor(value)}`}>{value.toFixed(1)}</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={1}
        max={10}
        step={0.1}
        className="w-full"
      />
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

export default function CompanyDetail() {
  const params = useParams<{ id: string }>();
  const companyId = parseInt(params.id || "0", 10);

  const { data: company, isLoading, refetch } = trpc.companies.getById.useQuery(
    { id: companyId },
    { enabled: companyId > 0 }
  );

  const { data: auditLogs } = trpc.audit.getByCompany.useQuery(
    { companyId },
    { enabled: companyId > 0 }
  );

  const { data: insights } = trpc.ai.getInsights.useQuery(
    { companyId },
    { enabled: companyId > 0 }
  );

  const updateMutation = trpc.companies.update.useMutation({
    onSuccess: () => {
      toast.success("Company updated successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });

  const generateInsightMutation = trpc.ai.generateInsight.useMutation({
    onSuccess: () => {
      toast.success("AI insight generated");
    },
    onError: (error) => {
      toast.error(`Failed to generate insight: ${error.message}`);
    },
  });

  // Local state for editing
  const [editedScores, setEditedScores] = useState({
    ebitdaImpact: 5,
    revenueEnablement: 5,
    riskReduction: 5,
    organizationalCapacity: 5,
    dataAvailability: 5,
    techInfrastructure: 5,
    timelineFit: 5,
    replicationPotential: 5,
  });
  const [editedTheme, setEditedTheme] = useState<string | null>(null);
  const [editedTrack, setEditedTrack] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize local state from company data
  useEffect(() => {
    if (company) {
      setEditedScores({
        ebitdaImpact: Number(company.ebitdaImpact) || 5,
        revenueEnablement: Number(company.revenueEnablement) || 5,
        riskReduction: Number(company.riskReduction) || 5,
        organizationalCapacity: Number(company.organizationalCapacity) || 5,
        dataAvailability: Number(company.dataAvailability) || 5,
        techInfrastructure: Number(company.techInfrastructure) || 5,
        timelineFit: Number(company.timelineFit) || 5,
        replicationPotential: Number(company.replicationPotential) || 5,
      });
      setEditedTheme(company.theme);
      setEditedTrack(company.track);
      setHasChanges(false);
    }
  }, [company]);

  const handleScoreChange = (field: keyof typeof editedScores, value: number) => {
    setEditedScores((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateMutation.mutate({
      id: companyId,
      data: {
        ebitdaImpact: String(editedScores.ebitdaImpact),
        revenueEnablement: String(editedScores.revenueEnablement),
        riskReduction: String(editedScores.riskReduction),
        organizationalCapacity: String(editedScores.organizationalCapacity),
        dataAvailability: String(editedScores.dataAvailability),
        techInfrastructure: String(editedScores.techInfrastructure),
        timelineFit: String(editedScores.timelineFit),
        replicationPotential: String(editedScores.replicationPotential),
        theme: editedTheme,
        track: editedTrack,
      },
    });
  };

  const handleReset = () => {
    if (company) {
      setEditedScores({
        ebitdaImpact: Number(company.ebitdaImpact) || 5,
        revenueEnablement: Number(company.revenueEnablement) || 5,
        riskReduction: Number(company.riskReduction) || 5,
        organizationalCapacity: Number(company.organizationalCapacity) || 5,
        dataAvailability: Number(company.dataAvailability) || 5,
        techInfrastructure: Number(company.techInfrastructure) || 5,
        timelineFit: Number(company.timelineFit) || 5,
        replicationPotential: Number(company.replicationPotential) || 5,
      });
      setEditedTheme(company.theme);
      setEditedTrack(company.track);
      setHasChanges(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Layout>
    );
  }

  if (!company) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Company not found.</p>
          <Link href="/dashboard">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/matrix">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold">{company.companyName}</h1>
            <Badge
              variant="outline"
              style={{
                borderColor: QUADRANT_COLORS[company.quadrant || "Foundations"],
                color: QUADRANT_COLORS[company.quadrant || "Foundations"],
              }}
            >
              {company.quadrant}
            </Badge>
          </div>
          <p className="text-muted-foreground">{company.investmentCategory}</p>
        </div>

        <div className="flex gap-2">
          {hasChanges && (
            <>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleSave} disabled={updateMutation.isPending}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          )}
          <Button
            variant="outline"
            onClick={() => generateInsightMutation.mutate({ companyId })}
            disabled={generateInsightMutation.isPending}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate AI Insight
          </Button>
        </div>
      </div>

      {/* Company Info Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="blueally-metric-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Industry</p>
                <p className="font-medium text-sm">{company.industryVertical}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="blueally-metric-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-medium text-sm">
                  {company.hqCity}, {company.hqCountry}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="blueally-metric-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Employees</p>
                <p className="font-medium text-sm">
                  {company.employees?.toLocaleString() || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="blueally-metric-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Investment Date</p>
                <p className="font-medium text-sm">{company.investmentDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calculated Scores Summary */}
      <div className="grid gap-4 md:grid-cols-5 mb-6">
        <Card className="blueally-metric-card">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Value Score</p>
            <p className="text-2xl font-bold text-blue-600">
              {Number(company.valueScore).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="blueally-metric-card">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Readiness Score</p>
            <p className="text-2xl font-bold text-purple-600">
              {Number(company.readinessScore).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="blueally-metric-card">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Priority Score</p>
            <p className="text-2xl font-bold text-amber-600">
              {Number(company.priorityScore).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="blueally-metric-card">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Adj. EBITDA</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(Number(company.adjustedEbitda))}
            </p>
          </CardContent>
        </Card>

        <Card className="blueally-metric-card">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Adj. Priority</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(Number(company.adjustedPriority))}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="scores" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scores">Input Scores</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="history">Change History</TabsTrigger>
        </TabsList>

        <TabsContent value="scores">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Value Drivers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Value Drivers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ScoreSlider
                  label="EBITDA Impact"
                  value={editedScores.ebitdaImpact}
                  onChange={(v) => handleScoreChange("ebitdaImpact", v)}
                  description="Potential impact on EBITDA through AI initiatives"
                />
                <ScoreSlider
                  label="Revenue Enablement"
                  value={editedScores.revenueEnablement}
                  onChange={(v) => handleScoreChange("revenueEnablement", v)}
                  description="Ability to drive revenue growth through AI"
                />
                <ScoreSlider
                  label="Risk Reduction"
                  value={editedScores.riskReduction}
                  onChange={(v) => handleScoreChange("riskReduction", v)}
                  description="Potential to reduce operational and business risks"
                />
              </CardContent>
            </Card>

            {/* Readiness Factors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Readiness Factors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ScoreSlider
                  label="Organizational Capacity"
                  value={editedScores.organizationalCapacity}
                  onChange={(v) => handleScoreChange("organizationalCapacity", v)}
                  description="Team capability and change management readiness"
                />
                <ScoreSlider
                  label="Data Availability"
                  value={editedScores.dataAvailability}
                  onChange={(v) => handleScoreChange("dataAvailability", v)}
                  description="Quality and accessibility of data assets"
                />
                <ScoreSlider
                  label="Tech Infrastructure"
                  value={editedScores.techInfrastructure}
                  onChange={(v) => handleScoreChange("techInfrastructure", v)}
                  description="Existing technology stack and integration capability"
                />
                <ScoreSlider
                  label="Timeline Fit"
                  value={editedScores.timelineFit}
                  onChange={(v) => handleScoreChange("timelineFit", v)}
                  description="Alignment with hold period and investment thesis"
                />
              </CardContent>
            </Card>

            {/* Replication Potential */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Portfolio Amplification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScoreSlider
                  label="Replication Potential"
                  value={editedScores.replicationPotential}
                  onChange={(v) => handleScoreChange("replicationPotential", v)}
                  description="Potential to replicate AI solutions across the portfolio (7+ = Platform Play)"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assignments">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Value Theme</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={editedTheme || ""}
                  onValueChange={(v) => {
                    setEditedTheme(v || null);
                    setHasChanges(true);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {THEMES.map((theme) => (
                      <SelectItem key={theme} value={theme}>
                        {theme}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-2">
                  Primary value creation focus for AI initiatives
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hold Period Track</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={editedTrack || ""}
                  onValueChange={(v) => {
                    setEditedTrack(v || null);
                    setHasChanges(true);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select track" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRACKS.map((track) => (
                      <SelectItem key={track} value={track}>
                        {track}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-2">
                  Timeline alignment for value capture
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI-Generated Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              {insights && insights.length > 0 ? (
                <div className="space-y-4">
                  {insights.map((insight: any) => (
                    <div
                      key={insight.id}
                      className="p-4 rounded-lg border border-border bg-muted/30"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{insight.title}</h4>
                        <Badge variant="outline">{insight.priority}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {insight.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Generated: {new Date(insight.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No AI insights generated yet.
                  </p>
                  <Button
                    onClick={() => generateInsightMutation.mutate({ companyId })}
                    disabled={generateInsightMutation.isPending}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate First Insight
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="w-5 h-5" />
                Change History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {auditLogs && auditLogs.length > 0 ? (
                <div className="space-y-2">
                  {auditLogs.map((log: any) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between py-2 border-b border-border/50"
                    >
                      <div>
                        <span className="font-medium">{log.field}</span>
                        <span className="text-muted-foreground mx-2">changed from</span>
                        <span className="text-red-500">{log.oldValue}</span>
                        <span className="text-muted-foreground mx-2">to</span>
                        <span className="text-green-500">{log.newValue}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No changes recorded yet.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
