import { useState } from 'react';
import { SessionResult, PsychographyVote, PsychographyTag } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Heart, MessageCircle, Share2, Star, Tag, Calendar, User } from 'lucide-react';
import { AnimatedBadge } from './ui/animated-badge';

interface PsychographyCardProps {
  psychography: SessionResult & {
    session?: {
      user?: { username: string };
      format: string;
      style: string;
    };
    votes?: PsychographyVote[];
    tags?: PsychographyTag[];
  };
  onVote?: (dimension: string, score: number, comment?: string) => void;
  onAddTag?: (tag: string) => void;
  showVoting?: boolean;
  compact?: boolean;
}

export const PsychographyCard = ({
  psychography,
  onVote,
  onAddTag,
  showVoting = false,
  compact = false
}: PsychographyCardProps) => {
  const [selectedDimension, setSelectedDimension] = useState<string>('');
  const [comment, setComment] = useState('');
  const [newTag, setNewTag] = useState('');

  const dimensions = [
    { key: 'creativite', label: 'Créativité', icon: '✨' },
    { key: 'poetique', label: 'Poétique', icon: '🎭' },
    { key: 'coherence', label: 'Cohérence', icon: '🧩' },
    { key: 'profondeur', label: 'Profondeur', icon: '🌊' },
    { key: 'emotion', label: 'Émotion', icon: '💫' },
    { key: 'technique', label: 'Technique', icon: '🎯' }
  ];

  const averageVotes = dimensions.map(dim => {
    const votes = psychography.votes?.filter(v => v.dimension === dim.key) || [];
    const avg = votes.length > 0 ? votes.reduce((sum, v) => sum + v.score, 0) / votes.length : 0;
    return { dimension: dim, average: avg, count: votes.length };
  });

  const handleVote = (dimension: string, score: number) => {
    if (onVote) {
      onVote(dimension, score, comment.trim() || undefined);
      setComment('');
      setSelectedDimension('');
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && onAddTag) {
      onAddTag(newTag.trim());
      setNewTag('');
    }
  };

  return (
    <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-slate-400" />
            <div>
              <p className="font-medium text-slate-200">
                {psychography.session?.user?.username || 'Anonyme'}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="w-3 h-3" />
                {new Date(psychography.createdAt).toLocaleDateString('fr-FR')}
                <Badge variant="outline" className="ml-2 text-xs">
                  {psychography.session?.format} - {psychography.session?.style}
                </Badge>
              </div>
            </div>
          </div>
          
          {psychography.isPublished && (
            <Badge className="bg-green-900/50 text-green-300 border-green-700">
              Psychothèque Publique
            </Badge>
          )}
        </div>

        {/* Badges obtenus */}
        {psychography.badges && (psychography.badges as any[]).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {(psychography.badges as any[]).map((badge, index) => (
              <AnimatedBadge 
                key={index} 
                badge={badge} 
                size="sm" 
                showTitle={false}
                className="opacity-90"
              />
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Texte généré */}
        <div className="prose prose-slate prose-invert max-w-none">
          <div className="text-slate-200 leading-relaxed whitespace-pre-wrap">
            {psychography.generatedText}
          </div>
        </div>

        {/* Guide d'animation */}
        {!compact && psychography.animationGuide && (
          <div className="bg-slate-900/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              🎬 Guide d'Animation
            </h4>
            <div className="text-xs text-slate-400 space-y-1">
              {(psychography.animationGuide as string[]).map((guide, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-slate-600 min-w-[1.5rem]">{index + 1}.</span>
                  <span>{guide}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {psychography.tags && psychography.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {psychography.tags.map((tag, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className={`text-xs ${
                  tag.source === 'ai' ? 'border-blue-700 text-blue-300' :
                  tag.source === 'community' ? 'border-green-700 text-green-300' :
                  'border-orange-700 text-orange-300'
                }`}
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag.tag}
                {tag.confidence && tag.source === 'ai' && (
                  <span className="ml-1 opacity-75">({tag.confidence}%)</span>
                )}
              </Badge>
            ))}
          </div>
        )}

        {/* Scores et votes */}
        {!compact && averageVotes.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {averageVotes.map(({ dimension, average, count }) => (
              <div key={dimension.key} className="bg-slate-900/30 rounded-lg p-3 text-center">
                <div className="text-lg mb-1">{dimension.icon}</div>
                <div className="text-xs text-slate-400 mb-1">{dimension.label}</div>
                <div className="flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3 h-3 ${
                        i < Math.round(average) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'
                      }`} 
                    />
                  ))}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {average > 0 ? average.toFixed(1) : '--'} ({count})
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Interface de vote */}
        {showVoting && (
          <div className="border-t border-slate-800 pt-4 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {dimensions.map(dim => (
                <Button
                  key={dim.key}
                  variant={selectedDimension === dim.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDimension(dim.key)}
                  className="text-xs"
                >
                  {dim.icon} {dim.label}
                </Button>
              ))}
            </div>

            {selectedDimension && (
              <div className="space-y-3">
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map(score => (
                    <Button
                      key={score}
                      variant="outline"
                      size="sm"
                      onClick={() => handleVote(selectedDimension, score)}
                      className="w-10 h-10 p-0"
                    >
                      {score}
                    </Button>
                  ))}
                </div>
                <Textarea
                  placeholder="Commentaire optionnel..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={2}
                  className="bg-slate-900/50 border-slate-700"
                />
              </div>
            )}
          </div>
        )}

        {/* Ajout de tags */}
        {onAddTag && (
          <div className="border-t border-slate-800 pt-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ajouter un tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-md text-sm text-slate-200 placeholder:text-slate-500"
              />
              <Button size="sm" onClick={handleAddTag} disabled={!newTag.trim()}>
                <Tag className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <button className="flex items-center gap-1 hover:text-slate-200 transition-colors">
              <Heart className="w-4 h-4" />
              <span>{psychography.votes?.length || 0}</span>
            </button>
            <button className="flex items-center gap-1 hover:text-slate-200 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>{psychography.votes?.filter(v => v.comment).length || 0}</span>
            </button>
          </div>
          
          <Button variant="ghost" size="sm">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};