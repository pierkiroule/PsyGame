# 🏗️ Structure du Projet TagZai

## 📁 Organisation des fichiers

```
tagzai/
├── 📄 package.json              # Configuration npm et scripts
├── 📄 server.js                 # Serveur Express principal
├── 📄 extract.js                # Logique d'extraction des tags
├── 📄 .env.example              # Variables d'environnement d'exemple
├── 📄 .gitignore                # Fichiers à ignorer par Git
├── 📄 README.md                 # Documentation principale
├── 📄 API.md                    # Documentation détaillée des API
├── 📄 PROJECT_STRUCTURE.md      # Ce fichier
├── 📄 start.sh                  # Script de démarrage rapide
├── 📄 test.js                   # Test des fonctions d'extraction
├── 📄 test-api.js               # Test des endpoints de l'API
├── 📄 Dockerfile                # Configuration Docker
├── 📄 docker-compose.yml        # Orchestration Docker
├── 📄 ecosystem.config.js       # Configuration PM2
├── 📄 jest.config.js            # Configuration Jest
│
├── 📁 utils/
│   └── 📄 text.js               # Utilitaires de traitement de texte
│
└── 📁 db/
    ├── 📄 config.js             # Configuration PostgreSQL
    ├── 📄 init.js                # Script d'initialisation
    └── 📄 schema.sql             # Schéma SQL des tables
```

## 🔧 Fichiers principaux

### `server.js` - Serveur Express
- **Responsabilité** : Point d'entrée principal de l'API
- **Fonctionnalités** :
  - Configuration des middlewares (CORS, JSON parsing)
  - Définition de toutes les routes
  - Gestion des erreurs globales
  - Démarrage du serveur sur le port 4002

### `extract.js` - Extraction des tags
- **Responsabilité** : Logique métier d'extraction des tags
- **Fonctionnalités** :
  - Extraction des tags depuis un texte
  - Calcul des scores
  - Gestion des paramètres (title, top)

### `utils/text.js` - Utilitaires de texte
- **Responsabilité** : Traitement et normalisation du texte
- **Fonctionnalités** :
  - Normalisation des mots (minuscules, accents)
  - Tokenisation
  - Génération de bigrammes
  - Filtrage des stopwords

### `db/config.js` - Configuration base de données
- **Responsabilité** : Connexion à PostgreSQL
- **Fonctionnalités** :
  - Pool de connexions
  - Gestion des erreurs de connexion
  - Configuration via variables d'environnement

### `db/init.js` - Initialisation de la base
- **Responsabilité** : Création des tables et index
- **Fonctionnalités** :
  - Création des tables (tags, poem_tags, tag_stats, tag_co)
  - Création des index pour les performances
  - Création des vues utiles

## 🗄️ Structure de la base de données

### Tables principales

#### `tags`
```sql
- id (SERIAL PRIMARY KEY)
- name (VARCHAR(100) UNIQUE)
- norm (VARCHAR(100))           # Version normalisée
- created_at (TIMESTAMP)
```

#### `poem_tags`
```sql
- poem_id (VARCHAR(100))
- tag_id (INTEGER)
- created_at (TIMESTAMP)
- PRIMARY KEY (poem_id, tag_id)
```

#### `tag_stats`
```sql
- tag_id (INTEGER PRIMARY KEY)
- freq (INTEGER)                 # Fréquence d'utilisation
- last_seen (TIMESTAMP)          # Dernière apparition
```

#### `tag_co` (Co-occurrences)
```sql
- a (INTEGER)                    # Premier tag
- b (INTEGER)                    # Deuxième tag
- weight (INTEGER)               # Poids de la relation
- created_at (TIMESTAMP)
- CHECK (a < b)                  # Évite les doublons
```

### Index et performances
- Index sur `tags.norm` pour la recherche rapide
- Index sur `tag_stats.freq` et `tag_stats.last_seen`
- Index sur `tag_co.weight` pour les suggestions

