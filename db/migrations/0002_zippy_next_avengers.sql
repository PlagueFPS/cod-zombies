CREATE TABLE "new_quests" (
	"id" serial PRIMARY KEY NOT NULL,
	"quest_id" text NOT NULL,
	"published_at" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "new_categories" RENAME COLUMN "categoryId" TO "category_id";--> statement-breakpoint
ALTER TABLE "new_categories" RENAME COLUMN "publishedAt" TO "published_at";--> statement-breakpoint
ALTER TABLE "new_maps" RENAME COLUMN "mapId" TO "map_id";--> statement-breakpoint
ALTER TABLE "new_maps" RENAME COLUMN "publishedAt" TO "published_at";--> statement-breakpoint
DROP INDEX "category_id_idx";--> statement-breakpoint
DROP INDEX "map_id_idx";--> statement-breakpoint
CREATE INDEX "quest_id_idx" ON "new_quests" USING btree ("quest_id");--> statement-breakpoint
CREATE INDEX "category_id_idx" ON "new_categories" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "map_id_idx" ON "new_maps" USING btree ("map_id");