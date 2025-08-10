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
    title: 'Sprint Créatif',
    subtitle: '3 minutes pour libérer votre créativité',
    description: 'Une session intense de création spontanée où chaque seconde compte. Laissez vos idées jaillir sans filtre.',
    instructions: [
      'Répondez instinctivement aux 4 questions en 3 minutes',
      'Privilégiez la spontanéité à la réflexion',
      'Utilisez la voix pour capturer vos idées rapidement',
      'Partagez votre création avec la communauté'
    ],
    example: '"Une couleur qui me traverse ?" → "Rouge sang qui bat dans mes tempes"',
    duration: '3 min',
    icon: '⚡',
    color: 'from-orange-500 to-red-600',
    difficulty: 'Débutant',
    cooperative: true
  },
  {
    id: 'exploration-profonde',
    title: 'Exploration Profonde',
    subtitle: 'Plongez dans les méandres de votre esprit',
    description: 'Un voyage introspectif sur 7 jours où chaque réponse nourrit la suivante. Construisez votre psychographie couche par couche.',
    instructions: [
      'Une question par jour pendant 7 jours consécutifs',
      'Relisez vos réponses précédentes avant de continuer',
      'Développez vos idées avec 3-5 phrases minimum',
      'Créez des liens entre vos réponses quotidiennes'
    ],
    example: 'Jour 1: "Un souvenir d\'enfance" → Jour 2: "Comment ce souvenir influence-t-il vos choix aujourd\'hui ?"',
    duration: '7 jours',
    icon: '🌊',
    color: 'from-blue-500 to-indigo-600',
    difficulty: 'Avancé',
    cooperative: true
  },
  {
    id: 'synesthesie',
    title: 'Mode Synesthésie',
    subtitle: 'Mélangez vos sens dans un kaléidoscope créatif',
    description: 'Explorez les connexions inattendues entre couleurs, sons, textures et émotions. Créez avec tous vos sens.',
    instructions: [
      'Associez chaque réponse à une couleur, un son, une texture',
      'Laissez un sens en guider un autre librement',
      'Décrivez les sensations plutôt que les concepts',
      'Explorez les correspondances surprenantes'
    ],
    example: '"Cette émotion" → "Bleu électrique qui crépite comme du papier froissé, goût de menthe glaciale"',
    duration: '15 min',
    icon: '🎨',
    color: 'from-purple-500 to-pink-600',
    difficulty: 'Intermédiaire',
    cooperative: true
  },
  {
    id: 'constellation',
    title: 'Constellation Collective',
    subtitle: 'Créez ensemble une galaxie d\'idées connectées',
    description: 'Vos réponses s\'entremêlent avec celles d\'autres participants pour former une création collective unique.',
    instructions: [
      'Répondez aux questions en vous inspirant des créations précédentes',
      'Créez des liens thématiques avec les autres participants',
      'Ajoutez votre pierre à l\'édifice collectif',
      'Découvrez comment vos idées résonnent avec celles des autres'
    ],
    example: 'User A: "L\'orage dans ma tête" → User B: "La pluie qui apaise tes pensées" → Vous: "L\'arc-en-ciel qui naît de nos mélanges"',
    duration: '10 min',
    icon: '✨',
    color: 'from-emerald-500 to-teal-600',
    difficulty: 'Intermédiaire',
    cooperative: true
  },
  {
    id: 'flux-vocal',
    title: 'Flux Vocal',
    subtitle: 'Laissez votre voix porter vos idées',
    description: 'Mode entièrement vocal où vos mots coulent naturellement. Parfait pour capturer l\'essence brute de vos pensées.',
    instructions: [
      'Répondez exclusivement à la voix sans écrire',
      'Parlez comme si vous vous confiiez à un ami proche',
      'Laissez les pauses et hésitations faire partie de votre création',
      'L\'authenticité prime sur la perfection'
    ],
    example: '"Eum... cette sensation quand je... quand je regarde le ciel, c\'est comme si... oui, comme si j\'étais relié à quelque chose de plus grand"',
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