#!/bin/bash

# Script de build pour Vercel - Tagzai
echo "🚀 Démarrage du build Vercel pour Tagzai..."

# Vérifier la version de Node.js
echo "📋 Version Node.js: $(node --version)"
echo "📋 Version npm: $(npm --version)"

# Installer les dépendances racine
echo "📦 Installation des dépendances racine..."
npm install

# Installer les dépendances du serveur
echo "📦 Installation des dépendances du serveur..."
cd server
npm install
cd ..

# Installer les dépendances du client
echo "📦 Installation des dépendances du client..."
cd client
npm install

# Build du client
echo "🔨 Build du client React..."
npm run build

# Vérifier que le build a réussi
if [ -d "dist" ]; then
    echo "✅ Build du client réussi"
    echo "📁 Contenu du dossier dist:"
    ls -la dist/
else
    echo "❌ Échec du build du client"
    exit 1
fi

cd ..

echo "🎉 Build Vercel terminé avec succès!"
echo "📁 Structure finale:"
echo "   - server/ (API backend)"
echo "   - client/dist/ (Frontend build)"
echo "   - vercel.json (Configuration Vercel)"