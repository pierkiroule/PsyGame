import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { OnboardingTooltip } from '@/components/OnboardingTooltip';
import { Sparkles, ArrowRight, Heart, Lightbulb, Users } from 'lucide-react';
import { Link } from 'wouter';

export default function MinimalHome() {
  const [showOnboarding, setShowOnboarding] = useState(
    !localStorage.getItem('psychographe-onboarding-complete')
  );

  const onboardingSteps = [
    {
      target: '#create-button',
      title: 'Créer votre première psychographie',
      description: 'Commencez votre voyage créatif en cliquant ici. L\'IA vous guidera à travers un processus d\'exploration personnalisé.',
      position: 'bottom' as const
    },
    {
      target: '#nav-discover',
      title: 'Découvrir la communauté',
      description: 'Explorez les créations partagées par d\'autres utilisateurs et laissez-vous inspirer par leur créativité.',
      position: 'bottom' as const
    },
    {
      target: '#nav-profile',
      title: 'Suivre vos progrès',
      description: 'Votre profil vous permet de voir votre évolution créative, vos badges et l\'analyse de vos thèmes favoris.',
      position: 'bottom' as const
    }
  ];

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('psychographe-onboarding-complete', 'true');
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/20">
        <div className="container mx-auto px-4 py-12">
          
          {/* Hero minimaliste */}
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <Logo size={100} />
            </div>
            
            <h1 className="text-3xl md:text-5xl font-light text-slate-100 mb-6 leading-tight">
              Explorez votre
              <span className="block font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                univers créatif
              </span>
            </h1>
            
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Psychographe révèle les profondeurs de votre imagination à travers 
              des créations uniques générées par l'intelligence artificielle.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 font-medium"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Commencer l'exploration
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Link href="/psychotheque">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-3 border-slate-600/50 text-slate-300 hover:bg-slate-800/30"
                >
                  Découvrir la communauté
                </Button>
              </Link>
            </div>
          </div>

          {/* Fonctionnalités essentielles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
            <Card className="border-slate-800/50 bg-slate-950/30 backdrop-blur-sm hover:bg-slate-950/50 transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-emerald-400 text-lg">
                  <Heart className="w-5 h-5" />
                  Introspection guidée
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Des questions pensées pour révéler votre personnalité et stimuler 
                  votre créativité de manière authentique.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-800/50 bg-slate-950/30 backdrop-blur-sm hover:bg-slate-950/50 transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-400 text-lg">
                  <Lightbulb className="w-5 h-5" />
                  IA créative
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Une intelligence artificielle qui transforme vos réponses en 
                  créations poétiques uniques et personnalisées.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-800/50 bg-slate-950/30 backdrop-blur-sm hover:bg-slate-950/50 transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-purple-400 text-lg">
                  <Users className="w-5 h-5" />
                  Communauté bienveillante
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Partagez vos créations et découvrez celles des autres dans un 
                  espace respectueux et inspirant.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Call to action simple */}
          <div className="text-center max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-emerald-900/20 to-slate-900/20 border border-emerald-800/30 rounded-xl p-8">
              <h2 className="text-xl font-semibold text-slate-200 mb-3">
                Prêt pour votre première exploration ?
              </h2>
              <p className="text-slate-400 mb-6 text-sm">
                Le processus prend 5-10 minutes et vous guide étape par étape.
              </p>
              <Button 
                size="lg" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Créer ma première psychographie
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding optionnel */}
      <OnboardingTooltip
        steps={onboardingSteps}
        show={showOnboarding}
        onComplete={handleOnboardingComplete}
      />
    </>
  );
}