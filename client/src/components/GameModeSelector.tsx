import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Lightbulb } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          Choisissez votre Mode de Création
        </h1>
        <p className="text-slate-300 text-lg">
          Chaque mode offre une expérience créative unique et coopérative
        </p>
      </div>

      {/* Grille des modes de jeu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gameModes.map((mode) => (
          <Card 
            key={mode.id}
            className={clsx(
              "cursor-pointer transition-all duration-300 hover:scale-105 border-slate-700/50 backdrop-blur-sm",
              selectedMode === mode.id 
                ? "ring-2 ring-blue-500 bg-slate-900/80" 
                : "bg-slate-950/60 hover:bg-slate-900/70"
            )}
            onClick={() => onSelectMode(mode)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="text-4xl mb-2">{mode.icon}</div>
                <Badge 
                  variant="secondary" 
                  className={clsx(
                    "text-xs",
                    mode.difficulty === 'Débutant' && "bg-green-900/30 text-green-300",
                    mode.difficulty === 'Intermédiaire' && "bg-yellow-900/30 text-yellow-300",
                    mode.difficulty === 'Avancé' && "bg-red-900/30 text-red-300"
                  )}
                >
                  {mode.difficulty}
                </Badge>
              </div>
              
              <CardTitle className="text-xl text-white">
                {mode.title}
              </CardTitle>
              
              <p className="text-slate-300 text-sm font-medium">
                {mode.subtitle}
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-slate-200 text-sm leading-relaxed">
                {mode.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {mode.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Coopératif
                </div>
              </div>

              {selectedMode === mode.id && (
                <div className="border-t border-slate-700 pt-4 space-y-3">
                  <div>
                    <h4 className="text-white text-sm font-medium mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Comment jouer :
                    </h4>
                    <ul className="text-slate-300 text-xs space-y-1">
                      {mode.instructions.map((instruction, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-400 mt-0.5">•</span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-slate-400 text-xs font-medium mb-1">Exemple :</p>
                    <p className="text-slate-200 text-xs italic">"{mode.example}"</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bouton de démarrage */}
      {selectedGameMode && (
        <div className="text-center">
          <Button
            onClick={onStartGame}
            className={clsx(
              "px-8 py-3 text-lg font-semibold bg-gradient-to-r text-white shadow-lg hover:shadow-xl transition-all duration-300",
              selectedGameMode.color
            )}
          >
            <span className="mr-2">{selectedGameMode.icon}</span>
            Commencer "{selectedGameMode.title}"
          </Button>
        </div>
      )}

      {/* Information sur le système coopératif */}
      <Card className="border-blue-700/50 bg-blue-950/30 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Jeu Coopératif</h3>
          </div>
          
          <div className="text-slate-300 text-sm leading-relaxed space-y-2">
            <p>
              <strong>Tous les modes sont coopératifs</strong> - vos créations enrichissent l'expérience collective 
              et inspirent d'autres participants.
            </p>
            <p>
              <strong>Système de scoring simplifié</strong> - gagnez des points d'activité en participant, 
              commentant et votant pour les créations des autres.
            </p>
            <p>
              <strong>Progression partagée</strong> - plus la communauté est active, 
              plus chacun débloquer de nouvelles possibilités créatives.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};