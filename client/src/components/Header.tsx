import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { User, Library, Home, LogOut, Settings, Award, Bell, Sparkles, ChevronDown, Pen } from "lucide-react";
import { useState } from "react";

export const Header = () => {
  const [location] = useLocation();
  const [notifications] = useState(3); // Simulated notification count

  const navigation = [
    { href: "/", label: "Accueil", icon: Home, description: "Créer une psychographie" },
    { href: "/psychotheque", label: "Psychothèque", icon: Library, description: "Explorer la communauté" },
    { href: "/profile", label: "Profil", icon: User, description: "Badges et statistiques" },
  ];

  const userProfile = {
    name: "Alex Martin",
    level: 8,
    avatar: null,
    reputation: 142
  };

  return (
    <header className="border-b border-slate-800/50 bg-slate-950/95 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo et titre */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <div className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-slate-100">Psychographe</h1>
                  <p className="text-xs text-slate-400 -mt-1">Créativité & Introspection</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation centrale */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map(({ href, label, icon: Icon, description }) => (
              <Link key={href} href={href}>
                <div className="group relative">
                  <Button
                    variant={location === href ? "default" : "ghost"}
                    size="sm"
                    className={`flex items-center gap-2 transition-all duration-200 ${
                      location === href 
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg" 
                        : "hover:bg-slate-800/50 hover:text-emerald-400"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden lg:inline">{label}</span>
                  </Button>
                  
                  {/* Tooltip au survol */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-slate-900 text-slate-200 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap border border-slate-700">
                    <div className="font-medium">{label}</div>
                    <div className="text-slate-400">{description}</div>
                  </div>
                </div>
              </Link>
            ))}
          </nav>

          {/* Actions utilisateur */}
          <div className="flex items-center gap-3">
            
            {/* Bouton de création rapide */}
            <Link href="/">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white hidden sm:flex items-center gap-2">
                <Pen className="w-4 h-4" />
                Créer
              </Button>
            </Link>

            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs bg-red-500 border-0">
                    {notifications}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Menu utilisateur */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 p-2 hover:bg-slate-800/50">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={userProfile.avatar || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white text-sm">
                      {userProfile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:block text-left">
                    <div className="text-sm font-medium text-slate-200">{userProfile.name}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      Niveau {userProfile.level} • {userProfile.reputation} pts
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-700">
                <DropdownMenuLabel className="text-slate-200">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white text-xs">
                        {userProfile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    Mon Compte
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                
                <Link href="/profile">
                  <DropdownMenuItem className="text-slate-300 hover:bg-slate-800 cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Profil & Badges
                  </DropdownMenuItem>
                </Link>
                
                <DropdownMenuItem className="text-slate-300 hover:bg-slate-800 cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres
                </DropdownMenuItem>
                
                <DropdownMenuItem className="text-slate-300 hover:bg-slate-800 cursor-pointer">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                  {notifications > 0 && (
                    <Badge className="ml-auto bg-red-500 text-white text-xs">
                      {notifications}
                    </Badge>
                  )}
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-slate-700" />
                
                <DropdownMenuItem className="text-red-400 hover:bg-red-950/50 cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <div className="md:hidden border-t border-slate-800/50 bg-slate-950/95">
        <nav className="container mx-auto px-4 py-2">
          <div className="flex justify-around">
            {navigation.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                    location === href ? "text-emerald-400" : "text-slate-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};