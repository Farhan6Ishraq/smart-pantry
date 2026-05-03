import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ensureDbInit } from '@/lib/db';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  await ensureDbInit();

  return new Promise<NextResponse>((resolve) => {
    const db = getDb();
    db.all(
      'SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC',
      [userId],
      (err, rows) => {
        db.close();
        if (err) {
          console.error('Error fetching favorites:', err);
          resolve(NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 }));
        } else {
          resolve(NextResponse.json({ favorites: rows }));
        }
      }
    );
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { userId, recipeId, title, image } = await request.json();

  if (!userId || !recipeId || !title) {
    return NextResponse.json({ error: 'User ID, recipe ID, and title are required' }, { status: 400 });
  }

  await ensureDbInit();

  return new Promise<NextResponse>((resolve) => {
    const db = getDb();
    db.run(
      'INSERT INTO favorites (user_id, recipe_id, title, image) VALUES (?, ?, ?, ?)',
      [userId, recipeId, title, image || null],
      function(err) {
        db.close();
        if (err) {
          console.error('Error adding favorite:', err);
          resolve(NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 }));
        } else {
          resolve(NextResponse.json({ success: true, id: this.lastID }));
        }
      }
    );
  });
}