import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFavorites } from '@/context/FavoritesContext';
import recipesData from '@/data/recipes.json';

const C = {
  darkGreen: '#1B4332',
  medGreen: '#52B788',
  salmon: '#E76F51',
  cream: '#FAF7F0',
  white: '#FFFFFF',
  gray: '#6B7280',
  lightGray: '#F5F5F4',
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
  steps: string[];
};

const difficultyMap: Record<string, { bg: string; color: string }> = {
  easy:   { bg: '#ECFDF5', color: '#065F46' },
  medium: { bg: '#FFFBEB', color: '#92400E' },
  hard:   { bg: '#FEF2F2', color: '#991B1B' },
};

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useFavorites();

  const recipe = (recipesData as Recipe[]).find(r => r.id === Number(id));

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Recipe not found.</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backPill}>
            <Text style={styles.backPillText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isFav = isFavorite(recipe.id);
  const diff = difficultyMap[recipe.difficulty] ?? difficultyMap.easy;

  return (
    <SafeAreaView style={styles.container}>
      {/* Nav bar */}
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBack}>
          <Ionicons name="arrow-back" size={20} color={C.text} />
          <Text style={styles.navBackText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleFavorite(recipe.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={24}
            color={isFav ? C.salmon : C.gray}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.titleSection}>
          <View style={[styles.diffBadge, { backgroundColor: diff.bg }]}>
            <Text style={[styles.diffBadgeText, { color: diff.color }]}>
              {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
            </Text>
          </View>
          <Text style={styles.recipeName}>{recipe.name}</Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{recipe.cookTime}</Text>
            <Text style={styles.statLabel}>minutes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{recipe.calories}</Text>
            <Text style={styles.statLabel}>calories</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{recipe.protein}g</Text>
            <Text style={styles.statLabel}>protein</Text>
          </View>
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <Text style={styles.sectionCount}>{recipe.ingredients.length} items</Text>
          </View>
          {recipe.ingredients.map((ing, i) => (
            <View key={i} style={styles.ingRow}>
              <View style={styles.ingDot} />
              <Text style={styles.ingText}>{ing}</Text>
            </View>
          ))}
        </View>

        {/* Steps */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <Text style={styles.sectionCount}>{recipe.steps.length} steps</Text>
          </View>
          {recipe.steps.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.cream,
  },

  // Nav
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    backgroundColor: C.cream,
  },
  navBack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  navBackText: {
    fontSize: 15,
    fontWeight: '600',
    color: C.text,
  },

  // Scroll
  scroll: {
    paddingBottom: 48,
  },

  // Title
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 8,
  },
  diffBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  diffBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  recipeName: {
    fontSize: 26,
    fontWeight: '800',
    color: C.text,
    letterSpacing: -0.4,
    lineHeight: 32,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: C.white,
    marginHorizontal: 16,
    borderRadius: 14,
    paddingVertical: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: C.border,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: C.darkGreen,
  },
  statLabel: {
    fontSize: 11,
    color: C.gray,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: C.border,
    marginVertical: 4,
  },

  // Section
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: C.text,
    letterSpacing: -0.2,
  },
  sectionCount: {
    fontSize: 12,
    color: C.gray,
  },

  // Ingredients
  ingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  ingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.medGreen,
    flexShrink: 0,
  },
  ingText: {
    fontSize: 14,
    color: C.text,
    flex: 1,
    lineHeight: 20,
  },

  // Steps
  stepRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  stepNumText: {
    color: C.white,
    fontSize: 12,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: C.text,
    lineHeight: 22,
  },

  // Not found
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  notFoundText: {
    fontSize: 17,
    color: C.gray,
  },
  backPill: {
    backgroundColor: C.darkGreen,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backPillText: {
    color: C.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
