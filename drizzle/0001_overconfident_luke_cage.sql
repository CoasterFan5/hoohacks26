ALTER TABLE "sessions" ADD COLUMN "auth0Token" text NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "expires" timestamp NOT NULL;