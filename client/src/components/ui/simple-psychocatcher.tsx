import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Eye } from 'lucide-react';

interface SimplePsychocatcherProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function SimplePsychocatcher({ width = 800, height = 500, className = "" }: SimplePsychocatcherProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Données simulées simplifiées
  const communities = [
    {
      name: 'Psyché',
      color: '#3b82f6',
      tags: [
        { name: 'psyché', occurrences: 52, size: 'large' },
        { name: 'âme', occurrences: 31, size: 'medium' },
        { name: 'esprit', occurrences: 28, size: 'medium' },
        { name: 'conscience', occurrences: 24, size: 'small' }
      ]
    },
    {
      name: 'Nature',
      color: '#10b981',
      tags: [
        { name: 'nature', occurrences: 47, size: 'large' },
        { name: 'forêt', occurrences: 23, size: 'medium' },
        { name: 'océan', occurrences: 18, size: 'small' },
        { name: 'montagne', occurrences: 15, size: 'small' }
      ]
    },
    {
      name: 'Temporel',
      color: '#f59e0b',
      tags: [
        { name: 'temps', occurrences: 39, size: 'large' },
        { name: 'mémoire', occurrences: 33, size: 'medium' },
        { name: 'passé', occurrences: 26, size: 'medium' },
        { name: 'futur', occurrences: 21, size: 'small' }
      ]
    },
    {
      name: 'Émotions',
      color: '#ec4899',
      tags: [
        { name: 'amour', occurrences: 35, size: 'medium' },
        { name: 'mélancolie', occurrences: 29, size: 'medium' },
        { name: 'joie', occurrences: 22, size: 'small' },
        { name: 'nostalgie', occurrences: 20, size: 'small' }
      ]
    },
    {
      name: 'Artistique',
      color: '#8b5cf6',
      tags: [
        { name: 'poésie', occurrences: 30, size: 'medium' },
        { name: 'musique', occurrences: 25, size: 'medium' },
        { name: 'création', occurrences: 22, size: 'small' },
        { name: 'beauté', occurrences: 18, size: 'small' }
      ]
    }
  ];

  const connections = [
    { from: 'psyché', to: 'temps', strength: 6 },
    { from: 'âme', to: 'nature', strength: 5 },
    { from: 'mémoire', to: 'mélancolie', strength: 8 },
    { from: 'création', to: 'psyché', strength: 7 },
    { from: 'nature', to: 'beauté', strength: 6 },
    { from: 'temps', to: 'poésie', strength: 5 },
    { from: 'amour', to: 'création', strength: 6 }
  ];

  const getTagSize = (size: string) => {
    switch (size) {
      case 'large': return 'text-lg px-4 py-2';
      case 'medium': return 'text-base px-3 py-1.5';
      case 'small': return 'text-sm px-2 py-1';
      default: return 'text-sm px-2 py-1';
    }
  };

  return (
    <Card className={`border-slate-800 bg-slate-950/50 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          Psychocatcher des Résonances
        </CardTitle>
        <p className="text-slate-400 text-sm">
          Réseau simplifié de vos tags par communautés thématiques. Taille = fréquence d'usage.
        </p>
      </CardHeader>
      <CardContent>
        {selectedNode && (
          <div className="mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="w-4 h-4 text-blue-400" />
              <span className="font-medium text-slate-200">{selectedNode}</span>
            </div>
            <div className="text-xs text-slate-400">
              {communities.find(c => c.tags.some(t => t.name === selectedNode))?.tags.find(t => t.name === selectedNode)?.occurrences} occurrences dans vos psychographies
            </div>
          </div>
        )}

        {/* Réseau de communautés */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {communities.map((community, index) => (
            <div 
              key={community.name}
              className="relative p-4 rounded-lg border border-slate-700 bg-gradient-to-br from-slate-900/50 to-slate-800/30"
              style={{ borderColor: community.color + '40' }}
            >
              {/* En-tête de communauté */}
              <div className="flex items-center gap-2 mb-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: community.color }}
                />
                <span className="font-medium text-slate-200">{community.name}</span>
              </div>

              {/* Tags de la communauté */}
              <div className="space-y-2">
                {community.tags.map((tag) => (
                  <button
                    key={tag.name}
                    onClick={() => setSelectedNode(selectedNode === tag.name ? null : tag.name)}
                    className={`block w-full text-left rounded-lg transition-all duration-200 ${getTagSize(tag.size)} ${
                      selectedNode === tag.name 
                        ? 'ring-2 ring-blue-400 bg-blue-500/20' 
                        : 'bg-slate-800/50 hover:bg-slate-700/50'
                    }`}
                    style={{ 
                      borderLeft: `3px solid ${community.color}`,
                      color: selectedNode === tag.name ? '#93c5fd' : '#e2e8f0'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{tag.name}</span>
                      <span className="text-xs opacity-70">{tag.occurrences}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Animation de pulsation pour les communautés centrales */}
              {['Psyché', 'Nature', 'Temporel'].includes(community.name) && (
                <div 
                  className="absolute inset-0 rounded-lg opacity-20 animate-pulse pointer-events-none"
                  style={{ 
                    background: `radial-gradient(circle, ${community.color}20 0%, transparent 70%)` 
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Connexions principales */}
        <div className="mb-6">
          <h4 className="font-medium text-slate-300 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            Connexions Principales
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {connections.map((connection, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg border border-slate-700/50"
              >
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-300">{connection.from}</span>
                  <div 
                    className="h-0.5 flex-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded"
                    style={{ minWidth: `${connection.strength * 8}px` }}
                  />
                  <span className="text-slate-300">{connection.to}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {connection.strength}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-slate-900/30 rounded-lg">
            <div className="text-lg font-bold text-slate-200">22</div>
            <div className="text-xs text-slate-500">Tags uniques</div>
          </div>
          <div className="p-3 bg-slate-900/30 rounded-lg">
            <div className="text-lg font-bold text-slate-200">5</div>
            <div className="text-xs text-slate-500">Communautés</div>
          </div>
          <div className="p-3 bg-slate-900/30 rounded-lg">
            <div className="text-lg font-bold text-slate-200">7</div>
            <div className="text-xs text-slate-500">Connexions</div>
          </div>
          <div className="p-3 bg-slate-900/30 rounded-lg">
            <div className="text-lg font-bold text-slate-200">0.73</div>
            <div className="text-xs text-slate-500">Cohésion</div>
          </div>
        </div>

        {/* Note explicative */}
        <div className="mt-4 p-3 bg-purple-950/20 border border-purple-800/30 rounded-lg">
          <h4 className="font-medium text-purple-200 mb-1 text-sm">💡 Méthode Courtial Simplifiée</h4>
          <p className="text-xs text-purple-100/80">
            Analyse des co-occurrences de mots-clés pour révéler les patterns thématiques de votre créativité. 
            Les communautés émergent naturellement de vos associations d'idées.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}