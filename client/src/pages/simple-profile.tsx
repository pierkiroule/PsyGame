import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LogOut,
  CreditCard,
  UserX,
  Network,
  Trophy,
  TrendingUp,
  Activity,
  Eye,
  Star,
  Target
} from 'lucide-react';
import { BADGE_CATEGORIES } from '@shared/gamification';
import Psychocatcher from '@/components/ui/psychocatcher';

export default function SimpleProfile() {
  // Données utilisateur
  const userData = {
    username: 'Alex Martin',
    creditsRemaining: 47,
    level: 8,
    sessionsCompleted: 24
  };

  // Badges simplifiés
  const userBadges = [
    { category: 'technique', level: 2, icon: '⚡', title: 'Technicien Expert' },
    { category: 'poetique', level: 3, icon: '🎭', title: 'Maître Poète' },
    { category: 'narratif', level: 2, icon: '📖', title: 'Conteur Aguerri' },
  ];

  // Statistiques d'usage pour le Psychocatcher
  const usageStats = {
    frequentTags: [
      { tag: 'rêve', count: 45, percentage: 18 },
      { tag: 'mémoire', count: 38, percentage: 15 },
      { tag: 'océan', count: 34, percentage: 14 },
      { tag: 'lumière', count: 29, percentage: 12 },
      { tag: 'silence', count: 25, percentage: 10 }
    ],
    denseClusters: [
      { cluster: 'Psyché & Introspection', density: 0.85, centrality: 0.92, tags: ['rêve', 'mémoire', 'inconscient'] },
      { cluster: 'Nature & Éléments', density: 0.78, centrality: 0.84, tags: ['océan', 'vent', 'forêt'] },
      { cluster: 'Émotions & Sensations', density: 0.72, centrality: 0.76, tags: ['joie', 'mélancolie', 'espoir'] }
    ]
  };

  const handleLogout = () => {
    console.log('Déconnexion...');
  };

  const handleUnsubscribe = () => {
    console.log('Désabonnement...');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      
      {/* Section 1: Informations Personnelles */}
      <Card className="mb-8 border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold">
                {userData.username.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-100">{userData.username}</h1>
                <p className="text-slate-400 text-sm">Niveau {userData.level} • {userData.sessionsCompleted} sessions</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
              <Button variant="ghost" size="sm" onClick={handleUnsubscribe}>
                <UserX className="w-4 h-4 mr-2" />
                Se désabonner
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-950/30 rounded-lg">
              <CreditCard className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-semibold">{userData.creditsRemaining} crédits restants</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Badges + Psychocatcher + Statistiques */}
      <Card className="mb-8 border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Badges & Récompenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {userBadges.map((badge, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-slate-900/30 rounded-lg">
                <div className="text-2xl">{badge.icon}</div>
                <div>
                  <div className="font-semibold text-slate-200">{badge.title}</div>
                  <div className="text-sm text-slate-400">Niveau {badge.level}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Psychocatcher Network */}
      <Card className="mb-8 border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-6 h-6 text-blue-500" />
            Psychocatcher des Résonances
          </CardTitle>
          <p className="text-slate-400 text-sm">
            Réseau de vos associations créatives selon la méthode d'analyse des co-occurrences de Jean-Pierre Courtial
          </p>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <Psychocatcher width={800} height={500} />
          </div>
        </CardContent>
      </Card>

      {/* Statistiques d'Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Tags Fréquents */}
        <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Tags les Plus Fréquents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {usageStats.frequentTags.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="text-slate-200 font-medium">{item.tag}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-300 font-semibold">{item.count}</div>
                    <div className="text-slate-500 text-sm">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Clusters Denses et Centraux */}
        <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-500" />
              Communautés Thématiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usageStats.denseClusters.map((cluster, index) => (
                <div key={index} className="p-4 bg-slate-900/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-200">{cluster.cluster}</h4>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">
                        <Target className="w-3 h-3 mr-1" />
                        {Math.round(cluster.centrality * 100)}% central
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        {Math.round(cluster.density * 100)}% dense
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {cluster.tags.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Note explicative */}
      <Card className="mt-6 border-slate-800 bg-slate-950/30 backdrop-blur-sm">
        <CardContent className="p-4">
          <p className="text-slate-400 text-sm text-center">
            <Star className="w-4 h-4 inline mr-1" />
            Le Psychocatcher révèle vos patterns créatifs en analysant les co-occurrences entre vos tags favoris, 
            révélant ainsi les communautés thématiques qui structurent votre imaginaire.
          </p>
        </CardContent>
      </Card>
      
    </div>
  );
}