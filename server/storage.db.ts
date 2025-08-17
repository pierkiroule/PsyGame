import { 
  users,
  psychographies,
  psychographyVotes,
  psychographyComments,
  downloadPacks,
  type User,
  type InsertUser,
  type Psychography,
  type InsertPsychography,
  type InsertVote,
  type PsychographyVote,
  type InsertComment,
  type PsychographyComment,
  type InsertDownloadPack,
  type DownloadPack,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, avg, count, inArray } from "drizzle-orm";

import type { IStorage } from "./storage.types";

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
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createPsychography(psychography: InsertPsychography): Promise<Psychography> {
    const [created] = await db.insert(psychographies).values(psychography).returning();
    return created;
  }

  async getPsychography(id: number): Promise<Psychography | undefined> {
    const [psychography] = await db.select().from(psychographies).where(eq(psychographies.id, id));
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
    await db.delete(psychographies).where(and(eq(psychographies.id, id), eq(psychographies.userId, userId)));
  }

  async getPsychographiesForGallery(params: {
    userId?: number;
    showPrivate?: boolean;
    filter?: string;
    sortBy?: string;
  }): Promise<any[]> {
    const { userId, showPrivate = false, sortBy = "recent" } = params;

    let query = db
      .select({
        id: psychographies.id,
        title: psychographies.title,
        initialText: psychographies.initialText,
        finalPrompt: psychographies.finalPrompt,
        generatedText: psychographies.generatedText,
        imageUrl: psychographies.imageUrl,
        guide: psychographies.guide,
        tags: psychographies.tags,
        isPublic: psychographies.isPublic,
        votesCount: psychographies.votesCount,
        averageRating: psychographies.averageRating,
        downloadsCount: psychographies.downloadsCount,
        createdAt: psychographies.createdAt,
        userId: psychographies.userId,
        username: users.username,
      })
      .from(psychographies)
      .leftJoin(users, eq(psychographies.userId, users.id));

    if (showPrivate && userId) {
      query = query.where(eq(psychographies.userId, userId));
    } else {
      query = query.where(eq(psychographies.isPublic, true));
    }

    switch (sortBy) {
      case "popular":
        query = query.orderBy(desc(psychographies.downloadsCount));
        break;
      case "rating":
        query = query.orderBy(desc(psychographies.averageRating));
        break;
      default:
        query = query.orderBy(desc(psychographies.createdAt));
    }

    const results = await query;

    const psychographyIds = results.map((p) => p.id);

    const votes = userId
      ? await db
          .select()
          .from(psychographyVotes)
          .where(and(inArray(psychographyVotes.psychographyId, psychographyIds), eq(psychographyVotes.userId, userId)))
      : [];

    const comments = await db
      .select({
        id: psychographyComments.id,
        psychographyId: psychographyComments.psychographyId,
        content: psychographyComments.content,
        createdAt: psychographyComments.createdAt,
        username: users.username,
      })
      .from(psychographyComments)
      .leftJoin(users, eq(psychographyComments.userId, users.id))
      .where(inArray(psychographyComments.psychographyId, psychographyIds))
      .orderBy(desc(psychographyComments.createdAt));

    return results.map((psycho) => ({
      ...psycho,
      user: { username: psycho.username },
      userVote: votes.find((v) => v.psychographyId === psycho.id),
      comments: comments
        .filter((c) => c.psychographyId === psycho.id)
        .map((c) => ({ id: c.id, content: c.content, createdAt: c.createdAt, user: { username: c.username } })),
    }));
  }

  async getPsychographiesByIds(ids: number[]): Promise<Psychography[]> {
    return await db.select().from(psychographies).where(inArray(psychographies.id, ids));
  }

  async voteOnPsychography(vote: InsertVote): Promise<void> {
    await db
      .insert(psychographyVotes)
      .values(vote)
      .onConflictDoUpdate({
        target: [psychographyVotes.psychographyId, psychographyVotes.userId],
        set: { rating: vote.rating },
      });

    const avgResult = await db
      .select({ avg: avg(psychographyVotes.rating), count: count() })
      .from(psychographyVotes)
      .where(eq(psychographyVotes.psychographyId, vote.psychographyId));

    const stats = avgResult[0];
    await db
      .update(psychographies)
      .set({
        averageRating: Math.round(((stats.avg as number) || 0) * 10) / 10,
        votesCount: (stats.count as number) || 0,
        updatedAt: new Date(),
      })
      .where(eq(psychographies.id, vote.psychographyId));
  }

  async commentOnPsychography(comment: InsertComment): Promise<PsychographyComment> {
    const [created] = await db.insert(psychographyComments).values(comment).returning();
    return created;
  }

  async createDownloadPack(pack: InsertDownloadPack): Promise<DownloadPack> {
    const [created] = await db.insert(downloadPacks).values(pack).returning();
    return created;
  }
}