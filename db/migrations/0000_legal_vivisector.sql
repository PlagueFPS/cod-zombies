CREATE TABLE IF NOT EXISTS "newCategory_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"categoryId" text NOT NULL,
	"publishedAt" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "newMap_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"mapId" text NOT NULL,
	"publishedAt" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "category_id_idx" ON "newCategory_table" USING btree ("categoryId");--> statement-breakpoint
CREATE INDEX "map_id_idx" ON "newMap_table" USING btree ("mapId");