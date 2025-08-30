import { tokenize, bigrams } from "./utils/text.js";

// Extracts tags from text/title, returning sorted array of { name, score }
export function extractTags({ text, title = "", top = 15 } = {}) {
  if (!text || typeof text !== "string") {
    return { tags: [] };
  }

  const titleTokens = tokenize(title);
  const bodyTokens = tokenize(text);
  const titleSet = new Set(titleTokens);

  const unigramScores = new Map();

  // Unigram scoring: TF with title boost
  for (const t of bodyTokens) {
    const prev = unigramScores.get(t) || 0;
    unigramScores.set(t, prev + 1);
  }
  for (const t of titleTokens) {
    const prev = unigramScores.get(t) || 0;
    unigramScores.set(t, prev + 2); // title boost
  }

  // Bigrams with modest boost
  const bodyBigrams = bigrams(bodyTokens);
  const titleBigrams = bigrams(titleTokens);
  const bigramScores = new Map();
  for (const g of bodyBigrams) {
    const prev = bigramScores.get(g) || 0;
    bigramScores.set(g, prev + 1.5);
  }
  for (const g of titleBigrams) {
    const prev = bigramScores.get(g) || 0;
    bigramScores.set(g, prev + 2.5); // extra for appearing in title
  }

  // Merge scores
  const combined = new Map();
  for (const [k, v] of unigramScores.entries()) combined.set(k, (combined.get(k) || 0) + v);
  for (const [k, v] of bigramScores.entries()) combined.set(k, (combined.get(k) || 0) + v);

  // Sort and slice
  const sorted = Array.from(combined.entries())
    .map(([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(1, top | 0));

  return { tags: sorted };
}

export default extractTags;

