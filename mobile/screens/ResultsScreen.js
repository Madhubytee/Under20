import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native';

const DIFFICULTY_COLOR = { easy: '#4caf50', medium: '#ff9800', hard: '#f44336' };

export default function ResultsScreen({ route, navigation }) {
  const { recipes, pantry } = route.params;

  if (recipes.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>No Matches</Text>
        <Text style={styles.subtitle}>
          Try adding more ingredients to your pantry.
        </Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Back to Pantry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{recipes.length} Recipe{recipes.length > 1 ? 's' : ''} Found</Text>
      <Text style={styles.subtitle}>All under 20 minutes</Text>

      <FlatList
        data={recipes}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Detail', { recipe: item, pantry })}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cookTime}>{item.cookTime} min</Text>
            </View>

            <View style={styles.cardMeta}>
              <Text style={[styles.difficulty, { color: DIFFICULTY_COLOR[item.difficulty] || '#aaa' }]}>
                {item.difficulty}
              </Text>
              <Text style={styles.calorie}>{item.calories} cal</Text>
              <Text style={styles.protein}>{item.protein}g protein</Text>
            </View>

            <Text style={styles.ingredients} numberOfLines={2}>
              {item.ingredients.join(', ')}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', padding: 20 },
  title: { fontSize: 28, fontWeight: '800', color: '#f5a623', marginTop: 10 },
  subtitle: { fontSize: 14, color: '#aaa', marginBottom: 20 },
  card: {
    backgroundColor: '#1e1e1e', borderRadius: 16,
    padding: 16, marginBottom: 12,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardName: { fontSize: 18, fontWeight: '700', color: '#fff', flex: 1 },
  cookTime: { fontSize: 14, color: '#f5a623', fontWeight: '600' },
  cardMeta: { flexDirection: 'row', gap: 12, marginVertical: 8 },
  difficulty: { fontSize: 13, fontWeight: '600', textTransform: 'capitalize' },
  calorie: { fontSize: 13, color: '#aaa' },
  protein: { fontSize: 13, color: '#aaa' },
  ingredients: { fontSize: 13, color: '#666', marginTop: 4 },
  backBtn: {
    backgroundColor: '#f5a623', borderRadius: 16,
    paddingVertical: 14, alignItems: 'center', marginTop: 24,
  },
  backBtnText: { fontSize: 16, fontWeight: '700', color: '#000' },
});
