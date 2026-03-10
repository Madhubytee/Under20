const API = "http://localhost:3001";
let pantry = [];

// ---- DOM refs ----
const input = document.getElementById("ingredient-input");
const addBtn = document.getElementById("add-btn");
const chipsEl = document.getElementById("pantry-chips");
const searchBtn = document.getElementById("search-btn");
const clearBtn = document.getElementById("clear-btn");
const resultsPanel = document.getElementById("results-panel");
const resultsGrid = document.getElementById("results-grid");
const matchCount = document.getElementById("match-count");
const suggestionsSection = document.getElementById("suggestions-section");
const suggestionsGrid = document.getElementById("suggestions-grid");
const modalOverlay = document.getElementById("modal-overlay");
const modalContent = document.getElementById("modal-content");
const modalClose = document.getElementById("modal-close");

// ---- Pantry ----
function addIngredient() {
  const val = input.value.trim().toLowerCase();
  if (!val || pantry.includes(val)) { input.value = ""; return; }
  pantry.push(val);
  input.value = "";
  renderChips();
}

function removeIngredient(i) {
  pantry.splice(i, 1);
  renderChips();
}

function renderChips() {
  chipsEl.innerHTML = pantry
    .map(
      (item, i) =>
        `<div class="chip">${item}<button onclick="removeIngredient(${i})">×</button></div>`
    )
    .join("");
}

addBtn.addEventListener("click", addIngredient);
input.addEventListener("keydown", (e) => { if (e.key === "Enter") addIngredient(); });
clearBtn.addEventListener("click", () => { pantry = []; renderChips(); resultsPanel.style.display = "none"; });

// ---- Search ----
async function searchRecipes() {
  if (pantry.length === 0) {
    alert("Add at least one ingredient to your pantry.");
    return;
  }

  const maxCalories = document.getElementById("filter-calories").value;
  const maxCookTime = document.getElementById("filter-time").value;
  const difficulty = document.getElementById("filter-difficulty").value;

  const body = {
    ingredients: pantry,
    ...(maxCalories && { maxCalories: parseInt(maxCalories) }),
    ...(maxCookTime && { maxCookTime: parseInt(maxCookTime) }),
    ...(difficulty && { difficulty }),
  };

  try {
    const res = await fetch(`${API}/recipes/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    renderResults(data);
  } catch (err) {
    alert("Could not reach the server. Make sure the backend is running on port 3001.");
  }
}

searchBtn.addEventListener("click", searchRecipes);

// ---- Render results ----
function renderResults({ matched, suggestions }) {
  resultsPanel.style.display = "block";
  matchCount.textContent = `(${matched.length} found)`;

  if (matched.length === 0) {
    resultsGrid.innerHTML = `<p style="color:var(--muted);grid-column:1/-1">No exact matches. Check the suggestions below.</p>`;
  } else {
    resultsGrid.innerHTML = matched.map(recipeCard).join("");
  }

  if (suggestions && suggestions.length > 0) {
    suggestionsSection.style.display = "block";
    suggestionsGrid.innerHTML = suggestions.map(suggestionCard).join("");
  } else {
    suggestionsSection.style.display = "none";
  }

  resultsPanel.scrollIntoView({ behavior: "smooth" });
}

function recipeCard(r) {
  return `
    <div class="recipe-card" onclick="openModal(${r.id})">
      <h3>${r.name}</h3>
      <div class="meta">
        <span>⏱ ${r.cookTime} min</span>
        <span>🔥 ${r.calories} cal</span>
        <span>💪 ${r.protein}g protein</span>
      </div>
      <div class="badge">${r.difficulty}</div>
    </div>`;
}

function suggestionCard(r) {
  const missing = r.missingIngredients.join(", ");
  return `
    <div class="recipe-card suggestion" onclick="openModal(${r.id})">
      <h3>${r.name}</h3>
      <div class="meta">
        <span>⏱ ${r.cookTime} min</span>
        <span>🔥 ${r.calories} cal</span>
      </div>
      <div class="missing">Missing: <span>${missing}</span></div>
    </div>`;
}

// ---- Modal ----
async function openModal(id) {
  try {
    const res = await fetch(`${API}/recipes/${id}`);
    const r = await res.json();
    modalContent.innerHTML = `
      <h2>${r.name}</h2>
      <div class="meta">
        <span>⏱ ${r.cookTime} min</span>
        <span>🔥 ${r.calories} cal</span>
        <span>💪 ${r.protein}g protein</span>
        <span>Difficulty: ${r.difficulty}</span>
      </div>
      <h4>Ingredients</h4>
      <ul>${r.ingredients.map((i) => `<li>${i}</li>`).join("")}</ul>
      <button class="save-btn" onclick="saveRecipe(${r.id})">Save Recipe</button>
    `;
    modalOverlay.style.display = "flex";
  } catch {
    // silently fail
  }
}

modalClose.addEventListener("click", () => (modalOverlay.style.display = "none"));
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) modalOverlay.style.display = "none";
});

async function saveRecipe(recipeId) {
  const token = localStorage.getItem("token");
  if (!token) { alert("Log in to save recipes."); return; }

  const res = await fetch(`${API}/users/saveRecipe`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ recipeId }),
  });

  if (res.ok) {
    alert("Recipe saved!");
  } else {
    alert("Could not save recipe.");
  }
}
