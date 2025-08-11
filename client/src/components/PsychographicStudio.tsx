import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Sparkles, 
  Wand2, 
  RefreshCw, 
  Save, 
  Settings,
  Eye,
  EyeOff,
  Loader2,
  BookOpen,
  Palette,
  Volume2,
  Volume1,
  Users,
  User,
  Users2,
  Play,
  Lightbulb
} from 'lucide-react';
import { clsx } from 'clsx';
import { apiRequest } from '@/lib/queryClient';
import { VoiceTextInput } from '@/components/ui/voice-text-input';
import { MinimalHeader } from './MinimalHeader';

const CHAOS_LEVELS = {
  1: { label: 'Classique', description: 'Résonance douce et harmonieuse' },
  2: { label: 'Créatif', description: 'Exploration équilibrée' },
  3: { label: 'Inventif', description: 'Associations surprenantes' },
  4: { label: 'Audacieux', description: 'Liberté créative totale' },
  5: { label: 'Chaos', description: 'Délire créatif assumé' }
};

const STYLES = [
  { id: 'poetique', label: 'Poétique', icon: '🌸' },
  { id: 'mystique', label: 'Mystique', icon: '🔮' },
  { id: 'philosophique', label: 'Philosophique', icon: '🤔' },
  { id: 'metaphysique', label: 'Métaphysique', icon: '✨' },
  { id: 'shamanique', label: 'Shamanique', icon: '🌿' },
  { id: 'jungien', label: 'Jungien', icon: '🎭' }
];

const USAGES = [
  { id: 'introspection', label: 'Introspection', icon: <User className="w-4 h-4" /> },
  { id: 'couple', label: 'Dialogue de couple', icon: <Users className="w-4 h-4" /> },
  { id: 'therapie', label: 'Accompagnement thérapeutique', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'creation', label: 'Processus créatif', icon: <Palette className="w-4 h-4" /> },
  { id: 'meditation', label: 'Méditation guidée', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'coaching', label: 'Coaching personnel', icon: <Users2 className="w-4 h-4" /> }
];

