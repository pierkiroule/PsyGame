import { extractAllTokens, calculateTagScore } from './utils/text.js';

/**
 * Extrait les tags d'un texte avec scoring
 * @param {Object} params - Paramètres d'extraction
 * @param {string} params.text - Le texte à analyser
 * @param {string} [params.title] - Le titre optionnel
 * @param {number} [params.top] - Nombre maximum de tags à retourner
 * @returns {Object} - Objet contenant les tags avec leurs scores
 */
export function extractTags({ text, title = '', top = 20 }) {
  if (!text || typeof text !== 'string') {
    throw new Error('Le paramètre "text" est requis et doit être une chaîne');
  }
  
  if (top && (typeof top !== 'number' || top < 1)) {
    throw new Error('Le paramètre "top" doit être un nombre positif');
  }
  
  try {
    // Extraction de tous les tokens (mots + bigrammes)
    const allTokens = extractAllTokens(text);
    
    // Comptage des occurrences et calcul des scores
    const tagCounts = new Map();
    
    allTokens.forEach(token => {
      const score = calculateTagScore(token, text, title);
      
      if (tagCounts.has(token)) {
        tagCounts.set(token, tagCounts.get(token) + score);
      } else {
        tagCounts.set(token, score);
      }
    });
    
    // Conversion en tableau et tri par score décroissant
    const tagsWithScores = Array.from(tagCounts.entries())
      .map(([name, score]) => ({ name, score: Math.round(score * 100) / 100 }))
      .sort((a, b) => b.score - a.score);
    
    // Limitation du nombre de tags si demandé
    const limitedTags = top ? tagsWithScores.slice(0, top) : tagsWithScores;
    
    return {
      tags: limitedTags,
      total: tagsWithScores.length,
      processed: allTokens.length
    };
    
  } catch (error) {
    console.error('Erreur lors de l\'extraction des tags:', error);
    throw new Error(`Erreur d'extraction: ${error.message}`);
  }
}

/**
 * Extrait les tags d'un poème avec métadonnées
 * @param {Object} poem - Objet poème
 * @param {string} poem.text - Le texte du poème
 * @param {string} [poem.title] - Le titre du poème
 * @param {number} [poem.top] - Nombre maximum de tags
 * @returns {Object} - Tags extraits avec métadonnées
 */
export function extractPoemTags(poem) {
  const { text, title, top } = poem;
  
  if (!text) {
    throw new Error('Le texte du poème est requis');
  }
  
  const extraction = extractTags({ text, title, top });
  
  return {
    ...extraction,
    poem_info: {
      has_title: !!title,
      text_length: text.length,
      word_count: text.split(/\s+/).length
    }
  };
}