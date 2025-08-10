import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Table des utilisateurs avec profil complet
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  totalSessions: integer("total_sessions").default(0).notNull(),
  favoriteStyle: text("favorite_style"), // libre, inspirant, defi
  favoriteFormat: text("favorite_format"), // solo, duo, famille, equipe
});

// Table des sessions de jeu
export const gameSessions = pgTable("game_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  format: text("format").notNull(), // solo, duo, famille, equipe
  style: text("style").notNull(), // libre, inspirant, defi
  scoreEnabled: boolean("score_enabled").default(false).notNull(),
  citationType: text("citation_type"), // pour style inspirant
  constraint: text("constraint"), // pour style defi
  playerCount: integer("player_count").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  duration: integer("duration"), // en minutes
  isCompleted: boolean("is_completed").default(false).notNull(),
});

// Table des contributions des joueurs
export const playerContributions = pgTable("player_contributions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => gameSessions.id, { onDelete: "cascade" }),
  playerName: text("player_name"),
  contribution: text("contribution").notNull(),
  keywords: text("keywords"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Table des résultats générés (psychographies)
export const sessionResults = pgTable("session_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => gameSessions.id, { onDelete: "cascade" }),
  generatedText: text("generated_text").notNull(),
  animationGuide: jsonb("animation_guide").notNull(), // array de strings
  imagePrompt: text("image_prompt").notNull(),
  creativeScore: integer("creative_score"),
  poeticScore: integer("poetic_score"),
  badges: jsonb("badges"), // array de badges
  isPublished: boolean("is_published").default(false).notNull(), // pour psychothèque publique
  publishedAt: timestamp("published_at"),
  aiGeneratedTags: jsonb("ai_generated_tags"), // tags automatiques
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Table des badges disponibles
export const badgeDefinitions = pgTable("badge_definitions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  category: text("category").notNull(), // technique, poetique, psychologique, narratif, communautaire, suggestion
  level: integer("level").notNull(), // 1=amateur, 2=expert, 3=maître
  svgIcon: text("svg_icon").notNull(), // SVG animé
  criteria: jsonb("criteria").notNull(), // conditions d'obtention
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Table des badges obtenus par les utilisateurs
export const userBadges = pgTable("user_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  badgeId: varchar("badge_id").notNull().references(() => badgeDefinitions.id, { onDelete: "cascade" }),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
  sessionId: varchar("session_id").references(() => gameSessions.id), // session qui a donné le badge
});

// Table des votes sur les psychographies publiques
export const psychographyVotes = pgTable("psychography_votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  resultId: varchar("result_id").notNull().references(() => sessionResults.id, { onDelete: "cascade" }),
  voterId: varchar("voter_id").references(() => users.id, { onDelete: "cascade" }), // null pour IA
  voterType: text("voter_type").notNull(), // "human", "ai", "expert"
  dimension: text("dimension").notNull(), // "creativite", "poetique", "originalite", "coherence", etc.
  score: integer("score").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Table des tags communautaires et IA
export const psychographyTags = pgTable("psychography_tags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  resultId: varchar("result_id").notNull().references(() => sessionResults.id, { onDelete: "cascade" }),
  tag: text("tag").notNull(),
  confidence: integer("confidence"), // pour tags IA: 0-100
  source: text("source").notNull(), // "ai", "community", "author"
  addedBy: varchar("added_by").references(() => users.id), // null pour IA
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Table des profils utilisateur étendus
export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  level: integer("level").default(1).notNull(),
  experience: integer("experience").default(0).notNull(),
  reputation: integer("reputation").default(0).notNull(),
  specializations: jsonb("specializations"), // domaines de prédilection
  achievements: jsonb("achievements"), // accomplissements spéciaux
  publicLibraryOptIn: boolean("public_library_opt_in").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  sessions: many(gameSessions),
  badges: many(userBadges),
  votes: many(psychographyVotes),
  profile: one(userProfiles),
}));

export const gameSessionsRelations = relations(gameSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [gameSessions.userId],
    references: [users.id],
  }),
  contributions: many(playerContributions),
  result: one(sessionResults),
}));

