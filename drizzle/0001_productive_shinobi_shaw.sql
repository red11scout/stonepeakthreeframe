CREATE TABLE `aiInsights` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int,
	`insightType` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`priority` varchar(20) DEFAULT 'medium',
	`isRead` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `aiInsights_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `auditLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`companyId` int NOT NULL,
	`field` varchar(100) NOT NULL,
	`oldValue` text,
	`newValue` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `companies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`investmentCategory` varchar(100) NOT NULL,
	`employees` int DEFAULT 0,
	`annualRevenue` decimal(20,2) DEFAULT '0',
	`revenueEstimated` boolean DEFAULT false,
	`industryVertical` varchar(255),
	`detailedSector` varchar(255),
	`stonepeakCategory` varchar(255),
	`hqCity` varchar(100),
	`hqState` varchar(100),
	`hqCountry` varchar(100),
	`investmentDate` varchar(50),
	`ebitda` decimal(20,2) DEFAULT '0',
	`ebitdaImpact` decimal(4,2) DEFAULT '5',
	`revenueEnablement` decimal(4,2) DEFAULT '5',
	`riskReduction` decimal(4,2) DEFAULT '5',
	`organizationalCapacity` decimal(4,2) DEFAULT '5',
	`dataAvailability` decimal(4,2) DEFAULT '5',
	`techInfrastructure` decimal(4,2) DEFAULT '5',
	`timelineFit` decimal(4,2) DEFAULT '5',
	`valueScore` decimal(6,4) DEFAULT '0',
	`readinessScore` decimal(6,4) DEFAULT '0',
	`priorityScore` decimal(6,4) DEFAULT '0',
	`adjustedEbitda` decimal(20,2) DEFAULT '0',
	`adjustedPriority` decimal(20,2) DEFAULT '0',
	`theme` varchar(50),
	`track` varchar(50),
	`replicationPotential` decimal(4,2) DEFAULT '5',
	`platformClassification` varchar(50),
	`portfolioAdjustedPriority` decimal(20,2) DEFAULT '0',
	`quadrant` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `companies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scenarios` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`companyData` json,
	`isDefault` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `scenarios_id` PRIMARY KEY(`id`)
);
