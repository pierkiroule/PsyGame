export interface GameMode {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  instructions: string[];
  example: string;
  duration: string;
  icon: string;
  color: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  cooperative: boolean;
}

export const gameModes: GameMode[] = [
  {
    id: 'sprint-creatif',
    title: 'Sprint Express',
    subtitle: 'Création rapide et spontanée',
    description: 'Parfait pour commencer ! Laissez vos premières idées s\'exprimer en 3 minutes chrono.',
    instructions: [
      'Répondez instinctivement aux 4 questions en 3 minutes',
      'Privilégiez la spontanéité à la réflexion',
      'Utilisez la voix pour capturer vos idées rapidement',
      'Partagez votre création avec la communauté'
    ],
    example: '"Une émotion qui vous traverse ?" → "Rouge sang qui pulse dans mes veines"',
    duration: '3 min',
    icon: '⚡',
    color: 'from-orange-500 to-red-600',
    difficulty: 'Débutant',
    cooperative: true
  },
  {
    id: 'exploration-profonde',
    title: 'Voyage Intérieur',
    subtitle: '7 jours d\'introspection guidée',
    description: 'Pour les curieux de soi ! Un parcours en profondeur où chaque jour révèle une nouvelle facette.',
    instructions: [
      'Une question par jour pendant 7 jours consécutifs',
      'Relisez vos réponses précédentes avant de continuer',
      'Développez vos idées avec 3-5 phrases minimum',
      'Créez des liens entre vos réponses quotidiennes'
    ],
    example: '"Un souvenir d\'enfance" puis "Comment il influence mes choix aujourd\'hui ?"',
    duration: '7 jours',
    icon: '🌊',
    color: 'from-blue-500 to-indigo-600',
    difficulty: 'Avancé',
    cooperative: true
  },
  {
    id: 'synesthesie',
    title: 'Palette Sensorielle',
    subtitle: 'Créez avec tous vos sens',
    description: 'Mélangez couleurs, sons et textures ! Parfait pour explorer vos associations sensorielles.',
    instructions: [
      'Associez chaque réponse à une couleur, un son, une texture',
      'Laissez un sens en guider un autre librement',
      'Décrivez les sensations plutôt que les concepts',
      'Explorez les correspondances surprenantes'
    ],
    example: '"Cette émotion" → "Bleu électrique qui crépite, goût de menthe glaciale"',
    duration: '15 min',
    icon: '🎨',
    color: 'from-purple-500 to-pink-600',
    difficulty: 'Intermédiaire',
    cooperative: true
  },
  {
    id: 'constellation',
    title: 'Création Partagée',
    subtitle: 'Créez en écho avec les autres',
    description: 'Connectez-vous aux autres ! Vos idées s\'inspirent et nourrissent celles de la communauté.',
    instructions: [
      'Répondez aux questions en vous inspirant des créations précédentes',
      'Créez des liens thématiques avec les autres participants',
      'Ajoutez votre pierre à l\'édifice collectif',
      'Découvrez comment vos idées résonnent avec celles des autres'
    ],
    example: '"L\'orage" d\'un autre inspire "La pluie apaisante" qui inspire votre "Arc-en-ciel"',
    duration: '10 min',
    icon: '✨',
    color: 'from-emerald-500 to-teal-600',
    difficulty: 'Intermédiaire',
    cooperative: true
  },
  {
    id: 'flux-vocal',
    title: 'Mode Vocal',
    subtitle: 'Parlez librement, créez naturellement',
    description: 'Idéal pour s\'exprimer ! Répondez uniquement à la voix, comme une conversation intime.',
    instructions: [
      'Répondez exclusivement à la voix sans écrire',
      'Parlez comme si vous vous confiiez à un ami proche',
      'Laissez les pauses et hésitations faire partie de votre création',
      'L\'authenticité prime sur la perfection'
    ],
    example: '"Cette sensation... c\'est comme si le ciel me reliait à quelque chose de plus grand"',
    duration: '5 min',
    icon: '🎤',
    color: 'from-rose-500 to-orange-500',
    difficulty: 'Débutant',
    cooperative: true
  }
];

export const getGameModeById = (id: string): GameMode | undefined => {
  return gameModes.find(mode => mode.id === id);
};