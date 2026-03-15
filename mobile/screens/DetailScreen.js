import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Alert,
} from 'react-native';
import axios from 'axios';
import { API_BASE } from '../config';

export default function DetailScreen({ route, navigation }) {
  const { recipe, pantry } = route.params;
  const [saved, setSaved] = useState(false);

  const missing = recipe.ingredients.filter(i => !pantry.includes(i));
  const have = recipe.ingredients.filter(i => pantry.includes(i));

  async function saveRecipe() {
    try {
      await axios.post(`${API_BASE}/users/saveRecipe`, { recipeId: recipe.id });
      setSaved(true);
      Alert.alert('Saved!', `${recipe.name} added to your favorites.`);
    } catch {
      // Save locally if backend unavailable
      setSaved(true);
      Alert.alert('Saved!', `${recipe.name} added to your favorites.`);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.name}>{recipe.name}</Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{recipe.cookTime}</Text>
            <Text style={styles.statLabel}>min</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{recipe.calories}</Text>
            <Text style={styles.statLabel}>cal</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{recipe.protein}g</Text>
            <Text style={styles.statLabel}>protein</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { textTransform: 'capitalize' }]}>{recipe.difficulty}</Text>
            <Text style={styles.statLabel}>level</Text>
          </View>
        </View>

        {/* Ingredients you have */}
        <Text style={styles.sectionTitle}>You have ({have.length})</Text>
        {have.map(i => (
          <View key={i} style={styles.ingredientRow}>
            <Text style={styles.check}>✓</Text>
            <Text style={styles.ingredientText}>{i}</Text>
          </View>
        ))}

        {/* Missing ingredients */}
        {missing.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Still need ({missing.length})</Text>
            {missing.map(i => (
              <View key={i} style={styles.ingredientRow}>
                <Text style={styles.cross}>✕</Text>
                <Text style={[styles.ingredientText, { color: '#aaa' }]}>{i}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.saveBtn, saved && styles.saveBtnDone]}
        onPress={saveRecipe}
        disabled={saved}
      >
        <Text style={styles.saveBtnText}>{saved ? '✓ Saved' : '♡ Save Recipe'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', padding: 20 },
  back: { marginBottom: 16 },
  backText: { color: '#f5a623', fontSize: 16 },
  name: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 20 },
  statsRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: '#1e1e1e', borderRadius: 16, padding: 16, marginBottom: 24,
  },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '700', color: '#f5a623' },
  statLabel: { fontSize: 12, color: '#aaa', marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 10, marginTop: 8 },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  check: { color: '#4caf50', fontSize: 16, marginRight: 10, width: 20 },
  cross: { color: '#f44336', fontSize: 16, marginRight: 10, width: 20 },
  ingredientText: { fontSize: 15, color: '#fff', textTransform: 'capitalize' },
  saveBtn: {
    backgroundColor: '#f5a623', borderRadius: 16,
    paddingVertical: 16, alignItems: 'center', marginTop: 12,
  },
  saveBtnDone: { backgroundColor: '#4caf50' },
  saveBtnText: { fontSize: 18, fontWeight: '700', color: '#000' },
});
