import React from 'react';
import { Route, Switch } from "wouter";
import { MinimalNavigation } from '@/components/MinimalNavigation';
import { MinimalStudio } from '@/components/MinimalStudio';
import { MinimalGallery } from '@/components/MinimalGallery';

// Version minimaliste écoresponsable de Psychographe
export default function MinimalApp() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <MinimalNavigation />
      
      <main className="py-6">
        <Switch>
          <Route path="/" component={MinimalStudio} />
          <Route path="/mes-creations">
            <MinimalGallery mode="personal" />
          </Route>
          <Route path="/decouvrir">
            <MinimalGallery mode="public" />
          </Route>
          <Route>
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-slate-300 mb-4">Page introuvable</h1>
              <p className="text-slate-400 mb-6">La page que vous cherchez n'existe pas.</p>
              <a href="/" className="text-blue-400 hover:text-blue-300">Retour à l'accueil</a>
            </div>
          </Route>
        </Switch>
      </main>
    </div>
  );
}