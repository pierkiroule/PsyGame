# Tagzai

Un projet moderne et innovant pour la gestion et l'organisation de tags et de catégories.

## 🚀 Description

Tagzai est une application web moderne qui permet de gérer, organiser et catégoriser efficacement vos contenus à travers un système de tags intelligent.

## ✨ Fonctionnalités

- Gestion avancée des tags
- Interface utilisateur moderne et intuitive
- Système de catégorisation flexible
- Recherche et filtrage puissants
- API REST complète

## 🛠️ Technologies

- **Frontend**: React.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Base de données**: PostgreSQL (prévu)
- **ORM**: Prisma (prévu)
- **Authentification**: JWT
- **Déploiement**: Vercel

## 📦 Installation

### Développement local

1. Clonez le repository :
```bash
git clone <url-du-repo>
cd tagzai
```

2. Installez toutes les dépendances :
```bash
npm run install:all
```

3. Configurez les variables d'environnement :
```bash
cp .env.example .env
# Éditez le fichier .env avec vos configurations
```

4. Lancez l'application en mode développement :
```bash
npm run dev
```

### Déploiement Vercel

1. **Prérequis** :
   - Compte Vercel
   - Repository GitHub connecté

2. **Configuration automatique** :
   - Connectez votre repository GitHub à Vercel
   - Vercel détectera automatiquement la configuration

3. **Variables d'environnement** (dans le dashboard Vercel) :
   ```
   NODE_ENV=production
   JWT_SECRET=votre-secret-jwt-super-securise
   ```

4. **Déploiement** :
   - Chaque push sur `main` déclenche un déploiement automatique
   - Les previews sont créées pour chaque Pull Request

## 🔧 Scripts disponibles

### Développement
- `npm run dev` - Lance le serveur de développement (client + serveur)
- `npm run dev:server` - Lance uniquement le serveur backend
- `npm run dev:client` - Lance uniquement le client frontend

### Production
- `npm run build` - Construit l'application pour la production
- `npm run start` - Lance l'application en mode production
- `npm run vercel-build` - Script de build pour Vercel

### Tests
- `npm run test` - Lance tous les tests
- `npm run test:server` - Tests backend uniquement
- `npm run test:client` - Tests frontend uniquement

## 📁 Structure du projet

```
tagzai/
├── client/              # Application frontend React
│   ├── src/            # Code source
│   ├── public/         # Assets statiques
│   └── dist/           # Build de production
├── server/              # API backend Node.js
│   ├── routes/          # Routes API
│   ├── controllers/     # Contrôleurs
│   └── middleware/      # Middleware Express
├── shared/              # Code partagé entre client et serveur
├── docs/                # Documentation
├── tests/               # Tests automatisés
├── vercel.json          # Configuration Vercel
└── package.json         # Dépendances racine
```

## 🌐 Déploiement

### Vercel (Recommandé)

Le projet est configuré pour un déploiement automatique sur Vercel :

- **Frontend** : Build automatique avec Vite
- **Backend** : Serverless functions avec Express
- **API Routes** : `/api/*` redirigées vers le serveur
- **Static Files** : Served depuis le build client

### Variables d'environnement Vercel

```bash
NODE_ENV=production
JWT_SECRET=votre-secret-jwt
ALLOWED_ORIGINS=https://votre-domaine.vercel.app
```

## 🚀 URLs de déploiement

- **Frontend** : `https://votre-projet.vercel.app`
- **API** : `https://votre-projet.vercel.app/api`
- **Health Check** : `https://votre-projet.vercel.app/api/health`

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur GitHub.

---

**Tagzai** - Organisez vos idées avec intelligence ✨