/**
 * Companies Page - Comprehensive Company Directory
 * 
 * Displays all 55 portfolio companies with complete data across three frameworks:
 * - IFM Matrix (Value/Readiness scores, Quadrant)
 * - Value Amplification (Platform Classification, Replication Potential)
 * - Hold Period Planning (Track Assignment, Timeline)
 * 
 * Features:
 * - Interactive filtering and sorting
 * - Visual indicators for companies with Use Cases
 * - Click-through to Use Cases for Champions
 * - Multiple view modes (Grid, Table, Cards)
 */

import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import Layout from '@/components/Layout';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  LayoutGrid,
  Building2,
  TrendingUp,
  Target,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  MapPin,
  Users,
  DollarSign,
  Zap,
  Shield,
  Database,
  Settings,
  Calendar,
  ArrowUpDown,
  X,
  Lightbulb,
} from 'lucide-react';
import {
  INVESTMENT_CATEGORIES,
  QUADRANTS,
  HOLD_PERIOD_TRACKS,
  PLATFORM_CLASSIFICATIONS,
  CATEGORY_COLORS,
  TRACK_COLORS,
  QUADRANT_THRESHOLD,
  type InvestmentCategory,
  type Quadrant,
  type HoldPeriodTrack,
} from '@shared/stonepeak';

// Companies with Use Case assessments
const COMPANIES_WITH_USE_CASES = [
  'Lineage (LINE)',
  'Venture Global Calcasieu Pass',
  'CoreSite (JV)',
  'The AA',
  'Akumin',
  'Inspired Education Group',
  'Intrado',
  'ATSG',
  'Clean Energy Fuels (CLNE)',
  'Seapeak',
  'Oryx Midstream',
  'Cologix',
  'Astound Broadband',
  'DELTA Fiber',
  'euNetworks',
  'Extenet',
  'Forgital',
];

type ViewMode = 'grid' | 'table' | 'cards';
type SortField = 'name' | 'category' | 'quadrant' | 'valueScore' | 'readinessScore' | 'priorityScore' | 'ebitda' | 'employees';
type SortDirection = 'asc' | 'desc';

interface FilterState {
  search: string;
  categories: InvestmentCategory[];
  quadrants: Quadrant[];
  tracks: (HoldPeriodTrack | 'unassigned')[];
  hasUseCases: boolean | null;
  valueScoreMin: number;
  valueScoreMax: number;
  readinessScoreMin: number;
  readinessScoreMax: number;
}

const initialFilters: FilterState = {
  search: '',
  categories: [],
  quadrants: [],
  tracks: [],
  hasUseCases: null,
  valueScoreMin: 0,
  valueScoreMax: 10,
  readinessScoreMin: 0,
  readinessScoreMax: 10,
};

