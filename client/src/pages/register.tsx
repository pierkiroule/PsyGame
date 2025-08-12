import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link, useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';
import { Logo } from '../components/Logo';

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const { register, error, clearError, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setPasswordError('');

    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
      });
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
    
    // Clear password error when user types
    if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Logo size={80} />
          </div>
          <p className="text-slate-400">
            Rejoignez l'aventure écho-créative
          </p>
        </div>

        <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-slate-200">Créer un compte</CardTitle>
            <CardDescription className="text-slate-400">
              Commencez votre parcours créatif avec Psychographe
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(error || passwordError) && (
              <Alert variant="destructive" className="bg-red-950/50 border-red-900 text-red-200">
                <AlertDescription>{error || passwordError}</AlertDescription>
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
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="bg-slate-900/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-slate-500"
                    placeholder="Prénom"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-slate-300">
                    Nom
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="bg-slate-900/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-slate-500"
                    placeholder="Nom"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-300">
                  Nom d'utilisateur *
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="bg-slate-900/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-slate-500"
                  placeholder="Nom d'utilisateur unique"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-slate-900/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-slate-500"
                  placeholder="votre.email@exemple.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Mot de passe *
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="bg-slate-900/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-slate-500"
                  placeholder="Au moins 6 caractères"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-300">
                  Confirmer le mot de passe *
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="bg-slate-900/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-slate-500"
                  placeholder="Répétez le mot de passe"
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
                    Création du compte...
                  </>
                ) : (
                  'Créer mon compte'
                )}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-slate-400">Déjà un compte ? </span>
              <Link 
                href="/login" 
                className="text-slate-300 hover:text-slate-200 underline underline-offset-4"
              >
                Se connecter
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