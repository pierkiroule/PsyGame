import {
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

import type { IStorage } from "./storage.types";

let usersTable: User[] = [];
let psychographiesTable: Psychography[] = [];
let votesTable: PsychographyVote[] = [];
let commentsTable: PsychographyComment[] = [];
let packsTable: DownloadPack[] = [];

let userIdSeq = 1;
let psychographyIdSeq = 1;
let voteIdSeq = 1;
let commentIdSeq = 1;
let packIdSeq = 1;

export class MemStorage implements IStorage {
  async getUser(id: number) {
    return usersTable.find((u) => u.id === id);
  }
  async getUserByUsername(username: string) {
    return usersTable.find((u) => u.username === username);
  }
  async createUser(insertUser: InsertUser) {
    const now = new Date();
    const user: User = {
      id: userIdSeq++,
      username: insertUser.username,
      passwordHash: insertUser.passwordHash,
      createdAt: now,
    };
    usersTable.push(user);
    return user;
  }

  async createPsychography(psychography: InsertPsychography) {
    const now = new Date();
    const rec: Psychography = {
      id: psychographyIdSeq++,
      votesCount: 0,
      averageRating: 0,
      downloadsCount: 0,
      createdAt: now,
      updatedAt: now,
      ...psychography,
    } as Psychography;
    psychographiesTable.push(rec);
    return rec;
  }

  async getPsychography(id: number) {
    return psychographiesTable.find((p) => p.id === id);
  }

  async getUserPsychographies(userId: number, includePrivate = true) {
    return psychographiesTable
      .filter((p) => p.userId === userId && (includePrivate || p.isPublic))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getPublicPsychographies() {
    return psychographiesTable
      .filter((p) => p.isPublic)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getPsychographiesForGallery(params: { userId?: number; showPrivate?: boolean; filter?: string; sortBy?: string; }) {
    const { userId, showPrivate = false, sortBy = "recent" } = params;
    let rows = psychographiesTable.filter((p) => (showPrivate && userId ? p.userId === userId : p.isPublic));

    if (sortBy === "popular") rows = rows.sort((a, b) => b.downloadsCount - a.downloadsCount);
    else if (sortBy === "rating") rows = rows.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    else rows = rows.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return rows.map((p) => ({
      ...p,
      username: usersTable.find((u) => u.id === p.userId)?.username,
      user: { username: usersTable.find((u) => u.id === p.userId)?.username || "" },
      userVote: votesTable.find((v) => v.psychographyId === p.id && v.userId === userId),
      comments: commentsTable
        .filter((c) => c.psychographyId === p.id)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .map((c) => ({ id: c.id, content: c.content, createdAt: c.createdAt, user: { username: usersTable.find((u) => u.id === c.userId)?.username || "" } })),
    }));
  }

  async getPsychographiesByIds(ids: number[]) {
    return psychographiesTable.filter((p) => ids.includes(p.id));
  }

  async updatePsychographyVisibility(id: number, userId: number, isPublic: boolean) {
    const rec = psychographiesTable.find((p) => p.id === id && p.userId === userId);
    if (rec) {
      rec.isPublic = isPublic;
      rec.updatedAt = new Date();
    }
  }

  async deletePsychography(id: number, userId: number) {
    psychographiesTable = psychographiesTable.filter((p) => !(p.id === id && p.userId === userId));
  }

  async voteOnPsychography(vote: InsertVote) {
    const existing = votesTable.find((v) => v.psychographyId === vote.psychographyId && v.userId === vote.userId);
    if (existing) existing.rating = vote.rating;
    else votesTable.push({ id: voteIdSeq++, createdAt: new Date(), ...vote } as PsychographyVote);

    const target = psychographiesTable.find((p) => p.id === vote.psychographyId);
    if (target) {
      const related = votesTable.filter((v) => v.psychographyId === target.id);
      const avg = related.length ? related.reduce((s, v) => s + v.rating, 0) / related.length : 0;
      target.votesCount = related.length;
      target.averageRating = Math.round(avg * 10) / 10 as any;
      target.updatedAt = new Date();
    }
  }

  async commentOnPsychography(comment: InsertComment) {
    const rec: PsychographyComment = { id: commentIdSeq++, updatedAt: new Date(), createdAt: new Date(), ...comment } as PsychographyComment;
    commentsTable.push(rec);
    return rec;
  }

  async createDownloadPack(pack: InsertDownloadPack) {
    const rec: DownloadPack = { id: packIdSeq++, createdAt: new Date(), ...pack } as DownloadPack;
    packsTable.push(rec);
    return rec;
  }
}

export function seedDevUser(): User {
  let user = usersTable.find((u) => u.username === "dev");
  if (!user) {
    user = {
      id: userIdSeq++,
      username: "dev",
      passwordHash: "dev",
      createdAt: new Date(),
    } as User;
    usersTable.push(user);
  }
  return user;
}