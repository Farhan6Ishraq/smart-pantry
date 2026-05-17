'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';

interface Ingredient {
  id: number;
  name: string;
  quantity: string;
  expiry_date: string;
}

function InventoryContent() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    expiryDate: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  const fetchIngredients = useCallback(async () => {
    try {
      const response = await fetch(`/api/inventory?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch ingredients');
      const data = await response.json();
      setIngredients(data.ingredients);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchIngredients();
    } else {
      setLoading(false);
    }
  }, [userId, fetchIngredients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/inventory/${editingId}` : '/api/inventory';
      const body = editingId
        ? { userId, ...formData }
        : { userId, name: formData.name, quantity: formData.quantity, expiryDate: formData.expiryDate };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Failed to save ingredient');

      setFormData({ name: '', quantity: '', expiryDate: '' });
      setEditingId(null);
      fetchIngredients();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (ingredient: Ingredient) => {
    setFormData({
      name: ingredient.name,
      quantity: ingredient.quantity,
      expiryDate: ingredient.expiry_date
    });
    setEditingId(ingredient.id);
  };

  const handleDelete = async (id: number) => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/inventory/${id}?userId=${userId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete ingredient');

      fetchIngredients();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const isExpired = (expiryDate: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="theme-page flex items-center justify-center">
          <div className="text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#ff7a00]" />
            <p className="theme-subtitle">Loading inventory...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="theme-page">
        <div className="theme-wrap max-w-4xl">
          <div className="text-center mb-8 pt-4">
            <h1 className="theme-title mb-2">Pantry Inventory</h1>
            <p className="theme-subtitle">Manage your ingredients and track expiry dates</p>
          </div>

          <div className="theme-card mb-8 p-8">
            <h2 className="mb-4 text-2xl font-bold text-[#2d241f]">
              {editingId ? 'Edit Ingredient' : 'Add New Ingredient'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block font-semibold text-[#2d241f]">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="theme-input"
                />
              </div>
              <div>
                <label className="mb-2 block font-semibold text-[#2d241f]">Quantity</label>
                <input
                  type="text"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="e.g., 2 cups, 500g"
                  className="theme-input"
                />
              </div>
              <div>
                <label className="mb-2 block font-semibold text-[#2d241f]">Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="theme-input"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="rounded-full bg-[#ff7a00] px-6 py-3 font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
                >
                  {editingId ? 'Update' : 'Add'} Ingredient
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ name: '', quantity: '', expiryDate: '' });
                    }}
                    className="theme-btn-accent"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-[#f5c2c7] bg-[#ffe5de] p-4 text-sm text-[#842029]">
              {error}
            </div>
          )}

          <div className="theme-card p-8">
            <h2 className="mb-4 text-2xl font-bold text-[#2d241f]">Your Ingredients</h2>
            {ingredients.length === 0 ? (
              <p className="theme-subtitle">No ingredients added yet. Start by adding some above!</p>
            ) : (
              <div className="space-y-4">
                {ingredients.map((ingredient) => (
                  <div
                    key={ingredient.id}
                    className="flex items-center justify-between rounded-2xl border-2 p-4"
                    style={{
                      backgroundColor: isExpired(ingredient.expiry_date) ? '#ffe5de' : '#fffaf4',
                      borderColor: isExpired(ingredient.expiry_date) ? '#f5c2c7' : '#ffd0a3'
                    }}
                  >
                    <div>
                      <h3 className="font-bold text-[#2d241f]">{ingredient.name}</h3>
                      {ingredient.quantity && <p className="text-[#7a6b5d]">Quantity: {ingredient.quantity}</p>}
                      {ingredient.expiry_date && (
                        <p style={{ color: isExpired(ingredient.expiry_date) ? '#842029' : '#7a6b5d' }}>
                          Expires: {new Date(ingredient.expiry_date).toLocaleDateString()}
                          {isExpired(ingredient.expiry_date) && ' (Expired)'}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(ingredient)}
                        className="theme-btn-accent px-4 py-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ingredient.id)}
                        className="rounded-full bg-[#f5c2c7] px-4 py-2 font-bold text-[#842029] transition-all duration-200 hover:-translate-y-0.5"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function InventoryPage() {
  return <InventoryContent />;
}
