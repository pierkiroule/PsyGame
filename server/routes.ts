import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import session from "express-session";
import { storage } from "./storage";
import { 
  registerUserSchema, 
  loginUserSchema, 
  updateUserProfileSchema,
  createSessionSchema,
  createContributionSchema,
  createResultSchema
} from "@shared/schema";
import { z } from "zod";

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    username?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configuration de la session avec persistance
  app.use(session({
    secret: process.env.SESSION_SECRET || 'psychographe-secret-key-dev',
    resave: false,
    saveUninitialized: false,
    rolling: true, // Renouvelle la session à chaque requête
    cookie: {
      secure: false, // En production, mettre à true avec HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 jours
    }
  }));

  // Middleware d'authentification
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Authentification requise' });
    }
    next();
  };

  // Routes d'authentification
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registerUserSchema.parse(req.body);
      
      // Vérifier si l'utilisateur existe déjà
      const existingUserByUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ error: 'Ce nom d\'utilisateur est déjà pris' });
      }

      const existingUserByEmail = await storage.getUserByEmail(validatedData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ error: 'Cette adresse email est déjà utilisée' });
      }

      const user = await storage.createUser(validatedData);
      
      // Connecter automatiquement l'utilisateur
      req.session.userId = user.id;
      req.session.username = user.username;

      const { password, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Données invalides', details: error.errors });
      }
      console.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginUserSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(validatedData.username);
      if (!user) {
        return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect' });
      }

      const isValidPassword = await storage.verifyPassword(validatedData.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect' });
      }

      req.session.userId = user.id;
      req.session.username = user.username;

      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Données invalides', details: error.errors });
      }
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Erreur lors de la déconnexion:', err);
        return res.status(500).json({ error: 'Erreur lors de la déconnexion' });
      }
      res.json({ message: 'Déconnexion réussie' });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUserById(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  });

  // Routes de profil utilisateur
  app.put("/api/profile", requireAuth, async (req: any, res) => {
    try {
      const validatedData = updateProfileSchema.parse(req.body);
      
      const updatedUser = await storage.updateUser(req.session.userId, validatedData);
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Données invalides', details: error.errors });
      }
      console.error('Erreur lors de la mise à jour du profil:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  });

  app.get("/api/profile/stats", requireAuth, async (req: any, res) => {
    try {
      const stats = await storage.getUserStats(req.session.userId);
      res.json(stats);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  });

  // Routes des sessions de jeu
  app.post("/api/sessions", requireAuth, async (req: any, res) => {
    try {
      const validatedData = createSessionSchema.parse(req.body);
      
      const session = await storage.createGameSession(req.session.userId, validatedData);
      res.status(201).json({ session });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Données invalides', details: error.errors });
      }
      console.error('Erreur lors de la création de la session:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  });

  app.get("/api/sessions", requireAuth, async (req: any, res) => {
    try {
      const sessions = await storage.getUserSessions(req.session.userId);
      res.json({ sessions });
    } catch (error) {
      console.error('Erreur lors de la récupération des sessions:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  });

  app.get("/api/sessions/:id", requireAuth, async (req: any, res) => {
    try {
      const session = await storage.getSessionById(req.params.id);
      if (!session) {
        return res.status(404).json({ error: 'Session non trouvée' });
      }

      // Vérifier que l'utilisateur est propriétaire de la session
      if (session.userId !== req.session.userId) {
        return res.status(403).json({ error: 'Accès refusé' });
      }

      res.json({ session });
    } catch (error) {
      console.error('Erreur lors de la récupération de la session:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  });

  app.put("/api/sessions/:id/complete", requireAuth, async (req: any, res) => {
    try {
      const session = await storage.getSessionById(req.params.id);
      if (!session) {
        return res.status(404).json({ error: 'Session non trouvée' });
      }

      if (session.userId !== req.session.userId) {
        return res.status(403).json({ error: 'Accès refusé' });
      }

      const { duration } = req.body;
      const updatedSession = await storage.completeSession(req.params.id, duration);
      res.json({ session: updatedSession });
    } catch (error) {
      console.error('Erreur lors de la finalisation de la session:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  });

  // Routes des contributions
  app.post("/api/sessions/:id/contributions", requireAuth, async (req: any, res) => {
    try {
      const session = await storage.getSessionById(req.params.id);
      if (!session) {
        return res.status(404).json({ error: 'Session non trouvée' });
      }

      if (session.userId !== req.session.userId) {
        return res.status(403).json({ error: 'Accès refusé' });
      }

      const validatedData = createContributionSchema.parse(req.body);
      const contribution = await storage.addContribution(req.params.id, validatedData);
      
      res.status(201).json({ contribution });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Données invalides', details: error.errors });
      }
      console.error('Erreur lors de l\'ajout de la contribution:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  });

  app.get("/api/sessions/:id/contributions", requireAuth, async (req: any, res) => {
    try {
      const session = await storage.getSessionById(req.params.id);
      if (!session) {
        return res.status(404).json({ error: 'Session non trouvée' });
      }

      if (session.userId !== req.session.userId) {
        return res.status(403).json({ error: 'Accès refusé' });
      }

      const contributions = await storage.getSessionContributions(req.params.id);
      res.json({ contributions });
    } catch (error) {
      console.error('Erreur lors de la récupération des contributions:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  });

  // Routes des résultats
  app.post("/api/sessions/:id/result", requireAuth, async (req: any, res) => {
    try {
      const session = await storage.getSessionById(req.params.id);
      if (!session) {
        return res.status(404).json({ error: 'Session non trouvée' });
      }

      if (session.userId !== req.session.userId) {
        return res.status(403).json({ error: 'Accès refusé' });
      }

      const validatedData = createResultSchema.parse(req.body);
      const result = await storage.saveSessionResult(req.params.id, validatedData);
      
      res.status(201).json({ result });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Données invalides', details: error.errors });
      }
      console.error('Erreur lors de la sauvegarde du résultat:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  });

  app.get("/api/sessions/:id/result", requireAuth, async (req: any, res) => {
    try {
      const session = await storage.getSessionById(req.params.id);
      if (!session) {
        return res.status(404).json({ error: 'Session non trouvée' });
      }

      if (session.userId !== req.session.userId) {
        return res.status(403).json({ error: 'Accès refusé' });
      }

      const result = await storage.getSessionResult(req.params.id);
      if (!result) {
        return res.status(404).json({ error: 'Résultat non trouvé' });
      }

      res.json({ result });
    } catch (error) {
      console.error('Erreur lors de la récupération du résultat:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
