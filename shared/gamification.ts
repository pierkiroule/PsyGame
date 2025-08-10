import { BadgeCategory } from './schema';

// Définition des catégories de badges avec leurs niveaux progressifs
export const BADGE_CATEGORIES: Record<string, BadgeCategory> = {
  technique: {
    name: "Maîtrise Technique",
    description: "Progression dans la maîtrise des outils de psychographie",
    levels: [
      {
        level: 1,
        title: "Psychographe Amateur",
        description: "Première exploration de l'univers psychographique",
        icon: `<svg viewBox="0 0 24 24" class="w-8 h-8">
          <circle cx="12" cy="12" r="10" fill="url(#grad1)" stroke="#374151" stroke-width="2">
            <animateTransform attributeName="transform" type="rotate" dur="3s" values="0 12 12;360 12 12" repeatCount="indefinite"/>
          </circle>
          <path d="M8 12h8m-4-4v8" stroke="#f8fafc" stroke-width="2"/>
          <defs>
            <linearGradient id="grad1"><stop offset="0%" stop-color="#64748b"/><stop offset="100%" stop-color="#94a3b8"/></linearGradient>
          </defs>
        </svg>`,
        requirements: { sessionsCompleted: 1, minCreativeScore: 3 }
      },
      {
        level: 2,
        title: "Expert Psychographe",
        description: "Maîtrise confirmée des techniques créatives",
        icon: `<svg viewBox="0 0 24 24" class="w-8 h-8">
          <circle cx="12" cy="12" r="10" fill="url(#grad2)" stroke="#059669" stroke-width="2">
            <animate attributeName="opacity" dur="2s" values="0.7;1;0.7" repeatCount="indefinite"/>
          </circle>
          <path d="M9 12l2 2 4-4" stroke="#f0fdf4" stroke-width="2.5"/>
          <defs>
            <linearGradient id="grad2"><stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#34d399"/></linearGradient>
          </defs>
        </svg>`,
        requirements: { sessionsCompleted: 10, avgCreativeScore: 4, publicVotes: 5 }
      },
      {
        level: 3,
        title: "Maître de la Psychographie",
        description: "Virtuose reconnu de l'art psychographique",
        icon: `<svg viewBox="0 0 24 24" class="w-8 h-8">
          <circle cx="12" cy="12" r="10" fill="url(#grad3)" stroke="#dc2626" stroke-width="2">
            <animateTransform attributeName="transform" type="scale" dur="2s" values="1;1.1;1" repeatCount="indefinite"/>
          </circle>
          <path d="M12 6l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4z" fill="#fef2f2" stroke="#dc2626"/>
          <defs>
            <radialGradient id="grad3"><stop offset="0%" stop-color="#fca5a5"/><stop offset="100%" stop-color="#dc2626"/></radialGradient>
          </defs>
        </svg>`,
        requirements: { sessionsCompleted: 50, avgCreativeScore: 4.5, communityVotes: 25, mentorSessions: 5 }
      }
    ]
  },

  poetique: {
    name: "Créativité Poétique",
    description: "Exploration de la beauté et de la musicalité des mots",
    levels: [
      {
        level: 1,
        title: "Explorateur des Mots",
        description: "Premier pas dans l'univers poétique",
        icon: `<svg viewBox="0 0 24 24" class="w-8 h-8">
          <path d="M14 2H6a2 2 0 0 0-2 2v16l4-2 4 2 4-2 4 2V6a2 2 0 0 0-2-2z" fill="url(#grad4)" stroke="#6366f1"/>
          <path d="M8 8h8M8 12h6M8 16h4" stroke="#e0e7ff" stroke-width="1.5">
            <animate attributeName="stroke-dasharray" dur="3s" values="0,20;20,0;0,20" repeatCount="indefinite"/>
          </path>
          <defs>
            <linearGradient id="grad4"><stop offset="0%" stop-color="#a5b4fc"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
          </defs>
        </svg>`,
        requirements: { poeticScore: 3, wordsWithRhyme: 1 }
      },
      {
        level: 2,
        title: "Artisan Poétique",
        description: "Créateur de vers harmonieux et expressifs",
        icon: `<svg viewBox="0 0 24 24" class="w-8 h-8">
          <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" fill="url(#grad5)" stroke="#7c3aed">
            <animateTransform attributeName="transform" type="rotate" dur="4s" values="0 12 12;360 12 12" repeatCount="indefinite"/>
          </path>
          <defs>
            <linearGradient id="grad5"><stop offset="0%" stop-color="#c4b5fd"/><stop offset="100%" stop-color="#7c3aed"/></linearGradient>
          </defs>
        </svg>`,
        requirements: { avgPoeticScore: 4, metaphorCount: 5, publicPoems: 3 }
      },
      {
        level: 3,
        title: "Virtuose de la Poésie",
        description: "Maître des arts du langage et de l'émotion",
        icon: `<svg viewBox="0 0 24 24" class="w-8 h-8">
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" fill="url(#grad6)" stroke="#f59e0b">
            <animate attributeName="fill" dur="3s" values="url(#grad6);url(#grad6b);url(#grad6)" repeatCount="indefinite"/>
          </path>
          <path d="M8 10c0-2 1-3 4-3s4 1 4 3-1 3-4 3-4-1-4-3z" fill="#fef3c7"/>
          <circle cx="10" cy="10" r="1" fill="#f59e0b"><animate attributeName="r" dur="2s" values="1;1.5;1" repeatCount="indefinite"/></circle>
          <circle cx="14" cy="10" r="1" fill="#f59e0b"><animate attributeName="r" dur="2s" values="1.5;1;1.5" repeatCount="indefinite"/></circle>
          <defs>
            <linearGradient id="grad6"><stop offset="0%" stop-color="#fcd34d"/><stop offset="100%" stop-color="#f59e0b"/></linearGradient>
            <linearGradient id="grad6b"><stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#d97706"/></linearGradient>
          </defs>
        </svg>`,
        requirements: { avgPoeticScore: 4.7, originalityRating: 4.5, poeticAwards: 3 }
      }
    ]
  },

  psychologique: {
    name: "Profondeur Psychologique",
    description: "Exploration des archétypes et de la psyché humaine",
    levels: [
      {
        level: 1,
        title: "Observateur",
        description: "Premier regard sur la complexité humaine",
        icon: `<svg viewBox="0 0 24 24" class="w-8 h-8">
          <circle cx="12" cy="12" r="10" fill="url(#grad7)" stroke="#0891b2">
            <animate attributeName="stroke-dasharray" dur="4s" values="0,62.8;31.4,31.4;62.8,0" repeatCount="indefinite"/>
          </circle>
          <circle cx="12" cy="12" r="3" fill="#cffafe" stroke="#0891b2"/>
          <path d="M12 8v8M8 12h8" stroke="#0891b2" stroke-width="1" opacity="0.6"/>
          <defs>
            <radialGradient id="grad7"><stop offset="0%" stop-color="#a7f3d0"/><stop offset="100%" stop-color="#0891b2"/></radialGradient>
          </defs>
        </svg>`,
        requirements: { psychologicalDepth: 3, archetypeReferences: 1 }
      },
      {
        level: 2,
        title: "Psychographe Éclairé",
        description: "Perspicacité dans l'analyse des motivations profondes",
        icon: `<svg viewBox="0 0 24 24" class="w-8 h-8">
          <path d="M12 2l2 7 7 0-5.5 4.5 2 7L12 16l-5.5 4.5 2-7L3 9h7z" fill="url(#grad8)" stroke="#0d9488">
            <animate attributeName="opacity" dur="3s" values="0.8;1;0.8" repeatCount="indefinite"/>
          </path>
          <circle cx="12" cy="12" r="2" fill="#f0fdfa">
            <animate attributeName="r" dur="2s" values="2;3;2" repeatCount="indefinite"/>
          </circle>
          <defs>
            <linearGradient id="grad8"><stop offset="0%" stop-color="#5eead4"/><stop offset="100%" stop-color="#0d9488"/></linearGradient>
          </defs>
        </svg>`,
        requirements: { avgPsychScore: 4, archetypeAnalysis: 5, depthComments: 10 }
      },
      {
        level: 3,
        title: "Archétype du Conscient",
        description: "Guide spirituel de l'exploration psychique",
        icon: `<svg viewBox="0 0 24 24" class="w-8 h-8">
          <circle cx="12" cy="12" r="10" fill="url(#grad9)" stroke="#7c2d12">
            <animateTransform attributeName="transform" type="rotate" dur="8s" values="0 12 12;360 12 12" repeatCount="indefinite"/>
          </circle>
          <path d="M12 4v8l6 6" stroke="#fed7aa" stroke-width="2">
            <animate attributeName="stroke-dasharray" dur="4s" values="0,20;10,10;20,0" repeatCount="indefinite"/>
          </path>
          <circle cx="12" cy="12" r="1" fill="#fed7aa"/>
          <defs>
            <radialGradient id="grad9"><stop offset="0%" stop-color="#fdba74"/><stop offset="100%" stop-color="#7c2d12"/></radialGradient>
          </defs>
        </svg>`,
        requirements: { avgPsychScore: 4.8, jungianAnalysis: 10, mentoredUsers: 8 }
      }
    ]
  },

  narratif: {
    name: "Maîtrise Narrative",
    description: "Art de tisser des histoires captivantes",
    levels: [
      {
        level: 1,
        title: "Conteur",
        description: "Premiers récits et mise en forme narrative",
        icon: `<svg viewBox="0 0 24 24" class="w-8 h-8">
          <rect x="3" y="4" width="18" height="16" rx="2" fill="url(#grad10)" stroke="#be185d"/>
          <path d="M7 8h10M7 12h8M7 16h6" stroke="#fce7f3" stroke-width="1.5">
            <animate attributeName="stroke-dasharray" dur="2s" values="0,30;15,15;30,0" repeatCount="indefinite"/>
          </path>
          <defs>
            <linearGradient id="grad10"><stop offset="0%" stop-color="#f9a8d4"/><stop offset="100%" stop-color="#be185d"/></linearGradient>
          </defs>
        </svg>`,
        requirements: { narrativeStructure: 3, storyElements: 2 }
      },
      {
        level: 2,
        title: "Tisseur d'Histoires",
        description: "Maîtrise des techniques narratives avancées",
        icon: `<svg viewBox="0 0 24 24" class="w-8 h-8">
          <path d="M12 2l8 8-8 8-8-8z" fill="url(#grad11)" stroke="#be185d" transform="rotate(45 12 12)">
            <animateTransform attributeName="transform" type="rotate" dur="6s" values="45 12 12;405 12 12" repeatCount="indefinite"/>
          </path>
          <circle cx="12" cy="12" r="3" fill="#fce7f3" stroke="#be185d"/>
          <defs>
            <linearGradient id="grad11"><stop offset="0%" stop-color="#f9a8d4"/><stop offset="100%" stop-color="#831843"/></linearGradient>
          </defs>
        </svg>`,
        requirements: { avgNarrativeScore: 4, plotTwists: 3, characterDev: 5 }
      },
      {
        level: 3,
        title: "Alchimiste Narratif",
        description: "Transformateur d'émotions en épopées mémorables",
        icon: `<svg viewBox="0 0 24 24" class="w-8 h-8">
          <circle cx="12" cy="12" r="10" fill="url(#grad12)" stroke="#be185d">
            <animate attributeName="fill-opacity" dur="3s" values="0.8;1;0.8" repeatCount="indefinite"/>
          </circle>
          <path d="M8 8l8 8M8 16l8-8" stroke="#fce7f3" stroke-width="2">
            <animate attributeName="stroke-dasharray" dur="4s" values="0,22.6;11.3,11.3;22.6,0" repeatCount="indefinite"/>
          </path>
          <circle cx="12" cy="12" r="2" fill="#fce7f3"/>
          <defs>
            <radialGradient id="grad12"><stop offset="0%" stop-color="#f9a8d4"/><stop offset="100%" stop-color="#831843"/></radialGradient>
          </defs>
        </svg>`,
        requirements: { avgNarrativeScore: 4.7, epicStories: 5, narrativeInnovation: 8 }
      }
    ]
  },

  communautaire: {
    name: "Engagement Communautaire",
    description: "Contribution à l'enrichissement de la psychothèque",
    levels: [
      {
        level: 1,
        title: "Participant",
        description: "Membre actif de la communauté créative",
        icon: `<svg viewBox="0 0 24 24" class="w-8 h-8">
          <circle cx="12" cy="8" r="3" fill="url(#grad13)" stroke="#059669"/>
          <path d="M8 14s1-2 4-2 4 2 4 2v6H8z" fill="url(#grad13)" stroke="#059669">
            <animate attributeName="fill-opacity" dur="3s" values="0.7;1;0.7" repeatCount="indefinite"/>
          </path>
          <defs>
            <linearGradient id="grad13"><stop offset="0%" stop-color="#a7f3d0"/><stop offset="100%" stop-color="#059669"/></linearGradient>
          </defs>
        </svg>`,
        requirements: { communityVotes: 5, commentsGiven: 3 }
      },
      {
        level: 2,
        title: "Mentor",
        description: "Guide et inspirateur pour les nouveaux créateurs",
        icon: `<svg viewBox="0 0 24 24" class="w-8 h-8">
          <circle cx="9" cy="7" r="2" fill="url(#grad14)" stroke="#059669"/>
          <circle cx="15" cy="7" r="2" fill="url(#grad14)" stroke="#059669"/>
          <path d="M6 13s1-2 3-2 3 2 3 2v6H6z" fill="url(#grad14)" stroke="#059669"/>
          <path d="M12 13s1-2 3-2 3 2 3 2v6h-6z" fill="url(#grad14)" stroke="#059669"/>
          <path d="M9 19l3-3 3 3" stroke="#f0fdf4" stroke-width="1.5">
            <animate attributeName="stroke-dasharray" dur="2s" values="0,12;6,6;12,0" repeatCount="indefinite"/>
          </path>
          <defs>
            <linearGradient id="grad14"><stop offset="0%" stop-color="#6ee7b7"/><stop offset="100%" stop-color="#059669"/></linearGradient>
          </defs>
        </svg>`,
        requirements: { helpfulVotes: 15, mentoringSessions: 5, qualityComments: 20 }
      },
      {
        level: 3,
        title: "Pilier de la Communauté",
        description: "Architecte de l'esprit collectif créatif",
        icon: `<svg viewBox="0 0 24 24" class="w-8 h-8">
          <rect x="4" y="10" width="16" height="10" fill="url(#grad15)" stroke="#059669"/>
          <triangle points="12,2 20,10 4,10" fill="url(#grad15)" stroke="#059669">
            <animate attributeName="fill-opacity" dur="4s" values="0.8;1;0.8" repeatCount="indefinite"/>
          </triangle>
          <rect x="7" y="12" width="2" height="6" fill="#f0fdf4"/>
          <rect x="11" y="12" width="2" height="6" fill="#f0fdf4"/>
          <rect x="15" y="12" width="2" height="6" fill="#f0fdf4"/>
          <defs>
            <linearGradient id="grad15"><stop offset="0%" stop-color="#34d399"/><stop offset="100%" stop-color="#059669"/></linearGradient>
          </defs>
        </svg>`,
        requirements: { communityLeadership: 30, moderationActions: 10, communityEvents: 5 }
      }
    ]
  },

  suggestion: {
    name: "Art de la Suggestion",
    description: "Capacité à inspirer et guider la créativité d'autrui",
    levels: [
      {
        level: 1,
        title: "Inspirateur",
        description: "Étincelles créatives qui allument l'imagination",
        icon: `<svg viewBox="0 0 24 24" class="w-8 h-8">
          <circle cx="12" cy="9" r="3" fill="url(#grad16)" stroke="#f59e0b">
            <animate attributeName="r" dur="2s" values="3;4;3" repeatCount="indefinite"/>
          </circle>
          <path d="M12 12v4M9 14l3 3 3-3M12 20h0" stroke="#f59e0b" stroke-width="2"/>
          <path d="M8 8l1.5 1.5M16 8l-1.5 1.5M6 12h2M16 12h2" stroke="#f59e0b" stroke-width="1.5">
            <animate attributeName="opacity" dur="3s" values="0.5;1;0.5" repeatCount="indefinite"/>
          </path>
          <defs>
            <radialGradient id="grad16"><stop offset="0%" stop-color="#fef3c7"/><stop offset="100%" stop-color="#f59e0b"/></radialGradient>
          </defs>
        </svg>`,
        requirements: { inspirationGiven: 5, creativePrompts: 3 }
      },
      {
        level: 2,
        title: "Guide Créatif",
        description: "Mentor dans l'exploration des possibles artistiques",
        icon: `<svg viewBox="0 0 24 24" class="w-8 h-8">
          <path d="M12 2l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" fill="url(#grad17)" stroke="#f59e0b">
            <animateTransform attributeName="transform" type="rotate" dur="5s" values="0 12 12;360 12 12" repeatCount="indefinite"/>
          </path>
          <circle cx="12" cy="12" r="2" fill="#fef3c7">
            <animate attributeName="opacity" dur="2s" values="0.7;1;0.7" repeatCount="indefinite"/>
          </circle>
          <defs>
            <linearGradient id="grad17"><stop offset="0%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#d97706"/></linearGradient>
          </defs>
        </svg>`,
        requirements: { guidanceSessions: 10, successfulInspiration: 15, creativeChallenges: 8 }
      },
      {
        level: 3,
        title: "Oracle de l'Inspiration",
        description: "Source mystique de visions créatives transformatrices",
        icon: `<svg viewBox="0 0 24 24" class="w-8 h-8">
          <circle cx="12" cy="12" r="10" fill="url(#grad18)" stroke="#d97706">
            <animate attributeName="stroke-width" dur="3s" values="2;4;2" repeatCount="indefinite"/>
          </circle>
          <path d="M12 6v12M6 12h12" stroke="#fef3c7" stroke-width="1.5"/>
          <circle cx="12" cy="9" r="1" fill="#fef3c7"><animate attributeName="cy" dur="4s" values="9;15;9" repeatCount="indefinite"/></circle>
          <circle cx="9" cy="12" r="1" fill="#fef3c7"><animate attributeName="cx" dur="4s" values="9;15;9" repeatCount="indefinite"/></circle>
          <circle cx="15" cy="12" r="1" fill="#fef3c7"><animate attributeName="cx" dur="4s" values="15;9;15" repeatCount="indefinite"/></circle>
          <circle cx="12" cy="15" r="1" fill="#fef3c7"><animate attributeName="cy" dur="4s" values="15;9;15" repeatCount="indefinite"/></circle>
          <defs>
            <radialGradient id="grad18"><stop offset="0%" stop-color="#fcd34d"/><stop offset="100%" stop-color="#92400e"/></radialGradient>
          </defs>
        </svg>`,
        requirements: { oracleStatus: true, legendaryInspiration: 25, transformativeGuidance: 12 }
      }
    ]
  }
};

