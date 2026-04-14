# Auth App - Login & Signup

A simple Next.js application with login and signup pages using SQLite and Tailwind CSS.

## Features

- User registration (signup)
- User login
- Password hashing with bcryptjs
- SQLite database for user storage
- Responsive UI with Tailwind CSS
- Simple and minimal implementation

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 3. Using the app

- **Home Page**: Go to `http://localhost:3000`
- **Sign Up**: Create a new account at `http://localhost:3000/signup`
- **Login**: Log in at `http://localhost:3000/login`
- **Dashboard**: After logging in, you'll be redirected to `http://localhost:3000/dashboard`

## Project Structure

- `app/` - Next.js app directory with pages
- `app/api/auth/` - API routes for signup and login
- `app/signup` - Signup page
- `app/login` - Login page
- `app/dashboard` - Dashboard page shown after login
- `lib/db.ts` - Database utilities
- `instrumentation.ts` - Database initialization on startup

## Database

The SQLite database is stored in `data/auth.db` and is automatically created on first run.

### User Table Schema

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## Testing

Try these credentials after signup:
1. Go to signup page
2. Enter an email and password
3. You'll be redirected to login
4. Use the same credentials to login
5. You'll see the dashboard page

## Security Notes

This is a simple implementation for learning. For production use:
- Add CSRF protection
- Implement proper session management
- Use HTTPS
- Add rate limiting
- Implement email verification
- Add password reset functionality
- Use environment variables for sensitive data
