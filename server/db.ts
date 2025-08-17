import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Temporairement désactiver la base de données en mode développement
if (!process.env.DATABASE_URL && process.env.NODE_ENV === 'production') {
  throw new Error(
    "DATABASE_URL must be set in production. Did you forget to provision a database?",
  );
}

// En mode développement, créer une base de données factice
export const pool = process.env.DATABASE_URL 
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null as any;

export const db = process.env.DATABASE_URL 
  ? drizzle({ client: pool, schema })
  : null as any;