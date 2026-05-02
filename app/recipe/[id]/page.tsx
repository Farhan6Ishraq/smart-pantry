import Link from 'next/link';
import { mapSpoonacularRecipeInformationToRecipe, Recipe } from '@/lib/recipes';

export const dynamic = 'force-dynamic';

async function fetchRecipe(id: string): Promise<Recipe> {
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) {
    throw new Error('Spoonacular API key is not configured.');
  }

  const url = `https://api.spoonacular.com/recipes/${encodeURIComponent(id)}/information?includeNutrition=false&apiKey=${encodeURIComponent(apiKey)}`;
  const response = await fetch(url, { cache: 'no-store' });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Failed to load recipe details: ${response.status} ${response.statusText} ${body}`);
  }

  const data = await response.json();
  return mapSpoonacularRecipeInformationToRecipe(data);
}

export default async function RecipePage({ params }: { params: { id: string } }) {
  let recipe: Recipe;

  try {
    recipe = await fetchRecipe(params.id);
  } catch (error: any) {
    return (
      <div className="min-h-screen p-8 bg-[#FFF1D3] text-[#5D1C6A]">
        <div className="max-w-4xl mx-auto rounded-2xl bg-white shadow-2xl p-10">
          <h1 className="text-3xl font-bold mb-4">Recipe could not be loaded</h1>
          <p className="mb-6">{error?.message || 'There was an issue fetching the recipe details.'}</p>
          <Link href="/pantry" className="inline-block font-bold py-3 px-6 rounded-lg bg-[#CA5995] text-[#FFF1D3] hover:opacity-90 transition-opacity">
            Back to Pantry
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#FFF1D3', color: '#5D1C6A' }}>
      <div className="max-w-5xl mx-auto rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="p-10" style={{ backgroundColor: '#CA5995', color: '#FFF1D3' }}>
          <h1 className="text-4xl font-bold mb-3">{recipe.name}</h1>
          <p className="text-sm leading-7" dangerouslySetInnerHTML={{ __html: recipe.description }} />
        </div>

        <div className="p-10 space-y-8" style={{ backgroundColor: '#FFF1D3' }}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 rounded-2xl p-6" style={{ backgroundColor: '#FFB090' }}>
              <h2 className="text-xl font-bold mb-3" style={{ color: '#5D1C6A' }}>Recipe Details</h2>
              <p className="mb-2"><span className="font-semibold">Prep time:</span> {recipe.prepTime} min</p>
              <p className="mb-2"><span className="font-semibold">Servings:</span> {recipe.servings}</p>
              <p className="mb-0"><span className="font-semibold">Ingredients:</span> {recipe.ingredients.length}</p>
            </div>
            <div className="flex-1 rounded-2xl p-6" style={{ backgroundColor: '#FFF1D3', border: '2px solid #CA5995' }}>
              <h2 className="text-xl font-bold mb-3" style={{ color: '#5D1C6A' }}>Ingredient List</h2>
              <ul className="space-y-2 text-sm">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="rounded-full px-3 py-2" style={{ backgroundColor: '#CA5995', color: '#FFF1D3' }}>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl p-6" style={{ backgroundColor: '#FFFFFF', border: '2px solid #CA5995' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#5D1C6A' }}>Instructions</h2>
            {recipe.instructions.length > 0 ? (
              <ol className="list-decimal list-inside space-y-3 text-sm">
                {recipe.instructions.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            ) : (
              <p className="text-sm" style={{ color: '#5D1C6A' }}>No step-by-step instructions are available for this recipe.</p>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/pantry" className="font-bold py-3 px-6 rounded-lg bg-[#CA5995] text-[#FFF1D3] hover:opacity-90 transition-opacity">
              Back to Pantry
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