export const playerContributionsRelations = relations(playerContributions, ({ one }) => ({
  session: one(gameSessions, {
    fields: [playerContributions.sessionId],
    references: [gameSessions.id],
  }),
}));

export const sessionResultsRelations = relations(sessionResults, ({ one, many }) => ({
  session: one(gameSessions, {
    fields: [sessionResults.sessionId],
    references: [gameSessions.id],
  }),
  votes: many(psychographyVotes),
  tags: many(psychographyTags),
}));

export const badgeDefinitionsRelations = relations(badgeDefinitions, ({ many }) => ({
  userBadges: many(userBadges),
}));

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(users, {
    fields: [userBadges.userId],
    references: [users.id],
  }),
  badge: one(badgeDefinitions, {
    fields: [userBadges.badgeId],
    references: [badgeDefinitions.id],
  }),
  session: one(gameSessions, {
    fields: [userBadges.sessionId],
    references: [gameSessions.id],
  }),
}));

export const psychographyVotesRelations = relations(psychographyVotes, ({ one }) => ({
  result: one(sessionResults, {
    fields: [psychographyVotes.resultId],
    references: [sessionResults.id],
  }),
  voter: one(users, {
    fields: [psychographyVotes.voterId],
    references: [users.id],
  }),
}));

export const psychographyTagsRelations = relations(psychographyTags, ({ one }) => ({
  result: one(sessionResults, {
    fields: [psychographyTags.resultId],
    references: [sessionResults.id],
  }),
  addedBy: one(users, {
    fields: [psychographyTags.addedBy],
    references: [users.id],
  }),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));

// Schemas de validation
export const registerUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  firstName: true,
  lastName: true,
});

export const loginUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const updateUserProfileSchema = createInsertSchema(users).pick({
  firstName: true,
  lastName: true,
  bio: true,
  favoriteStyle: true,
  favoriteFormat: true,
});

export const createSessionSchema = createInsertSchema(gameSessions).omit({
  id: true,
  userId: true,
  createdAt: true,
  isCompleted: true,
});

export const createContributionSchema = createInsertSchema(playerContributions).omit({
  id: true,
  sessionId: true,
  createdAt: true,
});

export const createResultSchema = createInsertSchema(sessionResults).omit({
  id: true,
  sessionId: true,
  createdAt: true,
});

// Schemas de validation pour les nouveaux types
export const createBadgeSchema = createInsertSchema(badgeDefinitions).omit({
  id: true,
  createdAt: true,
});

export const createVoteSchema = createInsertSchema(psychographyVotes).omit({
  id: true,
  createdAt: true,
});

export const createTagSchema = createInsertSchema(psychographyTags).omit({
  id: true,
  createdAt: true,
});

export const updateGameProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof registerUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>;

export type GameSession = typeof gameSessions.$inferSelect;
export type InsertGameSession = z.infer<typeof createSessionSchema>;

export type PlayerContribution = typeof playerContributions.$inferSelect;
export type InsertPlayerContribution = z.infer<typeof createContributionSchema>;

export type SessionResult = typeof sessionResults.$inferSelect;
export type InsertSessionResult = z.infer<typeof createResultSchema>;

// Nouveaux types pour la gamification
export type BadgeDefinition = typeof badgeDefinitions.$inferSelect;
export type UserBadge = typeof userBadges.$inferSelect;
export type PsychographyVote = typeof psychographyVotes.$inferSelect;
export type PsychographyTag = typeof psychographyTags.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;

// Types inférés
export type InsertBadge = z.infer<typeof createBadgeSchema>;
export type InsertVote = z.infer<typeof createVoteSchema>;
export type InsertTag = z.infer<typeof createTagSchema>;
export type UpdateGameProfile = z.infer<typeof updateGameProfileSchema>;

// Types pour la gamification
export interface BadgeCategory {
  name: string;
  description: string;
  levels: Array<{
    level: number;
    title: string;
    description: string;
    icon: string;
    requirements: Record<string, any>;
  }>;
}

export interface EvaluationCriteria {
  dimension: string;
  weight: number;
  minScore: number;
  description: string;
}
