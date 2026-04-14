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
import { usePantry } from '@/context/PantryContext';
import { useGroceryList } from '@/context/GroceryListContext';
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
  amber: '#F59E0B',
  amberLight: '#FFFBEB',
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
  const { pantry } = usePantry();
  const { addToGrocery, isInGrocery } = useGroceryList();
  const [missingExpanded, setMissingExpanded] = React.useState(false);

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

  // Compute missing ingredients (only when pantry has items)
  const missingIngredients = pantry.length > 0
    ? recipe.ingredients.filter(ing => {
        const ingLower = ing.toLowerCase();
        return !pantry.some(p => ingLower.includes(p));
      })
    : [];

  const hasMissing = missingIngredients.length > 0;

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
          {recipe.ingredients.map((ing, i) => {
            const ingLower = ing.toLowerCase();
            const inPantry = pantry.length > 0 && pantry.some(p => ingLower.includes(p));
            return (
              <View key={i} style={styles.ingRow}>
                <View style={[styles.ingDot, inPantry && styles.ingDotHave]} />
                <Text style={[styles.ingText, inPantry && styles.ingTextHave]}>{ing}</Text>
                {inPantry && (
                  <Ionicons name="checkmark-circle" size={16} color={C.medGreen} />
                )}
              </View>
            );
          })}

          {/* Pantry legend */}
          {pantry.length > 0 && (
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.ingDot, styles.ingDotHave]} />
                <Text style={styles.legendText}>in your pantry</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={styles.ingDot} />
                <Text style={styles.legendText}>not in pantry</Text>
              </View>
            </View>
          )}
        </View>

        {/* Need more items? */}
        {pantry.length > 0 && hasMissing && (
          <View style={styles.missingSection}>
            <TouchableOpacity
              style={styles.missingToggleBtn}
              onPress={() => setMissingExpanded(prev => !prev)}
              activeOpacity={0.8}>
              <View style={styles.missingToggleLeft}>
                <Ionicons name="cart-outline" size={18} color={C.amber} />
                <Text style={styles.missingToggleText}>
                  Need more items?
                </Text>
                <View style={styles.missingBadge}>
                  <Text style={styles.missingBadgeText}>{missingIngredients.length}</Text>
                </View>
              </View>
              <Ionicons
                name={missingExpanded ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={C.amber}
              />
            </TouchableOpacity>

            {missingExpanded && (
              <View style={styles.missingList}>
                <Text style={styles.missingSubtitle}>
                  These ingredients aren't in your pantry yet:
                </Text>

                {missingIngredients.map((ing, i) => {
                  const added = isInGrocery(ing);
                  return (
                    <View key={i} style={styles.missingRow}>
                      <Text style={styles.missingIngText} numberOfLines={2}>{ing}</Text>
                      <TouchableOpacity
                        style={[styles.addBtn, added && styles.addBtnAdded]}
                        onPress={() => addToGrocery(ing)}
                        disabled={added}>
                        <Ionicons
                          name={added ? 'checkmark' : 'add'}
                          size={14}
                          color={added ? C.medGreen : C.white}
                        />
                        <Text style={[styles.addBtnText, added && styles.addBtnTextAdded]}>
                          {added ? 'Added' : 'Add to list'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}

                {/* Add all button */}
                {missingIngredients.some(ing => !isInGrocery(ing)) && (
                  <TouchableOpacity
                    style={styles.addAllBtn}
                    onPress={() => missingIngredients.forEach(ing => addToGrocery(ing))}>
                    <Ionicons name="cart" size={16} color={C.white} />
                    <Text style={styles.addAllBtnText}>Add all to grocery list</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}

        {/* All in pantry message */}
        {pantry.length > 0 && !hasMissing && (
          <View style={styles.allGoodBanner}>
            <Ionicons name="checkmark-circle" size={18} color={C.medGreen} />
            <Text style={styles.allGoodText}>You have all the ingredients!</Text>
          </View>
        )}

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
    backgroundColor: C.border,
    flexShrink: 0,
  },
  ingDotHave: {
    backgroundColor: C.medGreen,
  },
  ingText: {
    fontSize: 14,
    color: C.text,
    flex: 1,
    lineHeight: 20,
  },
  ingTextHave: {
    color: C.darkGreen,
    fontWeight: '500',
  },

  // Legend
  legend: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendText: {
    fontSize: 11,
    color: C.gray,
  },

  // Missing section
  missingSection: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: C.amberLight,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    overflow: 'hidden',
  },
  missingToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  missingToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  missingToggleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
  },
  missingBadge: {
    backgroundColor: C.amber,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
  missingBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: C.white,
  },
  missingList: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: '#FDE68A',
  },
  missingSubtitle: {
    fontSize: 12,
    color: '#92400E',
    marginBottom: 10,
    marginTop: 10,
  },
  missingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
    gap: 10,
  },
  missingIngText: {
    flex: 1,
    fontSize: 13,
    color: C.text,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: C.darkGreen,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  addBtnAdded: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: C.medGreen,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.white,
  },
  addBtnTextAdded: {
    color: C.medGreen,
  },
  addAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: C.darkGreen,
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 12,
  },
  addAllBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.white,
  },

  // All good banner
  allGoodBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  allGoodText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#065F46',
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
