import { GeneratedContent, Scores, Badge, SessionConfig, PlayerInput } from '../types/session';

export const generateMockContent = (config: SessionConfig, inputs: PlayerInput[]): GeneratedContent => {
  const allKeywords = inputs.map(input => input.keywords).join(', ');
  const allContributions = inputs.map(input => input.contribution).join(' ');

  let baseText = '';
  let guide = [];

  switch (config.style) {
    case 'libre':
      baseText = `"Dans l'océan des rêves où la liberté danse,
Les âmes se cherchent en silence,
Portées par des vents d'espérance,
Vers des horizons de renaissance."

Cette psychographie révèle une quête profonde de liberté intérieure, 
où les rêves deviennent des phares guidant vers l'authenticité. 
L'océan symbolise l'inconscient collectif, espace infini de possibilités 
où chaque vague porte une nouvelle perspective.`;
      
      guide = [
        'Invitez chaque participant à partager ce que cette psychographie évoque pour eux personnellement.',
        'Explorez ensemble les symboles de l\'océan et des rêves dans vos vies respectives.',
        'Discutez des actions concrètes pour cultiver plus de liberté créative au quotidien.'
      ];
      break;

    case 'inspirant':
      baseText = `"L'inspiration naît de la confluence des âmes créatives,
Chaque pensée devient une note dans la symphonie collective,
Transformant l'ordinaire en extraordinaire,
Par la magie de l'expression authentique."

Votre psychographie révèle une capacité remarquable à transformer 
l'inspiration en création tangible. Les citations ${config.citationType || 'poétiques'} 
résonnent profondément avec votre essence créative.`;
      
      guide = [
        'Partagez les sources d\'inspiration qui vous motivent le plus.',
        'Explorez comment l\'inspiration collective amplifie la créativité individuelle.',
        'Identifiez des moyens concrets d\'intégrer plus d\'inspiration dans votre quotidien.'
      ];
      break;

    case 'defi':
      baseText = `"Face au défi, l'esprit créatif s'épanouit,
Chaque contrainte devient un tremplin vers l'innovation,
L'adversité révèle des ressources insoupçonnées,
Forgeant la résilience dans le feu de l'imagination."

Cette psychographie met en lumière votre capacité à transformer 
les défis en opportunités créatives. La contrainte "${config.constraint || 'créative'}" 
a révélé des facettes inattendues de votre expression.`;
      
      guide = [
        'Réfléchissez ensemble sur les défis qui ont stimulé votre créativité.',
        'Explorez comment les contraintes peuvent libérer l\'innovation.',
        'Définissez des stratégies pour aborder les futurs défis créatifs.'
      ];
      break;
  }

  return {
    text: baseText,
    guide,
    imagePrompt: `${allKeywords} creative abstract art inspiring ${config.style}`
  };
};

export const generateMockScores = (): Scores => {
  return {
    creative: Math.floor(Math.random() * 20) + 80, // 80-100
    poetic: Math.floor(Math.random() * 20) + 80, // 80-100
  };
};

export const generateMockBadges = (config: SessionConfig): Badge[] => {
  const allBadges = [
    { name: 'Visionnaire', icon: 'star', color: 'yellow' },
    { name: 'Poète', icon: 'feather', color: 'purple' },
    { name: 'Innovateur', icon: 'lightbulb', color: 'blue' },
    { name: 'Maître des Océans', icon: 'water', color: 'blue' },
    { name: 'Explorateur', icon: 'compass', color: 'green' },
    { name: 'Créateur', icon: 'palette', color: 'orange' },
    { name: 'Rêveur', icon: 'cloud', color: 'indigo' },
    { name: 'Sage', icon: 'book', color: 'emerald' },
  ];

  // Return badges based on configuration
  let badgeCount = 2;
  if (config.format === 'equipe') badgeCount = 4;
  else if (config.format === 'famille') badgeCount = 3;
  
  if (config.style === 'defi') badgeCount += 1;

  return allBadges.slice(0, badgeCount);
};
