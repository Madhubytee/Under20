import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar,
} from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />

      {/* Logo / Brand */}
      <View style={styles.hero}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>🍳</Text>
        </View>
        <Text style={styles.appName}>Under 20</Text>
        <Text style={styles.tagline}>Cook something great.{'\n'}In under 20 minutes.</Text>
      </View>

      {/* Feature pills */}
      <View style={styles.features}>
        <View style={styles.pill}>
          <Text style={styles.pillIcon}>⚡</Text>
          <Text style={styles.pillText}>All recipes under 20 min</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillIcon}>🥦</Text>
          <Text style={styles.pillText}>Match your pantry ingredients</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillIcon}>❤️</Text>
          <Text style={styles.pillText}>Save your favorite recipes</Text>
        </View>
      </View>

      {/* CTA */}
      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => navigation.navigate('Pantry')}
        >
          <Text style={styles.startBtnText}>Get Started</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>Add what's in your fridge — we'll do the rest.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    paddingHorizontal: 28,
    justifyContent: 'space-between',
    paddingVertical: 40,
  },

  // Hero
  hero: { alignItems: 'center', marginTop: 20 },
  logoCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#1e1e1e', alignItems: 'center',
    justifyContent: 'center', marginBottom: 20,
    borderWidth: 2, borderColor: '#f5a623',
  },
  logoEmoji: { fontSize: 48 },
  appName: {
    fontSize: 48, fontWeight: '900',
    color: '#f5a623', letterSpacing: -1,
  },
  tagline: {
    fontSize: 18, color: '#ccc', textAlign: 'center',
    marginTop: 12, lineHeight: 26,
  },

  // Features
  features: { gap: 12 },
  pill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1e1e1e', borderRadius: 16,
    paddingVertical: 14, paddingHorizontal: 18, gap: 12,
  },
  pillIcon: { fontSize: 20 },
  pillText: { fontSize: 15, color: '#fff', fontWeight: '500' },

  // Bottom CTA
  bottom: { alignItems: 'center', gap: 14 },
  startBtn: {
    backgroundColor: '#f5a623', borderRadius: 18,
    paddingVertical: 18, width: '100%', alignItems: 'center',
  },
  startBtnText: { fontSize: 18, fontWeight: '800', color: '#000' },
  hint: { fontSize: 13, color: '#555', textAlign: 'center' },
});
