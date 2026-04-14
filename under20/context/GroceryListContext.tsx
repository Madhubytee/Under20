import React, { createContext, useContext } from 'react';
import { supabase } from '@/lib/supabase';
import { useUserTable } from '@/hooks/useUserTable';

type GroceryRow = { id: string; item: string };

type GroceryListContextType = {
  groceryList: string[];
  addToGrocery: (item: string) => Promise<void>;
  removeFromGrocery: (index: number) => Promise<void>;
  removeManyFromGrocery: (items: string[]) => Promise<void>;
  clearGrocery: () => Promise<void>;
  isInGrocery: (item: string) => boolean;
};

const GroceryListContext = createContext<GroceryListContextType>({
  groceryList: [],
  addToGrocery: async () => {},
  removeFromGrocery: async () => {},
  removeManyFromGrocery: async () => {},
  clearGrocery: async () => {},
  isInGrocery: () => false,
});

export function GroceryListProvider({ children }: { children: React.ReactNode }) {
  const { userId, rows, setRows } = useUserTable<GroceryRow>('grocery_items', 'id, item');

  const addToGrocery = async (item: string) => {
    const normalized = item.trim().toLowerCase();
    if (!normalized || !userId) return;
    if (rows.some(r => r.item === normalized)) return;
    const { data, error } = await supabase
      .from('grocery_items')
      .insert({ user_id: userId, item: normalized })
      .select('id, item')
      .single();
    if (!error && data) setRows(prev => [...prev, data]);
  };

  const removeFromGrocery = async (index: number) => {
    const row = rows[index];
    if (!row) return;
    const { error } = await supabase.from('grocery_items').delete().eq('id', row.id);
    if (!error) setRows(prev => prev.filter((_, i) => i !== index));
  };

  const removeManyFromGrocery = async (items: string[]) => {
    if (!userId) return;
    const normalized = items.map(i => i.trim().toLowerCase());
    const ids = rows.filter(r => normalized.includes(r.item)).map(r => r.id);
    if (!ids.length) return;
    const { error } = await supabase.from('grocery_items').delete().in('id', ids);
    if (!error) setRows(prev => prev.filter(r => !ids.includes(r.id)));
  };

  const clearGrocery = async () => {
    if (!userId) return;
    const { error } = await supabase.from('grocery_items').delete().eq('user_id', userId);
    if (!error) setRows([]);
  };

  const isInGrocery = (item: string) =>
    rows.some(r => r.item === item.trim().toLowerCase());

  return (
    <GroceryListContext.Provider
      value={{ groceryList: rows.map(r => r.item), addToGrocery, removeFromGrocery, removeManyFromGrocery, clearGrocery, isInGrocery }}>
      {children}
    </GroceryListContext.Provider>
  );
}

export const useGroceryList = () => useContext(GroceryListContext);
