import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Redirect, Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { PantryProvider } from '@/context/PantryContext';
import { GroceryListProvider } from '@/context/GroceryListContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { DietaryProvider } from '@/context/DietaryContext';

export const unstable_settings = {
  anchor: 'login',
};

function RootNavigator() {
  const colorScheme = useColorScheme();
  const { session, loading } = useAuth();
  const segments = useSegments();

  if (loading) return null;

  const inTabs = segments[0] === '(tabs)';
  const inRecipe = segments[0] === 'recipe';
  const inProtectedRoute = inTabs || inRecipe;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="recipe/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>

      {!session && inProtectedRoute && <Redirect href={'/login' as any} />}
      {session && !inProtectedRoute && <Redirect href="/(tabs)" />}

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <DietaryProvider>
        <GroceryListProvider>
          <PantryProvider>
            <FavoritesProvider>
              <RootNavigator />
            </FavoritesProvider>
          </PantryProvider>
        </GroceryListProvider>
      </DietaryProvider>
    </AuthProvider>
  );
}
