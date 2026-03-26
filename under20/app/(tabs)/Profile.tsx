import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const C = {
  darkGreen: '#1B4332',
  medGreen: '#52B788',
  salmon: '#E76F51',
  cream: '#FAF7F0',
  white: '#FFFFFF',
  gray: '#6B7280',
  border: '#E7E5E4',
  text: '#111827',
};

const GOAL_OPTIONS = [
  'Meal prep',
  'Budget-friendly grocery list',
  'Quick meals',
  'High-protein meals',
];

const TIME_OPTIONS = ['Under 10 min', 'Under 20 min'];

export default function ProfileScreen() {
  const [name, setName] = useState('Kayla Inoa');
  const [email, setEmail] = useState('kaylainoa@under20.app');
  const [age, setAge] = useState('21');
  const [height, setHeight] = useState(`5'2"`);
  const [weight, setWeight] = useState('145 lb');
  const [goal, setGoal] = useState('Meal prep');
  const [preferredTime, setPreferredTime] = useState('Under 20 min');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>
          <Text style={styles.logoLight}>your</Text>
          <Text style={styles.logoAccent}> profile</Text>
        </Text>
        <Text style={styles.tagline}>Dummy account details for now.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarWrap}>
          <Ionicons name="person" size={40} color={C.darkGreen} />
        </View>

        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.nameInput}
          placeholder="Your name"
          placeholderTextColor={C.gray}
        />
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.emailInput}
          placeholder="Email"
          placeholderTextColor={C.gray}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Basic Stats</Text>

          <View style={styles.fieldRow}>
            <View style={styles.field}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                value={age}
                onChangeText={setAge}
                style={styles.input}
                placeholder="Age"
                placeholderTextColor={C.gray}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Height</Text>
              <TextInput
                value={height}
                onChangeText={setHeight}
                style={styles.input}
                placeholder="Height"
                placeholderTextColor={C.gray}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Weight</Text>
            <TextInput
              value={weight}
              onChangeText={setWeight}
              style={styles.input}
              placeholder="Weight"
              placeholderTextColor={C.gray}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Why You Use Under20</Text>
          <View style={styles.chipWrap}>
            {GOAL_OPTIONS.map((option) => (
              <Pressable
                key={option}
                onPress={() => setGoal(option)}
                style={[
                  styles.chip,
                  goal === option ? styles.chipActive : styles.chipInactive,
                ]}>
                <Text
                  style={[
                    styles.chipText,
                    goal === option ? styles.chipTextActive : styles.chipTextInactive,
                  ]}>
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Preferred Cooking Time</Text>
          <View style={styles.chipWrap}>
            {TIME_OPTIONS.map((option) => (
              <Pressable
                key={option}
                onPress={() => setPreferredTime(option)}
                style={[
                  styles.chip,
                  preferredTime === option ? styles.chipActive : styles.chipInactive,
                ]}>
                <Text
                  style={[
                    styles.chipText,
                    preferredTime === option
                      ? styles.chipTextActive
                      : styles.chipTextInactive,
                  ]}>
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.cream,
  },

  // Header
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
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 36,
  },
  avatarWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#E7F6EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  nameInput: {
    width: '100%',
    fontSize: 24,
    fontWeight: '800',
    color: C.text,
    textAlign: 'center',
    paddingVertical: 0,
  },
  emailInput: {
    width: '100%',
    marginTop: 6,
    marginBottom: 24,
    fontSize: 14,
    color: C.gray,
    textAlign: 'center',
    paddingVertical: 0,
  },
  card: {
    width: '100%',
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: C.text,
    marginBottom: 14,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 12,
  },
  field: {
    flex: 1,
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: C.gray,
    marginBottom: 8,
  },
  input: {
    backgroundColor: C.cream,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: C.text,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: '#E7F6EE',
    borderColor: C.medGreen,
  },
  chipInactive: {
    backgroundColor: C.white,
    borderColor: C.border,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  chipTextActive: {
    color: C.darkGreen,
  },
  chipTextInactive: {
    color: C.gray,
  },
  button: {
    width: '100%',
    marginTop: 4,
    backgroundColor: C.darkGreen,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '800',
    color: C.white,
  },
});
