import React, { createContext, useContext } from 'react';
import { supabase } from '@/lib/supabase';
import { useUserTable } from '@/hooks/useUserTable';

type FavoriteRow = { id: string; recipe_id: number };

type FavoritesContextType = {
  favorites: number[];
  toggleFavorite: (id: number) => Promise<void>;
  isFavorite: (id: number) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  toggleFavorite: async () => {},
  isFavorite: () => false,
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { userId, rows, setRows } = useUserTable<FavoriteRow>('favorites', 'id, recipe_id');

  const toggleFavorite = async (recipeId: number) => {
    if (!userId) return;
    const existing = rows.find(r => r.recipe_id === recipeId);
    if (existing) {
      const { error } = await supabase.from('favorites').delete().eq('id', existing.id);
      if (!error) setRows(prev => prev.filter(r => r.id !== existing.id));
    } else {
      const { data, error } = await supabase
        .from('favorites')
        .insert({ user_id: userId, recipe_id: recipeId })
        .select('id, recipe_id')
        .single();
      if (!error && data) setRows(prev => [...prev, data]);
    }
  };

  const isFavorite = (id: number) => rows.some(r => r.recipe_id === id);

  return (
    <FavoritesContext.Provider value={{ favorites: rows.map(r => r.recipe_id), toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
