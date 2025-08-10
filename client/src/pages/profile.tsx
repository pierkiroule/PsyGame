import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatedBadge } from '@/components/ui/animated-badge';
import { Progress } from '@/components/ui/progress';
import { User, Edit3, Award, TrendingUp, Calendar, Target, Star, Sparkles } from 'lucide-react';
import { BADGE_CATEGORIES } from '@shared/gamification';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Alex',
    lastName: 'Martin',
    bio: 'Explorateur de l\'imaginaire et passionné de psychographie créative.',
    favoriteStyle: 'inspirant',
    favoriteFormat: 'solo'
  });

  // Données de progression simulées
  const userStats = {
    level: 8,
    experience: 2450,
    nextLevelExp: 3000,
    reputation: 142,
    sessionsCompleted: 24,
    publicCreations: 12,
    communityVotes: 89,
    badges: [
      { category: 'technique', level: 2 },
      { category: 'poetique', level: 3 },
      { category: 'psychologique', level: 1 },
      { category: 'narratif', level: 2 },
      { category: 'communautaire', level: 1 },
    ]
  };

  const recentActivity = [
    { type: 'session', title: 'Psychographie: "Les murmures du temps"', date: '2025-01-09', score: 4.2 },
    { type: 'badge', title: 'Badge obtenu: Virtuose de la Poésie', date: '2025-01-08' },
    { type: 'vote', title: 'Vote reçu sur "Métamorphose urbaine"', date: '2025-01-07', score: 5 },
    { type: 'comment', title: 'Commentaire sur "Échos d\'enfance"', date: '2025-01-06' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'session': return '📝';
      case 'badge': return '🏆';
      case 'vote': return '⭐';
      case 'comment': return '💬';
      default: return '📅';
    }
  };

  const getBadgeForCategory = (category: string, level: number) => {
    const badgeCategory = BADGE_CATEGORIES[category];
    if (!badgeCategory) return null;
    
    const badgeLevel = badgeCategory.levels.find(l => l.level === level);
    if (!badgeLevel) return null;

    return {
      id: `${category}-${level}`,
      name: badgeLevel.title,
      description: badgeLevel.description,
      category: category,
      level: level,
      svgIcon: badgeLevel.icon,
      criteria: badgeLevel.requirements,
      createdAt: new Date()
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
      <div className="container mx-auto px-4 py-8">
        
        {/* En-tête de profil */}
        <Card className="mb-8 border-slate-800 bg-slate-950/50 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                {profileData.firstName[0]}{profileData.lastName[0]}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-slate-100">
                    {profileData.firstName} {profileData.lastName}
                  </h1>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </div>
                
                <p className="text-slate-400 mb-4">{profileData.bio}</p>
                
                {/* Statistiques */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">Niv. {userStats.level}</div>
                    <div className="text-xs text-slate-500">Niveau</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{userStats.reputation}</div>
                    <div className="text-xs text-slate-500">Réputation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{userStats.sessionsCompleted}</div>
                    <div className="text-xs text-slate-500">Sessions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">{userStats.badges.length}</div>
                    <div className="text-xs text-slate-500">Badges</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>Progression vers le niveau {userStats.level + 1}</span>
                <span>{userStats.experience} / {userStats.nextLevelExp} XP</span>
              </div>
              <Progress 
                value={(userStats.experience / userStats.nextLevelExp) * 100} 
                className="h-2 bg-slate-800"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="badges" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="badges">Badges & Récompenses</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
            <TabsTrigger value="network">Réseau Sémantique</TabsTrigger>
            <TabsTrigger value="activity">Activité Récente</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="badges" className="space-y-6">
            <Card className="border-slate-800 bg-slate-950/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Collection de Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(BADGE_CATEGORIES).map(([categoryKey, category]) => {
                    const userBadge = userStats.badges.find(b => b.category === categoryKey);
                    const currentLevel = userBadge?.level || 0;
                    const nextLevel = Math.min(currentLevel + 1, 3);
                    
                    return (
                      <div key={categoryKey} className="space-y-4">
                        <div className="text-center">
                          <h3 className="font-semibold text-slate-200 mb-1">{category.name}</h3>
                          <p className="text-xs text-slate-400 mb-3">{category.description}</p>
                        </div>
                        
                        {/* Badge actuel */}
                        {currentLevel > 0 && (
                          <div className="text-center">
                            <AnimatedBadge 
                              badge={getBadgeForCategory(categoryKey, currentLevel)!}
                              size="md"
                            />
                          </div>
                        )}
                        
                        {/* Progression vers le prochain niveau */}
                        {nextLevel <= 3 && (
                          <div className="border-t border-slate-800 pt-4">
                            <div className="text-center mb-2">
                              <div className="text-xs text-slate-500 mb-1">Prochain niveau</div>
                              <div className="text-sm font-medium text-slate-300">
                                {category.levels[nextLevel - 1].title}
                              </div>
                            </div>
                            
                            {/* Requirements */}
                            <div className="space-y-1">
                              {Object.entries(category.levels[nextLevel - 1].requirements).map(([req, value]) => (
                                <div key={req} className="flex justify-between text-xs">
                                  <span className="text-slate-400">{req}</span>
                                  <span className="text-slate-300">{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-slate-800 bg-slate-950/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Performance Créative
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">4.2</div>
                      <div className="text-sm text-slate-400">Score moyen</div>
                    </div>
                    <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-400">89%</div>
                      <div className="text-sm text-slate-400">Appréciation</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { name: 'Créativité', score: 4.5, color: 'emerald' },
                      { name: 'Poétique', score: 4.8, color: 'purple' },
                      { name: 'Technique', score: 3.9, color: 'blue' },
                      { name: 'Originalité', score: 4.2, color: 'orange' },
                    ].map(metric => (
                      <div key={metric.name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">{metric.name}</span>
                          <span className="text-slate-400">{metric.score}/5</span>
                        </div>
                        <Progress value={metric.score * 20} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-950/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-yellow-400" />
                    Objectifs en Cours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { goal: 'Obtenir le badge "Maître de la Psychographie"', progress: 65 },
                    { goal: 'Atteindre le niveau 10', progress: 82 },
                    { goal: 'Publier 15 créations', progress: 80 },
                    { goal: 'Recevoir 100 votes communautaires', progress: 89 },
                  ].map((objective, index) => (
                    <div key={index} className="space-y-2">
                      <div className="text-sm text-slate-300">{objective.goal}</div>
                      <Progress value={objective.progress} className="h-2" />
                      <div className="text-xs text-slate-500 text-right">{objective.progress}%</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="network" className="space-y-6">
            <Card className="border-slate-800 bg-slate-950/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="2"/>
                    <circle cx="5" cy="12" r="2"/>
                    <circle cx="19" cy="12" r="2"/>
                    <circle cx="12" cy="19" r="2"/>
                    <line x1="12" y1="7" x2="12" y2="17" stroke="currentColor" strokeWidth="1"/>
                    <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="1"/>
                    <line x1="9.5" y1="9.5" x2="14.5" y2="14.5" stroke="currentColor" strokeWidth="1"/>
                    <line x1="14.5" y1="9.5" x2="9.5" y2="14.5" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                  Réseau Sémantique des Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <p className="text-slate-400 text-sm mb-4">
                    Visualisation des connexions entre vos tags les plus utilisés. Les couleurs indiquent les communautés thématiques identifiées par l'IA.
                  </p>
                  
                  {/* Graphique de réseau simulé */}
                  <div className="relative bg-slate-900/30 rounded-lg p-8 h-96 overflow-hidden">
                    <svg width="100%" height="100%" viewBox="0 0 400 300" className="absolute inset-0">
                      {/* Liens entre nodes */}
                      <g className="opacity-60">
                        <line x1="100" y1="80" x2="180" y2="120" stroke="#10b981" strokeWidth="2"/>
                        <line x1="100" y1="80" x2="120" y2="180" stroke="#10b981" strokeWidth="1.5"/>
                        <line x1="180" y1="120" x2="280" y2="100" stroke="#3b82f6" strokeWidth="3"/>
                        <line x1="180" y1="120" x2="320" y2="180" stroke="#3b82f6" strokeWidth="2"/>
                        <line x1="280" y1="100" x2="320" y2="180" stroke="#3b82f6" strokeWidth="1"/>
                        <line x1="120" y1="180" x2="200" y2="220" stroke="#f59e0b" strokeWidth="2"/>
                        <line x1="200" y1="220" x2="300" y2="200" stroke="#f59e0b" strokeWidth="1.5"/>
                        <line x1="180" y1="120" x2="200" y2="220" stroke="#8b5cf6" strokeWidth="1"/>
                      </g>
                      
                      {/* Nodes avec tailles variables */}
                      <g>
                        {/* Communauté Nature (vert) */}
                        <circle cx="100" cy="80" r="18" fill="#10b981" className="opacity-80"/>
                        <circle cx="120" cy="180" r="12" fill="#10b981" className="opacity-80"/>
                        
                        {/* Communauté Psychologie (bleu) */}
                        <circle cx="180" cy="120" r="20" fill="#3b82f6" className="opacity-80"/>
                        <circle cx="280" cy="100" r="16" fill="#3b82f6" className="opacity-80"/>
                        <circle cx="320" cy="180" r="14" fill="#3b82f6" className="opacity-80"/>
                        
                        {/* Communauté Temps (jaune) */}
                        <circle cx="200" cy="220" r="15" fill="#f59e0b" className="opacity-80"/>
                        <circle cx="300" cy="200" r="10" fill="#f59e0b" className="opacity-80"/>
                      </g>
                      
                      {/* Labels */}
                      <g className="text-xs fill-slate-200">
                        <text x="100" y="85" textAnchor="middle" className="font-medium">nature</text>
                        <text x="120" y="185" textAnchor="middle" className="font-medium">forêt</text>
                        <text x="180" y="125" textAnchor="middle" className="font-medium">psyché</text>
                        <text x="280" y="105" textAnchor="middle" className="font-medium">âme</text>
                        <text x="320" y="185" textAnchor="middle" className="font-medium">esprit</text>
                        <text x="200" y="225" textAnchor="middle" className="font-medium">temps</text>
                        <text x="300" y="205" textAnchor="middle" className="font-medium">mémoire</text>
                      </g>
                    </svg>
                  </div>
                </div>

                {/* Légende des communautés */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-emerald-950/20 border border-emerald-800/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span className="font-medium text-emerald-200">Communauté Nature</span>
                    </div>
                    <div className="text-xs text-emerald-300 space-y-1">
                      <div>• nature (47 occurrences)</div>
                      <div>• forêt (23 occurrences)</div>
                      <div>• océan (18 occurrences)</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-950/20 border border-blue-800/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-blue-200">Communauté Psychologie</span>
                    </div>
                    <div className="text-xs text-blue-300 space-y-1">
                      <div>• psyché (52 occurrences)</div>
                      <div>• âme (31 occurrences)</div>
                      <div>• esprit (28 occurrences)</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-amber-950/20 border border-amber-800/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <span className="font-medium text-amber-200">Communauté Temporelle</span>
                    </div>
                    <div className="text-xs text-amber-300 space-y-1">
                      <div>• temps (38 occurrences)</div>
                      <div>• mémoire (26 occurrences)</div>
                      <div>• passé (19 occurrences)</div>
                    </div>
                  </div>
                </div>

                {/* Métriques du réseau */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-slate-900/30 rounded-lg">
                    <div className="text-lg font-bold text-slate-200">47</div>
                    <div className="text-xs text-slate-500">Tags uniques</div>
                  </div>
                  <div className="p-3 bg-slate-900/30 rounded-lg">
                    <div className="text-lg font-bold text-slate-200">3</div>
                    <div className="text-xs text-slate-500">Communautés</div>
                  </div>
                  <div className="p-3 bg-slate-900/30 rounded-lg">
                    <div className="text-lg font-bold text-slate-200">0.73</div>
                    <div className="text-xs text-slate-500">Modularité</div>
                  </div>
                  <div className="p-3 bg-slate-900/30 rounded-lg">
                    <div className="text-lg font-bold text-slate-200">2.4</div>
                    <div className="text-xs text-slate-500">Densité</div>
                  </div>
                </div>

                {/* Insights automatiques */}
                <div className="mt-6 p-4 bg-purple-950/20 border border-purple-800/30 rounded-lg">
                  <h4 className="font-medium text-purple-200 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Insights IA
                  </h4>
                  <div className="text-sm text-purple-100 space-y-2">
                    <p>• Votre style créatif montre une forte connexion entre <span className="text-purple-300 font-medium">nature et introspection</span></p>
                    <p>• La communauté "Psychologie" est votre thème central avec le plus de connections</p>
                    <p>• Vous explorez souvent les liens entre <span className="text-purple-300 font-medium">temporalité et mémoire</span></p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="border-slate-800 bg-slate-950/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Activité Récente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-slate-900/30 rounded-lg">
                      <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-200">{activity.title}</div>
                        <div className="text-sm text-slate-400 mt-1">
                          {new Date(activity.date).toLocaleDateString('fr-FR')}
                        </div>
                        {activity.score && (
                          <div className="flex items-center gap-1 mt-2">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm text-yellow-400">{activity.score}/5</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="border-slate-800 bg-slate-950/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-slate-400" />
                  Informations de Profil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-slate-300 mb-2 block">Prénom</label>
                        <Input 
                          value={profileData.firstName}
                          onChange={(e) => setProfileData(prev => ({...prev, firstName: e.target.value}))}
                          className="bg-slate-900/50 border-slate-700"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-300 mb-2 block">Nom</label>
                        <Input 
                          value={profileData.lastName}
                          onChange={(e) => setProfileData(prev => ({...prev, lastName: e.target.value}))}
                          className="bg-slate-900/50 border-slate-700"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-slate-300 mb-2 block">Bio</label>
                      <Textarea 
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({...prev, bio: e.target.value}))}
                        className="bg-slate-900/50 border-slate-700"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={() => setIsEditing(false)}>
                        Sauvegarder
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Annuler
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-slate-500">Prénom</label>
                        <div className="text-slate-200">{profileData.firstName}</div>
                      </div>
                      <div>
                        <label className="text-sm text-slate-500">Nom</label>
                        <div className="text-slate-200">{profileData.lastName}</div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-slate-500">Bio</label>
                      <div className="text-slate-200">{profileData.bio}</div>
                    </div>
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Modifier le profil
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}