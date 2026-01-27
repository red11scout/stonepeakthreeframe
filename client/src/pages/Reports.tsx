import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  FileText,
  Download,
  FileSpreadsheet,
  Presentation,
  Share2,
  Filter,
  Building2,
} from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  "Digital Infrastructure": "#003B73",
  "Energy & Energy Transition": "#00B34A",
  "Transport & Logistics": "#00A3E0",
  "Social Infrastructure": "#7C3AED",
  "Real Estate": "#F59E0B",
};

const CATEGORIES = [
  "Digital Infrastructure",
  "Energy & Energy Transition",
  "Transport & Logistics",
  "Social Infrastructure",
  "Real Estate",
];

const QUADRANTS = ["Champions", "Quick Wins", "Strategic", "Foundations"];

function formatCurrency(value: number): string {
  if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

export default function Reports() {
  const { data: companies } = trpc.companies.list.useQuery();
  const { data: metrics } = trpc.portfolio.metrics.useQuery();

  const [selectedCategories, setSelectedCategories] = useState<string[]>(CATEGORIES);
  const [selectedQuadrants, setSelectedQuadrants] = useState<string[]>(QUADRANTS);
  const [reportType, setReportType] = useState<string>("executive");

  const filteredCompanies = useMemo(() => {
    if (!companies) return [];
    return companies.filter(
      (c) =>
        selectedCategories.includes(c.investmentCategory) &&
        c.quadrant &&
        selectedQuadrants.includes(c.quadrant)
    );
  }, [companies, selectedCategories, selectedQuadrants]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleQuadrant = (quadrant: string) => {
    setSelectedQuadrants((prev) =>
      prev.includes(quadrant)
        ? prev.filter((q) => q !== quadrant)
        : [...prev, quadrant]
    );
  };

  const generateCSV = () => {
    if (!filteredCompanies.length) {
      toast.error("No companies selected for export");
      return;
    }

    const headers = [
      "Company Name",
      "Investment Category",
      "Industry Vertical",
      "HQ City",
      "HQ Country",
      "Employees",
      "Annual Revenue",
      "EBITDA",
      "Investment Date",
      "Value Score",
      "Readiness Score",
      "Priority Score",
      "Adjusted EBITDA",
      "Adjusted Priority",
      "Quadrant",
      "Theme",
      "Track",
      "Replication Potential",
      "Platform Classification",
    ];

    const rows = filteredCompanies.map((c) => [
      c.companyName,
      c.investmentCategory,
      c.industryVertical,
      c.hqCity,
      c.hqCountry,
      c.employees,
      c.annualRevenue,
      c.ebitda,
      c.investmentDate,
      Number(c.valueScore).toFixed(2),
      Number(c.readinessScore).toFixed(2),
      Number(c.priorityScore).toFixed(2),
      Number(c.adjustedEbitda).toFixed(2),
      Number(c.adjustedPriority).toFixed(2),
      c.quadrant,
      c.theme || "",
      c.track || "",
      c.replicationPotential,
      c.platformClassification,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `stonepeak_portfolio_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success("CSV exported successfully");
  };

  const generateHTML = () => {
    if (!filteredCompanies.length || !metrics) {
      toast.error("No data available for export");
      return;
    }

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>StonePeak Portfolio Intelligence Report</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; color: #333; }
    .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
    .header { background: linear-gradient(135deg, #003B73 0%, #00A3E0 100%); color: white; padding: 40px; border-radius: 12px; margin-bottom: 30px; }
    .header h1 { font-size: 2.5rem; margin-bottom: 10px; }
    .header p { opacity: 0.9; }
    .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .metric { background: white; padding: 24px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .metric-label { font-size: 0.875rem; color: #666; margin-bottom: 8px; }
    .metric-value { font-size: 2rem; font-weight: bold; color: #003B73; }
    .section { background: white; border-radius: 12px; padding: 30px; margin-bottom: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .section h2 { font-size: 1.5rem; margin-bottom: 20px; color: #003B73; border-bottom: 2px solid #00A3E0; padding-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f8f9fa; font-weight: 600; color: #003B73; }
    tr:hover { background: #f8f9fa; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
    .badge-champions { background: #dcfce7; color: #166534; }
    .badge-quickwins { background: #e0f2fe; color: #0369a1; }
    .badge-strategic { background: #f3e8ff; color: #7c3aed; }
    .badge-foundations { background: #f3f4f6; color: #6b7280; }
    .footer { text-align: center; padding: 30px; color: #666; }
    .footer strong { color: #003B73; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>StonePeak Portfolio Intelligence Report</h1>
      <p>Generated on ${new Date().toLocaleDateString()} | Powered by BlueAlly Technology Solutions</p>
    </div>

    <div class="metrics">
      <div class="metric">
        <div class="metric-label">Total Companies</div>
        <div class="metric-value">${metrics.totalCompanies}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Champions</div>
        <div class="metric-value">${metrics.championsCount}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Avg Priority Score</div>
        <div class="metric-value">${metrics.avgPriorityScore.toFixed(1)}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Total Adj. EBITDA</div>
        <div class="metric-value">${formatCurrency(metrics.totalAdjustedEbitda)}</div>
      </div>
    </div>

    <div class="section">
      <h2>Portfolio Companies (${filteredCompanies.length})</h2>
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Category</th>
            <th>Quadrant</th>
            <th>Value Score</th>
            <th>Readiness Score</th>
            <th>Priority Score</th>
            <th>Adj. Priority</th>
          </tr>
        </thead>
        <tbody>
          ${filteredCompanies
            .sort((a, b) => Number(b.adjustedPriority) - Number(a.adjustedPriority))
            .map(
              (c) => `
            <tr>
              <td><strong>${c.companyName}</strong></td>
              <td>${c.investmentCategory.split(" ")[0]}</td>
              <td><span class="badge badge-${c.quadrant?.toLowerCase().replace(" ", "")}">${c.quadrant}</span></td>
              <td>${Number(c.valueScore).toFixed(2)}</td>
              <td>${Number(c.readinessScore).toFixed(2)}</td>
              <td>${Number(c.priorityScore).toFixed(2)}</td>
              <td><strong>${formatCurrency(Number(c.adjustedPriority))}</strong></td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>

    <div class="footer">
      <p>Trustworthiness • Reliability • Energized Innovation</p>
      <p><strong>BlueAlly Technology Solutions</strong></p>
    </div>
  </div>
</body>
</html>
    `;

    const blob = new Blob([html], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `stonepeak_report_${new Date().toISOString().split("T")[0]}.html`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success("HTML report exported successfully");
  };

  return (
    <Layout
      title="Reports & Exports"
      subtitle="Generate and download portfolio reports"
    >
      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Investment Categories</h4>
              <div className="space-y-2">
                {CATEGORIES.map((category) => (
                  <div key={category} className="flex items-center gap-2">
                    <Checkbox
                      id={`cat-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <label
                      htmlFor={`cat-${category}`}
                      className="text-sm cursor-pointer flex items-center gap-2"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[category] }}
                      />
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Quadrants</h4>
              <div className="space-y-2">
                {QUADRANTS.map((quadrant) => (
                  <div key={quadrant} className="flex items-center gap-2">
                    <Checkbox
                      id={`quad-${quadrant}`}
                      checked={selectedQuadrants.includes(quadrant)}
                      onCheckedChange={() => toggleQuadrant(quadrant)}
                    />
                    <label
                      htmlFor={`quad-${quadrant}`}
                      className="text-sm cursor-pointer"
                    >
                      {quadrant}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              <Building2 className="w-4 h-4 inline mr-1" />
              {filteredCompanies.length} companies selected for export
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                <FileSpreadsheet className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold">Excel/CSV Export</h3>
                <p className="text-sm text-muted-foreground">
                  Full data with all metrics
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Download a comprehensive spreadsheet with all company data,
              calculated scores, and portfolio metrics. Ideal for further
              analysis in Excel.
            </p>
            <Button onClick={generateCSV} className="w-full gap-2">
              <Download className="w-4 h-4" />
              Download CSV
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold">HTML Report</h3>
                <p className="text-sm text-muted-foreground">
                  Shareable web report
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Generate a beautifully formatted HTML report with BlueAlly
              branding. Perfect for sharing with stakeholders via email or
              web.
            </p>
            <Button onClick={generateHTML} variant="outline" className="w-full gap-2">
              <Share2 className="w-4 h-4" />
              Generate HTML
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Presentation className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold">PDF Presentation</h3>
                <p className="text-sm text-muted-foreground">
                  Executive summary
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Create a polished PDF presentation with key insights, charts,
              and recommendations for board meetings.
            </p>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => toast.info("PDF generation coming soon")}
            >
              <Download className="w-4 h-4" />
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Report Templates */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Report Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                reportType === "executive"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setReportType("executive")}
            >
              <h4 className="font-medium mb-1">Executive Summary</h4>
              <p className="text-xs text-muted-foreground">
                High-level portfolio overview with key metrics
              </p>
            </div>

            <div
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                reportType === "detailed"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setReportType("detailed")}
            >
              <h4 className="font-medium mb-1">Detailed Analysis</h4>
              <p className="text-xs text-muted-foreground">
                In-depth company-by-company breakdown
              </p>
            </div>

            <div
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                reportType === "quadrant"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setReportType("quadrant")}
            >
              <h4 className="font-medium mb-1">Quadrant Focus</h4>
              <p className="text-xs text-muted-foreground">
                Champions and Quick Wins prioritization
              </p>
            </div>

            <div
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                reportType === "holdperiod"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setReportType("holdperiod")}
            >
              <h4 className="font-medium mb-1">Hold Period Plan</h4>
              <p className="text-xs text-muted-foreground">
                Three-track value capture timeline
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}
