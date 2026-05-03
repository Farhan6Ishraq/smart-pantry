'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { RecipeSearchResult } from '@/lib/recipes';

function PantryContent() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [recipes, setRecipes] = useState<RecipeSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inventoryLoaded, setInventoryLoaded] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);

  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch(`/api/inventory?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch inventory');
        const data = await response.json();
        const inventoryIngredients = data.ingredients.map((item: any) => item.name.toLowerCase());
        setIngredients(inventoryIngredients);
        setInventoryLoaded(true);
      } catch (err: any) {
        console.error('Failed to load inventory:', err.message);
        setInventoryLoaded(true);
      }
    };

    if (userId && !inventoryLoaded) {
      fetchInventory();
    }
  }, [userId, inventoryLoaded]);

  useEffect(() => {
    if (ingredients.length === 0) {
      setRecipes([]);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const fetchRecipes = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/recipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ingredients }),
          signal: controller.signal
        });

        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(body?.error || 'Unable to fetch recipes.');
        }

        const data = await response.json();
        setRecipes(Array.isArray(data.recipes) ? data.recipes : []);
      } catch (error: any) {
        if (error.name === 'AbortError') {
          return;
        }
        setRecipes([]);
        setError(error.message || 'Unable to load recipes.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
    return () => controller.abort();
  }, [ingredients]);

  const handleAddIngredient = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      const newIngredient = inputValue.trim().toLowerCase();
      if (!ingredients.includes(newIngredient)) {
        setIngredients([...ingredients, newIngredient]);
      }
      setInputValue('');
      e.preventDefault();
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setIngredients([]);
    setInputValue('');
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage })
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'ai', content: data.response }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I couldn\'t generate a response right now.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-4" style={{ backgroundColor: '#FFF1D3' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 pt-4">
            <h1 className="text-4xl font-bold mb-2" style={{ color: '#5D1C6A' }}>Smart Pantry</h1>
            <p style={{ color: '#CA5995' }}>
              {inventoryLoaded ? 'Your pantry ingredients are loaded. Add more to discover recipes!' : 'Loading your pantry ingredients...'}
            </p>
          </div>

          <div className="rounded-2xl shadow-2xl p-8 mb-8" style={{ backgroundColor: '#FFF1D3' }}>
            <label className="block font-semibold mb-3" style={{ color: '#5D1C6A' }}>
              {inventoryLoaded ? 'Add More Ingredients' : 'Add Ingredients'}
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleAddIngredient}
              placeholder="Type an ingredient and press Enter..."
              className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200"
              style={{ borderColor: '#CA5995', color: '#5D1C6A' }}
            />
            <p className="text-sm mt-2" style={{ color: '#CA5995' }}>Try: chicken, tomato, pasta, eggs, mushroom...</p>

            {ingredients.length > 0 && (
              <div className="mt-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow"
                      style={{ backgroundColor: '#CA5995' }}
                    >
                      <span>{ingredient}</span>
                      <button
                        onClick={() => handleRemoveIngredient(index)}
                        className="ml-1 hover:opacity-80 rounded-full w-6 h-6 flex items-center justify-center transition-all"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleClearAll}
                  className="text-sm font-semibold underline hover:opacity-75 transition-opacity"
                  style={{ color: '#5D1C6A' }}
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#5D1C6A' }}>
              {loading
                ? 'Searching recipes...'
                : recipes.length === 0
                ? ingredients.length === 0
                  ? 'Start adding ingredients to see recipes'
                  : 'No recipes match your ingredients'
                : `Found ${recipes.length} recipe${recipes.length !== 1 ? 's' : ''}`}
            </h2>

            {error && (
              <div className="rounded-lg p-4 mb-6 text-sm" style={{ backgroundColor: '#FFE5DE', color: '#842029', border: '1px solid #F5C2C7' }}>
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="rounded-2xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden"
                  style={{ backgroundColor: '#FFF1D3', borderColor: '#CA5995', border: '2px solid #CA5995' }}
                >
                    <div className="p-6 text-white" style={{ backgroundColor: '#CA5995' }}>
                      <h3 className="text-xl font-bold mb-2">{recipe.name}</h3>
                      <p className="text-sm" style={{ opacity: 0.9 }}>{recipe.description}</p>
                    </div>

                  <div className="px-6 pt-4 pb-2">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold" style={{ color: '#5D1C6A' }}>Match</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#FFB090' }}>
                          <div
                            className="h-full transition-all"
                            style={{ backgroundColor: '#CA5995', width: `${recipe.matchPercentage}%` }}
                          />
                        </div>
                        <span className="text-lg font-bold" style={{ color: '#CA5995' }}>{recipe.matchPercentage}%</span>
                      </div>
                    </div>
                    <p className="text-xs" style={{ color: '#5D1C6A' }}>
                      You have {recipe.matchCount} of {recipe.ingredients.length} ingredients
                    </p>
                  </div>

                  <div className="px-6 py-3" style={{ backgroundColor: '#FFB090', borderTop: '1px solid #CA5995' }}>
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div>
                        <p style={{ color: '#5D1C6A' }}>Prep Time</p>
                        <p className="font-semibold" style={{ color: '#5D1C6A' }}>{recipe.prepTime} min</p>
                      </div>
                      <div>
                        <p style={{ color: '#5D1C6A' }}>Servings</p>
                        <p className="font-semibold" style={{ color: '#5D1C6A' }}>{recipe.servings}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs font-semibold mb-2" style={{ color: '#5D1C6A' }}>Ingredients:</p>
                      <div className="flex flex-wrap gap-1">
                        {recipe.ingredients.map((ing, idx) => {
                          const hasIngredient = ingredients.some(userIng =>
                            ing.toLowerCase().includes(userIng.toLowerCase()) ||
                            userIng.toLowerCase().includes(ing.toLowerCase())
                          );
                          return (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 rounded-full"
                              style={{
                                backgroundColor: hasIngredient ? '#CA5995' : '#5D1C6A',
                                color: hasIngredient ? '#FFF1D3' : '#FFB090',
                                fontWeight: hasIngredient ? 'bold' : 'normal'
                              }}
                            >
                              {hasIngredient ? '✓' : '○'} {ing}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-4">
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/favorites', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              userId: parseInt(userId!),
                              recipeId: recipe.id,
                              title: recipe.name,
                              image: recipe.image
                            })
                          });
                          if (response.ok) {
                            alert('Recipe added to favorites!');
                          } else {
                            alert('Failed to add to favorites.');
                          }
                        } catch (error) {
                          alert('Error adding to favorites.');
                        }
                      }}
                      className="w-full mb-2 inline-flex justify-center font-bold py-2 px-4 rounded-lg transition-all shadow-md hover:shadow-lg"
                      style={{ backgroundColor: '#5D1C6A', color: '#FFF1D3' }}
                    >
                      ❤️ Favorite
                    </button>
                    <Link
                      href={`/recipe/${recipe.id}`}
                      className="w-full inline-flex justify-center font-bold py-2 px-4 rounded-lg transition-all shadow-md hover:shadow-lg"
                      style={{ backgroundColor: '#CA5995', color: '#FFF1D3' }}
                    >
                      View Recipe →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {ingredients.length === 0 && (
              <div className="text-center py-12">
                <p style={{ color: '#CA5995' }}>Create your first meal by adding ingredients</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm">
        {chatOpen ? (
          <div className="rounded-3xl shadow-2xl overflow-hidden border border-[#CA5995]" style={{ backgroundColor: '#FFF1D3' }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: '#CA5995' }}>
              <div>
                <p className="font-bold text-white">Recipe AI Assistant</p>
                <p className="text-xs text-[#FFF1D3] opacity-90">Ask for unique recipes anytime</p>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="text-white font-bold rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#a84a80] transition-colors"
                style={{ backgroundColor: '#9b4e88' }}
                aria-label="Minimize chat"
              >
                −
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4 max-h-64 overflow-y-auto space-y-3" style={{ backgroundColor: '#FFF1D3' }}>
                {chatMessages.length === 0 ? (
                  <p className="text-sm" style={{ color: '#5D1C6A' }}>Need a recipe? Send a prompt and the AI will help.</p>
                ) : (
                  chatMessages.map((msg, idx) => (
                    <div key={idx} className={`px-3 py-2 rounded-2xl ${msg.role === 'user' ? 'ml-auto bg-[#CA5995] text-white' : 'bg-[#FFB090] text-[#5D1C6A]'}`}>
                      {msg.content}
                    </div>
                  ))
                )}
                {chatLoading && (
                  <p className="text-sm text-[#5D1C6A]">Thinking...</p>
                )}
              </div>
              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask for recipe ideas..."
                  className="flex-1 px-3 py-2 rounded-2xl border-2 focus:outline-none"
                  style={{ borderColor: '#CA5995', color: '#5D1C6A', backgroundColor: '#FFFFFF' }}
                  disabled={chatLoading}
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-2xl font-semibold"
                  style={{ backgroundColor: '#CA5995', color: '#FFF1D3' }}
                  disabled={chatLoading || !chatInput.trim()}
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setChatOpen(true)}
            className="w-full rounded-full px-4 py-3 font-semibold shadow-2xl"
            style={{ backgroundColor: '#CA5995', color: '#FFF1D3' }}
          >
            Open Recipe AI
          </button>
        )}
      </div>
    </>
  );
}

export default function PantryPage() {
  return (
    <ProtectedRoute>
      <PantryContent />
    </ProtectedRoute>
  );
}
