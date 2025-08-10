import { useSession } from '../contexts/SessionContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Link, useLocation } from 'wouter';
import { User, LogOut, Brain } from 'lucide-react';

export const Header = () => {
  const { currentScreen } = useSession();
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'home': return 'Espace créatif';
      case 'new-session': return 'Configuration';
      case 'game': return 'Session en cours';
      case 'results': return 'Résultats';
      default: return 'Espace créatif';
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setLocation('/login');
    } catch (err) {
      // L'erreur est déjà gérée par le context
    }
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const username = user.username || '';
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (username) {
      return username[0].toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = () => {
    if (!user) return 'Utilisateur';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) {
      return user.firstName;
    }
    return user.username;
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
              <Brain className="text-slate-200 w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">
                Psychographe
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">Écho-créatif</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full hidden md:inline-block">
              {getScreenTitle()}
            </span>
            
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-slate-800">
                    <Avatar className="h-10 w-10 border-2 border-slate-700">
                      <AvatarImage src={user.profileImageUrl || undefined} alt={getDisplayName()} />
                      <AvatarFallback className="bg-slate-800 text-slate-200 text-sm font-medium">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent 
                  className="w-56 bg-slate-900 border-slate-800 text-slate-200" 
                  align="end" 
                  forceMount
                >
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{getDisplayName()}</p>
                      <p className="text-xs leading-none text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  
                  <DropdownMenuSeparator className="bg-slate-800" />
                  
                  <DropdownMenuItem 
                    className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer"
                    onClick={() => setLocation('/profile')}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Mon profil</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="bg-slate-800" />
                  
                  <DropdownMenuItem 
                    className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer text-red-400 focus:text-red-400"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
