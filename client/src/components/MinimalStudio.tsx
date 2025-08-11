import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Sparkles, 
  Save, 
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Wand2
} from 'lucide-react';
import { clsx } from 'clsx';
import { apiRequest } from '@/lib/queryClient';
import { VoiceTextInput } from '@/components/ui/voice-text-input';

const STYLES = [
  { id: 'poetique', label: 'Poétique', icon: '🌸' },
  { id: 'philosophique', label: 'Philosophique', icon: '🤔' },
  { id: 'mystique', label: 'Mystique', icon: '✨' }
];

export const MinimalStudio: React.FC = () => {
  // États simplifiés
  const [currentStep, setCurrentStep] = useState(1);
  const [initialText, setInitialText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('poetique');
  const [enrichedPrompts, setEnrichedPrompts] = useState<string[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [finalContent, setFinalContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const queryClient = useQueryClient();

  // Génération des prompts enrichis (étape 2)
  const generatePrompts = async () => {
    setIsGenerating(true);
    try {
      const response = await apiRequest('/api/generate/prompts', {
        method: 'POST',
        body: { initialText, style: selectedStyle }
      });
      setEnrichedPrompts(response.prompts);
      setCurrentStep(2);
    } catch (error) {
      console.error('Erreur génération prompts:', error);
      // Fallback local
      const prompts = [
        `Explorez "${initialText}" sous un angle ${STYLES.find(s => s.id === selectedStyle)?.label.toLowerCase()}`,
        `Révélez les résonances profondes de "${initialText}"`,
        `Transformez "${initialText}" en une méditation créative`
      ];
      setEnrichedPrompts(prompts);
      setCurrentStep(2);
    } finally {
      setIsGenerating(false);
    }
  };

  // Génération du contenu final (étape 3)
  const generateFinalContent = async () => {
    setIsGenerating(true);
    try {
      const response = await apiRequest('/api/generate/content', {
        method: 'POST',
        body: { initialText, selectedPrompt, style: selectedStyle }
      });
      setFinalContent(response.content);
      setCurrentStep(3);
    } catch (error) {
      console.error('Erreur génération contenu:', error);
      // Fallback local
      const content = `À partir de votre inspiration "${initialText}", voici une psychographie ${selectedStyle} :

${selectedPrompt}

Cette réflexion révèle les dimensions cachées de votre pensée initiale, tissant des liens entre l'intuition première et les résonances profondes de votre être créatif.`;
      
      setFinalContent(content);
      setCurrentStep(3);
    } finally {
      setIsGenerating(false);
    }
  };

  // Sauvegarde
  const saveMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/psychographies', {
        method: 'POST',
        body: {
          title: initialText.slice(0, 50) + (initialText.length > 50 ? '...' : ''),
          content: finalContent,
          tags: [selectedStyle, 'studio'],
          isPublic,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/psychographies'] });
      // Reset pour nouvelle création
      setCurrentStep(1);
      setInitialText('');
      setSelectedPrompt('');
      setFinalContent('');
    },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      
      {/* En-tête avec progression */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Studio Psychographique
        </h1>
        <div className="flex justify-center gap-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                currentStep >= step
                  ? "bg-blue-500 text-white"
                  : "bg-slate-700 text-slate-400"
              )}
            >
              {step}
            </div>
          ))}
        </div>
      </div>

      {/* Étape 1: Saisie */}
      {currentStep === 1 && (
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              Qu'est-ce qui vous habite maintenant ?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <VoiceTextInput
              value={initialText}
              onChange={setInitialText}
              placeholder="Exprimez librement ce qui vous vient à l'esprit..."
              className="min-h-24 bg-slate-800 border-slate-600 text-slate-100"
            />
            
            {/* Sélection de style simplifiée */}
            <div className="space-y-2">
              <Label className="text-slate-300">Style créatif</Label>
              <div className="flex gap-2">
                {STYLES.map((style) => (
                  <Button
                    key={style.id}
                    variant={selectedStyle === style.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStyle(style.id)}
                    className="flex items-center gap-2"
                  >
                    <span>{style.icon}</span>
                    <span>{style.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={generatePrompts}
              disabled={!initialText.trim() || isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <ArrowRight className="w-4 h-4 mr-2" />
              )}
              Enrichir ma pensée
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Étape 2: Sélection du prompt enrichi */}
      {currentStep === 2 && (
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-purple-400" />
              Choisissez votre direction créative
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {enrichedPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant={selectedPrompt === prompt ? "default" : "outline"}
                  className="w-full text-left p-4 h-auto whitespace-normal"
                  onClick={() => setSelectedPrompt(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </Button>
              <Button
                onClick={generateFinalContent}
                disabled={!selectedPrompt || isGenerating}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <ArrowRight className="w-4 h-4 mr-2" />
                )}
                Générer ma psychographie
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Étape 3: Résultat et sauvegarde */}
      {currentStep === 3 && (
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <Save className="w-5 h-5 text-emerald-400" />
              Votre psychographie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-800 p-4 rounded-lg">
              <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                {finalContent}
              </div>
            </div>

            {/* Tags automatiques */}
            <div className="flex gap-2">
              <Badge variant="secondary">{selectedStyle}</Badge>
              <Badge variant="secondary">studio</Badge>
            </div>

            {/* Visibilité */}
            <div className="flex items-center space-x-2">
              <Switch
                id="public-switch"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <Label htmlFor="public-switch" className="flex items-center gap-2 text-slate-300">
                {isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {isPublic ? 'Visible par tous' : 'Privé'}
              </Label>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Modifier
              </Button>
              <Button
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                {saveMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Sauvegarder
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};