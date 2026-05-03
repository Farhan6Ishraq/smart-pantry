# Smart Pantry App

A Next.js application for pantry management, recipe search, favorites, and AI-powered recipe suggestions.

## Features

- User signup and login
- SQLite database for users, inventory, and favorite recipes
- Pantry ingredient tracking
- Recipe search via Spoonacular API
- Favorite recipes page
- Floating AI chatbot powered by Gemini for recipe ideas
- Tailwind CSS styling and responsive UI

## Requirements

- Node.js 18 or newer
- npm

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment variables

Create a `.env.local` file in the project root and add:

```env
SPOONACULAR_API_KEY=your_spoonacular_api_key
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Run the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### 4. Build for production

```bash
npm run build
```

### 5. Start the production server

```bash
npm start
```

## App Usage

- **Home Page**: `http://localhost:3000`
- **Sign Up**: `http://localhost:3000/signup`
- **Login**: `http://localhost:3000/login`
- **Dashboard**: `http://localhost:3000/dashboard`
- **Pantry**: `http://localhost:3000/pantry`
- **Favorites**: `http://localhost:3000/favorites`

## Project Structure

- `app/` - Next.js app directory with routes and pages
- `app/api/auth/` - Signup and login API routes
- `app/api/recipes/` - Spoonacular recipe search API route
- `app/api/inventory/` - Inventory CRUD API route
- `app/api/favorites/` - Favorites CRUD API route
- `app/api/chat/` - Gemini AI chat API route
- `lib/db.ts` - SQLite database initialization and helper
- `data/auth.db` - SQLite database file (created automatically)

## Database

The SQLite database is stored in `data/auth.db` and is automatically created on first run.

### Tables

- `users`: stores registered users
- `ingredients`: stores pantry ingredients for each user
- `favorites`: stores favorite recipes for each user

## Notes

- Keep your API keys secret and do not commit `.env.local`
- The app stores the database locally in the `data/` folder
- For production, add proper session handling, HTTPS, and security hardening
