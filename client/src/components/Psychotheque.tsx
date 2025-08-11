import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Heart, 
  Star, 
  MessageCircle, 
  Download, 
  Eye, 
  EyeOff,
  Filter,
  Search,
  ShoppingCart,
  Package,
  Calendar,
  User,
  Tag,
  Trash2,
  Plus,
  Loader2
} from 'lucide-react';
import { clsx } from 'clsx';
import { apiRequest } from '@/lib/queryClient';

interface PsychographyWithDetails {
  id: number;
  title: string;
  initialText: string;
  finalPrompt: string;
  generatedText: string;
  imageUrl?: string;
  guide: string;
  tags: string[];
  isPublic: boolean;
  votesCount: number;
  averageRating: number;
  downloadsCount: number;
  createdAt: string;
  user: {
    username: string;
  };
  userVote?: {
    rating: number;
  };
  comments: Array<{
    id: number;
    content: string;
    createdAt: string;
    user: {
      username: string;
    };
  }>;
}

interface PsychothequeProps {
  showPrivate?: boolean;
}

export const Psychotheque: React.FC<PsychothequeProps> = ({ showPrivate = false }) => {
  const [filter, setFilter] = useState<'all' | 'popular' | 'recent' | 'my'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'rating'>('recent');
  const queryClient = useQueryClient();

  // Fetch psychographies
  const { data: psychographies = [], isLoading } = useQuery({
    queryKey: ['/api/psychography/gallery', { showPrivate, filter, sortBy }],
    queryFn: () => apiRequest(`/api/psychography/gallery?private=${showPrivate}&filter=${filter}&sort=${sortBy}`),
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: ({ psychographyId, rating }: { psychographyId: number; rating: number }) =>
      apiRequest(`/api/psychography/${psychographyId}/vote`, {
        method: 'POST',
        body: { rating }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/psychography/gallery'] });
    }
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: ({ psychographyId, content }: { psychographyId: number; content: string }) =>
      apiRequest(`/api/psychography/${psychographyId}/comment`, {
        method: 'POST',
        body: { content }
      }),
    onSuccess: (_, { psychographyId }) => {
      setNewComment(prev => ({ ...prev, [psychographyId]: '' }));
      queryClient.invalidateQueries({ queryKey: ['/api/psychography/gallery'] });
    }
  });

  // Download pack mutation
  const downloadPackMutation = useMutation({
    mutationFn: (psychographyIds: number[]) =>
      apiRequest('/api/psychography/download-pack', {
        method: 'POST',
        body: { psychographyIds }
      }),
    onSuccess: (data) => {
      // Trigger download
      window.open(data.downloadUrl, '_blank');
      setSelectedIds(new Set());
    }
  });

  // Visibility toggle mutation
  const visibilityMutation = useMutation({
    mutationFn: ({ id, isPublic }: { id: number; isPublic: boolean }) =>
      apiRequest(`/api/psychography/${id}/visibility`, {
        method: 'PATCH',
        body: { isPublic }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/psychography/gallery'] });
    }
  });

  const handleVote = (psychographyId: number, rating: number) => {
    voteMutation.mutate({ psychographyId, rating });
  };

  const handleComment = (psychographyId: number) => {
    const content = newComment[psychographyId]?.trim();
    if (content) {
      commentMutation.mutate({ psychographyId, content });
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredPsychographies.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredPsychographies.map(p => p.id)));
    }
  };

  const handleDownloadPack = () => {
    if (selectedIds.size > 0) {
      downloadPackMutation.mutate(Array.from(selectedIds));
    }
  };

  // Filter psychographies
  const filteredPsychographies = psychographies.filter((psycho: PsychographyWithDetails) => {
    const matchesSearch = !searchTerm || 
      psycho.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      psycho.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  const StarRating = ({ rating, onRate, currentUserRating }: { 
    rating: number; 
    onRate?: (rating: number) => void;
    currentUserRating?: number;
  }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={clsx(
            "w-4 h-4 cursor-pointer transition-colors",
            star <= (currentUserRating || rating) 
              ? "fill-yellow-400 text-yellow-400" 
              : "text-slate-400 hover:text-yellow-300"
          )}
          onClick={() => onRate?.(star)}
        />
      ))}
      <span className="text-sm text-slate-400 ml-1">
        ({Math.round(rating * 10) / 10})
      </span>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {showPrivate ? 'Ma Psychothèque' : 'Psychothèque Publique'}
        </h1>
        <p className="text-slate-400">
          {showPrivate 
            ? 'Gérez vos créations et découvrez les psychographies de la communauté'
            : 'Explorez les créations de la communauté, votez et commentez'
          }
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="border-slate-700 bg-slate-950/50">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 bg-slate-900/50 border-slate-700"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 bg-slate-900/50 border border-slate-700 rounded text-slate-200 text-sm"
                >
                  <option value="recent">Plus récent</option>
                  <option value="popular">Plus populaire</option>
                  <option value="rating">Mieux noté</option>
                </select>
              </div>
            </div>

            {selectedIds.size > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-blue-400 border-blue-600"
                >
                  <Package className="w-4 h-4 mr-2" />
                  {selectedIds.size === filteredPsychographies.length ? 'Désélectionner' : 'Tout sélectionner'}
                </Button>
                <Button
                  onClick={handleDownloadPack}
                  disabled={downloadPackMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {downloadPackMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Télécharger Pack ({selectedIds.size})
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Psychographies Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPsychographies.map((psycho: PsychographyWithDetails) => (
            <Card 
              key={psycho.id} 
              className={clsx(
                "border-slate-700 bg-slate-950/50 transition-all duration-300 hover:scale-[1.02]",
                selectedIds.has(psycho.id) && "ring-2 ring-blue-500"
              )}
            >
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-white line-clamp-2">
                      {psycho.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2 text-sm text-slate-400">
                      <User className="w-3 h-3" />
                      <span>{psycho.user.username}</span>
                      <Calendar className="w-3 h-3 ml-2" />
                      <span>{new Date(psycho.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {showPrivate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => visibilityMutation.mutate({ 
                          id: psycho.id, 
                          isPublic: !psycho.isPublic 
                        })}
                      >
                        {psycho.isPublic ? (
                          <Eye className="w-4 h-4 text-green-400" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-slate-400" />
                        )}
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (selectedIds.has(psycho.id)) {
                          setSelectedIds(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(psycho.id);
                            return newSet;
                          });
                        } else {
                          setSelectedIds(prev => new Set([...prev, psycho.id]));
                        }
                      }}
                    >
                      <ShoppingCart className={clsx(
                        "w-4 h-4",
                        selectedIds.has(psycho.id) ? "text-blue-400" : "text-slate-400"
                      )} />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Excerpt */}
                <p className="text-slate-300 text-sm line-clamp-3">
                  {psycho.generatedText.substring(0, 150)}...
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {psycho.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs text-blue-400 border-blue-600">
                      {tag}
                    </Badge>
                  ))}
                  {psycho.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs text-slate-400">
                      +{psycho.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <Separator className="bg-slate-700" />

                {/* Stats and Actions */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <StarRating 
                      rating={psycho.averageRating} 
                      currentUserRating={psycho.userVote?.rating}
                      onRate={(rating) => handleVote(psycho.id, rating)}
                    />
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {psycho.downloadsCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {psycho.comments.length}
                      </span>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {psycho.comments.length > 0 && (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {psycho.comments.slice(0, 2).map((comment) => (
                        <div key={comment.id} className="text-xs bg-slate-900/30 p-2 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-slate-300">{comment.user.username}</span>
                            <span className="text-slate-500">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-slate-400">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ajouter un commentaire..."
                      value={newComment[psycho.id] || ''}
                      onChange={(e) => setNewComment(prev => ({ 
                        ...prev, 
                        [psycho.id]: e.target.value 
                      }))}
                      className="flex-1 bg-slate-900/50 border-slate-700 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleComment(psycho.id);
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleComment(psycho.id)}
                      disabled={!newComment[psycho.id]?.trim() || commentMutation.isPending}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* View Details Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full text-sm">
                      Voir en détail
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-950 border-slate-700">
                    <DialogHeader>
                      <DialogTitle className="text-xl text-white">{psycho.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-slate-200 mb-2">Texte Initial</h4>
                            <p className="text-slate-300 text-sm bg-slate-900/30 p-3 rounded">
                              {psycho.initialText}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-200 mb-2">Prompt Final</h4>
                            <p className="text-slate-300 text-xs bg-slate-900/30 p-3 rounded font-mono">
                              {psycho.finalPrompt}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-slate-200 mb-2">Texte Créatif Généré</h4>
                            <p className="text-slate-300 text-sm bg-slate-900/30 p-3 rounded whitespace-pre-line">
                              {psycho.generatedText}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-200 mb-2">Guide d'Accompagnement</h4>
                            <p className="text-slate-300 text-sm bg-slate-900/30 p-3 rounded whitespace-pre-line">
                              {psycho.guide}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredPsychographies.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">Aucune psychographie trouvée</p>
        </div>
      )}
    </div>
  );
};