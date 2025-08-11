import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Heart, 
  Search, 
  Calendar,
  User,
  Download,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { clsx } from 'clsx';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/contexts/AuthContext';
// Types simplifiés pour la version minimaliste
type Psychography = {
  id: number;
  title: string;
  content: string;
  tags: string[];
  isPublic: boolean;
  likesCount: number;
  createdAt: string;
  userId: number;
};

type PsychographyWithDetails = Psychography & {
  username: string;
  isLiked?: boolean;
};

interface MinimalGalleryProps {
  mode: 'personal' | 'public';
}

export const MinimalGallery: React.FC<MinimalGalleryProps> = ({ mode }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Données selon le mode
  const { data: psychographies = [], isLoading } = useQuery<
    mode extends 'personal' ? Psychography[] : PsychographyWithDetails[]
  >({
    queryKey: mode === 'personal' ? ['/api/psychographies/my'] : ['/api/psychographies/public'],
    enabled: !!user
  });

  // Mutation pour toggle like
  const likeMutation = useMutation({
    mutationFn: async (psychographyId: number) => {
      return apiRequest(`/api/psychographies/${psychographyId}/like`, {
        method: 'POST',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/psychographies/public'] });
    },
  });

  // Mutation pour changer visibilité
  const visibilityMutation = useMutation({
    mutationFn: async ({ id, isPublic }: { id: number; isPublic: boolean }) => {
      return apiRequest(`/api/psychographies/${id}/visibility`, {
        method: 'PATCH',
        body: { isPublic },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/psychographies/my'] });
    },
  });

  // Mutation pour supprimer
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/psychographies/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/psychographies/my'] });
    },
  });

  // Mutation pour export PDF
  const exportMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/psychographies/${id}/export`, {
        method: 'GET',
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `psychographie-${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
  });

  // Filtrage simple
  const filteredPsychographies = psychographies.filter((psycho) => {
    if (!searchTerm) return true;
    return psycho.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           psycho.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
           psycho.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const PsychographyCard = ({ psycho }: { psycho: any }) => (
    <Card className="bg-slate-900 border-slate-700 hover:border-slate-600 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-slate-100 text-lg font-medium line-clamp-2">
            {psycho.title}
          </CardTitle>
          {mode === 'public' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => likeMutation.mutate(psycho.id)}
              disabled={likeMutation.isPending}
              className={clsx(
                "flex items-center gap-1 min-w-0",
                (psycho as PsychographyWithDetails).isLiked 
                  ? "text-red-400 hover:text-red-300" 
                  : "text-slate-400 hover:text-slate-300"
              )}
            >
              <Heart 
                className={clsx(
                  "w-4 h-4",
                  (psycho as PsychographyWithDetails).isLiked && "fill-current"
                )} 
              />
              <span className="text-sm">{psycho.likesCount}</span>
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-slate-400">
          {mode === 'public' && (
            <>
              <User className="w-3 h-3" />
              <span>{(psycho as PsychographyWithDetails).username}</span>
              <span>•</span>
            </>
          )}
          <Calendar className="w-3 h-3" />
          <span>{new Date(psycho.createdAt).toLocaleDateString('fr-FR')}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-slate-300 text-sm line-clamp-3 leading-relaxed">
          {psycho.content.substring(0, 150)}...
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {psycho.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        {/* Actions */}
        {mode === 'personal' && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-700">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => visibilityMutation.mutate({
                  id: psycho.id,
                  isPublic: !psycho.isPublic
                })}
                disabled={visibilityMutation.isPending}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-300"
              >
                {psycho.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span className="text-xs">
                  {psycho.isPublic ? 'Public' : 'Privé'}
                </span>
              </Button>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => exportMutation.mutate(psycho.id)}
                disabled={exportMutation.isPending}
                className="text-slate-400 hover:text-slate-300"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteMutation.mutate(psycho.id)}
                disabled={deleteMutation.isPending}
                className="text-slate-400 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-slate-900 border-slate-700">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-700 rounded"></div>
                    <div className="h-3 bg-slate-700 rounded w-5/6"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* En-tête */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {mode === 'personal' ? 'Mes Créations' : 'Découvrir'}
        </h1>
        <p className="text-slate-400">
          {mode === 'personal' 
            ? 'Vos psychographies personnelles'
            : 'Les créations partagées par la communauté'
          }
        </p>
      </div>

      {/* Recherche simple */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-slate-800 border-slate-600 text-slate-100"
        />
      </div>

      {/* Statistiques simples */}
      <div className="text-center">
        <Badge variant="outline" className="text-slate-400">
          {filteredPsychographies.length} psychographie{filteredPsychographies.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Grille de cartes */}
      {filteredPsychographies.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-slate-400 text-lg mb-2">
            {mode === 'personal' ? 'Aucune création pour le moment' : 'Aucune psychographie trouvée'}
          </div>
          <div className="text-slate-500 text-sm">
            {mode === 'personal' 
              ? 'Commencez par créer votre première psychographie'
              : 'Affinez votre recherche ou revenez plus tard'
            }
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredPsychographies.map((psycho) => (
            <PsychographyCard key={psycho.id} psycho={psycho} />
          ))}
        </div>
      )}
    </div>
  );
};