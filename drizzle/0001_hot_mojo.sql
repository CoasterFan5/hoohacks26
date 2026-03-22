CREATE TABLE "assetCategory" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assetsTable" (
	"id" text PRIMARY KEY NOT NULL,
	"owner" text NOT NULL,
	"created" timestamp NOT NULL,
	"valuation" integer NOT NULL,
	"categoryId" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "assetsTable" ADD CONSTRAINT "assetsTable_owner_users_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assetsTable" ADD CONSTRAINT "assetsTable_categoryId_assetCategory_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."assetCategory"("id") ON DELETE cascade ON UPDATE no action;