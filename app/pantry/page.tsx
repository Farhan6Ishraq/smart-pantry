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
  const [expandedRecipes, setExpandedRecipes] = useState<Record<number, boolean>>({});

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

  const toggleRecipeDescription = (recipeId: number) => {
    setExpandedRecipes((prev) => ({ ...prev, [recipeId]: !prev[recipeId] }));
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
      <div className="theme-page">
        <div className="theme-wrap">
          <div className="text-center mb-8 pt-4">
            <h1 className="theme-title mb-2">Smart Pantry</h1>
            <p className="theme-subtitle">
              {inventoryLoaded ? 'Your pantry ingredients are loaded. Add more to discover recipes!' : 'Loading your pantry ingredients...'}
            </p>
          </div>

          <div className="theme-card mb-8 p-8">
            <label className="mb-3 block font-semibold text-[#2d241f]">
              {inventoryLoaded ? 'Add More Ingredients' : 'Add Ingredients'}
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleAddIngredient}
              placeholder="Type an ingredient and press Enter..."
              className="theme-input"
            />
            <p className="mt-2 text-sm text-[#7a6b5d]">Try: chicken, tomato, pasta, eggs, mushroom...</p>

            {ingredients.length > 0 && (
              <div className="mt-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow"
                      style={{ backgroundColor: '#ff7a00' }}
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
                  className="text-sm font-semibold text-[#2d241f] underline transition-opacity hover:opacity-75"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-bold text-[#2d241f]">
              {loading
                ? 'Searching recipes...'
                : recipes.length === 0
                ? ingredients.length === 0
                  ? 'Start adding ingredients to see recipes'
                  : 'No recipes match your ingredients'
                : `Found ${recipes.length} recipe${recipes.length !== 1 ? 's' : ''}`}
            </h2>

            {error && (
              <div className="mb-6 rounded-2xl border border-[#f5c2c7] bg-[#ffe5de] p-4 text-sm text-[#842029]">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="theme-card overflow-hidden transition-shadow hover:shadow-2xl"
                >
                  <div className="bg-[#ff7a00] p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{recipe.name}</h3>
                    <p
                      className="text-sm"
                      style={{
                        opacity: 0.9,
                        display: '-webkit-box',
                        WebkitLineClamp: expandedRecipes[recipe.id] ? 'unset' : 4,
                        WebkitBoxOrient: 'vertical',
                        overflow: expandedRecipes[recipe.id] ? 'visible' : 'hidden'
                      }}
                    >
                      {recipe.description}
                    </p>
                    <button
                      type="button"
                      onClick={() => toggleRecipeDescription(recipe.id)}
                      className="mt-2 text-sm font-semibold text-white underline underline-offset-2"
                    >
                      {expandedRecipes[recipe.id] ? 'Read less' : 'Read more'}
                    </button>
                  </div>

                  <div className="px-6 pt-4 pb-2">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-[#2d241f]">Match</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 rounded-full overflow-hidden bg-[#ffd9b4]">
                          <div
                            className="h-full transition-all"
                            style={{ backgroundColor: '#ff7a00', width: `${recipe.matchPercentage}%` }}
                          />
                        </div>
                        <span className="text-lg font-bold text-[#ff7a00]">{recipe.matchPercentage}%</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#47392e]">
                      You have {recipe.matchCount} of {recipe.ingredients.length} ingredients
                    </p>
                  </div>

                  <div className="border-t border-[#ffd0a3] bg-[#fff3e4] px-6 py-3">
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div>
                        <p className="text-[#47392e]">Prep Time</p>
                        <p className="font-semibold text-[#2d241f]">{recipe.prepTime} min</p>
                      </div>
                      <div>
                        <p className="text-[#47392e]">Servings</p>
                        <p className="font-semibold text-[#2d241f]">{recipe.servings}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="mb-2 text-xs font-semibold text-[#2d241f]">Ingredients:</p>
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
                                backgroundColor: hasIngredient ? '#ff7a00' : '#2d241f',
                                color: hasIngredient ? '#fffaf4' : '#ffd9b4',
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
                      className="mb-2 inline-flex w-full justify-center rounded-full bg-[#2d241f] py-2 px-4 font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
                    >
                      ❤️ Favorite
                    </button>
                    <Link
                      href={`/recipe/${recipe.id}`}
                      className="theme-btn-accent w-full py-2"
                    >
                      View Recipe →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {ingredients.length === 0 && (
              <div className="text-center py-12">
                <p className="theme-subtitle">Create your first meal by adding ingredients</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm">
        {chatOpen ? (
          <div className="overflow-hidden rounded-3xl border border-[#ffd0a3] bg-[#fffaf4] shadow-[0_20px_40px_rgba(70,48,28,0.14)]">
            <div className="flex items-center justify-between bg-[#ff7a00] px-4 py-3 text-white">
              <div>
                <p className="font-bold text-white">Recipe AI Assistant</p>
                <p className="text-xs text-white/90">Ask for unique recipes anytime</p>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2d241f]/20 text-white transition-colors hover:bg-[#2d241f]/35"
                aria-label="Minimize chat"
              >
                −
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4 max-h-64 space-y-3 overflow-y-auto rounded-2xl border border-[#ffe0bf] bg-white p-3">
                {chatMessages.length === 0 ? (
                  <p className="text-sm text-[#47392e]">Need a recipe? Send a prompt and the AI will help.</p>
                ) : (
                  chatMessages.map((msg, idx) => (
                    <div key={idx} className={`rounded-2xl px-3 py-2 ${msg.role === 'user' ? 'ml-auto bg-[#ff7a00] text-white' : 'bg-[#fff3e4] text-[#2d241f]'}`}>
                      {msg.content}
                    </div>
                  ))
                )}
                {chatLoading && (
                  <p className="text-sm text-[#47392e]">Thinking...</p>
                )}
              </div>
              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask for recipe ideas..."
                  className="flex-1 rounded-2xl border-2 border-[#ffd0a3] bg-white px-3 py-2 text-[#2d241f] focus:border-[#ff7a00] focus:outline-none"
                  disabled={chatLoading}
                />
                <button
                  type="submit"
                  className="rounded-2xl bg-[#2d241f] px-4 py-2 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
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
            className="w-full rounded-full bg-[#ff7a00] px-4 py-3 font-semibold text-white shadow-[0_20px_40px_rgba(70,48,28,0.2)] transition-all duration-200 hover:-translate-y-0.5"
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
