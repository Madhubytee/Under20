import { RecipeCard, cardStyles } from '@/components/RecipeCard';
import { C } from '@/constants/theme';
import { useDietary } from '@/context/DietaryContext';
import { useFavorites } from '@/context/FavoritesContext';
import { usePantry } from '@/context/PantryContext';
import { useRecentlyViewed } from '@/context/RecentlyViewedContext';
import recipesData from '@/data/recipes.json';
import { Recipe } from '@/types/recipe';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

export default function RecipesScreen() {
  const [search, setSearch] = React.useState('');
  const [proteinFilter, setProteinFilter] = React.useState('');
  const [calorieFilter, setCalorieFilter] = React.useState('');
  const [recentExpanded, setRecentExpanded] = React.useState(false);
  const { pantry } = usePantry();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { dietary } = useDietary();
  const { recentIds } = useRecentlyViewed();
  const router = useRouter();

  const allRecipesList = recipesData as Recipe[];

  const recentRecipes = recentIds
    .map(id => allRecipesList.find(r => r.id === id))
    .filter(Boolean) as Recipe[];

  let recipes = allRecipesList;

  if (search.trim()) {
    const q = search.trim().toLowerCase();
    recipes = recipes.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.ingredients.some(i => i.toLowerCase().includes(q))
    );
  }

  if (!search.trim() && pantry.length > 0) {
    recipes = recipes
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

  if (dietary.vegetarian) recipes = recipes.filter(r => isVegetarian(r.ingredients));
  if (dietary.vegan) recipes = recipes.filter(r => isVegan(r.ingredients));
  if (dietary.glutenFree) recipes = recipes.filter(r => isGlutenFree(r.ingredients));
  if (dietary.dairyFree) recipes = recipes.filter(r => isDairyFree(r.ingredients));
  if (proteinFilter.trim()) {
    const minProtein = parseInt(proteinFilter);
    if (!isNaN(minProtein)) {
      recipes = recipes.filter(r => r.protein >= minProtein);
    }
  }
  if (calorieFilter.trim()) {
  const minCalories = parseInt(calorieFilter);
  if (!isNaN(minCalories)) {
    recipes = recipes.filter(r => r.calories >= minCalories);
    }
  }


  const activeDietLabels = [
    dietary.vegetarian && 'Vegetarian',
    dietary.vegan && 'Vegan',
    dietary.glutenFree && 'Gluten-Free',
    dietary.dairyFree && 'Dairy-Free',
    proteinFilter && `${proteinFilter}g+ Protein`,
  ].filter(Boolean) as string[];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/under20text.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={16} color={C.gray} style={styles.searchIcon} />
          <TextInput
            placeholder="Search recipes or ingredients..."
            placeholderTextColor={C.gray}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={16} color={C.gray} />
            </TouchableOpacity>
          )}
        </View>
    
        <View style={[styles.searchRow, { marginTop: 8 }]}>
          <Ionicons name="barbell-outline" size={16} color={C.gray} />
          <TextInput
            placeholder="Min protein (g)..."
            placeholderTextColor={C.gray}
            value={proteinFilter}
            onChangeText={setProteinFilter}
            keyboardType="numeric"
            style={[styles.searchInput, { fontWeight: '600' }]}
          />
        </View>

        <View style={[styles.searchRow, { marginTop: 8 }]}>
          <Ionicons name="flame-outline" size={16} color={C.gray} />
          <TextInput
            placeholder="Min calories..."
            placeholderTextColor={C.gray}
            value={calorieFilter}
            onChangeText={setCalorieFilter}
            keyboardType="numeric"
            style={styles.searchInput}
           />
        </View>
      </View>

      {!search && recentRecipes.length > 0 && (
        <View style={styles.recentSection}>
          <TouchableOpacity
            style={styles.recentHeader}
            onPress={() => setRecentExpanded(prev => !prev)}
            activeOpacity={0.7}>
            <View style={styles.recentHeaderLeft}>
              <Ionicons name="time-outline" size={15} color={C.darkGreen} />
              <Text style={styles.recentTitle}>Recently Viewed</Text>
              <View style={styles.recentBadge}>
                <Text style={styles.recentBadgeText}>{recentRecipes.length}</Text>
              </View>
            </View>
            <Ionicons name={recentExpanded ? 'chevron-up' : 'chevron-down'} size={15} color={C.gray} />
          </TouchableOpacity>

          {recentExpanded && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentScroll}>
              {recentRecipes.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.recentCard}
                  onPress={() => router.push(`/recipe/${item.id}` as any)}>
                  <Text style={styles.recentName} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.recentMeta}>{item.cookTime} min · {item.protein}g protein</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      {activeDietLabels.length > 0 && (
        <View style={styles.dietBanner}>
          <Ionicons name="options-outline" size={13} color={C.darkGreen} />
          <Text style={styles.dietBannerText}>Filtering by: {activeDietLabels.join(', ')}</Text>
        </View>
      )}

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
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={40} color={C.border} />
            <Text style={styles.emptyText}>No recipes found</Text>
            <Text style={styles.emptySub}>Try a different search or adjust your filters in Profile</Text>
          </View>
        }
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
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: 10,
  },
  logoImage: {
    width: 212,
    height: 52,
    marginLeft: -12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
  },
  searchIcon: {
    flexShrink: 0,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: C.text,
    padding: 0,
  },
  recentSection: {
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  recentHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recentTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: C.darkGreen,
  },
  recentBadge: {
    backgroundColor: C.darkGreen,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  recentBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: C.white,
  },
  recentScroll: {
    paddingHorizontal: 16,
    gap: 10,
    paddingBottom: 12,
  },
  recentCard: {
    backgroundColor: C.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: 140,
    justifyContent: 'space-between',
    gap: 6,
  },
  recentName: {
    fontSize: 13,
    fontWeight: '700',
    color: C.text,
    lineHeight: 18,
  },
  recentMeta: {
    fontSize: 11,
    color: C.gray,
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
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: C.text,
  },
  emptySub: {
    fontSize: 13,
    color: C.gray,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
