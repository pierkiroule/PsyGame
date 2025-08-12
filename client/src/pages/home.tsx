import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Sparkles, Pen, Globe, User } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-12">
        
        {/* Hero Section avec logo principal */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <Logo size={120} />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-slate-100 mb-6">
            Bienvenue dans votre labo psychographique
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
              Psychographe
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Explorez votre créativité à travers des psychographies uniques. 
            Laissez l'IA révéler les profondeurs de votre imagination.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              <Pen className="w-5 h-5 mr-2" />
              Créer ma première Psychographie
            </Button>
            
            <Link href="/psychotheque">
              <Button variant="outline" size="lg" className="px-8 py-3 border-slate-600 text-slate-300 hover:bg-slate-800">
                <Globe className="w-5 h-5 mr-2" />
                Explorer la Psychotheque
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-400">
                <Sparkles className="w-5 h-5" />
                Création Guidée
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Des formats créatifs variés pour explorer différentes facettes 
                de votre personnalité et libérer votre potentiel artistique.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Globe className="w-5 h-5" />
                Communauté Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Partagez vos créations, découvrez celles des autres et 
                participez aux votes pour le Top 5 hebdomadaire.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <User className="w-5 h-5" />
                Profil Évolutif
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Collectez des badges, suivez vos progrès et visualisez 
                l'évolution de vos thèmes créatifs avec des analyses IA.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-emerald-900/20 to-slate-900/20 border border-emerald-800/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-slate-200 mb-4">
              Prêt à explorer votre créativité ?
            </h2>
            <p className="text-slate-400 mb-6">
              Rejoignez la communauté des créateurs et laissez votre imagination s'exprimer.
            </p>
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Pen className="w-5 h-5 mr-2" />
              Commencer maintenant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}