// Critères d'évaluation IA
export const AI_EVALUATION_CRITERIA = {
  creativite: { weight: 0.25, description: "Originalité et inventivité" },
  poetique: { weight: 0.20, description: "Beauté et musicalité du langage" },
  coherence: { weight: 0.20, description: "Logique narrative et cohésion" },
  profondeur: { weight: 0.15, description: "Richesse psychologique et symbolique" },
  emotion: { weight: 0.10, description: "Impact émotionnel et résonance" },
  technique: { weight: 0.10, description: "Maîtrise des outils expressifs" }
};

// Fonction pour calculer le score IA pondéré
export function calculateAIScore(scores: Record<string, number>): number {
  let totalScore = 0;
  let totalWeight = 0;
  
  for (const [criterion, value] of Object.entries(scores)) {
    const criterionData = AI_EVALUATION_CRITERIA[criterion as keyof typeof AI_EVALUATION_CRITERIA];
    const weight = criterionData?.weight || 0;
    totalScore += value * weight;
    totalWeight += weight;
  }
  
  return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) / 100 : 0;
}

// Tags IA prédéfinis par catégories
export const AI_TAG_CATEGORIES = {
  emotions: ["mélancolie", "euphorie", "nostalgie", "espoir", "anxiété", "sérénité", "passion", "solitude"],
  archétypes: ["héros", "sage", "innocent", "explorateur", "rebelle", "amoureux", "créateur", "soignant"],
  thèmes: ["nature", "temps", "mémoire", "identité", "transformation", "voyage", "mort", "renaissance"],
  styles: ["surréaliste", "romantique", "expressionniste", "minimaliste", "baroque", "moderne", "classique"],
  techniques: ["métaphore", "allégorie", "synesthésie", "oxymore", "anaphore", "chiasme", "ellipse"]
};