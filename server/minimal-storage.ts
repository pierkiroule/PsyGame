// Interface de stockage minimaliste écoresponsable
import { 
  users, 
  psychographies, 
  psychographyLikes,
  type User, 
  type InsertUser, 
  type Psychography, 
  type InsertPsychography,
  type InsertLike,
  type PsychographyWithDetails
} from "@shared/minimal-schema";
import { db } from "./db";
import { eq, desc, and, sql, inArray } from "drizzle-orm";

export interface IMinimalStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  
  // Psychography operations (simplifiées)
  createPsychography(psychography: InsertPsychography): Promise<Psychography>;
  getUserPsychographies(userId: number): Promise<Psychography[]>;
  getPublicPsychographies(userId?: number): Promise<PsychographyWithDetails[]>;
  updatePsychographyVisibility(id: number, userId: number, isPublic: boolean): Promise<void>;
  deletePsychography(id: number, userId: number): Promise<void>;
  
  // Like operations (remplace le système de vote complexe)
  toggleLike(psychographyId: number, userId: number): Promise<boolean>; // Retourne true si liked
  
  // Export simple
  exportToPdf(psychographyId: number, userId: number): Promise<{ filename: string; buffer: Buffer }>;
}

// Implémentation en mémoire pour développement rapide
export class MemMinimalStorage implements IMinimalStorage {
  private users: User[] = [
    { id: 1, username: 'demo', passwordHash: 'hash', createdAt: new Date() }
  ];
  private psychographies: Psychography[] = [];
  private likes: Array<{ psychographyId: number; userId: number; createdAt: Date }> = [];
  private nextUserId = 2;
  private nextPsychographyId = 1;

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.nextUserId++,
      ...insertUser,
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async createPsychography(psychography: InsertPsychography): Promise<Psychography> {
    const created: Psychography = {
      id: this.nextPsychographyId++,
      ...psychography,
      likesCount: 0,
      createdAt: new Date(),
    };
    this.psychographies.push(created);
    return created;
  }

  async getUserPsychographies(userId: number): Promise<Psychography[]> {
    return this.psychographies
      .filter(p => p.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getPublicPsychographies(userId?: number): Promise<PsychographyWithDetails[]> {
    const publicPsychographies = this.psychographies
      .filter(p => p.isPublic)
      .sort((a, b) => b.likesCount - a.likesCount); // Tri par popularité

    return publicPsychographies.map(p => {
      const user = this.users.find(u => u.id === p.userId);
      const isLiked = userId ? this.likes.some(l => l.psychographyId === p.id && l.userId === userId) : false;
      
      return {
        ...p,
        username: user?.username || 'Anonyme',
        isLiked,
      };
    });
  }

  async updatePsychographyVisibility(id: number, userId: number, isPublic: boolean): Promise<void> {
    const psycho = this.psychographies.find(p => p.id === id && p.userId === userId);
    if (psycho) {
      psycho.isPublic = isPublic;
    }
  }

  async deletePsychography(id: number, userId: number): Promise<void> {
    const index = this.psychographies.findIndex(p => p.id === id && p.userId === userId);
    if (index >= 0) {
      this.psychographies.splice(index, 1);
      // Nettoyer les likes associés
      this.likes = this.likes.filter(l => l.psychographyId !== id);
    }
  }

  async toggleLike(psychographyId: number, userId: number): Promise<boolean> {
    const existingLike = this.likes.findIndex(l => 
      l.psychographyId === psychographyId && l.userId === userId
    );
    
    if (existingLike >= 0) {
      // Unlike
      this.likes.splice(existingLike, 1);
      this.updateLikesCount(psychographyId, -1);
      return false;
    } else {
      // Like
      this.likes.push({
        psychographyId,
        userId,
        createdAt: new Date(),
      });
      this.updateLikesCount(psychographyId, 1);
      return true;
    }
  }

  private updateLikesCount(psychographyId: number, delta: number): void {
    const psycho = this.psychographies.find(p => p.id === psychographyId);
    if (psycho) {
      psycho.likesCount += delta;
    }
  }

  async exportToPdf(psychographyId: number, userId: number): Promise<{ filename: string; buffer: Buffer }> {
    const psycho = this.psychographies.find(p => p.id === psychographyId);
    const user = this.users.find(u => u.id === userId);
    
    if (!psycho || !user) {
      throw new Error('Psychographie ou utilisateur introuvable');
    }

    // Génération PDF simple (à implémenter avec une lib légère)
    const content = `
PSYCHOGRAPHIE - ${psycho.title}
Par ${user.username}
Créée le ${psycho.createdAt.toLocaleDateString('fr-FR')}

${psycho.content}

Tags: ${psycho.tags.join(', ')}
    `.trim();

    const buffer = Buffer.from(content, 'utf-8');
    const filename = `psychographie-${psycho.id}-${Date.now()}.txt`;

    return { filename, buffer };
  }
}

export const minimalStorage = new MemMinimalStorage();