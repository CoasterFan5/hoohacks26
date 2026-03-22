CREATE TABLE "liveAssets" (
	"id" text PRIMARY KEY NOT NULL,
	"owner" text NOT NULL,
	"created" timestamp NOT NULL,
	"mass" integer DEFAULT 0 NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"externalId" text
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"token" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"auth0Token" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"picture" text
);
--> statement-breakpoint
ALTER TABLE "liveAssets" ADD CONSTRAINT "liveAssets_owner_users_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;