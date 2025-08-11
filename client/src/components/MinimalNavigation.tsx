import React from 'react';
import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";
import { LogoCompact } from "./Logo";
import { BookOpen, Users, Plus } from "lucide-react";

export const MinimalNavigation = () => {
  const [location] = useLocation();

  const navigation = [
    { href: "/", icon: Plus, label: "Studio", id: "nav-create" },
    { href: "/mes-creations", icon: BookOpen, label: "Ma Psychothèque", id: "nav-my" },
    { href: "/decouvrir", icon: Users, label: "Découvrir", id: "nav-discover" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/30 bg-slate-950/90 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          
          {/* Logo compact */}
          <Link href="/">
            <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <LogoCompact size={28} />
              <span className="font-bold text-slate-100 text-base hidden sm:inline">
                Psychographe
              </span>
            </div>
          </Link>

          {/* Navigation centrale minimaliste */}
          <nav className="flex items-center gap-1">
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
                  <span className="hidden sm:inline">{label}</span>
                </Button>
              </Link>
            ))}
          </nav>

          {/* Indicateur simple */}
          <div className="w-8" /> {/* Spacer pour équilibrer */}
        </div>
      </div>
    </header>
  );
};