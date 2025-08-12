import express from "express";
import { z } from "zod";
import { insertPsychographySchema, psychographyParametersSchema, insertVoteSchema, insertCommentSchema } from "@shared/schema";
import { storage } from "./storage";
import { generateDocxPack } from "./docxGenerator";
import { db } from "./db";

const router = express.Router();

// Authentication routes
router.get("/api/auth/me", async (req, res) => {
  // For development, return null user (no authentication yet)
  res.json({ user: null });
});

router.post("/api/auth/login", async (req, res) => {
  // For development, return success without actual authentication
  res.json({ user: { id: 1, username: "demo", email: "demo@example.com" } });
});

router.post("/api/auth/register", async (req, res) => {
  // For development, return success without actual registration
  res.json({ user: { id: 1, username: "demo", email: "demo@example.com" } });
});

router.post("/api/auth/logout", async (req, res) => {
  // For development, return success
  res.json({ success: true });
});

// Get public psychographies
router.get("/api/psychographies/public", async (req, res) => {
  try {
    // Pour le développement, données de démonstration avec structure complète
    const publicPsychographies = [
      {
        id: 8,
        title: "L'écologie du temps créatif",
        initialPrompt: "Je ressens une urgence constante qui m'empêche de créer sereinement...",
        enrichedPrompt: "Explorez votre rapport au temps et découvrez comment ralentir pour mieux créer",
        finalText: "L'écologie du temps révèle comment notre rapport temporel influence notre créativité. Cette psychographie explore les rythmes naturels de l'inspiration et invite à une reconnexion profonde avec les cycles créatifs authentiques. En ralentissant, nous découvrons que la création véritable nécessite un temps non-mesurable, un espace de respiration où l'âme peut s'exprimer librement.",
        sensoryGuide: "Ressentez le ralentissement de votre respiration, la détente de vos épaules, l'apaisement de votre mental quand vous vous accordez du temps créatif sans contrainte.",
        metaphor: "Comme un arbre qui pousse selon son rythme naturel, votre créativité s'épanouit quand vous respectez les saisons de votre inspiration.",
        tags: ["écologie", "temps", "créativité", "lenteur"],
        isPublic: true,
        authorPseudo: "TimeMaster",
        likesCount: 15,
        commentsCount: 8,
        averageRating: 4.3,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        imageUrl: null,
        isLiked: false,
        userRating: 0
      },
      {
        id: 9,
        title: "Résonances urbaines",
        initialPrompt: "Le bruit de la ville me traverse et devient musique intérieure...",
        enrichedPrompt: "Transformez les sons urbains en symphonie personnelle et explorez votre rapport à l'environnement sonore",
        finalText: "Les résonances urbaines révèlent notre capacité à transformer le chaos en harmonie. Cette psychographie explore comment nous pouvons transmuter les bruits de la ville en mélodie intérieure, créant une bulle de paix au cœur de l'agitation. La ville devient alors un orchestre dont nous sommes le chef d'œuvre.",
        sensoryGuide: "Écoutez les sons qui vous entourent sans jugement, laissez-les vous traverser comme des vagues sonores qui massent votre être intérieur.",
        metaphor: "Tel un musicien qui trouve la mélodie dans le silence, vous orchestrez la cacophonie urbaine en symphonie personnelle.",
        tags: ["urbain", "sons", "harmonie", "ville"],
        isPublic: true,
        authorPseudo: "UrbanPoet",
        likesCount: 23,
        commentsCount: 12,
        averageRating: 4.7,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        imageUrl: null,
        isLiked: false,
        userRating: 0
      }
    ];
    
    res.json(publicPsychographies);
  } catch (error) {
    console.error("Error fetching public psychographies:", error);
    res.status(500).json({ error: "Failed to load psychographies" });
  }
});

