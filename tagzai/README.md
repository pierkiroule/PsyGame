# 🏷️ TagZai - API de gestion des tags pour PoemZaï

API Node.js (Express) pour l'extraction, l'ingestion et la gestion des tags de poèmes avec analyse des co-occurrences.

## 🚀 Fonctionnalités

### Endpoints principaux
- **POST /extract** - Extraction de tags depuis un texte
- **POST /ingest** - Ingestion d'un poème avec extraction et stockage
- **POST /suggest** - Suggestions de tags basées sur les co-occurrences
- **GET /related/:tag** - Tags liés à un tag spécifique
- **GET /trending** - Tags tendance récents
- **POST /merge** - Fusion d'alias de tags

### Endpoints bonus
- **GET /stats** - Statistiques générales
- **GET /stats/:tag** - Statistiques d'un tag spécifique
- **GET /health** - État du service

## 🛠️ Installation

### Prérequis
- Node.js 18+ 
- PostgreSQL 12+
- npm ou yarn

### 1. Installation des dépendances
```bash
cd tagzai
npm install
```

### 2. Configuration de la base de données
Créez un fichier `.env` à la racine du projet :
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=tagzai
DB_PASSWORD=votre_mot_de_passe
DB_PORT=5432
PORT=4002
```

### 3. Initialisation de la base de données
```bash
# Créer la base de données
createdb tagzai

# Initialiser les tables
npm run init-db
```

### 4. Démarrage du serveur
```bash
# Mode développement (avec rechargement automatique)
npm run dev

# Mode production
npm start
```

Le serveur sera accessible sur `http://localhost:4002`

## 📊 Structure de la base de données

### Tables principales
- **tags** : Tags avec normalisation
- **poem_tags** : Association poèmes-tags
- **tag_stats** : Statistiques d'utilisation
- **tag_co** : Co-occurrences entre tags

### Schéma détaillé
```sql
-- Voir db/schema.sql pour le schéma complet
```

## 🔧 Utilisation

### 1. Extraction de tags
```bash
curl -X POST http://localhost:4002/extract \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Le vent souffle sur la mer, les vagues dansent",
    "title": "Poème marin",
    "top": 10
  }'
```

### 2. Ingestion d'un poème
```bash
curl -X POST http://localhost:4002/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "poem_id": "poem_123",
    "text": "Le vent souffle sur la mer, les vagues dansent",
    "title": "Poème marin"
  }'
```

### 3. Suggestions de tags
```bash
curl -X POST http://localhost:4002/suggest \
  -H "Content-Type: application/json" \
  -d '{
    "seed": ["vent", "mer"],
    "limit": 5
  }'
```

### 4. Tags liés
```bash
curl http://localhost:4002/related/vent?limit=5
```

### 5. Tags tendance
```bash
curl "http://localhost:4002/trending?limit=10&days=7"
```

### 6. Fusion d'alias
```bash
curl -X POST http://localhost:4002/merge \
  -H "Content-Type: application/json" \
  -d '{
    "from": "vent",
    "to": "breeze"
  }'
```

## 🧠 Algorithme d'extraction

### Normalisation des mots
- Conversion en minuscules
- Suppression des accents
- Singulier naïf (suppression du 's' final)
- Suppression de la ponctuation

### Filtrage
- Suppression des stopwords français
- Filtrage des mots trop courts (< 2 caractères)
- Exclusion des nombres purs

### Bigrammes
- Génération automatique de bigrammes (mots collés avec "_")
- Exemple : "vent_mer", "vagues_dansent"

### Scoring
- Score de base : 1
- Bonus titre : +2
- Bonus bigramme : +1
- Bonus longueur : +0.5 (si > 6 caractères)

## 📈 Analyse des co-occurrences

L'API analyse automatiquement les relations entre tags :
- **Poids** : Nombre de co-occurrences
- **Fréquence** : Nombre d'utilisations totales
- **Dernière utilisation** : Timestamp de la dernière apparition

## 🔍 Exemples de réponses

### Extraction de tags
```json
{
  "tags": [
    {"name": "vent", "score": 3.5},
    {"name": "mer", "score": 3.0},
    {"name": "vagues", "score": 2.5},
    {"name": "vent_mer", "score": 2.0}
  ],
  "total": 4,
  "processed": 8
}
```

### Suggestions
```json
{
  "tags": [
    {"name": "océan", "score": 15.0, "connections": 3},
    {"name": "tempête", "score": 12.5, "connections": 2}
  ]
}
```

## 🚨 Gestion des erreurs

L'API retourne des codes HTTP appropriés :
- **400** : Erreur de validation des paramètres
- **404** : Ressource non trouvée
- **500** : Erreur interne du serveur

Format des erreurs :
```json
{
  "error": "Description de l'erreur",
  "message": "Détails supplémentaires"
}
```

## 🧪 Tests

### Test de santé
```bash
curl http://localhost:4002/health
```

### Test d'extraction simple
```bash
curl -X POST http://localhost:4002/extract \
  -H "Content-Type: application/json" \
  -d '{"text": "test simple"}'
```

## 🔧 Configuration avancée

### Variables d'environnement
- **DB_USER** : Utilisateur PostgreSQL
- **DB_HOST** : Hôte de la base de données
- **DB_NAME** : Nom de la base de données
- **DB_PASSWORD** : Mot de passe PostgreSQL
- **DB_PORT** : Port PostgreSQL (défaut: 5432)
- **PORT** : Port de l'API (défaut: 4002)

### Performance
- Index automatiques sur les colonnes fréquemment utilisées
- Pool de connexions PostgreSQL configuré
- Transactions pour les opérations critiques

## 📝 Logs

L'API génère des logs détaillés :
- Requêtes HTTP avec timestamp
- Erreurs de base de données
- Opérations d'ingestion
- Statistiques d'utilisation

## 🤝 Contribution

Pour contribuer au projet :
1. Fork le repository
2. Créer une branche feature
3. Implémenter les modifications
4. Tester avec la base de données
5. Soumettre une pull request

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

## 🆘 Support

En cas de problème :
1. Vérifier les logs du serveur
2. Contrôler la connexion à PostgreSQL
3. Vérifier la configuration des variables d'environnement
4. Consulter la documentation de l'API

---

**TagZai** - Fait avec ❤️ pour PoemZaï