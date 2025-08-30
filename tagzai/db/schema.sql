-- Schema d'initialisation pour l'API tagzai
-- Base de données: PostgreSQL

-- Table des tags
CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  norm VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table d'association poèmes-tags
CREATE TABLE IF NOT EXISTS poem_tags (
  poem_id VARCHAR(100) NOT NULL,
  tag_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (poem_id, tag_id),
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Table des statistiques des tags
CREATE TABLE IF NOT EXISTS tag_stats (
  tag_id INTEGER PRIMARY KEY,
  freq INTEGER DEFAULT 1,
  last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Table des co-occurrences entre tags
CREATE TABLE IF NOT EXISTS tag_co (
  a INTEGER NOT NULL,
  b INTEGER NOT NULL,
  weight INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (a, b),
  FOREIGN KEY (a) REFERENCES tags(id) ON DELETE CASCADE,
  FOREIGN KEY (b) REFERENCES tags(id) ON DELETE CASCADE,
  CHECK (a < b) -- Évite les doublons et assure l'ordre
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_tags_norm ON tags(norm);
CREATE INDEX IF NOT EXISTS idx_poem_tags_poem_id ON poem_tags(poem_id);
CREATE INDEX IF NOT EXISTS idx_tag_stats_freq ON tag_stats(freq DESC);
CREATE INDEX IF NOT EXISTS idx_tag_stats_last_seen ON tag_stats(last_seen DESC);
CREATE INDEX IF NOT EXISTS idx_tag_co_weight ON tag_co(weight DESC);

-- Commentaires sur les tables
COMMENT ON TABLE tags IS 'Table principale des tags avec normalisation';
COMMENT ON TABLE poem_tags IS 'Association entre poèmes et tags';
COMMENT ON TABLE tag_stats IS 'Statistiques d''utilisation des tags';
COMMENT ON TABLE tag_co IS 'Co-occurrences entre tags avec poids';

-- Vues utiles (optionnelles)
CREATE OR REPLACE VIEW tag_summary AS
SELECT 
  t.id,
  t.name,
  t.norm,
  ts.freq,
  ts.last_seen,
  COUNT(pt.poem_id) as poem_count
FROM tags t
LEFT JOIN tag_stats ts ON t.id = ts.tag_id
LEFT JOIN poem_tags pt ON t.id = pt.tag_id
GROUP BY t.id, t.name, t.norm, ts.freq, ts.last_seen;

-- Fonction pour nettoyer les tags orphelins
CREATE OR REPLACE FUNCTION cleanup_orphan_tags()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM tags 
  WHERE id NOT IN (SELECT DISTINCT tag_id FROM poem_tags);
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;