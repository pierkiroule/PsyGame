# Guide de Déploiement Vercel - Tagzai

Ce guide vous accompagne dans le déploiement de votre application Tagzai sur Vercel.

## 🚀 Prérequis

- Compte Vercel (gratuit)
- Repository GitHub connecté
- Node.js 18+ installé localement

## 📋 Étapes de Déploiement

### 1. Préparation du Repository

Assurez-vous que votre repository contient :
- ✅ `vercel.json` (configuration Vercel)
- ✅ `package.json` avec scripts de build
- ✅ Structure client/server correcte
- ✅ Variables d'environnement configurées

### 2. Connexion à Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec votre compte GitHub
3. Cliquez sur "New Project"
4. Sélectionnez votre repository `tagzai`

### 3. Configuration du Projet

Vercel détectera automatiquement la configuration, mais vérifiez :

**Build Settings :**
- Framework Preset: `Other`
- Build Command: `npm run vercel-build`
- Output Directory: `client/dist`
- Install Command: `npm run install:all`

**Environment Variables :**
```bash
NODE_ENV=production
JWT_SECRET=votre-secret-jwt-super-securise
ALLOWED_ORIGINS=https://votre-projet.vercel.app
```

### 4. Déploiement

1. Cliquez sur "Deploy"
2. Attendez la fin du build (2-3 minutes)
3. Votre app sera accessible sur `https://votre-projet.vercel.app`

## 🔧 Configuration Avancée

### Variables d'Environnement

Dans le dashboard Vercel, allez dans Settings > Environment Variables :

```bash
# Production
NODE_ENV=production
JWT_SECRET=votre-secret-jwt
ALLOWED_ORIGINS=https://votre-projet.vercel.app

# Développement (optionnel)
NODE_ENV=development
JWT_SECRET=dev-secret
ALLOWED_ORIGINS=http://localhost:3000
```

### Domaine Personnalisé

1. Allez dans Settings > Domains
2. Ajoutez votre domaine
3. Configurez les DNS selon les instructions Vercel

## 📱 URLs de Déploiement

- **Frontend** : `https://votre-projet.vercel.app`
- **API** : `https://votre-projet.vercel.app/api`
- **Health Check** : `https://votre-projet.vercel.app/api/health`

## 🚨 Dépannage

### Erreurs de Build

1. **Dépendances manquantes** :
   ```bash
   npm run install:all
   ```

2. **Erreur TypeScript** :
   ```bash
   cd client && npm run build
   ```

3. **Erreur de port** :
   Vérifiez que le port 3001 n'est pas utilisé

### Erreurs de Runtime

1. **CORS** : Vérifiez `ALLOWED_ORIGINS`
2. **JWT** : Vérifiez `JWT_SECRET`
3. **API** : Vérifiez les routes dans `vercel.json`

## 🔄 Déploiement Automatique

- **Push sur `main`** → Déploiement automatique
- **Pull Request** → Preview automatique
- **Branch** → Déploiement sur URL unique

## 📊 Monitoring

Vercel fournit automatiquement :
- Analytics de performance
- Logs d'erreur
- Métriques de build
- Notifications de déploiement

## 🆘 Support

- **Documentation Vercel** : [vercel.com/docs](https://vercel.com/docs)
- **Support** : [vercel.com/support](https://vercel.com/support)
- **GitHub Issues** : Ouvrez une issue sur votre repository

---

**Tagzai** - Déployé avec ❤️ sur Vercel