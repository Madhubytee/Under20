const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "under20_dev_secret";

// Middleware: verify JWT
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// POST /users/register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "email and password required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ error: "Email already registered" });

    const user = await User.create({ email, password });
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(201).json({ token, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /users/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token, email: user.email, pantryItems: user.pantryItems });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /users/pantry
router.get("/pantry", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ pantryItems: user.pantryItems });
});

// PUT /users/pantry — replace pantry
// Body: { ingredients: ["pasta", "butter", ...] }
router.put("/pantry", auth, async (req, res) => {
  const { ingredients } = req.body;
  if (!Array.isArray(ingredients))
    return res.status(400).json({ error: "ingredients array required" });

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { pantryItems: ingredients },
    { new: true }
  );
  res.json({ pantryItems: user.pantryItems });
});

// POST /users/saveRecipe
// Body: { recipeId: 1 }
router.post("/saveRecipe", auth, async (req, res) => {
  const { recipeId } = req.body;
  if (!recipeId) return res.status(400).json({ error: "recipeId required" });

  const user = await User.findById(req.user.id);
  if (!user.savedRecipes.includes(recipeId)) {
    user.savedRecipes.push(recipeId);
    await user.save();
  }
  res.json({ savedRecipes: user.savedRecipes });
});

// DELETE /users/saveRecipe/:id — unsave
router.delete("/saveRecipe/:id", auth, async (req, res) => {
  const recipeId = parseInt(req.params.id);
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { savedRecipes: recipeId } },
    { new: true }
  );
  res.json({ savedRecipes: user.savedRecipes });
});

// GET /users/savedRecipes
router.get("/savedRecipes", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  const recipes = require("../../data/recipes.json");
  const saved = recipes.filter((r) => user.savedRecipes.includes(r.id));
  res.json({ savedRecipes: saved });
});

module.exports = router;
