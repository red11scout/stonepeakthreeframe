import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Layout from "@/components/Layout";
import { CompanyLogo } from "@/components/CompanyLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Trophy,
  Zap,
  Target,
  Layers,
  ChevronRight,
  Sparkles,
  X,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Category colors for the premium dark theme
const CATEGORY_COLORS: Record<string, string> = {
  "Digital Infrastructure": "oklch(0.65 0.18 250)",
  "Energy & Energy Transition": "oklch(0.70 0.18 145)",
  "Transport & Logistics": "oklch(0.70 0.15 200)",
  "Social Infrastructure": "oklch(0.65 0.15 300)",
  "Real Estate": "oklch(0.70 0.15 45)",
};

const QUADRANT_CONFIG = {
  Champions: {
    color: "oklch(0.65 0.18 145)",
    icon: Trophy,
    description: "High Value. High Readiness. Deploy now.",
  },
  "Quick Wins": {
    color: "oklch(0.60 0.18 250)",
    icon: Zap,
    description: "Lower Value. High Readiness. Quick returns.",
  },
  Strategic: {
    color: "oklch(0.60 0.15 300)",
    icon: Target,
    description: "High Value. Lower Readiness. Build capacity.",
  },
  Foundations: {
    color: "oklch(0.45 0.02 250)",
    icon: Layers,
    description: "Lower Value. Lower Readiness. Develop first.",
  },
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

export default function Matrix() {
  const { data: companies = [], isLoading } = trpc.companies.list.useQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [sizeBy, setSizeBy] = useState<"ebitda" | "priority">("ebitda");
  const [colorBy, setColorBy] = useState<"category" | "quadrant">("category");
  const [selectedQuadrants, setSelectedQuadrants] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [hoveredCompany, setHoveredCompany] = useState<Company | null>(null);

  // Filter companies
  const filteredCompanies = useMemo(() => {
    return companies.filter((c: Company) => {
      const matchesSearch = c.companyName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesQuadrant = selectedQuadrants.length === 0 || (c.quadrant && selectedQuadrants.includes(c.quadrant));
      return matchesSearch && matchesQuadrant;
    });
  }, [companies, searchQuery, selectedQuadrants]);

  // Calculate bubble size
  const getBubbleSize = (company: Company) => {
    const value = sizeBy === "ebitda" 
      ? parseFloat(company.adjustedEbitda || "0") 
      : parseFloat(company.adjustedPriority || "0");
    
    const maxValue = Math.max(...companies.map((c: Company) => 
      sizeBy === "ebitda" ? parseFloat(c.adjustedEbitda || "0") : parseFloat(c.adjustedPriority || "0")
    ));
    
    const minSize = 20;
    const maxSize = 56;
    const normalized = Math.sqrt(Math.max(0, value) / Math.max(1, maxValue));
    return minSize + (maxSize - minSize) * normalized;
  };

  // Get bubble color
  const getBubbleColor = (company: Company) => {
    if (colorBy === "quadrant") {
      return QUADRANT_CONFIG[company.quadrant as keyof typeof QUADRANT_CONFIG]?.color || "oklch(0.5 0.02 250)";
    }
    return CATEGORY_COLORS[company.investmentCategory] || "oklch(0.5 0.02 250)";
  };

  // Calculate position (0-100 scale)
  const getPosition = (company: Company) => {
    const valueScore = parseFloat(company.valueScore || "0");
    const readinessScore = parseFloat(company.readinessScore || "0");
    // Map 0-10 to 8-92 for padding
    const x = 8 + (readinessScore / 10) * 84;
    const y = 92 - (valueScore / 10) * 84;
    return { x, y };
  };

  // Quadrant stats
  const quadrantStats = useMemo(() => {
    const stats: Record<string, { count: number; value: number }> = {
      Champions: { count: 0, value: 0 },
      "Quick Wins": { count: 0, value: 0 },
      Strategic: { count: 0, value: 0 },
      Foundations: { count: 0, value: 0 },
    };
    
    companies.forEach((c: Company) => {
      if (c.quadrant && stats[c.quadrant]) {
        stats[c.quadrant].count++;
        stats[c.quadrant].value += parseFloat(c.adjustedPriority || "0");
      }
    });
    
    return stats;
  }, [companies]);

  const toggleQuadrant = (quadrant: string) => {
    setSelectedQuadrants(prev => 
      prev.includes(quadrant) 
        ? prev.filter(q => q !== quadrant)
        : [...prev, quadrant]
    );
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(0)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  if (isLoading) {
    return (
      <Layout title="Value-Readiness Matrix" subtitle="Loading...">
        <div className="min-h-[600px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading portfolio data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="" subtitle="">
      <div className="min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="headline-elegant text-4xl md:text-5xl mb-3">
            Value-Readiness<br />
            <span className="gradient-text not-italic font-semibold">Matrix</span>
          </h1>
          <p className="tagline max-w-xl">
            The truth is in the numbers. See where each company stands. 
            Make decisions that matter.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50 border-border/50 focus:border-primary/50"
            />
          </div>
          
          <Select value={sizeBy} onValueChange={(v: "ebitda" | "priority") => setSizeBy(v)}>
            <SelectTrigger className="w-[180px] bg-card/50 border-border/50">
              <SelectValue placeholder="Size by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ebitda">Size: Adj. EBITDA</SelectItem>
              <SelectItem value="priority">Size: Adj. Priority</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={colorBy} onValueChange={(v: "category" | "quadrant") => setColorBy(v)}>
            <SelectTrigger className="w-[180px] bg-card/50 border-border/50">
              <SelectValue placeholder="Color by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="category">Color: Category</SelectItem>
              <SelectItem value="quadrant">Color: Quadrant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
          {/* Matrix Visualization */}
          <div className="bg-card/90 backdrop-blur-xl rounded-xl border border-border/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="font-medium">{filteredCompanies.length} Companies</span>
              </div>
              {selectedQuadrants.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedQuadrants([])}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear filters
                  <X className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>

            {/* Matrix Container */}
            <div className="relative aspect-square max-h-[650px] w-full">
              {/* Quadrant Backgrounds */}
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 rounded-lg overflow-hidden">
                <div className="matrix-bg-strategic border-r border-b border-border/20" />
                <div className="matrix-bg-champions border-b border-border/20" />
                <div className="matrix-bg-foundations border-r border-border/20" />
                <div className="matrix-bg-quick-wins" />
              </div>

              {/* Threshold Lines */}
              <div 
                className="absolute left-0 right-0 border-t-2 border-dashed"
                style={{ top: "30%", borderColor: "oklch(0.65 0.18 250 / 0.5)" }}
              />
              <div 
                className="absolute top-0 bottom-0 border-l-2 border-dashed"
                style={{ left: "70%", borderColor: "oklch(0.65 0.18 250 / 0.5)" }}
              />

              {/* Axis Labels */}
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-muted-foreground font-medium tracking-widest uppercase">
                Value Score
              </div>
              <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground font-medium tracking-widest uppercase">
                Readiness Score
              </div>

              {/* Quadrant Labels */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 text-xs font-medium opacity-70" style={{ color: QUADRANT_CONFIG.Strategic.color }}>
                <Target className="w-3.5 h-3.5" />
                Strategic
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1.5 text-xs font-medium opacity-70" style={{ color: QUADRANT_CONFIG.Champions.color }}>
                <Trophy className="w-3.5 h-3.5" />
                Champions
              </div>
              <div className="absolute bottom-6 left-3 flex items-center gap-1.5 text-xs font-medium opacity-70" style={{ color: QUADRANT_CONFIG.Foundations.color }}>
                <Layers className="w-3.5 h-3.5" />
                Foundations
              </div>
              <div className="absolute bottom-6 right-3 flex items-center gap-1.5 text-xs font-medium opacity-70" style={{ color: QUADRANT_CONFIG["Quick Wins"].color }}>
                <Zap className="w-3.5 h-3.5" />
                Quick Wins
              </div>

              {/* Company Bubbles */}
              <svg className="absolute inset-0 w-full h-full overflow-visible">
                <defs>
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                
                {filteredCompanies.map((company: Company, index: number) => {
                  const pos = getPosition(company);
                  const size = getBubbleSize(company);
                  const color = getBubbleColor(company);
                  const isHovered = hoveredCompany?.id === company.id;
                  const isSelected = selectedCompany?.id === company.id;
                  
                  return (
                    <g key={company.id}>
                      <motion.circle
                        cx={`${pos.x}%`}
                        cy={`${pos.y}%`}
                        r={size / 2}
                        fill={color}
                        fillOpacity={isHovered || isSelected ? 0.95 : 0.75}
                        stroke={isSelected ? "white" : "transparent"}
                        strokeWidth={isSelected ? 3 : 0}
                        style={{ cursor: "pointer" }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: isHovered ? 1.2 : 1, 
                          opacity: 1,
                        }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 400, 
                          damping: 25,
                          delay: index * 0.01
                        }}
                        onMouseEnter={() => setHoveredCompany(company)}
                        onMouseLeave={() => setHoveredCompany(null)}
                        onClick={() => setSelectedCompany(company)}
                        filter={isHovered ? "url(#glow)" : undefined}
                      />
                      {/* Company initial for larger bubbles */}
                      {size > 32 && (
                        <text
                          x={`${pos.x}%`}
                          y={`${pos.y}%`}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill="white"
                          fontSize={size > 45 ? 13 : 10}
                          fontWeight="600"
                          style={{ pointerEvents: "none" }}
                        >
                          {company.companyName.charAt(0)}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Hover Tooltip */}
              <AnimatePresence>
                {hoveredCompany && !selectedCompany && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute z-50 pointer-events-none"
                    style={{
                      left: `${Math.min(75, Math.max(25, getPosition(hoveredCompany).x))}%`,
                      top: `${Math.min(75, Math.max(25, getPosition(hoveredCompany).y))}%`,
                      transform: "translate(-50%, -130%)",
                    }}
                  >
                    <div className="bg-card/90 backdrop-blur-xl rounded-xl border border-border/50 p-4 min-w-[220px] shadow-2xl">
                      <div className="flex items-center gap-3 mb-3">
                        <CompanyLogo companyName={hoveredCompany.companyName} size="sm" />
                        <span className="font-semibold text-sm">{hoveredCompany.companyName}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-muted-foreground block mb-0.5">Value Score</span>
                          <p className="font-bold text-lg">{parseFloat(hoveredCompany.valueScore || "0").toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground block mb-0.5">Readiness</span>
                          <p className="font-bold text-lg">{parseFloat(hoveredCompany.readinessScore || "0").toFixed(2)}</p>
                        </div>
                        <div className="col-span-2 pt-2 border-t border-border/50">
                          <span className="text-muted-foreground block mb-0.5">Adjusted Priority</span>
                          <p className="font-bold text-lg text-primary">
                            {formatCurrency(parseFloat(hoveredCompany.adjustedPriority || "0"))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Scale Indicators */}
            <div className="flex justify-between mt-4 px-2 text-[10px] text-muted-foreground">
              <span>0</span>
              <span>2</span>
              <span>4</span>
              <span>6</span>
              <span>8</span>
              <span>10</span>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-4">
            {/* Quadrant Summary Cards */}
            {Object.entries(QUADRANT_CONFIG).map(([quadrant, config]) => {
              const Icon = config.icon;
              const stats = quadrantStats[quadrant];
              const isActive = selectedQuadrants.length === 0 || selectedQuadrants.includes(quadrant);
              
              return (
                <motion.div
                  key={quadrant}
                  className={`bg-card/90 backdrop-blur-xl rounded-xl border border-border/50 p-4 cursor-pointer transition-all duration-300 ${
                    isActive ? "opacity-100" : "opacity-40"
                  }`}
                  onClick={() => toggleQuadrant(quadrant)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `color-mix(in oklch, ${config.color} 20%, transparent)`, color: config.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-sm" style={{ color: config.color }}>
                          {quadrant}
                        </h3>
                        <Badge variant="secondary" className="text-xs px-2">
                          {stats?.count || 0}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {config.description}
                      </p>
                      <p className="text-base font-semibold mt-2 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                        {formatCurrency(stats?.value || 0)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Legend */}
            <div className="bg-card/90 backdrop-blur-xl rounded-xl border border-border/50 p-4">
              <h3 className="text-xs font-medium mb-3 text-muted-foreground uppercase tracking-wider">
                Investment Categories
              </h3>
              <div className="space-y-2.5">
                {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
                  <div key={category} className="flex items-center gap-2.5 text-xs">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-muted-foreground truncate">{category}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Company Detail Panel */}
        <AnimatePresence>
          {selectedCompany && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-background via-background to-transparent pt-12"
            >
              <div className="container max-w-5xl mx-auto">
                <div className="bg-card/90 backdrop-blur-xl rounded-xl border border-border/50 p-6 shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <CompanyLogo companyName={selectedCompany.companyName} size="lg" />
                      <div>
                        <h2 className="text-xl font-semibold">{selectedCompany.companyName}</h2>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <Badge className="text-xs px-2 py-0.5" style={{
                            backgroundColor: `color-mix(in oklch, ${CATEGORY_COLORS[selectedCompany.investmentCategory]} 20%, transparent)`,
                            color: CATEGORY_COLORS[selectedCompany.investmentCategory],
                            border: `1px solid color-mix(in oklch, ${CATEGORY_COLORS[selectedCompany.investmentCategory]} 30%, transparent)`
                          }}>
                            {selectedCompany.investmentCategory}
                          </Badge>
                          <Badge 
                            className="text-xs px-2 py-0.5"
                            style={{ 
                              backgroundColor: `color-mix(in oklch, ${QUADRANT_CONFIG[selectedCompany.quadrant as keyof typeof QUADRANT_CONFIG]?.color} 20%, transparent)`,
                              color: QUADRANT_CONFIG[selectedCompany.quadrant as keyof typeof QUADRANT_CONFIG]?.color,
                              border: `1px solid color-mix(in oklch, ${QUADRANT_CONFIG[selectedCompany.quadrant as keyof typeof QUADRANT_CONFIG]?.color} 30%, transparent)`
                            }}
                          >
                            {selectedCompany.quadrant}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{parseFloat(selectedCompany.valueScore || "0").toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Value Score</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{parseFloat(selectedCompany.readinessScore || "0").toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Readiness</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">
                          {formatCurrency(parseFloat(selectedCompany.adjustedPriority || "0"))}
                        </p>
                        <p className="text-xs text-muted-foreground">Adj. Priority</p>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-auto md:ml-4">
                        <Link href={`/company/${selectedCompany.id}`}>
                          <Button className="btn-premium text-sm">
                            View Details
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setSelectedCompany(null)}
                          className="hover:bg-destructive/10"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
