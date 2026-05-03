import { NextRequest, NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { ensureDbInit } from '@/lib/db';

const dbPath = path.join(process.cwd(), 'data', 'auth.db');

export async function POST(req: NextRequest) {
  try {
    await ensureDbInit();
    
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    return new Promise<NextResponse>((resolve) => {
      const db = new sqlite3.Database(dbPath);

      db.get(
        'SELECT * FROM users WHERE email = ?',
        [email],
        async (err, user: any) => {
          db.close();

          if (err || !user) {
            return resolve(
              NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
              )
            );
          }

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            return resolve(
              NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
              )
            );
          }

          resolve(
            NextResponse.json(
              { message: 'Login successful', userId: user.id },
              { status: 200 }
            )
          );
        }
      );
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
