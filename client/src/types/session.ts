export type GameFormat = 'solo' | 'duo' | 'famille' | 'equipe';
export type GameStyle = 'libre' | 'inspirant' | 'defi';
export type CitationType = 'poetique' | 'philosophique' | 'humoristique' | 'metaphorique' | 'therapeutique';

export interface PlayerInput {
  name: string;
  contribution: string;
  keywords: string;
}

export interface SessionConfig {
  format: GameFormat;
  style: GameStyle;
  scoreEnabled: boolean;
  citationType?: CitationType;
  constraint?: string;
}

export interface GeneratedContent {
  text: string;
  guide: string[];
  imagePrompt: string;
}

export interface Scores {
  creative: number;
  poetic: number;
}

export interface Badge {
  name: string;
  icon: string;
  color: string;
}

export type AppScreen = 'home' | 'new-session' | 'game' | 'results';
