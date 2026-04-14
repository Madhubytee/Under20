import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '@/context/FavoritesContext';
import recipesData from '@/data/recipes.json';
import { C } from '@/constants/theme';
import { RecipeCard, cardStyles } from '@/components/RecipeCard';
import { Recipe } from '@/types/recipe';

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
          <Text style={styles.resultsCount}>{favoriteRecipes.length} saved</Text>
          <Text style={styles.resultsLabel}>— tap heart to remove</Text>
        </View>
      )}

      <FlatList
        data={favoriteRecipes}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            isFav={true}
            onToggleFavorite={() => toggleFavorite(item.id)}
          />
        )}
        contentContainerStyle={
          favoriteRecipes.length === 0 ? cardStyles.emptyContainer : cardStyles.list
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={cardStyles.empty}>
            <Ionicons name="heart-outline" size={48} color={C.border} />
            <Text style={cardStyles.emptyTitle}>No saved recipes yet</Text>
            <Text style={cardStyles.emptySub}>
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
});
