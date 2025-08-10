import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users } from 'lucide-react';
import { gameModes, GameMode } from '@/data/gameModes';
import { clsx } from 'clsx';

interface GameModeSelectorProps {
  selectedMode: string | null;
  onSelectMode: (mode: GameMode) => void;
  onStartGame: () => void;
}

export const GameModeSelector: React.FC<GameModeSelectorProps> = ({
  selectedMode,
  onSelectMode,
  onStartGame
}) => {
  const selectedGameMode = gameModes.find(mode => mode.id === selectedMode);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Comment voulez-vous créer aujourd'hui ?
        </h1>
        <p className="text-slate-300 text-lg">
          Choisissez le style qui vous inspire le plus
        </p>
      </div>

      {/* Modes recommandés */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white text-center mb-6">
          Modes populaires ✨
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Modes recommandés en premier */}
          {gameModes.filter(mode => ['sprint-creatif', 'flux-vocal'].includes(mode.id)).map((mode) => (
            <Card 
              key={mode.id}
              className={clsx(
                "cursor-pointer transition-all duration-300 hover:scale-[1.02] border-slate-700/50 backdrop-blur-sm",
                selectedMode === mode.id 
                  ? "ring-2 ring-blue-500 bg-slate-900/80 shadow-blue-500/20 shadow-lg" 
                  : "bg-slate-950/60 hover:bg-slate-900/70"
              )}
              onClick={() => onSelectMode(mode)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">{mode.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {mode.title}
                    </h3>
                    <p className="text-slate-300 text-sm">
                      {mode.subtitle}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {mode.duration}
                      </span>
                      <Badge variant="outline" className="text-xs border-green-600 text-green-400">
                        {mode.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="text-slate-200 text-sm leading-relaxed mb-4">
                  {mode.description}
                </p>

                {selectedMode === mode.id && (
                  <div className="border-t border-slate-700 pt-4">
                    <div className="bg-blue-950/30 rounded-lg p-4 mb-4">
                      <h4 className="text-blue-300 font-medium mb-2">Exemple :</h4>
                      <p className="text-slate-200 text-sm italic">"{mode.example}"</p>
                    </div>
                    <Button
                      onClick={onStartGame}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
                    >
                      <span className="mr-2">{mode.icon}</span>
                      Commencer maintenant
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Autres modes */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-slate-300 text-center">
          Autres expériences créatives
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gameModes.filter(mode => !['sprint-creatif', 'flux-vocal'].includes(mode.id)).map((mode) => (
            <Card 
              key={mode.id}
              className={clsx(
                "cursor-pointer transition-all duration-300 hover:scale-[1.02] border-slate-700/50 backdrop-blur-sm",
                selectedMode === mode.id 
                  ? "ring-2 ring-blue-500 bg-slate-900/80" 
                  : "bg-slate-950/40 hover:bg-slate-900/60"
              )}
              onClick={() => onSelectMode(mode)}
            >
              <CardContent className="p-4">
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">{mode.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {mode.title}
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    {mode.duration}
                  </div>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed text-center">
                  {mode.description}
                </p>

                {selectedMode === mode.id && (
                  <div className="mt-4 pt-3 border-t border-slate-700">
                    <div className="bg-slate-800/50 rounded-lg p-3 mb-3">
                      <p className="text-slate-300 text-xs italic text-center">"{mode.example}"</p>
                    </div>
                    <Button
                      onClick={onStartGame}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm py-2"
                    >
                      Commencer
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Information sur l'expérience coopérative */}
      <Card className="border-blue-700/30 bg-gradient-to-r from-blue-950/20 to-purple-950/20 backdrop-blur-sm">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-400" />
            <h3 className="font-medium text-white">Expérience Collaborative</h3>
          </div>
          <p className="text-slate-300 text-sm">
            Vos créations inspirent la communauté et enrichissent l'expérience de tous
          </p>
        </CardContent>
      </Card>
    </div>
  );
};