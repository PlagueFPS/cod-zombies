CREATE TYPE "public"."status" AS ENUM('Coming Soon', 'Published');--> statement-breakpoint
ALTER TABLE "new_maps" ADD COLUMN "status" "status";