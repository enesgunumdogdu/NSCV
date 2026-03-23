import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "data", "nscv.db");
const SCHEMA_PATH = path.join(process.cwd(), "scripts", "schema.sql");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;

  // Ensure data directory exists
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  // Run schema
  const schema = fs.readFileSync(SCHEMA_PATH, "utf-8");
  db.exec(schema);

  // Migrations: add columns if they don't exist
  const jobCols = db.prepare("PRAGMA table_info(jobs)").all() as { name: string }[];
  const colNames = jobCols.map((c) => c.name);
  if (!colNames.includes("is_outsource")) {
    db.exec("ALTER TABLE jobs ADD COLUMN is_outsource INTEGER NOT NULL DEFAULT 0");
  }
  if (!colNames.includes("agency_name")) {
    db.exec("ALTER TABLE jobs ADD COLUMN agency_name TEXT NOT NULL DEFAULT ''");
  }

  return db;
}
