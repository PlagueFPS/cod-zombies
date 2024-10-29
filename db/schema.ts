import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const maps = pgTable('newMap_table', {
  id: serial("id").primaryKey(),
  mapId: text('mapId').notNull(),
  publishedAt: text('publishedAt').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export type InsertMap = typeof maps.$inferInsert
export type SelectMap = typeof maps.$inferSelect

export const categories = pgTable('newCategory_table', {
  id: serial("id").primaryKey(),
  categoryId: text('categoryId').notNull(),
  publishedAt: text('publishedAt').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export type InsertCategory = typeof categories.$inferInsert
export type SelectCategory = typeof categories.$inferSelect