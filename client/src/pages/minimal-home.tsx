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
      description: 'Commencez votre exploration créative en cliquant ici. L\'IA vous guidera à travers un processus d\'exploration personnalisé.',
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/20">
        <div className="container mx-auto px-4 py-16">
          
          {/* Hero minimaliste */}
          <div className="text-center mb-20 max-w-4xl mx-auto">
            <div className="flex justify-center mb-12">
              <Logo size={120} />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-light text-white mb-8 leading-tight tracking-tight">
              Explorez votre
              <span className="block font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mt-2">
                univers créatif
              </span>
            </h1>
            
            <p className="text-xl text-slate-200 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Psychographe révèle les profondeurs de votre imagination à travers 
              des créations uniques générées par l'intelligence artificielle.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 font-medium text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Sparkles className="w-5 h-5 mr-3" />
                Commencer l'exploration
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
              
              <Link href="/psychotheque">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-slate-500 text-slate-200 hover:bg-slate-800 hover:text-white px-10 py-4 font-medium text-lg rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <Users className="w-5 h-5 mr-3" />
                  Découvrir la communauté
                </Button>
              </Link>
            </div>
          </div>

          {/* Fonctionnalités essentielles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto">
            <Card className="border-slate-700/50 bg-slate-950/40 backdrop-blur-sm hover:bg-slate-950/60 transition-all duration-300 hover:scale-105 hover:shadow-xl group">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-blue-400 text-xl font-semibold">
                  <Heart className="w-6 h-6" />
                  Introspection guidée
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-200 leading-relaxed">
                  Des questions pensées pour révéler votre personnalité et stimuler 
                  votre créativité de manière authentique.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-700/50 bg-slate-950/40 backdrop-blur-sm hover:bg-slate-950/60 transition-all duration-300 hover:scale-105 hover:shadow-xl group">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-blue-400 text-xl font-semibold">
                  <Lightbulb className="w-6 h-6" />
                  IA créative
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-200 leading-relaxed">
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