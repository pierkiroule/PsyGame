import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lightbulb, Wand2, Save, ArrowRight, ArrowLeft } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '@/contexts/AuthContext';

type CreationStep = 1 | 2 | 3;

export default function CreatePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // État des étapes
  const [currentStep, setCurrentStep] = useState<CreationStep>(1);

  // Étape 1 - Inspiration initiale
  const [initialPrompt, setInitialPrompt] = useState('');

  // Étape 2 - Enrichissement
  const [enrichedOptions, setEnrichedOptions] = useState<string[]>([]);
  const [selectedEnriched, setSelectedEnriched] = useState('');
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);

  // Étape 3 - Création finale
  const [psychography, setPsychography] = useState({
    title: '',
    finalText: '',
    sensoryGuide: '',
    metaphor: '',
    tags: [] as string[],
    isPublic: false
  });
  const [newTag, setNewTag] = useState('');
  const [isGeneratingFinal, setIsGeneratingFinal] = useState(false);

  // Génération des prompts enrichis
  const generateEnrichedPrompts = async () => {
    setIsGeneratingPrompts(true);
    try {
      const response = await fetch('/api/psychography/generate-prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initialText: initialPrompt })
      });
      const data = await response.json();
      setEnrichedOptions(data.enrichedPrompts || []);
      setCurrentStep(2);
    } catch (error) {
      console.error('Erreur génération prompts:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer les prompts enrichis",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPrompts(false);
    }
  };

  // Génération du contenu final
  const generateFinalContent = async () => {
    setIsGeneratingFinal(true);
    try {
      const response = await fetch('/api/psychography/generate-final', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          initialPrompt, 
          enrichedPrompt: selectedEnriched 
        })
      });
      const data = await response.json();
      
      setPsychography(prev => ({
        ...prev,
        title: data.title || initialPrompt.slice(0, 50),
        finalText: data.finalText || '',
        sensoryGuide: data.sensoryGuide || '',
        metaphor: data.metaphor || ''
      }));
      setCurrentStep(3);
    } catch (error) {
      console.error('Erreur génération finale:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le contenu final",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingFinal(false);
    }
  };

  // Sauvegarde
  const saveMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/psychography', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initialPrompt,
          enrichedPrompt: selectedEnriched,
          title: psychography.title,
          finalText: psychography.finalText,
          sensoryGuide: psychography.sensoryGuide,
          metaphor: psychography.metaphor,
          tags: psychography.tags,
          isPublic: psychography.isPublic,
          authorPseudo: user?.username || 'Anonyme'
        })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/psychographies/my'] });
      toast({
        title: "Psychographie sauvegardée",
        description: "Votre création a été enregistrée avec succès"
      });
      // Reset
      setCurrentStep(1);
      setInitialPrompt('');
      setEnrichedOptions([]);
      setSelectedEnriched('');
      setPsychography({
        title: '',
        finalText: '',
        sensoryGuide: '',
        metaphor: '',
        tags: [],
        isPublic: false
      });
    }
  });

  const addTag = () => {
    if (newTag.trim() && !psychography.tags.includes(newTag.trim())) {
      setPsychography(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setPsychography(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* En-tête avec progression */}
      <div className="text-center space-y-6 mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Studio Psychographique
        </h1>
        
        <div className="flex justify-center gap-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                currentStep >= step
                  ? "bg-blue-500 text-white"
                  : "bg-slate-700 text-slate-400"
              )}
            >
              {step}
            </div>
          ))}
        </div>
        
        <div className="text-sm text-slate-400">
          {currentStep === 1 && "Saisie de votre inspiration initiale"}
          {currentStep === 2 && "Sélection du prompt enrichi"}
          {currentStep === 3 && "Finalisation de votre psychographie"}
        </div>
      </div>

      {/* Étape 1 - Inspiration initiale */}
      {currentStep === 1 && (
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-400">
              <Lightbulb className="w-5 h-5" />
              Qu'est-ce qui vous habite maintenant ?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={initialPrompt}
              onChange={(e) => setInitialPrompt(e.target.value)}
              placeholder="Exprimez librement ce qui vous traverse l'esprit, une émotion, une réflexion, un questionnement..."
              className="min-h-32 bg-slate-800 border-slate-600 text-slate-100"
              maxLength={500}
            />
            <div className="text-right text-sm text-slate-400">
              {initialPrompt.length}/500
            </div>
            <Button
              onClick={generateEnrichedPrompts}
              disabled={!initialPrompt.trim() || isGeneratingPrompts}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isGeneratingPrompts ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Génération...</>
              ) : (
                <><ArrowRight className="w-4 h-4 mr-2" /> Enrichir mon inspiration</>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Étape 2 - Sélection prompt enrichi */}
      {currentStep === 2 && (
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-400">
              <Wand2 className="w-5 h-5" />
              Choisissez votre direction créative
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {enrichedOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedEnriched(option)}
                  className={clsx(
                    "p-4 rounded-lg border cursor-pointer transition-all",
                    selectedEnriched === option
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-slate-600 hover:border-slate-500 bg-slate-800/50"
                  )}
                >
                  <p className="text-slate-200 text-sm">{option}</p>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(1)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <Button
                onClick={generateFinalContent}
                disabled={!selectedEnriched || isGeneratingFinal}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isGeneratingFinal ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Création...</>
                ) : (
                  <><ArrowRight className="w-4 h-4 mr-2" /> Créer ma psychographie</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Étape 3 - Finalisation */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Save className="w-5 h-5" />
                Finalisez votre psychographie
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={psychography.title}
                  onChange={(e) => setPsychography(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-slate-800 border-slate-600"
                />
              </div>

              <div>
                <Label htmlFor="finalText">Texte inspirant</Label>
                <Textarea
                  id="finalText"
                  value={psychography.finalText}
                  onChange={(e) => setPsychography(prev => ({ ...prev, finalText: e.target.value }))}
                  className="min-h-32 bg-slate-800 border-slate-600"
                />
              </div>

              <div>
                <Label htmlFor="sensoryGuide">Guide résonant (exploration sensorielle)</Label>
                <Textarea
                  id="sensoryGuide"
                  value={psychography.sensoryGuide}
                  onChange={(e) => setPsychography(prev => ({ ...prev, sensoryGuide: e.target.value }))}
                  className="min-h-24 bg-slate-800 border-slate-600"
                />
              </div>

              <div>
                <Label htmlFor="metaphor">Métaphore existentielle</Label>
                <Textarea
                  id="metaphor"
                  value={psychography.metaphor}
                  onChange={(e) => setPsychography(prev => ({ ...prev, metaphor: e.target.value }))}
                  className="min-h-24 bg-slate-800 border-slate-600"
                />
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Ajouter un tag"
                    className="bg-slate-800 border-slate-600"
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button onClick={addTag} size="sm">Ajouter</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {psychography.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-red-500/20"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="public"
                  checked={psychography.isPublic}
                  onCheckedChange={(checked) => setPsychography(prev => ({ ...prev, isPublic: checked }))}
                />
                <Label htmlFor="public">Publier dans la psychothèque publique</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(2)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !psychography.title || !psychography.finalText}
              className="bg-green-600 hover:bg-green-700"
            >
              {saveMutation.isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sauvegarde...</>
              ) : (
                <><Save className="w-4 h-4 mr-2" /> Sauvegarder</>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}