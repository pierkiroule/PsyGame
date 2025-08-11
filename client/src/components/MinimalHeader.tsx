import React from 'react';
import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";
import { LogoCompact } from "./Logo";
import { Home, Library, User, Pen, Mic, BookOpen } from "lucide-react";

export const MinimalHeader = () => {
  const [location] = useLocation();

  const navigation = [
    { href: "/", icon: Home, label: "Accueil", id: "nav-home" },
    { href: "/mes-psychographies", icon: BookOpen, label: "Mes Créations", id: "nav-my-creations" },
    { href: "/psychotheque", icon: Library, label: "La Psychothèque", id: "nav-discover" },
    { href: "/profile", icon: User, label: "Profil", id: "nav-profile" },
    { href: "/voice-demo", icon: Mic, label: "Vocal", id: "nav-voice" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/30 bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo simple */}
          <Link href="/">
            <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <LogoCompact size={32} />
              <span className="font-bold text-slate-100 text-lg hidden sm:inline">
                Psychographe
              </span>
            </div>
          </Link>

          {/* Navigation centrale épurée */}
          <nav className="flex items-center gap-1">
            {navigation.map(({ href, icon: Icon, label, id }) => (
              <Link key={href} href={href}>
                <Button
                  id={id}
                  variant={location === href ? "default" : "ghost"}
                  size="sm"
                  className={`flex items-center gap-2 transition-all ${
                    location === href 
                      ? "bg-blue-600/90 hover:bg-blue-600 text-white" 
                      : "hover:bg-slate-800/50 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline text-sm">{label}</span>
                </Button>
              </Link>
            ))}
          </nav>

          {/* Action principale */}
          <Button 
            id="create-button"
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Pen className="w-4 h-4" />
            <span className="hidden sm:inline">Créer</span>
          </Button>
        </div>
      </div>
    </header>
  );
};