export default function Companies() {
  const [, navigate] = useLocation();
  const { data: companies, isLoading } = trpc.companies.list.useQuery();
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('priorityScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCompany, setExpandedCompany] = useState<number | null>(null);

  // Filter and sort companies
  const filteredCompanies = useMemo(() => {
    if (!companies) return [];
    
    return companies
      .filter(company => {
        // Search filter
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          const matchesSearch = 
            company.companyName.toLowerCase().includes(searchLower) ||
            company.industryVertical?.toLowerCase().includes(searchLower) ||
            company.detailedSector?.toLowerCase().includes(searchLower) ||
            company.hqCity?.toLowerCase().includes(searchLower) ||
            company.hqCountry?.toLowerCase().includes(searchLower);
          if (!matchesSearch) return false;
        }
        
        // Category filter
        if (filters.categories.length > 0) {
          if (!filters.categories.includes(company.investmentCategory as InvestmentCategory)) return false;
        }
        
        // Quadrant filter
        if (filters.quadrants.length > 0) {
          if (!filters.quadrants.includes(company.quadrant as Quadrant)) return false;
        }
        
        // Track filter
        if (filters.tracks.length > 0) {
          const companyTrack = company.track || 'unassigned';
          if (!filters.tracks.includes(companyTrack as HoldPeriodTrack | 'unassigned')) return false;
        }
        
        // Use Cases filter
        if (filters.hasUseCases !== null) {
          const hasUseCase = COMPANIES_WITH_USE_CASES.includes(company.companyName);
          if (filters.hasUseCases !== hasUseCase) return false;
        }
        
        // Score range filters
        const valueScore = Number(company.valueScore) || 0;
        const readinessScore = Number(company.readinessScore) || 0;
        if (valueScore < filters.valueScoreMin || valueScore > filters.valueScoreMax) return false;
        if (readinessScore < filters.readinessScoreMin || readinessScore > filters.readinessScoreMax) return false;
        
        return true;
      })
      .sort((a, b) => {
        let aVal: string | number = 0;
        let bVal: string | number = 0;
        
        switch (sortField) {
          case 'name':
            aVal = a.companyName.toLowerCase();
            bVal = b.companyName.toLowerCase();
            break;
          case 'category':
            aVal = a.investmentCategory;
            bVal = b.investmentCategory;
            break;
          case 'quadrant':
            aVal = a.quadrant || '';
            bVal = b.quadrant || '';
            break;
          case 'valueScore':
            aVal = Number(a.valueScore) || 0;
            bVal = Number(b.valueScore) || 0;
            break;
          case 'readinessScore':
            aVal = Number(a.readinessScore) || 0;
            bVal = Number(b.readinessScore) || 0;
            break;
          case 'priorityScore':
            aVal = Number(a.priorityScore) || 0;
            bVal = Number(b.priorityScore) || 0;
            break;
          case 'ebitda':
            aVal = Number(a.ebitda) || 0;
            bVal = Number(b.ebitda) || 0;
            break;
          case 'employees':
            aVal = a.employees || 0;
            bVal = b.employees || 0;
            break;
        }
        
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortDirection === 'asc' 
            ? aVal.localeCompare(bVal) 
            : bVal.localeCompare(aVal);
        }
        
        return sortDirection === 'asc' 
          ? (aVal as number) - (bVal as number) 
          : (bVal as number) - (aVal as number);
      });
  }, [companies, filters, sortField, sortDirection]);

  // Statistics
  const stats = useMemo(() => {
    if (!filteredCompanies.length) return null;
    
    const champions = filteredCompanies.filter(c => c.quadrant === 'Champions');
    const withUseCases = filteredCompanies.filter(c => COMPANIES_WITH_USE_CASES.includes(c.companyName));
    const totalEbitda = filteredCompanies.reduce((sum, c) => sum + (Number(c.ebitda) || 0), 0);
    const avgPriority = filteredCompanies.reduce((sum, c) => sum + (Number(c.priorityScore) || 0), 0) / filteredCompanies.length;
    
    return {
      total: filteredCompanies.length,
      champions: champions.length,
      withUseCases: withUseCases.length,
      totalEbitda,
      avgPriority,
    };
  }, [filteredCompanies]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat().format(value);
  };

  const getQuadrantColor = (quadrant: string | null) => {
    switch (quadrant) {
      case 'Champions': return 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'Quick Wins': return 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'Strategic': return 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'Foundations': return 'bg-slate-500/20 text-slate-600 dark:text-slate-400 border-slate-500/30';
      default: return 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryColor = (category: string) => {
    const color = CATEGORY_COLORS[category as InvestmentCategory];
    return color || '#6B7280';
  };

  const getTrackColor = (track: string | null) => {
    if (!track) return '#6B7280';
    return TRACK_COLORS[track as HoldPeriodTrack] || '#6B7280';
  };

  const hasUseCases = (companyName: string) => COMPANIES_WITH_USE_CASES.includes(companyName);

  const navigateToUseCases = (companyName: string) => {
    navigate(`/use-cases?company=${encodeURIComponent(companyName)}`);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.categories.length) count++;
    if (filters.quadrants.length) count++;
    if (filters.tracks.length) count++;
    if (filters.hasUseCases !== null) count++;
    if (filters.valueScoreMin > 0 || filters.valueScoreMax < 10) count++;
    if (filters.readinessScoreMin > 0 || filters.readinessScoreMax < 10) count++;
    return count;
  }, [filters]);

  if (isLoading) {
    return (
      <Layout title="Companies">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Companies">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Building2 className="h-7 w-7 text-primary" />
              Portfolio Companies
            </h1>
            <p className="text-muted-foreground mt-1">
              Complete directory of all {companies?.length || 0} portfolio companies across three frameworks
            </p>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Grid View</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('table')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Table View</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('cards')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Detailed Cards</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Stats Summary */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Building2 className="h-4 w-4" />
                  Companies
                </div>
                <div className="text-2xl font-bold text-primary mt-1">{stats.total}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Target className="h-4 w-4" />
                  Champions
                </div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.champions}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Lightbulb className="h-4 w-4" />
                  With Use Cases
                </div>
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{stats.withUseCases}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <DollarSign className="h-4 w-4" />
                  Total EBITDA
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{formatCurrency(stats.totalEbitda)}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <TrendingUp className="h-4 w-4" />
                  Avg Priority
                </div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{stats.avgPriority.toFixed(1)}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search companies, industries, locations..."
                  value={filters.search}
                  onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
              
              {/* Sort */}
              <div className="flex items-center gap-2">
                <Select value={sortField} onValueChange={(v) => setSortField(v as SortField)}>
                  <SelectTrigger className="w-[160px]">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="priorityScore">Priority Score</SelectItem>
                    <SelectItem value="valueScore">Value Score</SelectItem>
                    <SelectItem value="readinessScore">Readiness Score</SelectItem>
                    <SelectItem value="name">Company Name</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="quadrant">Quadrant</SelectItem>
                    <SelectItem value="ebitda">EBITDA</SelectItem>
                    <SelectItem value="employees">Employees</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSortDirection(d => d === 'asc' ? 'desc' : 'asc')}
                >
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
              
              {/* Filter Toggle */}
              <Button
                variant={showFilters ? 'default' : 'outline'}
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1">{activeFilterCount}</Badge>
                )}
              </Button>
              
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
            
            {/* Expanded Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <Separator className="my-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Category Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Investment Category</label>
                      <div className="flex flex-wrap gap-2">
                        {INVESTMENT_CATEGORIES.map(cat => (
                          <Badge
                            key={cat}
                            variant={filters.categories.includes(cat) ? 'default' : 'outline'}
                            className="cursor-pointer transition-all hover:scale-105"
                            style={{
                              backgroundColor: filters.categories.includes(cat) ? getCategoryColor(cat) : undefined,
                              borderColor: getCategoryColor(cat),
                            }}
                            onClick={() => {
                              setFilters(f => ({
                                ...f,
                                categories: f.categories.includes(cat)
                                  ? f.categories.filter(c => c !== cat)
                                  : [...f.categories, cat]
                              }));
                            }}
                          >
                            {cat.replace('Energy & Energy Transition', 'Energy')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Quadrant Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Quadrant</label>
                      <div className="flex flex-wrap gap-2">
                        {QUADRANTS.map(quad => (
                          <Badge
                            key={quad}
                            variant="outline"
                            className={`cursor-pointer transition-all hover:scale-105 ${
                              filters.quadrants.includes(quad) ? getQuadrantColor(quad) : ''
                            }`}
                            onClick={() => {
                              setFilters(f => ({
                                ...f,
                                quadrants: f.quadrants.includes(quad)
                                  ? f.quadrants.filter(q => q !== quad)
                                  : [...f.quadrants, quad]
                              }));
                            }}
                          >
                            {quad}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Track Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Hold Period Track</label>
                      <div className="flex flex-wrap gap-2">
                        {[...HOLD_PERIOD_TRACKS, 'unassigned' as const].map(track => (
                          <Badge
                            key={track}
                            variant={filters.tracks.includes(track) ? 'default' : 'outline'}
                            className="cursor-pointer transition-all hover:scale-105"
                            style={{
                              backgroundColor: filters.tracks.includes(track) && track !== 'unassigned' 
                                ? getTrackColor(track) 
                                : undefined,
                            }}
                            onClick={() => {
                              setFilters(f => ({
                                ...f,
                                tracks: f.tracks.includes(track)
                                  ? f.tracks.filter(t => t !== track)
                                  : [...f.tracks, track]
                              }));
                            }}
                          >
                            {track === 'unassigned' ? 'Unassigned' : track.replace(' Accelerator', '').replace(' Enabler', '').replace(' Multiplier', '')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Use Cases Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">AI Use Cases</label>
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant={filters.hasUseCases === true ? 'default' : 'outline'}
                          className="cursor-pointer transition-all hover:scale-105 bg-amber-500/20 border-amber-500/30"
                          onClick={() => {
                            setFilters(f => ({
                              ...f,
                              hasUseCases: f.hasUseCases === true ? null : true
                            }));
                          }}
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          Has Use Cases
                        </Badge>
                        <Badge
                          variant={filters.hasUseCases === false ? 'default' : 'outline'}
                          className="cursor-pointer transition-all hover:scale-105"
                          onClick={() => {
                            setFilters(f => ({
                              ...f,
                              hasUseCases: f.hasUseCases === false ? null : false
                            }));
                          }}
                        >
                          No Use Cases
                        </Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredCompanies.length} of {companies?.length || 0} companies
        </div>

        {/* Company List */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCompanies.map((company) => (
              <CompanyGridCard
                key={company.id}
                company={company}
                hasUseCases={hasUseCases(company.companyName)}
                onUseCasesClick={() => navigateToUseCases(company.companyName)}
                getCategoryColor={getCategoryColor}
                getQuadrantColor={getQuadrantColor}
                formatCurrency={formatCurrency}
              />
            ))}
          </div>
        )}

        {viewMode === 'table' && (
          <CompanyTable
            companies={filteredCompanies}
            hasUseCases={hasUseCases}
            onUseCasesClick={navigateToUseCases}
            getCategoryColor={getCategoryColor}
            getQuadrantColor={getQuadrantColor}
            getTrackColor={getTrackColor}
            formatCurrency={formatCurrency}
            formatNumber={formatNumber}
          />
        )}

        {viewMode === 'cards' && (
          <div className="space-y-4">
            {filteredCompanies.map((company) => (
              <CompanyDetailCard
                key={company.id}
                company={company}
                hasUseCases={hasUseCases(company.companyName)}
                onUseCasesClick={() => navigateToUseCases(company.companyName)}
                expanded={expandedCompany === company.id}
                onToggle={() => setExpandedCompany(expandedCompany === company.id ? null : company.id)}
                getCategoryColor={getCategoryColor}
                getQuadrantColor={getQuadrantColor}
                getTrackColor={getTrackColor}
                formatCurrency={formatCurrency}
                formatNumber={formatNumber}
              />
            ))}
          </div>
        )}

        {filteredCompanies.length === 0 && (
          <Card className="p-12 text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No companies found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
            <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
          </Card>
        )}
      </div>
    </Layout>
  );
}

