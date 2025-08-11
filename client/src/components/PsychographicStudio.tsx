import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VoiceTextInput } from './ui/voice-text-input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { 
  Mic, 
  Brain, 
  Sparkles, 
  Settings, 
  Wand2, 
  Save, 
  Eye, 
  EyeOff,
  Image,
  FileText,
  Compass,
  Tags,
  Users,
  Palette,
  Shuffle
} from 'lucide-react';
import { clsx } from 'clsx';

interface PsychographyParameters {
  targetAudience: string;
  usage: string;
  chaosIntensity: number;
  textStyle: string;
  imageStyle: string;
}

interface GeneratedPsychography {
  title: string;
  text: string;
  imageUrl?: string;
  guide: string;
  tags: string[];
}

export const PsychographicStudio: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'input' | 'lab' | 'generation'>('input');
  const [initialText, setInitialText] = useState('');
  const [enrichedPrompts, setEnrichedPrompts] = useState<string[]>([]);
  const [selectedPrompts, setSelectedPrompts] = useState<Set<number>>(new Set());
  const [parameters, setParameters] = useState<PsychographyParameters>({
    targetAudience: 'Tout public',
    usage: 'Introspection personnelle',
    chaosIntensity: 5,
    textStyle: 'Poétique et métaphorique',
    imageStyle: 'Abstrait et contemplatif'
  });
  const [finalPrompt, setFinalPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedPsychography | null>(null);
  const [isPublic, setIsPublic] = useState(false);

  const promptTemplates = [
    "Explorez les nuances émotionnelles de votre ressenti",
    "Transformez vos sensations en métaphores visuelles",
    "Révélez les archétypes cachés dans votre expression", 
    "Connectez votre état présent à des souvenirs profonds",
    "Créez des associations poétiques inattendues",
    "Explorez les couleurs et textures de votre expérience",
    "Transformez votre ressenti en paysage intérieur",
    "Révélez les symboles qui habitent votre état actuel"
  ];

  const targetAudiences = [
    'Tout public',
    'Adolescents', 
    'Adultes en questionnement',
    'Professionnels créatifs',
    'Personnes en transition',
    'Chercheurs spirituels'
  ];

  const usageOptions = [
    'Introspection personnelle',
    'Méditation créative',
    'Inspiration artistique',
    'Coaching et développement',
    'Thérapie par l\'art',
    'Animation de groupe'
  ];

  const textStyles = [
    'Poétique et métaphorique',
    'Contemplatif et sage',
    'Dynamique et énergique',
    'Mystique et spirituel',
    'Terre-à-terre et concret',
    'Philosophique et profond'
  ];

  const imageStyles = [
    'Abstrait et contemplatif',
    'Naturel et organique',
    'Géométrique et moderne',
    'Impressionniste et rêveur',
    'Minimaliste et épuré',
    'Expressif et vibrant'
  ];

  // Génération automatique des prompts enrichis
  const generateEnrichedPrompts = () => {
    if (initialText.trim()) {
      const shuffled = [...promptTemplates].sort(() => Math.random() - 0.5);
      setEnrichedPrompts(shuffled.slice(0, 6));
    }
  };

  // Construction dynamique du prompt final
  useEffect(() => {
    if (initialText && selectedPrompts.size > 0) {
      const selectedPromptTexts = Array.from(selectedPrompts).map(index => enrichedPrompts[index]);
      const prompt = `
Texte initial: "${initialText}"

Angles d'exploration:
${selectedPromptTexts.map(p => `- ${p}`).join('\n')}

Public cible: ${parameters.targetAudience}
Usage: ${parameters.usage}
Intensité créative: ${parameters.chaosIntensity}/10
Style de texte: ${parameters.textStyle}
Style d'image: ${parameters.imageStyle}

Générez une psychographie complète avec:
1. Un titre évocateur
2. Un texte projectif et résonant avec métaphores pertinentes
3. Un guide d'accompagnement pour la résonance
4. Des tags descriptifs
      `.trim();
      setFinalPrompt(prompt);
    }
  }, [initialText, selectedPrompts, enrichedPrompts, parameters]);

  const handlePromptToggle = (index: number) => {
    const newSelected = new Set(selectedPrompts);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedPrompts(newSelected);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulation de génération (remplacer par appel API réel)
    setTimeout(() => {
      setGeneratedContent({
        title: "Échos d'une Présence Silencieuse",
        text: `Dans les replis secrets de votre être, une présence silencieuse se révèle. Comme une rivière souterraine qui nourrit des jardins invisibles, votre ressenti actuel porte en lui la sagesse des profondeurs.

Les métaphores s'entrelacent : vous êtes à la fois la graine qui attend son printemps et la terre qui l'accueille. Cette tension créatrice, ce dialogue intérieur entre ce qui est et ce qui aspire à naître, dessine les contours d'une transformation en cours.

Votre état présent résonne avec l'archétype du contemplateur, celui qui observe les mouvements subtils de l'âme avec la patience du sage et la curiosité de l'enfant.`,
        guide: `Pour accompagner cette résonance:
• Prenez un moment de silence pour ressentir cette présence silencieuse mentionnée
• Identifiez dans votre quotidien les moments où cette 'rivière souterraine' se manifeste
• Explorez quelle transformation pourrait vouloir naître en vous
• Notez les synchronicités qui pourraient confirmer cette direction`,
        tags: ['contemplation', 'transformation', 'présence', 'intériorité', 'sagesse', 'métamorphose']
      });
      setIsGenerating(false);
    }, 3000);
  };

  const handleSave = () => {
    console.log('Sauvegarde dans la psychothèque:', { 
      content: generatedContent, 
      isPublic,
      parameters,
      finalPrompt 
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      {/* En-tête avec navigation des étapes */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Studio Psychographique
        </h1>
        <p className="text-slate-400">Outil de brainstorming projectif et résonant</p>
        
        <div className="flex justify-center gap-4 mt-6">
          {[
            { key: 'input', label: 'Texte Initial', icon: Mic },
            { key: 'lab', label: 'Labo Psychographique', icon: Brain },
            { key: 'generation', label: 'Génération', icon: Wand2 }
          ].map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-full border transition-all",
                currentStep === step.key 
                  ? "bg-blue-600 border-blue-500 text-white"
                  : index < ['input', 'lab', 'generation'].indexOf(currentStep)
                    ? "bg-green-600 border-green-500 text-white"
                    : "bg-slate-800 border-slate-600 text-slate-400"
              )}>
                <step.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{step.label}</span>
              </div>
              {index < 2 && (
                <div className="w-8 h-0.5 bg-slate-600 mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ÉTAPE 1: Texte Initial */}
      <Card className="border-slate-700 bg-slate-950/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-300">
            <Mic className="w-5 h-5" />
            Étape 1: Texte Initial
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <VoiceTextInput
            label="Partagez votre ressenti, votre idée, votre questionnement..."
            value={initialText}
            onChange={setInitialText}
            placeholder="Qu'est-ce qui vous habite maintenant ? Exprimez-vous librement..."
            multiline={true}
            rows={4}
            className="bg-slate-900/50 border-slate-700"
          />
          
          {initialText.trim() && (
            <div className="flex justify-end">
              <Button 
                onClick={() => {
                  generateEnrichedPrompts();
                  setCurrentStep('lab');
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Brain className="w-4 h-4 mr-2" />
                Entrer dans le Labo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ÉTAPE 2: Labo Psychographique */}
      {currentStep !== 'input' && (
        <Card className="border-slate-700 bg-slate-950/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-300">
              <Brain className="w-5 h-5" />
              Étape 2: Labo Psychographique
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-slate-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Prompts d'enrichissement générés
                </h4>
                <div className="space-y-2">
                  {enrichedPrompts.map((prompt, index) => (
                    <div 
                      key={index}
                      className={clsx(
                        "p-3 border rounded-lg cursor-pointer transition-all",
                        selectedPrompts.has(index)
                          ? "border-purple-500 bg-purple-950/30"
                          : "border-slate-600 bg-slate-900/30 hover:border-slate-500"
                      )}
                      onClick={() => handlePromptToggle(index)}
                    >
                      <p className="text-sm text-slate-300">{prompt}</p>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={generateEnrichedPrompts}
                  className="w-full"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Régénérer les prompts
                </Button>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-slate-200 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Paramètres de génération
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-slate-300">Public cible</Label>
                    <Select value={parameters.targetAudience} onValueChange={(value) => 
                      setParameters(prev => ({ ...prev, targetAudience: value }))
                    }>
                      <SelectTrigger className="bg-slate-900/50 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {targetAudiences.map(audience => (
                          <SelectItem key={audience} value={audience}>{audience}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm text-slate-300">Usage prévu</Label>
                    <Select value={parameters.usage} onValueChange={(value) => 
                      setParameters(prev => ({ ...prev, usage: value }))
                    }>
                      <SelectTrigger className="bg-slate-900/50 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {usageOptions.map(usage => (
                          <SelectItem key={usage} value={usage}>{usage}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm text-slate-300">
                      Intensité du chaos créatif: {parameters.chaosIntensity}/10
                    </Label>
                    <Slider
                      value={[parameters.chaosIntensity]}
                      onValueChange={([value]) => 
                        setParameters(prev => ({ ...prev, chaosIntensity: value }))
                      }
                      min={1}
                      max={10}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-sm text-slate-300">Style de texte</Label>
                    <Select value={parameters.textStyle} onValueChange={(value) => 
                      setParameters(prev => ({ ...prev, textStyle: value }))
                    }>
                      <SelectTrigger className="bg-slate-900/50 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {textStyles.map(style => (
                          <SelectItem key={style} value={style}>{style}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm text-slate-300">Style d'image</Label>
                    <Select value={parameters.imageStyle} onValueChange={(value) => 
                      setParameters(prev => ({ ...prev, imageStyle: value }))
                    }>
                      <SelectTrigger className="bg-slate-900/50 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {imageStyles.map(style => (
                          <SelectItem key={style} value={style}>{style}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {selectedPrompts.size > 0 && (
              <div className="flex justify-end">
                <Button 
                  onClick={() => setCurrentStep('generation')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Finaliser et Générer
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ÉTAPE 3: Génération */}
      {currentStep === 'generation' && (
        <>
          <Card className="border-slate-700 bg-slate-950/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-300">
                <Wand2 className="w-5 h-5" />
                Étape 3: Génération de la Psychographie
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium text-slate-200">Prompt final généré</h4>
                <Textarea
                  value={finalPrompt}
                  onChange={(e) => setFinalPrompt(e.target.value)}
                  rows={8}
                  className="bg-slate-900/50 border-slate-700 text-slate-300 font-mono text-xs"
                />
              </div>

              <div className="flex justify-center">
                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 mr-2" />
                      Générer la Psychographie
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Psychographie Générée */}
          {generatedContent && (
            <Card className="border-green-600/30 bg-gradient-to-br from-green-950/20 to-blue-950/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-green-300">Psychographie Générée</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={isPublic}
                        onCheckedChange={setIsPublic}
                      />
                      <Label className="text-sm">
                        {isPublic ? (
                          <span className="flex items-center gap-1 text-green-400">
                            <Eye className="w-3 h-3" />
                            Publique
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-slate-400">
                            <EyeOff className="w-3 h-3" />
                            Privée
                          </span>
                        )}
                      </Label>
                    </div>
                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {generatedContent.title}
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="flex items-center gap-2 font-medium text-slate-200 mb-3">
                        <FileText className="w-4 h-4" />
                        Texte Projectif
                      </h3>
                      <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-4">
                        <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                          {generatedContent.text}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="flex items-center gap-2 font-medium text-slate-200 mb-3">
                        <Compass className="w-4 h-4" />
                        Guide d'Accompagnement
                      </h3>
                      <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-4">
                        <p className="text-slate-300 text-sm whitespace-pre-line">
                          {generatedContent.guide}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="flex items-center gap-2 font-medium text-slate-200 mb-3">
                        <Image className="w-4 h-4" />
                        Image Associée
                      </h3>
                      <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-8 flex items-center justify-center">
                        <div className="text-center text-slate-500">
                          <Image className="w-12 h-12 mx-auto mb-2" />
                          <p className="text-sm">Image en cours de génération...</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="flex items-center gap-2 font-medium text-slate-200 mb-3">
                        <Tags className="w-4 h-4" />
                        Tags Descriptifs
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {generatedContent.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-blue-400 border-blue-600">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};