import express from "express";
import { z } from "zod";
import { insertPsychographySchema, psychographyParametersSchema, insertVoteSchema, insertCommentSchema } from "@shared/schema";
import { storage } from "./storage";
import { generateDocxPack } from "./docxGenerator";

const router = express.Router();

// Generate enriched prompts for psychography creation
router.post("/api/psychography/generate-prompts", async (req, res) => {
  try {
    const { initialText } = req.body;
    
    if (!initialText?.trim()) {
      return res.status(400).json({ error: "Initial text is required" });
    }

    // Prompt templates for enrichment
    const promptTemplates = [
      "Explorez les nuances émotionnelles de votre ressenti",
      "Transformez vos sensations en métaphores visuelles", 
      "Révélez les archétypes cachés dans votre expression",
      "Connectez votre état présent à des souvenirs profonds",
      "Créez des associations poétiques inattendues",
      "Explorez les couleurs et textures de votre expérience",
      "Transformez votre ressenti en paysage intérieur",
      "Révélez les symboles qui habitent votre état actuel",
      "Découvrez les métaphores cachées dans vos mots",
      "Explorez les résonances sensorielles de votre état"
    ];

    // Shuffle and return 6 random prompts
    const shuffled = [...promptTemplates].sort(() => Math.random() - 0.5);
    const enrichedPrompts = shuffled.slice(0, 6);

    res.json({ enrichedPrompts });
  } catch (error) {
    console.error("Error generating prompts:", error);
    res.status(500).json({ error: "Failed to generate prompts" });
  }
});

// Generate psychography content
router.post("/api/psychography/generate", async (req, res) => {
  try {
    // Temporairement désactiver l'authentification en mode développement
    // const user = (req as any).user;
    // if (!user) {
    //   return res.status(401).json({ error: "Authentication required" });
    // }

    const {
      initialText,
      selectedPrompts,
      parameters,
      finalPrompt
    } = req.body;

    // Validate parameters
    const validatedParams = psychographyParametersSchema.parse(parameters);

    // Simulate AI generation (replace with real AI service call)
    const generatedContent = {
      title: generateTitle(initialText, validatedParams),
      text: generateText(initialText, selectedPrompts, validatedParams),
      guide: generateGuide(initialText, validatedParams),
      tags: generateTags(initialText, validatedParams),
      imageUrl: null // Will be generated separately
    };

    res.json(generatedContent);
  } catch (error) {
    console.error("Error generating psychography:", error);
    res.status(500).json({ error: "Failed to generate psychography" });
  }
});

// Save psychography to database (temporairement désactivé)
router.post("/api/psychography", async (req, res) => {
  try {
    // Temporairement désactiver en mode développement
    res.json({ 
      id: Date.now(),
      message: "Psychography saved (demo mode - no database)",
      ...req.body 
    });
  } catch (error) {
    console.error("Error saving psychography:", error);
    res.status(500).json({ error: "Failed to save psychography" });
  }
});

// Get user's psychographies (temporairement désactivé)
router.get("/api/psychography/my", async (req, res) => {
  try {
    // Retourner des données de démonstration
    res.json([
      {
        id: 1,
        title: "Exploration créative de la mélancolie",
        text: "Une psychographie de démonstration...",
        createdAt: new Date().toISOString()
      }
    ]);
  } catch (error) {
    console.error("Error fetching user psychographies:", error);
    res.status(500).json({ error: "Failed to fetch psychographies" });
  }
});

// Get psychographies for gallery (with votes, comments, user details)
router.get("/api/psychography/gallery", async (req, res) => {
  try {
    const user = (req as any).user;
    const showPrivate = req.query.private === 'true';
    const filter = req.query.filter as string;
    const sortBy = req.query.sort as string;
    
    const psychographies = await storage.getPsychographiesForGallery({
      userId: user?.id,
      showPrivate,
      filter,
      sortBy
    });
    
    res.json(psychographies);
  } catch (error) {
    console.error("Error fetching gallery psychographies:", error);
    res.status(500).json({ error: "Failed to fetch psychographies" });
  }
});

// Get public psychographies (psychothèque)
router.get("/api/psychography/public", async (req, res) => {
  try {
    const psychographies = await storage.getPublicPsychographies();
    res.json(psychographies);
  } catch (error) {
    console.error("Error fetching public psychographies:", error);
    res.status(500).json({ error: "Failed to fetch public psychographies" });
  }
});

// Vote on psychography
router.post("/api/psychography/:id/vote", async (req, res) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { id } = req.params;
    const voteData = insertVoteSchema.parse({
      ...req.body,
      psychographyId: Number(id),
      userId: user.id
    });

    await storage.voteOnPsychography(voteData);
    res.json({ success: true });
  } catch (error) {
    console.error("Error voting on psychography:", error);
    res.status(500).json({ error: "Failed to vote" });
  }
});

