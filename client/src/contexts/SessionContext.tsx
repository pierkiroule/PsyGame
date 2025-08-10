import { createContext, useContext, useState, ReactNode } from 'react';
import { 
  SessionConfig, 
  PlayerInput, 
  GeneratedContent, 
  Scores, 
  Badge, 
  AppScreen,
  GameFormat,
  GameStyle 
} from '../types/session';

interface SessionContextType {
  currentScreen: AppScreen;
  sessionConfig: SessionConfig;
  playerInputs: PlayerInput[];
  generatedContent: GeneratedContent | null;
  scores: Scores | null;
  badges: Badge[];
  navigateToScreen: (screen: AppScreen) => void;
  updateSessionConfig: (config: Partial<SessionConfig>) => void;
  updatePlayerInputs: (inputs: PlayerInput[]) => void;
  generateResults: () => void;
  resetSession: () => void;
  getPlayerCount: () => number;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

const initialConfig: SessionConfig = {
  format: 'solo',
  style: 'libre',
  scoreEnabled: false,
};

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [sessionConfig, setSessionConfig] = useState<SessionConfig>(initialConfig);
  const [playerInputs, setPlayerInputs] = useState<PlayerInput[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [scores, setScores] = useState<Scores | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);

  const navigateToScreen = (screen: AppScreen) => {
    setCurrentScreen(screen);
  };

  const updateSessionConfig = (config: Partial<SessionConfig>) => {
    setSessionConfig(prev => ({ ...prev, ...config }));
  };

  const updatePlayerInputs = (inputs: PlayerInput[]) => {
    setPlayerInputs(inputs);
  };

  const getPlayerCount = (): number => {
    switch (sessionConfig.format) {
      case 'solo': return 1;
      case 'duo': return 2;
      case 'famille': return 4; // Default to 4 for famille (3-5)
      case 'equipe': return 8; // Default to 8 for equipe (6-10)
      default: return 1;
    }
  };

  const generateResults = () => {
    // Simulate AI content generation
    const mockContent = generateMockContent(sessionConfig, playerInputs);
    const mockScores = sessionConfig.scoreEnabled ? generateMockScores(playerInputs) : null;
    const mockBadges = sessionConfig.scoreEnabled ? generateMockBadges(sessionConfig, playerInputs) : [];

    setGeneratedContent(mockContent);
    setScores(mockScores);
    setBadges(mockBadges);
    setCurrentScreen('results');
  };

  const resetSession = () => {
    setCurrentScreen('home');
    setSessionConfig(initialConfig);
    setPlayerInputs([]);
    setGeneratedContent(null);
    setScores(null);
    setBadges([]);
  };

