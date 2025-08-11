import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Tag, Search, BarChart3, Network } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Psychography } from '@shared/schema';

// Component pour le réseau de tags (Psychocatcher)
const TagNetworkViz = ({ psychographies }: { psychographies: Psychography[] }) => {
  const [tagStats, setTagStats] = useState<Record<string, { count: number; cooccurrences: Record<string, number> }>>({});

  useEffect(() => {
    const stats: Record<string, { count: number; cooccurrences: Record<string, number> }> = {};
    
    psychographies.forEach(psycho => {
      const tags = psycho.tags || [];
      tags.forEach(tag => {
        if (!stats[tag]) {
          stats[tag] = { count: 0, cooccurrences: {} };
        }
        stats[tag].count++;
        
        // Calculer les co-occurrences
        tags.forEach(otherTag => {
          if (tag !== otherTag) {
            if (!stats[tag].cooccurrences[otherTag]) {
              stats[tag].cooccurrences[otherTag] = 0;
            }
            stats[tag].cooccurrences[otherTag]++;
          }
        });
      });
    });
    
    setTagStats(stats);
  }, [psychographies]);

  const topTags = Object.entries(tagStats)
    .sort(([,a], [,b]) => b.count - a.count)
    .slice(0, 20);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-200 mb-2 flex items-center justify-center gap-2">
          <Network className="w-5 h-5 text-blue-400" />
          Psychocatcher - Réseau de Tags
        </h3>
        <p className="text-slate-400 text-sm">
          Visualisation de vos thèmes créatifs et leurs interconnexions
        </p>
      </div>

      {/* Réseau de tags principal */}
      <div className="relative bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
        <div className="grid gap-4">
          {/* Tags principaux avec taille proportionnelle */}
          <div className="flex flex-wrap gap-2 justify-center">
            {topTags.slice(0, 8).map(([tag, stats]) => {
              const intensity = Math.min(stats.count / Math.max(...topTags.map(([,s]) => s.count)), 1);
              return (
                <Badge 
                  key={tag}
                  variant="secondary"
                  className="relative"
                  style={{
                    fontSize: `${0.8 + intensity * 0.4}rem`,
                    backgroundColor: `rgba(59, 130, 246, ${0.2 + intensity * 0.3})`,
                    borderColor: `rgba(59, 130, 246, ${0.4 + intensity * 0.4})`,
                    color: `rgba(147, 197, 253, ${0.8 + intensity * 0.2})`
                  }}
                >
                  {tag}
                  <span className="ml-1 text-xs opacity-70">({stats.count})</span>
                </Badge>
              );
            })}
          </div>

          {/* Connexions visuelles simplifiées */}
          <div className="text-center text-slate-500 text-sm">
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-2 h-0.5 bg-blue-400/30 rounded"></div>
              ))}
            </div>
            Connexions thématiques détectées
          </div>
        </div>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-slate-700/50 bg-slate-900/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              Top Tags
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topTags.slice(0, 6).map(([tag, stats]) => (
              <div key={tag} className="flex items-center justify-between">
                <Badge variant="outline" className="text-slate-300">
                  {tag}
                </Badge>
                <span className="text-sm text-slate-400">
                  {stats.count} fois
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-700/50 bg-slate-900/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
              <Network className="w-4 h-4 text-purple-400" />
              Associations Fortes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topTags.slice(0, 3).map(([tag, stats]) => {
              const topAssociation = Object.entries(stats.cooccurrences)
                .sort(([,a], [,b]) => b - a)[0];
              
              if (!topAssociation) return null;
              
              return (
                <div key={tag} className="text-sm">
                  <span className="text-slate-300">{tag}</span>
                  <span className="text-slate-500 mx-2">↔</span>
                  <span className="text-slate-300">{topAssociation[0]}</span>
                  <span className="text-slate-400 ml-2">({topAssociation[1]}×)</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function MesPsychographies() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [filterTag, setFilterTag] = useState<string>('all');

  const { data: psychographies = [], isLoading } = useQuery<Psychography[]>({
    queryKey: ['/api/psychographies/my'],
    enabled: !!user
  });

  // Extraction des tags uniques pour le filtre
  const allTags = Array.from(
    new Set(
      psychographies.flatMap(p => p.tags || [])
    )
  ).sort();

  // Filtrage et tri
  const filteredPsychographies = psychographies
    .filter(p => {
      const matchesSearch = !searchTerm || 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.generatedText.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = !filterTag || filterTag === 'all' || (p.tags || []).includes(filterTag);
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return a.title.localeCompare(b.title);
    });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-16">
            <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-400">Chargement de vos créations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent mb-4">
            Mes Psychographies
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Votre univers créatif personnel • {psychographies.length} création{psychographies.length > 1 ? 's' : ''}
          </p>
        </div>

        <Tabs defaultValue="chronologie" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="chronologie" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Chronologie
            </TabsTrigger>
            <TabsTrigger value="psychocatcher" className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              Psychocatcher
            </TabsTrigger>
          </TabsList>

          {/* Onglet Chronologie */}
          <TabsContent value="chronologie" className="space-y-6">
            {/* Filtres et recherche */}
            <div className="flex flex-wrap gap-4 items-center justify-between bg-slate-900/30 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher dans vos créations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-600"
                  />
                </div>
                
                <Select value={filterTag} onValueChange={setFilterTag}>
                  <SelectTrigger className="w-48 bg-slate-800 border-slate-600">
                    <SelectValue placeholder="Filtrer par tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les tags</SelectItem>
                    {allTags.map(tag => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Select value={sortBy} onValueChange={(value: 'date' | 'title') => setSortBy(value)}>
                <SelectTrigger className="w-40 bg-slate-800 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Par date</SelectItem>
                  <SelectItem value="title">Par titre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Liste des psychographies */}
            {filteredPsychographies.length === 0 ? (
              <Card className="border-slate-700/50 bg-slate-900/30">
                <CardContent className="text-center py-12">
                  <Calendar className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-300 mb-2">
                    {searchTerm || filterTag ? 'Aucun résultat' : 'Aucune création pour le moment'}
                  </h3>
                  <p className="text-slate-400">
                    {searchTerm || filterTag 
                      ? 'Essayez de modifier vos critères de recherche.' 
                      : 'Créez votre première psychographie dans le Studio Psychographique.'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredPsychographies.map((psycho) => (
                  <Card key={psycho.id} className="border-slate-700/50 bg-slate-900/20 hover:bg-slate-900/40 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-slate-200 text-lg truncate">
                              {psycho.title}
                            </h3>
                            <div className="flex items-center text-slate-400 text-sm gap-1">
                              <Clock className="w-3 h-3" />
                              {format(new Date(psycho.createdAt), 'dd MMM yyyy à HH:mm', { locale: fr })}
                            </div>
                          </div>
                          
                          <p className="text-slate-300 mb-4 leading-relaxed line-clamp-3">
                            {psycho.generatedText}
                          </p>
                          
                          {psycho.tags && psycho.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {psycho.tags.map((tag, index) => (
                                <Badge 
                                  key={index}
                                  variant="secondary"
                                  className="bg-blue-600/20 text-blue-300 border-blue-600/30"
                                >
                                  <Tag className="w-3 h-3 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Onglet Psychocatcher */}
          <TabsContent value="psychocatcher" className="space-y-6">
            {psychographies.length === 0 ? (
              <Card className="border-slate-700/50 bg-slate-900/30">
                <CardContent className="text-center py-12">
                  <Network className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-300 mb-2">
                    Aucune donnée pour le réseau de tags
                  </h3>
                  <p className="text-slate-400">
                    Créez quelques psychographies pour voir apparaître vos patterns créatifs.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <TagNetworkViz psychographies={psychographies} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}