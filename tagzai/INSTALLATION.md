# 🚀 Installation Rapide de TagZai

## ⚡ Démarrage en 3 étapes

### 1. Installation des dépendances
```bash
cd tagzai
npm install
```

### 2. Configuration de la base de données
```bash
# Créer la base PostgreSQL
createdb tagzai

# Initialiser les tables
npm run init-db
```

### 3. Démarrage de l'API
```bash
# Mode développement (rechargement automatique)
npm run dev

# Ou avec le script rapide
./start.sh
```

## 🌐 Accès à l'API
- **URL** : http://localhost:4002
- **Health check** : http://localhost:4002/health
- **Documentation** : Voir `API.md`

## 🧪 Tests rapides
```bash
# Test des fonctions d'extraction
node test.js

# Test des endpoints de l'API
node test-api.js
```

## 📊 Endpoints disponibles
1. **POST /extract** - Extraction de tags
2. **POST /ingest** - Ingestion de poèmes  
3. **POST /suggest** - Suggestions de tags
4. **GET /related/:tag** - Tags liés
5. **GET /trending** - Tags tendance
6. **POST /merge** - Fusion d'alias
7. **GET /stats** - Statistiques générales
8. **GET /stats/:tag** - Stats d'un tag
9. **GET /health** - État du service

## 🔧 Configuration
- **Port** : 4002 (modifiable via variable PORT)
- **Base de données** : PostgreSQL (modifiable via variables DB_*)
- **Variables d'environnement** : Copier `.env.example` vers `.env`

## 🐳 Avec Docker
```bash
# Démarrer PostgreSQL + API
docker-compose up -d

# Voir les logs
docker-compose logs -f api
```

## 📚 Documentation complète
- **README.md** : Vue d'ensemble du projet
- **API.md** : Documentation détaillée des endpoints
- **PROJECT_STRUCTURE.md** : Architecture et structure du code

---

**TagZai est prêt ! 🎉**