export const PsychographicStudio: React.FC = () => {
  // Step states
  const [currentStep, setCurrentStep] = useState(1);
  const [initialText, setInitialText] = useState('');
  const [enrichedPrompts, setEnrichedPrompts] = useState<string[]>([]);
  const [selectedPrompts, setSelectedPrompts] = useState<Set<string>>(new Set());
  const [finalPrompt, setFinalPrompt] = useState('');
  
  // Parameters
  const [isPublic, setIsPublic] = useState(false);
  const [selectedUsage, setSelectedUsage] = useState('introspection');
  const [chaosLevel, setChaosLevel] = useState([2]);
  const [selectedStyle, setSelectedStyle] = useState('poetique');
  
  // Generated content
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const queryClient = useQueryClient();

  // Generate enriched prompts mutation
  const generatePromptsMutation = useMutation({
    mutationFn: (text: string) =>
      apiRequest('/api/psychography/generate-prompts', {
        method: 'POST',
        body: { initialText: text }
      }),
    onSuccess: (data) => {
      setEnrichedPrompts(data.enrichedPrompts);
      setCurrentStep(2);
    }
  });

  // Generate psychography mutation
  const generateMutation = useMutation({
    mutationFn: (data: any) =>
      apiRequest('/api/psychography/generate', {
        method: 'POST',
        body: data
      }),
    onSuccess: (data) => {
      setGeneratedContent(data);
      setCurrentStep(3);
    }
  });

  // Save psychography mutation
  const saveMutation = useMutation({
    mutationFn: (data: any) =>
      apiRequest('/api/psychography', {
        method: 'POST',
        body: data
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/psychography'] });
      // Reset form
      setCurrentStep(1);
      setInitialText('');
      setEnrichedPrompts([]);
      setSelectedPrompts(new Set());
      setFinalPrompt('');
      setGeneratedContent(null);
    }
  });

  // Update final prompt when selections change
  useEffect(() => {
    if (selectedPrompts.size > 0) {
      const baseText = `Texte initial: "${initialText}"`;
      const promptsText = Array.from(selectedPrompts).join('. ');
      const parametersText = `Style: ${STYLES.find(s => s.id === selectedStyle)?.label}. Usage: ${USAGES.find(u => u.id === selectedUsage)?.label}. Chaos: ${CHAOS_LEVELS[chaosLevel[0] as keyof typeof CHAOS_LEVELS].label}.`;
      
      setFinalPrompt(`${baseText}\n\nDirectives créatives: ${promptsText}\n\nParamètres: ${parametersText}`);
    }
  }, [selectedPrompts, initialText, selectedStyle, selectedUsage, chaosLevel]);

  const handlePromptToggle = (prompt: string) => {
    const newSelected = new Set(selectedPrompts);
    if (newSelected.has(prompt)) {
      newSelected.delete(prompt);
    } else if (newSelected.size < 4) { // Limit to 4 prompts
      newSelected.add(prompt);
    }
    setSelectedPrompts(newSelected);
  };

  const handleGenerate = () => {
    if (selectedPrompts.size === 0) return;
    
    generateMutation.mutate({
      initialText,
      selectedPrompts: Array.from(selectedPrompts),
      finalPrompt,
      parameters: {
        isPublic,
        usage: selectedUsage,
        chaosLevel: chaosLevel[0],
        style: selectedStyle
      }
    });
  };

  const handleSave = () => {
    if (!generatedContent) return;
    
    saveMutation.mutate({
      ...generatedContent,
      initialText,
      finalPrompt,
      isPublic,
      parameters: {
        usage: selectedUsage,
        chaosLevel: chaosLevel[0],
        style: selectedStyle
      }
    });
  };

  const StepIndicator = ({ step, active, completed }: { step: number; active: boolean; completed: boolean }) => (
    <div className={clsx(
      "flex items-center gap-3 py-3 px-4 rounded-lg transition-all",
      active && "bg-blue-600/20 border border-blue-500/30",
      completed && !active && "bg-green-600/10 border border-green-500/20",
      !active && !completed && "bg-slate-800/30"
    )}>
      <div className={clsx(
        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
        active && "bg-blue-500 text-white",
        completed && !active && "bg-green-500 text-white",
        !active && !completed && "bg-slate-600 text-slate-300"
      )}>
        {step}
      </div>
      <div>
        <div className={clsx(
          "font-medium",
          active && "text-blue-300",
          completed && !active && "text-green-300",
          !active && !completed && "text-slate-400"
        )}>
          {step === 1 && "Saisie Initiale"}
          {step === 2 && "Labo Psychographique"}
          {step === 3 && "Génération & Sauvegarde"}
        </div>
        <div className="text-xs text-slate-500">
          {step === 1 && "Exprimez votre ressenti"}
          {step === 2 && "Enrichissement créatif"}
          {step === 3 && "Résultat final"}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
      <MinimalHeader />
      
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
            Studio Psychographique
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Transformez vos ressentis en créations psychographiques uniques à travers un processus d'IA collaborative
          </p>
        </div>

        {/* Step Indicators */}
        <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <StepIndicator step={1} active={currentStep === 1} completed={currentStep > 1} />
          <StepIndicator step={2} active={currentStep === 2} completed={currentStep > 2} />
          <StepIndicator step={3} active={currentStep === 3} completed={false} />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Input and Parameters */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Initial Input */}
            {currentStep === 1 && (
              <Card className="border-slate-700 bg-slate-950/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-300">
                    <Volume2 className="w-5 h-5" />
                    Qu'est-ce qui vous habite maintenant ?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <VoiceTextInput
                    value={initialText}
                    onChange={setInitialText}
                    placeholder="Exprimez librement ce qui résonne en vous en ce moment... Utilisez le micro pour parler naturellement ou tapez votre ressenti."
                    className="min-h-32 text-lg bg-slate-900/50 border-slate-700"
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-400">
                      {initialText.length} caractères
                    </div>
                    <Button
                      onClick={() => generatePromptsMutation.mutate(initialText)}
                      disabled={!initialText.trim() || generatePromptsMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {generatePromptsMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyse...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4 mr-2" />
                          Entrer au Labo
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Lab */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <Card className="border-slate-700 bg-slate-950/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-300">
                      <Sparkles className="w-5 h-5" />
                      Labo Psychographique
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-slate-300 bg-slate-900/30 p-3 rounded-lg">
                      <strong>Votre texte initial:</strong><br />
                      "{initialText}"
                    </div>
                    
                    <div>
                      <Label className="text-slate-200 mb-3 block">
                        Choisissez jusqu'à 4 directions d'enrichissement :
                      </Label>
                      <div className="grid md:grid-cols-2 gap-3">
                        {enrichedPrompts.map((prompt, index) => (
                          <div
                            key={index}
                            onClick={() => handlePromptToggle(prompt)}
                            className={clsx(
                              "p-3 rounded-lg border cursor-pointer transition-all",
                              selectedPrompts.has(prompt)
                                ? "border-blue-500 bg-blue-600/20 text-blue-200"
                                : "border-slate-600 bg-slate-800/30 text-slate-300 hover:border-slate-500"
                            )}
                          >
                            <div className="flex items-start gap-2">
                              <div className={clsx(
                                "w-4 h-4 rounded border-2 mt-0.5 flex-shrink-0",
                                selectedPrompts.has(prompt)
                                  ? "border-blue-500 bg-blue-500"
                                  : "border-slate-500"
                              )}>
                                {selectedPrompts.has(prompt) && (
                                  <div className="w-full h-full flex items-center justify-center text-white text-xs">
                                    ✓
                                  </div>
                                )}
                              </div>
                              <span className="text-sm">{prompt}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-xs text-slate-400">
                        {selectedPrompts.size}/4 prompts sélectionnés
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Parameters */}
                <Card className="border-slate-700 bg-slate-950/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-emerald-300">
                      <Settings className="w-5 h-5" />
                      Paramètres Créatifs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Visibility */}
                    <div className="flex items-center justify-between">
                      <Label className="text-slate-200">Visibilité</Label>
                      <div className="flex items-center gap-2">
                        <EyeOff className="w-4 h-4 text-slate-400" />
                        <Switch
                          checked={isPublic}
                          onCheckedChange={setIsPublic}
                        />
                        <Eye className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-400">
                          {isPublic ? 'Public' : 'Privé'}
                        </span>
                      </div>
                    </div>

                    {/* Usage */}
                    <div>
                      <Label className="text-slate-200 mb-3 block">Usage prévu</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {USAGES.map((usage) => (
                          <Button
                            key={usage.id}
                            variant={selectedUsage === usage.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedUsage(usage.id)}
                            className={clsx(
                              "justify-start",
                              selectedUsage === usage.id 
                                ? "bg-blue-600 text-white" 
                                : "border-slate-600 text-slate-300"
                            )}
                          >
                            {usage.icon}
                            <span className="ml-2">{usage.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Chaos Level */}
                    <div>
                      <Label className="text-slate-200 mb-3 block">
                        Intensité Chaos: {CHAOS_LEVELS[chaosLevel[0] as keyof typeof CHAOS_LEVELS].label}
                      </Label>
                      <Slider
                        value={chaosLevel}
                        onValueChange={setChaosLevel}
                        max={5}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-xs text-slate-400 mt-1">
                        {CHAOS_LEVELS[chaosLevel[0] as keyof typeof CHAOS_LEVELS].description}
                      </div>
                    </div>

                    {/* Style */}
                    <div>
                      <Label className="text-slate-200 mb-3 block">Style créatif</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {STYLES.map((style) => (
                          <Button
                            key={style.id}
                            variant={selectedStyle === style.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedStyle(style.id)}
                            className={clsx(
                              selectedStyle === style.id 
                                ? "bg-purple-600 text-white" 
                                : "border-slate-600 text-slate-300"
                            )}
                          >
                            <span className="mr-2">{style.icon}</span>
                            {style.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button
                        onClick={handleGenerate}
                        disabled={selectedPrompts.size === 0 || generateMutation.isPending}
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {generateMutation.isPending ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Génération...
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5 mr-2" />
                            Générer la Psychographie
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Results */}
            {currentStep === 3 && generatedContent && (
              <Card className="border-slate-700 bg-slate-950/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-300">
                    <Sparkles className="w-5 h-5" />
                    Psychographie Générée
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {generatedContent.title}
                    </h2>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {generatedContent.tags?.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-blue-400 border-blue-600">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <div className="bg-slate-900/30 p-4 rounded-lg">
                      <p className="whitespace-pre-line text-slate-200 leading-relaxed">
                        {generatedContent.text}
                      </p>
                    </div>
                  </div>

                  {generatedContent.guide && (
                    <div>
                      <h3 className="text-lg font-medium text-slate-200 mb-2 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Guide d'Accompagnement
                      </h3>
                      <div className="bg-slate-900/30 p-4 rounded-lg">
                        <p className="whitespace-pre-line text-slate-300 text-sm">
                          {generatedContent.guide}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="border-slate-600 text-slate-300"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Nouvelle Création
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={saveMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {saveMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sauvegarde...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Sauvegarder
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - Preview */}
          <div className="space-y-6">
            <Card className="border-slate-700 bg-slate-950/50 sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-200">
                  <Eye className="w-4 h-4" />
                  Preview Prompt Final
                </CardTitle>
              </CardHeader>
              <CardContent>
                {finalPrompt ? (
                  <div className="bg-slate-900/50 p-3 rounded-lg">
                    <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono">
                      {finalPrompt}
                    </pre>
                  </div>
                ) : (
                  <div className="text-slate-500 text-sm text-center py-8">
                    Le prompt final apparaîtra ici au fur et à mesure de vos choix
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation Shortcuts */}
            <Card className="border-slate-700 bg-slate-950/50">
              <CardHeader>
                <CardTitle className="text-slate-200 text-sm">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-slate-300"
                  onClick={() => window.location.href = '/psychotheque'}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Psychothèque
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-slate-300"
                  onClick={() => window.location.href = '/profile'}
                >
                  <User className="w-4 h-4 mr-2" />
                  Profil
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};