import { useFavorites } from '@/context/FavoritesContext';
import { usePantry } from '@/context/PantryContext';
import { useDietary } from '@/context/DietaryContext';
import recipesData from '@/data/recipes.json';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '@/constants/theme';
import { RecipeCard, cardStyles } from '@/components/RecipeCard';
import { Recipe } from '@/types/recipe';

const MEAT_KEYWORDS = ['chicken','beef','pork','lamb','turkey','bacon','sausage','ham','fish','salmon','tuna','shrimp','crab','lobster','steak','veal','duck','anchovy','sardine','pepperoni','prosciutto','meat','venison','lard'];
const DAIRY_EGG_KEYWORDS = ['milk','butter','cream','cheese','egg','yogurt','honey','ghee','whey','mayo','mayonnaise','paneer','ricotta','mozzarella','feta','cheddar','parmesan'];
const GLUTEN_KEYWORDS = ['flour','bread','pasta','wheat','barley','rye','noodle','soy sauce','breadcrumb','tortilla','pita','couscous','seitan'];

function isVegetarian(ingredients: string[]) {
  const lower = ingredients.map(i => i.toLowerCase());
  return !MEAT_KEYWORDS.some(k => lower.some(i => i.includes(k)));
}

function isVegan(ingredients: string[]) {
  const lower = ingredients.map(i => i.toLowerCase());
  return !MEAT_KEYWORDS.some(k => lower.some(i => i.includes(k))) &&
         !DAIRY_EGG_KEYWORDS.some(k => lower.some(i => i.includes(k)));
}

function isGlutenFree(ingredients: string[]) {
  const lower = ingredients.map(i => i.toLowerCase());
  return !GLUTEN_KEYWORDS.some(k => lower.some(i => i.includes(k)));
}

function isDairyFree(ingredients: string[]) {
  const lower = ingredients.map(i => i.toLowerCase());
  return !DAIRY_EGG_KEYWORDS.some(k => lower.some(i => i.includes(k)));
}

const FILTERS = ['Vegetarian', 'Vegan', 'High Protein', 'Quick (<10 min)'] as const;
type Filter = typeof FILTERS[number];

export default function RecipesScreen() {
  const [activeFilters, setActiveFilters] = React.useState<Filter[]>([]);
  const { pantry } = usePantry();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { dietary } = useDietary();

  const toggleFilter = (f: Filter) =>
    setActiveFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  const allRecipes = recipesData as Recipe[];

  let recipes = allRecipes;

  if (pantry.length > 0) {
    recipes = allRecipes
      .map(recipe => {
        const recipeIngredients = recipe.ingredients.map(i => i.toLowerCase());
        let matchCount = 0;
        pantry.forEach(p => {
          if (recipeIngredients.some(i => i.includes(p))) matchCount++;
        });
        return { ...recipe, matchCount };
      })
      .filter(recipe => recipe.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount);
  }

  // Manual filter chips
  if (activeFilters.includes('Vegetarian')) recipes = recipes.filter(r => isVegetarian(r.ingredients));
  if (activeFilters.includes('Vegan')) recipes = recipes.filter(r => isVegan(r.ingredients));
  if (activeFilters.includes('High Protein')) recipes = recipes.filter(r => r.protein >= 15);
  if (activeFilters.includes('Quick (<10 min)')) recipes = recipes.filter(r => r.cookTime <= 10);

  // Dietary preferences from Profile settings
  if (dietary.vegetarian) recipes = recipes.filter(r => isVegetarian(r.ingredients));
  if (dietary.vegan) recipes = recipes.filter(r => isVegan(r.ingredients));
  if (dietary.glutenFree) recipes = recipes.filter(r => isGlutenFree(r.ingredients));
  if (dietary.dairyFree) recipes = recipes.filter(r => isDairyFree(r.ingredients));

  const activeDietLabels = [
    dietary.vegetarian && 'Vegetarian',
    dietary.vegan && 'Vegan',
    dietary.glutenFree && 'Gluten-Free',
    dietary.dairyFree && 'Dairy-Free',
  ].filter(Boolean) as string[];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/under20text.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {activeDietLabels.length > 0 && (
        <View style={styles.dietBanner}>
          <Ionicons name="options-outline" size={13} color={C.darkGreen} />
          <Text style={styles.dietBannerText}>
            Filtering by: {activeDietLabels.join(', ')}
          </Text>
        </View>
      )}

      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => toggleFilter(f)}
            style={[styles.filterChip, activeFilters.includes(f) && styles.filterChipActive]}>
            <Text style={[styles.filterChipText, activeFilters.includes(f) && styles.filterChipTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.countBar}>
        <Text style={styles.countText}>{recipes.length} recipes</Text>
      </View>

      <FlatList
        data={recipes}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            onToggleFavorite={() => toggleFavorite(item.id)}
            isFav={isFavorite(item.id)}
          />
        )}
        contentContainerStyle={cardStyles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.cream,
  },
  header: {
    backgroundColor: C.cream,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  logoImage: {
    width: 212,
    height: 52,
    marginLeft: -12,
  },
  dietBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#ECFDF5',
    borderBottomWidth: 1,
    borderBottomColor: '#A7F3D0',
  },
  dietBannerText: {
    fontSize: 12,
    color: C.darkGreen,
    fontWeight: '600',
  },
  countBar: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  countText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.darkGreen,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
  },
  filterChipActive: {
    backgroundColor: C.darkGreen,
    borderColor: C.darkGreen,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.gray,
  },
  filterChipTextActive: {
    color: C.white,
  },
});
