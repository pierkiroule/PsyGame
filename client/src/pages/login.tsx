import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link, useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';
import { PsychographeLogo } from '../components/ui/psychographe-logo';

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { login, error, clearError, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login(formData.username, formData.password);
      setLocation('/');
    } catch (err) {
      // L'erreur est déjà gérée par le context
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <PsychographeLogo size="md" animate={true} />
          </div>
          <p className="text-slate-400">
            Outil écho-créatif de projections poétiques
          </p>
        </div>

        <Card className="border-slate-700/50 bg-slate-950/60 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-3 pb-8">
            <CardTitle className="text-white text-2xl font-bold">Connexion</CardTitle>
            <CardDescription className="text-slate-200 text-base">
              Connectez-vous pour accéder à vos sessions créatives
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-950/50 border-red-900 text-red-200">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-300">
                  Nom d'utilisateur
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="bg-slate-900/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-slate-500"
                  placeholder="Votre nom d'utilisateur"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="bg-slate-900/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-slate-500"
                  placeholder="Votre mot de passe"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-slate-100"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-slate-400">Pas encore de compte ? </span>
              <Link 
                href="/register" 
                className="text-slate-300 hover:text-slate-200 underline underline-offset-4"
              >
                Créer un compte
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-slate-500">
          Psychographe - Écho-créatif basé sur les concepts de Bruno Latour et Hartmut Rosa
        </div>
      </div>
    </div>
  );
}