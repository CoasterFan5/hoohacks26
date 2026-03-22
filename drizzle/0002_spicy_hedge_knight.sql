CREATE TABLE "liveAssets" (
	"id" text PRIMARY KEY NOT NULL,
	"created" timestamp NOT NULL,
	"mass" integer DEFAULT 0 NOT NULL,
	"name" text NOT NULL,
	"type" "liveAssetType" NOT NULL,
	"externalId" text
);
