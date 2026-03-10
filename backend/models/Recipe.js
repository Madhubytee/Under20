const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  ingredients: [{ type: String, lowercase: true, trim: true }],
  cookTime: { type: Number, required: true, max: 20 },
  calories: Number,
  protein: Number,
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy" },
});

recipeSchema.index({ ingredients: 1 });

module.exports = mongoose.model("Recipe", recipeSchema);
