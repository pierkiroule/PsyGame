# 📚 Documentation de l'API TagZai

## 🌐 Base URL
```
http://localhost:4002
```

## 🔐 Authentification
Aucune authentification requise pour le moment.

## 📋 Endpoints

### 1. POST /extract
Extrait les tags d'un texte avec scoring automatique.

**Request Body:**
```json
{
  "text": "Le vent souffle sur la mer, les vagues dansent",
  "title": "Poème marin",
  "top": 10
}
```

**Paramètres:**
- `text` (requis): Le texte à analyser
- `title` (optionnel): Le titre du texte
- `top` (optionnel): Nombre maximum de tags à retourner (défaut: 20)

**Response (200):**
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

**Exemple cURL:**
```bash
curl -X POST http://localhost:4002/extract \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Le vent souffle sur la mer, les vagues dansent",
    "title": "Poème marin",
    "top": 10
  }'
```

---

### 2. POST /ingest
Ingère un poème, extrait ses tags et les stocke en base de données.

**Request Body:**
```json
{
  "poem_id": "poem_123",
  "text": "L'amour est une rose qui fleurit dans le jardin de l'âme",
  "title": "Rose d'amour"
}
```

**Paramètres:**
- `poem_id` (requis): Identifiant unique du poème
- `text` (requis): Le texte du poème
- `title` (optionnel): Le titre du poème

**Response (200):**
```json
{
  "success": true,
  "poem_id": "poem_123",
  "tags_ingested": 8,
  "tags": [
    {
      "id": 1,
      "name": "amour",
      "norm": "amour",
      "score": 3.5
    }
  ]
}
```

**Exemple cURL:**
```bash
curl -X POST http://localhost:4002/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "poem_id": "poem_123",
    "text": "L'amour est une rose qui fleurit dans le jardin de l'âme",
    "title": "Rose d'amour"
  }'
```

---

### 3. POST /suggest
Suggère des tags basés sur des tags existants et leurs co-occurrences.

**Request Body:**
```json
{
  "seed": ["amour", "rose"],
  "limit": 5
}
```

**Paramètres:**
- `seed` (requis): Tableau de tags de départ
- `limit` (optionnel): Nombre maximum de suggestions (défaut: 10)

**Response (200):**
```json
{
  "tags": [
    {
      "name": "jardin",
      "score": 15.0,
      "connections": 3
    },
    {
      "name": "fleurit",
      "score": 12.5,
      "connections": 2
    }
  ]
}
```

**Exemple cURL:**
```bash
curl -X POST http://localhost:4002/suggest \
  -H "Content-Type: application/json" \
  -d '{
    "seed": ["amour", "rose"],
    "limit": 5
  }'
```

---

### 4. GET /related/:tag
Retourne les tags les plus liés à un tag spécifique.

**Paramètres de chemin:**
- `tag`: Nom ou version normalisée du tag

**Paramètres de requête:**
- `limit` (optionnel): Nombre maximum de tags liés (défaut: 10)

**Response (200):**
```json
{
  "seed_tag": "amour",
  "related_tags": [
    {
      "name": "rose",
      "weight": 25,
      "frequency": 15
    },
    {
      "name": "jardin",
      "weight": 18,
      "frequency": 12
    }
  ]
}
```

**Exemple cURL:**
```bash
curl "http://localhost:4002/related/amour?limit=5"
```

---

### 5. GET /trending
Retourne les tags les plus fréquents récemment.

**Paramètres de requête:**
- `limit` (optionnel): Nombre maximum de tags (défaut: 20)
- `days` (optionnel): Période en jours (défaut: 7)

**Response (200):**
```json
{
  "period_days": 7,
  "trending_tags": [
    {
      "name": "amour",
      "frequency": 45,
      "last_seen": "2024-01-15T10:30:00Z"
    },
    {
      "name": "nature",
      "frequency": 32,
      "last_seen": "2024-01-15T09:15:00Z"
    }
  ]
}
```

**Exemple cURL:**
```bash
curl "http://localhost:4002/trending?limit=10&days=7"
```

---

### 6. POST /merge
Fusionne un alias de tag dans un tag canonique.

**Request Body:**
```json
{
  "from": "vent",
  "to": "breeze"
}
```

**Paramètres:**
- `from` (requis): Tag source à fusionner
- `to` (requis): Tag destination canonique

**Response (200):**
```json
{
  "success": true,
  "merged": "vent",
  "into": "breeze",
  "message": "Tag \"vent\" fusionné dans \"breeze\""
}
```

**Exemple cURL:**
```bash
curl -X POST http://localhost:4002/merge \
  -H "Content-Type: application/json" \
  -d '{
    "from": "vent",
    "to": "breeze"
  }'
```

---

### 7. GET /stats
Retourne les statistiques générales de l'API.

**Response (200):**
```json
{
  "total_tags": 1250,
  "top_tags": [
    {
      "name": "amour",
      "frequency": 156,
      "last_seen": "2024-01-15T10:30:00Z"
    }
  ],
  "co_occurrences": {
    "total_connections": 3420,
    "average_weight": 8.5,
    "max_weight": 45
  }
}
```

**Exemple cURL:**
```bash
curl http://localhost:4002/stats
```

---

### 8. GET /stats/:tag
Retourne les statistiques détaillées d'un tag spécifique.

**Paramètres de chemin:**
- `tag`: Nom ou version normalisée du tag

**Response (200):**
```json
{
  "tag": {
    "id": 1,
    "name": "amour",
    "normalized": "amour",
    "created_at": "2024-01-01T00:00:00Z",
    "frequency": 156,
    "last_seen": "2024-01-15T10:30:00Z",
    "poem_count": 89
  },
  "co_occurrences": [
    {
      "tag": "rose",
      "weight": 25,
      "frequency": 67
    }
  ]
}
```

**Exemple cURL:**
```bash
curl http://localhost:4002/stats/amour
```

---

### 9. GET /health
Vérifie l'état du service.

**Response (200):**
```json
{
  "status": "OK",
  "service": "tagzai",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Exemple cURL:**
```bash
curl http://localhost:4002/health
```

---

## 🚨 Codes d'erreur

### 400 Bad Request
```json
{
  "error": "Le paramètre \"text\" est requis"
}
```

### 404 Not Found
```json
{
  "error": "Tag non trouvé"
}
```

### 500 Internal Server Error
```json
{
  "error": "Erreur interne du serveur",
  "message": "Détails de l'erreur"
}
```

---

## 📊 Format des données

### Structure d'un tag
```json
{
  "name": "nom_du_tag",
  "score": 3.5,
  "frequency": 15,
  "weight": 8,
  "connections": 3
}
```

### Métadonnées de réponse
```json
{
  "total": 25,
  "processed": 45,
  "period_days": 7,
  "success": true
}
```

---

## 🔄 Rate Limiting
Aucune limitation de débit implémentée pour le moment.

## 📝 Logs
L'API génère des logs pour chaque requête avec timestamp et méthode HTTP.

## 🧪 Tests
Utilisez le fichier `test-api.js` pour tester tous les endpoints :

```bash
node test-api.js
```

---

## 📞 Support
Pour toute question ou problème, consultez le README.md ou les logs du serveur.