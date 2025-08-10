// Système de gamification simplifié pour Psychographe - 4 degrés poétiques

export interface Badge {
  id: string;
  name: string;
  description: string;
  level: 1 | 2 | 3 | 4;
  icon: string;
  color: string;
  requirements: {
    points: number;
    condition?: string;
  };
}

export const BADGE_LEVELS = {
  1: { name: 'Éveil', color: 'text-emerald-300', description: 'Premiers pas créatifs' },
  2: { name: 'Éclosion', color: 'text-blue-400', description: 'Exploration approfondie' },
  3: { name: 'Épanouissement', color: 'text-purple-500', description: 'Maîtrise créative' },
  4: { name: 'Rayonnement', color: 'text-amber-400', description: 'Inspiration partagée' }
} as const;

export const BADGES: Badge[] = [
  // Niveau 1 - Éveil
  {
    id: 'eveil-creativite',
    name: 'Première Étincelle',
    description: 'Votre créativité s\'éveille doucement',
    level: 1,
    icon: '🌱',
    color: 'text-emerald-300',
    requirements: { points: 50 }
  },
  {
    id: 'eveil-partage',
    name: 'Murmure Timide',
    description: 'Vous osez partager vos premières créations',
    level: 1,
    icon: '🤗',
    color: 'text-emerald-300',
    requirements: { points: 25, condition: 'first_share' }
  },

  // Niveau 2 - Éclosion
  {
    id: 'eclosion-exploration',
    name: 'Explorateur d\'Âmes',
    description: 'Vous sondez les profondeurs de l\'imaginaire',
    level: 2,
    icon: '🔍',
    color: 'text-blue-400',
    requirements: { points: 200 }
  },
  {
    id: 'eclosion-communaute',
    name: 'Tisseuse de Liens',
    description: 'Vos mots créent des connexions authentiques',
    level: 2,
    icon: '🤝',
    color: 'text-blue-400',
    requirements: { points: 150, condition: 'community_engagement' }
  },

  // Niveau 3 - Épanouissement
  {
    id: 'epanouissement-maitrise',
    name: 'Artisan du Verbe',
    description: 'Votre style unique s\'affirme avec élégance',
    level: 3,
    icon: '✨',
    color: 'text-purple-500',
    requirements: { points: 500 }
  },
  {
    id: 'epanouissement-inspiration',
    name: 'Source d\'Inspiration',
    description: 'Vos créations touchent et inspirent les autres',
    level: 3,
    icon: '💫',
    color: 'text-purple-500',
    requirements: { points: 400, condition: 'high_engagement' }
  },

  // Niveau 4 - Rayonnement
  {
    id: 'rayonnement-maitrise',
    name: 'Virtuose de l\'Invisible',
    description: 'Vous révélez l\'ineffable avec grâce',
    level: 4,
    icon: '🌟',
    color: 'text-amber-400',
    requirements: { points: 1000 }
  },
  {
    id: 'rayonnement-guide',
    name: 'Guide Lumineux',
    description: 'Votre présence illumine la communauté',
    level: 4,
    icon: '🕯️',
    color: 'text-amber-400',
    requirements: { points: 800, condition: 'mentor_role' }
  }
];

// Système de points simplifié
export const POINT_VALUES = {
  CREATE_PSYCHOGRAPHY: 20,
  SHARE_PUBLICLY: 10,
  RECEIVE_VOTE: 3,
  RECEIVE_COMMENT: 5,
  GIVE_VOTE: 1,
  GIVE_COMMENT: 2,
  WEEKLY_ACTIVE: 15,
  QUALITY_BONUS: 25
} as const;

export function calculateUserLevel(totalPoints: number): number {
  if (totalPoints < 100) return 1;
  if (totalPoints < 350) return 2;
  if (totalPoints < 800) return 3;
  if (totalPoints < 1500) return 4;
  if (totalPoints < 2500) return 5;
  if (totalPoints < 4000) return 6;
  if (totalPoints < 6000) return 7;
  if (totalPoints < 8500) return 8;
  if (totalPoints < 11500) return 9;
  return 10;
}

export function getNextLevelRequirement(currentLevel: number): number {
  const levels = [0, 100, 350, 800, 1500, 2500, 4000, 6000, 8500, 11500, 15000];
  return levels[currentLevel] || 15000;
}

export function getBadgesForUser(userPoints: number): Badge[] {
  return BADGES.filter(badge => userPoints >= badge.requirements.points);
}

// Messages d'encouragement poétiques
export const ENCOURAGEMENT_MESSAGES = [
  "Votre créativité s'épanouit comme une fleur au soleil",
  "Chaque mot que vous écrivez enrichit l'univers",
  "Votre imagination dessine des chemins inexplorés",
  "Dans vos créations réside une beauté unique",
  "Vous révélez des trésors cachés de l'âme humaine"
] as const;