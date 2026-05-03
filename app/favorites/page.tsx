'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';

interface Favorite {
  id: number;
  recipe_id: number;
  title: string;
  image: string;
  created_at: string;
}

function FavoritesContent() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`/api/favorites?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch favorites');
        const data = await response.json();
        setFavorites(data.favorites || []);
      } catch (err: any) {
        console.error('Failed to load favorites:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchFavorites();
    }
  }, [userId]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-4" style={{ backgroundColor: '#FFF1D3' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 pt-4">
            <h1 className="text-4xl font-bold mb-2" style={{ color: '#5D1C6A' }}>Favorite Recipes</h1>
            <p style={{ color: '#CA5995' }}>
              {loading ? 'Loading your favorites...' : `You have ${favorites.length} favorite recipe${favorites.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {error && (
            <div className="rounded-lg p-4 mb-6 text-sm" style={{ backgroundColor: '#FFE5DE', color: '#842029', border: '1px solid #F5C2C7' }}>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <div
                key={favorite.id}
                className="rounded-2xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden"
                style={{ backgroundColor: '#FFF1D3', borderColor: '#CA5995', border: '2px solid #CA5995' }}
              >
                  <div className="p-6 text-white" style={{ backgroundColor: '#CA5995' }}>
                    <h3 className="text-xl font-bold mb-2">{favorite.title}</h3>
                  </div>

                <div className="px-6 pb-4 pt-4">
                  <Link
                    href={`/recipe/${favorite.recipe_id}`}
                    className="w-full inline-flex justify-center font-bold py-2 px-4 rounded-lg transition-all shadow-md hover:shadow-lg"
                    style={{ backgroundColor: '#CA5995', color: '#FFF1D3' }}
                  >
                    View Recipe →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {!loading && favorites.length === 0 && (
            <div className="text-center py-12">
              <p style={{ color: '#CA5995' }}>No favorite recipes yet. Go to your pantry to add some!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function FavoritesPage() {
  return (
    <ProtectedRoute>
      <FavoritesContent />
    </ProtectedRoute>
  );
}