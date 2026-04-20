import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { usePantry } from '@/context/PantryContext';
import { detectIngredientsFromImage } from '@/lib/openai';
import { C } from '@/constants/theme';

export default function PantryScreen() {
  const { pantry, addToPantry, removeFromPantry } = usePantry();
  const [scanning, setScanning] = useState(false);
  const [input, setInput] = useState('');

  const handleScanFridge = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera access is required to scan your fridge.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.7,
    });

    if (result.canceled || !result.assets[0].base64) return;

    setScanning(true);
    try {
      const ingredients = await detectIngredientsFromImage(result.assets[0].base64);
      for (const ingredient of ingredients) {
        await addToPantry(ingredient);
      }
      Alert.alert('Done!', `Found ${ingredients.length} ingredient${ingredients.length !== 1 ? 's' : ''} in your fridge.`);
    } catch {
      Alert.alert('Error', 'Could not analyze the image. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  const handleAddManual = async () => {
    if (!input.trim()) return;
    await addToPantry(input.trim());
    setInput('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>
          <Text style={styles.logoLight}>my </Text>
          <Text style={styles.logoAccent}>pantry</Text>
        </Text>
        <Text style={styles.tagline}>What's in your fridge?</Text>
      </View>

      <View style={styles.scanSection}>
        <TouchableOpacity
          style={[styles.scanBtn, scanning && styles.scanBtnDisabled]}
          onPress={handleScanFridge}
          disabled={scanning}
          activeOpacity={0.85}>
          {scanning ? (
            <>
              <ActivityIndicator color={C.white} size="small" />
              <Text style={styles.scanBtnText}>Analyzing fridge...</Text>
            </>
          ) : (
            <>
              <Ionicons name="camera" size={22} color={C.white} />
              <Text style={styles.scanBtnText}>Scan My Fridge</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.manualRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleAddManual}
            returnKeyType="done"
            placeholder="Add ingredient manually"
            placeholderTextColor={C.gray}
            style={styles.textInput}
          />
          <TouchableOpacity onPress={handleAddManual} style={styles.addBtn}>
            <Ionicons name="add" size={22} color={C.white} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.pantrySection}>
        <View style={styles.pantryHeader}>
          <Text style={styles.pantryTitle}>
            {pantry.length} ingredient{pantry.length !== 1 ? 's' : ''} in pantry
          </Text>
          {pantry.length > 0 && (
            <TouchableOpacity onPress={() => pantry.forEach((_, i) => removeFromPantry(0))}>
              <Text style={styles.clearAll}>Clear all</Text>
            </TouchableOpacity>
          )}
        </View>

        {pantry.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="nutrition-outline" size={48} color={C.border} />
            <Text style={styles.emptyTitle}>Pantry is empty</Text>
            <Text style={styles.emptySub}>Scan your fridge or add ingredients manually.</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.chipContainer}>
            {pantry.map((item, index) => (
              <View key={index} style={styles.chip}>
                <Text style={styles.chipText}>{item}</Text>
                <TouchableOpacity
                  onPress={() => removeFromPantry(index)}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                  <Ionicons name="close-circle" size={16} color={C.medGreen} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.cream,
  },
  header: {
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
  scanSection: {
    padding: 20,
    gap: 12,
  },
  scanBtn: {
    backgroundColor: C.darkGreen,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  scanBtnDisabled: {
    opacity: 0.7,
  },
  scanBtnText: {
    color: C.white,
    fontSize: 15,
    fontWeight: '700',
  },
  manualRow: {
    flexDirection: 'row',
    gap: 8,
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
  divider: {
    height: 1,
    backgroundColor: C.border,
    marginHorizontal: 20,
  },
  pantrySection: {
    flex: 1,
    padding: 20,
  },
  pantryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  pantryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: C.darkGreen,
  },
  clearAll: {
    fontSize: 13,
    color: C.salmon,
    fontWeight: '600',
  },
  chipContainer: {
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
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 13,
    color: C.darkGreen,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
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
  },
});
