import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  CreditCard, 
  Settings, 
  LogOut, 
  Trash2,
  Crown,
  Zap,
  BarChart3,
  Star,
  Heart,
  MessageCircle,
  Download,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

type UserStats = {
  totalPsychographies: number;
  publicPsychographies: number;
  totalLikes: number;
  totalComments: number;
  averageRating: number;
  creditsRemaining: number;
  subscriptionType: 'free' | 'premium' | 'pro';
  subscriptionExpiry?: string;
};

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    pseudo: user?.username || '',
    email: user?.email || '',
    bio: '',
    publicProfile: true,
    emailNotifications: true
  });

  // Statistiques utilisateur
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/user/stats'],
    queryFn: async (): Promise<UserStats> => {
      const response = await fetch('/api/user/stats');
      if (!response.ok) throw new Error('Erreur de chargement des statistiques');
      return response.json();
    }
  });

  // Plans de tarification
  const plans = [
    {
      name: 'Gratuit',
      type: 'free',
      price: '0€/mois',
      credits: 10,
      features: [
        '10 psychographies/mois',
        'Galerie personnelle',
        'Accès psychothèque publique',
        'Export texte simple'
      ]
    },
    {
      name: 'Premium',
      type: 'premium',
      price: '9€/mois',
      credits: 50,
      features: [
        '50 psychographies/mois',
        'Génération d\'images IA',
        'Export DOCX enrichi',
        'Statistiques détaillées',
        'Support prioritaire'
      ]
    },
    {
      name: 'Pro',
      type: 'pro',
      price: '19€/mois',
      credits: 150,
      features: [
        'Psychographies illimitées',
        'API personnelle',
        'Intégrations avancées',
        'Branding personnalisé',
        'Consultation créative'
      ]
    }
  ];

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedProfile: typeof profile) => {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile)
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profil mis à jour",
        description: "Vos modifications ont été sauvegardées"
      });
      setIsEditing(false);
    }
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/user/account', {
        method: 'DELETE'
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Compte supprimé",
        description: "Votre compte a été définitivement supprimé"
      });
      logout();
    }
  });

  const subscribeMutation = useMutation({
    mutationFn: async (planType: string) => {
      const response = await fetch('/api/user/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType })
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    }
  });

  const handleSubscribe = (planType: string) => {
    subscribeMutation.mutate(planType);
  };

  const handleDeleteAccount = () => {
    const confirmation = prompt(
      'Pour supprimer définitivement votre compte, tapez "SUPPRIMER" en majuscules:'
    );
    if (confirmation === 'SUPPRIMER') {
      deleteAccountMutation.mutate();
    }
  };

  if (statsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-2 text-slate-400">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Mon Profil</h1>
        <p className="text-slate-400">Gérez votre compte et vos préférences</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Colonne gauche - Profil & Stats */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Informations personnelles */}
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <User className="w-5 h-5" />
                Informations personnelles
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Annuler' : 'Modifier'}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pseudo">Pseudo</Label>
                  <Input
                    id="pseudo"
                    value={profile.pseudo}
                    onChange={(e) => setProfile(prev => ({ ...prev, pseudo: e.target.value }))}
                    disabled={!isEditing}
                    className="bg-slate-800 border-slate-600"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                    className="bg-slate-800 border-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="publicProfile">Profil public</Label>
                  <Switch
                    id="publicProfile"
                    checked={profile.publicProfile}
                    onCheckedChange={(checked) => setProfile(prev => ({ ...prev, publicProfile: checked }))}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Notifications par email</Label>
                  <Switch
                    id="notifications"
                    checked={profile.emailNotifications}
                    onCheckedChange={(checked) => setProfile(prev => ({ ...prev, emailNotifications: checked }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {isEditing && (
                <Button
                  onClick={() => updateProfileMutation.mutate(profile)}
                  disabled={updateProfileMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Sauvegarder
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Statistiques */}
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <BarChart3 className="w-5 h-5" />
                Vos statistiques créatives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{stats?.totalPsychographies || 0}</div>
                  <div className="text-sm text-slate-400">Psychographies créées</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{stats?.publicPsychographies || 0}</div>
                  <div className="text-sm text-slate-400">Publications publiques</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{stats?.totalLikes || 0}</div>
                  <div className="text-sm text-slate-400">Likes reçus</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {stats?.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
                  </div>
                  <div className="text-sm text-slate-400">Note moyenne</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions du compte */}
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <Settings className="w-5 h-5" />
                Actions du compte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={logout}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Se déconnecter
                </Button>
                
                <Button
                  onClick={() => window.open('/api/user/export')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exporter mes données
                </Button>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <h4 className="text-red-400 font-medium mb-2">Zone de danger</h4>
                <p className="text-sm text-slate-400 mb-3">
                  La suppression de votre compte est irréversible et entraînera la perte définitive de toutes vos créations.
                </p>
                <Button
                  onClick={handleDeleteAccount}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer définitivement mon compte
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite - Abonnement & Crédits */}
        <div className="space-y-6">
          
          {/* Statut actuel */}
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <Crown className="w-5 h-5" />
                Abonnement actuel
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Badge 
                variant={stats?.subscriptionType === 'free' ? 'secondary' : 'default'}
                className="text-sm px-4 py-2"
              >
                {stats?.subscriptionType === 'free' && 'Gratuit'}
                {stats?.subscriptionType === 'premium' && 'Premium'}
                {stats?.subscriptionType === 'pro' && 'Pro'}
              </Badge>
              
              <div>
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {stats?.creditsRemaining || 0}
                </div>
                <div className="text-sm text-slate-400">Crédits restants</div>
              </div>

              {stats?.subscriptionExpiry && (
                <p className="text-xs text-slate-400">
                  Renouvellement le {new Date(stats.subscriptionExpiry).toLocaleDateString('fr-FR')}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Plans de tarification */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-100">Plans disponibles</h3>
            
            {plans.map(plan => (
              <Card 
                key={plan.type}
                className={`border transition-all ${
                  stats?.subscriptionType === plan.type
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-700 bg-slate-900/50'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-slate-100">{plan.name}</h4>
                    <div className="text-right">
                      <div className="font-bold text-blue-400">{plan.price}</div>
                      <div className="text-xs text-slate-400">{plan.credits} crédits</div>
                    </div>
                  </div>
                  
                  <ul className="space-y-1 mb-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="text-sm text-slate-300 flex items-center gap-2">
                        <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {stats?.subscriptionType !== plan.type && (
                    <Button
                      onClick={() => handleSubscribe(plan.type)}
                      disabled={subscribeMutation.isPending}
                      className="w-full"
                      variant={plan.type === 'premium' ? 'default' : 'outline'}
                    >
                      {plan.type === 'free' ? 'Passer au gratuit' : `Passer à ${plan.name}`}
                    </Button>
                  )}
                  
                  {stats?.subscriptionType === plan.type && (
                    <div className="text-center text-sm text-green-400 font-medium">
                      ✓ Plan actuel
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact support */}
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-sm text-slate-300 mb-3">
                Une question ou un problème ?
              </p>
              <Button variant="outline" size="sm">
                Contacter le support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}