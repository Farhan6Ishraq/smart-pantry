import { NextRequest, NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import path from 'path';
import { ensureDbInit } from '@/lib/db';

const dbPath = path.join(process.cwd(), 'data', 'auth.db');

export async function GET(req: NextRequest) {
  try {
    await ensureDbInit();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    return new Promise((resolve) => {
      const db = new sqlite3.Database(dbPath);

      db.all(
        'SELECT * FROM ingredients WHERE user_id = ? ORDER BY expiry_date ASC',
        [userId],
        (err, rows) => {
          db.close();

          if (err) {
            return resolve(NextResponse.json({ error: 'Database error' }, { status: 500 }));
          }

          resolve(NextResponse.json({ ingredients: rows }));
        }
      );
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDbInit();

    const { userId, name, quantity, expiryDate } = await req.json();

    if (!userId || !name) {
      return NextResponse.json({ error: 'User ID and name required' }, { status: 400 });
    }

    return new Promise((resolve) => {
      const db = new sqlite3.Database(dbPath);

      db.run(
        'INSERT INTO ingredients (user_id, name, quantity, expiry_date) VALUES (?, ?, ?, ?)',
        [userId, name, quantity || '', expiryDate || ''],
        function (err) {
          db.close();

          if (err) {
            return resolve(NextResponse.json({ error: 'Database error' }, { status: 500 }));
          }

          resolve(NextResponse.json({ message: 'Ingredient added', id: this.lastID }));
        }
      );
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}