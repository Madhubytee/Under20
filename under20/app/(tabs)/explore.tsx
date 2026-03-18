import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
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

function FavoriteCard({
  recipe,
  onRemove,
}: {
  recipe: Recipe;
  onRemove: () => void;
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
          onPress={e => { e.stopPropagation?.(); onRemove(); }}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Ionicons name="heart" size={22} color={C.salmon} />
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

export default function FavoritesScreen() {
  const { favorites, toggleFavorite } = useFavorites();
  const favoriteRecipes = (recipesData as Recipe[]).filter(r => favorites.includes(r.id));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>
          <Text style={styles.logoLight}>saved</Text>
          <Text style={styles.logoAccent}> recipes</Text>
        </Text>
        <Text style={styles.tagline}>Your favorites, all in one place.</Text>
      </View>

      {favoriteRecipes.length > 0 && (
        <View style={styles.resultsBar}>
          <Text style={styles.resultsCount}>
            {favoriteRecipes.length} saved
          </Text>
          <Text style={styles.resultsLabel}>— tap heart to remove</Text>
        </View>
      )}

      <FlatList
        data={favoriteRecipes}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <FavoriteCard
            recipe={item}
            onRemove={() => toggleFavorite(item.id)}
          />
        )}
        contentContainerStyle={
          favoriteRecipes.length === 0 ? styles.emptyContainer : styles.list
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={48} color={C.border} />
            <Text style={styles.emptyTitle}>No saved recipes yet</Text>
            <Text style={styles.emptySub}>
              Tap the heart on any recipe to save it here.
            </Text>
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

  // Header
  header: {
    backgroundColor: C.cream,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  logo: {
    fontSize: 28,
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

  // Results bar
  resultsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  resultsCount: {
    fontSize: 13,
    fontWeight: '700',
    color: C.darkGreen,
  },
  resultsLabel: {
    fontSize: 13,
    color: C.gray,
  },

  // List
  list: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  emptyContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },

  // Card
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

  // Empty
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: C.text,
  },
  emptySub: {
    fontSize: 14,
    color: C.gray,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 20,
  },
});
