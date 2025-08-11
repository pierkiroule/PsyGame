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
  getPsychographiesForGallery(params: {
    userId?: number;
    showPrivate?: boolean;
    filter?: string;
    sortBy?: string;
  }): Promise<any[]>;
  getPsychographiesByIds(ids: number[]): Promise<Psychography[]>;
  updatePsychographyVisibility(id: number, userId: number, isPublic: boolean): Promise<void>;
  deletePsychography(id: number, userId: number): Promise<void>;
  
  // Voting operations
  voteOnPsychography(vote: InsertVote): Promise<void>;
  
  // Comment operations
  commentOnPsychography(comment: InsertComment): Promise<PsychographyComment>;
  
  // Download pack operations
  createDownloadPack(pack: InsertDownloadPack): Promise<DownloadPack>;
}