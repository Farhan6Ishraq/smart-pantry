export interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  servings: number;
}

export interface RecipeSearchResult extends Recipe {
  matchCount: number;
  matchPercentage: number;
}

export function mapSpoonacularRecipeToRecipe(item: any): RecipeSearchResult {
  const ingredients = Array.isArray(item.extendedIngredients)
    ? item.extendedIngredients
        .map((ingredient: any) => ingredient.originalString || ingredient.name || '')
        .filter(Boolean)
    : [];

  const instructions = Array.isArray(item.analyzedInstructions)
    ? item.analyzedInstructions.flatMap((instruction: any) =>
        Array.isArray(instruction.steps)
          ? instruction.steps.map((step: any) => step.step).filter(Boolean)
          : []
      )
    : [];

  if (instructions.length === 0 && typeof item.instructions === 'string' && item.instructions.trim()) {
    instructions.push(item.instructions.trim());
  }

  const description = typeof item.summary === 'string'
    ? item.summary.replace(/<[^>]+>/g, '').trim()
    : item.title || '';

  const matchCount = typeof item.usedIngredientCount === 'number' ? item.usedIngredientCount : 0;
  const matchPercentage = ingredients.length > 0
    ? Math.round((matchCount / ingredients.length) * 100)
    : 0;

  return {
    id: item.id,
    name: item.title || 'Recipe',
    description,
    ingredients,
    instructions,
    prepTime: typeof item.readyInMinutes === 'number' ? item.readyInMinutes : 0,
    servings: typeof item.servings === 'number' ? item.servings : 0,
    matchCount,
    matchPercentage
  };
}

export function mapSpoonacularRecipeInformationToRecipe(item: any): Recipe {
  const ingredients = Array.isArray(item.extendedIngredients)
    ? item.extendedIngredients
        .map((ingredient: any) => ingredient.originalString || ingredient.name || '')
        .filter(Boolean)
    : [];

  const instructions = Array.isArray(item.analyzedInstructions)
    ? item.analyzedInstructions.flatMap((instruction: any) =>
        Array.isArray(instruction.steps)
          ? instruction.steps.map((step: any) => step.step).filter(Boolean)
          : []
      )
    : [];

  if (instructions.length === 0 && typeof item.instructions === 'string' && item.instructions.trim()) {
    instructions.push(item.instructions.trim());
  }

  const description = typeof item.summary === 'string'
    ? item.summary.replace(/<[^>]+>/g, '').trim()
    : item.title || '';

  return {
    id: item.id,
    name: item.title || 'Recipe',
    description,
    ingredients,
    instructions,
    prepTime: typeof item.readyInMinutes === 'number' ? item.readyInMinutes : 0,
    servings: typeof item.servings === 'number' ? item.servings : 0
  };
}
