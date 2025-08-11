# Psychographe Écoresponsable

> Studio psychographique minimaliste pour l'exploration créative de soi

## 🌱 Vision

Psychographe est un outil de brainstorming projectif révolutionnaire qui transforme le processus créatif en un studio psychographique fluide. L'application privilégie une approche écoresponsable et minimaliste, permettant aux utilisateurs d'enrichir et développer leurs idées à travers un processus d'IA collaborative en 3 étapes simples.

## ✨ Fonctionnalités

### Studio Psychographique (3 étapes)
1. **Saisie** - Expression libre de vos pensées avec support vocal
2. **Enrichissement** - Génération de prompts créatifs personnalisés  
3. **Création** - Génération finale et sauvegarde dans votre psychothèque

### Galeries
- **Mes Créations** - Gestion personnelle de vos psychographies
- **Découvrir** - Exploration des créations publiques de la communauté

### Design Écoresponsable
- Interface minimaliste optimisée pour la performance
- Réduction de l'empreinte numérique par design
- Navigation fluide entre 3 pages essentielles seulement
- Architecture allégée sans fonctionnalités superflues

## 🚀 Technologies

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Express.js, PostgreSQL avec Drizzle ORM
- **UI**: shadcn/ui composants avec Radix UI primitives
- **Déploiement**: Optimisé pour Vercel

## 🛠️ Installation

```bash
# Installation des dépendances
npm install

# Configuration base de données
npm run db:push

# Démarrage développement
npm run dev
```

## 📦 Structure

```
├── client/src/           # Application React frontend
│   ├── components/       # Composants UI réutilisables
│   ├── contexts/         # Contextes React (Auth, etc.)
│   └── pages/           # Pages principales
├── server/              # API Express.js backend  
├── shared/              # Types et schémas partagés
└── vercel.json          # Configuration déploiement
```

## 🌍 Déploiement

L'application est optimisée pour un déploiement Vercel avec:
- Build automatique frontend/backend
- Variables d'environnement configurées
- Base de données PostgreSQL intégrée

## 📱 Expérience Utilisateur

- **Navigation minimaliste** entre Créer / Mes Créations / Découvrir
- **Saisie vocale universelle** pour une expression naturelle
- **Design épuré** focalisé sur l'essentiel créatif
- **Performance optimisée** pour une fluidité maximale

---

*Psychographe - Révélez votre créativité intérieure de manière écoresponsable*