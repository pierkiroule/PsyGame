import React from 'react';
import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";
import { LogoCompact } from "./Logo";
import { Home, Plus, BookOpen, Users, User } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

export const Navigation = () => {
  const [location] = useLocation();
  const { user } = useAuth();

  const navigation = [
    { href: "/", icon: Home, label: "Accueil", id: "nav-home" },
    { href: "/creer", icon: Plus, label: "Créer", id: "nav-create" },
    { href: "/mes-creations", icon: BookOpen, label: "Mes Créations", id: "nav-my" },
    { href: "/psychotheque", icon: Users, label: "Psychothèque", id: "nav-discover" },
    { href: "/profil", icon: User, label: "Profil", id: "nav-profile" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/30 bg-slate-950/95 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <LogoCompact size={32} />
              <span className="font-bold text-slate-100 text-lg hidden sm:inline">
                Psychographe
              </span>
            </div>
          </Link>

          {/* Navigation principale */}
          <nav className="hidden md:flex items-center gap-2">
            {navigation.map(({ href, icon: Icon, label, id }) => (
              <Link key={href} href={href}>
                <Button
                  id={id}
                  variant={location === href ? "default" : "ghost"}
                  size="sm"
                  className={`flex items-center gap-2 transition-all text-sm ${
                    location === href 
                      ? "bg-blue-600/90 hover:bg-blue-600 text-white" 
                      : "hover:bg-slate-800/50 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Button>
              </Link>
            ))}
          </nav>

          {/* Navigation mobile */}
          <div className="md:hidden">
            <select
              value={location}
              onChange={(e) => window.location.href = e.target.value}
              className="bg-slate-800 border border-slate-600 rounded px-3 py-2 text-slate-100 text-sm"
            >
              {navigation.map(({ href, label }) => (
                <option key={href} value={href}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Indicateur utilisateur */}
          {user && (
            <div className="hidden lg:flex items-center gap-3 text-sm text-slate-400">
              <span>Bonjour, <strong className="text-slate-200">{user.username}</strong></span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};