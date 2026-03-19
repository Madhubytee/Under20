import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFavorites } from '@/context/FavoritesContext';
import recipesData from '@/data/recipes.json';

const C = {
  darkGreen: '#1B4332',
  medGreen: '#52B788',
  salmon: '#E76F51',
  cream: '#FAF7F0',
  white: '#FFFFFF',
  gray: '#6B7280',
  border: '#E7E5E4',
  text: '#111827',
};

type Recipe = {
  id: number;
  name: string;
  ingredients: string[];
  cookTime: number;
  calories: number;
  protein: number;
  difficulty: string;
};

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    easy:   { bg: '#ECFDF5', color: '#065F46' },
    medium: { bg: '#FFFBEB', color: '#92400E' },
    hard:   { bg: '#FEF2F2', color: '#991B1B' },
  };
  const s = map[difficulty] ?? map.easy;
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <Text style={[styles.badgeText, { color: s.color }]}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </Text>
    </View>
  );
}

function RecipeCard({
  recipe,
  onToggleFavorite,
  isFav,
}: {
  recipe: Recipe;
  onToggleFavorite: () => void;
  isFav: boolean;
}) {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: recipe.id } })}
      activeOpacity={0.88}>
      <View style={styles.cardTop}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {recipe.name}
        </Text>
        <TouchableOpacity
          onPress={e => { e.stopPropagation?.(); onToggleFavorite(); }}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={22}
            color={isFav ? C.salmon : C.gray}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.statLine}>
        {recipe.cookTime} min  ·  {recipe.calories} kcal  ·  {recipe.protein}g protein
      </Text>

      <View style={styles.cardBottom}>
        <DifficultyBadge difficulty={recipe.difficulty} />
        <Text style={styles.ingCount}>{recipe.ingredients.length} ingredients</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function RecipesScreen() {
  const [input, setInput] = React.useState("");
  const [pantry, setPantry] = React.useState<string[]>([]);

  const { toggleFavorite, isFavorite } = useFavorites();

  const addIngredient = () => {
    if (!input.trim()) return;
    setPantry([...pantry, input.trim().toLowerCase()]);
    setInput("");
  };

  const allRecipes = recipesData as Recipe[];

  let recipes = allRecipes;

if (pantry.length > 0) {
  recipes = allRecipes
    .map(recipe => {
      const recipeIngredients = recipe.ingredients.map(i =>
        i.toLowerCase()
      );

      let matchCount = 0;

      pantry.forEach(p => {
        if (recipeIngredients.some(i => i.includes(p))) {
          matchCount++;
        }
      });

      return { ...recipe, matchCount };
    })
    .filter(recipe => recipe.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount);
} 

  console.log("PANTRY:", pantry);
  console.log("RECIPES SHOWN:", recipes.length);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/under20text.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
        <TextInput
          placeholder="Add ingredient (e.g. egg)"
          value={input}
          onChangeText={setInput}
          style={{
            borderWidth: 1,
            borderColor: "#E7E5E4",
            borderRadius: 10,
            padding: 10,
            marginBottom: 8,
            backgroundColor: "white"
          }}
        />

        <TouchableOpacity
          onPress={addIngredient}
          style={{
            backgroundColor: "#52B788",
            padding: 10,
            borderRadius: 10,
            alignItems: "center",
            marginBottom: 10
          }}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>
            Add Ingredient
          </Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 12, color: "#6B7280" }}>
          Pantry: {pantry.join(", ")}
        </Text>
      </View>

      <View style={styles.countBar}>
        <Text style={styles.countText}>
          {recipes.length} recipes
        </Text>
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
        contentContainerStyle={styles.list}
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
  logo: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  logoLight: {
    color: C.text,
  },
  logoAccent: {
    color: C.salmon,
  },
  tagline: {
    fontSize: 13,
    color: C.gray,
    fontStyle: 'italic',
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
  list: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  card: {
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: C.text,
    marginRight: 10,
    lineHeight: 22,
  },
  statLine: {
    fontSize: 13,
    color: C.gray,
    marginBottom: 10,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  ingCount: {
    fontSize: 12,
    color: C.gray,
  },
});