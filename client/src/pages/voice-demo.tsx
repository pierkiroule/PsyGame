import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import VoiceInputSimple from '@/components/ui/voice-input-simple';
import { Sparkles, BookOpen, Heart, Lightbulb } from 'lucide-react';

export default function VoiceDemo() {
  const [responses, setResponses] = useState({
    emotion: '',
    memory: '',
    dream: '',
    word: ''
  });

  const [currentStep, setCurrentStep] = useState(0);

  const questions = [
    {
      id: 'emotion',
      icon: Heart,
      title: 'Émotion spontanée',
      question: 'Décrivez une émotion que vous ressentez maintenant, sans réfléchir...',
      placeholder: 'Parlez librement de ce que vous ressentez...'
    },
    {
      id: 'memory',
      icon: BookOpen,
      title: 'Souvenir vivace',
      question: 'Racontez un souvenir qui vous vient à l\'esprit...',
      placeholder: 'Laissez venir un souvenir et décrivez-le...'
    },
    {
      id: 'dream',
      icon: Sparkles,
      title: 'Vision créative',
      question: 'Si vous pouviez créer quelque chose de magique, que serait-ce ?',
      placeholder: 'Imaginez sans limites et exprimez votre vision...'
    },
    {
      id: 'word',
      icon: Lightbulb,
      title: 'Mot-clé final',
      question: 'Un mot qui résume votre état d\'esprit créatif actuel ?',
      placeholder: 'Dites simplement le premier mot qui vous vient...'
    }
  ];

  const currentQuestion = questions[currentStep];
  const IconComponent = currentQuestion.icon;

  const handleResponseChange = (field: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [field]: value
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
    // Simulation de génération basée sur les réponses vocales
    alert('🎨 Psychographie générée ! (Fonctionnalité à implémenter)');
  };

  const isCurrentStepComplete = responses[currentQuestion.id as keyof typeof responses].length > 10;
  const allComplete = Object.values(responses).every(response => response.length > 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/20 p-4">
      <div className="container mx-auto max-w-4xl">
        
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Création Vocale Psychographe
          </h1>
          <p className="text-slate-300">
            Exprimez-vous librement avec votre voix pour créer une psychographie unique
          </p>
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
              {currentQuestion.title}
            </CardTitle>
            <p className="text-slate-200 text-lg leading-relaxed">
              {currentQuestion.question}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Input vocal */}
            <div>
              <Label className="text-slate-200 mb-3 block">
                Réponse vocale (ou écrite)
              </Label>
              
              <VoiceInputSimple
                value={responses[currentQuestion.id as keyof typeof responses]}
                onChange={(value) => handleResponseChange(currentQuestion.id, value)}
                placeholder={currentQuestion.placeholder}
                className="mb-4"
              />
              
              <Textarea
                value={responses[currentQuestion.id as keyof typeof responses]}
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
                  const response = responses[q.id as keyof typeof responses];
                  const IconComp = q.icon;
                  
                  return (
                    <div 
                      key={q.id}
                      className={`p-3 rounded-lg border transition-all ${
                        index === currentStep 
                          ? 'bg-blue-950/30 border-blue-500/50' 
                          : response.length > 0
                            ? 'bg-slate-800/30 border-slate-600/50'
                            : 'bg-slate-900/20 border-slate-700/30'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <IconComp className="w-4 h-4 text-blue-400" />
                        <span className="text-slate-300 text-sm font-medium">{q.title}</span>
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