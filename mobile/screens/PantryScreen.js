import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, SafeAreaView, Alert,
} from 'react-native';
import axios from 'axios';
import { API_BASE } from '../config';

export default function PantryScreen({ navigation }) {
  const [input, setInput] = useState('');
  const [pantry, setPantry] = useState([]);
  const [loading, setLoading] = useState(false);

  function addIngredient() {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return;
    if (pantry.includes(trimmed)) {
      Alert.alert('Already added', `"${trimmed}" is already in your pantry.`);
      return;
    }
    setPantry([...pantry, trimmed]);
    setInput('');
  }

  function removeIngredient(item) {
    setPantry(pantry.filter(i => i !== item));
  }

  async function findRecipes() {
    if (pantry.length === 0) {
      Alert.alert('Empty pantry', 'Add at least one ingredient first.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/recipes/search`, { ingredients: pantry });
      navigation.navigate('Results', { recipes: res.data.matched, suggestions: res.data.suggestions, pantry });
    } catch (err) {
      Alert.alert('Error', 'Could not reach the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Under 20</Text>
      <Text style={styles.subtitle}>What's in your pantry?</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="e.g. pasta, garlic, butter"
          placeholderTextColor="#aaa"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={addIngredient}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addBtn} onPress={addIngredient}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={pantry}
        keyExtractor={item => item}
        numColumns={3}
        renderItem={({ item }) => (
          <View style={styles.tag}>
            <Text style={styles.tagText}>{item}</Text>
            <TouchableOpacity onPress={() => removeIngredient(item)}>
              <Text style={styles.tagRemove}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.tagList}
      />

      <TouchableOpacity
        style={[styles.searchBtn, loading && styles.searchBtnDisabled]}
        onPress={findRecipes}
        disabled={loading}
      >
        <Text style={styles.searchBtnText}>
          {loading ? 'Searching...' : 'Find Recipes'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', padding: 20 },
  title: { fontSize: 36, fontWeight: '800', color: '#f5a623', marginTop: 10 },
  subtitle: { fontSize: 16, color: '#aaa', marginBottom: 24 },
  inputRow: { flexDirection: 'row', marginBottom: 16 },
  input: {
    flex: 1, backgroundColor: '#1e1e1e', color: '#fff',
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12,
    fontSize: 16, marginRight: 8,
  },
  addBtn: {
    backgroundColor: '#f5a623', borderRadius: 12,
    paddingHorizontal: 18, justifyContent: 'center',
  },
  addBtnText: { fontSize: 24, color: '#000', fontWeight: '700' },
  tagList: { paddingBottom: 16 },
  tag: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1e1e1e', borderRadius: 20,
    paddingVertical: 6, paddingHorizontal: 12, margin: 4,
  },
  tagText: { color: '#fff', fontSize: 14, marginRight: 6 },
  tagRemove: { color: '#f5a623', fontSize: 14, fontWeight: '700' },
  searchBtn: {
    backgroundColor: '#f5a623', borderRadius: 16,
    paddingVertical: 16, alignItems: 'center', marginTop: 'auto',
  },
  searchBtnDisabled: { opacity: 0.5 },
  searchBtnText: { fontSize: 18, fontWeight: '700', color: '#000' },
});
