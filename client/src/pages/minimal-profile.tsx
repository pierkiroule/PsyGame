import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Edit3, Award, TrendingUp, Target, Star, Sparkles, BarChart3 } from 'lucide-react';

export default function MinimalProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Alex',
    lastName: 'Martin',
    bio: 'Explorateur de l\'imaginaire passionné par la psychographie créative.',
  });

  // Données simplifiées
  const userStats = {
    level: 8,
    experience: 2450,
    nextLevelExp: 3000,
    psychographiesCount: 23,
    publicCreations: 12,
    communityVotes: 89
  };

  const recentBadges = [
    { name: 'Artisan du Verbe', level: 3, color: 'text-purple-500', icon: '✨', description: 'Épanouissement' },
    { name: 'Explorateur d\'Âmes', level: 2, color: 'text-blue-400', icon: '🔍', description: 'Éclosion' },
    { name: 'Première Étincelle', level: 1, color: 'text-emerald-300', icon: '🌱', description: 'Éveil' }
  ];

  const progressPercent = Math.round((userStats.experience / userStats.nextLevelExp) * 100);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      
      {/* En-tête de profil simplifié */}
      <Card className="mb-8 border-slate-800/50 bg-slate-950/30">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center text-xl font-bold text-white">
              {profileData.firstName[0]}{profileData.lastName[0]}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-2xl font-bold text-slate-100">
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
              
              {/* Statistiques essentielles */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-emerald-400">Niv. {userStats.level}</div>
                  <div className="text-xs text-slate-500">Niveau</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-400">{userStats.psychographiesCount}</div>
                  <div className="text-xs text-slate-500">Créations</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-400">{userStats.publicCreations}</div>
                  <div className="text-xs text-slate-500">Partagées</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-amber-400">{userStats.communityVotes}</div>
                  <div className="text-xs text-slate-500">Votes reçus</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto bg-slate-950/50">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Progression du niveau */}
          <Card className="border-slate-800/50 bg-slate-950/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-400">
                <TrendingUp className="w-5 h-5" />
                Progression Niveau {userStats.level}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Expérience</span>
                  <span className="text-slate-300">{userStats.experience} / {userStats.nextLevelExp} XP</span>
                </div>
                <Progress value={progressPercent} className="h-3" />
                <p className="text-xs text-slate-500">
                  Plus que {userStats.nextLevelExp - userStats.experience} XP pour atteindre le niveau {userStats.level + 1}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Badges récents */}
          <Card className="border-slate-800/50 bg-slate-950/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-400">
                <Award className="w-5 h-5" />
                Derniers badges obtenus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentBadges.map((badge, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-lg">
                    <div className={`w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg`}>
                      {badge.icon}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${badge.color}`}>{badge.name}</div>
                      <div className="text-sm text-slate-500">{badge.description} • Niveau {badge.level}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Objectifs simples */}
          <Card className="border-slate-800/50 bg-slate-950/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <Target className="w-5 h-5" />
                Objectifs en cours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { goal: 'Atteindre le niveau 10', progress: 82 },
                  { goal: 'Publier 15 créations', progress: 80 },
                  { goal: 'Recevoir 100 votes', progress: 89 },
                ].map((objective, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-300">{objective.goal}</span>
                      <span className="text-xs text-slate-500">{objective.progress}%</span>
                    </div>
                    <Progress value={objective.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-6">
          <Card className="border-slate-800/50 bg-slate-950/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Sparkles className="w-5 h-5" />
                Collection de badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: 'Éveil', level: 1, progress: 100, color: 'text-emerald-300', icon: '🌱' },
                  { name: 'Éclosion', level: 2, progress: 85, color: 'text-blue-400', icon: '🔍' },
                  { name: 'Épanouissement', level: 3, progress: 60, color: 'text-purple-500', icon: '✨' },
                  { name: 'Rayonnement', level: 4, progress: 25, color: 'text-amber-400', icon: '🌟' }
                ].map(stage => (
                  <div key={stage.name} className="p-4 bg-slate-900/30 rounded-lg">
                    <h3 className={`font-semibold mb-3 ${stage.color} flex items-center gap-2`}>
                      <span className="text-lg">{stage.icon}</span>
                      {stage.name}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          stage.progress === 100 ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'
                        }`}>
                          {stage.level}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-300">
                            {stage.progress === 100 ? 'Niveau maîtrisé' : `Progression: ${stage.progress}%`}
                          </div>
                          <div className="text-xs text-slate-500">
                            {stage.progress === 100 ? 'Explorez le niveau suivant' : 'En cours de découverte'}
                          </div>
                        </div>
                      </div>
                      <Progress value={stage.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="border-slate-800/50 bg-slate-950/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-400">
                <User className="w-5 h-5" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-500 mb-1 block">Prénom</label>
                      <Input
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        className="bg-slate-900/50 border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-slate-500 mb-1 block">Nom</label>
                      <Input
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        className="bg-slate-900/50 border-slate-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-slate-500 mb-1 block">Bio</label>
                    <Textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      className="bg-slate-900/50 border-slate-700"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setIsEditing(false)}>
                      Sauvegarder
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                      Annuler
                    </Button>
                  </div>
                </div>
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
  );
}