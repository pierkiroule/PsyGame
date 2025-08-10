import bcrypt from 'bcrypt';
import { 
  users, 
  gameSessions, 
  playerContributions, 
  sessionResults,
  type User, 
  type InsertUser,
  type LoginUser,
  type UpdateProfile,
  type GameSession,
  type InsertGameSession,
  type PlayerContribution,
  type InsertPlayerContribution,
  type SessionResult,
  type InsertSessionResult
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUserById(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(userData: InsertUser): Promise<User>;
  updateUser(id: string, userData: Partial<UpdateProfile>): Promise<User>;
  verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
  
  // Session operations
  createGameSession(userId: string, sessionData: InsertGameSession): Promise<GameSession>;
  getSessionById(id: string): Promise<GameSession | undefined>;
  getUserSessions(userId: string): Promise<GameSession[]>;
  updateSession(id: string, data: Partial<GameSession>): Promise<GameSession>;
  completeSession(id: string, duration?: number): Promise<GameSession>;
  
  // Contribution operations
  addContribution(sessionId: string, contribution: InsertPlayerContribution): Promise<PlayerContribution>;
  getSessionContributions(sessionId: string): Promise<PlayerContribution[]>;
  
  // Result operations
  saveSessionResult(sessionId: string, result: InsertSessionResult): Promise<SessionResult>;
  getSessionResult(sessionId: string): Promise<SessionResult | undefined>;
  
  // Stats operations
  getUserStats(userId: string): Promise<{
    totalSessions: number;
    completedSessions: number;
    favoriteFormat: string | null;
    favoriteStyle: string | null;
    averageCreativeScore: number | null;
    averagePoetricScore: number | null;
  }>;
}

export class DatabaseStorage implements IStorage {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const hashedPassword = await this.hashPassword(userData.password);
    
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        password: hashedPassword,
      })
      .returning();
    
    return user;
  }

  async updateUser(id: string, userData: Partial<UpdateProfile>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    
    return user;
  }

  async createGameSession(userId: string, sessionData: InsertGameSession): Promise<GameSession> {
    const [session] = await db
      .insert(gameSessions)
      .values({
        ...sessionData,
        userId,
      })
      .returning();
    
    // Increment user's session count
    const [currentUser] = await db.select().from(users).where(eq(users.id, userId));
    if (currentUser) {
      await db
        .update(users)
        .set({
          totalSessions: (currentUser.totalSessions || 0) + 1,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    }
    
    return session;
  }

  async getSessionById(id: string): Promise<GameSession | undefined> {
    const [session] = await db.select().from(gameSessions).where(eq(gameSessions.id, id));
    return session;
  }

  async getUserSessions(userId: string): Promise<GameSession[]> {
    return db
      .select()
      .from(gameSessions)
      .where(eq(gameSessions.userId, userId))
      .orderBy(desc(gameSessions.createdAt));
  }

  async updateSession(id: string, data: Partial<GameSession>): Promise<GameSession> {
    const [session] = await db
      .update(gameSessions)
      .set(data)
      .where(eq(gameSessions.id, id))
      .returning();
    
    return session;
  }

  async completeSession(id: string, duration?: number): Promise<GameSession> {
    const [session] = await db
      .update(gameSessions)
      .set({
        isCompleted: true,
        duration,
      })
      .where(eq(gameSessions.id, id))
      .returning();
    
    return session;
  }

  async addContribution(sessionId: string, contribution: InsertPlayerContribution): Promise<PlayerContribution> {
    const [contrib] = await db
      .insert(playerContributions)
      .values({
        ...contribution,
        sessionId,
      })
      .returning();
    
    return contrib;
  }

  async getSessionContributions(sessionId: string): Promise<PlayerContribution[]> {
    return db
      .select()
      .from(playerContributions)
      .where(eq(playerContributions.sessionId, sessionId));
  }

  async saveSessionResult(sessionId: string, result: InsertSessionResult): Promise<SessionResult> {
    const [sessionResult] = await db
      .insert(sessionResults)
      .values({
        ...result,
        sessionId,
      })
      .returning();
    
    return sessionResult;
  }

  async getSessionResult(sessionId: string): Promise<SessionResult | undefined> {
    const [result] = await db.select().from(sessionResults).where(eq(sessionResults.sessionId, sessionId));
    return result;
  }

  async getUserStats(userId: string): Promise<{
    totalSessions: number;
    completedSessions: number;
    favoriteFormat: string | null;
    favoriteStyle: string | null;
    averageCreativeScore: number | null;
    averagePoetricScore: number | null;
  }> {
    const userSessions = await this.getUserSessions(userId);
    const completedSessions = userSessions.filter(s => s.isCompleted);
    
    // Calculer les formats/styles favoris
    const formatCounts = userSessions.reduce((acc, session) => {
      acc[session.format] = (acc[session.format] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const styleCounts = userSessions.reduce((acc, session) => {
      acc[session.style] = (acc[session.style] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const favoriteFormat = Object.entries(formatCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || null;
    const favoriteStyle = Object.entries(styleCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || null;
    
    return {
      totalSessions: userSessions.length,
      completedSessions: completedSessions.length,
      favoriteFormat,
      favoriteStyle,
      averageCreativeScore: null,
      averagePoetricScore: null,
    };
  }
}

export const storage = new DatabaseStorage();