// Get user's personal psychographies with enhanced structure
router.get("/api/psychographies/my", async (req, res) => {
  try {
    const myPsychographies = [
      {
        id: 101,
        title: "Ma réflexion personnelle du matin",
        initialPrompt: "Ce matin, en observant la rosée sur les feuilles, je me sens envahi d'une douce mélancolie mêlée d'émerveillement...",
        enrichedPrompt: "Explorez les nuances de cette contemplation matinale et ce qu'elle révèle de votre rapport au temps et à la beauté",
        finalText: "Cette contemplation matinale m'a révélé ma capacité naturelle à trouver la poésie dans l'ordinaire, à transformer les moments simples en sources d'émerveillement. La rosée devient métaphore de la fragilité précieuse de chaque instant, miroir de mon âme qui cherche constamment la beauté dans l'éphémère.",
        sensoryGuide: "Ressentez la fraîcheur de la rosée sur vos doigts, l'odeur de la terre humide, la douceur de la lumière naissante qui caresse votre visage.",
        metaphor: "Comme la rosée qui perle délicatement sur chaque brin d'herbe, votre sensibilité dépose sa marque poétique sur chaque instant de votre existence.",
        tags: ["personnel", "contemplation", "matin", "nature"],
        isPublic: false,
        authorPseudo: "moi",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 102,
        title: "Mes questionnements intérieurs",
        initialPrompt: "Je me demande souvent ce qui guide réellement mes choix profonds, cette voix intérieure qui semble connaître ma vérité...",
        enrichedPrompt: "Plongez dans cette exploration de l'authenticité personnelle et des mécanismes de décision intérieure",
        finalText: "Cette introspection révèle une personnalité qui cherche l'authenticité dans chacune de ses décisions, qui refuse les compromis avec ses valeurs fondamentales. Ma voix intérieure devient boussole existentielle, guide vers une cohérence profonde entre pensée, émotion et action.",
        sensoryGuide: "Portez attention aux sensations dans votre poitrine quand vous prenez une décision alignée, cette chaleur qui vous parcourt quand vous agissez en accord avec vos valeurs.",
        metaphor: "Tel un navigateur guidé par les étoiles, vous suivez la constellation de vos valeurs profondes pour traverser l'océan de vos choix de vie.",
        tags: ["personnel", "introspection", "valeurs", "authenticité"],
        isPublic: true,
        authorPseudo: "moi",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    res.json(myPsychographies);
  } catch (error) {
    console.error("Error fetching personal psychographies:", error);
    res.status(500).json({ error: "Failed to load psychographies" });
  }
});

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

// Generate final content
router.post("/api/psychography/generate-content", async (req, res) => {
  try {
    const { initialText, selectedPrompt, style } = req.body;
    
    if (!initialText?.trim() || !selectedPrompt?.trim()) {
      return res.status(400).json({ error: "Initial text and prompt are required" });
    }

    // Génération fallback locale pour le développement
    const content = `À partir de votre inspiration "${initialText}", voici une psychographie ${style || 'créative'} :

${selectedPrompt}

Cette création révèle les dimensions cachées de votre pensée initiale, tissant des liens entre l'intuition première et les résonances profondes de votre être créatif. Votre expression authentique trouve ici une forme d'expansion poétique qui enrichit la compréhension de vos propres processus intérieurs.`;
    
    res.json({ content });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

// Generate final psychography content
router.post("/api/psychography/generate-final", async (req, res) => {
  try {
    const { initialPrompt, enrichedPrompt } = req.body;
    
    if (!initialPrompt?.trim() || !enrichedPrompt?.trim()) {
      return res.status(400).json({ error: "Initial and enriched prompts are required" });
    }

    // Génération fallback locale pour le développement
    const response = {
      title: initialPrompt.slice(0, 50) + (initialPrompt.length > 50 ? '...' : ''),
      finalText: `Voici votre création psychographique inspirée de "${initialPrompt}" :

${enrichedPrompt}

Cette exploration révèle les dimensions cachées de votre inspiration première. Votre expression authentique trouve ici une forme d'expansion créative qui enrichit la compréhension de vos propres processus intérieurs et ouvre vers de nouvelles perspectives existentielles.`,
      
      sensoryGuide: `Pour explorer cette psychographie dans votre corps et vos sensations :

• Respirez profondément et laissez les mots résonner en vous
• Observez quelles images, couleurs ou textures émergent spontanément
• Notez les sensations physiques qui accompagnent cette lecture
• Explorez comment votre posture s'adapte naturellement à ce contenu
• Permettez aux émotions de circuler sans jugement`,

      metaphor: `Comme ${['une graine qui trouve son terreau fertile', 'une vague qui rencontre le rivage', 'un miroir qui révèle des reflets inattendus', 'un écho qui transforme le silence en musique'][Math.floor(Math.random() * 4)]}, votre inspiration initiale se déploie ici en une cartographie plus vaste de votre paysage intérieur. Cette création devient le pont entre votre intuition première et les territoires inexplorés de votre être créatif.`
    };
    
    res.json(response);
  } catch (error) {
    console.error("Error generating final content:", error);
    res.status(500).json({ error: "Failed to generate final content" });
  }
});

// Create new psychography with enhanced structure
router.post("/api/psychography", async (req, res) => {
  try {
    const { 
      initialPrompt, 
      enrichedPrompt, 
      title, 
      finalText, 
      sensoryGuide, 
      metaphor, 
      tags = [], 
      isPublic = false,
      authorPseudo 
    } = req.body;
    
    if (!title?.trim() || !finalText?.trim()) {
      return res.status(400).json({ error: "Title and final text are required" });
    }

    // Création avec structure enrichie
    const newPsychography = {
      id: Date.now(),
      authorPseudo: authorPseudo || "Anonyme",
      createdAt: new Date().toISOString(),
      title,
      initialPrompt,
      enrichedPrompt,
      finalText,
      sensoryGuide,
      metaphor,
      tags,
      isPublic,
      likesCount: 0,
      commentsCount: 0,
      averageRating: 0,
      imageUrl: null // À implémenter avec génération d'images
    };
    
    res.json(newPsychography);
  } catch (error) {
    console.error("Error creating psychography:", error);
    res.status(500).json({ error: "Failed to create psychography" });
  }
});

// Generate psychography content
router.post("/api/psychography/generate", async (req, res) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: "Authentication required" });
    }

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

// Save psychography to database
router.post("/api/psychography", async (req, res) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const psychographyData = insertPsychographySchema.parse({
      ...req.body,
      userId: user.id
    });

    const psychography = await storage.createPsychography(psychographyData);
    res.json(psychography);
  } catch (error) {
    console.error("Error saving psychography:", error);
    res.status(500).json({ error: "Failed to save psychography" });
  }
});

// Get user's psychographies
router.get("/api/psychography/my", async (req, res) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const includePrivate = req.query.private !== 'false';
    const psychographies = await storage.getUserPsychographies(user.id, includePrivate);
    res.json(psychographies);
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

// Routes minimalistes écoresponsables
router.post("/api/generate/prompts", async (req, res) => {
  try {
    const { initialText, style } = req.body;
    
    // Simulation simple - remplacer par vraie IA si besoin
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

router.post("/api/generate/content", async (req, res) => {
  try {
    const { initialText, selectedPrompt, style } = req.body;
    
    // Simulation simple - remplacer par vraie IA si besoin
    const content = `À partir de votre inspiration "${initialText}", voici une psychographie ${style} :

${selectedPrompt}

Cette réflexion révèle les dimensions cachées de votre pensée initiale, tissant des liens entre l'intuition première et les résonances profondes de votre être créatif.`;
    
    res.json({ content });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Erreur lors de la génération" });
  }
});

// Export individual psychography
router.get("/api/psychography/:id/export", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Pour le développement, créer un export simple
    const exportContent = `# Psychographie #${id}

Exportée le ${new Date().toLocaleDateString('fr-FR')}

Cette psychographie a été créée dans votre Studio Psychographique.

---
Psychographe - Outil écoresponsable de création projective
`;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="psychographie-${id}.txt"`);
    res.send(exportContent);
  } catch (error) {
    console.error("Error exporting psychography:", error);
    res.status(500).json({ error: "Failed to export psychography" });
  }
});

// User statistics endpoint
router.get("/api/user/stats", async (req, res) => {
  try {
    // Statistiques de démonstration
    const stats = {
      totalPsychographies: 12,
      publicPsychographies: 5,
      totalLikes: 47,
      totalComments: 23,
      averageRating: 4.2,
      creditsRemaining: 35,
      subscriptionType: "premium",
      subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    res.json(stats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ error: "Failed to load user statistics" });
  }
});

// Comments endpoints
router.get("/api/psychography/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Commentaires de démonstration
    const comments = [
      {
        id: 1,
        content: "Cette psychographie me touche profondément, elle résonne avec ma propre quête d'authenticité.",
        authorPseudo: "Sarah_créative",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        content: "Magnifique exploration intérieure ! La métaphore du navigateur est particulièrement évocatrice.",
        authorPseudo: "Marc_philosophe",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to load comments" });
  }
});

router.post("/api/psychography/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    
    if (!content?.trim()) {
      return res.status(400).json({ error: "Comment content is required" });
    }

    const newComment = {
      id: Date.now(),
      content,
      authorPseudo: "demo_user",
      createdAt: new Date().toISOString()
    };
    
    res.json(newComment);
  } catch (error) {
    console.error("Error posting comment:", error);
    res.status(500).json({ error: "Failed to post comment" });
  }
});

// Rating endpoints
router.post("/api/psychography/:id/like", async (req, res) => {
  try {
    const { id } = req.params;
    
    res.json({ 
      success: true, 
      newLikeCount: Math.floor(Math.random() * 20) + 1,
      isLiked: true 
    });
  } catch (error) {
    console.error("Error liking psychography:", error);
    res.status(500).json({ error: "Failed to like psychography" });
  }
});

router.post("/api/psychography/:id/rate", async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    res.json({ 
      success: true, 
      userRating: rating,
      newAverageRating: Math.round((Math.random() * 2 + 3.5) * 10) / 10
    });
  } catch (error) {
    console.error("Error rating psychography:", error);
    res.status(500).json({ error: "Failed to rate psychography" });
  }
});

export { router };