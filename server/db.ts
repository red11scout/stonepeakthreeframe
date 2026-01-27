import { eq, desc, asc, and, gte, lte, like, inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, companies, scenarios, auditLogs, aiInsights, type Company, type InsertCompany, type Scenario, type InsertScenario, type AuditLog, type InsertAuditLog, type AIInsight, type InsertAIInsight } from "../drizzle/schema";
import { ENV } from './_core/env';
import { calculateAllScores, type CompanyInputScores } from './calculations';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ Company Operations ============

export async function getAllCompanies(): Promise<Company[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(companies).orderBy(desc(companies.adjustedPriority));
  return result;
}

export async function getCompanyById(id: number): Promise<Company | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(companies).where(eq(companies.id, id)).limit(1);
  return result[0];
}

export async function getCompaniesByCategory(category: string): Promise<Company[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(companies).where(eq(companies.investmentCategory, category));
}

export async function getCompaniesByQuadrant(quadrant: string): Promise<Company[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(companies).where(eq(companies.quadrant, quadrant));
}

export async function createCompany(data: InsertCompany): Promise<Company> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Calculate scores before inserting
  const inputScores: CompanyInputScores = {
    ebitdaImpact: Number(data.ebitdaImpact) || 5,
    revenueEnablement: Number(data.revenueEnablement) || 5,
    riskReduction: Number(data.riskReduction) || 5,
    organizationalCapacity: Number(data.organizationalCapacity) || 5,
    dataAvailability: Number(data.dataAvailability) || 5,
    techInfrastructure: Number(data.techInfrastructure) || 5,
    timelineFit: Number(data.timelineFit) || 5,
    ebitda: Number(data.ebitda) || 0,
    replicationPotential: Number(data.replicationPotential) || 5,
  };
  
  const calculated = calculateAllScores(inputScores);
  
  const insertData = {
    ...data,
    valueScore: String(calculated.valueScore),
    readinessScore: String(calculated.readinessScore),
    priorityScore: String(calculated.priorityScore),
    adjustedEbitda: String(calculated.adjustedEbitda),
    adjustedPriority: String(calculated.adjustedPriority),
    portfolioAdjustedPriority: String(calculated.portfolioAdjustedPriority),
    quadrant: calculated.quadrant,
  };
  
  const result = await db.insert(companies).values(insertData);
  const insertedId = result[0].insertId;
  
  const company = await getCompanyById(insertedId);
  if (!company) throw new Error("Failed to create company");
  
  return company;
}

export async function updateCompany(id: number, data: Partial<InsertCompany>, userId?: number): Promise<Company> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Get current company for audit log
  const current = await getCompanyById(id);
  if (!current) throw new Error("Company not found");
  
  // Merge with existing data and recalculate
  const inputScores: CompanyInputScores = {
    ebitdaImpact: Number(data.ebitdaImpact ?? current.ebitdaImpact) || 5,
    revenueEnablement: Number(data.revenueEnablement ?? current.revenueEnablement) || 5,
    riskReduction: Number(data.riskReduction ?? current.riskReduction) || 5,
    organizationalCapacity: Number(data.organizationalCapacity ?? current.organizationalCapacity) || 5,
    dataAvailability: Number(data.dataAvailability ?? current.dataAvailability) || 5,
    techInfrastructure: Number(data.techInfrastructure ?? current.techInfrastructure) || 5,
    timelineFit: Number(data.timelineFit ?? current.timelineFit) || 5,
    ebitda: Number(data.ebitda ?? current.ebitda) || 0,
    replicationPotential: Number(data.replicationPotential ?? current.replicationPotential) || 5,
  };
  
  const calculated = calculateAllScores(inputScores);
  
  const updateData = {
    ...data,
    valueScore: String(calculated.valueScore),
    readinessScore: String(calculated.readinessScore),
    priorityScore: String(calculated.priorityScore),
    adjustedEbitda: String(calculated.adjustedEbitda),
    adjustedPriority: String(calculated.adjustedPriority),
    portfolioAdjustedPriority: String(calculated.portfolioAdjustedPriority),
    quadrant: calculated.quadrant,
  };
  
  await db.update(companies).set(updateData).where(eq(companies.id, id));
  
  // Create audit log entries for changed fields
  if (userId) {
    const changedFields = Object.keys(data) as (keyof typeof data)[];
    for (const field of changedFields) {
      const oldValue = String(current[field as keyof Company] ?? '');
      const newValue = String(data[field] ?? '');
      if (oldValue !== newValue) {
        await createAuditLog({
          userId,
          companyId: id,
          field,
          oldValue,
          newValue,
        });
      }
    }
  }
  
  const updated = await getCompanyById(id);
  if (!updated) throw new Error("Failed to update company");
  
  return updated;
}

export async function bulkUpdateCompanies(updates: { id: number; data: Partial<InsertCompany> }[]): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  for (const { id, data } of updates) {
    await updateCompany(id, data);
  }
}

export async function getCompanyCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  
  const result = await db.select({ count: sql<number>`count(*)` }).from(companies);
  return result[0]?.count ?? 0;
}

// ============ Scenario Operations ============

