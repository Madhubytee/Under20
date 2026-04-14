import React, { createContext, useContext, useState } from 'react';

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
