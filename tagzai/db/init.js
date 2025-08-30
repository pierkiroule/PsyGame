import pool from './config.js';

const initDatabase = async () => {
  try {
    console.log('🚀 Initialisation de la base de données...');
    
    // Création des tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tags (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        norm VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS poem_tags (
        poem_id VARCHAR(100) NOT NULL,
        tag_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (poem_id, tag_id),
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tag_stats (
        tag_id INTEGER PRIMARY KEY,
        freq INTEGER DEFAULT 1,
        last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tag_co (
        a INTEGER NOT NULL,
        b INTEGER NOT NULL,
        weight INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (a, b),
        FOREIGN KEY (a) REFERENCES tags(id) ON DELETE CASCADE,
        FOREIGN KEY (b) REFERENCES tags(id) ON DELETE CASCADE,
        CHECK (a < b)
      );
    `);
    
    // Index pour améliorer les performances
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_tags_norm ON tags(norm);
      CREATE INDEX IF NOT EXISTS idx_poem_tags_poem_id ON poem_tags(poem_id);
      CREATE INDEX IF NOT EXISTS idx_tag_stats_freq ON tag_stats(freq DESC);
      CREATE INDEX IF NOT EXISTS idx_tag_stats_last_seen ON tag_stats(last_seen DESC);
    `);
    
    console.log('✅ Base de données initialisée avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  } finally {
    await pool.end();
  }
};

initDatabase();