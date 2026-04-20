import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MAX_RECENT = 10;
const STORAGE_KEY = '@under20_recently_viewed';

type RecentlyViewedContextType = {
  recentIds: number[];
  addRecentlyViewed: (id: number) => void;
  clearRecentlyViewed: () => void;
};

const RecentlyViewedContext = createContext<RecentlyViewedContextType>({
  recentIds: [],
  addRecentlyViewed: () => {},
  clearRecentlyViewed: () => {},
});

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [recentIds, setRecentIds] = useState<number[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(val => {
      if (val) setRecentIds(JSON.parse(val));
    });
  }, []);

  const addRecentlyViewed = (id: number) => {
    setRecentIds(prev => {
      const filtered = prev.filter(x => x !== id);
      const next = [id, ...filtered].slice(0, MAX_RECENT);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clearRecentlyViewed = () => {
    setRecentIds([]);
    AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <RecentlyViewedContext.Provider value={{ recentIds, addRecentlyViewed, clearRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export const useRecentlyViewed = () => useContext(RecentlyViewedContext);
