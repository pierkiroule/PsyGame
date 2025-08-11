import React from 'react';
import { Link } from "wouter";
import { Button } from "./ui/button";
import { Leaf, Sparkles } from "lucide-react";

// Composant pour basculer entre l'app complète et la version écoresponsable
export const EcoToggle: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-lg p-3 space-y-2">
        <div className="text-xs text-slate-400 font-medium text-center">Mode</div>
        
        <div className="flex flex-col gap-2">
          <Link href="/">
            <Button
              size="sm"
              variant="outline"
              className="w-full flex items-center gap-2 text-slate-300 border-slate-600 hover:bg-slate-800"
            >
              <Sparkles className="w-3 h-3" />
              <span className="text-xs">Complet</span>
            </Button>
          </Link>
          
          <Link href="/minimal">
            <Button
              size="sm"
              variant="outline"
              className="w-full flex items-center gap-2 text-emerald-400 border-emerald-600 hover:bg-emerald-900/20"
            >
              <Leaf className="w-3 h-3" />
              <span className="text-xs">Éco</span>
            </Button>
          </Link>
        </div>
        
        <div className="text-xs text-slate-500 text-center max-w-24">
          Version simplifiée et écoresponsable
        </div>
      </div>
    </div>
  );
};