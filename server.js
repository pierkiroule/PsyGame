import express from "express";
import { extractTags } from "./extract.js";
import { pool, getClient, getOrCreateTag, linkPoemTag, incrementTagStats, incrementCooccurrence, suggestBySeeds, relatedToTag, trendingTags, mergeTags, findTagByName } from "./db.js";

const app = express();
app.use(express.json({ limit: "1mb" }));

// Simple logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health
app.get("/", (req, res) => {
  res.json({ name: "tagzai", status: "ok" });
});

// POST /extract
app.post("/extract", async (req, res) => {
  try {
    const { text, title = "", top } = req.body || {};
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Champ 'text' requis" });
    }
    const result = extractTags({ text, title, top });
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /ingest
app.post("/ingest", async (req, res) => {
  const { poem_id, text, title = "" } = req.body || {};
  if (!poem_id || !text) {
    return res.status(400).json({ error: "Champs 'poem_id' et 'text' requis" });
  }
  const client = await getClient();
  try {
    const { tags } = extractTags({ text, title, top: 30 });
    const uniqueNames = Array.from(new Set(tags.map(t => t.name)));

    await client.query("BEGIN");

    const created = [];
    for (const name of uniqueNames) {
      const tag = await getOrCreateTag(client, name);
      created.push(tag);
      await linkPoemTag(client, String(poem_id), tag.id);
      await incrementTagStats(client, tag.id);
    }

    // Update co-occurrences for all unordered pairs in this poem
    for (let i = 0; i < created.length; i++) {
      for (let j = i + 1; j < created.length; j++) {
        await incrementCooccurrence(client, created[i].id, created[j].id, 1);
      }
    }

    await client.query("COMMIT");
    return res.json({ tags: created.map(t => ({ name: t.name, score: 1 })) });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return res.status(500).json({ error: "Erreur d'ingestion" });
  } finally {
    client.release();
  }
});

// POST /suggest
app.post("/suggest", async (req, res) => {
  try {
    const { seed = [], limit = 10 } = req.body || {};
    if (!Array.isArray(seed) || seed.length === 0) {
      return res.status(400).json({ error: "Champ 'seed' doit être un tableau non vide" });
    }
    const client = await getClient();
    try {
      const suggestions = await suggestBySeeds(client, seed, limit);
      return res.json({ tags: suggestions });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET /related/:tag
app.get("/related/:tag", async (req, res) => {
  try {
    const tagName = req.params.tag;
    const client = await getClient();
    try {
      const related = await relatedToTag(client, tagName, Number(req.query.limit) || 20);
      return res.json({ tags: related });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET /trending
app.get("/trending", async (req, res) => {
  try {
    const days = Number(req.query.days) || 30;
    const limit = Number(req.query.limit) || 20;
    const client = await getClient();
    try {
      const tags = await trendingTags(client, days, limit);
      return res.json({ tags });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /merge
app.post("/merge", async (req, res) => {
  try {
    const { from, to } = req.body || {};
    if (!from || !to) {
      return res.status(400).json({ error: "Champs 'from' et 'to' requis" });
    }
    const client = await getClient();
    try {
      const merged = await mergeTags(client, from, to);
      return res.json({ ok: true, to: merged.name });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Erreur serveur" });
  }
});

// Bonus: GET /stats
app.get("/stats", async (req, res) => {
  const client = await getClient();
  try {
    const totalTags = await client.query(`SELECT COUNT(*)::int AS total FROM tags`);
    const top10 = await client.query(
      `SELECT t.name, s.freq::int AS score
       FROM tag_stats s JOIN tags t ON t.id = s.tag_id
       ORDER BY s.freq DESC LIMIT 10`
    );
    return res.json({ total: totalTags.rows[0].total, top: top10.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  } finally {
    client.release();
  }
});

// Bonus: GET /stats/:tag
app.get("/stats/:tag", async (req, res) => {
  const tagName = req.params.tag;
  const client = await getClient();
  try {
    const tag = await findTagByName(client, tagName);
    if (!tag) return res.status(404).json({ error: "Tag introuvable" });
    const stat = await client.query(`SELECT freq::int AS freq, last_seen FROM tag_stats WHERE tag_id = $1`, [tag.id]);
    const co = await client.query(
      `SELECT t.name, c.weight::int AS weight
       FROM tag_co c
       JOIN tags t ON t.id = CASE WHEN c.a = $1 THEN c.b ELSE c.a END
       WHERE c.a = $1 OR c.b = $1
       ORDER BY c.weight DESC LIMIT 20`,
      [tag.id]
    );
    return res.json({ tag: tag.name, stats: stat.rows[0] || { freq: 0 }, co: co.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  } finally {
    client.release();
  }
});

const PORT = Number(process.env.PORT) || 4002;
const server = app.listen(PORT, () => {
  console.log(`tagzai API listening on http://localhost:${PORT}`);
});

export default server;