  return (
    <SessionContext.Provider
      value={{
        currentScreen,
        sessionConfig,
        playerInputs,
        generatedContent,
        scores,
        badges,
        navigateToScreen,
        updateSessionConfig,
        updatePlayerInputs,
        generateResults,
        resetSession,
        getPlayerCount,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

// Simulation avancée de génération de contenu IA
const generateMockContent = (config: SessionConfig, inputs: PlayerInput[]): GeneratedContent => {
  const allKeywords = inputs.map(input => input.keywords).filter(k => k.trim().length > 0).join(', ');
  const allContributions = inputs.map(input => input.contribution).filter(c => c.trim().length > 0);
  const playerNames = inputs.map(input => input.name).filter(n => n.trim().length > 0);

  // Analyse des émotions et thèmes dans les contributions
  const emotionKeywords = ['joie', 'tristesse', 'peur', 'colère', 'espoir', 'amour', 'paix', 'liberté', 'rêve'];
  const natureKeywords = ['océan', 'montagne', 'forêt', 'ciel', 'étoile', 'lune', 'soleil', 'vent', 'rivière'];
  const conceptKeywords = ['temps', 'voyage', 'mémoire', 'futur', 'passé', 'âme', 'esprit', 'coeur'];

  const hasEmotion = emotionKeywords.some(word => allKeywords.toLowerCase().includes(word));
  const hasNature = natureKeywords.some(word => allKeywords.toLowerCase().includes(word));
  const hasConcept = conceptKeywords.some(word => allKeywords.toLowerCase().includes(word));

  let baseText = '';
  let guide = [];
  let imagePrompt = '';

  // Génération de contenu adaptatif basé sur le style et les inputs
  switch (config.style) {
    case 'libre':
      if (hasNature && hasEmotion) {
        baseText = `"Sous le voile étoilé de l'infini cosmos,
        ${allKeywords.split(',')[0] || 'L\'âme'} danse avec les vents du possible,
        Chaque souffle porte l'essence de ${allKeywords.split(',')[1] || 'la liberté'},
        Vers des rivages encore inexplorés de l'être."
        
        Cette psychographie révèle une harmonie profonde entre votre monde intérieur et les forces naturelles. 
        Les contributions partagées témoignent d'une sensibilité particulière aux cycles et aux transformations. 
        ${playerNames.length > 0 ? `L'énergie créative de ${playerNames.join(', ')} résonne avec une authenticité remarquable.` : ''}`;
      } else if (hasConcept) {
        baseText = `"Dans le labyrinthe du temps qui se plie et se déplie,
        La conscience ${allKeywords.split(',')[0] || 'éveillée'} trace sa voie lumineuse,
        Chaque pensée devient graine d'éternité,
        Cultivant l'art de l'être authentique."
        
        Votre psychographie dévoile une relation complexe avec les dimensions temporelles et spirituelles. 
        Les mots choisis révèlent une quête de sens qui transcende l'ordinaire.`;
      } else {
        baseText = `"Au carrefour des possibles infinis,
        L'imagination ${allKeywords.split(',')[0] || 'libre'} prend son envol,
        Tissant des ponts entre rêve et réalité,
        Dans la symphonie silencieuse de l'âme."
        
        Cette psychographie exprime une liberté créative en pleine expansion. 
        Vos contributions révèlent un esprit ouvert aux métamorphoses intérieures.`;
      }
      
      guide = [
        `Explorez comment les éléments "${allKeywords}" résonnent avec votre expérience personnelle.`,
        'Partagez les moments où vous ressentez cette liberté créative dans votre quotidien.',
        'Identifiez ensemble des pratiques pour cultiver cette ouverture authentique.'
      ];
      
      imagePrompt = `${allKeywords}, flowing abstract art, cosmic freedom, ethereal light, creative expression`;
      break;

    case 'inspirant':
      const citationType = config.citationType || 'poétique';
      if (citationType === 'philosophique') {
        baseText = `"La sagesse naît du dialogue entre ${allKeywords.split(',')[0] || 'l\'âme'} et l'universel,
        Chaque interrogation devient source de lumière,
        Transformant l'incertitude en ${allKeywords.split(',')[1] || 'clarté'},
        Par l'alchimie de la contemplation active."
        
        Votre psychographie révèle une démarche philosophique profonde. Les contributions partagées 
        témoignent d'une recherche de sens qui unit questionnement et intuition.`;
      } else if (citationType === 'therapeutique') {
        baseText = `"Dans le jardin secret de la guérison,
        ${allKeywords.split(',')[0] || 'La bienveillance'} devient source de régénération,
        Chaque blessure transformée en ${allKeywords.split(',')[1] || 'sagesse'},
        Par la magie de l'acceptation aimante."
        
        Cette psychographie met en lumière votre capacité naturelle de transformation et de résilience. 
        Les mots choisis révèlent un processus de guérison créative en cours.`;
      } else {
        baseText = `"L'inspiration surgit de la rencontre mystérieuse,
        Entre ${allKeywords.split(',')[0] || 'l\'imaginaire'} et la vérité du coeur,
        Chaque création devient offrande à ${allKeywords.split(',')[1] || 'la beauté'},
        Dans la danse éternelle de l'art vivant."
        
        Votre psychographie révèle une connexion privilégiée avec les sources créatives. 
        L'inspiration ${citationType} guide naturellement votre expression.`;
      }
      
      guide = [
        `Partagez comment l'inspiration ${citationType} influence votre créativité quotidienne.`,
        'Explorez ensemble les moments de révélation créative dans vos expériences.',
        'Créez un rituel collectif pour cultiver cette forme d\'inspiration.'
      ];
      
      imagePrompt = `${allKeywords}, ${citationType} inspiration, luminous creativity, spiritual art, wisdom imagery`;
      break;

    case 'defi':
      const constraint = config.constraint || 'créative';
      baseText = `"Face à la contrainte "${constraint}",
      L'esprit ${allKeywords.split(',')[0] || 'créatif'} se révèle innovateur,
      Transformant limitation en ${allKeywords.split(',')[1] || 'liberté'},
      Par l'audace de l'imagination sans limites."
      
      Cette psychographie illustre votre capacité remarquable à métamorphoser les défis en opportunités. 
      La contrainte imposée a révélé des facettes inattendues de votre expression créative. 
      ${allContributions.length > 1 ? 'La synergie collective a amplifié cette transformation.' : 'Votre approche individuelle témoigne d\'une résilience créative exceptionnelle.'}`;
      
      guide = [
        `Analysez comment la contrainte "${constraint}" a influencé votre processus créatif.`,
        'Identifiez les stratégies qui vous ont permis de dépasser les limitations imposées.',
        'Développez ensemble des techniques pour transformer les futurs défis en catalyseurs créatifs.'
      ];
      
      imagePrompt = `${allKeywords}, creative challenge, innovation breakthrough, constraint transformation, dynamic art`;
      break;
  }

  return {
    text: baseText,
    guide,
    imagePrompt
  };
};

const generateMockScores = (inputs: PlayerInput[]): Scores => {
  // Calcul de scores basé sur la richesse des contributions
  const totalContributions = inputs.filter(input => input.contribution.trim().length > 0).length;
  const totalKeywords = inputs.reduce((acc, input) => acc + input.keywords.split(',').filter(k => k.trim().length > 0).length, 0);
  const avgContributionLength = inputs.reduce((acc, input) => acc + input.contribution.length, 0) / Math.max(inputs.length, 1);
  
  // Score créatif basé sur la variété et l'originalité
  let creativeBase = 70;
  if (totalKeywords > 10) creativeBase += 15;
  else if (totalKeywords > 5) creativeBase += 10;
  
  if (avgContributionLength > 100) creativeBase += 10;
  else if (avgContributionLength > 50) creativeBase += 5;
  
  // Score poétique basé sur l'expressivité
  let poeticBase = 75;
  const poeticWords = ['beauté', 'lumière', 'rêve', 'âme', 'coeur', 'étoile', 'danse', 'harmonie', 'mystère'];
  const allText = inputs.map(i => i.contribution + ' ' + i.keywords).join(' ').toLowerCase();
  const poeticWordCount = poeticWords.filter(word => allText.includes(word)).length;
  
  if (poeticWordCount > 3) poeticBase += 15;
  else if (poeticWordCount > 1) poeticBase += 10;
  
  return {
    creative: Math.min(100, creativeBase + Math.floor(Math.random() * 10)),
    poetic: Math.min(100, poeticBase + Math.floor(Math.random() * 10))
  };
};

const generateMockBadges = (config: SessionConfig, inputs: PlayerInput[]): Badge[] => {
  const allText = inputs.map(i => i.contribution + ' ' + i.keywords).join(' ').toLowerCase();
  
  const badges = [
    { name: 'Visionnaire', icon: 'star', color: 'yellow', triggers: ['futur', 'vision', 'rêve', 'imagination'] },
    { name: 'Poète', icon: 'feather', color: 'purple', triggers: ['beauté', 'vers', 'rime', 'métaphore'] },
    { name: 'Innovateur', icon: 'lightbulb', color: 'blue', triggers: ['innovation', 'créatif', 'nouveau', 'invention'] },
    { name: 'Maître des Océans', icon: 'water', color: 'blue', triggers: ['océan', 'mer', 'vague', 'profondeur'] },
    { name: 'Explorateur', icon: 'compass', color: 'green', triggers: ['voyage', 'découverte', 'aventure', 'explorer'] },
    { name: 'Créateur', icon: 'palette', color: 'orange', triggers: ['art', 'création', 'couleur', 'forme'] },
    { name: 'Sage', icon: 'book', color: 'emerald', triggers: ['sagesse', 'connaissance', 'philosophie', 'réflexion'] },
    { name: 'Rêveur', icon: 'cloud', color: 'indigo', triggers: ['rêve', 'songe', 'imaginaire', 'fantaisie'] },
    { name: 'Alchimiste', icon: 'flask', color: 'purple', triggers: ['transformation', 'magie', 'alchimie', 'mutation'] },
    { name: 'Gardien de Lumière', icon: 'sun', color: 'yellow', triggers: ['lumière', 'clarté', 'illumination', 'révélation'] }
  ];
  
  // Sélection des badges basée sur les mots-clés détectés
  const earnedBadges = badges.filter(badge => 
    badge.triggers.some(trigger => allText.includes(trigger))
  );
  
  // Badges bonus selon la configuration
  if (config.style === 'defi') {
    earnedBadges.push({ name: 'Conquérant', icon: 'trophy', color: 'gold', triggers: [] });
  }
  if (config.format === 'equipe') {
    earnedBadges.push({ name: 'Esprit d\'Équipe', icon: 'users', color: 'green', triggers: [] });
  }
  if (config.scoreEnabled) {
    earnedBadges.push({ name: 'Perfectionniste', icon: 'target', color: 'red', triggers: [] });
  }
  
  // Retourner 2-5 badges uniques
  const uniqueBadges = earnedBadges.filter((badge, index, self) => 
    index === self.findIndex(b => b.name === badge.name)
  );
  
  const badgeCount = Math.min(5, Math.max(2, uniqueBadges.length));
  return uniqueBadges.slice(0, badgeCount);
};