// Comment on psychography
router.post("/api/psychography/:id/comment", async (req, res) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { id } = req.params;
    const commentData = insertCommentSchema.parse({
      ...req.body,
      psychographyId: Number(id),
      userId: user.id
    });

    const comment = await storage.commentOnPsychography(commentData);
    res.json(comment);
  } catch (error) {
    console.error("Error commenting on psychography:", error);
    res.status(500).json({ error: "Failed to comment" });
  }
});

// Create download pack
router.post("/api/psychography/download-pack", async (req, res) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { psychographyIds } = req.body;
    
    if (!Array.isArray(psychographyIds) || psychographyIds.length === 0) {
      return res.status(400).json({ error: "At least one psychography ID is required" });
    }

    // Get psychographies data
    const psychographies = await storage.getPsychographiesByIds(psychographyIds);
    
    // Generate DOCX pack
    const { filename, buffer } = await generateDocxPack(psychographies, user.username);
    
    // Create download pack record
    const downloadPack = await storage.createDownloadPack({
      userId: user.id,
      psychographyIds: psychographyIds.map(String),
      filename,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h expiry
    });

    // In a real app, you'd upload to cloud storage and return the URL
    // For now, we'll return the buffer as base64 for immediate download
    const base64 = buffer.toString('base64');
    const downloadUrl = `data:application/zip;base64,${base64}`;
    
    res.json({ 
      downloadUrl,
      filename,
      packId: downloadPack.id
    });
  } catch (error) {
    console.error("Error creating download pack:", error);
    res.status(500).json({ error: "Failed to create download pack" });
  }
});

// Update psychography visibility
router.patch("/api/psychography/:id/visibility", async (req, res) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { id } = req.params;
    const { isPublic } = req.body;

    await storage.updatePsychographyVisibility(Number(id), user.id, isPublic);
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating psychography visibility:", error);
    res.status(500).json({ error: "Failed to update visibility" });
  }
});

// Delete psychography
router.delete("/api/psychography/:id", async (req, res) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { id } = req.params;
    await storage.deletePsychography(Number(id), user.id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting psychography:", error);
    res.status(500).json({ error: "Failed to delete psychography" });
  }
});

// Helper functions for content generation (replace with actual AI service)
function generateTitle(initialText: string, parameters: any): string {
  const titleWords = [
    "Échos", "Résonances", "Reflets", "Murmures", "Fragments", "Vibrations",
    "Lumières", "Ombres", "Cristaux", "Ondes", "Miroirs", "Essence"
  ];
  
  const descriptors = [
    "silencieuses", "profondes", "secrètes", "lumineuses", "intérieures",
    "sacrées", "cachées", "vibrantes", "éternelles", "mystiques"
  ];

  const randomTitle = titleWords[Math.floor(Math.random() * titleWords.length)];
  const randomDescriptor = descriptors[Math.floor(Math.random() * descriptors.length)];
  
  return `${randomTitle} ${randomDescriptor.charAt(0).toUpperCase() + randomDescriptor.slice(1)}`;
}

function generateText(initialText: string, selectedPrompts: string[], parameters: any): string {
  // This is a simplified version - replace with actual AI generation
  return `Dans les replis secrets de votre être, une présence unique se révèle à travers vos mots : "${initialText.substring(0, 50)}..."

Comme une rivière souterraine qui nourrit des jardins invisibles, votre ressenti actuel porte en lui la sagesse des profondeurs. Les métaphores s'entrelacent : vous êtes à la fois la graine qui attend son printemps et la terre qui l'accueille.

Cette tension créatrice, ce dialogue intérieur entre ce qui est et ce qui aspire à naître, dessine les contours d'une transformation en cours. Votre état présent résonne avec l'archétype du contemplateur, celui qui observe les mouvements subtils de l'âme avec la patience du sage et la curiosité de l'enfant.

Les nuances de votre expression révèlent un paysage intérieur riche en couleurs et en textures, où chaque mot devient une porte vers une compréhension plus profonde de votre essence.`;
}

function generateGuide(initialText: string, parameters: any): string {
  return `Pour accompagner cette résonance :
• Prenez un moment de silence pour ressentir cette présence mentionnée
• Identifiez dans votre quotidien les moments où cette 'rivière souterraine' se manifeste  
• Explorez quelle transformation pourrait vouloir naître en vous
• Notez les synchronicités qui pourraient confirmer cette direction
• Créez un espace quotidien pour dialoguer avec cette partie de vous-même
• Observez comment ces insights peuvent nourrir votre créativité`;
}

function generateTags(initialText: string, parameters: any): string[] {
  const baseTags = ['contemplation', 'transformation', 'intériorité'];
  const emotionalTags = ['présence', 'profondeur', 'sagesse', 'mystère'];
  const metaphoricalTags = ['rivière', 'jardin', 'graine', 'lumière'];
  
  // Mix tags based on content and parameters
  return [...baseTags, ...emotionalTags.slice(0, 2), ...metaphoricalTags.slice(0, 1)];
}

export { router };