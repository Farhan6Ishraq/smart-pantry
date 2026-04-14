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

    const hashedPassword = await bcrypt.hash(password, 10);

    return new Promise((resolve) => {
      const db = new sqlite3.Database(dbPath);

      db.run(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword],
        function (err) {
          if (err) {
            db.close();
            return resolve(
              NextResponse.json(
                { error: 'Email already exists' },
                { status: 400 }
              )
            );
          }

          db.close();
          resolve(
            NextResponse.json(
              { message: 'User created successfully' },
              { status: 201 }
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
