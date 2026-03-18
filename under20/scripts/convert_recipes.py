import csv
import json
import ast

INPUT = "RAW_recipes.csv"
OUTPUT = "data/recipes.json"
MAX_MINUTES = 20
LIMIT = 200  # how many recipes to include

recipes = []
recipe_id = 1

with open(INPUT, encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        try:
            minutes = int(row["minutes"])
        except ValueError:
            continue

        if minutes < 1 or minutes > MAX_MINUTES:
            continue

        try:
            name = row["name"].strip().title()
            if not name:
                continue

            ingredients = ast.literal_eval(row["ingredients"])
            steps = ast.literal_eval(row["steps"])
            nutrition = ast.literal_eval(row["nutrition"])

            # nutrition = [calories, total_fat_PDV, sugar_PDV, sodium_PDV, protein_PDV, sat_fat_PDV, carbs_PDV]
            calories = round(nutrition[0])
            # protein PDV: 50g = 100%, so protein_g = PDV * 0.5
            protein = round(nutrition[4] * 0.5)

            n_steps = len(steps)
            n_ing = len(ingredients)

            if n_ing < 2 or n_steps < 2:
                continue

            # Difficulty based on steps and ingredients
            if n_steps <= 3 and n_ing <= 5:
                difficulty = "easy"
            elif n_steps <= 6 and n_ing <= 9:
                difficulty = "medium"
            else:
                difficulty = "hard"

            # Clean up steps — capitalize first letter
            steps_clean = [s.strip().capitalize() for s in steps if s.strip()]
            # Clean up ingredients — capitalize first letter
            ings_clean = [i.strip().capitalize() for i in ingredients if i.strip()]

            recipes.append({
                "id": recipe_id,
                "name": name,
                "ingredients": ings_clean,
                "cookTime": minutes,
                "calories": calories,
                "protein": protein,
                "difficulty": difficulty,
                "steps": steps_clean,
            })

            recipe_id += 1

            if len(recipes) >= LIMIT:
                break

        except Exception:
            continue

with open(OUTPUT, "w", encoding="utf-8") as f:
    json.dump(recipes, f, indent=2, ensure_ascii=False)

print(f"Done — {len(recipes)} recipes written to {OUTPUT}")
