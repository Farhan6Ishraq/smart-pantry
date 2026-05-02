import { NextResponse } from 'next/server';
import { mapSpoonacularRecipeToRecipe } from '@/lib/recipes';

export async function POST(request: Request) {
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Spoonacular API key is not configured.' }, { status: 500 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const ingredients = Array.isArray(body.ingredients)
    ? body.ingredients.map((ingredient: unknown) => String(ingredient).trim()).filter(Boolean)
    : [];

  if (ingredients.length === 0) {
    return NextResponse.json({ error: 'Please provide at least one ingredient.' }, { status: 400 });
  }

  const params = new URLSearchParams({
    apiKey,
    includeIngredients: ingredients.join(','),
    addRecipeInformation: 'true',
    fillIngredients: 'true',
    instructionsRequired: 'true',
    sort: 'max-used-ingredients',
    number: '12'
  });

  const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?${params.toString()}`);

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    return NextResponse.json(
      { error: `Spoonacular request failed: ${response.status} ${response.statusText}` },
      { status: response.status }
    );
  }

  const data = await response.json();
  const recipes = Array.isArray(data.results)
    ? data.results.map((recipe: any) => mapSpoonacularRecipeToRecipe(recipe))
    : [];

  return NextResponse.json({ recipes });
}
