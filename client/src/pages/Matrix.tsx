import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { useState, useMemo } from "react";
import { Link } from "wouter";
import {
  Filter,
  Search,
  Info,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const QUADRANT_THRESHOLD = 7.0;

const CATEGORY_COLORS: Record<string, string> = {
  "Digital Infrastructure": "#003B73",
  "Energy & Energy Transition": "#00B34A",
  "Transport & Logistics": "#00A3E0",
  "Social Infrastructure": "#7C3AED",
  "Real Estate": "#F59E0B",
};

const THEME_COLORS: Record<string, string> = {
  "Revenue Growth": "#00B34A",
  "Margin Expansion": "#00A3E0",
  "Cost Cutting": "#003B73",
};

const TRACK_COLORS: Record<string, string> = {
  "EBITDA Accelerator": "#003B73",
  "Growth Enabler": "#00A3E0",
  "Exit Multiplier": "#00B34A",
};

const QUADRANT_COLORS: Record<string, string> = {
  Champions: "#00B34A",
  "Quick Wins": "#00A3E0",
  Strategic: "#7C3AED",
  Foundations: "#999999",
};

type BubbleSizeOption = "adjustedEbitda" | "adjustedPriority" | "revenue";
type ColorByOption = "category" | "theme" | "track" | "quadrant";

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

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  
  return (
    <div className="bg-popover text-popover-foreground rounded-lg shadow-lg border border-border p-4 max-w-xs">
      <h4 className="font-bold text-base mb-2">{data.companyName}</h4>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Category:</span>
          <span className="font-medium">{data.investmentCategory?.split(" ")[0]}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Value Score:</span>
          <span className="font-medium">{Number(data.valueScore).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Readiness Score:</span>
          <span className="font-medium">{Number(data.readinessScore).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Priority Score:</span>
          <span className="font-medium">{Number(data.priorityScore).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Adj. EBITDA:</span>
          <span className="font-medium text-green-600">{formatCurrency(Number(data.adjustedEbitda))}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Quadrant:</span>
          <Badge
            variant="outline"
            style={{
              borderColor: QUADRANT_COLORS[data.quadrant],
              color: QUADRANT_COLORS[data.quadrant],
            }}
          >
            {data.quadrant}
          </Badge>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-3">Click to view details</p>
    </div>
  );
}

export default function Matrix() {
  const { data: companies, isLoading } = trpc.companies.list.useQuery();
  
  const [bubbleSize, setBubbleSize] = useState<BubbleSizeOption>("adjustedEbitda");
  const [colorBy, setColorBy] = useState<ColorByOption>("category");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(CATEGORIES);
  const [selectedQuadrants, setSelectedQuadrants] = useState<string[]>(QUADRANTS);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  const filteredCompanies = useMemo(() => {
    if (!companies) return [];
    
    return companies.filter((company) => {
      // Search filter
      if (searchQuery && !company.companyName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Category filter
      if (!selectedCategories.includes(company.investmentCategory)) {
        return false;
      }
      // Quadrant filter
      if (company.quadrant && !selectedQuadrants.includes(company.quadrant)) {
        return false;
      }
      return true;
    });
  }, [companies, searchQuery, selectedCategories, selectedQuadrants]);

  const chartData = useMemo(() => {
    return filteredCompanies.map((company) => {
      let size = 100;
      if (bubbleSize === "adjustedEbitda") {
        size = Math.max(50, Math.min(500, Number(company.adjustedEbitda) / 100000));
      } else if (bubbleSize === "adjustedPriority") {
        size = Math.max(50, Math.min(500, Number(company.adjustedPriority) / 10000));
      } else if (bubbleSize === "revenue") {
        size = Math.max(50, Math.min(500, Number(company.annualRevenue) / 10000000));
      }

      let color = "#999";
      if (colorBy === "category") {
        color = CATEGORY_COLORS[company.investmentCategory] || "#999";
      } else if (colorBy === "theme" && company.theme) {
        color = THEME_COLORS[company.theme] || "#999";
      } else if (colorBy === "track" && company.track) {
        color = TRACK_COLORS[company.track] || "#999";
      } else if (colorBy === "quadrant" && company.quadrant) {
        color = QUADRANT_COLORS[company.quadrant] || "#999";
      }

      return {
        ...company,
        x: Number(company.readinessScore),
        y: Number(company.valueScore),
        z: size,
        color,
      };
    });
  }, [filteredCompanies, bubbleSize, colorBy]);

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

  if (isLoading) {
    return (
      <Layout title="Value-Readiness Matrix" subtitle="Interactive portfolio positioning">
        <div className="space-y-4">
          <Skeleton className="h-[500px] w-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Value-Readiness Matrix"
      subtitle="Interactive portfolio positioning with quadrant analysis"
    >
      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Bubble Size */}
        <Select value={bubbleSize} onValueChange={(v) => setBubbleSize(v as BubbleSizeOption)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Bubble size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="adjustedEbitda">Size: Adj. EBITDA</SelectItem>
            <SelectItem value="adjustedPriority">Size: Adj. Priority</SelectItem>
            <SelectItem value="revenue">Size: Revenue</SelectItem>
          </SelectContent>
        </Select>

        {/* Color By */}
        <Select value={colorBy} onValueChange={(v) => setColorBy(v as ColorByOption)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Color by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="category">Color: Category</SelectItem>
            <SelectItem value="theme">Color: Theme</SelectItem>
            <SelectItem value="track">Color: Track</SelectItem>
            <SelectItem value="quadrant">Color: Quadrant</SelectItem>
          </SelectContent>
        </Select>

        {/* Filter Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Categories */}
              <div>
                <h4 className="font-medium mb-3">Investment Categories</h4>
                <div className="space-y-2">
                  {CATEGORIES.map((category) => (
                    <div key={category} className="flex items-center gap-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <label htmlFor={category} className="text-sm cursor-pointer flex items-center gap-2">
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

              {/* Quadrants */}
              <div>
                <h4 className="font-medium mb-3">Quadrants</h4>
                <div className="space-y-2">
                  {QUADRANTS.map((quadrant) => (
                    <div key={quadrant} className="flex items-center gap-2">
                      <Checkbox
                        id={quadrant}
                        checked={selectedQuadrants.includes(quadrant)}
                        onCheckedChange={() => toggleQuadrant(quadrant)}
                      />
                      <label htmlFor={quadrant} className="text-sm cursor-pointer flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: QUADRANT_COLORS[quadrant] }}
                        />
                        {quadrant}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Matrix Chart */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Portfolio Matrix ({filteredCompanies.length} companies)
            </CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  The matrix plots companies by Value Score (Y-axis) and Readiness Score (X-axis).
                  The threshold of 7.0 divides companies into four quadrants.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] md:h-[600px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Readiness Score"
                  domain={[0, 10]}
                  tickCount={11}
                  label={{
                    value: "Readiness Score",
                    position: "bottom",
                    offset: 40,
                    style: { textAnchor: "middle", fill: "var(--muted-foreground)" },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Value Score"
                  domain={[0, 10]}
                  tickCount={11}
                  label={{
                    value: "Value Score",
                    angle: -90,
                    position: "left",
                    offset: 40,
                    style: { textAnchor: "middle", fill: "var(--muted-foreground)" },
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[50, 500]} />
                
                {/* Quadrant threshold lines */}
                <ReferenceLine
                  x={QUADRANT_THRESHOLD}
                  stroke="#999"
                  strokeDasharray="5 5"
                  label={{
                    value: "Readiness Threshold (7.0)",
                    position: "top",
                    fill: "#999",
                    fontSize: 11,
                  }}
                />
                <ReferenceLine
                  y={QUADRANT_THRESHOLD}
                  stroke="#999"
                  strokeDasharray="5 5"
                  label={{
                    value: "Value Threshold (7.0)",
                    position: "right",
                    fill: "#999",
                    fontSize: 11,
                  }}
                />

                <RechartsTooltip content={<CustomTooltip />} />
                
                <Scatter
                  data={chartData}
                  onClick={(data) => setSelectedCompany(data)}
                  cursor="pointer"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      fillOpacity={0.7}
                      stroke={entry.color}
                      strokeWidth={2}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Quadrant Labels */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="p-3 rounded-lg quadrant-champions border-2">
              <h4 className="font-bold text-green-700 dark:text-green-400">Champions</h4>
              <p className="text-xs text-muted-foreground">High Value + High Readiness</p>
            </div>
            <div className="p-3 rounded-lg quadrant-quickwins border-2">
              <h4 className="font-bold text-sky-700 dark:text-sky-400">Quick Wins</h4>
              <p className="text-xs text-muted-foreground">Lower Value + High Readiness</p>
            </div>
            <div className="p-3 rounded-lg quadrant-strategic border-2">
              <h4 className="font-bold text-purple-700 dark:text-purple-400">Strategic</h4>
              <p className="text-xs text-muted-foreground">High Value + Lower Readiness</p>
            </div>
            <div className="p-3 rounded-lg quadrant-foundations border-2">
              <h4 className="font-bold text-gray-700 dark:text-gray-400">Foundations</h4>
              <p className="text-xs text-muted-foreground">Lower Value + Lower Readiness</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category Legend */}
            <div>
              <h4 className="font-medium text-sm mb-2 text-muted-foreground">Categories</h4>
              <div className="space-y-1">
                {Object.entries(CATEGORY_COLORS).map(([name, color]) => (
                  <div key={name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span>{name.split(" ")[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Theme Legend */}
            <div>
              <h4 className="font-medium text-sm mb-2 text-muted-foreground">Value Themes</h4>
              <div className="space-y-1">
                {Object.entries(THEME_COLORS).map(([name, color]) => (
                  <div key={name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Track Legend */}
            <div>
              <h4 className="font-medium text-sm mb-2 text-muted-foreground">Hold Period Tracks</h4>
              <div className="space-y-1">
                {Object.entries(TRACK_COLORS).map(([name, color]) => (
                  <div key={name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quadrant Legend */}
            <div>
              <h4 className="font-medium text-sm mb-2 text-muted-foreground">Quadrants</h4>
              <div className="space-y-1">
                {Object.entries(QUADRANT_COLORS).map(([name, color]) => (
                  <div key={name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Company Panel */}
      {selectedCompany && (
        <Card className="mt-6 border-2 border-primary">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>{selectedCompany.companyName}</CardTitle>
              <div className="flex gap-2">
                <Link href={`/company/${selectedCompany.id}`}>
                  <Button size="sm" className="gap-2">
                    View Details
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCompany(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{selectedCompany.investmentCategory}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quadrant</p>
                <Badge
                  variant="outline"
                  style={{
                    borderColor: QUADRANT_COLORS[selectedCompany.quadrant],
                    color: QUADRANT_COLORS[selectedCompany.quadrant],
                  }}
                >
                  {selectedCompany.quadrant}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Priority Score</p>
                <p className="font-bold text-lg">{Number(selectedCompany.priorityScore).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Adjusted Priority</p>
                <p className="font-bold text-lg text-green-600">
                  {formatCurrency(Number(selectedCompany.adjustedPriority))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </Layout>
  );
}
