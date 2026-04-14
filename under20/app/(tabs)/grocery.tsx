import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGroceryList } from '@/context/GroceryListContext';
import { usePantry } from '@/context/PantryContext';

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

export default function GroceryScreen() {
  const { groceryList, removeFromGrocery, clearGrocery } = useGroceryList();
  const { addToPantry } = usePantry();

  const moveToastMsg = React.useRef<string | null>(null);

  const handleMoveToParty = (item: string, index: number) => {
    addToPantry(item);
    removeFromGrocery(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>
            <Text style={styles.logoLight}>grocery</Text>
            <Text style={styles.logoAccent}> list</Text>
          </Text>
          <Text style={styles.tagline}>Items you need to pick up.</Text>
        </View>
        {groceryList.length > 0 && (
          <TouchableOpacity onPress={clearGrocery} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>Clear all</Text>
          </TouchableOpacity>
        )}
      </View>

      {groceryList.length > 0 && (
        <View style={styles.countBar}>
          <Text style={styles.countText}>{groceryList.length} item{groceryList.length !== 1 ? 's' : ''}</Text>
          <Text style={styles.countHint}> · tap check to move to pantry</Text>
        </View>
      )}

      <FlatList
        data={groceryList}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.checkBtn}
              onPress={() => handleMoveToParty(item, index)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="checkmark-circle-outline" size={24} color={C.medGreen} />
            </TouchableOpacity>
            <Text style={styles.itemText}>{item}</Text>
            <TouchableOpacity
              onPress={() => removeFromGrocery(index)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle-outline" size={22} color={C.gray} />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={
          groceryList.length === 0 ? styles.emptyContainer : styles.list
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="cart-outline" size={52} color={C.border} />
            <Text style={styles.emptyTitle}>Your grocery list is empty</Text>
            <Text style={styles.emptySub}>
              Open a recipe, tap "Need more items?" and add missing ingredients here.
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
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
    color: C.medGreen,
  },
  tagline: {
    fontSize: 13,
    color: C.gray,
    fontStyle: 'italic',
  },
  clearBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
  },
  clearBtnText: {
    fontSize: 13,
    color: C.salmon,
    fontWeight: '600',
  },
  countBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  countText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.darkGreen,
  },
  countHint: {
    fontSize: 13,
    color: C.gray,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  emptyContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: C.border,
    gap: 12,
  },
  checkBtn: {
    flexShrink: 0,
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    color: C.text,
    textTransform: 'capitalize',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
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
    lineHeight: 20,
  },
});
