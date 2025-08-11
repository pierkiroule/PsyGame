import { pgTable, text, integer, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const psychographies = pgTable('psychographies', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').notNull(),
  title: text('title').notNull(),
  initialText: text('initial_text').notNull(),
  finalPrompt: text('final_prompt').notNull(),
  generatedText: text('generated_text').notNull(),
  imageUrl: text('image_url'),
  guide: text('guide'),
  tags: text('tags').array().notNull().default([]),
  isPublic: boolean('is_public').notNull().default(false),
  parameters: jsonb('parameters'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  psychographies: many(psychographies),
}));

export const psychographiesRelations = relations(psychographies, ({ one }) => ({
  user: one(users, {
    fields: [psychographies.userId],
    references: [users.id],
  }),
}));

// Schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertPsychographySchema = createInsertSchema(psychographies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPsychography = z.infer<typeof insertPsychographySchema>;
export type Psychography = typeof psychographies.$inferSelect;

// Parameters structure for psychography generation
export const psychographyParametersSchema = z.object({
  targetAudience: z.string(),
  usage: z.string(), 
  chaosIntensity: z.number().min(1).max(10),
  textStyle: z.string(),
  imageStyle: z.string(),
});

export type PsychographyParameters = z.infer<typeof psychographyParametersSchema>;