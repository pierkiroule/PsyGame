// Système de gamification simplifié pour Psychographe - 4 degrés poétiques

export interface Badge {
  id: string;
  name: string;
  description: string;
  level: 1 | 2 | 3;
  icon: string;
  color: string;
  requirements: {
    points: number;
    condition?: string;
  };
}

export const BADGE_LEVELS = {
  1: { name: 'Psychographe en herbe', color: 'text-blue-400', description: 'Premiers pas créatifs' },
  2: { name: 'Psychographe de ouf !', color: 'text-blue-500', description: 'Créativité débridée' },
  3: { name: 'Psychographe de génie', color: 'text-purple-600', description: 'Maîtrise exceptionnelle' }
} as const;

export const BADGES: Badge[] = [
  // Niveau 1 - Psychographe en herbe
  {
    id: 'herbe-debut',
    name: 'Première Psychographie',
    description: 'Vous venez de créer votre première psychographie !',
    level: 1,
    icon: '🌱',
    color: 'text-blue-400',
    requirements: { points: 25 }
  },
  {
    id: 'herbe-exploration',
    name: 'Explorateur Curieux',
    description: 'Vous découvrez les mystères de la psychographie',
    level: 1,
    icon: '🔍',
    color: 'text-blue-400',
    requirements: { points: 75 }
  },

  // Niveau 2 - Psychographe de ouf !
  {
    id: 'ouf-creativite',
    name: 'Créateur Inspiré',
    description: 'Vos psychographies touchent en plein cœur !',
    level: 2,
    icon: '🎨',
    color: 'text-blue-500',
    requirements: { points: 200 }
  },
  {
    id: 'ouf-communaute',
    name: 'Âme de la Communauté',
    description: 'Vous enrichissez la psychothèque avec brio',
    level: 2,
    icon: '💝',
    color: 'text-blue-500',
    requirements: { points: 300 }
  },

  // Niveau 3 - Psychographe de génie
  {
    id: 'genie-maitrise',
    name: 'Virtuose de l\'Âme',
    description: 'Vous révélez l\'invisible avec un talent rare',
    level: 3,
    icon: '🌟',
    color: 'text-purple-600',
    requirements: { points: 600 }
  },
  {
    id: 'genie-legende',
    name: 'Légende Vivante',
    description: 'Votre génie inspire toute la communauté',
    level: 3,
    icon: '👑',
    color: 'text-purple-600',
    requirements: { points: 1000 }
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