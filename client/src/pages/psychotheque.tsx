import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Heart,
  MessageCircle,
  Search,
  Calendar,
  User,
  Star,
  Filter,
  TrendingUp,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '@/contexts/AuthContext';

type PublicPsychography = {
  id: number;
  title: string;
  initialPrompt: string;
  enrichedPrompt: string;
  finalText: string;
  sensoryGuide: string;
  metaphor: string;
  tags: string[];
  authorPseudo: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  averageRating: number;
  imageUrl?: string;
  isLiked?: boolean;
  userRating?: number;
};

type Comment = {
  id: number;
  content: string;
  authorPseudo: string;
  createdAt: string;
};

export default function PsychothequeePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'rated'>('recent');
  const [selectedPsycho, setSelectedPsycho] = useState<PublicPsychography | null>(null);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);

  // Chargement des psychographies publiques
  const { data: psychographies = [], isLoading } = useQuery({
    queryKey: ['/api/psychographies/public', sortBy],
    queryFn: async () => {
      const response = await fetch(`/api/psychographies/public?sort=${sortBy}`);
      if (!response.ok) throw new Error('Erreur de chargement');
      return response.json();
    }
  });

  // Commentaires de la psychographie sélectionnée
  const { data: comments = [] } = useQuery({
    queryKey: ['/api/psychographies/comments', selectedPsycho?.id],
    queryFn: async () => {
      if (!selectedPsycho) return [];
      const response = await fetch(`/api/psychography/${selectedPsycho.id}/comments`);
      return response.json();
    },
    enabled: !!selectedPsycho
  });

  // Mutations
  const likeMutation = useMutation({
    mutationFn: async (psychographyId: number) => {
      const response = await fetch(`/api/psychography/${psychographyId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/psychographies/public'] });
    }
  });

  const rateMutation = useMutation({
    mutationFn: async ({ psychographyId, rating }: { psychographyId: number; rating: number }) => {
      const response = await fetch(`/api/psychography/${psychographyId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/psychographies/public'] });
      setUserRating(0);
    }
  });

  const commentMutation = useMutation({
    mutationFn: async ({ psychographyId, content }: { psychographyId: number; content: string }) => {
      const response = await fetch(`/api/psychography/${psychographyId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/psychographies/comments', selectedPsycho?.id] });
      setNewComment('');
    }
  });

  // Filtrage et tri
  const filteredPsychographies = psychographies
    .filter((psycho: PublicPsychography) => {
      const matchesSearch = searchTerm === '' || 
        psycho.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        psycho.finalText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        psycho.authorPseudo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTag = selectedTag === '' || psycho.tags.includes(selectedTag);
      
      return matchesSearch && matchesTag;
    });

  // Tags populaires
  const popularTags = [...new Set(psychographies.flatMap((p: PublicPsychography) => p.tags))]
    .slice(0, 10);

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={clsx(
              "w-4 h-4",
              star <= rating ? "text-yellow-400 fill-current" : "text-slate-400",
              interactive && "cursor-pointer hover:text-yellow-300"
            )}
            onClick={() => interactive && onRate?.(star)}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-2 text-slate-400">Chargement de la psychothèque...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Psychothèque Publique
        </h1>
        <p className="text-slate-400">Découvrez et partagez des créations psychographiques inspirantes</p>
      </div>

      {/* Contrôles */}
      <Card className="bg-slate-900/50 border-slate-700 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Rechercher par titre, contenu ou auteur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-600"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-slate-100"
              >
                <option value="recent">Plus récentes</option>
                <option value="popular">Plus aimées</option>
                <option value="rated">Mieux notées</option>
              </select>
            </div>
          </div>

          {/* Tags populaires */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTag === '' ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag('')}
            >
              Tous
            </Button>
            {popularTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grille Instagram-style */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPsychographies.map((psycho: PublicPsychography) => (
          <Card 
            key={psycho.id} 
            className="bg-slate-900/50 border-slate-700 hover:border-slate-600 transition-all overflow-hidden group cursor-pointer"
            onClick={() => setSelectedPsycho(psycho)}
          >
            {/* Image ou placeholder */}
            <div className="relative h-48 bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center">
              {psycho.imageUrl ? (
                <img 
                  src={psycho.imageUrl} 
                  alt={psycho.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <Sparkles className="w-12 h-12 text-blue-400/50 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">Psychographie</p>
                </div>
              )}
              
              {/* Overlay avec stats */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{psycho.likesCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{psycho.commentsCount}</span>
                    </div>
                  </div>
                  {renderStars(psycho.averageRating)}
                </div>
              </div>
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="text-slate-100 text-lg line-clamp-2">
                {psycho.title}
              </CardTitle>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3" />
                  <span>{psycho.authorPseudo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(psycho.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-slate-300 text-sm line-clamp-3 mb-3">
                {psycho.finalText?.substring(0, 150) || 'Aucun aperçu disponible'}...
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {psycho.tags.slice(0, 3).map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      likeMutation.mutate(psycho.id);
                    }}
                    className={clsx(
                      "flex items-center gap-1",
                      psycho.isLiked ? "text-red-400" : "text-slate-400"
                    )}
                  >
                    <Heart className={clsx("w-4 h-4", psycho.isLiked && "fill-current")} />
                    <span>{psycho.likesCount}</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-slate-400"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{psycho.commentsCount}</span>
                  </Button>
                </div>

                {renderStars(psycho.averageRating)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de détail */}
      {selectedPsycho && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <Card className="bg-slate-900 border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl text-slate-100 mb-2">
                    {selectedPsycho.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3" />
                      <span>{selectedPsycho.authorPseudo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(selectedPsycho.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedPsycho(null)}
                  className="text-slate-400"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Contenu principal */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-blue-400 mb-2">Inspiration Initiale</h3>
                  <p className="text-slate-300 bg-slate-800/50 p-3 rounded">
                    {selectedPsycho.initialPrompt}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-blue-400 mb-2">Texte Inspirant</h3>
                  <p className="text-slate-300 leading-relaxed">
                    {selectedPsycho.finalText}
                  </p>
                </div>

                {selectedPsycho.sensoryGuide && (
                  <div>
                    <h3 className="font-semibold text-blue-400 mb-2">Guide Résonant</h3>
                    <p className="text-slate-300 bg-slate-800/50 p-3 rounded">
                      {selectedPsycho.sensoryGuide}
                    </p>
                  </div>
                )}

                {selectedPsycho.metaphor && (
                  <div>
                    <h3 className="font-semibold text-blue-400 mb-2">Métaphore Existentielle</h3>
                    <p className="text-slate-300 bg-slate-800/50 p-3 rounded">
                      {selectedPsycho.metaphor}
                    </p>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {selectedPsycho.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between py-4 border-t border-slate-700">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    onClick={() => likeMutation.mutate(selectedPsycho.id)}
                    className={clsx(
                      "flex items-center gap-2",
                      selectedPsycho.isLiked ? "text-red-400" : "text-slate-400"
                    )}
                  >
                    <Heart className={clsx("w-5 h-5", selectedPsycho.isLiked && "fill-current")} />
                    <span>{selectedPsycho.likesCount}</span>
                  </Button>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">Noter:</span>
                    {renderStars(userRating || selectedPsycho.userRating || 0, true, (rating) => {
                      setUserRating(rating);
                      rateMutation.mutate({ psychographyId: selectedPsycho.id, rating });
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span>Moyenne:</span>
                  {renderStars(selectedPsycho.averageRating)}
                  <span>({selectedPsycho.averageRating.toFixed(1)})</span>
                </div>
              </div>

              {/* Commentaires */}
              <div className="space-y-4">
                <h3 className="font-semibold text-blue-400">Commentaires ({comments.length})</h3>
                
                {user && (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Partagez votre résonance avec cette création..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="bg-slate-800 border-slate-600"
                    />
                    <Button
                      onClick={() => commentMutation.mutate({
                        psychographyId: selectedPsycho.id,
                        content: newComment
                      })}
                      disabled={!newComment.trim() || commentMutation.isPending}
                      size="sm"
                    >
                      Commenter
                    </Button>
                  </div>
                )}

                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {comments.map((comment: Comment) => (
                    <div key={comment.id} className="bg-slate-800/50 p-3 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-300">{comment.authorPseudo}</span>
                        <span className="text-xs text-slate-400">
                          {new Date(comment.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}