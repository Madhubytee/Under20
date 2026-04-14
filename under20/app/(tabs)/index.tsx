import { useFavorites } from '@/context/FavoritesContext';
import { usePantry } from '@/context/PantryContext';
import recipesData from '@/data/recipes.json';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '@/constants/theme';
import { RecipeCard, cardStyles } from '@/components/RecipeCard';
import { Recipe } from '@/types/recipe';

export default function RecipesScreen() {
  const [input, setInput] = React.useState("");
  const { pantry, addToPantry, removeFromPantry } = usePantry();
  const { toggleFavorite, isFavorite } = useFavorites();

  const addIngredient = () => {
    if (!input.trim()) return;
    addToPantry(input.trim());
    setInput("");
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/under20text.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <TextInput
            placeholder="Add ingredient (e.g. egg)"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={addIngredient}
            returnKeyType="done"
            style={styles.textInput}
          />
          <TouchableOpacity onPress={addIngredient} style={styles.addBtn}>
            <Ionicons name="add" size={22} color={C.white} />
          </TouchableOpacity>
        </View>

        {pantry.length > 0 && (
          <View style={styles.chipRow}>
            {pantry.map((item, index) => (
              <View key={index} style={styles.chip}>
                <Text style={styles.chipText}>{item}</Text>
                <TouchableOpacity
                  onPress={() => removeFromPantry(index)}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                  <Ionicons name="close-circle" size={15} color={C.medGreen} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {pantry.length === 0 && (
          <Text style={styles.pantryEmpty}>Add ingredients to filter recipes</Text>
        )}
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
  countBar: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  countText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.darkGreen,
  },
  inputSection: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: C.white,
    fontSize: 14,
    color: C.text,
  },
  addBtn: {
    backgroundColor: C.medGreen,
    borderRadius: 10,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chipText: {
    fontSize: 13,
    color: C.darkGreen,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  pantryEmpty: {
    fontSize: 13,
    color: C.gray,
    fontStyle: 'italic',
  },
});
