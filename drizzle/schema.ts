import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, json, boolean } from "drizzle-orm/mysql-core";

// Users table (from template)
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Companies table - stores all portfolio companies
export const companies = mysqlTable("companies", {
  id: int("id").autoincrement().primaryKey(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  investmentCategory: varchar("investmentCategory", { length: 100 }).notNull(),
  employees: int("employees").default(0),
  annualRevenue: decimal("annualRevenue", { precision: 20, scale: 2 }).default("0"),
  revenueEstimated: boolean("revenueEstimated").default(false),
  industryVertical: varchar("industryVertical", { length: 255 }),
  detailedSector: varchar("detailedSector", { length: 255 }),
  stonepeakCategory: varchar("stonepeakCategory", { length: 255 }),
  hqCity: varchar("hqCity", { length: 100 }),
  hqState: varchar("hqState", { length: 100 }),
  hqCountry: varchar("hqCountry", { length: 100 }),
  investmentDate: varchar("investmentDate", { length: 50 }),
  ebitda: decimal("ebitda", { precision: 20, scale: 2 }).default("0"),
  
  // Input Scores (1-10)
  ebitdaImpact: decimal("ebitdaImpact", { precision: 4, scale: 2 }).default("5"),
  revenueEnablement: decimal("revenueEnablement", { precision: 4, scale: 2 }).default("5"),
  riskReduction: decimal("riskReduction", { precision: 4, scale: 2 }).default("5"),
  organizationalCapacity: decimal("organizationalCapacity", { precision: 4, scale: 2 }).default("5"),
  dataAvailability: decimal("dataAvailability", { precision: 4, scale: 2 }).default("5"),
  techInfrastructure: decimal("techInfrastructure", { precision: 4, scale: 2 }).default("5"),
  timelineFit: decimal("timelineFit", { precision: 4, scale: 2 }).default("5"),
  
  // Calculated Scores (computed by HyperFormula)
  valueScore: decimal("valueScore", { precision: 6, scale: 4 }).default("0"),
  readinessScore: decimal("readinessScore", { precision: 6, scale: 4 }).default("0"),
  priorityScore: decimal("priorityScore", { precision: 6, scale: 4 }).default("0"),
  adjustedEbitda: decimal("adjustedEbitda", { precision: 20, scale: 2 }).default("0"),
  adjustedPriority: decimal("adjustedPriority", { precision: 20, scale: 2 }).default("0"),
  
  // Assignments
  theme: varchar("theme", { length: 50 }),
  track: varchar("track", { length: 50 }),
  replicationPotential: decimal("replicationPotential", { precision: 4, scale: 2 }).default("5"),
  platformClassification: varchar("platformClassification", { length: 50 }),
  portfolioAdjustedPriority: decimal("portfolioAdjustedPriority", { precision: 20, scale: 2 }).default("0"),
  
  // Quadrant (computed)
  quadrant: varchar("quadrant", { length: 50 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Company = typeof companies.$inferSelect;
export type InsertCompany = typeof companies.$inferInsert;

// Scenarios table - for save/load functionality
export const scenarios = mysqlTable("scenarios", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  companyData: json("companyData").$type<Record<number, Partial<Company>>>(),
  isDefault: boolean("isDefault").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Scenario = typeof scenarios.$inferSelect;
export type InsertScenario = typeof scenarios.$inferInsert;

// Audit logs - track all changes
export const auditLogs = mysqlTable("auditLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  companyId: int("companyId").notNull(),
  field: varchar("field", { length: 100 }).notNull(),
  oldValue: text("oldValue"),
  newValue: text("newValue"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

// AI Insights - store generated insights
export const aiInsights = mysqlTable("aiInsights", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId"),
  insightType: varchar("insightType", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  priority: varchar("priority", { length: 20 }).default("medium"),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AIInsight = typeof aiInsights.$inferSelect;
export type InsertAIInsight = typeof aiInsights.$inferInsert;
