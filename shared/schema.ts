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
  authorPseudo: text('author_pseudo').notNull(),
  title: text('title').notNull(),
  initialPrompt: text('initial_prompt').notNull(),
  enrichedPrompt: text('enriched_prompt').notNull(),
  finalText: text('final_text').notNull(),
  sensoryGuide: text('sensory_guide'),
  metaphor: text('metaphor'),
  imageUrl: text('image_url'),
  tags: text('tags').array().notNull().default([]),
  isPublic: boolean('is_public').notNull().default(false),
  parameters: jsonb('parameters'),
  votesCount: integer('votes_count').notNull().default(0),
  averageRating: integer('average_rating').default(0), // 0-5 stars
  downloadsCount: integer('downloads_count').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const psychographyVotes = pgTable('psychography_votes', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  psychographyId: integer('psychography_id').notNull(),
  userId: integer('user_id').notNull(),
  rating: integer('rating').notNull(), // 1-5 stars
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const psychographyComments = pgTable('psychography_comments', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  psychographyId: integer('psychography_id').notNull(),
  userId: integer('user_id').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const downloadPacks = pgTable('download_packs', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').notNull(),
  psychographyIds: text('psychography_ids').array().notNull(),
  filename: text('filename').notNull(),
  downloadUrl: text('download_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  psychographies: many(psychographies),
}));

export const psychographiesRelations = relations(psychographies, ({ one, many }) => ({
  user: one(users, {
    fields: [psychographies.userId],
    references: [users.id],
  }),
  votes: many(psychographyVotes),
  comments: many(psychographyComments),
}));

export const psychographyVotesRelations = relations(psychographyVotes, ({ one }) => ({
  psychography: one(psychographies, {
    fields: [psychographyVotes.psychographyId],
    references: [psychographies.id],
  }),
  user: one(users, {
    fields: [psychographyVotes.userId],
    references: [users.id],
  }),
}));

export const psychographyCommentsRelations = relations(psychographyComments, ({ one }) => ({
  psychography: one(psychographies, {
    fields: [psychographyComments.psychographyId],
    references: [psychographies.id],
  }),
  user: one(users, {
    fields: [psychographyComments.userId],
    references: [users.id],
  }),
}));

export const downloadPacksRelations = relations(downloadPacks, ({ one }) => ({
  user: one(users, {
    fields: [downloadPacks.userId],
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
  votesCount: true,
  averageRating: true,
  downloadsCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVoteSchema = createInsertSchema(psychographyVotes).omit({
  id: true,
  createdAt: true,
});

export const insertCommentSchema = createInsertSchema(psychographyComments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDownloadPackSchema = createInsertSchema(downloadPacks).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPsychography = z.infer<typeof insertPsychographySchema>;
export type Psychography = typeof psychographies.$inferSelect;
export type InsertVote = z.infer<typeof insertVoteSchema>;
export type PsychographyVote = typeof psychographyVotes.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type PsychographyComment = typeof psychographyComments.$inferSelect;
export type InsertDownloadPack = z.infer<typeof insertDownloadPackSchema>;
export type DownloadPack = typeof downloadPacks.$inferSelect;

// Parameters structure for psychography generation
export const psychographyParametersSchema = z.object({
  targetAudience: z.string(),
  usage: z.string(), 
  chaosIntensity: z.number().min(1).max(10),
  textStyle: z.string(),
  imageStyle: z.string(),
});

export type PsychographyParameters = z.infer<typeof psychographyParametersSchema>;