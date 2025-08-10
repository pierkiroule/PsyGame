import { useSession } from '../contexts/SessionContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Brain, Users, Sparkles, Trophy, Play, User, BarChart3 } from 'lucide-react';
import { useLocation } from 'wouter';

export const HomeScreen = () => {
  const { navigateToScreen } = useSession();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const handleStartSession = () => {
    navigateToScreen('new-session');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const getDisplayName = () => {
    if (!user) return 'Créateur';
    if (user.firstName) return user.firstName;
    return user.username;
  };

  return (
    <div className="text-center space-y-8">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl mx-auto mb-6 flex items-center justify-center ring-4 ring-slate-700/30">
            <Brain className="text-slate-200 w-10 h-10" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 bg-clip-text text-transparent">
              {getGreeting()}, {getDisplayName()}
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Créez des <span className="text-slate-300 font-medium">psychographies</span> uniques 
              à partir de vos contributions créatives — un mélange poétique d'idées, 
              d'images et d'animations guidé par l'écho-créatif.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary" className="bg-slate-800/50 text-slate-300 border-slate-700">
                Bruno Latour
              </Badge>
              <Badge variant="secondary" className="bg-slate-800/50 text-slate-300 border-slate-700">
                Hartmut Rosa
              </Badge>
              <Badge variant="secondary" className="bg-slate-800/50 text-slate-300 border-slate-700">
                Éco-responsable
              </Badge>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm hover:bg-slate-950/70 transition-colors">
            <CardContent className="p-8 text-center">
              <Users className="w-8 h-8 text-slate-400 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-200 mb-2">Formats Variés</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Adaptez l'expérience selon votre contexte : 
                <span className="block mt-2 text-slate-300">Solo • Duo • Famille • Équipe</span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm hover:bg-slate-950/70 transition-colors">
            <CardContent className="p-8 text-center">
              <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-200 mb-2">Styles Créatifs</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Explorez différents modes d'expression :
                <span className="block mt-2 text-slate-300">Libre • Inspirant • Défi</span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm hover:bg-slate-950/70 transition-colors">
            <CardContent className="p-8 text-center">
              <Trophy className="w-8 h-8 text-slate-400 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-200 mb-2">Évaluation Optionnelle</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Activez les scores pour explorer la dimension quantitative :
                <span className="block mt-2 text-slate-300">Créativité • Poésie • Badges</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        {user?.totalSessions > 0 && (
          <Card className="border-slate-800 bg-slate-950/30 backdrop-blur-sm mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <BarChart3 className="w-5 h-5 text-slate-400" />
                  <div className="text-left">
                    <p className="text-slate-300 font-medium">Votre parcours créatif</p>
                    <p className="text-sm text-slate-400">
                      {user.totalSessions} session{user.totalSessions > 1 ? 's' : ''} créé{user.totalSessions > 1 ? 'es' : 'e'}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setLocation('/profile')}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <User className="w-4 h-4 mr-2" />
                  Voir le profil
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main CTA */}
        <div className="space-y-4">
          <Button 
            onClick={handleStartSession}
            size="lg"
            className="bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-slate-100 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-lg px-8 py-4 h-auto"
          >
            <Play className="w-5 h-5 mr-3" />
            Créer une Nouvelle Session
          </Button>
          
          <p className="text-sm text-slate-500">
            Commencez votre exploration écho-créative en quelques clics
          </p>
        </div>

        {/* Philosophical Note */}
        <div className="mt-16 max-w-2xl mx-auto">
          <blockquote className="text-slate-500 text-sm italic leading-relaxed border-l-2 border-slate-800 pl-4">
            "Dans un monde en accélération, Psychographe vous invite à ralentir, 
            à résonner avec vos idées créatives et à découvrir les connexions 
            inattendues qui émergent de vos contributions personnelles."
          </blockquote>
        </div>
      </div>
    </div>
  );
};
