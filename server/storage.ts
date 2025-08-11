import type { IStorage } from "./storage.types";

let storage: IStorage;

if (process.env.DATABASE_URL) {
  const { DatabaseStorage } = await import("./storage.db");
  storage = new DatabaseStorage();
} else {
  const { MemStorage } = await import("./storage.mem");
  storage = new MemStorage();
}

export { storage };