#!/bin/bash

echo "🚀 Démarrage de l'API TagZai..."

# Vérifier si PostgreSQL est en cours d'exécution
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "⚠️  PostgreSQL n'est pas accessible sur localhost:5432"
    echo "   Assurez-vous que PostgreSQL est démarré ou utilisez Docker:"
    echo "   docker-compose up -d postgres"
    echo ""
fi

# Vérifier les variables d'environnement
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env par défaut..."
    cp .env.example .env
    echo "   Modifiez le fichier .env avec vos paramètres de base de données"
    echo ""
fi

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
    echo ""
fi

# Initialiser la base de données si nécessaire
echo "🗄️  Vérification de la base de données..."
npm run init-db

# Démarrer l'API
echo "🎯 Démarrage de l'API sur le port 4002..."
echo "   Endpoints disponibles:"
echo "   - POST /extract     - Extraction de tags"
echo "   - POST /ingest      - Ingestion de poèmes"
echo "   - POST /suggest     - Suggestions de tags"
echo "   - GET  /related/:tag - Tags liés"
echo "   - GET  /trending    - Tags tendance"
echo "   - POST /merge       - Fusion d'alias"
echo "   - GET  /stats       - Statistiques"
echo "   - GET  /health      - État du service"
echo ""
echo "🌐 API accessible sur: http://localhost:4002"
echo "📊 Health check: http://localhost:4002/health"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter l'API"
echo ""

npm start