import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PsychographyCard } from '@/components/PsychographyCard';
import { Library, Search, Filter, Globe, Lock, Sparkles, TrendingUp } from 'lucide-react';

export default function Psychotheque() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('public');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Simuler des données pour le prototype
  const { data: publicPsychographies, isLoading: publicLoading } = useQuery({
    queryKey: ['/api/psychotheque/public', searchTerm],
    enabled: activeTab === 'public',
  });

  const { data: privatePsychographies, isLoading: privateLoading } = useQuery({
    queryKey: ['/api/psychotheque/private'],
    enabled: activeTab === 'private',
  });

  const { data: trendingTags } = useQuery({
    queryKey: ['/api/psychotheque/trending-tags'],
  });

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

        {/* Onglets Public/Privé */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="public" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Psychothèque Publique
            </TabsTrigger>
            <TabsTrigger value="private" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Ma Collection Privée
            </TabsTrigger>
          </TabsList>

          <TabsContent value="public" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                Créations Communautaires
              </h2>
              <div className="text-sm text-slate-400">
                {mockTrendingTags.reduce((sum, tag) => sum + tag.count, 0)} psychographies partagées
              </div>
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