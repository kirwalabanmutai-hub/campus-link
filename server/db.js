// SQLite database for CampusLink accounts, seller verification, products and gigs.
// Uses Node's built-in node:sqlite, so there is nothing native to install.
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export function openDb(file) {
  mkdirSync(dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      type          TEXT NOT NULL CHECK (type IN ('student','business','recruiter','admin')),
      email         TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      first_name    TEXT NOT NULL,
      last_name     TEXT NOT NULL,
      campus        TEXT,
      phone         TEXT,
      org_name      TEXT,              -- business or organisation name
      category      TEXT,              -- what a business sells
      kra_pin       TEXT,
      landmark      TEXT,
      map_link      TEXT,
      status        TEXT CHECK (status IN ('pending','approved','rejected')),  -- businesses only
      review_note   TEXT,
      reviewed_at   TEXT,
      created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL
    );

    -- Verification documents (KRA certificate, business permit, shop photo). Private.
    CREATE TABLE IF NOT EXISTS documents (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      kind      TEXT NOT NULL CHECK (kind IN ('kra','permit','photo')),
      file      TEXT NOT NULL,         -- stored file name on disk
      orig_name TEXT NOT NULL,
      mime      TEXT NOT NULL,
      size      INTEGER NOT NULL,
      UNIQUE (user_id, kind)
    );

    -- Products listed by approved sellers. Shown to students at the seller's campus.
    CREATE TABLE IF NOT EXISTS products (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      seller_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name        TEXT NOT NULL,
      dept        TEXT NOT NULL CHECK (dept IN ('Clothes','Food')),
      type        TEXT,                -- clothing type, e.g. Jerseys
      gender      TEXT,                -- Men / Women / Unisex
      subcat      TEXT,                -- food sub-category
      price       INTEGER NOT NULL,
      description TEXT,
      sizes       TEXT,                -- JSON array of sizes for clothing
      image       TEXT,                -- stored file name of the product photo
      in_stock    INTEGER NOT NULL DEFAULT 1,
      created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );

    -- Gigs posted by recruiter accounts (societies, businesses, departments).
    CREATE TABLE IF NOT EXISTS gigs (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      poster_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title       TEXT NOT NULL,
      description TEXT NOT NULL,
      cat         TEXT NOT NULL,
      budget      INTEGER NOT NULL,
      skills      TEXT,                -- JSON array
      campus      TEXT NOT NULL,
      created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );
  `);
  return db;
}
