// Text utilities for normalization and tokenization (ES modules)

const FRENCH_STOPWORDS = new Set([
  "a", "à", "ai", "aie", "ainsi", "après", "au", "aucun", "aura", "aurai", "auraient", "aurais", "aurait", "auras", "avaient", "avais", "avait", "avec", "avoir", "avons", "aux", "avaient", "bah", "beaucoup", "car", "ce", "cela", "ces", "cette", "ceci", "cet", "ceux", "chaque", "ci", "comme", "comment", "d", "dans", "de", "des", "du", "donc", "dont", "déjà", "elle", "elles", "en", "encore", "est", "et", "étaient", "étais", "était", "été", "être", "eu", "eux", "fait", "fais", "faisait", "faut", "hors", "ici", "il", "ils", "je", "l", "la", "le", "les", "leur", "lui", "mais", "mal", "me", "même", "mes", "moi", "mon", "ne", "ni", "nos", "notre", "nous", "on", "ou", "où", "par", "parce", "pas", "peu", "peut", "peuvent", "plus", "pour", "pourquoi", "qu", "quand", "que", "quel", "quelle", "quelles", "quels", "qui", "sa", "sans", "se", "ses", "si", "sien", "soi", "soit", "son", "sont", "sous", "sur", "ta", "tandis", "te", "tes", "toi", "ton", "tous", "tout", "toute", "toutes", "tu", "un", "une", "vos", "votre", "vous", "y", "ça", "c", "dès", "jusqu", "là", "vers"
]);

const ENGLISH_STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "if", "in", "into", "is", "it", "no", "not", "of", "on", "or", "such", "that", "the", "their", "then", "there", "these", "they", "this", "to", "was", "will", "with"
]);

const PUNCTUATION_REGEX = /[^\p{L}\p{N}\s_'-]+/gu;

export function normalizeWord(input) {
  if (!input) return "";
  // Lowercase
  let word = String(input).toLowerCase();
  // Remove punctuation except intra-word hyphens/underscores/apostrophes
  word = word.replace(PUNCTUATION_REGEX, " ");
  // Trim separators and collapse spaces
  word = word.trim().replace(/\s+/g, " ");
  // Remove diacritics
  word = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // Remove leading/trailing non alphanumerics and separators
  word = word.replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, "");
  // Naive singularization
  word = naiveSingular(word);
  return word;
}

function naiveSingular(token) {
  if (!token) return token;
  // Very naive heuristics suitable for tags; avoid over-aggressive stemming
  if (token.length > 4) {
    if (/(aux)$/.test(token)) {
      // animaux -> animal (roughly); faux positives possible
      return token.replace(/aux$/, "al");
    }
    if (/(eaux)$/.test(token)) {
      return token.replace(/eaux$/, "eau");
    }
    if (/(ches|shes|xes|ses|zes)$/.test(token)) {
      return token.replace(/(ches|shes|xes|ses|zes)$/, "");
    }
    if (/(ies)$/.test(token)) {
      return token.replace(/ies$/, "y");
    }
    if (/(s)$/.test(token)) {
      return token.replace(/s$/, "");
    }
  }
  return token;
}

export function tokenize(text) {
  if (!text) return [];
  // Replace punctuation with spaces, keep Unicode letters and numbers
  const cleaned = String(text).replace(PUNCTUATION_REGEX, " ");
  const raw = cleaned.split(/[^\p{L}\p{N}_'-]+/u).filter(Boolean);
  const tokens = [];
  for (const rawToken of raw) {
    const norm = normalizeWord(rawToken);
    if (!norm) continue;
    if (isStopword(norm)) continue;
    if (norm.length < 2) continue;
    tokens.push(norm);
  }
  return tokens;
}

export function bigrams(tokens) {
  const grams = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    const a = tokens[i];
    const b = tokens[i + 1];
    if (!a || !b) continue;
    if (isStopword(a) || isStopword(b)) continue;
    grams.push(`${a}_${b}`);
  }
  return grams;
}

export function isStopword(token) {
  if (!token) return false;
  return FRENCH_STOPWORDS.has(token) || ENGLISH_STOPWORDS.has(token);
}

