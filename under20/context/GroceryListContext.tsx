import React, { createContext, useContext, useState } from 'react';

type GroceryListContextType = {
  groceryList: string[];
  addToGrocery: (item: string) => void;
  removeFromGrocery: (index: number) => void;
  removeManyFromGrocery: (items: string[]) => void;
  clearGrocery: () => void;
  isInGrocery: (item: string) => boolean;
};

const GroceryListContext = createContext<GroceryListContextType>({
  groceryList: [],
  addToGrocery: () => {},
  removeFromGrocery: () => {},
  removeManyFromGrocery: () => {},
  clearGrocery: () => {},
  isInGrocery: () => false,
});

export function GroceryListProvider({ children }: { children: React.ReactNode }) {
  const [groceryList, setGroceryList] = useState<string[]>([]);

  const addToGrocery = (item: string) => {
    const normalized = item.trim().toLowerCase();
    if (!normalized) return;
    setGroceryList(prev => {
      if (prev.includes(normalized)) return prev;
      return [...prev, normalized];
    });
  };

  const removeFromGrocery = (index: number) => {
    setGroceryList(prev => prev.filter((_, i) => i !== index));
  };

  const removeManyFromGrocery = (items: string[]) => {
    const normalized = items.map(i => i.trim().toLowerCase());
    setGroceryList(prev => prev.filter(item => !normalized.includes(item)));
  };

  const clearGrocery = () => setGroceryList([]);

  const isInGrocery = (item: string) =>
    groceryList.includes(item.trim().toLowerCase());

  return (
    <GroceryListContext.Provider
      value={{ groceryList, addToGrocery, removeFromGrocery, removeManyFromGrocery, clearGrocery, isInGrocery }}>
      {children}
    </GroceryListContext.Provider>
  );
}

export const useGroceryList = () => useContext(GroceryListContext);
