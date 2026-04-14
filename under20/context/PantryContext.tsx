import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = '@under20_pantry';

type PantryContextType = {
  pantry: string[];
  addToPantry: (item: string) => void;
  removeFromPantry: (index: number) => void;
};

const PantryContext = createContext<PantryContextType>({
  pantry: [],
  addToPantry: () => {},
  removeFromPantry: () => {},
});

export function PantryProvider({ children }: { children: React.ReactNode }) {
  const [pantry, setPantry] = useState<string[]>([]);

  // Load saved pantry on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(stored => {
      if (stored) setPantry(JSON.parse(stored));
    });
  }, []);

  // Persist whenever pantry changes
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pantry));
  }, [pantry]);

  const addToPantry = (item: string) => {
    const normalized = item.trim().toLowerCase();
    if (!normalized) return;
    setPantry(prev => [...prev, normalized]);
  };

  const removeFromPantry = (index: number) => {
    setPantry(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <PantryContext.Provider value={{ pantry, addToPantry, removeFromPantry }}>
      {children}
    </PantryContext.Provider>
  );
}

export const usePantry = () => useContext(PantryContext);
