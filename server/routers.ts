import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { calculateAllScores, getFormulaDocumentation, type CompanyInputScores } from "./calculations";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";
import { INVESTMENT_CATEGORIES, HOLD_PERIOD_TRACKS, QUADRANT_THRESHOLD } from "../shared/stonepeak";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============ Companies Router ============
  companies: router({
    list: publicProcedure.query(async () => {
      return db.getAllCompanies();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getCompanyById(input.id);
      }),
    
    getByCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return db.getCompaniesByCategory(input.category);
      }),
    
    getByQuadrant: publicProcedure
      .input(z.object({ quadrant: z.string() }))
      .query(async ({ input }) => {
        return db.getCompaniesByQuadrant(input.quadrant);
      }),
    
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          ebitdaImpact: z.string().optional(),
          revenueEnablement: z.string().optional(),
          riskReduction: z.string().optional(),
          organizationalCapacity: z.string().optional(),
          dataAvailability: z.string().optional(),
          techInfrastructure: z.string().optional(),
          timelineFit: z.string().optional(),
          ebitda: z.string().optional(),
          theme: z.string().nullable().optional(),
          track: z.string().nullable().optional(),
          replicationPotential: z.string().optional(),
          platformClassification: z.string().nullable().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        const oldCompany = await db.getCompanyById(input.id);
        const updated = await db.updateCompany(input.id, input.data, 1);
        
        // Check if company moved to Champions quadrant
        if (oldCompany && oldCompany.quadrant !== 'Champions' && updated.quadrant === 'Champions') {
          await notifyOwner({
            title: `New Champion: ${updated.companyName}`,
            content: `${updated.companyName} has moved to the Champions quadrant with a Priority Score of ${updated.priorityScore} and Adjusted Priority of $${Number(updated.adjustedPriority).toLocaleString()}.`,
          });
        }
        
        return updated;
      }),
    
    bulkUpdate: publicProcedure
      .input(z.object({
        updates: z.array(z.object({
          id: z.number(),
          data: z.record(z.string(), z.any()),
        })),
      }))
      .mutation(async ({ input }) => {
        await db.bulkUpdateCompanies(input.updates);
        return { success: true };
      }),
  }),

  // ============ Portfolio Metrics Router ============
  portfolio: router({
    metrics: publicProcedure.query(async () => {
      return db.getPortfolioMetrics();
    }),
    
    formulas: publicProcedure.query(() => {
      return getFormulaDocumentation();
    }),
    
    calculate: publicProcedure
      .input(z.object({
        ebitdaImpact: z.number().min(1).max(10),
        revenueEnablement: z.number().min(1).max(10),
        riskReduction: z.number().min(1).max(10),
        organizationalCapacity: z.number().min(1).max(10),
        dataAvailability: z.number().min(1).max(10),
        techInfrastructure: z.number().min(1).max(10),
        timelineFit: z.number().min(1).max(10),
        ebitda: z.number(),
        replicationPotential: z.number().min(1).max(10).optional(),
      }))
      .query(({ input }) => {
        const scores: CompanyInputScores = {
          ...input,
          replicationPotential: input.replicationPotential ?? 5,
        };
        return calculateAllScores(scores);
      }),
  }),

  // ============ Scenarios Router ============
  scenarios: router({
    list: publicProcedure.query(async () => {
      return db.getUserScenarios(1);
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getScenarioById(input.id);
      }),
    
    create: publicProcedure
      .input(z.object({
        name: z.string().min(1).max(255),
        description: z.string().optional(),
        companyData: z.record(z.string(), z.any()).optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createScenario({
          userId: 1,
          name: input.name,
          description: input.description ?? null,
          companyData: input.companyData ?? {},
        });
      }),
    
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        companyData: z.record(z.string(), z.any()).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateScenario(id, data);
      }),
    
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteScenario(input.id);
        return { success: true };
      }),
  }),

  // ============ Audit Logs Router ============
  audit: router({
    getByCompany: publicProcedure
      .input(z.object({ companyId: z.number() }))
      .query(async ({ input }) => {
        return db.getCompanyAuditLogs(input.companyId);
      }),
  }),

  // ============ AI Insights Router ============
  ai: router({
    getInsights: publicProcedure
      .input(z.object({ companyId: z.number().optional(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        if (input.companyId) {
          return db.getCompanyInsights(input.companyId);
        }
        return db.getRecentInsights(input.limit ?? 10);
      }),
    
    generateInsight: publicProcedure
      .input(z.object({ companyId: z.number() }))
      .mutation(async ({ input }) => {
        const company = await db.getCompanyById(input.companyId);
        if (!company) throw new Error("Company not found");
        
        const prompt = `You are an expert private equity AI advisor analyzing portfolio companies. Generate a concise, actionable insight for the following company:

Company: ${company.companyName}
Category: ${company.investmentCategory}
Value Score: ${company.valueScore}/10
Readiness Score: ${company.readinessScore}/10
Priority Score: ${company.priorityScore}/10
Quadrant: ${company.quadrant}
EBITDA: $${Number(company.ebitda).toLocaleString()}
Adjusted EBITDA Impact: $${Number(company.adjustedEbitda).toLocaleString()}
Theme: ${company.theme || 'Not assigned'}
Track: ${company.track || 'Not assigned'}

Based on this data, provide:
1. A brief assessment of the company's AI readiness
2. One specific recommendation for AI investment
3. Any risks or considerations

Keep the response under 150 words. Be direct and actionable like a McKinsey consultant.`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: "You are an expert private equity AI advisor. Write in a professional, concise style." },
            { role: "user", content: prompt },
          ],
        });
        
        const rawContent = response.choices[0]?.message?.content;
        const content = typeof rawContent === 'string' ? rawContent : "Unable to generate insight";
        
        // Determine insight type based on quadrant
        let insightType = 'recommendation';
        if (company.quadrant === 'Champions') insightType = 'opportunity';
        else if (company.quadrant === 'Foundations') insightType = 'risk';
        
        const insight = await db.createAIInsight({
          companyId: company.id,
          insightType,
          title: `AI Analysis: ${company.companyName}`,
          content,
          priority: company.quadrant === 'Champions' ? 'high' : company.quadrant === 'Quick Wins' ? 'medium' : 'low',
        });
        
        return insight;
      }),
    
    query: publicProcedure
      .input(z.object({ question: z.string() }))
      .mutation(async ({ input }) => {
        const companies = await db.getAllCompanies();
        const metrics = await db.getPortfolioMetrics();
        
        const context = `Portfolio Overview:
- Total Companies: ${metrics?.totalCompanies}
- Total Adjusted EBITDA Impact: $${metrics?.totalAdjustedEbitda?.toLocaleString()}
- Champions: ${metrics?.championsCount}
- Quick Wins: ${metrics?.quickWinsCount}
- Average Value Score: ${metrics?.avgValueScore}
- Average Readiness Score: ${metrics?.avgReadinessScore}

Top 5 Companies by Adjusted Priority:
${companies.slice(0, 5).map((c, i) => `${i + 1}. ${c.companyName} (${c.investmentCategory}) - Priority: ${c.priorityScore}, Adjusted Priority: $${Number(c.adjustedPriority).toLocaleString()}`).join('\n')}

Categories: ${INVESTMENT_CATEGORIES.join(', ')}
Quadrant Threshold: ${QUADRANT_THRESHOLD} (70%)`;

        const response = await invokeLLM({
          messages: [
            { 
              role: "system", 
              content: `You are an AI assistant for the StonePeak Portfolio Intelligence Platform. You help users understand their private equity portfolio and AI investment priorities. Answer questions based on the portfolio data provided. Be concise and data-driven.

${context}` 
            },
            { role: "user", content: input.question },
          ],
        });
        
        const answerContent = response.choices[0]?.message?.content;
        const answer = typeof answerContent === 'string' ? answerContent : "I couldn't process your question. Please try again.";
        return {
          answer,
          context: metrics,
        };
      }),
    
    markAsRead: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.markInsightAsRead(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
