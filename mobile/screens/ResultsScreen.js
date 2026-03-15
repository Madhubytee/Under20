import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native';

const DIFFICULTY_COLOR = { easy: '#4caf50', medium: '#ff9800', hard: '#f44336' };

function RecipeCard({ item, pantry, navigation, dimmed }) {
  return (
    <TouchableOpacity
      style={[styles.card, dimmed && styles.cardDimmed]}
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
        <Text style={styles.metaText}>{item.calories} cal</Text>
        <Text style={styles.metaText}>{item.protein}g protein</Text>
      </View>
      {dimmed && item.missingIngredients?.length > 0 && (
        <Text style={styles.missing}>
          Missing: {item.missingIngredients.join(', ')}
        </Text>
      )}
    </TouchableOpacity>
  );
}

export default function ResultsScreen({ route, navigation }) {
  const { recipes = [], suggestions = [], pantry } = route.params;

  const sections = [
    ...recipes.map(r => ({ ...r, _type: 'match' })),
    ...(recipes.length === 0 ? suggestions.map(r => ({ ...r, _type: 'suggest' })) : []),
  ];

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {recipes.length > 0 ? (
        <Text style={styles.title}>{recipes.length} Recipe{recipes.length !== 1 ? 's' : ''} Found</Text>
      ) : (
        <Text style={styles.title}>No Exact Matches</Text>
      )}
      <Text style={styles.subtitle}>
        {recipes.length > 0 ? 'All under 20 minutes' : suggestions.length > 0 ? 'Close matches — just a few ingredients away' : 'Try adding more ingredients'}
      </Text>

      <FlatList
        data={sections}
        keyExtractor={item => String(item.id) + item._type}
        renderItem={({ item }) => (
          <RecipeCard
            item={item}
            pantry={pantry}
            navigation={navigation}
            dimmed={item._type === 'suggest'}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.empty}>Add more ingredients and try again.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', padding: 20 },
  back: { marginBottom: 8 },
  backText: { color: '#f5a623', fontSize: 16 },
  title: { fontSize: 28, fontWeight: '800', color: '#f5a623', marginTop: 4 },
  subtitle: { fontSize: 14, color: '#aaa', marginBottom: 20 },
  card: {
    backgroundColor: '#1e1e1e', borderRadius: 16,
    padding: 16, marginBottom: 12,
  },
  cardDimmed: { opacity: 0.7, borderWidth: 1, borderColor: '#333' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardName: { fontSize: 18, fontWeight: '700', color: '#fff', flex: 1 },
  cookTime: { fontSize: 14, color: '#f5a623', fontWeight: '600' },
  cardMeta: { flexDirection: 'row', gap: 12, marginVertical: 8 },
  difficulty: { fontSize: 13, fontWeight: '600', textTransform: 'capitalize' },
  metaText: { fontSize: 13, color: '#aaa' },
  missing: { fontSize: 12, color: '#f44336', marginTop: 4 },
  empty: { color: '#aaa', textAlign: 'center', marginTop: 40, fontSize: 15 },
});
