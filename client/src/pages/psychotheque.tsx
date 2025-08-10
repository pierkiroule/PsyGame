import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PsychographyCard } from '@/components/PsychographyCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Library, Search, Filter, Globe, Lock, Sparkles, TrendingUp, Trophy, Star, MessageCircle, Clock, Flame } from 'lucide-react';

export default function Psychotheque() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('trending');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('votes');
  const [timeFilter, setTimeFilter] = useState('week');

  // Simuler des données pour le prototype
  const { data: publicPsychographies, isLoading: publicLoading } = useQuery({
    queryKey: ['/api/psychotheque/public', searchTerm, sortBy, timeFilter],
    enabled: activeTab === 'public' || activeTab === 'trending',
  });

  const { data: privatePsychographies, isLoading: privateLoading } = useQuery({
    queryKey: ['/api/psychotheque/private'],
    enabled: activeTab === 'private',
  });

  const { data: trendingTags } = useQuery({
    queryKey: ['/api/psychotheque/trending-tags'],
  });

  // Top 5 psychographies simulées
  const mockTop5 = [
    {
      id: '1',
      title: 'Les Murmures du Temps',
      author: 'MarieLaPoète',
      score: 4.8,
      votes: 156,
      comments: 23,
      createdAt: '2025-01-08',
      excerpt: 'Dans le silence des heures qui s\'étirent, les souvenirs dansent...'
    },
    {
      id: '2', 
      title: 'Métamorphose Urbaine',
      author: 'UrbanDreamer',
      score: 4.7,
      votes: 142,
      comments: 31,
      createdAt: '2025-01-07',
      excerpt: 'Entre béton et rêves, la ville révèle ses secrets cachés...'
    },
    {
      id: '3',
      title: 'Échos d\'Enfance',
      author: 'NostaAlgique',
      score: 4.6,
      votes: 128,
      comments: 18,
      createdAt: '2025-01-06',
      excerpt: 'Les rires d\'autrefois résonnent encore dans les cours d\'école vides...'
    },
    {
      id: '4',
      title: 'Dialogue Intérieur',
      author: 'PhiloCreatif',
      score: 4.5,
      votes: 115,
      comments: 27,
      createdAt: '2025-01-05',
      excerpt: 'Deux voix s\'entremêlent dans la conscience, l\'une sage, l\'autre rebelle...'
    },
    {
      id: '5',
      title: 'Renaissance Marine',
      author: 'OcéanBleu',
      score: 4.4,
      votes: 108,
      comments: 15,
      createdAt: '2025-01-04',
      excerpt: 'Les vagues portent en elles la promesse d\'un nouveau départ...'
    }
  ];

  // Tags tendance simulés
  const mockTrendingTags = [
    { tag: 'métamorphose', count: 42 },
    { tag: 'mélancolie', count: 38 },
    { tag: 'archétype', count: 35 },
    { tag: 'nature', count: 29 },
    { tag: 'temps', count: 24 }
  ];

  const handleTagFilter = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
      <div className="container mx-auto px-4 py-8">
        
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-4 flex items-center justify-center gap-3">
            <Library className="w-10 h-10 text-emerald-400" />
            Psychothèque
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Explorez les créations de la communauté et découvrez de nouvelles perspectives créatives
          </p>
        </div>

        {/* Barre de recherche et filtres */}
        <Card className="mb-6 border-slate-800 bg-slate-950/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par contenu, auteur, tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-900/50 border-slate-700"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtres avancés
              </Button>
            </div>

            {/* Tags tendance */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-slate-300">Tags tendance</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {mockTrendingTags.map(({ tag, count }) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-emerald-600 transition-colors"
                    onClick={() => handleTagFilter(tag)}
                  >
                    #{tag} ({count})
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Onglets avec Top 5 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Top 5 Communauté
            </TabsTrigger>
            <TabsTrigger value="public" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Forum Public
            </TabsTrigger>
            <TabsTrigger value="private" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Ma Collection
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-200 mb-2 flex items-center justify-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                Hall of Fame - Top 5 de la Semaine
              </h2>
              <p className="text-slate-400">
                Les psychographies les plus appréciées par la communauté
              </p>
            </div>

            <div className="space-y-6">
              {mockTop5.map((psycho, index) => (
                <Card key={psycho.id} className={`border-slate-800 bg-slate-950/50 backdrop-blur-sm relative overflow-hidden ${
                  index === 0 ? 'border-yellow-500/50 bg-gradient-to-r from-yellow-900/20 to-slate-950/50' :
                  index === 1 ? 'border-slate-400/50 bg-gradient-to-r from-slate-700/20 to-slate-950/50' :
                  index === 2 ? 'border-amber-600/50 bg-gradient-to-r from-amber-900/20 to-slate-950/50' :
                  'border-slate-800'
                }`}>
                  {/* Badge de position */}
                  <div className={`absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500 text-yellow-900' :
                    index === 1 ? 'bg-slate-400 text-slate-900' :
                    index === 2 ? 'bg-amber-600 text-amber-900' :
                    'bg-slate-600 text-slate-200'
                  }`}>
                    {index + 1}
                  </div>

                  <CardContent className="p-6 pl-16">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-slate-200 mb-1">
                          {psycho.title}
                        </h3>
                        <p className="text-sm text-slate-400 mb-2">
                          par <span className="text-emerald-400 font-medium">{psycho.author}</span>
                        </p>
                        <p className="text-slate-300 leading-relaxed mb-4">
                          {psycho.excerpt}
                        </p>
                      </div>
                      
                      <div className="text-right ml-6">
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-lg font-bold text-slate-200">{psycho.score}</span>
                        </div>
                        <div className="text-xs text-slate-400 space-y-1">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {psycho.votes} votes
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {psycho.comments} comments
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(psycho.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                      <div className="flex gap-3">
                        <Button size="sm" variant="outline">
                          Lire la suite
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Commenter
                        </Button>
                      </div>
                      
                      {index === 0 && (
                        <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                          🏆 Psychographie de la Semaine
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Encouragement à participer */}
            <Card className="border-emerald-800 bg-emerald-950/20 mt-8">
              <CardContent className="p-6 text-center">
                <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-emerald-200 mb-2">
                  Votre prochaine création pourrait être ici !
                </h3>
                <p className="text-emerald-100 mb-4">
                  Partagez vos psychographies et laissez la communauté découvrir votre talent créatif.
                </p>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Créer une Psychographie
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="public" className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-400" />
                Forum des Psychographies
              </h2>
              
              {/* Filtres et tri */}
              <div className="flex items-center gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32 bg-slate-900/50 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="votes">Plus votées</SelectItem>
                    <SelectItem value="recent">Plus récentes</SelectItem>
                    <SelectItem value="comments">Plus commentées</SelectItem>
                    <SelectItem value="score">Mieux notées</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-28 bg-slate-900/50 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Aujourd'hui</SelectItem>
                    <SelectItem value="week">Cette semaine</SelectItem>
                    <SelectItem value="month">Ce mois</SelectItem>
                    <SelectItem value="all">Tout</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  Tendances
                </Button>
              </div>
            </div>

            {/* Statistiques du forum */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="border-slate-800 bg-slate-950/30 p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">
                  {mockTrendingTags.reduce((sum, tag) => sum + tag.count, 0)}
                </div>
                <div className="text-xs text-slate-500">Psychographies</div>
              </Card>
              <Card className="border-slate-800 bg-slate-950/30 p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">847</div>
                <div className="text-xs text-slate-500">Votes aujourd'hui</div>
              </Card>
              <Card className="border-slate-800 bg-slate-950/30 p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">234</div>
                <div className="text-xs text-slate-500">Commentaires</div>
              </Card>
              <Card className="border-slate-800 bg-slate-950/30 p-4 text-center">
                <div className="text-2xl font-bold text-orange-400">156</div>
                <div className="text-xs text-slate-500">Créateurs actifs</div>
              </Card>
            </div>

            {publicLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="border-slate-800 bg-slate-950/50 animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-32 bg-slate-800 rounded mb-4"></div>
                      <div className="h-4 bg-slate-800 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Library className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-400 mb-2">
                  Bientôt disponible
                </h3>
                <p className="text-slate-500">
                  Les psychographies publiques apparaîtront ici une fois que les utilisateurs commenceront à partager leurs créations.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="private" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                Ma Collection Personnelle
              </h2>
              <Button variant="outline" size="sm">
                Organiser
              </Button>
            </div>

            <div className="text-center py-12">
              <Lock className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-400 mb-2">
                Votre collection privée
              </h3>
              <p className="text-slate-500 mb-4">
                Vos psychographies personnelles seront sauvegardées ici automatiquement
              </p>
              <Button variant="outline">
                Créer votre première psychographie
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Section de consentement pour publication */}
        <Card className="mt-8 border-amber-800 bg-amber-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-200">
              <Globe className="w-5 h-5" />
              Partage Communautaire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-100 mb-4">
              Enrichissez la psychothèque publique en partageant vos créations. 
              Vous gardez le contrôle total sur ce que vous souhaitez partager.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="border-amber-600 text-amber-200 hover:bg-amber-900/50">
                Voir les conditions de partage
              </Button>
              <Button className="bg-amber-600 hover:bg-amber-700">
                Activer le partage public
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}