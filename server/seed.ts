import { drizzle } from "drizzle-orm/mysql2";
import { companies } from "../drizzle/schema";
import { calculateAllScores, type CompanyInputScores } from "./calculations";
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
  value_score: number;
  readiness_score: number;
  priority_score: number;
  ebitda: number;
  adjusted_ebitda: number;
  adjusted_priority: number;
}

// Assign themes based on company characteristics
function assignTheme(company: RawCompanyData): string | null {
  const valueScore = company.value_score;
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

export async function seedDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set");
    return;
  }
  
  const db = drizzle(process.env.DATABASE_URL);
  
  console.log(`Seeding ${portfolioData.length} companies...`);
  
  for (const raw of portfolioData as RawCompanyData[]) {
    // Calculate scores using our engine
    const inputScores: CompanyInputScores = {
      ebitdaImpact: raw.ebitda_impact,
      revenueEnablement: raw.revenue_enablement,
      riskReduction: raw.risk_reduction,
      organizationalCapacity: raw.organizational_capacity,
      dataAvailability: raw.data_availability,
      techInfrastructure: raw.tech_infrastructure,
      timelineFit: raw.timeline_fit,
      ebitda: raw.ebitda,
      replicationPotential: estimateReplicationPotential(raw),
    };
    
    const calculated = calculateAllScores(inputScores);
    const theme = assignTheme(raw);
    const track = assignTrack(raw);
    const replicationPotential = estimateReplicationPotential(raw);
    const platformClassification = determinePlatformClassification(replicationPotential);
    
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
        ebitdaImpact: String(raw.ebitda_impact),
        revenueEnablement: String(raw.revenue_enablement),
        riskReduction: String(raw.risk_reduction),
        organizationalCapacity: String(raw.organizational_capacity),
        dataAvailability: String(raw.data_availability),
        techInfrastructure: String(raw.tech_infrastructure),
        timelineFit: String(raw.timeline_fit),
        valueScore: String(calculated.valueScore),
        readinessScore: String(calculated.readinessScore),
        priorityScore: String(calculated.priorityScore),
        adjustedEbitda: String(calculated.adjustedEbitda),
        adjustedPriority: String(calculated.adjustedPriority),
        theme,
        track,
        replicationPotential: String(replicationPotential),
        platformClassification,
        portfolioAdjustedPriority: String(calculated.portfolioAdjustedPriority),
        quadrant: calculated.quadrant,
      });
      
      console.log(`✓ Seeded: ${raw.company_name}`);
    } catch (error) {
      console.error(`✗ Failed to seed ${raw.company_name}:`, error);
    }
  }
  
  console.log("Seeding complete!");
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
  });
}
