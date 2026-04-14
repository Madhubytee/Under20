import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGroceryList } from '@/context/GroceryListContext';
import { usePantry } from '@/context/PantryContext';
import { C } from '@/constants/theme';

type UndoState = {
  item: string;
  timeoutId: ReturnType<typeof setTimeout>;
} | null;

export default function GroceryScreen() {
  const { groceryList, removeFromGrocery, addToGrocery, clearGrocery } = useGroceryList();
  const { addToPantry } = usePantry();

  const [undoState, setUndoState] = React.useState<UndoState>(null);
  const toastOpacity = React.useRef(new Animated.Value(0)).current;

  const showToast = () => {
    Animated.timing(toastOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
  };

  const hideToast = () => {
    Animated.timing(toastOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
  };

  // ✓ Bought — move to pantry and remove from list
  const handleBought = (item: string, index: number) => {
    addToPantry(item);
    removeFromGrocery(index);
  };

  // X — remove entirely with undo
  const handleRemove = (item: string, index: number) => {
    if (undoState) clearTimeout(undoState.timeoutId);

    removeFromGrocery(index);

    const timeoutId = setTimeout(() => {
      setUndoState(null);
      hideToast();
    }, 4000);

    setUndoState({ item, timeoutId });
    showToast();
  };

  const handleUndo = () => {
    if (!undoState) return;
    clearTimeout(undoState.timeoutId);
    addToGrocery(undoState.item);
    setUndoState(null);
    hideToast();
  };

  const handleClearAll = () => {
    if (undoState) {
      clearTimeout(undoState.timeoutId);
      setUndoState(null);
      hideToast();
    }
    clearGrocery();
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
          <TouchableOpacity onPress={handleClearAll} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>Clear all</Text>
          </TouchableOpacity>
        )}
      </View>

      {groceryList.length > 0 && (
        <View style={styles.countBar}>
          <Text style={styles.countText}>
            {groceryList.length} item{groceryList.length !== 1 ? 's' : ''}
          </Text>
          <Text style={styles.countHint}> · ✓ bought adds to pantry</Text>
        </View>
      )}

      <FlatList
        data={groceryList}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            {/* Bought → moves to pantry */}
            <TouchableOpacity
              style={styles.boughtBtn}
              onPress={() => handleBought(item, index)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="checkmark-circle-outline" size={26} color={C.medGreen} />
            </TouchableOpacity>

            <Text style={styles.itemText}>{item}</Text>

            {/* X → remove entirely with undo */}
            <TouchableOpacity
              onPress={() => handleRemove(item, index)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle-outline" size={24} color={C.gray} />
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

      {/* Undo toast */}
      {undoState && (
        <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
          <Text style={styles.toastText}>Item removed</Text>
          <TouchableOpacity onPress={handleUndo} style={styles.undoBtn}>
            <Text style={styles.undoBtnText}>Undo</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
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
    paddingTop: 4,
    paddingBottom: 100,
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
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: C.border,
    gap: 12,
  },
  boughtBtn: {
    flexShrink: 0,
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    color: C.text,
    textTransform: 'capitalize',
  },

  // Undo toast
  toast: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: C.darkGreen,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  toastText: {
    color: C.white,
    fontSize: 14,
    fontWeight: '500',
  },
  undoBtn: {
    backgroundColor: C.medGreen,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  undoBtnText: {
    color: C.white,
    fontSize: 13,
    fontWeight: '700',
  },

  // Empty
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
