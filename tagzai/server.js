import express from 'express';
import cors from 'cors';
import { extractTags } from './extract.js';
import pool from './db/config.js';

const app = express();
const PORT = process.env.PORT || 4002;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 1. POST /extract - Extraction de tags
app.post('/extract', async (req, res) => {
  try {
    const { text, title, top } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Le paramètre "text" est requis' });
    }
    
    const result = extractTags({ text, title, top });
    res.json(result);
    
  } catch (error) {
    console.error('Erreur /extract:', error);
    res.status(400).json({ error: error.message });
  }
});

// 2. POST /ingest - Ingestion d'un poème avec extraction et stockage
app.post('/ingest', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { poem_id, text, title } = req.body;
    
    if (!poem_id || !text) {
      return res.status(400).json({ 
        error: 'Les paramètres "poem_id" et "text" sont requis' 
      });
    }
    
    // Extraction des tags
    const extractedTags = extractTags({ text, title });
    
    // Début de transaction
    await client.query('BEGIN');
    
    const ingestedTags = [];
    
    // Traitement de chaque tag
    for (const tagData of extractedTags.tags) {
      const { name, score } = tagData;
      const norm = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      
      // Insertion ou récupération du tag
      let tagResult = await client.query(
        'SELECT id FROM tags WHERE norm = $1',
        [norm]
      );
      
      let tagId;
      if (tagResult.rows.length === 0) {
        // Nouveau tag
        const newTag = await client.query(
          'INSERT INTO tags (name, norm) VALUES ($1, $2) RETURNING id',
          [name, norm]
        );
        tagId = newTag.rows[0].id;
        
        // Initialisation des stats
        await client.query(
          'INSERT INTO tag_stats (tag_id, freq, last_seen) VALUES ($1, 1, NOW())',
          [tagId]
        );
      } else {
        // Tag existant
        tagId = tagResult.rows[0].id;
        
        // Mise à jour des stats
        await client.query(
          'UPDATE tag_stats SET freq = freq + 1, last_seen = NOW() WHERE tag_id = $1',
          [tagId]
        );
      }
      
      // Association poème-tag
      await client.query(
        'INSERT INTO poem_tags (poem_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [poem_id, tagId]
      );
      
      ingestedTags.push({ id: tagId, name, norm, score });
    }
    
    // Mise à jour des co-occurrences
    for (let i = 0; i < ingestedTags.length; i++) {
      for (let j = i + 1; j < ingestedTags.length; j++) {
        const tagA = Math.min(ingestedTags[i].id, ingestedTags[j].id);
        const tagB = Math.max(ingestedTags[i].id, ingestedTags[j].id);
        
        await client.query(`
          INSERT INTO tag_co (a, b, weight) VALUES ($1, $2, 1)
          ON CONFLICT (a, b) DO UPDATE SET weight = tag_co.weight + 1
        `, [tagA, tagB]);
      }
    }
    
    await client.query('COMMIT');
    
    res.json({
      success: true,
      poem_id,
      tags_ingested: ingestedTags.length,
      tags: ingestedTags
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erreur /ingest:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// 3. POST /suggest - Suggestions de tags basées sur les co-occurrences
app.post('/suggest', async (req, res) => {
  try {
    const { seed, limit = 10 } = req.body;
    
    if (!seed || !Array.isArray(seed) || seed.length === 0) {
      return res.status(400).json({ 
        error: 'Le paramètre "seed" doit être un tableau non vide de tags' 
      });
    }
    
    // Récupération des IDs des tags seed
    const seedIds = await pool.query(
      'SELECT id FROM tags WHERE name = ANY($1)',
      [seed]
    );
    
    if (seedIds.rows.length === 0) {
      return res.json({ tags: [] });
    }
    
    const seedTagIds = seedIds.rows.map(row => row.id);
    
    // Recherche des co-occurrences
    const suggestions = await pool.query(`
      SELECT 
        t.id,
        t.name,
        SUM(tc.weight) as total_weight,
        COUNT(DISTINCT tc.a) + COUNT(DISTINCT tc.b) as connections
      FROM tags t
      JOIN tag_co tc ON (t.id = tc.a OR t.id = tc.b)
      WHERE (tc.a = ANY($1) OR tc.b = ANY($1))
        AND t.id != ALL($1)
      GROUP BY t.id, t.name
      ORDER BY total_weight DESC, connections DESC
      LIMIT $2
    `, [seedTagIds, limit]);
    
    const tags = suggestions.rows.map(row => ({
      name: row.name,
      score: Math.round(row.total_weight * 100) / 100,
      connections: row.connections
    }));
    
    res.json({ tags });
    
  } catch (error) {
    console.error('Erreur /suggest:', error);
    res.status(500).json({ error: error.message });
  }
});

// 4. GET /related/:tag - Tags liés à un tag spécifique
app.get('/related/:tag', async (req, res) => {
  try {
    const { tag } = req.params;
    const { limit = 10 } = req.query;
    
    // Recherche du tag
    const tagResult = await pool.query(
      'SELECT id FROM tags WHERE name = $1 OR norm = $1',
      [tag]
    );
    
    if (tagResult.rows.length === 0) {
      return res.status(404).json({ error: 'Tag non trouvé' });
    }
    
    const tagId = tagResult.rows[0].id;
    
    // Récupération des tags liés
    const related = await pool.query(`
      SELECT 
        t.id,
        t.name,
        tc.weight,
        ts.freq
      FROM tags t
      JOIN tag_co tc ON (t.id = tc.a OR t.id = tc.b)
      JOIN tag_stats ts ON t.id = ts.tag_id
      WHERE (tc.a = $1 OR tc.b = $1)
        AND t.id != $1
      ORDER BY tc.weight DESC, ts.freq DESC
      LIMIT $2
    `, [tagId, limit]);
    
    const tags = related.rows.map(row => ({
      name: row.name,
      weight: row.weight,
      frequency: row.freq
    }));
    
    res.json({ 
      seed_tag: tag,
      related_tags: tags 
    });
    
  } catch (error) {
    console.error('Erreur /related:', error);
    res.status(500).json({ error: error.message });
  }
});

// 5. GET /trending - Tags tendance
app.get('/trending', async (req, res) => {
  try {
    const { limit = 20, days = 7 } = req.query;
    
    const trending = await pool.query(`
      SELECT 
        t.id,
        t.name,
        ts.freq,
        ts.last_seen
      FROM tags t
      JOIN tag_stats ts ON t.id = ts.tag_id
      WHERE ts.last_seen >= NOW() - INTERVAL '${days} days'
      ORDER BY ts.freq DESC, ts.last_seen DESC
      LIMIT $1
    `, [limit]);
    
    const tags = trending.rows.map(row => ({
      name: row.name,
      frequency: row.freq,
      last_seen: row.last_seen
    }));
    
    res.json({ 
      period_days: parseInt(days),
      trending_tags: tags 
    });
    
  } catch (error) {
    console.error('Erreur /trending:', error);
    res.status(500).json({ error: error.message });
  }
});

// 6. POST /merge - Fusion d'alias
app.post('/merge', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { from, to } = req.body;
    
    if (!from || !to) {
      return res.status(400).json({ 
        error: 'Les paramètres "from" et "to" sont requis' 
      });
    }
    
    if (from === to) {
      return res.status(400).json({ 
        error: 'Les tags source et destination doivent être différents' 
      });
    }
    
    await client.query('BEGIN');
    
    // Récupération des IDs
    const fromResult = await client.query(
      'SELECT id FROM tags WHERE name = $1 OR norm = $1',
      [from]
    );
    
    const toResult = await client.query(
      'SELECT id FROM tags WHERE name = $1 OR norm = $1',
      [to]
    );
    
    if (fromResult.rows.length === 0) {
      return res.status(404).json({ error: 'Tag source non trouvé' });
    }
    
    if (toResult.rows.length === 0) {
      return res.status(404).json({ error: 'Tag destination non trouvé' });
    }
    
    const fromId = fromResult.rows[0].id;
    const toId = toResult.rows[0].id;
    
    // Mise à jour des associations poème-tag
    await client.query(
      'UPDATE poem_tags SET tag_id = $1 WHERE tag_id = $2',
      [toId, fromId]
    );
    
    // Mise à jour des co-occurrences
    await client.query(`
      UPDATE tag_co SET a = $1 WHERE a = $2
    `, [toId, fromId]);
    
    await client.query(`
      UPDATE tag_co SET b = $1 WHERE b = $2
    `, [toId, fromId]);
    
    // Fusion des poids des co-occurrences
    await client.query(`
      UPDATE tag_co 
      SET weight = weight + (
        SELECT COALESCE(SUM(weight), 0) 
        FROM tag_co 
        WHERE (a = $1 AND b = $2) OR (a = $2 AND b = $1)
      )
      WHERE (a = $1 AND b = $2) OR (a = $2 AND b = $1)
    `, [toId, fromId]);
    
    // Suppression des doublons et du tag source
    await client.query('DELETE FROM tag_co WHERE a = $1 OR b = $1', [fromId]);
    await client.query('DELETE FROM tag_stats WHERE tag_id = $1', [fromId]);
    await client.query('DELETE FROM tags WHERE id = $1', [fromId]);
    
    await client.query('COMMIT');
    
    res.json({ 
      success: true,
      merged: from,
      into: to,
      message: `Tag "${from}" fusionné dans "${to}"`
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erreur /merge:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// Bonus: GET /stats - Statistiques générales
app.get('/stats', async (req, res) => {
  try {
    // Nombre total de tags
    const totalTags = await pool.query('SELECT COUNT(*) FROM tags');
    
    // Top 10 des tags les plus fréquents
    const topTags = await pool.query(`
      SELECT 
        t.name,
        ts.freq,
        ts.last_seen
      FROM tags t
      JOIN tag_stats ts ON t.id = ts.tag_id
      ORDER BY ts.freq DESC
      LIMIT 10
    `);
    
    // Statistiques des co-occurrences
    const coOccurrences = await pool.query(`
      SELECT 
        COUNT(*) as total_connections,
        AVG(weight) as avg_weight,
        MAX(weight) as max_weight
      FROM tag_co
    `);
    
    res.json({
      total_tags: parseInt(totalTags.rows[0].count),
      top_tags: topTags.rows.map(row => ({
        name: row.name,
        frequency: row.freq,
        last_seen: row.last_seen
      })),
      co_occurrences: {
        total_connections: parseInt(coOccurrences.rows[0].total_connections),
        average_weight: Math.round(coOccurrences.rows[0].avg_weight * 100) / 100,
        max_weight: parseInt(coOccurrences.rows[0].max_weight)
      }
    });
    
  } catch (error) {
    console.error('Erreur /stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Bonus: GET /stats/:tag - Statistiques d'un tag spécifique
app.get('/stats/:tag', async (req, res) => {
  try {
    const { tag } = req.params;
    
    // Recherche du tag
    const tagResult = await pool.query(`
      SELECT 
        t.id,
        t.name,
        t.norm,
        t.created_at,
        ts.freq,
        ts.last_seen
      FROM tags t
      JOIN tag_stats ts ON t.id = ts.tag_id
      WHERE t.name = $1 OR t.norm = $1
    `, [tag]);
    
    if (tagResult.rows.length === 0) {
      return res.status(404).json({ error: 'Tag non trouvé' });
    }
    
    const tagInfo = tagResult.rows[0];
    
    // Co-occurrences
    const coOccurrences = await pool.query(`
      SELECT 
        t.name,
        tc.weight,
        ts.freq
      FROM tags t
      JOIN tag_co tc ON (t.id = tc.a OR t.id = tc.b)
      JOIN tag_stats ts ON t.id = ts.tag_id
      WHERE (tc.a = $1 OR tc.b = $1)
        AND t.id != $1
      ORDER BY tc.weight DESC
      LIMIT 20
    `, [tagInfo.id]);
    
    // Poèmes utilisant ce tag
    const poemCount = await pool.query(`
      SELECT COUNT(*) FROM poem_tags WHERE tag_id = $1
    `, [tagInfo.id]);
    
    res.json({
      tag: {
        id: tagInfo.id,
        name: tagInfo.name,
        normalized: tagInfo.norm,
        created_at: tagInfo.created_at,
        frequency: tagInfo.freq,
        last_seen: tagInfo.last_seen,
        poem_count: parseInt(poemCount.rows[0].count)
      },
      co_occurrences: coOccurrences.rows.map(row => ({
        tag: row.name,
        weight: row.weight,
        frequency: row.freq
      }))
    });
    
  } catch (error) {
    console.error('Erreur /stats/:tag:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route de santé
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'tagzai',
    timestamp: new Date().toISOString() 
  });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route non trouvée',
    available_routes: [
      'POST /extract',
      'POST /ingest', 
      'POST /suggest',
      'GET /related/:tag',
      'GET /trending',
      'POST /merge',
      'GET /stats',
      'GET /stats/:tag',
      'GET /health'
    ]
  });
});

// Gestion des erreurs globales
app.use((error, req, res, next) => {
  console.error('Erreur globale:', error);
  res.status(500).json({ 
    error: 'Erreur interne du serveur',
    message: error.message 
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 API tagzai démarrée sur le port ${PORT}`);
  console.log(`📊 Base de données: ${process.env.DB_NAME || 'tagzai'}`);
  console.log(`🔗 Endpoints disponibles:`);
  console.log(`   POST /extract - Extraction de tags`);
  console.log(`   POST /ingest - Ingestion de poèmes`);
  console.log(`   POST /suggest - Suggestions de tags`);
  console.log(`   GET /related/:tag - Tags liés`);
  console.log(`   GET /trending - Tags tendance`);
  console.log(`   POST /merge - Fusion d'alias`);
  console.log(`   GET /stats - Statistiques générales`);
  console.log(`   GET /stats/:tag - Stats d'un tag`);
  console.log(`   GET /health - État du service`);
});

export default app;