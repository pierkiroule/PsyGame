import { pgTable, text, integer, timestamp, boolean, serial } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { relations } from 'drizzle-orm';

// Schéma minimaliste écoresponsable - 3 tables essentielles seulement

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
  content: text('content').notNull(), // Contenu unifié au lieu de multiples champs
  tags: text('tags').array().notNull().default([]),
  isPublic: boolean('is_public').notNull().default(false),
  likesCount: integer('likes_count').notNull().default(0), // Vote simplifié : juste des "likes"
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const psychographyLikes = pgTable('psychography_likes', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  psychographyId: integer('psychography_id').notNull(),
  userId: integer('user_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations simplifiées
export const usersRelations = relations(users, ({ many }) => ({
  psychographies: many(psychographies),
  likes: many(psychographyLikes),
}));

export const psychographiesRelations = relations(psychographies, ({ one, many }) => ({
  user: one(users, {
    fields: [psychographies.userId],
    references: [users.id],
  }),
  likes: many(psychographyLikes),
}));

export const psychographyLikesRelations = relations(psychographyLikes, ({ one }) => ({
  psychography: one(psychographies, {
    fields: [psychographyLikes.psychographyId],
    references: [psychographies.id],
  }),
  user: one(users, {
    fields: [psychographyLikes.userId],
    references: [users.id],
  }),
}));

// Types Zod simplifiés
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertPsychographySchema = createInsertSchema(psychographies).omit({
  id: true,
  createdAt: true,
  likesCount: true,
});

export const insertLikeSchema = createInsertSchema(psychographyLikes).omit({
  id: true,
  createdAt: true,
});

// Types TypeScript
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Psychography = typeof psychographies.$inferSelect;
export type InsertPsychography = z.infer<typeof insertPsychographySchema>;
export type PsychographyLike = typeof psychographyLikes.$inferSelect;
export type InsertLike = z.infer<typeof insertLikeSchema>;

// Type pour les psychographies avec détails (pour l'affichage)
export type PsychographyWithDetails = Psychography & {
  username: string;
  isLiked?: boolean;
};