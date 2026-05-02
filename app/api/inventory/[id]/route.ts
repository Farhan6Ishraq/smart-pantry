import { NextRequest, NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import path from 'path';
import { ensureDbInit } from '@/lib/db';

const dbPath = path.join(process.cwd(), 'data', 'auth.db');

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureDbInit();

    const { userId, name, quantity, expiryDate } = await req.json();

    if (!userId || !name) {
      return NextResponse.json({ error: 'User ID and name required' }, { status: 400 });
    }

    return new Promise((resolve) => {
      const db = new sqlite3.Database(dbPath);

      db.run(
        'UPDATE ingredients SET name = ?, quantity = ?, expiry_date = ? WHERE id = ? AND user_id = ?',
        [name, quantity || '', expiryDate || '', params.id, userId],
        function (err) {
          db.close();

          if (err) {
            return resolve(NextResponse.json({ error: 'Database error' }, { status: 500 }));
          }

          if (this.changes === 0) {
            return resolve(NextResponse.json({ error: 'Ingredient not found' }, { status: 404 }));
          }

          resolve(NextResponse.json({ message: 'Ingredient updated' }));
        }
      );
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureDbInit();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    return new Promise((resolve) => {
      const db = new sqlite3.Database(dbPath);

      db.run(
        'DELETE FROM ingredients WHERE id = ? AND user_id = ?',
        [params.id, userId],
        function (err) {
          db.close();

          if (err) {
            return resolve(NextResponse.json({ error: 'Database error' }, { status: 500 }));
          }

          if (this.changes === 0) {
            return resolve(NextResponse.json({ error: 'Ingredient not found' }, { status: 404 }));
          }

          resolve(NextResponse.json({ message: 'Ingredient deleted' }));
        }
      );
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}