## 🚀 Scripts disponibles

### npm scripts
```bash
npm start              # Démarrage en production
npm run dev            # Démarrage en développement (watch)
npm run init-db        # Initialisation de la base
npm test               # Exécution des tests Jest
npm run test:watch     # Tests en mode watch
npm run test:coverage  # Tests avec couverture
```

### PM2 scripts
```bash
npm run pm2:start      # Démarrage avec PM2
npm run pm2:stop       # Arrêt du processus PM2
npm run pm2:restart    # Redémarrage PM2
npm run pm2:logs       # Affichage des logs
npm run pm2:monit      # Monitoring PM2
```

### Scripts personnalisés
```bash
./start.sh             # Démarrage rapide avec vérifications
```

## 🔌 Endpoints de l'API

### Endpoints principaux
1. **POST /extract** - Extraction de tags
2. **POST /ingest** - Ingestion de poèmes
3. **POST /suggest** - Suggestions de tags
4. **GET /related/:tag** - Tags liés
5. **GET /trending** - Tags tendance
6. **POST /merge** - Fusion d'alias

### Endpoints bonus
7. **GET /stats** - Statistiques générales
8. **GET /stats/:tag** - Stats d'un tag
9. **GET /health** - État du service

## 🧪 Tests

### Tests unitaires
- `test.js` : Test des fonctions d'extraction
- `test-api.js` : Test des endpoints de l'API
- Configuration Jest pour la couverture de code

### Tests d'intégration
- Tests avec base de données réelle
- Validation des réponses HTTP
- Gestion des erreurs

## 🐳 Déploiement

### Docker
- `Dockerfile` : Image Node.js 18-alpine
- `docker-compose.yml` : PostgreSQL + API
- Volumes persistants pour les données

### PM2 (Production)
- `ecosystem.config.js` : Configuration multi-instances
- Mode cluster pour la performance
- Restart automatique et monitoring

## 🔧 Configuration

### Variables d'environnement
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=tagzai
DB_PASSWORD=password
DB_PORT=5432
PORT=4002
NODE_ENV=development
```

### Fichiers de configuration
- `.env` : Variables d'environnement (créé automatiquement)
- `ecosystem.config.js` : Configuration PM2
- `jest.config.js` : Configuration des tests

## 📊 Monitoring et logs

### Logs automatiques
- Requêtes HTTP avec timestamp
- Erreurs de base de données
- Opérations d'ingestion

### Métriques disponibles
- Nombre total de tags
- Fréquence d'utilisation
- Co-occurrences entre tags
- Statistiques de performance

## 🔒 Sécurité

### Actuellement implémenté
- Validation des paramètres d'entrée
- Gestion des erreurs SQL
- Transactions pour les opérations critiques

### À implémenter (futur)
- Authentification JWT
- Rate limiting
- Validation des schémas
- Logs de sécurité

## 🚀 Démarrage rapide

1. **Cloner et installer**
   ```bash
   cd tagzai
   npm install
   ```

2. **Configurer la base**
   ```bash
   # Créer la base PostgreSQL
   createdb tagzai
   
   # Initialiser les tables
   npm run init-db
   ```

3. **Démarrer l'API**
   ```bash
   # Mode développement
   npm run dev
   
   # Ou avec le script rapide
   ./start.sh
   ```

4. **Tester**
   ```bash
   # Test des fonctions
   node test.js
   
   # Test de l'API
   node test-api.js
   ```

## 📈 Évolutions futures

### Fonctionnalités prévues
- Authentification et autorisation
- Rate limiting et quotas
- Cache Redis pour les performances
- API GraphQL
- Webhooks pour les événements
- Interface d'administration

### Améliorations techniques
- Tests automatisés CI/CD
- Monitoring Prometheus/Grafana
- Logs structurés (JSON)
- Métriques de performance
- Documentation OpenAPI/Swagger

---

**TagZai** - Architecture modulaire et évolutive pour la gestion des tags de poèmes.