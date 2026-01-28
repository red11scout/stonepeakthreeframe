# BlueAlly AI - Portfolio Intelligence Platform

A world-class AI-powered portfolio intelligence platform for analyzing and optimizing investment portfolios across three strategic frameworks.

## Overview

This platform provides comprehensive AI transformation assessments for 55 portfolio companies, featuring:

- **$1.9B** in identified AI opportunities
- **170** AI use cases across **17** tier-one companies
- **Three Strategic Frameworks** for portfolio optimization

## Features

### 1. Value-Readiness Matrix (Framework 1)
- Interactive scatter plot visualization
- Value Score (EBITDA 50%, Revenue 25%, Risk 25%)
- Readiness Score (Org 35%, Data 35%, Tech 20%, Timeline 10%)
- Four-quadrant classification with 70% threshold

### 2. Portfolio Amplification Model (Framework 2)
- Replication potential scoring (1-10 scale)
- Platform Play vs Point Solution classification
- Portfolio-Adjusted Priority calculations
- Cross-portfolio synergy analysis

### 3. Hold Period Value Capture Model (Framework 3)
- Three value tracks: EBITDA Accelerators, Growth Enablers, Exit Multipliers
- Phase-gate timeline (Year 0-4+)
- Investment allocation modeling
- 25% constraint rule enforcement

### 4. AI Use Cases Tab
- Comprehensive assessments for 17 companies
- 8 detailed sections per company:
  - Company Overview
  - Strategic Anchoring
  - Business Functions
  - Friction Points
  - AI Use Cases
  - Benefits Quantification
  - Effort & Token Model
  - Priority Roadmap

### 5. Additional Features
- Executive Dashboard with portfolio health metrics
- Companies directory with 55 portfolio companies
- AI Assistant for natural language queries
- Reports & Export functionality
- Mobile-optimized responsive design

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4, Recharts
- **Backend**: Express 4, tRPC 11, Drizzle ORM
- **Database**: MySQL/TiDB
- **Calculations**: HyperFormula (deterministic calculation engine)
- **Authentication**: Password protection (BlueAlly45)

## Getting Started

### Prerequisites
- Node.js 22+
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

### Environment Variables

The following environment variables are required:
- `DATABASE_URL` - MySQL/TiDB connection string
- `JWT_SECRET` - Session signing secret
- `VITE_APP_ID` - Application ID

## Project Structure

```
client/
  src/
    pages/          # Page components
    components/     # Reusable UI components
    hooks/          # Custom React hooks
    lib/            # Utilities and calculation engine
server/
  routers.ts        # tRPC procedures
  db.ts             # Database queries
  calculations.ts   # Formula implementations
drizzle/
  schema.ts         # Database schema
shared/
  stonepeak.ts      # Constants and types
  assessmentTypes.ts # Assessment data types
```

## Password

Access the platform with: `BlueAlly45`

## License

Proprietary - BlueAlly Technology Solutions

## Contact

For support, contact BlueAlly Technology Solutions.
