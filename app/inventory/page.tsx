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
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFF1D3' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#CA5995' }}></div>
            <p style={{ color: '#CA5995' }}>Loading inventory...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen p-4" style={{ backgroundColor: '#FFF1D3' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 pt-4">
            <h1 className="text-4xl font-bold mb-2" style={{ color: '#5D1C6A' }}>Pantry Inventory</h1>
            <p style={{ color: '#CA5995' }}>Manage your ingredients and track expiry dates</p>
          </div>

          <div className="rounded-2xl shadow-2xl p-8 mb-8" style={{ backgroundColor: '#FFF1D3' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#5D1C6A' }}>
              {editingId ? 'Edit Ingredient' : 'Add New Ingredient'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-2" style={{ color: '#5D1C6A' }}>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: '#CA5995', color: '#5D1C6A' }}
                />
              </div>
              <div>
                <label className="block font-semibold mb-2" style={{ color: '#5D1C6A' }}>Quantity</label>
                <input
                  type="text"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="e.g., 2 cups, 500g"
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: '#CA5995', color: '#5D1C6A' }}
                />
              </div>
              <div>
                <label className="block font-semibold mb-2" style={{ color: '#5D1C6A' }}>Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: '#CA5995', color: '#5D1C6A' }}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="font-bold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
                  style={{ backgroundColor: '#CA5995', color: '#FFF1D3' }}
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
                    className="font-bold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
                    style={{ backgroundColor: '#FFB090', color: '#5D1C6A' }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {error && (
            <div className="rounded-lg p-4 mb-6 text-sm" style={{ backgroundColor: '#FFE5DE', color: '#842029', border: '1px solid #F5C2C7' }}>
              {error}
            </div>
          )}

          <div className="rounded-2xl shadow-2xl p-8" style={{ backgroundColor: '#FFF1D3' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#5D1C6A' }}>Your Ingredients</h2>
            {ingredients.length === 0 ? (
              <p style={{ color: '#CA5995' }}>No ingredients added yet. Start by adding some above!</p>
            ) : (
              <div className="space-y-4">
                {ingredients.map((ingredient) => (
                  <div
                    key={ingredient.id}
                    className="rounded-lg p-4 border-2 flex justify-between items-center"
                    style={{
                      backgroundColor: isExpired(ingredient.expiry_date) ? '#FFE5DE' : '#FFF1D3',
                      borderColor: isExpired(ingredient.expiry_date) ? '#F5C2C7' : '#CA5995'
                    }}
                  >
                    <div>
                      <h3 className="font-bold" style={{ color: '#5D1C6A' }}>{ingredient.name}</h3>
                      {ingredient.quantity && <p style={{ color: '#CA5995' }}>Quantity: {ingredient.quantity}</p>}
                      {ingredient.expiry_date && (
                        <p style={{ color: isExpired(ingredient.expiry_date) ? '#842029' : '#CA5995' }}>
                          Expires: {new Date(ingredient.expiry_date).toLocaleDateString()}
                          {isExpired(ingredient.expiry_date) && ' (Expired)'}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(ingredient)}
                        className="font-bold py-2 px-4 rounded-lg transition-all shadow-md hover:shadow-lg"
                        style={{ backgroundColor: '#FFB090', color: '#5D1C6A' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ingredient.id)}
                        className="font-bold py-2 px-4 rounded-lg transition-all shadow-md hover:shadow-lg"
                        style={{ backgroundColor: '#F5C2C7', color: '#842029' }}
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