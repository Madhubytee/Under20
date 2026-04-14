import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

type PantryRow = { id: string; item: string };

type PantryContextType = {
  pantry: string[];
  addToPantry: (item: string) => Promise<void>;
  removeFromPantry: (index: number) => Promise<void>;
};

const PantryContext = createContext<PantryContextType>({
  pantry: [],
  addToPantry: async () => {},
  removeFromPantry: async () => {},
});

export function PantryProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;
  const [rows, setRows] = useState<PantryRow[]>([]);

  useEffect(() => {
    if (!userId) {
      setRows([]);
      return;
    }
    supabase
      .from('pantry_items')
      .select('id, item')
      .eq('user_id', userId)
      .order('created_at')
      .then(({ data }) => setRows(data ?? []));
  }, [userId]);

  const addToPantry = async (item: string) => {
    const normalized = item.trim().toLowerCase();
    if (!normalized || !userId) return;
    const { data, error } = await supabase
      .from('pantry_items')
      .insert({ user_id: userId, item: normalized })
      .select('id, item')
      .single();
    if (!error && data) setRows(prev => [...prev, data]);
  };

  const removeFromPantry = async (index: number) => {
    const row = rows[index];
    if (!row) return;
    const { error } = await supabase.from('pantry_items').delete().eq('id', row.id);
    if (!error) setRows(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <PantryContext.Provider value={{ pantry: rows.map(r => r.item), addToPantry, removeFromPantry }}>
      {children}
    </PantryContext.Provider>
  );
}

export const usePantry = () => useContext(PantryContext);
