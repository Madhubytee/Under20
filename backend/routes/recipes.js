const express = require("express");
const router = express.Router();
const recipes = require("../../data/recipes.json");

// Normalize ingredient strings for comparison
const normalize = (s) => s.toLowerCase().trim();

/**
 * Core matching logic.
 * Returns recipes where the user has ALL required ingredients.
 * Optionally filter by maxCalories, maxCookTime, difficulty.
 */
function findRecipes(userIngredients, allRecipes, filters = {}) {
  const pantry = userIngredients.map(normalize);

  let results = allRecipes.filter((recipe) => {
    // All recipe ingredients must be in pantry
    const hasAll = recipe.ingredients.every((i) => pantry.includes(normalize(i)));
    if (!hasAll) return false;

    // Optional filters
    if (filters.maxCalories && recipe.calories > filters.maxCalories) return false;
    if (filters.maxCookTime && recipe.cookTime > filters.maxCookTime) return false;
    if (filters.difficulty && recipe.difficulty !== filters.difficulty) return false;

    return true;
  });

  // Sort by fewest ingredients first (simplest recipes)
  results.sort((a, b) => a.ingredients.length - b.ingredients.length);

  // Limit to top 5
  return results.slice(0, 5);
}

/**
 * Suggest what ingredients a user is missing per recipe.
 * Returns top 5 almost-matching recipes (missing <= 3 ingredients).
 */
function suggestMissing(userIngredients, allRecipes) {
  const pantry = userIngredients.map(normalize);

  return allRecipes
    .map((recipe) => {
      const missing = recipe.ingredients.filter(
        (i) => !pantry.includes(normalize(i))
      );
      return { ...recipe, missingIngredients: missing };
    })
    .filter((r) => r.missingIngredients.length > 0 && r.missingIngredients.length <= 3)
    .sort((a, b) => a.missingIngredients.length - b.missingIngredients.length)
    .slice(0, 5);
}

// GET /recipes — list all recipes
router.get("/", (req, res) => {
  res.json(recipes);
});

// GET /recipes/:id — get one recipe
router.get("/:id", (req, res) => {
  const recipe = recipes.find((r) => r.id === parseInt(req.params.id));
  if (!recipe) return res.status(404).json({ error: "Recipe not found" });
  res.json(recipe);
});

// POST /recipes/search — find recipes by pantry ingredients
// Body: { ingredients: ["pasta", "butter", ...], maxCalories?, maxCookTime?, difficulty? }
router.post("/search", (req, res) => {
  const { ingredients, maxCalories, maxCookTime, difficulty } = req.body;

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ error: "ingredients array is required" });
  }

  const results = findRecipes(ingredients, recipes, {
    maxCalories,
    maxCookTime,
    difficulty,
  });

  const suggestions = suggestMissing(ingredients, recipes);

  res.json({
    matched: results,
    suggestions,
    totalMatched: results.length,
  });
});

module.exports = router;
