import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { C } from '@/constants/theme';
import { DifficultyBadge } from '@/components/DifficultyBadge';
import { Recipe } from '@/types/recipe';

type Props = {
  recipe: Recipe;
  isFav: boolean;
  onToggleFavorite: () => void;
};

export function RecipeCard({ recipe, isFav, onToggleFavorite }: Props) {
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

export const cardStyles = StyleSheet.create({
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
  list: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  emptyContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
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

const styles = StyleSheet.create({
  card: cardStyles.card,
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
  ingCount: {
    fontSize: 12,
    color: C.gray,
  },
});