// Grid Card Component
interface CompanyGridCardProps {
  company: any;
  hasUseCases: boolean;
  onUseCasesClick: () => void;
  getCategoryColor: (cat: string) => string;
  getQuadrantColor: (quad: string | null) => string;
  formatCurrency: (val: number) => string;
}

function CompanyGridCard({ company, hasUseCases, onUseCasesClick, getCategoryColor, getQuadrantColor, formatCurrency }: CompanyGridCardProps) {
  const valueScore = Number(company.valueScore) || 0;
  const readinessScore = Number(company.readinessScore) || 0;
  const priorityScore = Number(company.priorityScore) || 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden">
        {/* Category Color Bar */}
        <div 
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: getCategoryColor(company.investmentCategory) }}
        />
        
        {/* Use Cases Indicator */}
        {hasUseCases && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUseCasesClick();
                  }}
                  className="absolute top-3 right-3 z-10"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                    className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-full p-2 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                  >
                    <Sparkles className="h-4 w-4 text-white" />
                  </motion.div>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">AI Use Cases Available</p>
                <p className="text-xs text-muted-foreground">Click to view detailed analysis</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        <CardContent className="p-4 pt-5">
          {/* Company Name */}
          <h3 className="font-semibold text-foreground mb-2 pr-10 line-clamp-2">
            {company.companyName}
          </h3>
          
          {/* Category & Quadrant */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge 
              variant="outline" 
              className="text-xs"
              style={{ 
                borderColor: getCategoryColor(company.investmentCategory),
                color: getCategoryColor(company.investmentCategory)
              }}
            >
              {company.investmentCategory.replace('Energy & Energy Transition', 'Energy')}
            </Badge>
            {company.quadrant && (
              <Badge className={`text-xs ${getQuadrantColor(company.quadrant)}`}>
                {company.quadrant}
              </Badge>
            )}
          </div>
          
          {/* Scores */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Value</div>
              <div className="font-semibold text-blue-600 dark:text-blue-400">{valueScore.toFixed(1)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Ready</div>
              <div className="font-semibold text-emerald-600 dark:text-emerald-400">{readinessScore.toFixed(1)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Priority</div>
              <div className="font-semibold text-purple-600 dark:text-purple-400">{priorityScore.toFixed(1)}</div>
            </div>
          </div>
          
          {/* Location & EBITDA */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {company.hqCity || company.hqCountry || 'N/A'}
            </div>
            <div className="font-medium text-foreground">
              {formatCurrency(Number(company.ebitda) || 0)}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Table Component
interface CompanyTableProps {
  companies: any[];
  hasUseCases: (name: string) => boolean;
  onUseCasesClick: (name: string) => void;
  getCategoryColor: (cat: string) => string;
  getQuadrantColor: (quad: string | null) => string;
  getTrackColor: (track: string | null) => string;
  formatCurrency: (val: number) => string;
  formatNumber: (val: number) => string;
}

function CompanyTable({ companies, hasUseCases, onUseCasesClick, getCategoryColor, getQuadrantColor, getTrackColor, formatCurrency, formatNumber }: CompanyTableProps) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium text-sm">Company</th>
              <th className="text-left p-3 font-medium text-sm">Category</th>
              <th className="text-left p-3 font-medium text-sm">Quadrant</th>
              <th className="text-center p-3 font-medium text-sm">Value</th>
              <th className="text-center p-3 font-medium text-sm">Readiness</th>
              <th className="text-center p-3 font-medium text-sm">Priority</th>
              <th className="text-left p-3 font-medium text-sm">Track</th>
              <th className="text-right p-3 font-medium text-sm">EBITDA</th>
              <th className="text-right p-3 font-medium text-sm">Employees</th>
              <th className="text-center p-3 font-medium text-sm">Use Cases</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, idx) => (
              <tr 
                key={company.id} 
                className={`border-b hover:bg-muted/30 transition-colors ${idx % 2 === 0 ? '' : 'bg-muted/10'}`}
              >
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-8 rounded-full"
                      style={{ backgroundColor: getCategoryColor(company.investmentCategory) }}
                    />
                    <span className="font-medium">{company.companyName}</span>
                  </div>
                </td>
                <td className="p-3">
                  <Badge 
                    variant="outline" 
                    className="text-xs"
                    style={{ 
                      borderColor: getCategoryColor(company.investmentCategory),
                      color: getCategoryColor(company.investmentCategory)
                    }}
                  >
                    {company.investmentCategory.replace('Energy & Energy Transition', 'Energy')}
                  </Badge>
                </td>
                <td className="p-3">
                  {company.quadrant && (
                    <Badge className={`text-xs ${getQuadrantColor(company.quadrant)}`}>
                      {company.quadrant}
                    </Badge>
                  )}
                </td>
                <td className="p-3 text-center">
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {(Number(company.valueScore) || 0).toFixed(1)}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {(Number(company.readinessScore) || 0).toFixed(1)}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className="font-medium text-purple-600 dark:text-purple-400">
                    {(Number(company.priorityScore) || 0).toFixed(1)}
                  </span>
                </td>
                <td className="p-3">
                  {company.track && (
                    <Badge 
                      variant="outline"
                      className="text-xs"
                      style={{ 
                        borderColor: getTrackColor(company.track),
                        color: getTrackColor(company.track)
                      }}
                    >
                      {company.track.replace(' Accelerator', '').replace(' Enabler', '').replace(' Multiplier', '')}
                    </Badge>
                  )}
                </td>
                <td className="p-3 text-right font-medium">
                  {formatCurrency(Number(company.ebitda) || 0)}
                </td>
                <td className="p-3 text-right">
                  {formatNumber(company.employees || 0)}
                </td>
                <td className="p-3 text-center">
                  {hasUseCases(company.companyName) ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => onUseCasesClick(company.companyName)}
                            className="inline-flex items-center justify-center"
                          >
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-full p-1.5 cursor-pointer"
                            >
                              <Sparkles className="h-3 w-3 text-white" />
                            </motion.div>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Click to view AI Use Cases</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// Detail Card Component
interface CompanyDetailCardProps {
  company: any;
  hasUseCases: boolean;
  onUseCasesClick: () => void;
  expanded: boolean;
  onToggle: () => void;
  getCategoryColor: (cat: string) => string;
  getQuadrantColor: (quad: string | null) => string;
  getTrackColor: (track: string | null) => string;
  formatCurrency: (val: number) => string;
  formatNumber: (val: number) => string;
}

function CompanyDetailCard({ 
  company, 
  hasUseCases, 
  onUseCasesClick, 
  expanded, 
  onToggle,
  getCategoryColor, 
  getQuadrantColor, 
  getTrackColor,
  formatCurrency,
  formatNumber
}: CompanyDetailCardProps) {
  const valueScore = Number(company.valueScore) || 0;
  const readinessScore = Number(company.readinessScore) || 0;
  const priorityScore = Number(company.priorityScore) || 0;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        {/* Category Color Bar */}
        <div 
          className="h-1"
          style={{ backgroundColor: getCategoryColor(company.investmentCategory) }}
        />
        
        <Collapsible open={expanded} onOpenChange={onToggle}>
          <CollapsibleTrigger asChild>
            <div className="p-4 cursor-pointer hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Expand Icon */}
                  <div className="text-muted-foreground">
                    {expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  </div>
                  
                  {/* Company Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{company.companyName}</h3>
                      {hasUseCases && (
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUseCasesClick();
                          }}
                          whileHover={{ scale: 1.1 }}
                          className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-full p-1.5"
                        >
                          <Sparkles className="h-3 w-3 text-white" />
                        </motion.button>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        style={{ 
                          borderColor: getCategoryColor(company.investmentCategory),
                          color: getCategoryColor(company.investmentCategory)
                        }}
                      >
                        {company.investmentCategory}
                      </Badge>
                      {company.quadrant && (
                        <Badge className={`text-xs ${getQuadrantColor(company.quadrant)}`}>
                          {company.quadrant}
                        </Badge>
                      )}
                      {company.track && (
                        <Badge 
                          variant="outline"
                          className="text-xs"
                          style={{ 
                            borderColor: getTrackColor(company.track),
                            color: getTrackColor(company.track)
                          }}
                        >
                          {company.track}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Value</div>
                    <div className="font-semibold text-blue-600 dark:text-blue-400">{valueScore.toFixed(1)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Readiness</div>
                    <div className="font-semibold text-emerald-600 dark:text-emerald-400">{readinessScore.toFixed(1)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Priority</div>
                    <div className="font-semibold text-purple-600 dark:text-purple-400">{priorityScore.toFixed(1)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">EBITDA</div>
                    <div className="font-semibold">{formatCurrency(Number(company.ebitda) || 0)}</div>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <Separator />
            <div className="p-4 bg-muted/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Company Information */}
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-3 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Company Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Industry</span>
                      <span className="font-medium">{company.industryVertical || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sector</span>
                      <span className="font-medium">{company.detailedSector || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location</span>
                      <span className="font-medium">
                        {[company.hqCity, company.hqState, company.hqCountry].filter(Boolean).join(', ') || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Employees</span>
                      <span className="font-medium">{formatNumber(company.employees || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Revenue</span>
                      <span className="font-medium">
                        {formatCurrency(Number(company.annualRevenue) || 0)}
                        {company.revenueEstimated && <span className="text-xs text-muted-foreground ml-1">(est.)</span>}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Investment Date</span>
                      <span className="font-medium">{company.investmentDate || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                {/* IFM Matrix Scores */}
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    IFM Matrix Scores
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">EBITDA Impact</span>
                      <ScoreBar value={Number(company.ebitdaImpact) || 0} color="blue" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Revenue Enablement</span>
                      <ScoreBar value={Number(company.revenueEnablement) || 0} color="green" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Risk Reduction</span>
                      <ScoreBar value={Number(company.riskReduction) || 0} color="amber" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Org Capacity</span>
                      <ScoreBar value={Number(company.organizationalCapacity) || 0} color="purple" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Data Availability</span>
                      <ScoreBar value={Number(company.dataAvailability) || 0} color="cyan" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Tech Infrastructure</span>
                      <ScoreBar value={Number(company.techInfrastructure) || 0} color="pink" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Timeline Fit</span>
                      <ScoreBar value={Number(company.timelineFit) || 0} color="orange" />
                    </div>
                  </div>
                </div>
                
                {/* Value Amplification & Hold Period */}
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Value Amplification
                  </h4>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform Classification</span>
                      <span className="font-medium">{company.platformClassification || 'Unassigned'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Replication Potential</span>
                      <ScoreBar value={Number(company.replicationPotential) || 0} color="emerald" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Adjusted EBITDA</span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(Number(company.adjustedEbitda) || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Portfolio Adj. Priority</span>
                      <span className="font-medium text-purple-600 dark:text-purple-400">
                        {formatCurrency(Number(company.portfolioAdjustedPriority) || 0)}
                      </span>
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-sm text-muted-foreground mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Hold Period Planning
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Track Assignment</span>
                      <span className="font-medium">{company.track || 'Unassigned'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stonepeak Category</span>
                      <span className="font-medium">{company.stonepeakCategory || 'N/A'}</span>
                    </div>
                  </div>
                  
                  {/* Use Cases Button */}
                  {hasUseCases && (
                    <Button 
                      onClick={onUseCasesClick}
                      className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      View AI Use Cases
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </motion.div>
  );
}

// Score Bar Component
function ScoreBar({ value, color }: { value: number; color: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    amber: 'bg-amber-500',
    purple: 'bg-purple-500',
    cyan: 'bg-cyan-500',
    pink: 'bg-pink-500',
    orange: 'bg-orange-500',
    emerald: 'bg-emerald-500',
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClasses[color]} rounded-full transition-all duration-500`}
          style={{ width: `${(value / 10) * 100}%` }}
        />
      </div>
      <span className="font-medium w-6 text-right">{value.toFixed(1)}</span>
    </div>
  );
}
