import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'auth.db');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let dbInitialized = false;

export function ensureDbInit(): Promise<void> {
  return new Promise((resolve) => {
    if (dbInitialized) {
      resolve();
      return;
    }

    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        resolve();
        return;
      }

      db.run(
        `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        `,
        (err) => {
          if (err && !err.message.includes('already exists')) {
            console.error('Error creating users table:', err);
          } else {
            dbInitialized = true;
          }
          db.close();
          resolve();
        }
      );
    });
  });
}

export function getDb() {
  return new sqlite3.Database(dbPath);
}
