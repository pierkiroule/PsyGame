import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Heart, MessageCircle, Star, Trophy, Sparkles, TrendingUp } from 'lucide-react';

interface Psychography {
  id: string;
  title: string;
  author: string;
  excerpt: string;
  votes: number;
  comments: number;
  tags: string[];
  createdAt: string;
  score: number;
}

export default function MinimalPsychotheque() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('trending');

  // Données simulées simplifiées
  const featuredPsychographies: Psychography[] = [
    {
      id: '1',
      title: 'Les murmures du temps',
      author: 'Marie L.',
      excerpt: 'Dans le silence des heures qui s\'étirent, les souvenirs dansent comme des ombres fugaces...',
      votes: 156,
      comments: 23,
      tags: ['temps', 'mémoire', 'poésie'],
      createdAt: '2025-01-08',
      score: 4.8
    },
    {
      id: '2',
      title: 'Métamorphose urbaine',
      author: 'Alex M.',
      excerpt: 'Entre béton et rêves, la ville révèle ses secrets cachés aux âmes qui savent regarder...',
      votes: 142,
      comments: 31,
      tags: ['ville', 'transformation', 'modernité'],
      createdAt: '2025-01-07',
      score: 4.7
    },
    {
      id: '3',
      title: 'Échos d\'enfance',
      author: 'Thomas K.',
      excerpt: 'Les rires résonnent encore dans le jardin abandonné, portés par le vent du souvenir...',
      votes: 128,
      comments: 18,
      tags: ['enfance', 'nostalgie', 'nature'],
      createdAt: '2025-01-06',
      score: 4.6
    }
  ];

  const trendingTags = [
    { name: 'métamorphose', count: 42 },
    { name: 'temps', count: 38 },
    { name: 'nature', count: 35 },
    { name: 'rêves', count: 29 }
  ];

  const PsychographyCard = ({ psychography }: { psychography: Psychography }) => (
    <Card className="border-slate-800/50 bg-slate-950/30 hover:bg-slate-950/50 transition-all duration-300 cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-slate-100 mb-1 line-clamp-1">
              {psychography.title}
            </CardTitle>
            <p className="text-sm text-slate-400">par {psychography.author}</p>
          </div>
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">{psychography.score}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-slate-300 text-sm mb-4 leading-relaxed line-clamp-3">
          {psychography.excerpt}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {psychography.tags.slice(0, 3).map(tag => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="text-xs border-emerald-600/30 text-emerald-400"
            >
              #{tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-slate-500 text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{psychography.votes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{psychography.comments}</span>
            </div>
          </div>
          <span>{psychography.createdAt}</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      
      {/* En-tête simplifié */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-light text-slate-100 mb-4">
          Découvrir la
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
            {' '}communauté
          </span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Explorez les créations partagées et laissez-vous inspirer par la diversité des expressions créatives.
        </p>
      </div>

      {/* Recherche simple */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Rechercher une psychographie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-950/50 border-slate-700/50 focus:border-emerald-600/50"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-slate-950/50">
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Tendances
          </TabsTrigger>
          <TabsTrigger value="top" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Top 5
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-6">
          {/* Tags populaires */}
          <Card className="border-slate-800/50 bg-slate-950/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-emerald-400 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Thèmes populaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map(tag => (
                  <Badge 
                    key={tag.name} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-emerald-600/20 border-emerald-600/30 text-emerald-400"
                  >
                    #{tag.name} ({tag.count})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Psychographies récentes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPsychographies.map(psychography => (
              <PsychographyCard key={psychography.id} psychography={psychography} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="top" className="space-y-6">
          {/* Top 5 de la semaine */}
          <Card className="border-amber-800/50 bg-amber-950/20">
            <CardHeader>
              <CardTitle className="text-xl text-amber-400 flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                Top 5 de la semaine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featuredPsychographies.slice(0, 3).map((psychography, index) => (
                  <div key={psychography.id} className="flex items-start gap-4 p-4 bg-slate-950/30 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500 text-yellow-900' :
                        index === 1 ? 'bg-gray-400 text-gray-900' :
                        'bg-amber-600 text-amber-900'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-200 mb-1">{psychography.title}</h3>
                      <p className="text-sm text-slate-400 mb-2">par {psychography.author}</p>
                      <p className="text-sm text-slate-300 line-clamp-2">{psychography.excerpt}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {psychography.votes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          {psychography.score}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Encouragement à participer */}
      <Card className="border-emerald-800/50 bg-emerald-950/20 mt-12">
        <CardContent className="p-8 text-center">
          <Sparkles className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-emerald-200 mb-3">
            Partagez votre créativité
          </h3>
          <p className="text-emerald-100 mb-6 max-w-md mx-auto">
            Votre prochaine psychographie pourrait inspirer des milliers de personnes. 
            Rejoignez cette communauté bienveillante.
          </p>
          <Button className="bg-emerald-600 hover:bg-emerald-700 font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            Créer ma première psychographie
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}