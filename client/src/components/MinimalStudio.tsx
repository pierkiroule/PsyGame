import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
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
// VoiceTextInput supprimé - utilisation standard du textarea

const STYLES = [
  { id: 'poetique', label: 'Poétique', icon: '🌱', desc: 'Expression créative et métaphorique' },
  { id: 'philosophique', label: 'Philosophique', icon: '🔍', desc: 'Réflexion profonde et analytique' },
  { id: 'mystique', label: 'Mystique', icon: '✨', desc: 'Exploration spirituelle et intuitive' }
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
  const { user } = useAuth();
  const { toast } = useToast();

  // Génération des prompts enrichis (étape 2)
  const generatePrompts = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initialText, style: selectedStyle })
      });
      const data = await response.json();
      setEnrichedPrompts(data.prompts);
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
      const response = await fetch('/api/generate/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initialText, selectedPrompt, style: selectedStyle })
      });
      const data = await response.json();
      setFinalContent(data.content);
      setCurrentStep(3);
    } catch (error) {
      console.error('Erreur génération contenu:', error);
      // Fallback local
      const content = `À partir de votre inspiration "${initialText}", voici une psychographie ${selectedStyle} :

${selectedPrompt}

Cette reson révèle les dimensions cachées de votre pensée initiale, tissant des liens entre l'intuition première et les résonances profondes de votre être créatif.`;
      
      setFinalContent(content);
      setCurrentStep(3);
    } finally {
      setIsGenerating(false);
    }
  };

  // Sauvegarde
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Utilisateur non connecté');
      
      const response = await fetch('/api/psychographies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: initialText.slice(0, 50) + (initialText.length > 50 ? '...' : ''),
          content: finalContent,
          tags: [selectedStyle, 'studio'],
          isPublic,
          userId: user.id
        })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/psychographies'] });
      toast({
        title: "Psychographie sauvegardée",
        description: "Votre création a été enregistrée avec succès."
      });
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
            <Textarea
              value={initialText}
              onChange={(e) => setInitialText(e.target.value)}
              placeholder="Partagez ce qui vous habite en ce moment... Vos pensées, émotions ou réflexions"
              className="min-h-32 bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-400"
            />
            
            {/* Sélection de style enrichie */}
            <div className="space-y-3">
              <Label className="text-slate-300 font-medium">Approche créative</Label>
              <div className="grid gap-3">
                {STYLES.map((style) => (
                  <Button
                    key={style.id}
                    variant={selectedStyle === style.id ? "default" : "outline"}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`p-4 h-auto flex items-center gap-3 text-left ${
                      selectedStyle === style.id 
                        ? "bg-blue-600 hover:bg-blue-700 border-blue-500" 
                        : "border-slate-600 hover:bg-slate-800/50"
                    }`}
                  >
                    <span className="text-lg">{style.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{style.label}</div>
                      <div className="text-xs opacity-70 mt-1">{style.desc}</div>
                    </div>
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
              🌱 Enrichir ma réflexion
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
              ✨ Affinez votre inspiration
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
              🌟 Votre création psychographique
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
                {isPublic ? '🌍 Partager avec la communauté' : '🌱 Garder dans mon jardin privé'}
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
                🌱 Cultiver ma création
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};