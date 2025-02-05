import { pgTable, serial, text, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';

export const statusEnum = pgEnum("status", ["Coming Soon", "Published"])

export const maps = pgTable('new_maps', {
  id: serial("id").primaryKey(),
  mapId: text('map_id').unique().notNull(),
  publishedAt: text('published_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  status: statusEnum("status"),
}, (t) => [
  index("map_id_idx").on(t.mapId)
])

export const categories = pgTable('new_categories', {
  id: serial("id").primaryKey(),
  categoryId: text('category_id').unique().notNull(),
  publishedAt: text('published_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [
  index("category_id_idx").on(t.categoryId)
])

export const quests = pgTable('new_quests', {
  id: serial("id").primaryKey(),
  questId: text('quest_id').unique().notNull(),
  publishedAt: text('published_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [
  index("quest_id_idx").on(t.questId)
])