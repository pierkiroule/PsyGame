import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { Loader2, User, BarChart3, Settings, LogOut } from 'lucide-react';
import type { GameSession } from '@shared/schema';

interface UserStats {
  totalSessions: number;
  completedSessions: number;
  favoriteFormat: string | null;
  favoriteStyle: string | null;
  averageCreativeScore: number | null;
  averagePoetricScore: number | null;
}

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const { user, logout, updateProfile, error, clearError, isLoading } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    favoriteStyle: '',
    favoriteFormat: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        favoriteStyle: user.favoriteStyle || '',
        favoriteFormat: user.favoriteFormat || '',
      });
      fetchStats();
      fetchSessions();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/profile/stats', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des statistiques:', err);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/sessions', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des sessions:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsUpdating(true);

    try {
      await updateProfile(formData);
    } catch (err) {
      // L'erreur est déjà gérée par le context
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      setLocation('/login');
    } catch (err) {
      // L'erreur est déjà gérée
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">
              Mon Profil
            </h1>
            <p className="text-slate-400">
              Gérez votre compte et consultez vos statistiques créatives
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setLocation('/')}
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Retour à l'accueil
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-red-800 text-red-400 hover:bg-red-950/50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="profile" className="text-slate-300 data-[state=active]:bg-slate-700">
              <User className="w-4 h-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="stats" className="text-slate-300 data-[state=active]:bg-slate-700">
              <BarChart3 className="w-4 h-4 mr-2" />
              Statistiques
            </TabsTrigger>
            <TabsTrigger value="sessions" className="text-slate-300 data-[state=active]:bg-slate-700">
              <Settings className="w-4 h-4 mr-2" />
              Historique
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-200">Informations personnelles</CardTitle>
                <CardDescription className="text-slate-400">
                  Modifiez vos informations personnelles et préférences créatives
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="bg-red-950/50 border-red-900 text-red-200">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-slate-300">
                        Prénom
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="bg-slate-900/50 border-slate-700 text-slate-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-slate-300">
                        Nom
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="bg-slate-900/50 border-slate-700 text-slate-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-slate-300">
                      Biographie créative
                    </Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Décrivez votre approche créative..."
                      className="bg-slate-900/50 border-slate-700 text-slate-200 placeholder:text-slate-500 min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">
                        Style préféré
                      </Label>
                      <Select value={formData.favoriteStyle} onValueChange={(value) => handleSelectChange('favoriteStyle', value)}>
                        <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-200">
                          <SelectValue placeholder="Choisir un style" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700">
                          <SelectItem value="">Aucune préférence</SelectItem>
                          <SelectItem value="libre">Libre</SelectItem>
                          <SelectItem value="inspirant">Inspirant</SelectItem>
                          <SelectItem value="defi">Défi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">
                        Format préféré
                      </Label>
                      <Select value={formData.favoriteFormat} onValueChange={(value) => handleSelectChange('favoriteFormat', value)}>
                        <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-200">
                          <SelectValue placeholder="Choisir un format" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700">
                          <SelectItem value="">Aucune préférence</SelectItem>
                          <SelectItem value="solo">Solo</SelectItem>
                          <SelectItem value="duo">Duo</SelectItem>
                          <SelectItem value="famille">Famille</SelectItem>
                          <SelectItem value="equipe">Équipe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mise à jour...
                      </>
                    ) : (
                      'Mettre à jour le profil'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-200">Activité créative</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Sessions totales</span>
                        <span className="text-slate-200 font-semibold">{stats.totalSessions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Sessions complétées</span>
                        <span className="text-slate-200 font-semibold">{stats.completedSessions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Taux de completion</span>
                        <span className="text-slate-200 font-semibold">
                          {stats.totalSessions > 0 ? Math.round((stats.completedSessions / stats.totalSessions) * 100) : 0}%
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-200">Préférences détectées</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats ? (
                    <>
                      <div className="space-y-2">
                        <span className="text-slate-400 text-sm">Format favori</span>
                        {stats.favoriteFormat ? (
                          <Badge variant="secondary" className="bg-slate-800 text-slate-200">
                            {stats.favoriteFormat}
                          </Badge>
                        ) : (
                          <span className="text-slate-500 text-sm">Non déterminé</span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <span className="text-slate-400 text-sm">Style favori</span>
                        {stats.favoriteStyle ? (
                          <Badge variant="secondary" className="bg-slate-800 text-slate-200">
                            {stats.favoriteStyle}
                          </Badge>
                        ) : (
                          <span className="text-slate-500 text-sm">Non déterminé</span>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sessions">
            <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-200">Historique des sessions</CardTitle>
                <CardDescription className="text-slate-400">
                  Vos dernières sessions créatives
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sessions.length > 0 ? (
                  <div className="space-y-4">
                    {sessions.map(session => (
                      <div key={session.id} className="border border-slate-800 rounded-lg p-4 bg-slate-900/30">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Badge variant="outline" className="border-slate-600 text-slate-300">
                                {session.format}
                              </Badge>
                              <Badge variant="outline" className="border-slate-600 text-slate-300">
                                {session.style}
                              </Badge>
                              {session.scoreEnabled && (
                                <Badge className="bg-blue-900/50 text-blue-300 border-blue-800">
                                  Score activé
                                </Badge>
                              )}
                            </div>
                            <p className="text-slate-400 text-sm">
                              {session.playerCount} joueur{session.playerCount > 1 ? 's' : ''}
                            </p>
                            <p className="text-slate-500 text-xs">
                              {new Date(session.createdAt).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <Badge 
                            variant={session.isCompleted ? "default" : "secondary"}
                            className={session.isCompleted 
                              ? "bg-green-900/50 text-green-300 border-green-800" 
                              : "bg-slate-800 text-slate-400"
                            }
                          >
                            {session.isCompleted ? 'Terminée' : 'En cours'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-400">Aucune session pour le moment</p>
                    <Button 
                      onClick={() => setLocation('/')} 
                      className="mt-4 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500"
                    >
                      Créer ma première session
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