export async function getUserScenarios(userId: number): Promise<Scenario[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(scenarios).where(eq(scenarios.userId, userId)).orderBy(desc(scenarios.updatedAt));
}

export async function getScenarioById(id: number): Promise<Scenario | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(scenarios).where(eq(scenarios.id, id)).limit(1);
  return result[0];
}

export async function createScenario(data: InsertScenario): Promise<Scenario> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(scenarios).values(data);
  const insertedId = result[0].insertId;
  
  const scenario = await getScenarioById(insertedId);
  if (!scenario) throw new Error("Failed to create scenario");
  
  return scenario;
}

export async function updateScenario(id: number, data: Partial<InsertScenario>): Promise<Scenario> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(scenarios).set(data).where(eq(scenarios.id, id));
  
  const updated = await getScenarioById(id);
  if (!updated) throw new Error("Failed to update scenario");
  
  return updated;
}

export async function deleteScenario(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(scenarios).where(eq(scenarios.id, id));
}

// ============ Audit Log Operations ============

export async function createAuditLog(data: InsertAuditLog): Promise<AuditLog> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(auditLogs).values(data);
  const insertedId = result[0].insertId;
  
  const log = await db.select().from(auditLogs).where(eq(auditLogs.id, insertedId)).limit(1);
  if (!log[0]) throw new Error("Failed to create audit log");
  
  return log[0];
}

export async function getCompanyAuditLogs(companyId: number): Promise<AuditLog[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(auditLogs).where(eq(auditLogs.companyId, companyId)).orderBy(desc(auditLogs.createdAt));
}

// ============ AI Insights Operations ============

export async function createAIInsight(data: InsertAIInsight): Promise<AIInsight> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(aiInsights).values(data);
  const insertedId = result[0].insertId;
  
  const insight = await db.select().from(aiInsights).where(eq(aiInsights.id, insertedId)).limit(1);
  if (!insight[0]) throw new Error("Failed to create AI insight");
  
  return insight[0];
}

export async function getCompanyInsights(companyId: number): Promise<AIInsight[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(aiInsights).where(eq(aiInsights.companyId, companyId)).orderBy(desc(aiInsights.createdAt));
}

export async function getRecentInsights(limit: number = 10): Promise<AIInsight[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(aiInsights).orderBy(desc(aiInsights.createdAt)).limit(limit);
}

export async function markInsightAsRead(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.update(aiInsights).set({ isRead: true }).where(eq(aiInsights.id, id));
}

// ============ Portfolio Metrics ============

export async function getPortfolioMetrics() {
  const db = await getDb();
  if (!db) return null;
  
  const allCompanies = await getAllCompanies();
  
  if (allCompanies.length === 0) return null;
  
  const totalEbitda = allCompanies.reduce((sum, c) => sum + Number(c.ebitda || 0), 0);
  const totalAdjustedEbitda = allCompanies.reduce((sum, c) => sum + Number(c.adjustedEbitda || 0), 0);
  const totalAdjustedPriority = allCompanies.reduce((sum, c) => sum + Number(c.adjustedPriority || 0), 0);
  
  const avgValueScore = allCompanies.reduce((sum, c) => sum + Number(c.valueScore || 0), 0) / allCompanies.length;
  const avgReadinessScore = allCompanies.reduce((sum, c) => sum + Number(c.readinessScore || 0), 0) / allCompanies.length;
  const avgPriorityScore = allCompanies.reduce((sum, c) => sum + Number(c.priorityScore || 0), 0) / allCompanies.length;
  
  const champions = allCompanies.filter(c => c.quadrant === 'Champions');
  const quickWins = allCompanies.filter(c => c.quadrant === 'Quick Wins');
  const strategic = allCompanies.filter(c => c.quadrant === 'Strategic');
  const foundations = allCompanies.filter(c => c.quadrant === 'Foundations');
  
  const championsValue = champions.reduce((sum, c) => sum + Number(c.adjustedPriority || 0), 0);
  
  // Count by category
  const byCategory: Record<string, number> = {};
  allCompanies.forEach(c => {
    byCategory[c.investmentCategory] = (byCategory[c.investmentCategory] || 0) + 1;
  });
  
  // Count by theme
  const byTheme: Record<string, number> = {};
  allCompanies.forEach(c => {
    if (c.theme) {
      byTheme[c.theme] = (byTheme[c.theme] || 0) + 1;
    }
  });
  
  // Count by track
  const byTrack: Record<string, number> = {};
  allCompanies.forEach(c => {
    if (c.track) {
      byTrack[c.track] = (byTrack[c.track] || 0) + 1;
    }
  });
  
  return {
    totalCompanies: allCompanies.length,
    totalEbitda,
    totalAdjustedEbitda,
    totalAdjustedPriority,
    avgValueScore: Math.round(avgValueScore * 100) / 100,
    avgReadinessScore: Math.round(avgReadinessScore * 100) / 100,
    avgPriorityScore: Math.round(avgPriorityScore * 100) / 100,
    championsCount: champions.length,
    championsValue,
    quickWinsCount: quickWins.length,
    strategicCount: strategic.length,
    foundationsCount: foundations.length,
    byCategory,
    byTheme,
    byTrack,
    topCompanies: allCompanies.slice(0, 10),
  };
}
