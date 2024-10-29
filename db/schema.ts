import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const maps = pgTable('newMap_table', {
  id: serial("id").primaryKey(),
  mapId: text('mapId').notNull(),
  contentful_createdAt: text('contentful_createdAt').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
})

export type InsertMap = typeof maps.$inferInsert
export type SelectMap = typeof maps.$inferSelect

export const categories = pgTable('newCategory_table', {
  id: serial("id").primaryKey(),
  categoryId: text('categoryId').notNull(),
  contentful_createdAt: text('contentful_createdAt').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
})

export type InsertCategory = typeof categories.$inferInsert
export type SelectCategory = typeof categories.$inferSelect