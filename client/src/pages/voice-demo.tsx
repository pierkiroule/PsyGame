import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import VoiceInputSimple from '@/components/ui/voice-input-simple';
import { GameModeSelector } from '@/components/GameModeSelector';
import { gameModes, GameMode } from '@/data/gameModes';
import { getQuestionsForMode, baseQuestions } from '@/data/questions';
import { Sparkles, BookOpen, Heart, Lightbulb, ArrowLeft } from 'lucide-react';

export default function VoiceDemo() {
  const [gamePhase, setGamePhase] = useState<'selection' | 'playing' | 'results'>('selection');
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<{[key: string]: string}>({});
  const [startTime, setStartTime] = useState<Date | null>(null);

  const questions = selectedMode ? getQuestionsForMode(selectedMode.id) : baseQuestions;

  const questionIcons = [Heart, BookOpen, Sparkles, Lightbulb];

  const currentQuestion = questions[currentStep];
  const IconComponent = questionIcons[currentStep] || Heart;

  const handleSelectMode = (mode: GameMode) => {
    setSelectedMode(mode);
  };

  const handleStartGame = () => {
    if (selectedMode) {
      setGamePhase('playing');
      setStartTime(new Date());
      setCurrentStep(0);
      setResponses({});
    }
  };

  const handleBackToSelection = () => {
    setGamePhase('selection');
    setSelectedMode(null);
  };

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generatePsychographie = () => {
    setGamePhase('results');
  };

  const isCurrentStepComplete = responses[currentQuestion.id]?.length > 10;
  const allComplete = questions.every(q => responses[q.id]?.length > 5);

  if (gamePhase === 'selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/20 p-4">
        <div className="container mx-auto max-w-6xl">
          <GameModeSelector
            selectedMode={selectedMode?.id || null}
            onSelectMode={handleSelectMode}
            onStartGame={handleStartGame}
          />
        </div>
      </div>
    );
  }

  if (gamePhase === 'results') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/20 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-4xl">🎨</span>
              <h1 className="text-3xl font-bold text-white">
                Psychographie Créée !
              </h1>
            </div>
            <p className="text-slate-300 text-lg">
              Votre création unique est prête à être partagée avec la communauté
            </p>
          </div>

          {/* Résumé de la création */}
          <Card className="mb-8 border-slate-700/50 bg-slate-950/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <span className="text-2xl">{selectedMode?.icon}</span>
                Mode : {selectedMode?.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.map((q, index) => {
                const response = responses[q.id];
                const IconComp = questionIcons[index] || Heart;
                
                return response ? (
                  <div key={q.id} className="border-l-4 border-blue-500/50 pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <IconComp className="w-4 h-4 text-blue-400" />
                      <span className="text-slate-300 font-medium">Question {index + 1}</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">{response}</p>
                  </div>
                ) : null;
              })}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setGamePhase('selection')}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                Créer une nouvelle psychographie
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  // Simulation du partage
                  alert('Psychographie partagée avec la communauté !');
                }}
              >
                Partager avec la communauté
              </Button>
            </div>
            
            <p className="text-slate-400 text-sm">
              Partagez votre création pour contribuer au mouvement créatif coopératif
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/20 p-4">
      <div className="container mx-auto max-w-4xl">
        
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToSelection}
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Changer de mode
            </Button>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-4xl">{selectedMode?.icon}</span>
              <h1 className="text-3xl font-bold text-white">
                {selectedMode?.title}
              </h1>
            </div>
            <p className="text-slate-300 text-lg mb-2">
              {selectedMode?.subtitle}
            </p>
            <Badge variant="outline" className="text-slate-300">
              {selectedMode?.difficulty} • {selectedMode?.duration} • Coopératif
            </Badge>
          </div>
        </div>

        {/* Progression */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-300 text-sm">Étape {currentStep + 1} sur {questions.length}</span>
            <Badge variant="secondary">
              {Math.round(((currentStep + 1) / questions.length) * 100)}% complété
            </Badge>
          </div>
          
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question actuelle */}
        <Card className="mb-8 border-slate-700/50 bg-slate-950/60 backdrop-blur-xl shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white text-xl">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <IconComponent className="w-6 h-6 text-blue-400" />
              </div>
              Question {currentStep + 1}
            </CardTitle>
            <p className="text-slate-200 text-lg leading-relaxed">
              {currentQuestion.text}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Input vocal */}
            <div>
              <Label className="text-slate-200 mb-3 block">
                Réponse vocale (ou écrite)
              </Label>
              
              <VoiceInputSimple
                value={responses[currentQuestion.id] || ''}
                onChange={(value) => handleResponseChange(currentQuestion.id, value)}
                placeholder={currentQuestion.placeholder}
                className="mb-4"
              />
              
              <Textarea
                value={responses[currentQuestion.id] || ''}
                onChange={(e) => handleResponseChange(currentQuestion.id, e.target.value)}
                placeholder="...ou tapez votre réponse ici"
                className="bg-slate-900/50 border-slate-600 text-white placeholder-slate-400 min-h-[120px]"
                rows={4}
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                Précédent
              </Button>
              
              <div className="flex items-center gap-2">
                {isCurrentStepComplete && (
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    Réponse complète ✓
                  </Badge>
                )}
              </div>
              
              {currentStep < questions.length - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={!isCurrentStepComplete}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Suivant
                </Button>
              ) : (
                <Button
                  onClick={generatePsychographie}
                  disabled={!allComplete}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Générer la Psychographie
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Aperçu des réponses */}
        {Object.values(responses).some(r => r.length > 0) && (
          <Card className="border-slate-700/50 bg-slate-950/40 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-slate-200 text-lg">Vos Réponses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions.map((q, index) => {
                  const response = responses[q.id];
                  const IconComp = questionIcons[index] || Heart;
                  
                  return (
                    <div 
                      key={q.id}
                      className={`p-3 rounded-lg border transition-all ${
                        index === currentStep 
                          ? 'bg-blue-950/30 border-blue-500/50' 
                          : response && response.length > 0
                            ? 'bg-slate-800/30 border-slate-600/50'
                            : 'bg-slate-900/20 border-slate-700/30'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <IconComp className="w-4 h-4 text-blue-400" />
                        <span className="text-slate-300 text-sm font-medium">Question {index + 1}</span>
                      </div>
                      
                      {response ? (
                        <p className="text-slate-200 text-sm line-clamp-3">
                          {response}
                        </p>
                      ) : (
                        <p className="text-slate-500 text-sm italic">
                          En attente de réponse...
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}