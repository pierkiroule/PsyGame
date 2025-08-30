const express = require('express');
const router = express.Router();

// GET /api/categories - Récupérer toutes les catégories
router.get('/', async (req, res) => {
  try {
    // TODO: Implémenter la logique de récupération des catégories
    res.json({
      success: true,
      data: [
        { id: 1, name: 'Technologie', description: 'Catégorie pour les sujets technologiques', tagCount: 25 },
        { id: 2, name: 'Design', description: 'Catégorie pour le design et la créativité', tagCount: 18 },
        { id: 3, name: 'Business', description: 'Catégorie pour les sujets business', tagCount: 22 }
      ],
      message: 'Catégories récupérées avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des catégories'
    });
  }
});

// GET /api/categories/:id - Récupérer une catégorie spécifique
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implémenter la logique de récupération d'une catégorie
    res.json({
      success: true,
      data: {
        id: parseInt(id),
        name: 'Technologie',
        description: 'Catégorie pour les sujets technologiques',
        tagCount: 25,
        createdAt: new Date().toISOString()
      },
      message: 'Catégorie récupérée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération de la catégorie'
    });
  }
});

// POST /api/categories - Créer une nouvelle catégorie
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Le nom de la catégorie est requis'
      });
    }

    // TODO: Implémenter la logique de création de catégorie
    const newCategory = {
      id: Date.now(),
      name,
      description: description || '',
      tagCount: 0,
      createdAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      data: newCategory,
      message: 'Catégorie créée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création de la catégorie'
    });
  }
});

// PUT /api/categories/:id - Mettre à jour une catégorie
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    // TODO: Implémenter la logique de mise à jour
    res.json({
      success: true,
      data: {
        id: parseInt(id),
        name: name || 'Technologie',
        description: description || 'Catégorie pour les sujets technologiques',
        tagCount: 25,
        updatedAt: new Date().toISOString()
      },
      message: 'Catégorie mise à jour avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour de la catégorie'
    });
  }
});

// DELETE /api/categories/:id - Supprimer une catégorie
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // TODO: Implémenter la logique de suppression
    res.json({
      success: true,
      message: `Catégorie ${id} supprimée avec succès`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression de la catégorie'
    });
  }
});

module.exports = router;