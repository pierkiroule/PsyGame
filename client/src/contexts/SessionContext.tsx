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
    const mockScores = sessionConfig.scoreEnabled ? generateMockScores() : null;
    const mockBadges = sessionConfig.scoreEnabled ? generateMockBadges(sessionConfig) : [];

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

// Mock content generation functions
const generateMockContent = (config: SessionConfig, inputs: PlayerInput[]): GeneratedContent => {
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
      où les rêves deviennent des phares guidant vers l'authenticité.`;
      guide = [
        'Invitez chaque participant à partager ce que cette psychographie évoque pour eux personnellement.',
        'Explorez ensemble les symboles et métaphores dans vos vies respectives.',
        'Discutez des actions concrètes pour cultiver plus de créativité au quotidien.'
      ];
      break;
    case 'inspirant':
      baseText = `"L'inspiration naît de la confluence des âmes créatives,
      Chaque pensée devient une note dans la symphonie collective,
      Transformant l'ordinaire en extraordinaire,
      Par la magie de l'expression authentique."
      
      Votre psychographie révèle une capacité remarquable à transformer 
      l'inspiration en création tangible.`;
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
      les défis en opportunités créatives.`;
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
    imagePrompt: `${allKeywords} creative abstract art`
  };
};

const generateMockScores = (): Scores => {
  return {
    creative: Math.floor(Math.random() * 20) + 80, // 80-100
    poetic: Math.floor(Math.random() * 20) + 80, // 80-100
  };
};

const generateMockBadges = (config: SessionConfig): Badge[] => {
  const allBadges = [
    { name: 'Visionnaire', icon: 'star', color: 'yellow' },
    { name: 'Poète', icon: 'feather', color: 'purple' },
    { name: 'Innovateur', icon: 'lightbulb', color: 'blue' },
    { name: 'Maître des Océans', icon: 'water', color: 'blue' },
    { name: 'Explorateur', icon: 'compass', color: 'green' },
    { name: 'Créateur', icon: 'palette', color: 'orange' },
  ];

  // Return 2-4 random badges based on style and format
  const badgeCount = config.format === 'solo' ? 2 : config.format === 'equipe' ? 4 : 3;
  return allBadges.slice(0, badgeCount);
};
