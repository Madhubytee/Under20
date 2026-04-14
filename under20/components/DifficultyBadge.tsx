import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const difficultyMap: Record<string, { bg: string; color: string }> = {
  easy:   { bg: '#ECFDF5', color: '#065F46' },
  medium: { bg: '#FFFBEB', color: '#92400E' },
  hard:   { bg: '#FEF2F2', color: '#991B1B' },
};

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const s = difficultyMap[difficulty] ?? difficultyMap.easy;
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <Text style={[styles.badgeText, { color: s.color }]}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
