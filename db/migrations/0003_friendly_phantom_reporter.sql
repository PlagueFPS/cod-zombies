ALTER TABLE "new_categories" ADD CONSTRAINT "new_categories_category_id_unique" UNIQUE("category_id");--> statement-breakpoint
ALTER TABLE "new_maps" ADD CONSTRAINT "new_maps_map_id_unique" UNIQUE("map_id");--> statement-breakpoint
ALTER TABLE "new_quests" ADD CONSTRAINT "new_quests_quest_id_unique" UNIQUE("quest_id");