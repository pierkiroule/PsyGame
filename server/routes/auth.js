const express = require('express');
const router = express.Router();

// POST /api/auth/register - Inscription d'un nouvel utilisateur
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Tous les champs sont requis'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Le mot de passe doit contenir au moins 6 caractères'
      });
    }

    // TODO: Implémenter la logique d'inscription
    // - Vérifier que l'email n'existe pas déjà
    // - Hasher le mot de passe
    // - Créer l'utilisateur en base

    const newUser = {
      id: Date.now(),
      username,
      email,
      createdAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      data: newUser,
      message: 'Utilisateur créé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'inscription'
    });
  }
});

// POST /api/auth/login - Connexion utilisateur
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email et mot de passe requis'
      });
    }

    // TODO: Implémenter la logique de connexion
    // - Vérifier les credentials
    // - Générer un JWT token
    // - Retourner le token et les infos utilisateur

    const user = {
      id: 1,
      username: 'utilisateur_test',
      email: email,
      createdAt: new Date().toISOString()
    };

    const token = 'jwt_token_example_' + Date.now();

    res.json({
      success: true,
      data: {
        user,
        token
      },
      message: 'Connexion réussie'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la connexion'
    });
  }
});

// GET /api/auth/me - Récupérer les informations de l'utilisateur connecté
router.get('/me', async (req, res) => {
  try {
    // TODO: Implémenter la vérification du token JWT
    // - Extraire le token du header Authorization
    // - Vérifier la validité du token
    // - Retourner les infos utilisateur

    const user = {
      id: 1,
      username: 'utilisateur_test',
      email: 'test@example.com',
      createdAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: user,
      message: 'Informations utilisateur récupérées'
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Token invalide ou expiré'
    });
  }
});

// POST /api/auth/logout - Déconnexion utilisateur
router.post('/logout', async (req, res) => {
  try {
    // TODO: Implémenter la logique de déconnexion
    // - Invalider le token côté serveur si nécessaire
    
    res.json({
      success: true,
      message: 'Déconnexion réussie'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la déconnexion'
    });
  }
});

module.exports = router;