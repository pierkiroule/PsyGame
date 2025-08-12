import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Calendar,
  Download,
  Eye,
  EyeOff,
  Trash2,
  Search,
  Filter,
  Edit
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '@/contexts/AuthContext';

type PersonalPsychography = {
  id: number;
  title: string;
  initialPrompt: string;
  enrichedPrompt: string;
  finalText: string;
  sensoryGuide: string;
  metaphor: string;
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  authorPseudo: string;
  imageUrl?: string;
};

export default function MyPsychographiesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Chargement des psychographies personnelles
  const { data: psychographies = [], isLoading } = useQuery({
    queryKey: ['/api/psychographies/my'],
    queryFn: async () => {
      const response = await fetch('/api/psychographies/my');
      if (!response.ok) throw new Error('Erreur de chargement');
      return response.json();
    }
  });

  // Actions
  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, isPublic }: { id: number; isPublic: boolean }) => {
      const response = await fetch(`/api/psychography/${id}/visibility`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/psychographies/my'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/psychography/${id}`, {
        method: 'DELETE'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/psychographies/my'] });
      setSelectedIds(prev => prev.filter(id => !selectedIds.includes(id)));
    }
  });

  // Filtrage
  const filteredPsychographies = psychographies.filter((psycho: PersonalPsychography) => {
    const matchesSearch = searchTerm === '' || 
      psycho.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      psycho.finalText.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = filterTag === '' || psycho.tags.includes(filterTag);
    
    return matchesSearch && matchesTag;
  });

  // Tags uniques
  const allTags = [...new Set(psychographies.flatMap((p: PersonalPsychography) => p.tags))];

  const handleSelectPsychography = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleExportSelected = () => {
    if (selectedIds.length === 0) return;
    
    const exportData = psychographies
      .filter((p: PersonalPsychography) => selectedIds.includes(p.id))
      .map(p => ({
        title: p.title,
        date: new Date(p.createdAt).toLocaleDateString('fr-FR'),
        initialPrompt: p.initialPrompt,
        enrichedPrompt: p.enrichedPrompt,
        finalText: p.finalText,
        sensoryGuide: p.sensoryGuide,
        metaphor: p.metaphor,
        tags: p.tags.join(', ')
      }));

    const content = exportData.map(p => `
# ${p.title}
**Date:** ${p.date}
**Tags:** ${p.tags}

## Prompt Initial
${p.initialPrompt}

## Prompt Enrichi
${p.enrichedPrompt}

## Texte Inspirant
${p.finalText}

## Guide Résonant
${p.sensoryGuide}

## Métaphore Existentielle
${p.metaphor}

---
`).join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mes-psychographies-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-2 text-slate-400">Chargement de vos créations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Mes Créations</h1>
        <p className="text-slate-400">Gérez vos psychographies personnelles</p>
      </div>

      {/* Contrôles */}
      <Card className="bg-slate-900/50 border-slate-700 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Rechercher dans vos créations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-600"
                />
              </div>
            </div>
            
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-slate-100"
            >
              <option value="">Tous les tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>

            {selectedIds.length > 0 && (
              <div className="flex gap-2">
                <Button
                  onClick={handleExportSelected}
                  size="sm"
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exporter ({selectedIds.length})
                </Button>
                <Button
                  onClick={() => setSelectedIds([])}
                  size="sm"
                  variant="ghost"
                >
                  Désélectionner
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Grille des psychographies */}
      {filteredPsychographies.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-8 text-center">
            <p className="text-slate-400 mb-4">
              {searchTerm || filterTag ? 'Aucune psychographie ne correspond aux critères' : 'Aucune psychographie créée'}
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Créer ma première psychographie
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPsychographies.map((psycho: PersonalPsychography) => (
            <Card 
              key={psycho.id} 
              className={clsx(
                "bg-slate-900/50 border-slate-700 hover:border-slate-600 transition-all cursor-pointer",
                selectedIds.includes(psycho.id) && "border-blue-500 bg-blue-500/10"
              )}
              onClick={() => handleSelectPsychography(psycho.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-slate-100 text-lg font-medium line-clamp-2">
                    {psycho.title}
                  </CardTitle>
                  <div className="flex items-center gap-1 ml-2">
                    {psycho.isPublic ? (
                      <Eye className="w-4 h-4 text-green-400" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(psycho.createdAt).toLocaleDateString('fr-FR')}</span>
                  <span>•</span>
                  <span>{psycho.isPublic ? 'Public' : 'Privé'}</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Aperçu du contenu */}
                <div className="space-y-2">
                  <p className="text-slate-300 text-sm line-clamp-2">
                    <strong>Inspiration:</strong> {psycho.initialPrompt?.substring(0, 100)}...
                  </p>
                  <p className="text-slate-300 text-sm line-clamp-3">
                    {psycho.finalText?.substring(0, 150)}...
                  </p>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {psycho.tags?.slice(0, 3).map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {psycho.tags?.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{psycho.tags.length - 3}
                    </Badge>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVisibilityMutation.mutate({
                          id: psycho.id,
                          isPublic: !psycho.isPublic
                        });
                      }}
                      className="text-slate-400 hover:text-slate-300"
                    >
                      {psycho.isPublic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/api/psychography/${psycho.id}/export`);
                      }}
                      className="text-slate-400 hover:text-slate-300"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Supprimer cette psychographie ?')) {
                        deleteMutation.mutate(psycho.id);
                      }
                    }}
                    className="text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}