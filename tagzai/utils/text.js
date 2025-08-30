// Liste des mots vides (stopwords) français
const STOPWORDS = new Set([
  'le', 'la', 'les', 'un', 'une', 'des', 'ce', 'cette', 'ces', 'mon', 'ma', 'mes',
  'ton', 'ta', 'tes', 'son', 'sa', 'ses', 'notre', 'votre', 'leur', 'leurs',
  'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'me', 'te', 'se',
  'lui', 'leur', 'y', 'en', 'ceci', 'cela', 'ça', 'qui', 'que', 'quoi', 'dont',
  'où', 'quand', 'comment', 'pourquoi', 'combien', 'quel', 'quelle', 'quels', 'quelles',
  'et', 'ou', 'mais', 'donc', 'car', 'ni', 'or', 'puis', 'ensuite', 'alors',
  'de', 'du', 'des', 'à', 'au', 'aux', 'avec', 'sans', 'pour', 'par', 'dans',
  'sur', 'sous', 'entre', 'chez', 'vers', 'depuis', 'pendant', 'avant', 'après',
  'très', 'trop', 'peu', 'plus', 'moins', 'bien', 'mal', 'bon', 'bonne', 'mauvais',
  'grand', 'petit', 'nouveau', 'vieux', 'jeune', 'beau', 'joli', 'laid', 'gros',
  'fin', 'long', 'court', 'haut', 'bas', 'large', 'étroit', 'épais', 'mince',
  'ici', 'là', 'ailleurs', 'partout', 'nulle', 'dedans', 'dehors', 'dessus', 'dessous',
  'maintenant', 'aujourd', 'hier', 'demain', 'toujours', 'jamais', 'souvent', 'rarement',
  'beaucoup', 'assez', 'trop', 'peu', 'rien', 'quelque', 'certain', 'tout', 'toute',
  'tous', 'toutes', 'aucun', 'aucune', 'plusieurs', 'quelques', 'même', 'autre',
  'même', 'aussi', 'encore', 'déjà', 'bientôt', 'tard', 'tôt', 'vite', 'lentement'
]);

/**
 * Normalise un mot : minuscules, suppression des accents, singulier naïf
 */
export function normalizeWord(word) {
  if (!word || typeof word !== 'string') return '';
  
  // Conversion en minuscules
  let normalized = word.toLowerCase();
  
  // Suppression des accents
  normalized = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  // Suppression de la ponctuation
  normalized = normalized.replace(/[^\w\s]/g, '');
  
  // Singulier naïf (suppression du 's' final)
  if (normalized.length > 3 && normalized.endsWith('s')) {
    normalized = normalized.slice(0, -1);
  }
  
  // Suppression du 'e' final pour certains mots (plus conservateur)
  if (normalized.length > 5 && normalized.endsWith('e')) {
    const withoutE = normalized.slice(0, -1);
    if (withoutE.length >= 4) {
      normalized = withoutE;
    }
  }
  
  return normalized.trim();
}

/**
 * Tokenise un texte en mots normalisés
 */
export function tokenize(text) {
  if (!text || typeof text !== 'string') return [];
  
  // Division en mots
  const words = text.split(/\s+/);
  
  // Normalisation et filtrage
  const tokens = words
    .map(word => normalizeWord(word))
    .filter(word => 
      word.length >= 2 && 
      !STOPWORDS.has(word) && 
      !/^\d+$/.test(word) // Pas de nombres purs
    );
  
  return tokens;
}

/**
 * Génère les bigrammes à partir d'une liste de tokens
 */
export function bigrams(tokens) {
  if (!Array.isArray(tokens) || tokens.length < 2) return [];
  
  const bigrams = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    const bigram = `${tokens[i]}_${tokens[i + 1]}`;
    bigrams.push(bigram);
  }
  
  return bigrams;
}

/**
 * Extrait tous les tokens et bigrammes d'un texte
 */
export function extractAllTokens(text) {
  const tokens = tokenize(text);
  const bigramTokens = bigrams(tokens);
  
  return [...tokens, ...bigramTokens];
}

/**
 * Calcule le score d'un tag basé sur sa position et fréquence
 */
export function calculateTagScore(tag, text, title = '') {
  let score = 1;
  
  // Bonus si le tag apparaît dans le titre
  if (title && title.toLowerCase().includes(tag.toLowerCase())) {
    score += 2;
  }
  
  // Bonus pour les bigrammes (plus spécifiques)
  if (tag.includes('_')) {
    score += 1;
  }
  
  // Bonus pour la longueur (mots plus longs = plus spécifiques)
  if (tag.length > 6) {
    score += 0.5;
  }
  
  return score;
}