CREATE TYPE "public"."asset_category" AS ENUM('vehicles', 'machinery', 'buildings', 'infrastructure', 'equipment', 'tools');--> statement-breakpoint
CREATE TYPE "public"."asset_condition" AS ENUM('excellent', 'good', 'fair', 'poor');--> statement-breakpoint
CREATE TYPE "public"."finance_entry_type" AS ENUM('income', 'expense');--> statement-breakpoint
CREATE TABLE "finance_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"type" "finance_entry_type" NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"entryDate" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "herd_groups" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"breed" text NOT NULL,
	"count" integer NOT NULL,
	"avgWeightLbs" numeric(10, 2) NOT NULL,
	"pricePerCwt" numeric(10, 2) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ranch_assets" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"category" "asset_category" NOT NULL,
	"quantity" integer NOT NULL,
	"purchasePrice" numeric(12, 2) NOT NULL,
	"currentUnitValue" numeric(12, 2) NOT NULL,
	"purchaseYear" integer NOT NULL,
	"condition" "asset_condition" NOT NULL,
	"lastUpdated" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "liveAssets" CASCADE;--> statement-breakpoint
ALTER TABLE "finance_entries" ADD CONSTRAINT "finance_entries_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "herd_groups" ADD CONSTRAINT "herd_groups_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ranch_assets" ADD CONSTRAINT "ranch_assets_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;