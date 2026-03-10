"""
process_dataset.py
Reads PP_recipes.csv, filters recipes with cook time <= 20 minutes,
and reports stats. Note: PP_recipes.csv uses tokenized ingredient IDs —
without the vocabulary mapping file (ingr_map.pkl), ingredient names
cannot be decoded. The curated data/recipes.json is used for the app.
"""
import csv
import json
import ast
from pathlib import Path

CSV_PATH = Path(__file__).parent.parent / "PP_recipes.csv"
OUT_PATH = Path(__file__).parent.parent / "data" / "dataset_stats.json"

def main():
    under20 = []
    total = 0
    calorie_dist = {0: 0, 1: 0, 2: 0}

    print("Reading PP_recipes.csv ...")
    with open(CSV_PATH, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            total += 1
            try:
                minutes = int(row["i"])
            except (ValueError, KeyError):
                continue

            if minutes <= 20:
                cal = int(row.get("calorie_level", 0))
                calorie_dist[cal] = calorie_dist.get(cal, 0) + 1

                try:
                    ingredient_ids = ast.literal_eval(row["ingredient_ids"])
                except Exception:
                    ingredient_ids = []

                under20.append({
                    "id": int(row["id"]),
                    "cookTime": minutes,
                    "calorie_level": cal,
                    "num_ingredients": len(ingredient_ids),
                    "ingredient_ids": ingredient_ids,
                })

    stats = {
        "total_recipes": total,
        "under_20_min": len(under20),
        "calorie_distribution": calorie_dist,
        "sample": under20[:5],
    }

    OUT_PATH.parent.mkdir(exist_ok=True)
    with open(OUT_PATH, "w") as f:
        json.dump(stats, f, indent=2)

    print(f"Total recipes in dataset : {total:,}")
    print(f"Recipes <= 20 minutes    : {len(under20):,}")
    print(f"Calorie level breakdown  : {calorie_dist}")
    print(f"Stats saved to           : {OUT_PATH}")
    print()
    print("NOTE: Ingredient names are tokenized IDs — vocab mapping file")
    print("(ingr_map.pkl) not included in dataset upload.")
    print("Using curated data/recipes.json for the app instead.")

if __name__ == "__main__":
    main()
