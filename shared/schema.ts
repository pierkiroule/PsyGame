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

// Table des résultats générés
export const sessionResults = pgTable("session_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => gameSessions.id, { onDelete: "cascade" }),
  generatedText: text("generated_text").notNull(),
  animationGuide: jsonb("animation_guide").notNull(), // array de strings
  imagePrompt: text("image_prompt").notNull(),
  creativeScore: integer("creative_score"),
  poeticScore: integer("poetic_score"),
  badges: jsonb("badges"), // array de badges
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(gameSessions),
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

export const sessionResultsRelations = relations(sessionResults, ({ one }) => ({
  session: one(gameSessions, {
    fields: [sessionResults.sessionId],
    references: [gameSessions.id],
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

export const updateProfileSchema = createInsertSchema(users).pick({
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

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof registerUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;

export type GameSession = typeof gameSessions.$inferSelect;
export type InsertGameSession = z.infer<typeof createSessionSchema>;

export type PlayerContribution = typeof playerContributions.$inferSelect;
export type InsertPlayerContribution = z.infer<typeof createContributionSchema>;

export type SessionResult = typeof sessionResults.$inferSelect;
export type InsertSessionResult = z.infer<typeof createResultSchema>;
