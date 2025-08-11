// Jeu simplifié avec une seule question universelle

export interface SimpleGameMode {
  id: string;
  title: string;
  question: string;
  placeholder: string;
  duration: string;
  icon: string;
  description: string;
}

// LA question universelle
export const UNIVERSAL_QUESTION = "Qu'est-ce qui vous habite maintenant ?";

export const simpleGameModes: SimpleGameMode[] = [
  {
    id: 'instant-flash',
    title: 'Instant Flash',
    question: UNIVERSAL_QUESTION,
    placeholder: "Laissez venir ce qui vous traverse...",
    duration: '30 sec',
    icon: '⚡',
    description: 'Première intuition, réponse spontanée'
  },
  {
    id: 'contemplation',
    title: 'Contemplation',
    question: UNIVERSAL_QUESTION,
    placeholder: "Prenez le temps d'explorer ce qui vous habite...",
    duration: '5 min',
    icon: '🌊',
    description: 'Réflexion profonde, réponse développée'
  },
  {
    id: 'vocal-pur',
    title: 'Vocal Pur',
    question: UNIVERSAL_QUESTION,
    placeholder: "Parlez librement de ce qui vous habite...",
    duration: '2 min',
    icon: '🎤',
    description: 'Expression entièrement vocale, naturelle'
  }
];

// Formats de jeu
export interface GameFormat {
  id: 'solo' | 'duo' | 'groupe';
  title: string;
  icon: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
}

export const gameFormats: GameFormat[] = [
  {
    id: 'solo',
    title: 'Solo',
    icon: '🎭',
    description: 'Introspection personnelle',
    minPlayers: 1,
    maxPlayers: 1
  },
  {
    id: 'duo',
    title: 'Duo',
    icon: '👥',
    description: 'Résonances croisées',
    minPlayers: 2,
    maxPlayers: 2
  },
  {
    id: 'groupe',
    title: 'Groupe',
    icon: '🌟',
    description: 'Constellation collective',
    minPlayers: 3,
    maxPlayers: 8
  }
];

// Associations d'idées pour inspiration
export const ideaAssociations = [
  // Émotions
  "joie", "mélancolie", "sérénité", "urgence", "nostalgie", "espoir",
  "inquiétude", "émerveillement", "tendresse", "frustration",
  
  // Sensations
  "chaleur", "frisson", "pesanteur", "légèreté", "fluidité", "tension",
  "douceur", "rugosité", "vibration", "immobilité",
  
  // Éléments naturels
  "océan", "montagne", "forêt", "désert", "orage", "aurore",
  "brume", "cascade", "prairie", "volcan",
  
  // Couleurs/Lumières
  "or liquide", "bleu profond", "rouge sang", "vert émeraude",
  "lumière dorée", "ombre violette", "blanc nacré", "noir velours",
  
  // Métaphores temporelles
  "instant suspendu", "éternité", "cycle", "spirale", "éclair",
  "marée", "saison qui bascule", "aube", "crépuscule",
  
  // Archétypes
  "voyageur", "gardien", "créateur", "rebelle", "sage", "enfant",
  "guérisseur", "explorateur", "rêveur", "bâtisseur"
];

export const inspirationPrompts = [
  "Comme une couleur qui déborde...",
  "Tel un souvenir qui remonte...",
  "À la manière d'une musique intérieure...",
  "Pareil à un paysage secret...",
  "Comme une histoire qui commence...",
  "Tel un souffle qui traverse...",
  "À l'image d'une danse invisible...",
  "Comme un parfum d'enfance...",
  "Tel un rêve éveillé...",
  "À la façon d'une vague qui monte..."
];