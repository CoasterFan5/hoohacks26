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
ALTER TABLE "liveAssets" ADD CONSTRAINT "liveAssets_owner_users_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;