import { drizzle } from "drizzle-orm/mysql2";
import { companies } from "../drizzle/schema";
import { determineQuadrant } from "./calculations";
import portfolioData from "../shared/portfolio-data.json";

interface RawCompanyData {
  company_name: string;
  investment_category: string;
  employees: number;
  annual_revenue: number;
  revenue_estimated: string;
  industry_vertical: string;
  detailed_sector: string;
  stonepeak_category: string;
  hq_city: string;
  hq_state: string;
  hq_country: string;
  investment_date: string;
  ebitda_impact: number;
  revenue_enablement: number;
  risk_reduction: number;
  organizational_capacity: number;
  data_availability: number;
  tech_infrastructure: number;
  org_capacity_dup: number;
  timeline_fit: number;
  // Pre-calculated scores from Excel (source of truth)
  value_score: number;
  readiness_score: number;
  priority_score: number;
  ebitda: number;
  adjusted_ebitda: number;
  adjusted_priority: number;
}

// Assign themes based on company characteristics
function assignTheme(company: RawCompanyData): string | null {
  const revenueEnablement = company.revenue_enablement;
  const ebitdaImpact = company.ebitda_impact;
  
  // High revenue enablement suggests Revenue Growth focus
  if (revenueEnablement >= 7) return 'Revenue Growth';
  // High EBITDA impact with moderate revenue suggests Margin Expansion
  if (ebitdaImpact >= 7 && revenueEnablement < 7) return 'Margin Expansion';
  // Otherwise Cost Cutting
  return 'Cost Cutting';
}

// Assign tracks based on timeline and value scores
function assignTrack(company: RawCompanyData): string | null {
  const timelineFit = company.timeline_fit;
  const valueScore = company.value_score;
  
  // Early timeline + high value = EBITDA Accelerator
  if (timelineFit >= 7 && valueScore >= 7) return 'EBITDA Accelerator';
  // Medium timeline = Growth Enabler
  if (timelineFit >= 5 && timelineFit < 8) return 'Growth Enabler';
  // Long timeline or high strategic value = Exit Multiplier
  return 'Exit Multiplier';
}

// Estimate replication potential based on category and tech infrastructure
function estimateReplicationPotential(company: RawCompanyData): number {
  const techScore = company.tech_infrastructure;
  const category = company.investment_category;
  
  // Digital Infrastructure has higher replication potential
  let base = techScore;
  if (category === 'Digital Infrastructure') base += 1;
  if (category === 'Transport & Logistics') base += 0.5;
  
  return Math.min(10, Math.max(1, Math.round(base)));
}

// Determine platform classification
function determinePlatformClassification(replicationPotential: number): string {
  return replicationPotential >= 7 ? 'Platform Play' : 'Point Solution';
}

// Calculate Portfolio-Adjusted Priority
function calculatePortfolioAdjustedPriority(
  adjustedPriority: number,
  replicationPotential: number
): number {
  const replicationMultiplier = 0.10;
  return adjustedPriority * (1 + (replicationPotential * replicationMultiplier));
}

export async function seedDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set");
    return;
  }
  
  const db = drizzle(process.env.DATABASE_URL);
  
  // Clear existing data
  console.log("Clearing existing company data...");
  await db.delete(companies);
  
  console.log(`Seeding ${portfolioData.length} companies with Excel source data...`);
  
  for (const raw of portfolioData as RawCompanyData[]) {
    const theme = assignTheme(raw);
    const track = assignTrack(raw);
    const replicationPotential = estimateReplicationPotential(raw);
    const platformClassification = determinePlatformClassification(replicationPotential);
    
    // Use Excel's pre-calculated scores as source of truth
    const valueScore = raw.value_score;
    const readinessScore = raw.readiness_score;
    const priorityScore = raw.priority_score;
    const adjustedEbitda = raw.adjusted_ebitda;
    const adjustedPriority = raw.adjusted_priority;
    
    // Calculate portfolio-adjusted priority
    const portfolioAdjustedPriority = calculatePortfolioAdjustedPriority(
      adjustedPriority,
      replicationPotential
    );
    
    // Determine quadrant using Excel's calculated scores
    const quadrant = determineQuadrant(valueScore, readinessScore);
    
    try {
      await db.insert(companies).values({
        companyName: raw.company_name,
        investmentCategory: raw.investment_category,
        employees: raw.employees,
        annualRevenue: String(raw.annual_revenue),
        revenueEstimated: raw.revenue_estimated === 'Est.',
        industryVertical: raw.industry_vertical,
        detailedSector: raw.detailed_sector,
        stonepeakCategory: raw.stonepeak_category,
        hqCity: raw.hq_city,
        hqState: raw.hq_state || '',
        hqCountry: raw.hq_country,
        investmentDate: raw.investment_date,
        ebitda: String(raw.ebitda),
        // Input scores
        ebitdaImpact: String(raw.ebitda_impact),
        revenueEnablement: String(raw.revenue_enablement),
        riskReduction: String(raw.risk_reduction),
        organizationalCapacity: String(raw.organizational_capacity),
        dataAvailability: String(raw.data_availability),
        techInfrastructure: String(raw.tech_infrastructure),
        timelineFit: String(raw.timeline_fit),
        // Use Excel's pre-calculated scores (source of truth)
        valueScore: String(valueScore),
        readinessScore: String(readinessScore),
        priorityScore: String(priorityScore),
        adjustedEbitda: String(adjustedEbitda),
        adjustedPriority: String(adjustedPriority),
        // Derived values
        theme,
        track,
        replicationPotential: String(replicationPotential),
        platformClassification,
        portfolioAdjustedPriority: String(portfolioAdjustedPriority),
        quadrant,
      });
      
      console.log(`✓ Seeded: ${raw.company_name} (${quadrant}, Value: ${valueScore.toFixed(2)}, Readiness: ${readinessScore.toFixed(2)})`);
    } catch (error) {
      console.error(`✗ Failed to seed ${raw.company_name}:`, error);
    }
  }
  
  console.log("\nSeeding complete!");
  console.log(`Total companies seeded: ${portfolioData.length}`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
  });
}
