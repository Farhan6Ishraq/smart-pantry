// Mock recipe database
export interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  servings: number;
}

export const RECIPES: Recipe[] = [
  {
    id: 1,
    name: "Classic Pasta Carbonara",
    description: "Creamy Italian pasta with bacon and cheese",
    ingredients: ["pasta", "bacon", "eggs", "parmesan", "black pepper", "salt"],
    instructions: [
      "Cook pasta in salted boiling water",
      "Fry bacon until crispy",
      "Mix eggs with grated parmesan",
      "Combine pasta with bacon and egg mixture",
      "Season with black pepper"
    ],
    prepTime: 20,
    servings: 4
  },
  {
    id: 2,
    name: "Tomato Basil Soup",
    description: "Fresh and aromatic tomato soup",
    ingredients: ["tomato", "basil", "onion", "garlic", "vegetable broth", "cream", "olive oil", "salt", "pepper"],
    instructions: [
      "Sauté onion and garlic in olive oil",
      "Add tomatoes and vegetable broth",
      "Simmer for 20 minutes",
      "Blend until smooth",
      "Stir in cream and basil",
      "Season to taste"
    ],
    prepTime: 30,
    servings: 4
  },
  {
    id: 3,
    name: "Chicken Stir Fry",
    description: "Quick and delicious Asian-inspired dish",
    ingredients: ["chicken", "soy sauce", "garlic", "ginger", "bell pepper", "broccoli", "rice", "sesame oil"],
    instructions: [
      "Cook rice separately",
      "Cut chicken into bite-sized pieces",
      "Heat sesame oil in wok",
      "Stir fry garlic and ginger",
      "Add chicken and cook through",
      "Add vegetables and soy sauce",
      "Serve over rice"
    ],
    prepTime: 25,
    servings: 2
  },
  {
    id: 4,
    name: "Greek Salad",
    description: "Fresh and healthy Mediterranean salad",
    ingredients: ["tomato", "cucumber", "feta", "olives", "red onion", "olive oil", "lemon", "salt", "pepper"],
    instructions: [
      "Chop tomato and cucumber",
      "Slice red onion",
      "Combine vegetables",
      "Add feta and olives",
      "Dress with olive oil and lemon juice",
      "Season with salt and pepper"
    ],
    prepTime: 15,
    servings: 2
  },
  {
    id: 5,
    name: "Vegetable Stir Fry",
    description: "Colorful and nutritious vegetable medley",
    ingredients: ["broccoli", "bell pepper", "mushroom", "soy sauce", "garlic", "ginger", "sesame oil", "rice"],
    instructions: [
      "Prepare rice",
      "Chop all vegetables",
      "Heat sesame oil",
      "Stir fry garlic and ginger",
      "Add vegetables in order of cooking time",
      "Add soy sauce",
      "Serve over rice"
    ],
    prepTime: 20,
    servings: 3
  },
  {
    id: 6,
    name: "Garlic Bread",
    description: "Crispy bread with garlic and butter",
    ingredients: ["bread", "butter", "garlic", "parsley", "salt"],
    instructions: [
      "Melt butter with minced garlic",
      "Add chopped parsley and salt",
      "Brush mixture on bread slices",
      "Bake at 375°F for 8-10 minutes until golden"
    ],
    prepTime: 15,
    servings: 4
  },
  {
    id: 7,
    name: "Mushroom Risotto",
    description: "Creamy arborio rice with mushrooms",
    ingredients: ["rice", "mushroom", "onion", "garlic", "vegetable broth", "white wine", "parmesan", "butter"],
    instructions: [
      "Sauté mushrooms and set aside",
      "Sauté onion and garlic",
      "Add rice and toast lightly",
      "Add wine and let it absorb",
      "Gradually add warm broth while stirring",
      "Stir in mushrooms, butter, and parmesan"
    ],
    prepTime: 35,
    servings: 4
  },
  {
    id: 8,
    name: "Simple Egg Omelette",
    description: "Quick and versatile breakfast favorite",
    ingredients: ["eggs", "butter", "salt", "pepper", "cheese"],
    instructions: [
      "Beat eggs with salt and pepper",
      "Heat butter in pan",
      "Pour in eggs",
      "Add cheese before folding",
      "Fold in half and serve"
    ],
    prepTime: 10,
    servings: 1
  },
  {
    id: 9,
    name: "Pasta Marinara",
    description: "Simple tomato-based pasta",
    ingredients: ["pasta", "tomato", "garlic", "olive oil", "basil", "salt", "pepper"],
    instructions: [
      "Cook pasta until al dente",
      "Heat olive oil and sauté garlic",
      "Add tomatoes and simmer",
      "Add basil near the end",
      "Toss with cooked pasta",
      "Season to taste"
    ],
    prepTime: 25,
    servings: 2
  },
  {
    id: 10,
    name: "Garlic & Herb Chicken",
    description: "Tender chicken with aromatic herbs",
    ingredients: ["chicken", "garlic", "thyme", "rosemary", "lemon", "olive oil", "salt", "pepper"],
    instructions: [
      "Combine herbs, garlic, lemon with olive oil",
      "Rub mixture on chicken",
      "Refrigerate for 30 minutes",
      "Roast at 425°F for 25-30 minutes",
      "Rest before serving"
    ],
    prepTime: 45,
    servings: 2
  }
];

export function findRecipeMatches(userIngredients: string[]): Array<Recipe & { matchCount: number; matchPercentage: number }> {
  const normalizedUserIngredients = userIngredients.map(ing => ing.toLowerCase().trim());

  return RECIPES.map(recipe => {
    const matchingIngredients = recipe.ingredients.filter(ing =>
      normalizedUserIngredients.some(userIng => 
        ing.toLowerCase().includes(userIng) || userIng.includes(ing.toLowerCase())
      )
    );

    return {
      ...recipe,
      matchCount: matchingIngredients.length,
      matchPercentage: Math.round((matchingIngredients.length / recipe.ingredients.length) * 100)
    };
  })
  .filter(recipe => recipe.matchCount > 0)
  .sort((a, b) => {
    if (b.matchPercentage !== a.matchPercentage) {
      return b.matchPercentage - a.matchPercentage;
    }
    return b.matchCount - a.matchCount;
  });
}
