// The storage interface for the application
import { users, psychographies, type User, type InsertUser, type Psychography, type InsertPsychography } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  
  // Psychography operations
  createPsychography(psychography: InsertPsychography): Promise<Psychography>;
  getPsychography(id: number): Promise<Psychography | undefined>;
  getUserPsychographies(userId: number, includePrivate?: boolean): Promise<Psychography[]>;
  getPublicPsychographies(): Promise<Psychography[]>;
  updatePsychographyVisibility(id: number, userId: number, isPublic: boolean): Promise<void>;
  deletePsychography(id: number, userId: number): Promise<void>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createPsychography(psychography: InsertPsychography): Promise<Psychography> {
    const [created] = await db
      .insert(psychographies)
      .values(psychography)
      .returning();
    return created;
  }

  async getPsychography(id: number): Promise<Psychography | undefined> {
    const [psychography] = await db
      .select()
      .from(psychographies)
      .where(eq(psychographies.id, id));
    return psychography || undefined;
  }

  async getUserPsychographies(userId: number, includePrivate = true): Promise<Psychography[]> {
    const conditions = includePrivate 
      ? eq(psychographies.userId, userId)
      : and(eq(psychographies.userId, userId), eq(psychographies.isPublic, true));

    return await db
      .select()
      .from(psychographies)
      .where(conditions)
      .orderBy(desc(psychographies.createdAt));
  }

  async getPublicPsychographies(): Promise<Psychography[]> {
    return await db
      .select()
      .from(psychographies)
      .where(eq(psychographies.isPublic, true))
      .orderBy(desc(psychographies.createdAt));
  }

  async updatePsychographyVisibility(id: number, userId: number, isPublic: boolean): Promise<void> {
    await db
      .update(psychographies)
      .set({ isPublic, updatedAt: new Date() })
      .where(and(eq(psychographies.id, id), eq(psychographies.userId, userId)));
  }

  async deletePsychography(id: number, userId: number): Promise<void> {
    await db
      .delete(psychographies)
      .where(and(eq(psychographies.id, id), eq(psychographies.userId, userId)));
  }
}

export const storage = new DatabaseStorage();