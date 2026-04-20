import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type DietaryPrefs = {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
};

const DEFAULT: DietaryPrefs = {
  vegetarian: false,
  vegan: false,
  glutenFree: false,
  dairyFree: false,
};

type DietaryContextType = {
  dietary: DietaryPrefs;
  toggleDiet: (key: keyof DietaryPrefs) => void;
};

const DietaryContext = createContext<DietaryContextType>({
  dietary: DEFAULT,
  toggleDiet: () => {},
});

const STORAGE_KEY = '@under20_dietary';

export function DietaryProvider({ children }: { children: React.ReactNode }) {
  const [dietary, setDietary] = useState<DietaryPrefs>(DEFAULT);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(val => {
      if (val) setDietary(JSON.parse(val));
    });
  }, []);

  const toggleDiet = (key: keyof DietaryPrefs) => {
    setDietary(prev => {
      const next = { ...prev, [key]: !prev[key] };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <DietaryContext.Provider value={{ dietary, toggleDiet }}>
      {children}
    </DietaryContext.Provider>
  );
}

export const useDietary = () => useContext(DietaryContext);
