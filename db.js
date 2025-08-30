import pg from "pg";
import { normalizeWord } from "./utils/text.js";

const { Pool } = pg;

const DEFAULT_DB_URL = "postgresql://localhost:5432/tagzai";
const connectionString = process.env.DATABASE_URL || DEFAULT_DB_URL;

export const pool = new Pool({ connectionString });

export async function getClient() {
  return pool.connect();
}

export async function getOrCreateTag(client, name) {
  const norm = normalizeWord(name);
  if (!norm) throw new Error("Invalid tag name");
  const { rows } = await client.query(
    `INSERT INTO tags (name, norm)
     VALUES ($1, $2)
     ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
     RETURNING id, name, norm`,
    [norm, norm]
  );
  return rows[0];
}

export async function findTagByName(client, name) {
  const norm = normalizeWord(name);
  const { rows } = await client.query(`SELECT * FROM tags WHERE name = $1 OR norm = $1 LIMIT 1`, [norm]);
  return rows[0] || null;
}

export async function linkPoemTag(client, poemId, tagId) {
  await client.query(
    `INSERT INTO poem_tags (poem_id, tag_id)
     VALUES ($1, $2)
     ON CONFLICT (poem_id, tag_id) DO NOTHING`,
    [poemId, tagId]
  );
}

export async function incrementTagStats(client, tagId) {
  await client.query(
    `INSERT INTO tag_stats (tag_id, freq, last_seen)
     VALUES ($1, 1, NOW())
     ON CONFLICT (tag_id) DO UPDATE SET freq = tag_stats.freq + 1, last_seen = NOW()`,
    [tagId]
  );
}

export async function incrementCooccurrence(client, a, b, weightInc = 1) {
  const x = Math.min(a, b);
  const y = Math.max(a, b);
  if (x === y) return;
  await client.query(
    `INSERT INTO tag_co (a, b, weight)
     VALUES ($1, $2, $3)
     ON CONFLICT (a, b) DO UPDATE SET weight = tag_co.weight + EXCLUDED.weight`,
    [x, y, weightInc]
  );
}

export async function suggestBySeeds(client, seedNames, limit = 10) {
  const norms = seedNames.map(normalizeWord).filter(Boolean);
  if (norms.length === 0) return [];
  const { rows: seedRows } = await client.query(`SELECT id FROM tags WHERE name = ANY($1::text[]) OR norm = ANY($1::text[])`, [norms]);
  const seedIds = seedRows.map(r => r.id);
  if (seedIds.length === 0) return [];

  const { rows } = await client.query(
    `WITH edges AS (
       SELECT CASE WHEN a = ANY($1::bigint[]) THEN b ELSE a END AS other, weight
       FROM tag_co
       WHERE a = ANY($1::bigint[]) OR b = ANY($1::bigint[])
     )
     SELECT t.name, SUM(e.weight) AS score
     FROM edges e
     JOIN tags t ON t.id = e.other
     WHERE t.id <> ALL($1::bigint[])
     GROUP BY t.id, t.name
     ORDER BY score DESC
     LIMIT $2`,
    [seedIds, Math.max(1, limit | 0)]
  );
  return rows.map(r => ({ name: r.name, score: Number(r.score) }));
}

export async function relatedToTag(client, tagName, limit = 20) {
  const tag = await findTagByName(client, tagName);
  if (!tag) return [];
  const { rows } = await client.query(
    `SELECT t.name, c.weight AS score
     FROM tag_co c
     JOIN tags t ON t.id = CASE WHEN c.a = $1 THEN c.b ELSE c.a END
     WHERE c.a = $1 OR c.b = $1
     ORDER BY c.weight DESC
     LIMIT $2`,
    [tag.id, Math.max(1, limit | 0)]
  );
  return rows.map(r => ({ name: r.name, score: Number(r.score) }));
}

export async function trendingTags(client, windowDays = 30, limit = 20) {
  const { rows } = await client.query(
    `SELECT t.name, s.freq::int AS score
     FROM tag_stats s
     JOIN tags t ON t.id = s.tag_id
     WHERE s.last_seen >= NOW() - ($1::int || ' days')::interval
     ORDER BY s.freq DESC, s.last_seen DESC
     LIMIT $2`,
    [windowDays, Math.max(1, limit | 0)]
  );
  return rows.map(r => ({ name: r.name, score: Number(r.score) }));
}

export async function mergeTags(client, fromName, toName) {
  const from = await findTagByName(client, fromName);
  if (!from) throw new Error("Tag 'from' introuvable");
  let to = await findTagByName(client, toName);
  if (!to) {
    to = await getOrCreateTag(client, toName);
  }
  if (from.id === to.id) return to;

  await client.query("BEGIN");
  try {
    // Move poem tag links
    await client.query(
      `UPDATE poem_tags SET tag_id = $1 WHERE tag_id = $2`,
      [to.id, from.id]
    );
    // Deduplicate poem_tags
    await client.query(
      `DELETE FROM poem_tags a
       USING poem_tags b
       WHERE a.ctid < b.ctid
       AND a.poem_id = b.poem_id AND a.tag_id = b.tag_id`
    );

    // Merge stats
    await client.query(
      `INSERT INTO tag_stats (tag_id, freq, last_seen)
       SELECT $1, COALESCE(SUM(freq),0), COALESCE(MAX(last_seen), NOW()) FROM tag_stats WHERE tag_id IN ($1, $2)
       ON CONFLICT (tag_id) DO UPDATE SET
         freq = (SELECT COALESCE(SUM(freq),0) FROM tag_stats WHERE tag_id IN ($1, $2)),
         last_seen = GREATEST(EXCLUDED.last_seen, tag_stats.last_seen)`,
      [to.id, from.id]
    );

    // Merge co-occurrences: move edges from 'from' to 'to'
    await client.query(
      `INSERT INTO tag_co (a, b, weight)
       SELECT LEAST(other, $1), GREATEST(other, $1), SUM(weight)
       FROM (
         SELECT CASE WHEN a = $2 THEN b ELSE a END AS other, weight
         FROM tag_co
         WHERE a = $2 OR b = $2
       ) moved
       WHERE other <> $1
       GROUP BY other
       ON CONFLICT (a, b) DO UPDATE SET weight = tag_co.weight + EXCLUDED.weight`,
      [to.id, from.id]
    );

    // Delete old edges and old tag and its stats
    await client.query(`DELETE FROM tag_co WHERE a = $1 OR b = $1`, [from.id]);
    await client.query(`DELETE FROM tag_stats WHERE tag_id = $1`, [from.id]);
    await client.query(`DELETE FROM tags WHERE id = $1`, [from.id]);

    await client.query("COMMIT");
    return to;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
}

