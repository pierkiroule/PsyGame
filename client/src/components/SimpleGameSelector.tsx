import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VoiceTextInput } from './ui/voice-text-input';
import { Clock, Users, Sparkles, Play } from 'lucide-react';
import { simpleGameModes, gameFormats, UNIVERSAL_QUESTION, inspirationPrompts, ideaAssociations } from '@/data/simpleGame';
import { clsx } from 'clsx';

interface SimpleGameSelectorProps {
  onStartGame: (responses: { [key: string]: string }, format: string, mode: string) => void;
}

export const SimpleGameSelector: React.FC<SimpleGameSelectorProps> = ({ onStartGame }) => {
  const [selectedMode, setSelectedMode] = useState(simpleGameModes[0]);
  const [selectedFormat, setSelectedFormat] = useState(gameFormats[0]);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [showInspiration, setShowInspiration] = useState(false);

  const getTotalPlayers = () => {
    return selectedFormat.id === 'solo' ? 1 : 
           selectedFormat.id === 'duo' ? 2 : 3;
  };

  const handleResponseChange = (playerId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [playerId]: value
    }));
  };

  const canStartGame = () => {
    const totalPlayers = getTotalPlayers();
    for (let i = 1; i <= totalPlayers; i++) {
      if (!responses[`player${i}`] || responses[`player${i}`].trim().length < 3) {
        return false;
      }
    }
    return true;
  };

  const handleStart = () => {
    if (canStartGame()) {
      onStartGame(responses, selectedFormat.id, selectedMode.id);
    }
  };

  const getRandomInspiration = () => {
    const randomPrompt = inspirationPrompts[Math.floor(Math.random() * inspirationPrompts.length)];
    const randomAssociation = ideaAssociations[Math.floor(Math.random() * ideaAssociations.length)];
    return `${randomPrompt} ${randomAssociation}`;
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Titre principal */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Psychographe Simplifié
        </h1>
        <p className="text-slate-300 text-lg mb-6">
          Une question universelle, des résonances infinies
        </p>
        
        {/* La question universelle */}
        <div className="bg-gradient-to-r from-blue-950/40 to-purple-950/40 rounded-2xl p-6 mb-8 border border-blue-800/30">
          <div className="text-2xl font-semibold text-blue-300 mb-2">
            "{UNIVERSAL_QUESTION}"
          </div>
          <p className="text-slate-400 text-sm">
            Cette question unique révèle l'essence de votre moment présent
          </p>
        </div>
      </div>

      {/* Sélection du format */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white text-center">
          Choisissez votre format
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gameFormats.map((format) => (
            <Card 
              key={format.id}
              className={clsx(
                "cursor-pointer transition-all duration-300 hover:scale-[1.02]",
                selectedFormat.id === format.id 
                  ? "ring-2 ring-blue-500 bg-slate-900/80" 
                  : "bg-slate-950/60 hover:bg-slate-900/70"
              )}
              onClick={() => setSelectedFormat(format)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{format.icon}</div>
                <h3 className="font-semibold text-white mb-1">{format.title}</h3>
                <p className="text-slate-400 text-xs">{format.description}</p>
                <Badge variant="outline" className="mt-2 text-xs">
                  {format.minPlayers === format.maxPlayers 
                    ? `${format.minPlayers} joueur${format.minPlayers > 1 ? 's' : ''}` 
                    : `${format.minPlayers}-${format.maxPlayers} joueurs`}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Sélection du mode temporel */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white text-center">
          Choisissez votre rythme
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {simpleGameModes.map((mode) => (
            <Card 
              key={mode.id}
              className={clsx(
                "cursor-pointer transition-all duration-300 hover:scale-[1.02]",
                selectedMode.id === mode.id 
                  ? "ring-2 ring-purple-500 bg-slate-900/80" 
                  : "bg-slate-950/60 hover:bg-slate-900/70"
              )}
              onClick={() => setSelectedMode(mode)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{mode.icon}</div>
                <h3 className="font-semibold text-white mb-1">{mode.title}</h3>
                <p className="text-slate-400 text-xs mb-2">{mode.description}</p>
                <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  {mode.duration}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Zone de réponse */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            Vos réponses
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInspiration(!showInspiration)}
            className="text-blue-400 hover:text-blue-300"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Inspiration
          </Button>
        </div>

        {showInspiration && (
          <Card className="border-blue-800/30 bg-blue-950/20">
            <CardContent className="p-4">
              <p className="text-blue-300 text-sm italic text-center">
                {getRandomInspiration()}
              </p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center">
                {ideaAssociations.slice(0, 8).map((word, index) => (
                  <Badge key={index} variant="outline" className="text-xs text-blue-400">
                    {word}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Champs de réponse selon le format */}
        <div className="space-y-4">
          {Array.from({ length: getTotalPlayers() }, (_, index) => {
            const playerId = `player${index + 1}`;
            const playerName = selectedFormat.id === 'solo' 
              ? 'Vous' 
              : `${selectedFormat.id === 'duo' ? (index === 0 ? 'Premier' : 'Deuxième') : `${index + 1}e`} participant`;
            
            return (
              <Card key={playerId} className="border-slate-700/50 bg-slate-950/40">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    {playerName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <VoiceTextInput
                    label={`"${UNIVERSAL_QUESTION}"`}
                    value={responses[playerId] || ''}
                    onChange={(value) => handleResponseChange(playerId, value)}
                    placeholder={selectedMode.placeholder}
                    multiline={true}
                    rows={4}
                    required={true}
                    className="bg-slate-900/50 border-slate-700"
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bouton de démarrage */}
        <div className="text-center">
          <Button
            onClick={handleStart}
            disabled={!canStartGame()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Play className="w-5 h-5 mr-2" />
            Générer la Psychographie
            {selectedFormat.id !== 'solo' && ` ${selectedFormat.title}`}
          </Button>
          
          {!canStartGame() && (
            <p className="text-slate-400 text-sm mt-2">
              Chaque participant doit répondre à la question
            </p>
          )}
        </div>
      </div>

      {/* Information sur l'approche simplifiée */}
      <Card className="border-green-700/30 bg-gradient-to-r from-green-950/20 to-emerald-950/20">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-green-400" />
            <h3 className="font-medium text-white">Psychographe Simplifié</h3>
          </div>
          <p className="text-slate-300 text-sm">
            Une seule question universelle révèle des milliers de nuances selon qui répond et comment. 
            La simplicité libère la créativité.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};