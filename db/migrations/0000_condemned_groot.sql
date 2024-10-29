CREATE TABLE IF NOT EXISTS "newCategory_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"categoryId" text NOT NULL,
	"contentful_createdAt" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "newMap_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"mapId" text NOT NULL,
	"contentful_createdAt" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
