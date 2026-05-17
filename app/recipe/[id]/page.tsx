import Link from 'next/link';
import { mapSpoonacularRecipeInformationToRecipe, Recipe } from '@/lib/recipes';
import { Navbar } from '@/components/Navbar';

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
      <div className="theme-page">
        <Navbar />
        <div className="theme-wrap max-w-4xl">
        <div className="theme-card p-10">
          <h1 className="mb-4 font-display text-5xl text-[#16100c]">Recipe could not be loaded</h1>
          <p className="mb-6">{error?.message || 'There was an issue fetching the recipe details.'}</p>
          <Link href="/pantry" className="theme-btn-accent">
            Back to Pantry
          </Link>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="theme-page">
      <Navbar />
      <div className="theme-wrap max-w-5xl">
      <div className="theme-card overflow-hidden bg-white">
        <div className="p-10 text-white bg-[#ff7a00]">
          <h1 className="text-4xl font-bold mb-3">{recipe.name}</h1>
          <p className="text-sm leading-7" dangerouslySetInnerHTML={{ __html: recipe.description }} />
        </div>

        <div className="space-y-8 bg-[#fffaf4] p-10 text-[#2d241f]">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 rounded-2xl p-6 bg-[#fff3e4] border border-[#ffd0a3]">
              <h2 className="text-xl font-bold mb-3 text-[#2d241f]">Recipe Details</h2>
              <p className="mb-2"><span className="font-semibold">Prep time:</span> {recipe.prepTime} min</p>
              <p className="mb-2"><span className="font-semibold">Servings:</span> {recipe.servings}</p>
              <p className="mb-0"><span className="font-semibold">Ingredients:</span> {recipe.ingredients.length}</p>
            </div>

            <div className="flex-1 rounded-2xl border border-[#ffd0a3] bg-white p-6">
              <h2 className="text-xl font-bold mb-3 text-[#2d241f]">Ingredient List</h2>
              <ul className="space-y-2 text-sm">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="rounded-full bg-[#ff7a00] px-3 py-2 text-white">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-[#ffd0a3] bg-white p-6">
            <h2 className="text-2xl font-bold mb-4 text-[#2d241f]">Instructions</h2>
            {recipe.instructions.length > 0 ? (
              <ol className="list-decimal list-inside space-y-3 text-sm">
                {recipe.instructions.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-[#47392e]">No step-by-step instructions are available for this recipe.</p>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/pantry" className="theme-btn-accent">
              Back to Pantry
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
