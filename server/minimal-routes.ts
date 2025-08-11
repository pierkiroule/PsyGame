// Routes minimalistes pour Psychographe écoresponsable
import type { Express } from "express";
import { createServer, type Server } from "http";
import { minimalStorage } from "./minimal-storage";
import { 
  insertPsychographySchema, 
  type PsychographyWithDetails 
} from "@shared/minimal-schema";

export async function registerMinimalRoutes(app: Express): Promise<Server> {
  
  // Middleware simple d'authentification
  const isAuthenticated = (req: any, res: any, next: any) => {
    // Simulation - à remplacer par vraie auth
    req.user = { id: 1, username: 'demo' };
    next();
  };

  // Routes simplifiées pour les psychographies

  // Créer une psychographie
  app.post("/api/psychographies", isAuthenticated, async (req, res) => {
    try {
      const psychographyData = insertPsychographySchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const psychography = await minimalStorage.createPsychography(psychographyData);
      res.json(psychography);
    } catch (error) {
      console.error("Error creating psychography:", error);
      res.status(500).json({ error: "Erreur lors de la création" });
    }
  });

  // Obtenir les psychographies de l'utilisateur
  app.get("/api/psychographies/my", isAuthenticated, async (req, res) => {
    try {
      const psychographies = await minimalStorage.getUserPsychographies(req.user.id);
      res.json(psychographies);
    } catch (error) {
      console.error("Error fetching user psychographies:", error);
      res.status(500).json({ error: "Erreur lors de la récupération" });
    }
  });

  // Obtenir les psychographies publiques
  app.get("/api/psychographies/public", isAuthenticated, async (req, res) => {
    try {
      const psychographies = await minimalStorage.getPublicPsychographies(req.user.id);
      res.json(psychographies);
    } catch (error) {
      console.error("Error fetching public psychographies:", error);
      res.status(500).json({ error: "Erreur lors de la récupération" });
    }
  });

  // Toggle like sur une psychographie
  app.post("/api/psychographies/:id/like", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const isLiked = await minimalStorage.toggleLike(Number(id), req.user.id);
      res.json({ isLiked });
    } catch (error) {
      console.error("Error toggling like:", error);
      res.status(500).json({ error: "Erreur lors du vote" });
    }
  });

  // Changer la visibilité d'une psychographie
  app.patch("/api/psychographies/:id/visibility", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { isPublic } = req.body;
      
      await minimalStorage.updatePsychographyVisibility(Number(id), req.user.id, isPublic);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating visibility:", error);
      res.status(500).json({ error: "Erreur lors de la mise à jour" });
    }
  });

  // Supprimer une psychographie
  app.delete("/api/psychographies/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await minimalStorage.deletePsychography(Number(id), req.user.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting psychography:", error);
      res.status(500).json({ error: "Erreur lors de la suppression" });
    }
  });

  // Export PDF simple
  app.get("/api/psychographies/:id/export", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { filename, buffer } = await minimalStorage.exportToPdf(Number(id), req.user.id);
      
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(buffer);
    } catch (error) {
      console.error("Error exporting:", error);
      res.status(500).json({ error: "Erreur lors de l'export" });
    }
  });

  // Génération IA simulée (à remplacer par vraie IA)
  app.post("/api/generate/prompts", isAuthenticated, async (req, res) => {
    try {
      const { initialText, style } = req.body;
      
      // Simulation - à remplacer par OpenAI
      const prompts = [
        `Explorez "${initialText}" sous un angle ${style}`,
        `Révélez les résonances profondes de "${initialText}"`,
        `Transformez "${initialText}" en une méditation créative`
      ];
      
      res.json({ prompts });
    } catch (error) {
      console.error("Error generating prompts:", error);
      res.status(500).json({ error: "Erreur lors de la génération" });
    }
  });

  app.post("/api/generate/content", isAuthenticated, async (req, res) => {
    try {
      const { initialText, selectedPrompt, style } = req.body;
      
      // Simulation - à remplacer par OpenAI
      const content = `À partir de votre inspiration "${initialText}", voici une psychographie ${style} :

${selectedPrompt}

Cette réflexion révèle les dimensions cachées de votre pensée initiale, tissant des liens entre l'intuition première et les résonances profondes de votre être créatif.`;
      
      res.json({ content });
    } catch (error) {
      console.error("Error generating content:", error);
      res.status(500).json({ error: "Erreur lors de la génération" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}