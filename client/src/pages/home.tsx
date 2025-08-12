import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/Logo';
import { Plus, BookOpen, Users, User, Sparkles, Heart, Camera } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          {/* Logo principal */}
          <div className="flex justify-center">
            <Logo size={120} />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
              Psychographe
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Outil écoresponsable de brainstorming projectif et résonant. 
              Transformez vos inspirations en créations psychographiques enrichies.
            </p>
          </div>

          {/* Actions principales */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href="/creer">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                <Plus className="w-5 h-5 mr-2" />
                Créer ma psychographie
              </Button>
            </Link>
            <Link href="/psychotheque">
              <Button variant="outline" size="lg" className="px-8 py-3">
                <Users className="w-5 h-5 mr-2" />
                Découvrir la psychothèque
              </Button>
            </Link>
          </div>
        </div>

        {/* Fonctionnalités */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <Card className="bg-slate-900/50 border-slate-700 hover:border-blue-500/50 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Sparkles className="w-5 h-5" />
                Studio Créatif
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300">
              Processus en 3 étapes : saisie intuitive, enrichissement par IA, création finale avec guide résonant et métaphores existentielles.
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700 hover:border-blue-500/50 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Heart className="w-5 h-5" />
                Psychothèque Sociale
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300">
              Galerie publique type Instagram : votes, commentaires, recherche par tags, mur des créations avec images illustratives.
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700 hover:border-blue-500/50 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Camera className="w-5 h-5" />
                Expérience Enrichie
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300">
              Chaque psychographie inclut : prompts initial/enrichi, texte inspirant, image, guide sensoriel et dimensions métaphoriques.
            </CardContent>
          </Card>
        </div>

        {/* Structure d'une psychographie */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center text-slate-200 mb-8">
            Anatomie d'une Psychographie
          </h2>
          <Card className="bg-slate-900/30 border-slate-700 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6 text-slate-300">
                <div className="space-y-3">
                  <h3 className="font-semibold text-blue-400">Éléments Créatifs</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Pseudo & Date</strong> - Identité créative</li>
                    <li>• <strong>Titre & Tags</strong> - Classification thématique</li>
                    <li>• <strong>Prompt Initial</strong> - Inspiration première</li>
                    <li>• <strong>Prompt Enrichi</strong> - Développement par IA</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-blue-400">Expérience Immersive</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Texte Inspirant</strong> - Création finale</li>
                    <li>• <strong>Image Illustrative</strong> - Support visuel</li>
                    <li>• <strong>Guide Résonant</strong> - Exploration sensorielle</li>
                    <li>• <strong>Métaphore Existentielle</strong> - Dimension profonde</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}