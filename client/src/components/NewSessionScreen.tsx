import { useState } from 'react';
import { useSession } from '../contexts/SessionContext';
import { GameFormat, GameStyle, CitationType } from '../types/session';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { VoiceTextInput } from './ui/voice-text-input';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { User, Users, Home, Target, Feather, Lightbulb, Flag, Play } from 'lucide-react';

export const NewSessionScreen = () => {
  const { sessionConfig, updateSessionConfig, navigateToScreen, getPlayerCount } = useSession();
  const [localConfig, setLocalConfig] = useState(sessionConfig);

  const handleFormatChange = (format: GameFormat) => {
    const newConfig = { ...localConfig, format };
    setLocalConfig(newConfig);
    updateSessionConfig(newConfig);
  };

  const handleStyleChange = (style: GameStyle) => {
    const newConfig = { ...localConfig, style };
    setLocalConfig(newConfig);
    updateSessionConfig(newConfig);
  };

  const handleScoreToggle = (scoreEnabled: boolean) => {
    const newConfig = { ...localConfig, scoreEnabled };
    setLocalConfig(newConfig);
    updateSessionConfig(newConfig);
  };

  const handleCitationTypeChange = (citationType: CitationType) => {
    const newConfig = { ...localConfig, citationType };
    setLocalConfig(newConfig);
    updateSessionConfig(newConfig);
  };

  const handleConstraintChange = (constraint: string) => {
    const newConfig = { ...localConfig, constraint };
    setLocalConfig(newConfig);
    updateSessionConfig(newConfig);
  };

  const handleStartGame = () => {
    navigateToScreen('game');
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent mb-2">
          Nouvelle Session
        </h2>
        <p className="text-slate-400">Configurez votre exploration écho-créative</p>
      </div>

      <div className="space-y-6">
        {/* Format Selection */}
        <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Format de jeu
            </CardTitle>
            <p className="text-sm text-slate-400">Choisissez un seul format selon votre contexte</p>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={localConfig.format}
              onValueChange={(value) => handleFormatChange(value as GameFormat)}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { key: 'solo', label: 'Solo', icon: User, desc: '1 joueur' },
                { key: 'duo', label: 'Duo', icon: Users, desc: '2 joueurs' },
                { key: 'famille', label: 'Famille', icon: Home, desc: '3-5 joueurs' },
                { key: 'equipe', label: 'Équipe', icon: Users, desc: '6-10 joueurs' },
              ].map(format => (
                <div key={format.key} className="relative">
                  <RadioGroupItem
                    value={format.key}
                    id={format.key}
                    className="sr-only peer"
                  />
                  <Label
                    htmlFor={format.key}
                    className="flex flex-col items-center p-4 border-2 border-slate-700 rounded-xl cursor-pointer hover:border-slate-600 peer-data-[state=checked]:border-slate-500 peer-data-[state=checked]:bg-slate-800/50 transition-all"
                  >
                    <format.icon className="w-6 h-6 text-slate-400 mb-2" />
                    <span className="font-medium text-slate-200">{format.label}</span>
                    <span className="text-xs text-slate-500">{format.desc}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Style Selection */}
        <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <Feather className="w-5 h-5" />
              Style de partie
            </CardTitle>
            <p className="text-sm text-slate-400">Choisissez votre approche créative</p>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={localConfig.style}
              onValueChange={(value) => handleStyleChange(value as GameStyle)}
              className="grid md:grid-cols-3 gap-4"
            >
              {[
                { key: 'libre', label: 'Libre', icon: Feather, desc: 'Expression créative sans contrainte' },
                { key: 'inspirant', label: 'Inspirant', icon: Lightbulb, desc: 'Guidé par une citation inspirante' },
                { key: 'defi', label: 'Défi', icon: Flag, desc: 'Avec une contrainte créative' },
              ].map(style => (
                <div key={style.key} className="relative">
                  <RadioGroupItem
                    value={style.key}
                    id={`style-${style.key}`}
                    className="sr-only peer"
                  />
                  <Label
                    htmlFor={`style-${style.key}`}
                    className="flex flex-col p-6 border-2 border-slate-700 rounded-xl cursor-pointer hover:border-slate-600 peer-data-[state=checked]:border-slate-500 peer-data-[state=checked]:bg-slate-800/50 transition-all"
                  >
                    <style.icon className="w-8 h-8 text-slate-400 mb-3" />
                    <span className="font-semibold text-slate-200 mb-2">{style.label}</span>
                    <span className="text-sm text-slate-400">{style.desc}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Additional Options for Inspirant Style */}
        {localConfig.style === 'inspirant' && (
          <Card className="border-slate-800 bg-slate-950/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-200 text-lg">Configuration Citation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label className="text-slate-300">Type de citation</Label>
                <Select 
                  value={localConfig.citationType || ''}
                  onValueChange={(value) => handleCitationTypeChange(value as CitationType)}
                >
                  <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-200">
                    <SelectValue placeholder="Choisir un type..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="poetique" className="text-slate-200">Poétique</SelectItem>
                    <SelectItem value="philosophique" className="text-slate-200">Philosophique</SelectItem>
                    <SelectItem value="humoristique" className="text-slate-200">Humoristique</SelectItem>
                    <SelectItem value="metaphorique" className="text-slate-200">Métaphorique</SelectItem>
                    <SelectItem value="therapeutique" className="text-slate-200">Thérapeutique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Additional Options for Défi Style */}
        {localConfig.style === 'defi' && (
          <Card className="border-slate-800 bg-slate-950/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-200 text-lg">Configuration Défi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <VoiceTextInput
                  label="Contrainte créative"
                  value={localConfig.constraint || ''}
                  onChange={handleConstraintChange}
                  placeholder="Décrivez la contrainte créative... Utilisez le micro pour expliquer votre idée !"
                  multiline={true}
                  rows={3}
                  className="bg-slate-900/50 border-slate-700 text-slate-200 placeholder:text-slate-500"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Score Toggle */}


        {/* Submit Button */}
        <div className="text-center pt-6">
          <Button 
            onClick={handleStartGame}
            size="lg"
            className="bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-slate-100 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-lg px-8 py-4 h-auto"
          >
            <Play className="w-5 h-5 mr-3" />
            Commencer la Session Créative
          </Button>
          <p className="text-sm text-slate-500 mt-3">
            Votre configuration sera sauvegardée pour les prochaines sessions
          </p>
        </div>
      </div>
    </div>
  );
};
