import { pgTable, serial, text, timestamp, index } from 'drizzle-orm/pg-core';

export const maps = pgTable('new_maps', {
  id: serial("id").primaryKey(),
  mapId: text('mapId').notNull(),
  publishedAt: text('publishedAt').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [
  index("map_id_idx").on(t.mapId)
])

export type InsertMap = typeof maps.$inferInsert
export type SelectMap = typeof maps.$inferSelect

export const categories = pgTable('new_categories', {
  id: serial("id").primaryKey(),
  categoryId: text('categoryId').notNull(),
  publishedAt: text('publishedAt').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [
  index("category_id_idx").on(t.categoryId)
])

export type InsertCategory = typeof categories.$inferInsert
export type SelectCategory = typeof categories.$inferSelect